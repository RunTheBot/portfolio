export interface Experience {
  role: string;
  organization: string;
  location: string;
  period: string;
  summary: string;
  responsibilities: string[];
  tags: string[];
  links?: { label: string; url: string }[];
}

export interface Education {
  institution: string;
  degree: string;
  specialization: string;
  location: string;
  period: string;
  status: string;
  description: string;
}

export const PERSONAL_INFO = {
  name: "Aaron Huang",
  alias: "RunTheBot",
  title: "Robotics & Software Engineer",
  email: "contact@aaronhuang.dev",
  github: "https://github.com/runthebot",
  linkedin: "https://linkedin.com/in/haaron",
  twitter: "https://twitter.com/RunTheBot",
  resumeUrl: "/resume.pdf",
};

export const EXPERIENCES: Experience[] = [
  {
    role: "Chief Engineer & Lead Programmer",
    organization: "FRC 7520 (MineKee Robotics)",
    location: "Toronto, ON",
    period: "Sep 2021 — June 2026",
    summary:
      "Directed the full lifecycle of competitive 125lb industrial robots, leading to two consecutive World Championship qualifications. Oversaw mechanical design, electrical architecture, and real-time Java control software.",
    responsibilities: [
      "Architected the complete Java codebase utilizing WPILib, AdvantageKit, and PathPlanner for autonomous path following and sub-inch closed-loop mechanism control.",
      "Iterated on gains, sensor placement, and actuator selection to reduce drift, latency, and instability during real-world competition matches.",
      "Worked across mechanical, electrical, and software subteams to translate high-level game strategies into robust, field-ready motion profiles.",
      "Diagnosed hardware and electrical faults through bench validation and integration testing to guarantee 100% repeatability in autonomous routines.",
      "Led and mentored a 60+ member student organization across 8 subteams, publishing CAD and software releases for the global community.",
    ],
    tags: ["Java", "Closed-Loop Control", "AdvantageKit", "Computer Vision", "CAD / Onshape", "Leadership"],
    links: [
      { label: "2026 Oasis Reveal", url: "https://www.chiefdelphi.com/t/team-minekee-frc-7520-2026-robot-reveal-oasis/516166" },
      { label: "2025 Build Blog", url: "https://www.chiefdelphi.com/t/team-minekee-7520-2025-offseason-build-blog/501657" },
      { label: "2024 CAD/Code", url: "https://www.chiefdelphi.com/t/team-7520-minekee-2024-robot-cad-code-release/461105" },
    ],
  },
  {
    role: "Captain and Founder",
    organization: "VRC 95500A (YM Robotics)",
    location: "Toronto, ON",
    period: "Sep 2024 — June 2026",
    summary:
      "Founded the school's premier VEX Robotics competition team from scratch, overseeing design, build, and event operations.",
    responsibilities: [
      "Built the school's VEX robotics program from the ground up, establishing fabrication pipelines, Git workflows, and build documentation.",
      "Grew the team to 30 passionate members and secured over $6,000 in funding through school grants and corporate sponsorships.",
      "Coached junior members in robot mechanics, PID control algorithms, and competition strategy.",
    ],
    tags: ["VEX Robotics", "C++ / PROS", "Sponsorships", "Team Building", "PID Control"],
  },
];

export const EDUCATION: Education = {
  institution: "University of Toronto — St. George Campus",
  degree: "BASc. in Engineering Science",
  specialization: "Robotics Engineering Specialization",
  location: "Toronto, ON",
  period: "Sep 2026 — June 2031",
  status: "Incoming Student",
  description:
    "Engineering Science (EngSci) is one of the most rigorous undergraduate engineering programs in the world, providing foundational mathematics, physics, and computing before specializing in advanced Robotics Engineering.",
};

export const AWARDS = [
  {
    title: "UTRA Hacks 2025 — 1st Place Best Use of Generative AI",
    org: "University of Toronto Robotics Association",
    year: "2025",
    desc: "Built 'Baylee', an autonomous care robot with facial emotion recognition and automated medicine dispensing.",
  },
  {
    title: "FIRST Robotics District Engineering Inspiration Award",
    org: "FIRST Robotics Competition",
    year: "2025",
    desc: "Recognizing outstanding engineering achievement, cultural impact, and STEM outreach in the community.",
  },
  {
    title: "Canadian Computing Competition (CCC) Senior — Distinction",
    org: "University of Waterloo CEMC",
    year: "2024",
    desc: "Ranked in the top 25% of senior high school contestants nationwide.",
  },
  {
    title: "High Distinction in Grade 11 & 12 Computer Science & Computer Engineering",
    org: "TDSB",
    year: "2024 — 2025",
    desc: "Ranked top of class across senior engineering technology and programming courses.",
  },
];
