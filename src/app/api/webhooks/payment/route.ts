import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { logger } from "@/src/lib/logger";
import { confirmPayment } from "@/src/backend/services/enrollment.service";

/**
 * Verifies the raw request body against Razorpay's HMAC-SHA256 signature.
 * Must run on the *raw* body — parsing to JSON first and re-stringifying
 * will not reproduce the same bytes Razorpay signed, and the check will
 * fail even for genuine webhooks. `timingSafeEqual` avoids leaking the
 * expected signature through response-time differences.
 */
function isValidSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    logger.error("payment.webhook.missing_secret_env");
    return false;
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/**
 * This route intentionally does NOT use withApiHandler. Webhook callers
 * (Razorpay's servers) don't care about our internal error envelope and
 * will retry on anything other than a 2xx — so failures here return
 * plain 400/500s, and *expected* no-ops (duplicate delivery, unknown
 * event type) still return 200 so the gateway stops retrying something
 * that already succeeded.
 */
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("X-Razorpay-Signature");

  if (!isValidSignature(rawBody, signature)) {
    logger.warn("payment.webhook.invalid_signature");
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event !== "payment.captured") {
    // Not the event we act on — acknowledge so Razorpay doesn't retry it.
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const payment = event.payload?.payment?.entity;
  if (!payment?.order_id || !payment?.id) {
    logger.error({ event }, "payment.webhook.malformed_payload");
    return NextResponse.json({ error: "malformed payload" }, { status: 400 });
  }

  try {
    const order = await confirmPayment(payment.order_id, payment.id);
    logger.info({ orderId: order?.id ?? null }, "payment.webhook.processed");
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    logger.error({ err }, "payment.webhook.unhandled_error");
    // 500 here is correct, not a cop-out: it tells Razorpay to retry,
    // and confirmPayment's compare-and-swap makes retries safe.
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }
}
