// prisma/seed.ts
import { ProgressStatus, LessonKind, ContentStatus, VideoStatus } from "@/src/generated/prisma";
import { prisma } from "@/src/lib/prisma";

// Prisma's compound-unique `where` type requires a non-null value for
// nullable fields (moduleId_parentId_order can't take parentId: null),
// so upsert() can't be used directly against that key. This does the
// same job — find by the natural key, then create or update.
async function upsertLesson(params: {
  moduleId: string;
  parentId: string | null;
  slug: string;
  title: string;
  order: number;
  kind: LessonKind;
  contentStatus?: ContentStatus;
  videoStatus?: VideoStatus;
  contentBody?: string;
  notionUrl?: string;
  learningGoals?: string[];
  estimatedMinutes?: number;
  keyTakeaways?: string[];
}) {
  const { moduleId, parentId, order, ...rest } = params;

  const existing = await prisma.lesson.findFirst({
    where: { moduleId, parentId, order },
  });

  if (existing) {
    return prisma.lesson.update({
      where: { id: existing.id },
      data: { ...rest },
    });
  }

  return prisma.lesson.create({
    data: { moduleId, parentId, order, ...rest },
  });
}

async function main() {
  // ---------- Courses ----------
  const courses = [
    {
      slug: "fullstack-mern-ai",
      title: "Full-Stack Engineering — MERN + AI",
      description:
        "Ship production React and Node systems, then wire in AI features the way real product teams do.",
      priceCents: 4_99900,
    },
    {
      slug: "fullstack-python-ai",
      title: "Full-Stack Engineering — Python + AI",
      description:
        "Django and FastAPI foundations through to deployed, AI-assisted backend systems.",
      priceCents: 4_99900,
    },
    {
      slug: "cybersecurity-ethical-hacking",
      title: "Cybersecurity & Ethical Hacking",
      description:
        "Offensive security fundamentals, live labs, and the certifications hiring teams actually screen for.",
      priceCents: 3_99900,
    },
  ];

  const seededCourses = [];
  for (const course of courses) {
    const record = await prisma.course.upsert({
      where: { slug: course.slug },
      create: { ...course, currency: "INR", isPublished: true },
      update: { ...course, isPublished: true },
    });
    seededCourses.push(record);
  }
  console.log(`Seeded ${seededCourses.length} courses.`);

  const mernCourse = seededCourses[0];

  // ---------- Module 1: Foundations ----------
  const foundationsModule = await prisma.module.upsert({
    where: { courseId_order: { courseId: mernCourse.id, order: 1 } },
    create: { courseId: mernCourse.id, title: "Foundations", order: 1, isPublished: true },
    update: { title: "Foundations", isPublished: true },
  });

  const developerFoundations = await upsertLesson({
    moduleId: foundationsModule.id,
    parentId: null,
    slug: "developer-foundations",
    title: "Developer Foundations",
    order: 1,
    kind: LessonKind.OVERVIEW,
    contentStatus: "PUBLISHED",
    videoStatus: "NOT_RECORDED",
    learningGoals: [
      "Set up a real dev environment and move around it without clicking through folders",
      "Use Git and GitHub as an actual collaboration workflow, not just a backup",
      "Explain what happens between a click and a page loading",
    ],
    estimatedMinutes: 90,
  });

  const topicsData = [
    {
      slug: "dev-environment-tooling",
      title: "Dev Environment & Tooling",
      order: 1,
      notionUrl: "https://notion.so/dev-environment-tooling",
      learningGoals: [
        "Move around your machine using a terminal instead of clicking through folders",
        "Explain what a package manager does and why npm, pnpm, and bun coexist",
      ],
      estimatedMinutes: 30,
      keyTakeaways: [
        "You can explain what a terminal replaces and why it's faster once memorized",
        "You can name the trade-off pnpm and bun each optimize for",
      ],
      keyTerms: [
        { term: "Package manager", definition: "A tool that installs, versions, and reproduces a project's dependencies." },
        { term: "Lockfile", definition: "A file recording exact dependency versions installed, so setups are reproducible." },
      ],
      questions: [
        {
          prompt: "Why does pnpm use less disk space than npm across multiple projects?",
          answer:
            "It stores each package version once on disk and links to it, instead of copying it into every project's node_modules.",
        },
      ],
    },
    {
      slug: "git-github-workflow",
      title: "Git & GitHub Workflow",
      order: 2,
      notionUrl: "https://notion.so/git-github-workflow",
      learningGoals: [
        "Use branches to isolate work instead of committing straight to main",
        "Open a PR and resolve a merge conflict without panicking",
      ],
      estimatedMinutes: 40,
      keyTakeaways: ["You can explain why branches exist and open a PR end to end"],
      keyTerms: [
        { term: "Merge conflict", definition: "When Git can't automatically combine two changes to the same lines and needs a human decision." },
      ],
      questions: [
        {
          prompt: "Why do teams use branches instead of everyone committing to main directly?",
          answer: "Branches isolate unfinished or risky work so main always stays in a deployable state.",
        },
      ],
    },
  ];

  const topicLessonIds: string[] = [];

  for (const topic of topicsData) {
    const topicLesson = await upsertLesson({
      moduleId: foundationsModule.id,
      parentId: developerFoundations.id,
      slug: topic.slug,
      title: topic.title,
      order: topic.order,
      kind: LessonKind.TOPIC,
      contentStatus: "PUBLISHED",
      videoStatus: "EDITING",
      notionUrl: topic.notionUrl,
      learningGoals: topic.learningGoals,
      estimatedMinutes: topic.estimatedMinutes,
      keyTakeaways: topic.keyTakeaways,
    });

    await prisma.wrapUpKeyTerm.deleteMany({ where: { lessonId: topicLesson.id } });
    await prisma.wrapUpKeyTerm.createMany({
      data: topic.keyTerms.map((t, i) => ({
        lessonId: topicLesson.id,
        order: i + 1,
        term: t.term,
        definition: t.definition,
      })),
    });

    await prisma.wrapUpQuestion.deleteMany({ where: { lessonId: topicLesson.id } });
    await prisma.wrapUpQuestion.createMany({
      data: topic.questions.map((q, i) => ({
        lessonId: topicLesson.id,
        order: i + 1,
        prompt: q.prompt,
        answer: q.answer,
      })),
    });

    topicLessonIds.push(topicLesson.id);
  }

  await upsertLesson({
    moduleId: foundationsModule.id,
    parentId: null,
    slug: "http-express",
    title: "HTTP & Express",
    order: 2,
    kind: LessonKind.STANDALONE,
    contentStatus: "PUBLISHED",
    videoStatus: "EDITING",
    contentBody:
      "## Context\nHTTP is the contract your frontend and backend agree on...\n\n## Worked Example\nA second, different example from the video — here we build a notes API instead of a todo API.",
  });

  // ---------- Assignment for the first topic lesson ----------
  const assignment = await prisma.assignment.upsert({
    where: { lessonId: topicLessonIds[0] },
    create: {
      lessonId: topicLessonIds[0],
      title: "Set up a reproducible dev environment",
      tier: "REPO",
      instructions:
        "Clone the starter repo, run it with pnpm instead of npm, and open a PR showing the lockfile diff plus a short README note on what changed.",
      starterRepoUrl: "https://github.com/skyblip/dev-env-starter",
    },
    update: {},
  });

  await prisma.quizQuestion.createMany({
  data: [
    {
      lessonId: topicLessonIds[0],
      order: 1,
      prompt: "What is the terminal fundamentally giving you?",
      options: [
        { id: "a", text: "A faster way to memorize commands" },
        { id: "b", text: "A direct, repeatable way to tell the computer what to do" },
        { id: "c", text: "A replacement for the code editor" },
      ],
      correctOptionId: "b",
      explanation: "The terminal replaces manual clicking with direct, repeatable instructions.",
      hint: "Think about what changes once you type instead of click.",
    },
  ],
});
  console.log(`Seeded assignment "${assignment.title}" for lesson ${topicLessonIds[0]}.`);

  console.log(
    `Seeded module "${foundationsModule.title}" with 1 overview lesson (2 topics) + 1 standalone lesson.`
  );

  // ---------- Module 2: Databases ----------
  const databasesModule = await prisma.module.upsert({
    where: { courseId_order: { courseId: mernCourse.id, order: 2 } },
    create: { courseId: mernCourse.id, title: "Databases", order: 2, isPublished: true },
    update: { title: "Databases", isPublished: true },
  });

  const dbLessonsData = [
    { title: "MongoDB Basics", slug: "mongodb-basics" },
    { title: "Prisma & Postgres", slug: "prisma-postgres" },
  ];

  for (const [i, lessonData] of dbLessonsData.entries()) {
    await upsertLesson({
      moduleId: databasesModule.id,
      parentId: null,
      slug: lessonData.slug,
      title: lessonData.title,
      order: i + 1,
      kind: LessonKind.STANDALONE,
      contentStatus: "PUBLISHED",
      videoStatus: "EDITING",
    });
  }

  console.log(`Seeded module "${databasesModule.title}" with ${dbLessonsData.length} standalone lessons.`);

  // ---------- Test user, enrollment, progress ----------
  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    create: { name: "Test User", email: "test@example.com" },
    update: {},
  });

  const order = await prisma.order.upsert({
    where: { idempotencyKey: "seed-order-mern" },
    create: {
      userId: testUser.id,
      courseId: mernCourse.id,
      amountCents: mernCourse.priceCents,
      currency: "INR",
      status: "PAID",
      idempotencyKey: "seed-order-mern",
    },
    update: {},
  });

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: testUser.id, courseId: mernCourse.id } },
    create: { userId: testUser.id, courseId: mernCourse.id, orderId: order.id },
    update: {},
  });

  if (topicLessonIds[0]) {
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: testUser.id, lessonId: topicLessonIds[0] } },
      create: {
        userId: testUser.id,
        lessonId: topicLessonIds[0],
        status: ProgressStatus.IN_PROGRESS,
        videoPositionSeconds: 120,
      },
      update: {},
    });
  }

  console.log(
    `Enrolled "${testUser.email}" in "${mernCourse.slug}" with progress on topic lesson ${topicLessonIds[0]}.`
  );

  // ---------- Admin user ----------
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    create: { name: "Admin", email: "admin@gmail.com", role: "ADMIN" },
    update: { role: "ADMIN" },
  });
  console.log(`Seeded admin user: ${adminUser.email}`);

  // ---------- A submission, so the review queue has something to show ----------
  await prisma.submission.upsert({
    where: { userId_assignmentId: { userId: testUser.id, assignmentId: assignment.id } },
    create: {
      userId: testUser.id,
      assignmentId: assignment.id,
      prUrl: "https://github.com/testuser/dev-env-starter/pull/1",
      status: "SUBMITTED",
    },
    update: {},
  });
  console.log(`Seeded a SUBMITTED submission for assignment "${assignment.title}".`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());