// ========================
// Initialize AOS (Animate On Scroll)
// ========================
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50
    });
});

// ========================
// Loader
// ========================
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('hidden');
    }, 800);
});

// ========================
// Navbar scroll + hamburger
// ========================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }
    highlightActiveLink();
    handleBackToTop();
});

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = navLinks.classList.contains('open') ? 'rotate(45deg) translateY(7px)' : '';
        spans[1].style.opacity = navLinks.classList.contains('open') ? '0' : '';
        spans[2].style.transform = navLinks.classList.contains('open') ? 'rotate(-45deg) translateY(-7px)' : '';
    });

    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        });
    });
}

// Active nav link highlight
function highlightActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 120;
    
    sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        
        if (link) {
            link.classList.toggle('active', scrollY >= top && scrollY < top + height);
        }
    });
}

// ========================
// Back to Top Button
// ========================
const backToTopBtn = document.getElementById('backToTop');

function handleBackToTop() {
    if (backToTopBtn) {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
}

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================
// Typing Effect
// ========================
const roles = ['Full Stack MERN Developer', 'Generative AI Developer', 'IT Student', 'Problem Solver'];
let roleIdx = 0, charIdx = 0, deleting = false;
const typingEl = document.getElementById('typingText');

function typeLoop() {
    if (!typingEl) return;
    
    const current = roles[roleIdx];
    if (deleting) {
        typingEl.textContent = current.slice(0, --charIdx);
    } else {
        typingEl.textContent = current.slice(0, ++charIdx);
    }
    
    let delay = deleting ? 45 : 90;
    if (!deleting && charIdx === current.length) { 
        delay = 1800; 
        deleting = true; 
    } else if (deleting && charIdx === 0) { 
        deleting = false; 
        roleIdx = (roleIdx + 1) % roles.length; 
        delay = 400; 
    }
    
    setTimeout(typeLoop, delay);
}
typeLoop();

// ========================
// Counter Animation
// ========================
function animateCounter(el) {
    const target = +el.dataset.target;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    
    const interval = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + '+';
        if (current === target) clearInterval(interval);
    }, 30);
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const nums = entry.target.querySelectorAll('.num');
            nums.forEach(num => {
                if (!num.classList.contains('counted')) {
                    num.classList.add('counted');
                    animateCounter(num);
                }
            });
        }
    });
}, { threshold: 0.5 });

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) observer.observe(statsGrid);
const heroImageWrap = document.querySelector('.hero-image-wrap');
if (heroImageWrap) observer.observe(heroImageWrap);

// ========================
// Skills Filtering (9 Categories)
// ========================
const skillTabs = document.querySelectorAll('.skills-tabs .tab-btn');
const skillChips = document.querySelectorAll('.skill-chip');

skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        skillTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.cat;
        
        skillChips.forEach(chip => {
            if (filter === 'all' || chip.dataset.cat === filter) {
                chip.classList.remove('hidden');
                // Brief reflow to trigger transition if needed
                void chip.offsetWidth; 
                chip.style.opacity = '1';
                chip.style.transform = 'scale(1)';
            } else {
                chip.classList.add('hidden');
                chip.style.opacity = '0';
                chip.style.transform = 'scale(0.8)';
            }
        });
    });
});

// ========================
// Featured Projects Filtering
// ========================
const projFilters = document.querySelectorAll('.filter-btn');
const projCards = document.querySelectorAll('.projects-grid .project-card');

projFilters.forEach(btn => {
    btn.addEventListener('click', () => {
        projFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        
        projCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter || card.dataset.category.includes(filter)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ========================
// All 35 Projects Data & Modal
// ========================

// 1. Featured Projects Data (Full detail for modal)
const featuredProjectsData = {
    hiresphere: {
        title: 'HireSphere — AI Recruitment Platform',
        category: 'Full-Stack / AI',
        desc: 'An AI-powered recruitment platform that streamlines the hiring process for recruiters and candidates. It includes automated resume parsing, AI candidate matching, and proctored technical assessments.',
        tags: ['React', 'Node.js', 'MongoDB', 'Gemini API', 'Express'],
        links: [
            { label: 'GitHub', url: 'https://github.com/PankajBaduwal/HireSphere', type: 'gh' }
        ],
        features: [
            'AI-driven resume parsing and skill extraction',
            'Automated candidate ranking based on job descriptions',
            'Anti-cheat proctored assessment module',
            'Real-time recruiter dashboard and analytics'
        ]
    },
    campusconnect: {
        title: 'CampusConnect — Student Social Platform',
        category: 'Full-Stack',
        desc: 'A dedicated social networking platform for college campuses. Students can share posts, conduct polls, ask questions anonymously, and interact with an AI campus assistant.',
        tags: ['Node.js', 'Express', 'MongoDB', 'EJS', 'Socket.io'],
        links: [
            { label: 'GitHub', url: 'https://github.com/PankajBaduwal/CampusConnect-', type: 'gh' }
        ],
        features: [
            'User authentication and profile management',
            'Real-time feed with posts, likes, and comments',
            'Anonymous Q&A section for student queries',
            'Integrated AI chatbot for campus-related information'
        ]
    },
    herbsphere: {
        title: 'HerbSphere — Medicinal Plant Encyclopedia',
        category: 'Web',
        desc: 'A comprehensive digital guide dedicated to medicinal and useful plants. Provides detailed information on plant uses, health benefits, and preparation methods sourced from AYUSH.',
        tags: ['HTML', 'CSS', 'JavaScript'],
        links: [
            { label: 'GitHub', url: 'https://github.com/PankajBaduwal/Herbsphere', type: 'gh' }
        ],
        features: [
            'Search functionality to find plants by ailment or name',
            'Categorized exploration of medicinal herbs',
            'Responsive and highly accessible UI design',
            'Educational resources validated by reliable sources'
        ]
    },
    interviewai: {
        title: 'InterviewPreparationAI',
        category: 'ML / AI',
        desc: 'An AI-powered interview preparation tool that leverages GPT-4.1 to provide tailored interview questions, skill-gap analysis, and personalized study roadmaps based on user profiles.',
        tags: ['JavaScript', 'GPT-4.1 API', 'Node.js'],
        links: [
            { label: 'GitHub', url: 'https://github.com/PankajBaduwal/-InterviewPreparationAI-', type: 'gh' }
        ],
        features: [
            'Dynamic generation of technical and behavioral questions',
            'Automated response evaluation and feedback',
            'Personalized learning paths to bridge skill gaps',
            'Match scoring against specific job descriptions'
        ]
    },
    aapagpt: {
        title: 'AAPAGPT — ChatGPT Clone',
        category: 'Full-Stack / AI',
        desc: 'A full-stack replica of ChatGPT built using the MERN stack and OpenAI API. Features a conversational interface with real-time chat history and markdown rendering.',
        tags: ['React', 'Node.js', 'MongoDB', 'OpenAI API'],
        links: [
            { label: 'GitHub', url: 'https://github.com/PankajBaduwal/AAPAGPT', type: 'gh' }
        ],
        features: [
            'Seamless integration with OpenAI language models',
            'Persistent chat history stored in MongoDB',
            'Markdown and code block rendering support',
            'Responsive conversational UI'
        ]
    },
    swsdochub: {
        title: 'SWS AI Document Hub',
        category: 'Full-Stack',
        desc: 'An AI-powered document management and analysis platform. Enables users to upload, organize, and perform intelligent search and summarization on their documents.',
        tags: ['JavaScript', 'Node.js', 'AI Integration'],
        links: [
            { label: 'GitHub', url: 'https://github.com/PankajBaduwal/SwsAiDocumentHub', type: 'gh' }
        ],
        features: [
            'Secure document upload and storage',
            'AI-driven text extraction and summarization',
            'Intelligent search across document contents',
            'Clean, intuitive user interface'
        ]
    }
};

// 2. All Remaining 30 Projects Data
const otherProjectsData = [
    { name: 'PersonalManager', lang: 'JavaScript', desc: 'A personal productivity and task management app.', url: 'https://github.com/PankajBaduwal/PersonalManager' },
    { name: 'Track4', lang: 'TypeScript', desc: 'A TypeScript-based music tracking and discovery application.', url: 'https://github.com/PankajBaduwal/Track4' },
    { name: 'HandTracking', lang: 'Python', desc: 'Real-time hand tracking and gesture recognition using OpenCV and MediaPipe.', url: 'https://github.com/PankajBaduwal/HandTracking' },
    { name: 'BigData-OCC', lang: 'Python', desc: 'Big Data processing and exploratory data analysis project.', url: 'https://github.com/PankajBaduwal/BigData-OCC' },
    { name: 'ChatBoat', lang: 'JavaScript', desc: 'A simple chatbot application interface.', url: 'https://github.com/PankajBaduwal/ChatBoat' },
    { name: 'GithubClone', lang: 'JavaScript', desc: 'A frontend clone of the GitHub repository interface.', url: 'https://github.com/PankajBaduwal/GithubClone' },
    { name: '3DPoftfilo', lang: 'JavaScript', desc: 'A 3D interactive portfolio implementation.', url: 'https://github.com/PankajBaduwal/3DPoftfilo' },
    { name: 'RestaurantWebsite', lang: 'JavaScript', desc: 'A responsive frontend template for a restaurant.', url: 'https://github.com/PankajBaduwal/RestaurantWebsite' },
    { name: 'Y3tiSecUpdatedWebsite', lang: 'JavaScript', desc: 'Updated website for a cybersecurity platform.', url: 'https://github.com/PankajBaduwal/Y3tiSecUpdatedWebsite' },
    { name: 'DhambojhiSchool-', lang: 'JavaScript', desc: 'School website frontend project.', url: 'https://github.com/PankajBaduwal/DhambojhiSchool-' },
    { name: 'chiyapream', lang: 'JavaScript', desc: 'A Nepali tea-themed beautiful UI website.', url: 'https://github.com/PankajBaduwal/chiyapream' },
    { name: 'DemoWebsite', lang: 'JavaScript', desc: 'Demo website platform implementation.', url: 'https://github.com/PankajBaduwal/DemoWebsite' },
    { name: 'Firstphase', lang: 'TypeScript', desc: 'First phase implementation of an undisclosed project.', url: 'https://github.com/PankajBaduwal/Firstphase' },
    { name: 'portfolio', lang: 'HTML', desc: 'Previous version of personal portfolio.', url: 'https://github.com/PankajBaduwal/portfolio' },
    { name: 'OCC_Assignment', lang: 'Jupyter', desc: 'Data science assignments and computations.', url: 'https://github.com/PankajBaduwal/OCC_Assignment' },
    { name: 'ImageClassifier', lang: 'Jupyter', desc: 'Machine learning model for image classification.', url: 'https://github.com/PankajBaduwal/ImageClassifier' },
    { name: 'blank-app', lang: 'Python', desc: 'Starter template application in Python.', url: 'https://github.com/PankajBaduwal/blank-app' },
    { name: 'Collaborative_ToDo', lang: 'JavaScript', desc: 'A collaborative real-time to-do list application.', url: 'https://github.com/PankajBaduwal/Collaborative_ToDo' },
    { name: 'Posture_detection', lang: 'JavaScript', desc: 'Web-based posture detection using ML models.', url: 'https://github.com/PankajBaduwal/Posture_detection' },
    { name: 'Zerodha_clone', lang: 'JavaScript', desc: 'Frontend clone of the Zerodha trading platform.', url: 'https://github.com/PankajBaduwal/Zerodha_clone' },
    { name: 'Image-Processing-', lang: 'Python', desc: 'Various image processing scripts and algorithms.', url: 'https://github.com/PankajBaduwal/Image-Processing-' },
    { name: 'Car-Price-Predict', lang: 'Jupyter', desc: 'ML model to predict car prices based on features.', url: 'https://github.com/PankajBaduwal/Car-Price-Predict' },
    { name: 'Music-Recommend-System-', lang: 'Jupyter', desc: 'Music recommendation based on singer name and genre.', url: 'https://github.com/PankajBaduwal/Music-Recommend-System-' },
    { name: '-Airbnb-Clone-MERN-Stack-', lang: 'JavaScript', desc: 'Full-stack Airbnb clone using MongoDB, Express, React, Node.', url: 'https://github.com/PankajBaduwal/-Airbnb-Clone-MERN-Stack-' },
    { name: 'Melody-Generate', lang: 'Python', desc: 'Music generation using LSTM neural networks.', url: 'https://github.com/PankajBaduwal/Melody-Generate' },
    { name: 'Music-Recommendation-', lang: 'Python', desc: 'Music recommendation system based on facial expressions/emotions.', url: 'https://github.com/PankajBaduwal/Music-Recommendation-' },
    { name: 'Zerodha', lang: 'HTML', desc: 'Zerodha UI implementation attempts.', url: 'https://github.com/PankajBaduwal/Zerodha' },
    { name: 'CommunityClassroom-git', lang: 'HTML', desc: 'Open source contributions for Community Classroom.', url: 'https://github.com/PankajBaduwal/CommunityClassroom-git' },
    { name: 'PankajBaduwal', lang: 'Markdown', desc: 'GitHub profile README configuration.', url: 'https://github.com/PankajBaduwal/PankajBaduwal' }
];

// Populate "Other Projects" Grid
const otherProjectsGrid = document.getElementById('otherProjectsGrid');
if (otherProjectsGrid) {
    otherProjectsData.forEach(repo => {
        const card = document.createElement('div');
        card.className = 'other-project-card';
        card.innerHTML = `
            <h4>${repo.name}</h4>
            <p class="op-desc">${repo.desc || 'No description provided.'}</p>
            <div class="op-meta">
                ${repo.lang ? `<span class="op-lang">${repo.lang}</span>` : '<span></span>'}
                <a href="${repo.url}" target="_blank" class="op-link">GitHub ↗</a>
            </div>
        `;
        otherProjectsGrid.appendChild(card);
    });
}

// ========================
// Modal Logic for Featured Projects
// ========================
const modalOverlay = document.getElementById('projectModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalHeader = document.getElementById('modalHeader');
const modalBody = document.getElementById('modalBody');

document.querySelectorAll('.project-readmore').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const pId = btn.dataset.project;
        const data = featuredProjectsData[pId];
        if (!data) return;
        
        let tagsHtml = data.tags.map(t => `<span class="tag">${t}</span>`).join('');
        
        let linksHtml = data.links.map(l => {
            const isLive = l.type === 'live';
            const cls = isLive ? 'project-link live' : 'project-link gh';
            const icon = isLive ? '↗' : `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.09-.74.08-.73.08-.73 1.21.09 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013-.4 11.5 11.5 0 013 .4c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>`;
            return `<a href="${l.url}" class="${cls}" target="_blank">${icon} ${l.label}</a>`;
        }).join('');
        
        let featsHtml = data.features.map(f => `<li>${f}</li>`).join('');
        
        modalHeader.innerHTML = `
            <span class="modal-category-badge">${data.category}</span>
            <h2>${data.title}</h2>
            <div class="modal-tags">${tagsHtml}</div>
            <div class="modal-links">${linksHtml}</div>
        `;
        
        modalBody.innerHTML = `
            <div class="modal-section">
                <h3><span class="ms-icon">📝</span> Overview</h3>
                <p>${data.desc}</p>
            </div>
            <div class="modal-section">
                <h3><span class="ms-icon">✨</span> Key Features</h3>
                <ul>${featsHtml}</ul>
            </div>
        `;
        
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ========================
// Contact Form Submission
// ========================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const origText = btn.textContent;
        
        btn.textContent = 'Sending...';
        btn.disabled = true;
        
        // Simulate sending
        setTimeout(() => {
            btn.textContent = 'Message Sent! ✓';
            btn.style.background = 'var(--success)';
            contactForm.reset();
            
            setTimeout(() => {
                btn.textContent = origText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }, 1500);
    });
}
