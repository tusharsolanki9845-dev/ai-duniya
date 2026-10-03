/** Central content + config for AI DUNIYA. Edit here, not in the pages. */

export const SITE = {
  name: "AI DUNIYA",
  email: "hello@aiduniya.ai",
  phone: "+91 98765 43210",
  phoneHref: "tel:+919876543210",
  city: "New Delhi, India",
  hours: "Monday – Saturday · 10:00 AM – 6:00 PM IST",
  nextCohort: "Oct 2026",
};

export type Founder = { name: string; role: string; initials: string; bio: string[] };

export const FOUNDERS: Founder[] = [
  {
    name: "Tushar Solanki",
    role: "CEO & Co-Founder",
    initials: "TS",
    bio: [
      "My journey in technology started with curiosity and a strong desire to understand how modern technology works. As a BTech student specializing in Artificial Intelligence and Machine Learning, I am continuously exploring programming, web development, AI, and real-world technology solutions.",
      "That mindset has led to building verified, working products rather than just tutorials — a luxury crockery e-commerce platform, a hardware store with UPI payments and an admin panel, a bilingual civic-tech chatbot for Indian Tehsil services, and a SaaS lead-generation tool for freelancers. Along the way I've picked up practical skills in Python, JavaScript, React, Node.js, Firebase, Supabase, and PWA patterns.",
      "I enjoy turning ideas into functional digital products and solving problems through technology. My goal is not just to complete a degree, but to continuously improve my skills, gain real-world experience, and build innovative solutions that can create value for people and businesses.",
    ],
  },
  {
    name: "Piyush Rastogi",
    role: "CEO & Founder",
    initials: "PR",
    bio: [
      "I’m Piyush Rastogi, the CEO & Founder of Alpha Tech Solutions and a CSE (AI/ML) student at IEC College of Engineering and Technology.",
      "Based in Nanpara, Uttar Pradesh, India, I’m building my foundations in software development, AI/ML, frontend engineering, and business while turning ideas into practical digital products.",
      "My public learning journey includes frontend development work with CodeAlpha, an AI & ML internship with Codomax Digital Solutions, and foundational learning in AWS, generative AI, and software development.",
      "At Alpha Tech Solutions, I combine technology, creativity, and business understanding to help clients build useful digital experiences and move forward with confidence.",
      "I believe big dreams start with small steps — and every project, challenge, and learning opportunity is part of the journey.",
    ],
  },
];

export type NavItem = { label: string; href: string };

export const NAV: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Labs", href: "/labs" },
  { label: "Courses", href: "/courses" },
  { label: "Examination", href: "/examination" },
  { label: "Products", href: "/#products" },
  { label: "Work", href: "/#work" },
  { label: "Business", href: "/#business" },
  { label: "Contact", href: "/contact" },
];

/* ------------------------------------------------------------------ */
/* Courses                                                             */
/* ------------------------------------------------------------------ */

export type Level = "Beginner" | "Intermediate" | "Advanced";
export type Category = "AI" | "Code" | "Data" | "Robotics" | "Leadership";

export type Course = {
  id: string;
  tag: string;
  title: string;
  blurb: string;
  duration: string;
  format: string;
  level: Level;
  category: Category;
  hue: "lime" | "cyan" | "violet" | "amber";
  outcomes: string[];
  syllabus: { week: string; title: string; detail: string }[];
};

export const COURSES: Course[] = [
  {
    id: "ai-fluency",
    tag: "FOUNDATIONS",
    title: "AI fluency for modern teams",
    blurb: "A practical, plain-English introduction to the new toolkit of work.",
    duration: "6 weeks",
    format: "Live cohort",
    level: "Beginner",
    category: "AI",
    hue: "lime",
    outcomes: [
      "Explain how modern AI tools work — without jargon",
      "Write prompts that give reliable, useful results",
      "Spot risks: hallucinations, bias and data privacy",
    ],
    syllabus: [
      { week: "W1", title: "What AI actually is", detail: "Models, data and the difference between hype and capability." },
      { week: "W2", title: "Prompting that works", detail: "Structure, context, examples and iteration." },
      { week: "W3", title: "AI in your daily workflow", detail: "Research, writing, analysis and planning with copilots." },
      { week: "W4", title: "Responsible use", detail: "Privacy, verification, bias and when not to use AI." },
      { week: "W5", title: "Automate a task", detail: "Design a small repeatable workflow for your own job." },
      { week: "W6", title: "Showcase", detail: "Present your workflow and get feedback from the cohort." },
    ],
  },
  {
    id: "build-genai",
    tag: "BUILD",
    title: "Build with generative AI",
    blurb: "Make useful prototypes with prompts, APIs, agents and a bias toward shipping.",
    duration: "8 weeks",
    format: "Studio format",
    level: "Intermediate",
    category: "AI",
    hue: "cyan",
    outcomes: [
      "Call LLM APIs from your own code",
      "Build a tool-using agent that completes a real workflow",
      "Ship a working prototype you can demo",
    ],
    syllabus: [
      { week: "W1", title: "The builder's toolkit", detail: "APIs, keys, environments and your first model call." },
      { week: "W2", title: "Prompts as programs", detail: "System prompts, structured output and evaluation." },
      { week: "W3", title: "Retrieval (RAG)", detail: "Ground answers in your own documents." },
      { week: "W4", title: "Agents & tool calling", detail: "Let models plan, call functions and recover from errors." },
      { week: "W5", title: "Interfaces", detail: "Wrap your prototype in a clean web UI." },
      { week: "W6", title: "Testing & guardrails", detail: "Evals, failure modes and safety checks." },
      { week: "W7", title: "Deploy", detail: "Ship it on a free tier and monitor it." },
      { week: "W8", title: "Demo day", detail: "Present your build to the studio." },
    ],
  },
  {
    id: "ai-os",
    tag: "LEAD",
    title: "The AI operating system",
    blurb: "A field guide for leaders turning AI experiments into durable advantage.",
    duration: "4 weeks",
    format: "Executive lab",
    level: "Intermediate",
    category: "Leadership",
    hue: "amber",
    outcomes: [
      "Map high-value AI opportunities in your organisation",
      "Build a lightweight governance and risk approach",
      "Create a 90-day AI adoption roadmap",
    ],
    syllabus: [
      { week: "W1", title: "Opportunity mapping", detail: "Find the problems worth solving with AI." },
      { week: "W2", title: "Build, buy or partner", detail: "Choosing tools, vendors and teams." },
      { week: "W3", title: "Governance & risk", detail: "Policies people will actually follow." },
      { week: "W4", title: "Roadmap", detail: "A 90-day plan with owners and success measures." },
    ],
  },
  {
    id: "python-ai",
    tag: "CODE",
    title: "Python for AI builders",
    blurb: "Learn the Python and web fundamentals every AI project stands on.",
    duration: "8 weeks",
    format: "Live + projects",
    level: "Beginner",
    category: "Code",
    hue: "lime",
    outcomes: [
      "Write clean Python: functions, data structures, files",
      "Build and deploy a small web app",
      "Read documentation and debug independently",
    ],
    syllabus: [
      { week: "W1-2", title: "Python foundations", detail: "Variables, control flow, functions." },
      { week: "W3", title: "Data structures", detail: "Lists, dicts, sets and comprehension." },
      { week: "W4", title: "Files, APIs & JSON", detail: "Talk to the outside world." },
      { week: "W5-6", title: "Web basics", detail: "HTML, CSS, JavaScript and a Python backend." },
      { week: "W7-8", title: "Capstone", detail: "Build and deploy your own project." },
    ],
  },
  {
    id: "data-ml",
    tag: "DATA",
    title: "Data & machine learning essentials",
    blurb: "Understand data, models and evaluation — the logic behind intelligent products.",
    duration: "10 weeks",
    format: "Studio format",
    level: "Intermediate",
    category: "Data",
    hue: "violet",
    outcomes: [
      "Clean, explore and visualise real datasets",
      "Train and evaluate classical ML models",
      "Explain why a model works — or fails",
    ],
    syllabus: [
      { week: "W1-2", title: "Data wrangling", detail: "Pandas, cleaning and exploration." },
      { week: "W3-4", title: "Statistics that matter", detail: "Distributions, sampling and bias." },
      { week: "W5-6", title: "Supervised learning", detail: "Regression, classification and features." },
      { week: "W7", title: "Evaluation", detail: "Precision, recall, overfitting and validation." },
      { week: "W8-9", title: "Neural networks", detail: "Layers, weights and training intuition." },
      { week: "W10", title: "Capstone", detail: "An end-to-end ML project." },
    ],
  },
  {
    id: "robotics-101",
    tag: "ROBOTICS",
    title: "Robotics kit studio",
    blurb: "Sensors, circuits and Python — build a machine that responds to the world.",
    duration: "6 weeks",
    format: "Hands-on kit",
    level: "Beginner",
    category: "Robotics",
    hue: "cyan",
    outcomes: [
      "Wire sensors and motors safely",
      "Program control logic in Python",
      "Complete guided build challenges with your kit",
    ],
    syllabus: [
      { week: "W1", title: "Electronics 101", detail: "Circuits, components and safe prototyping." },
      { week: "W2", title: "Sensing the world", detail: "Distance, light and motion sensors." },
      { week: "W3", title: "Making it move", detail: "Motors, drivers and basic control." },
      { week: "W4", title: "Autonomy", detail: "Obstacle avoidance and simple decision logic." },
      { week: "W5", title: "Connected machines", detail: "Wireless control and remote signals." },
      { week: "W6", title: "Final mission", detail: "Complete a build challenge." },
    ],
  },
];

export const CATEGORIES: ("All" | Category)[] = ["All", "AI", "Code", "Data", "Robotics", "Leadership"];
export const LEVELS: ("Any level" | Level)[] = ["Any level", "Beginner", "Intermediate", "Advanced"];

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

export const PRODUCTS = [
  {
    id: "copilots",
    number: "01",
    title: "AI copilots",
    description:
      "Thoughtful, task-ready assistants that turn busywork into momentum — without losing the human in the loop.",
    points: ["Assistants scoped to one job and done well", "Human review built into the flow", "Works with the tools your team already uses"],
    hue: "lime",
  },
  {
    id: "workflow",
    number: "02",
    title: "Workflow intelligence",
    description:
      "Connect the dots across your tools, teams and data with systems that learn how work actually happens.",
    points: ["Map where time and effort really go", "Automate the repeatable, surface the exceptions", "Measure impact in hours saved, not buzzwords"],
    hue: "cyan",
  },
  {
    id: "labs",
    number: "03",
    title: "Applied labs",
    description:
      "From first prototype to production-grade system, we help bold teams ship AI that earns its place.",
    points: ["Rapid prototypes that earn their next step", "Evaluation and guardrails from day one", "Hand-over your team can maintain"],
    hue: "violet",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Selected work                                                       */
/* ------------------------------------------------------------------ */

export const SHOWCASE = [
  {
    title: "Shiv Shankar Jewellery",
    label: "Client build · jewellery storefront",
    description: "A live jewellery storefront designed to help customers explore gold and silver collections through a polished, mobile-friendly shopping experience.",
    tags: ["E-commerce", "Responsive web", "Netlify"],
    url: "https://shivshankarjewellery.netlify.app/",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Examination                                                         */
/* ------------------------------------------------------------------ */

export type Question = { q: string; options: string[]; answer: number; why: string };
export type ExamTrack = {
  id: string;
  title: string;
  duration: string;
  detail: string;
  level: string;
  questions: Question[];
};

export const EXAMS: ExamTrack[] = [
  {
    id: "ai-foundations",
    title: "AI Foundations",
    duration: "60 minutes",
    detail: "AI concepts, prompt thinking, and responsible use.",
    level: "Beginner",
    questions: [
      {
        q: "What does “LLM” stand for?",
        options: ["Linear Learning Method", "Large Language Model", "Logical Layer Matrix", "Limited Language Module"],
        answer: 1,
        why: "An LLM is a Large Language Model — a neural network trained on huge amounts of text to predict and generate language.",
      },
      {
        q: "In generative AI, what is a “prompt”?",
        options: ["The model's training dataset", "The input or instructions you give the model", "A security password", "The model's output length limit"],
        answer: 1,
        why: "A prompt is the input — instructions, context and examples — that you give the model to steer its response.",
      },
      {
        q: "What is an AI “hallucination”?",
        options: ["A slow response from the server", "The model refusing a request", "Confident-sounding output that is wrong or made up", "An image generated with too many colours"],
        answer: 2,
        why: "Models can produce fluent but incorrect or invented content, which is why important outputs should be verified.",
      },
      {
        q: "In supervised learning, a model learns from…",
        options: ["Labelled examples", "Random noise only", "Its own deleted files", "Human emotions"],
        answer: 0,
        why: "Supervised learning uses examples paired with the correct label or answer.",
      },
      {
        q: "Which is a responsible way to use AI at work?",
        options: ["Paste confidential data into any public tool", "Assume every answer is correct", "Check important outputs against reliable sources", "Hide that AI was used"],
        answer: 2,
        why: "Verification, privacy awareness and transparency are the basics of responsible AI use.",
      },
    ],
  },
  {
    id: "python-web",
    title: "Python + Web",
    duration: "90 minutes",
    detail: "Programming logic, web basics, and practical problem solving.",
    level: "Beginner–Intermediate",
    questions: [
      {
        q: "Which keyword defines a function in Python?",
        options: ["func", "function", "def", "lambda only"],
        answer: 2,
        why: "Python functions are defined with the def keyword.",
      },
      {
        q: "What does len([4, 8, 15]) return?",
        options: ["2", "3", "15", "27"],
        answer: 1,
        why: "len() returns the number of items in the list — here, 3.",
      },
      {
        q: "Which HTML tag is used for the main (largest) heading?",
        options: ["<head>", "<header>", "<h6>", "<h1>"],
        answer: 3,
        why: "<h1> is the top-level heading; <head> and <header> are different elements.",
      },
      {
        q: "In JavaScript, which array method adds an item to the end?",
        options: ["push()", "pop()", "shift()", "slice()"],
        answer: 0,
        why: "push() appends to the end; pop() removes the last item and shift() removes the first.",
      },
      {
        q: "What is display: flex mainly used for in CSS?",
        options: ["Encrypting text", "Laying out items along a row or column", "Adding a database", "Playing animations only"],
        answer: 1,
        why: "Flexbox is a one-dimensional layout system for arranging items in rows or columns.",
      },
    ],
  },
  {
    id: "builder-challenge",
    title: "Builder Challenge",
    duration: "120 minutes",
    detail: "A project-based assessment for advanced learners.",
    level: "Advanced",
    questions: [
      {
        q: "In an AI agent, what does “tool calling” mean?",
        options: [
          "The model asks your code to run a function and uses the result",
          "The model phones a human operator",
          "Compiling the model into an app",
          "Downloading extra training data",
        ],
        answer: 0,
        why: "With tool calling the model requests a function invocation with arguments; your code runs it and returns the result to the model.",
      },
      {
        q: "How does retrieval-augmented generation (RAG) help reduce hallucination?",
        options: ["It makes the model larger", "It grounds answers in retrieved documents", "It removes the prompt", "It lowers the temperature to zero always"],
        answer: 1,
        why: "RAG retrieves relevant source text and gives it to the model so answers can be grounded in real content.",
      },
      {
        q: "What is “overfitting”?",
        options: [
          "A model that performs well on training data but poorly on new data",
          "A model that is too small to train",
          "Training with too little electricity",
          "A dataset with too many columns",
        ],
        answer: 0,
        why: "Overfitting means the model memorised the training set instead of learning patterns that generalise.",
      },
      {
        q: "For a rare-event classifier (e.g. fraud, 1% positives), which metric is more informative than plain accuracy?",
        options: ["File size", "Precision and recall (F1)", "Number of epochs", "Model name length"],
        answer: 1,
        why: "A model that always predicts “no fraud” is 99% accurate but useless; precision/recall reveal how well rare cases are caught.",
      },
      {
        q: "What is a sensible first step before building an AI feature?",
        options: ["Pick the biggest model available", "Define the user problem and how you will measure success", "Write the marketing page", "Buy GPUs"],
        answer: 1,
        why: "Clear problem framing and a success measure keep projects useful and evaluable.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Assistant knowledge (rule-based site guide)                         */
/* ------------------------------------------------------------------ */

export type GuideReply = { text: string; links?: { label: string; href: string }[]; chips?: string[] };

type Intent = { keys: string[]; reply: GuideReply };

const INTENTS: Intent[] = [
  {
    keys: ["hello", "hi", "hey", "namaste", "start"],
    reply: {
      text: "Namaste! I'm the AI DUNIYA site guide. I can point you to courses, exams, labs and how to reach the team.",
      chips: ["Which course is right for me?", "Tell me about exams", "Robotics lab", "Contact the team"],
    },
  },
  {
    keys: ["course", "learn", "program", "cohort", "class", "syllabus", "beginner"],
    reply: {
      text: `We run live cohorts and studios — from AI fluency and generative-AI building to Python, data/ML, robotics and leadership. The next cohort starts ${SITE.nextCohort}. Not sure where to begin? Try the “Find your path” quiz on the home page.`,
      links: [
        { label: "Browse all courses", href: "/courses" },
        { label: "Find your path", href: "/#path" },
      ],
      chips: ["How do I enrol?", "Tell me about exams"],
    },
  },
  {
    keys: ["enrol", "enroll", "apply", "register", "join", "admission", "sign up"],
    reply: {
      text: "Open any course, hit “Apply for this cohort”, and send the short form — the team replies with cohort dates and next steps.",
      links: [{ label: "Choose a course", href: "/courses" }],
    },
  },
  {
    keys: ["fee", "price", "cost", "pricing", "payment", "free", "discount"],
    reply: {
      text: "Course fees are shared on enquiry so we can match you to the right cohort. Send a quick message and the team will reply with details.",
      links: [{ label: "Ask about fees", href: "/contact?topic=fees" }],
    },
  },
  {
    keys: ["exam", "test", "assessment", "certificate", "certification", "quiz", "practice"],
    reply: {
      text: "There are three tracks — AI Foundations (60 min), Python + Web (90 min) and Builder Challenge (120 min); each full exam includes a certificate. You can try a free 5-question practice round right on the Examination page.",
      links: [{ label: "Try a practice round", href: "/examination" }],
    },
  },
  {
    keys: ["robot", "robotics", "arduino", "sensor", "rover", "hardware", "kit"],
    reply: {
      text: "Robotics Labs is hands-on: electronics, embedded Python and guided build challenges, with kits for cohorts. You can drive a simulated obstacle-avoiding rover on the Robotics page.",
      links: [{ label: "Open Robotics Labs", href: "/labs/robotics" }],
    },
  },
  {
    keys: ["ai lab", "labs", "lab", "neural", "token", "prompt", "agent", "generative", "genai"],
    reply: {
      text: "AI Labs is where you experiment: a neural-network sandbox, a tokenizer and a prompt builder are ready to play with on the AI Labs page.",
      links: [{ label: "Open AI Labs", href: "/labs/ai" }, { label: "All labs", href: "/labs" }],
    },
  },
  {
    keys: ["business", "company", "team", "corporate", "enterprise", "consult", "strategy", "workshop"],
    reply: {
      text: "For teams we offer AI strategy & opportunity mapping, bespoke enablement, and prototypes that earn their next step.",
      links: [{ label: "Business overview", href: "/#business" }, { label: "Start a conversation", href: "/contact?topic=business" }],
    },
  },
  {
    keys: ["product", "copilot", "workflow", "automation", "automate"],
    reply: {
      text: "Our products: AI copilots, workflow intelligence and applied labs — focused on saving real time with humans in the loop.",
      links: [{ label: "See products", href: "/#products" }],
    },
  },
  {
    keys: ["contact", "email", "phone", "call", "reach", "address", "location", "office", "where", "hours"],
    reply: {
      text: `Email ${SITE.email}. The studio is in ${SITE.city}; hours are ${SITE.hours}.`,
      links: [{ label: "Open contact page", href: "/contact" }],
    },
  },
  {
    keys: ["about", "founder", "cofounder", "who", "piyush", "tushar", "story", "mission", "vision"],
    reply: {
      text: `AI DUNIYA is a learning and innovation studio co-founded by ${FOUNDERS.map((f) => f.name).join(" and ")}, built around one loop: Learn. Build. Improve. Repeat.`,
      links: [{ label: "Read our story", href: "/about" }],
    },
  },
  {
    keys: ["thanks", "thank", "great", "cool", "awesome"],
    reply: { text: "Happy to help! Ask me anything else about courses, exams or labs.", chips: ["Which course is right for me?", "Contact the team"] },
  },
];

export function guideAnswer(input: string): GuideReply {
  const text = input.toLowerCase();
  if (/which course|right for me|recommend|where (do|should) i (start|begin)/.test(text)) {
    return {
      text: "Answer two quick questions and I'll suggest a course that fits your goal and experience.",
      links: [{ label: "Find your path", href: "/#path" }],
    };
  }
  let best: { score: number; reply: GuideReply } | null = null;
  for (const intent of INTENTS) {
    let score = 0;
    for (const key of intent.keys) {
      if (key.length <= 3 ? new RegExp(`\\b${key}\\b`).test(text) : text.includes(key)) score += key.length > 4 ? 2 : 1;
    }
    if (score > 0 && (!best || score > best.score)) best = { score, reply: intent.reply };
  }
  if (best) return best.reply;
  return {
    text: "I'm a simple site guide, so I may miss that one. I can help with courses, exams, labs, business and contact details — or you can message the team directly.",
    links: [{ label: "Contact the team", href: "/contact" }],
    chips: ["Which course is right for me?", "Tell me about exams", "Robotics lab"],
  };
}
