// Single source of truth for all portfolio content.
// Every entry below was carried over from the previous site (index.html / script.js)
// and cross-checked against Pankaj_Baduwal_Resume_Updated.pdf. Do not add unverified facts.

export const profile = {
  name: 'Pankaj Baduwal',
  firstName: 'Pankaj',
  lastName: 'Baduwal',
  roles: ['Full Stack MERN Developer', 'Generative AI Developer', 'IT Student', 'Problem Solver'],
  title: 'Full Stack MERN Developer & Generative AI Developer',
  tagline: 'Building scalable web apps, AI-powered platforms and data-driven solutions.',
  intro:
    'IT student and MERN Stack Developer with hands-on experience in full-stack development, AI-powered applications, and data-driven projects. Passionate about building scalable software using MERN Stack, LangChain, LLMs, and cloud technologies.',
  availability: 'Available for opportunities',
  location: 'Coimbatore, Tamil Nadu, India',
  locationShort: 'Coimbatore, India',
  coords: '11.02° N  76.96° E',
  email: 'baduwalpankaj@gmail.com',
  phone: '+91 6369376350',
  phoneHref: 'tel:+916369376350',
  whatsappHref: 'https://wa.me/916369376350',
  resume: '/docs/Pankaj_Baduwal_Resume.pdf',
  resumeFileName: 'Pankaj_Baduwal_Resume.pdf',
  photo: { card: '/img/card-photo.webp', cardJpg: '/img/card-photo.jpg', portrait: '/img/portrait.webp', portraitJpg: '/img/portrait.jpg' },
  institution: 'KPR Institute of Engineering and Technology',
  institutionShort: 'KPRIET',
  cardTech: ['MERN', 'LangChain', 'RAG', 'AWS'],
};

export const socials = [
  { label: 'GitHub', handle: 'github.com/PankajBaduwal', url: 'https://github.com/PankajBaduwal' },
  { label: 'LinkedIn', handle: 'linkedin.com/in/pankaj-baduwal', url: 'https://linkedin.com/in/pankaj-baduwal-408759281' },
  { label: 'LeetCode', handle: 'leetcode.com/u/pEVxkCZJyX', url: 'https://leetcode.com/u/pEVxkCZJyX/' },
  { label: 'Instagram', handle: '@pankajbaduwal', url: 'https://www.instagram.com/pankajbaduwal/' },
];

export const about = {
  heading: ['Passionate Developer', '& Lifelong Learner'],
  paragraphs: [
    'I am a B.Tech Information Technology student at KPR Institute of Engineering and Technology with a strong interest in Full Stack Development, Artificial Intelligence, and Generative AI.',
    'I enjoy solving real-world problems by building scalable web applications using the MERN Stack and integrating Large Language Models (LLMs), LangChain, Retrieval-Augmented Generation (RAG), and AI-powered automation into modern applications.',
    'I continuously improve my skills through internships, hackathons, certifications, and personal projects while preparing for Software Development Engineer (SDE) roles.',
  ],
  badges: ['B.Tech IT — KPRIET (8.5 CGPA)', 'Honors in AI & ML', 'Coimbatore, India', 'MERN Stack', 'Generative AI & LLMs', 'AWS Cloud'],
};

export const education = [
  {
    id: 'btech',
    degree: 'B.Tech in Information Technology',
    school: 'KPR Institute of Engineering and Technology',
    place: 'Coimbatore, India',
    period: '2023 – 2027',
    start: 2023,
    end: 2027,
    score: 'CGPA 8.5 / 10',
    status: 'Ongoing',
  },
  {
    id: 'honors',
    degree: 'Honors in Artificial Intelligence & Machine Learning',
    school: 'KPR Institute of Engineering and Technology',
    place: 'Coimbatore, India',
    period: '2024 – 2026',
    start: 2024,
    end: 2026,
    score: 'CGPA 8.5 / 10',
    status: 'Ongoing',
  },
  {
    id: 'plus2',
    degree: '+2 Computer Overseer',
    school: 'Dhambojhi Higher Secondary School',
    place: 'Nepal',
    period: '2019 – 2021',
    start: 2019,
    end: 2021,
    score: 'CGPA 3.33 / 4',
    status: 'Completed',
  },
];

export const skillCategories = [
  { id: 'languages', label: 'Languages', items: ['Java', 'JavaScript', 'Python', 'C'] },
  { id: 'frontend', label: 'Frontend', items: ['HTML', 'CSS', 'JavaScript', 'React', 'EJS'] },
  { id: 'backend', label: 'Backend', items: ['Node.js', 'Express.js', 'REST APIs'] },
  { id: 'database', label: 'Database', items: ['MongoDB', 'SQL'] },
  {
    id: 'cloud',
    label: 'Cloud & DevOps',
    items: ['AWS Cloud', 'Git', 'GitHub', { name: 'Docker', note: 'Learning' }, { name: 'Kubernetes', note: 'Learning' }, { name: 'CI/CD', note: 'Learning' }],
  },
  { id: 'genai', label: 'Gen AI', items: ['LangChain', 'OpenAI GPT', 'Gemini API', 'Prompt Engineering', 'RAG', 'AI Chatbots'] },
  { id: 'data', label: 'Data Science', items: ['Data Analysis', 'Machine Learning', 'NLP Basics', 'Tableau', 'Power BI', 'Data Visualization'] },
  { id: 'tools', label: 'Tools', items: ['Postman', 'VS Code', 'Git', 'GitHub'] },
  { id: 'soft', label: 'Soft Skills', items: ['Leadership', 'Teamwork', 'Communication', 'Adaptability', 'Consistency', 'Problem Solving'] },
];

export const services = [
  { id: 'web', title: 'Web Development', desc: 'Responsive, SEO-friendly, performance-optimised websites and web apps using modern frameworks and best practices.' },
  { id: 'software', title: 'Software Development', desc: 'Building scalable and robust software applications tailored to solve complex business problems.' },
  { id: 'mern', title: 'React & MERN Stack', desc: 'Full-stack applications built with MongoDB, Express, React and Node.js — scalable and production-ready.' },
  { id: 'uiux', title: 'UI/UX Design', desc: 'Designing intuitive, modern, and engaging user interfaces focused on exceptional user experiences.' },
  { id: 'ecommerce', title: 'E-Commerce Development', desc: 'Building secure and efficient e-commerce platforms that drive sales and provide excellent shopping experiences.' },
  { id: 'agentic', title: 'ML & Agentic AI Development', desc: 'Developing intelligent autonomous agents, machine learning models, and RAG systems using LangChain, OpenAI, and Gemini.' },
  { id: 'chatbot', title: 'AI Chatbot Development', desc: 'Custom AI-powered chatbots and conversational apps to automate customer support and engagement.' },
  { id: 'dataviz', title: 'Data Visualisation', desc: 'Interactive dashboards and analytical reports using Power BI, Tableau, Matplotlib, and Plotly.' },
  { id: 'api', title: 'API Development', desc: 'RESTful APIs, middleware design, and comprehensive API documentation for seamless integrations.' },
];

// `motif` selects the illustrated cover (see components/ProjectCover.jsx).
export const featuredProjects = [
  {
    id: 'hiresphere',
    title: 'HireSphere',
    subtitle: 'AI Recruitment Platform',
    category: 'fullstack',
    categoryLabel: 'Full-Stack / AI',
    motif: 'recruit',
    summary: 'AI-powered recruitment platform with candidate matching, resume parsing, proctored assessments, and smart hiring workflows.',
    desc: 'An AI-powered recruitment platform that streamlines the hiring process for recruiters and candidates. It includes automated resume parsing, AI candidate matching, and proctored technical assessments.',
    tags: ['React', 'Node.js', 'MongoDB', 'Gemini API', 'Express'],
    features: [
      'AI-driven resume parsing and skill extraction',
      'Automated candidate ranking based on job descriptions',
      'Anti-cheat proctored assessment module',
      'Real-time recruiter dashboard and analytics',
    ],
    github: 'https://github.com/PankajBaduwal/HireSphere',
  },
  {
    id: 'campusconnect',
    title: 'CampusConnect',
    subtitle: 'Student Social Platform',
    category: 'fullstack',
    categoryLabel: 'Full-Stack',
    motif: 'campus',
    summary: 'Campus networking platform with posts, polls, anonymous Q&A, and AI campus chatbot for students and faculty.',
    desc: 'A dedicated social networking platform for college campuses. Students can share posts, conduct polls, ask questions anonymously, and interact with an AI campus assistant.',
    tags: ['Node.js', 'Express', 'MongoDB', 'EJS', 'Socket.io'],
    features: [
      'User authentication and profile management',
      'Real-time feed with posts, likes, and comments',
      'Anonymous Q&A section for student queries',
      'Integrated AI chatbot for campus-related information',
    ],
    github: 'https://github.com/PankajBaduwal/CampusConnect-',
  },
  {
    id: 'herbsphere',
    title: 'HerbSphere',
    subtitle: 'Medicinal Plant Encyclopedia',
    category: 'web',
    categoryLabel: 'Web',
    motif: 'botanical',
    summary: 'Searchable digital guide to medicinal plants with detailed info on uses, benefits, and preparation methods — sourced from AYUSH.',
    desc: 'A comprehensive digital guide dedicated to medicinal and useful plants. Provides detailed information on plant uses, health benefits, and preparation methods sourced from AYUSH.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    features: [
      'Search functionality to find plants by ailment or name',
      'Categorized exploration of medicinal herbs',
      'Responsive and highly accessible UI design',
      'Educational resources validated by reliable sources',
    ],
    github: 'https://github.com/PankajBaduwal/Herbsphere',
  },
  {
    id: 'interviewai',
    title: 'InterviewPreparationAI',
    subtitle: 'AI Interview Preparation',
    category: 'ml',
    categoryLabel: 'ML / AI',
    motif: 'interview',
    summary: 'AI-powered interview prep tool using GPT-4.1 for tailored questions, match scoring, skill-gap analysis, and personalised study roadmaps.',
    desc: 'An AI-powered interview preparation tool that leverages GPT-4.1 to provide tailored interview questions, skill-gap analysis, and personalized study roadmaps based on user profiles.',
    tags: ['JavaScript', 'GPT-4.1 API', 'Node.js'],
    features: [
      'Dynamic generation of technical and behavioral questions',
      'Automated response evaluation and feedback',
      'Personalized learning paths to bridge skill gaps',
      'Match scoring against specific job descriptions',
    ],
    github: 'https://github.com/PankajBaduwal/-InterviewPreparationAI-',
  },
  {
    id: 'aapagpt',
    title: 'AAPAGPT',
    subtitle: 'ChatGPT Clone',
    category: 'fullstack',
    categoryLabel: 'Full-Stack / AI',
    motif: 'chat',
    summary: 'Full-stack MERN-based ChatGPT replica using OpenAI API with real-time chat history and markdown rendering.',
    desc: 'A full-stack replica of ChatGPT built using the MERN stack and OpenAI API. Features a conversational interface with real-time chat history and markdown rendering.',
    tags: ['React', 'Node.js', 'MongoDB', 'OpenAI API'],
    features: [
      'Seamless integration with OpenAI language models',
      'Persistent chat history stored in MongoDB',
      'Markdown and code block rendering support',
      'Responsive conversational UI',
    ],
    github: 'https://github.com/PankajBaduwal/AAPAGPT',
  },
  {
    id: 'swsdochub',
    title: 'SWS AI Document Hub',
    subtitle: 'AI Document Platform',
    category: 'fullstack',
    categoryLabel: 'Full-Stack',
    motif: 'documents',
    summary: 'AI-powered document management and analysis platform built with JavaScript for smart document processing.',
    desc: 'An AI-powered document management and analysis platform. Enables users to upload, organize, and perform intelligent search and summarization on their documents.',
    tags: ['JavaScript', 'Node.js', 'AI Integration'],
    features: [
      'Secure document upload and storage',
      'AI-driven text extraction and summarization',
      'Intelligent search across document contents',
      'Clean, intuitive user interface',
    ],
    github: 'https://github.com/PankajBaduwal/SwsAiDocumentHub',
  },
];

export const projectFilters = [
  { id: 'all', label: 'All' },
  { id: 'fullstack', label: 'Full-Stack' },
  { id: 'web', label: 'Web' },
  { id: 'ml', label: 'ML / AI' },
];

export const otherProjects = [
  { name: 'SuperMarketBillingSystem', lang: 'Java', desc: 'Console billing app with admin and customer logins, product catalogue, cart, payments, coupons and invoices.' },
  { name: 'LibraryManagementSystem', lang: 'Java', desc: 'Console library app with admin and borrower roles, book search, borrow and return, fines and reports.' },
  { name: 'PersonalManager', lang: 'JavaScript', desc: 'A personal productivity and task management app.' },
  { name: 'Track4', lang: 'TypeScript', desc: 'A TypeScript-based music tracking and discovery application.' },
  { name: 'HandTracking', lang: 'Python', desc: 'Real-time hand tracking and gesture recognition using OpenCV and MediaPipe.' },
  { name: 'BigData-OCC', lang: 'Python', desc: 'Big Data processing and exploratory data analysis project.' },
  { name: 'ChatBoat', lang: 'JavaScript', desc: 'A simple chatbot application interface.' },
  { name: 'GithubClone', lang: 'JavaScript', desc: 'A frontend clone of the GitHub repository interface.' },
  { name: '3DPoftfilo', lang: 'JavaScript', desc: 'A 3D interactive portfolio implementation.' },
  { name: 'RestaurantWebsite', lang: 'JavaScript', desc: 'A responsive frontend template for a restaurant.' },
  { name: 'Y3tiSecUpdatedWebsite', lang: 'JavaScript', desc: 'Updated website for a cybersecurity platform.' },
  { name: 'DhambojhiSchool-', lang: 'JavaScript', desc: 'School website frontend project.' },
  { name: 'chiyapream', lang: 'JavaScript', desc: 'A Nepali tea-themed beautiful UI website.' },
  { name: 'DemoWebsite', lang: 'JavaScript', desc: 'Demo website platform implementation.' },
  { name: 'Firstphase', lang: 'TypeScript', desc: 'First phase implementation of an undisclosed project.' },
  { name: 'portfolio', lang: 'HTML', desc: 'Previous version of personal portfolio.' },
  { name: 'OCC_Assignment', lang: 'Jupyter', desc: 'Data science assignments and computations.' },
  { name: 'ImageClassifier', lang: 'Jupyter', desc: 'Machine learning model for image classification.' },
  { name: 'blank-app', lang: 'Python', desc: 'Starter template application in Python.' },
  { name: 'Collaborative_ToDo', lang: 'JavaScript', desc: 'A collaborative real-time to-do list application.' },
  { name: 'Posture_detection', lang: 'JavaScript', desc: 'Web-based posture detection using ML models.' },
  { name: 'Zerodha_clone', lang: 'JavaScript', desc: 'Frontend clone of the Zerodha trading platform.' },
  { name: 'Image-Processing-', lang: 'Python', desc: 'Various image processing scripts and algorithms.' },
  { name: 'Car-Price-Predict', lang: 'Jupyter', desc: 'ML model to predict car prices based on features.' },
  { name: 'Music-Recommend-System-', lang: 'Jupyter', desc: 'Music recommendation based on singer name and genre.' },
  { name: '-Airbnb-Clone-MERN-Stack-', lang: 'JavaScript', desc: 'Full-stack Airbnb clone using MongoDB, Express, React, Node.' },
  { name: 'Melody-Generate', lang: 'Python', desc: 'Music generation using LSTM neural networks.' },
  { name: 'Music-Recommendation-', lang: 'Python', desc: 'Music recommendation system based on facial expressions/emotions.' },
  { name: 'Zerodha', lang: 'HTML', desc: 'Zerodha UI implementation attempts.' },
  { name: 'CommunityClassroom-git', lang: 'HTML', desc: 'Open source contributions for Community Classroom.' },
  { name: 'PankajBaduwal', lang: 'Markdown', desc: 'GitHub profile README configuration.' },
].map((r) => ({ ...r, url: `https://github.com/PankajBaduwal/${r.name}` }));

export const githubReposUrl = 'https://github.com/PankajBaduwal?tab=repositories';

export const experience = [
  {
    role: 'Web Development Intern',
    org: 'MotionCut',
    where: 'Remote',
    period: 'June 2025 – September 2025',
    desc: 'Worked with the HR Manager on real-world web development tasks, contributed to development activities, and successfully completed a 3-month internship.',
  },
  {
    role: 'Computer Operator',
    org: 'Synnet International Pvt. Ltd.',
    where: 'Nepal',
    period: '2021 – 2023',
    desc: 'Provided IT support, data management, document handling, and maintained system operations and security.',
  },
  {
    role: 'Computer Trainee (OJT)',
    org: 'IT Hub Nepalgunj Pvt. Ltd.',
    where: 'Nepal',
    period: '2019 – 2022',
    desc: 'Completed mandatory OJT covering networking, hardware, cloud computing, HTML/CSS, CCTV installation, troubleshooting, and system maintenance.',
  },
  {
    role: 'Trainee',
    org: 'Universal Institute of Computer',
    where: 'Nepal',
    period: '2019 – 2020',
    desc: 'Worked on troubleshooting, database updates, technical support, and computer maintenance.',
  },
];

// `image` points to the holder's own certificate/badge files (personal data excluded).
// `verify` is only set where the verification URL appears on the original certificate.
// `key` marks the certifications shown on the site and résumé; the rest stay listed here for reference.
export const certifications = [
  { provider: 'Cisco', title: 'CCNA: Introduction to Networks', issuer: 'Cisco', image: '/img/certs/ccna-itn.webp', key: true },
  { provider: 'Cisco', title: 'CCNA: Switching, Routing & Wireless Essentials', issuer: 'Cisco', image: '/img/certs/ccna-srwe.webp', key: true },
  { provider: 'Cisco', title: 'CCNA: Enterprise Networking, Security & Automation', issuer: 'Cisco', image: '/img/certs/ccna-ensa.webp', key: true },
  { provider: 'Cisco', title: 'Python Essentials 1', issuer: 'Cisco / Python Institute', image: '/img/certs/python-essentials.webp', key: true },
  { provider: 'AWS', title: 'AWS Academy Cloud Foundations', issuer: 'AWS Academy', image: '/img/certs/aws-cf.webp', verify: 'https://www.credly.com/go/hBFRpZHw', key: true },
  { provider: 'MongoDB University', title: 'MongoDB for Students', issuer: 'MongoDB University', image: '/img/certs/mongodb-students.webp', key: true },
  { provider: 'Infosys Springboard', title: 'Data Science', issuer: 'Infosys Springboard', image: '/img/certs/infosys-ds.webp', key: true },
  { provider: 'Infosys Springboard', title: 'Agile Scrum', issuer: 'Infosys Springboard', image: '/img/certs/infosys-agile.webp' },
  { provider: 'Infosys Springboard', title: 'Business Intelligence', issuer: 'Infosys Springboard', image: '/img/certs/infosys-bi.webp' },
  { provider: 'Infosys Springboard', title: 'ER Modeling', issuer: 'Infosys Springboard', image: '/img/certs/infosys-er.webp' },
  { provider: 'Infosys Springboard', title: 'Power BI', issuer: 'Infosys Springboard' },
  { provider: 'Infosys Springboard', title: 'Data Visualization', issuer: 'Infosys Springboard' },
  { provider: 'Infosys Springboard', title: 'SQL', issuer: 'Infosys Springboard' },
  { provider: 'Infosys Springboard', title: 'Analytics', issuer: 'Infosys Springboard' },
  { provider: 'freeCodeCamp', title: 'JavaScript Algorithms and Data Structures', issuer: 'freeCodeCamp', image: '/img/certs/fcc-js.webp', key: true },
  { provider: 'OpenClassrooms', title: 'Tableau Dashboards', issuer: 'OpenClassrooms' },
  { provider: 'OpenClassrooms', title: 'SQL', issuer: 'OpenClassrooms' },
  { provider: 'Great Learning', title: 'Front End Development — HTML', issuer: 'Great Learning', image: '/img/certs/gl-html.webp' },
  { provider: 'Simplilearn', title: 'Business Analytics with Excel', issuer: 'Simplilearn', image: '/img/certs/simplilearn-excel.webp' },
];

// `mark` is the short display marker; it repeats the placement exactly as stated in the title.
export const achievements = [
  { title: 'KPRIET International Student Council Hackathon', result: '1st Place', mark: '1st', level: 'College Level · October 2026', kind: 'tech', image: '/img/achievements/kpriet-hackathon.webp', featured: true, short: 'KPRIET Hackathon' },
  { title: 'Intel GenAI National Hackathon', result: 'Top 25 Finalist', mark: 'Top 25', level: 'National Level', kind: 'tech', image: '/img/achievements/intel-genai.webp' },
  { title: 'Science Day Tech Showcase (Solar IoT)', result: '3rd Place', mark: '3rd', level: 'College Level', kind: 'tech', image: '/img/achievements/science-day.webp' },
  { title: 'InnovSense Tech Fest', result: 'Participant', mark: 'Participant', level: 'Tech Festival', kind: 'tech', image: '/img/achievements/innovsense.webp' },
  { title: 'GCC X Shift 2025 Hackathon', result: 'Participant', mark: 'Participant', level: 'Hackathon', kind: 'tech' },
  { title: 'Hostel Day Cricket Tournament (Captain)', result: 'Winner', mark: 'Winner', level: 'Sports', kind: 'sport' },
  { title: 'PSG Premier League Cricket Tournament', result: 'Winner', mark: 'Winner', level: 'Sports', kind: 'sport' },
  { title: 'College Sports Week Powerlifting', result: '3rd Place', mark: '3rd', level: 'Sports', kind: 'sport' },
  { title: 'Hostel Day Powerlifting', result: '2nd Place', mark: '2nd', level: 'Sports', kind: 'sport' },
];

export const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
];

export const site = {
  url: 'https://pankajbaduwal.vercel.app',
  // Optional form backend (Formspree, Web3Forms, Getform… any endpoint accepting JSON POST).
  contactEndpoint: import.meta.env.VITE_CONTACT_ENDPOINT || '',
  web3formsKey: import.meta.env.VITE_WEB3FORMS_KEY || '',
};
