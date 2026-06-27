const typingText = document.getElementById('typingText'); 
const navToggle = document.getElementById('navToggle'); 
const siteHeader = document.querySelector('.site-header'); 
const overlay = document.getElementById('pageOverlay'); 
const navLinks = document.querySelectorAll('.main-nav a'); 
const sections = document.querySelectorAll('main section'); 
const form = document.getElementById('contactForm');
const aboutText =document.querySelector('.about-copy');
const themeToggle = document.getElementById("themeToggle");
const icon = themeToggle.querySelector("i");

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        icon.className = "fa-solid fa-sun";
        themeToggle.title = "Light mode";

    } else {

        icon.className = "fa-solid fa-moon";
        themeToggle.title = "Dark mode";

    }

});


if (aboutText) {

    aboutText.classList.remove('in-view');

    void aboutText.offsetWidth;

    setTimeout(() => {
        aboutText.classList.add('in-view');
    }, 300);

}


const lines = [
     'I build AI solutions.',
     'I create intelligent systems.',
     'I love Python development.',
     'I solve real-world problems.' 
    ];
    let lineIndex = 0; 
    let letterIndex = 0; 
    let isRemoving = false;

    function updateTyping() { 
        const currentLine = lines[lineIndex];
         if (!isRemoving) {
            letterIndex++; 
            typingText.textContent = currentLine.slice(0, letterIndex);
            if (letterIndex === currentLine.length) { 
                isRemoving = true; 
                setTimeout(updateTyping, 1600);
                return; }
                } else { 
                    letterIndex--; 
                    typingText.textContent = currentLine.slice(0, letterIndex); 
                    if (letterIndex === 0) { 
                        isRemoving = false; 
                        lineIndex = (lineIndex + 1) % lines.length; 
                    }
                 } 
                 setTimeout(updateTyping, isRemoving ? 60 : 100);
                }
    function openNavigation() {
        siteHeader.classList.add('nav-open'); 
        navToggle.setAttribute('aria-expanded', 'true'); 
        overlay.style.opacity = '1'; 
        overlay.style.pointerEvents = 'all';
    }

    function closeNavigation() {
        siteHeader.classList.remove('nav-open'); 
        navToggle.setAttribute('aria-expanded', 'false'); 
        overlay.style.opacity = '0'; 
        overlay.style.pointerEvents = 'none';
    }

    navToggle.addEventListener('click', () => { 
        const expanded = navToggle.getAttribute('aria-expanded') === 'true'; 
        if (expanded) {
             closeNavigation(); 
            } else { 
                openNavigation(); 
            } 
        });

    overlay.addEventListener('click', closeNavigation); 
    
    navLinks.forEach((link) => {

    link.addEventListener('click', (event) => {

        event.preventDefault();

        const targetId = link.getAttribute('href');

        const target = document.querySelector(targetId);

        // ABOUT animation
        if (targetId === '#about') {

            const aboutImage =
                document.querySelector('.about-media');

            if (aboutImage) {

                // Remove animation class
                aboutImage.classList.remove('in-view');

                // Force browser reflow
                void aboutImage.offsetWidth;

                // Add animation again
                setTimeout(() => {
                    aboutImage.classList.add('in-view');
                }, 300);

            }

        }

        if (target) {

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

        }

        closeNavigation();

    });

});

    function revealSections() { 
         const revealItems = document.querySelectorAll(
    '.section-heading, .about-media, .about-copy, .skill-card, .experience-card, .project-card, .contact-card, .contact-form'
);
    const observer = new IntersectionObserver((entries) => {

            entries.forEach((entry) => {

        if (entry.isIntersecting) {

            entry.target.classList.add('in-view');

        }

    });

}, {
    threshold: 0.3
});

revealItems.forEach((item) => {
    observer.observe(item);
});


window.addEventListener('scroll', () => {
    highlightNav();
});
        }

    function highlightNav() { 
        const scrollPosition = window.scrollY + 120; 
        sections.forEach((section) => { 
            const top = section.offsetTop;
            const height = section.offsetHeight; 
            const link = document.querySelector(`.main-nav a[href="#${section.id}"]`); 
            if (!link) return; 
            if (scrollPosition >= top && scrollPosition < top + height) { 
                link.classList.add('active'); 
            } else {
                link.classList.remove('active');
            } 
        });
    }

    window.addEventListener('scroll', () => { 
        revealSections(); 
        highlightNav(); 
    });

    window.addEventListener("load", () => {

    if (document.body.classList.contains("dark")) {

        icon.className = "fa-solid fa-sun";
        themeToggle.title = "Light mode";

    }

});

    window.addEventListener('keydown', (event) => { 
        if (event.key === 'Escape') {
            closeNavigation(); 
        } 
    });
    
    form.addEventListener('submit', (event) => { 
        event.preventDefault(); 
        const feedback = document.getElementById('formFeedback'); 
        feedback.textContent = 'Thanks for reaching out! I will get back to you soon.'; 
        form.reset(); 
    });

    document.addEventListener('DOMContentLoaded', () => { 
        updateTyping(); 
        //revealSections(); 
        highlightNav(); 
    });

