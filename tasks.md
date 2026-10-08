# TASKS.md

Follow `AGENTS.md`. Do tasks in order, one at a time. For each task: read the listed starting points, plan (max 10 lines), implement, verify against the acceptance criteria, report, then stop and wait for "next".

"Do not change code" means: do not modify anything outside the task's scope, and do not rebuild things marked as already done.

---

## Task 1: Auth security review (report first, fix after approval)

**Goal:** find real flaws in authentication and session handling.

**Check:** password hashing and comparison, session/JWT handling and expiry, cookie flags (`httpOnly`, `secure`, `sameSite`), input validation on login/register, rate limiting on auth routes (known gap), user enumeration in error messages, and role stored/checked from the server-side session rather than client input.

**Output:** a short findings list with severity (P0–P3) and file path. Fix only P0/P1 items that are small and safe, after listing them. Report the rest.

**Acceptance:** findings list delivered; any fix is limited to the listed items; login and register still work.

---

## Task 2: Admin access protection

**Goal:** a non-admin (or logged-out) user can never open admin pages or call admin APIs.

**Do:**
- Find every route under the admin area and every admin API/server action. Confirm each calls `requireAdmin()` or equivalent on the server.
- Add route-level protection (for example middleware or an admin layout check) as a second layer, without breaking existing auth.
- Logged-out users go to login; logged-in non-admins get a 403/redirect to their dashboard.

**Acceptance:** list of every admin route and its guard (table); a USER session gets denied on the admin pages and on admin API calls; an ADMIN session works as before.

---

## Task 3: Password visibility toggle (eye icon)

**Goal:** show/hide password on **both** the login and register pages (and the confirm-password field if present).

**Do:** create one small reusable password input component (using the existing `lucide-react` icons and shadcn input) and use it in both pages. Keep it accessible: a button with `aria-label` ("Show password" / "Hide password"), `type="button"` so it never submits the form.

**Acceptance:** the toggle works on both pages; no form submission on click; layout is unchanged on mobile.

---

## Task 4: Google OAuth

**Goal:** a "Continue with Google" button on login and register that signs the user in and saves them in the database.

**Do:**
- First identify the auth library in use (for example Auth.js/NextAuth or a custom setup) and extend it. Do not replace it.
- Add the Google provider and the /api/auth/callback/google route required by that library.
- On first sign-in, create the `User` with the data Google returns (name, email, avatar). Make all other profile fields (phone, address, etc.) **optional**. If the schema requires them, make them optional via an additive migration.
- If a user with the same email already exists, link or reuse that account instead of creating a duplicate. Default role must be `USER`.
- Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `.env.example` with placeholders. Do not write real values anywhere.
- Add the button to login and register, with a loading state and an error toast.

**Acceptance:** Google sign-in creates a new user row with only the Google fields; a repeat sign-in reuses it; an existing email does not create a duplicate; the session is the same shape as email/password sessions; a new Google user cannot reach admin pages.

---

## Task 5: Purchase flow with a payment-details pop-up (no gateway)

**Goal:** after the user confirms billing details and the order is created, show a clear payment-instructions pop-up.

**Flow to preserve:** browse courses > view course (syllabus preview) > Buy > billing details dialog > order created > **payment-details pop-up**. The admin approval toggle after verification is **already built; only verify that it still works.**

**Do:** build a `PaymentDetailsDialog` component that shows:
- order reference and amount;
- the platform's UPI ID and contact details (read from a single config/constant or env value, so they can be changed in one place; use placeholders if unknown);
- this message (you may polish the wording): *"We ensure your safety. Your order is created, and no money is lost. We are working on online payments. Until then, pay through UPI using the details below, or contact the administrator and our team will help you. Access is granted once the admin confirms your payment."*
- a phone/email contact action and a "Done" button that takes the user to Purchases.

The order must stay in a pending state until the admin acts. Do not grant access from the client.

**Acceptance:** dialog appears right after order creation on desktop and mobile; shows the details and message; the pending order appears in Purchases; the existing admin approval still grants access.

---

## Task 6: Bookmark on the lesson page

**Goal:** let a user bookmark from the lesson page at `/dashboard/lessons/[lessonId]`.

**Do:**
- Read the existing bookmark API first (`/api/bookmarks` and `/api/bookmarks/[id]`): methods, request body, response, auth. **Use it as is; do not change it.** If it cannot support the feature, report that instead of changing it.
- Add the bookmark control in the lesson page components. It must work for any lesson kind (lesson, topic, subtopic). Support `CONTENT_SECTION` (Content tab) and `VIDEO_TIMESTAMP` (Video tab, current playback time) per the types the API supports, with an optional note.
- Show the bookmarked state, allow removal, and show toasts for success and failure. Use optimistic update only if the project already does so elsewhere.

**Acceptance:** a bookmark can be added and removed from the lesson page; it appears on the Bookmarks page; works for topic and standalone lessons; a user cannot affect another user's bookmark.

---

## Task 7: Admin navbar (search + breadcrumbs)

**Goal:** the admin area gets the same top bar behaviour as the user dashboard.

**Do:**
- Reuse the existing Topbar, `BreadcrumbProvider`, and `SetBreadcrumb`. Add the provider/topbar to the admin layout rather than building a second system.
- Add a breadcrumb trail on each admin page via `SetBreadcrumb` (last item plain text, earlier items links).
- Add a search box (and the same keyboard shortcut as the user side if one exists). Scope search to admin data that already has list endpoints (courses, users, lessons). If no search endpoint exists, add one minimal, admin-guarded endpoint.
- It must be usable on mobile (sidebar toggle works).

**Acceptance:** every admin page shows a correct breadcrumb and the search box; search returns results from at least courses and users; non-admins still cannot reach any of it.

---

## Task 8: Submissions review: per-course tables and completion

**Starting point:** `src/backend/services/admin/review.service.ts`, which has a function that lists submissions and one that reviews a submission. Read both first, plus the admin Submissions page component and the submission status enum in `schema.prisma`.

**Goal:** the admin can see all submissions, organised per course, and finishing a review moves the submission to a completed state.

**Do:**
- Add one new admin-guarded API endpoint that returns submissions **grouped by course** (with status counts and the pending ones first, oldest first). Do not change the response of the existing endpoints.
- Rebuild the Submissions component as **one table per course**, with columns such as student, lesson/assignment, PR link, submitted date, status, and action. Include a count of pending items per course and a status filter (All / Pending / Completed).
- When the admin submits a review (Approve or Request changes with an optional note), the submission must leave the pending queue and be shown as completed/reviewed. **Check the existing enum first.** If it has no suitable completed value, state your proposed value and ask before adding a migration. Keep "request changes" resubmittable by the student, as in the existing spec (resubmission resets the status).
- Show a toast on success/failure and refresh the table without a full page reload.

**Acceptance:** each course has its own table; pending counts are right; a reviewed submission leaves Pending and appears under Completed; the student's view reflects the result; admin guard is on the new endpoint; tables are usable on mobile (horizontal scroll or cards).

---

## Final step

After Task 8, give a one-page summary: tasks done, env variables added, migrations created, and the combined "Noticed, not changed" list.