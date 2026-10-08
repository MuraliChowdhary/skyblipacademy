# AGENTS.md — SkyBlip Academy

Read this file first. It holds the standing rules and project context. Tasks are in `TASKS.md`.

## 1. Project

SkyBlip Academy is a course-selling and delivery platform. Roles: `USER` and `ADMIN` (`User.role`, guarded by `requireAdmin()`).

- **Stack (confirm in `package.json`):** Next.js App Router, TypeScript, Tailwind, shadcn/ui, Prisma, Postgres.
- **Content tree:** Course > Module > Lesson. `Lesson` is self-referential via `parentId`; `kind` is `STANDALONE`, `OVERVIEW`, or `TOPIC`.
- **Lesson page:** five tabs: Content, Video, Assignment, Wrap-up, Extra. Route: `/dashboard/lessons/[lessonId]`.
- **Purchase flow:** Buy opens a billing dialog, then `POST /api/courses/[id]/purchase` creates an `Order` (with `Idempotency-Key`). There is no payment gateway. An admin verifies payment manually and toggles access, which creates the `Enrollment`. **This admin toggle is already built. Do not rebuild it.**
- **Navigation:** breadcrumbs go through `BreadcrumbProvider` / `SetBreadcrumb`. Pages declare their trail as data and the Topbar renders it. The last item is plain text; earlier items are links.
- **Backend services** live in `src/backend/services/` (for example `admin/review.service.ts`). API routes live under `src/app/api/`. Confirm the actual layout before editing.

## 2. Working rules

1. **Do one task at a time**, in the order given in `TASKS.md`. Finish, verify, and report before starting the next. Then stop and wait for "next".
2. **Understand before acting.** Before editing, write a plan of at most 10 lines: files to read, files to change, risks.
3. **Read only what the task needs.** Do not scan the whole repo, dump large files, or re-read files you already read. Use targeted search (grep by name or route).
4. **Reuse existing patterns.** Use existing components, services, API conventions, validation, error handling, and toast system. Do not introduce a new library without asking.
5. **Keep the change small.** Edit only files the task requires. No refactors, renames, formatting sweeps, or "while I'm here" fixes.
6. **Do not alter working code outside the task.** If you find an unrelated bug, list it under "Noticed, not changed" in your report.
7. **Ask instead of guessing.** If something is ambiguous (for example an enum value or a missing API), state the assumption and ask a single clear question before changing anything.
8. **Be concise.** No long explanations, no restating the task, no pasting whole files in replies.

## 3. Security rules (non-negotiable)

- Never trust the client. Enforce authentication and role checks **on the server** for every admin page, admin API route, and server action. Hiding a button is not protection.
- Validate all input on the server (use the project's existing validator).
- Check ownership on user-owned resources (bookmarks, progress, orders, submissions) so one user cannot read or modify another's.
- Never log, return, or commit secrets, tokens, or password hashes. Secrets come from environment variables. Add new ones to `.env.example` only, with placeholder values.
- Never run destructive commands (dropping tables, `prisma migrate reset`, `git reset --hard`, deleting files) without explicit approval.
- Schema changes must be additive and made through a Prisma migration. State the migration name and effect.

## 4. Verification (required before reporting a task done)

Run what exists in `package.json`: typecheck, lint, and build (or the closest equivalents). Then check the behaviour of the task itself (see its acceptance criteria). If you cannot run something, say so; never claim a check passed that you did not run.

## 5. Report format (after each task)

```
Task: <name>
Status: Done | Blocked | Needs input
Files changed: <list>
Migration/env changes: <none or details>
Verification: <commands run and results; acceptance criteria met Y/N>
Noticed, not changed: <list or none>
```