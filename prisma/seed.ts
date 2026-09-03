import { prisma } from "@/src/lib/prisma";


async function main() {
  const courses = [
    {
      slug: "fullstack-mern-ai",
      title: "Full-Stack Engineering — MERN + AI",
      description:
        "Ship production React and Node systems, then wire in AI features the way real product teams do.",
      priceCents: 4_99900, // ₹4999.00
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

  for (const course of courses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      create: { ...course, currency: "INR", isPublished: true },
      update: { ...course, isPublished: true },
    });
  }

  console.log(`Seeded ${courses.length} courses.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());