// Enhanced JavaScript for Portfolio Website
document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const header = document.querySelector('header');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const scrollTop = document.getElementById('scrollTop');
    const professionElement = document.getElementById('rotating-profession');
    const aboutBtn = document.querySelector('.about-btn');

    // Updated Features

    // 1. Download CV Button Click Handler
    aboutBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        const cvLink = aboutBtn.getAttribute('href');
        if (cvLink) {
            const anchor = document.createElement('a');
            anchor.href = cvLink;
            anchor.download = 'Pankaj_Baduwal_CV.pdf';
            anchor.click();
        }
    });

    // 2. Dynamic Particle Effect on Click
    document.addEventListener('click', (e) => {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.background = 'rgba(236, 72, 153, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.left = `${e.clientX}px`;
        particle.style.top = `${e.clientY}px`;
        particle.style.pointerEvents = 'none';
        particle.style.animation = 'fadeOut 1s ease-out forwards';
        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 1000);
    });

    // 3. Scroll Progress Bar
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '5px';
    progressBar.style.background = 'var(--primary)';
    progressBar.style.width = '0';
    progressBar.style.zIndex = '9999';
    progressBar.style.transition = 'width 0.2s ease';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${scrollPercent}%`;
    });

    // 4. Navbar Auto-Hide on Scroll Down
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollY = currentScrollY;
    });

    // 5. Rotating Professions (Typewriter Effect)
    const professions = [
        'Full-Stack Developer',
        'Frontend Engineer',
        'Backend Developer',
        'Machine Learning Enthusiast',
        'Data Visualization Specialist',
        'Data Analyst',
        'UI/UX Enthusiast',
        'Problem Solver',
        'Tech Innovator',
    ];
    let professionIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 150;

    function typeWriter() {
        if (!professionElement) return;

        const currentProfession = professions[professionIndex];

        if (isDeleting) {
            professionElement.innerHTML =
                "I'm a " + currentProfession.substring(0, charIndex - 1) + '<span class="cursor">|</span>';
            charIndex--;
            typingSpeed = 75;
        } else {
            professionElement.innerHTML =
                "I'm a " + currentProfession.substring(0, charIndex + 1) + '<span class="cursor">|</span>';
            charIndex++;
            typingSpeed = 150;
        }

        if (!isDeleting && charIndex === currentProfession.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            professionIndex = (professionIndex + 1) % professions.length;
            typingSpeed = 500; // Pause before next word
        }

        setTimeout(typeWriter, typingSpeed);
    }

    // Initialize Typewriter Effect
    typeWriter();

    // 6. Scroll-to-Top Button Visibility
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTop.classList.add('visible');
        } else {
            scrollTop.classList.remove('visible');
        }
    });

    scrollTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Initialize Scroll Progress Bar
    progressBar.style.width = '0';
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page loaded in ${pageLoadTime}ms`);
        }, 0);
    });
}

// Error handling
window.addEventListener('error', (event) => {
    console.error('JavaScript Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
});

// Service Worker Registration (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment if you have a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}