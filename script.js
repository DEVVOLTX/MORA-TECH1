// Smooth scrolling for navigation links
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Form submission handling
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.querySelector('input[placeholder="اسمك"]').value;
    const email = document.querySelector('input[placeholder="بريدك الإلكتروني"]').value;
    const message = document.querySelector('textarea').value;

    if (name && email && message) {
        alert('شكراً لك! تم إرسال رسالتك بنجاح.');
        this.reset();
    } else {
        alert('يرجى ملء جميع الحقول.');
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for animation
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effect to project cards
    document.querySelectorAll('.project').forEach(project => {
        project.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        project.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-content h1');
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }

    setTimeout(typeWriter, 1000);
});
