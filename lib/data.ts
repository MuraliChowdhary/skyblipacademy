import { Program, PlacementStep, FAQItem } from '@/types';

export const PROGRAMS: Program[] = [
  {
    id: 'mern-fullstack-ai',
    title: 'MERN Fullstack With AI',
    description:
      'Master MongoDB, Express.js, React, and Node.js along with AI integration to build intelligent web applications.',
    rating: '4.9',
    reviews: '1.2k+',
    duration: '6 Months',
    iconName: 'Laptop',
  },
  {
    id: 'cyber-security',
    title: 'Cyber Security (Ethical Hacking)',
    description:
      'Learn to identify vulnerabilities and secure networks. Become a certified ethical hacker with hands-on labs.',
    rating: '4.8',
    reviews: '950+',
    duration: '5 Months',
    iconName: 'ShieldCheck',
  },
  {
    id: 'python-fullstack-ai',
    title: 'Python Fullstack With AI',
    description:
      'Build scalable backends with Django/FastAPI and integrate AI models for next-generation software solutions.',
    rating: '4.9',
    reviews: '1.5k+',
    duration: '6 Months',
    iconName: 'Sparkles',
  },
];

export const PLACEMENT_STEPS: PlacementStep[] = [
  {
    id: 1,
    title: 'Resume Building',
    desc: 'Craft a compelling resume that highlights your skills and projects.',
    iconName: 'FileText',
  },
  {
    id: 2,
    title: 'Placement Training',
    desc: 'Comprehensive sessions to prepare you for corporate environments.',
    iconName: 'Users',
  },
  {
    id: 3,
    title: 'Interview Questions',
    desc: 'Extensive bank of technical and HR questions to practice.',
    iconName: 'MessageSquare',
  },
  {
    id: 4,
    title: 'Internships Under Experts',
    desc: 'Gain practical experience working alongside industry veterans.',
    iconName: 'Briefcase',
  },
  {
    id: 5,
    title: 'Realtime Live Projects',
    desc: 'Build scalable applications that solve real-world problems.',
    iconName: 'MonitorPlay',
  },
  {
    id: 6,
    title: 'Aptitude Preparation',
    desc: 'Sharpen your analytical and problem-solving skills.',
    iconName: 'BookOpen',
  },
  {
    id: 7,
    title: 'Personality Development',
    desc: 'Enhance your communication and professional presence.',
    iconName: 'UserCheck',
  },
  {
    id: 8,
    title: 'Mock Interviews',
    desc: 'Simulated interviews with detailed feedback and improvement plans.',
    iconName: 'CheckCircle',
  },
  {
    id: 9,
    title: 'Scheduling Interviews',
    desc: 'We connect you directly with our network of hiring partners.',
    iconName: 'Briefcase',
  },
  {
    id: 10,
    title: 'Get Offer Letter',
    desc: 'Celebrate your success as you secure your dream tech role.',
    iconName: 'Award',
  },
];

export const FAQS: FAQItem[] = [
  {
    q: 'Do I need coding experience to join the programs?',
    a: 'No prior coding experience is required for our beginner-friendly tracks. We start from the fundamentals and gradually move to advanced concepts.',
  },
  {
    q: 'How does the 100% Placement Support work?',
    a: 'We provide end-to-end support including resume building, portfolio creation, mock interviews, and direct referrals to our extensive network of hiring partners upon successful course completion.',
  },
  {
    q: 'Are the classes live or pre-recorded?',
    a: 'Our programs feature a blend of live interactive sessions with industry experts and high-quality on-demand materials for flexible learning.',
  },
  {
    q: 'Will I get a certificate after completion?',
    a: 'Yes, upon successful completion of your program and projects, you will receive an internationally recognized certificate verifying your skills.',
  },
];