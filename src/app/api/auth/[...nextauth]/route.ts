

// Auth.js v5 exposes GET/POST handlers directly — this file stays this
// thin on purpose. All actual config (provider, callbacks, adapter)
// lives in lib/auth.ts so it's importable elsewhere (e.g. `auth()` in

import { handlers } from "@/src/lib/auth";

// server components, or from the purchase route to check the session).
export const { GET, POST } = handlers;