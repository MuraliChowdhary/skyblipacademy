import { registerUser } from "@/src/backend/services/user.service";
import { AppError } from "@/src/lib/errors";
import { prisma } from "@/src/lib/prisma";
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";


// Requires TEST_DATABASE_URL pointed at a real Postgres (see
// docker-compose.yml) with migrations applied — this is deliberately an
// integration test masquerading as a unit test, because the thing being
// tested (the unique-constraint race) does not exist against a mock.

describe("registerUser", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("rejects a duplicate email with a clean AppError", async () => {
    const input = {
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "correct-horse-battery",
    };

    await registerUser(input);
    await expect(registerUser(input)).rejects.toMatchObject(
      new AppError("EMAIL_TAKEN", "", 409),
    );
  });

  it("under concurrent identical signups, exactly one succeeds", async () => {
    const input = {
      name: "Grace Hopper",
      email: "grace@example.com",
      password: "correct-horse-battery",
    };

    const results = await Promise.allSettled([
      registerUser(input),
      registerUser(input),
      registerUser(input),
    ]);

    const fulfilled = results.filter((r) => r.status === "fulfilled");
    const rejected = results.filter((r) => r.status === "rejected");

    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(2);

    const userCount = await prisma.user.count({
      where: { email: input.email },
    });
    expect(userCount).toBe(1);
  });
});
