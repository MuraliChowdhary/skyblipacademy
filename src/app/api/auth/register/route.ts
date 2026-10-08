
import { registerUser } from "@/src/backend/services/user.service";
import { withApiHandler } from "@/src/lib/api-handler";

// The route itself does no validation, hashing, or error translation —
// that all lives in registerUser + withApiHandler. This route's only
// job is: parse the body, call the service, let the wrapper handle the
// rest. Keeping routes this thin is what makes the service layer

// testable without spinning up HTTP at all (see tests/unit next).
export const POST = withApiHandler(async (req) => {
  const body = await req.json();
  console.log(body)
  return registerUser(body);
});