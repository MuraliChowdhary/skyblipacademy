export const NAV_LINKS = [
  { name: "Programs", href: "/programs" },
  { name: "Cohort", href: "/cohort" },
  { name: "Reviews & Testimonials", href: "/reviews" },
  { name: "Internships", href: "/internships" },
  { name: "Verify Certificate", href: "/verify-certificate" },
];

export const PRIMARY_CTA = "Talk to a Mentor";

// Honest, structural facts only — no invented outcome numbers.
// Swap these for real figures (placements, hiring partners, ratings)
// only once the first cohort has actually produced them.
export const PROGRAM_FACTS = [
  { value: "3", label: "career tracks" },
  { value: "0", label: "fake placement guarantees" },
  { value: "1:1", label: "live mentor sessions" },
  // { value: "Aug '26", label: "founding cohort intake" },
];

export type Program = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  duration: string;
  mode: "Live Online" | "Hybrid";
  level: "Beginner friendly" | "Intermediate";
  stack: string[];
  outcome: string;
};

export const PROGRAMS: Program[] = [
  {
    id: "prog-01",
    slug: "fullstack-mern-ai",
    name: "Full-Stack Engineering — MERN + AI",
    tagline: "Ship production React and Node systems, then wire in AI features the way real product teams do.",
    duration: "28 weeks",
    mode: "Live Online",
    level: "Beginner friendly",
    stack: ["React", "Node.js", "PostgreSQL", "Docker"],
    outcome: "Portfolio target: SDE-1 / Frontend Engineer",
  },
  {
    id: "prog-02",
    slug: "fullstack-python-ai",
    name: "Full-Stack Engineering — Python + AI",
    tagline: "Django and FastAPI foundations through to deployed, AI-assisted backend systems.",
    duration: "28 weeks",
    mode: "Live Online",
    level: "Beginner friendly",
    stack: ["Python", "FastAPI", "PostgreSQL", "AWS"],
    outcome: "Portfolio target: Backend / Platform Engineer",
  },
  {
    id: "prog-03",
    slug: "cybersecurity-ethical-hacking",
    name: "Cybersecurity & Ethical Hacking",
    tagline: "Offensive security fundamentals, live labs, and the certifications hiring teams actually screen for.",
    duration: "22 weeks",
    mode: "Hybrid",
    level: "Intermediate",
    stack: ["Linux", "Network Security", "Burp Suite", "CTF Labs"],
    outcome: "Portfolio target: SOC Analyst / Security Engineer",
  },
];

export const LEARNING_QUOTE = {
  text: "What I cannot create, I do not understand.",
  author: "Richard Feynman",
};

export const LEARNING_PILLARS = [
  {
    iconName: "Layers",
    title: "Fundamentals over frameworks",
    description:
      "You learn why a hash map works before you ever import one. Frameworks change every two years — the underlying reasoning doesn't.",
  },
  {
    iconName: "Brain",
    title: "Build to understand, not to memorize",
    description:
      "Every concept ends with you building it from scratch, once, so it's reasoning you own — not a tutorial you followed along with.",
  },
  {
    iconName: "Wrench",
    title: "Reason under real constraints",
    description:
      "Production tradeoffs, broken requirements, and systems that fail at 2am — the actual job, not a toy problem with a clean answer.",
  },
];

export const FOUNDATION_PILLARS = [
  {
    iconName: "BookOpen",
    title: "Structured Curriculum",
    description: "Step-by-step modules that build from fundamentals to production-grade systems — no skipped layers.",
  },
  {
    iconName: "MonitorPlay",
    title: "Real-World Projects",
    description: "Three shipped projects that solve an actual problem, reviewed the way a senior engineer would review a PR.",
  },
  {
    iconName: "Users",
    title: "1:1 Mentorship",
    description: "Biweekly sessions with a senior engineer who knows your project history, not a rotating support queue.",
  },
  {
    iconName: "Award",
    title: "Career Readiness",
    description: "Mock interviews, resume rebuilds, and structured introductions as our hiring-partner network grows.",
  },
];

export const WHY_SKYBLIP = [
  {
    iconName: "Sparkles",
    title: "Internships from week one",
    description: "You're placed into applied project work alongside instruction, not after a certificate — real tasks, not simulations.",
  },
  {
    iconName: "ShieldCheck",
    title: "Verifiable certification",
    description: "Every completion certificate resolves on a public verification page — a recruiter can check it, not just take your word for it.",
  },
  {
    iconName: "Globe",
    title: "Live, not pre-recorded",
    description: "Every class is live with a fixed cohort. Recordings exist as backup, not as the default format.",
  },
  {
    iconName: "CheckCircle",
    title: "1:1 doubt-solving, not a queue",
    description: "A mentor assigned to your batch, not a rotating support ticket system.",
  },
];

// Honest comparison by category, not by naming specific competitors
// we have no audited data on. Only claim what we can actually stand behind.
export type ComparisonRow = {
  feature: string;
  freeContent: "yes" | "no" | "partial";
  typicalBootcamp: "yes" | "no" | "partial";
  skyBlip: "yes" | "no" | "partial";
};

export const COMPARISON_ROWS: ComparisonRow[] = [
  { feature: "Affordable pricing", freeContent: "yes", typicalBootcamp: "no", skyBlip: "yes" },
  { feature: "1:1 live doubt-solving", freeContent: "no", typicalBootcamp: "partial", skyBlip: "yes" },
  { feature: "Mentor-reviewed projects", freeContent: "no", typicalBootcamp: "partial", skyBlip: "yes" },
  { feature: "Verifiable certification", freeContent: "no", typicalBootcamp: "partial", skyBlip: "yes" },
  { feature: "Structured placement process", freeContent: "no", typicalBootcamp: "partial", skyBlip: "yes" },
  { feature: "Fixed-batch live classes", freeContent: "no", typicalBootcamp: "partial", skyBlip: "yes" },
];

export const FAQS = [
  {
    q: "Who is this program actually for?",
    a: "Final-year and recent-graduate engineering students, and career switchers with basic programming exposure. If you've never written code before, our 2-week primer gets you ready before the cohort starts.",
  },
  {
    q: "What happens if I fall behind the cohort?",
    a: "Your mentor flags it within a week during check-ins, and you get a short catch-up plan plus an extra 1:1 session — the goal is to keep you inside the same cohort, not move you to a slower track.",
  },
  {
    q: "Is placement actually guaranteed?",
    a: "No program can ethically guarantee a job offer, and we won't claim one. What we commit to is structured referrals through our hiring-partner pipeline as it's built, and unlimited mock interviews until you're ready.",
  },
  {
    q: "Can I learn while working full-time?",
    a: "Yes — classes run on weekday evenings and weekends, and every session is recorded. Most working learners in the Hybrid track complete the program alongside a full-time job.",
  },
  {
    q: "What's the actual cost, and are there loans?",
    a: "Program fees are listed on each program page with no hidden costs. We're setting up no-cost EMI options with NBFC partners — details are covered in your free mentor call.",
  },
];