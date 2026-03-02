// ===================================
// WebGL/Three.js Implementation
// ===================================

// Check if Three.js is loaded
if (typeof THREE === 'undefined') {
    console.error('Three.js not loaded!');
} else {
    // Initialize WebGL Scene
    initWebGL();
}

function initWebGL() {
    // Scene Setup
    const canvas = document.getElementById('webgl-canvas');
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Colors
    const primaryColor = new THREE.Color(0x667eea);
    const secondaryColor = new THREE.Color(0x764ba2);

    // ===================================
    // Particle System (Background)
    // ===================================
    const particleCount = 2000;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesPositions = new Float32Array(particleCount * 3);
    const particlesColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        particlesPositions[i] = (Math.random() - 0.5) * 100;
        particlesPositions[i + 1] = (Math.random() - 0.5) * 100;
        particlesPositions[i + 2] = (Math.random() - 0.5) * 50;

        const color = Math.random() > 0.5 ? primaryColor : secondaryColor;
        particlesColors[i] = color.r;
        particlesColors[i + 1] = color.g;
        particlesColors[i + 2] = color.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(particlesColors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // ===================================
    // 3D Rotating Logo (AE Style)
    // ===================================
    // Create a torus knot as logo base (like AE logo)
    const logoGeometry = new THREE.TorusKnotGeometry(3, 0.8, 128, 32);
    const logoMaterial = new THREE.MeshPhongMaterial({
        color: primaryColor,
        emissive: secondaryColor,
        emissiveIntensity: 0.3,
        shininess: 100,
        transparent: true,
        opacity: 0.9
    });
    const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
    logoMesh.position.set(-15, 5, -10);
    scene.add(logoMesh);

    // Add wireframe overlay
    const wireframeGeometry = new THREE.TorusKnotGeometry(3.1, 0.85, 128, 32);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    wireframeMesh.position.copy(logoMesh.position);
    scene.add(wireframeMesh);

    // ===================================
    // Floating 3D Cards
    // ===================================
    const cardGroup = new THREE.Group();
    scene.add(cardGroup);

    // Card data
    const cardData = [
        { title: 'تصميم المواقع', icon: '💻', x: 12, y: 8, z: -5, color: 0x667eea },
        { title: 'تطوير المواقع', icon: '⚡', x: 15, y: 0, z: -8, color: 0x764ba2 },
        { title: 'تصميم واجهات', icon: '🎨', x: 10, y: -6, z: -3, color: 0x4facfe },
        { title: 'المونتاج', icon: '🎬', x: 18, y: -4, z: -10, color: 0x00f2fe }
    ];

    const cards = [];

    cardData.forEach((data, index) => {
        // Card base
        const cardGeometry = new THREE.BoxGeometry(4, 2.5, 0.3);
        const cardMaterial = new THREE.MeshPhongMaterial({
            color: data.color,
            transparent: true,
            opacity: 0.8,
            shininess: 50
        });
        const card = new THREE.Mesh(cardGeometry, cardMaterial);

        card.position.set(data.x, data.y, data.z);
        card.userData = {
            originalY: data.y,
            rotationSpeed: 0.005 + Math.random() * 0.005,
            floatSpeed: 0.002 + Math.random() * 0.002,
            floatOffset: Math.random() * Math.PI * 2
        };

        cards.push(card);
        cardGroup.add(card);

        // Card glow
        const glowGeometry = new THREE.BoxGeometry(4.2, 2.7, 0.1);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: data.color,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.z = -0.2;
        card.add(glow);
    });

    // ===================================
    // Geometric Shapes (Decoration)
    // ===================================
    // Floating icosahedrons
    const shapes = [];
    const shapePositions = [
        { x: -20, y: -10, z: -15 },
        { x: 25, y: 10, z: -20 },
        { x: -10, y: 15, z: -12 },
        { x: 20, y: -8, z: -18 }
    ];

    shapePositions.forEach((pos, index) => {
        const geometry = new THREE.IcosahedronGeometry(1.5, 0);
        const material = new THREE.MeshPhongMaterial({
            color: index % 2 === 0 ? primaryColor : secondaryColor,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        });
        const shape = new THREE.Mesh(geometry, material);
        shape.position.set(pos.x, pos.y, pos.z);
        shape.userData = {
            rotationSpeed: 0.01 + Math.random() * 0.01,
            floatSpeed: 0.001 + Math.random() * 0.001,
            originalY: pos.y,
            floatOffset: Math.random() * Math.PI * 2
        };
        shapes.push(shape);
        scene.add(shape);
    });

    // ===================================
    // Lights
    // ===================================
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(primaryColor, 1, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(secondaryColor, 1, 100);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    const spotLight = new THREE.SpotLight(0xffffff, 0.5);
    spotLight.position.set(0, 20, 20);
    scene.add(spotLight);

    // ===================================
    // Mouse Interaction
    // ===================================
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) / 100;
        mouseY = (event.clientY - windowHalfY) / 100;
    });

    // ===================================
    // Animation Loop
    // ===================================
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Smooth camera movement with mouse parallax
        targetX += (mouseX - targetX) * 0.05;
        targetY += (-mouseY - targetY) * 0.05;

        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (targetY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        // Rotate logo (AE style)
        logoMesh.rotation.x += 0.005;
        logoMesh.rotation.y += 0.01;
        wireframeMesh.rotation.x += 0.005;
        wireframeMesh.rotation.y += 0.01;

        // Animate cards
        cards.forEach((card, index) => {
            // Floating animation
            card.position.y = card.userData.originalY + Math.sin(elapsedTime + card.userData.floatOffset) * 0.5;

            // Gentle rotation
            card.rotation.y = Math.sin(elapsedTime * 0.5 + index) * 0.1;
            card.rotation.x = Math.cos(elapsedTime * 0.3 + index) * 0.05;

            // Mouse interaction - cards follow mouse slightly
            card.position.x += (mouseX * 0.5 - (card.position.x - card.userData.originalX)) * 0.02;
        });

        // Animate shapes
        shapes.forEach((shape) => {
            shape.rotation.x += shape.userData.rotationSpeed;
            shape.rotation.y += shape.userData.rotationSpeed;
            shape.position.y = shape.userData.originalY + Math.sin(elapsedTime + shape.userData.floatOffset) * 1;
        });

        // Animate particles
        particles.rotation.y += 0.0005;
        particles.rotation.x += 0.0002;

        // Pulse logo
        const scale = 1 + Math.sin(elapsedTime * 2) * 0.02;
        logoMesh.scale.set(scale, scale, scale);

        renderer.render(scene, camera);
    }

    animate();

    // ===================================
    // Window Resize Handler
    // ===================================
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ===================================
// Original Functionality (Preserved)
// ===================================

// Preloader
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('hidden');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navList = document.querySelector('.nav-list');

if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handling
const contactForm = document.querySelector('form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.querySelector('input[placeholder="اسمك"]');
        const email = document.querySelector('input[placeholder="البريد الإلكتروني"]');
        const message = document.querySelector('textarea');

        if (name && email && message && name.value && email.value && message.value) {
            alert('شكراً لك! تم إرسال رسالتك بنجاح.');
            this.reset();
        } else {
            alert('يرجى ملء جميع الحقول.');
        }
    });
}

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
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
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
});

// ===================================
// Dark/Light Theme Toggle
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            body.classList.toggle('light-theme');

            // Update icon
            if (body.classList.contains('light-theme')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                localStorage.setItem('theme', 'light');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
});

// ===================================
// Language Toggle (Arabic/English)
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const langToggle = document.getElementById('lang-toggle');
    const html = document.documentElement;

    const translations = {
        ar: {
            home: 'الرئيسية', about: 'عني', services: 'الخدمات', contact: 'تواصل معي',
            heroSubtitle: 'مرحباً بك في', heroText: 'أصمم تجارب رقمية استثنائية.',
            contactBtn: 'تواصل معي', projects: 'مشروع منجز', years: 'سنوات خبرة', satisfaction: 'رضا العملاء',
            servicesSubtitle: 'ماذا أقدم', servicesTitle: 'خدماتي',
            webDesign: 'تصميم المواقع', webDesignDesc: 'تصميم مواقع ويب عصرية.',
            responsive: 'تصميم متجاوب', responsiveDesc: 'مواقع تعمل على جميع الأجهزة.',
            uiDesign: 'تصميم واجهات', uiDesignDesc: 'تصميم واجهات سهلة وعصرية.',
            performance: 'تحسين الأداء', performanceDesc: 'تحسين سرعة الموقع.',
            aboutSubtitle: 'من أنا', aboutTitle: 'مصمم مواقع محترف',
            aboutText1: 'مصمم مواقع ويب متحمس ومبدع.', aboutText2: 'أستخدم أحدث التقنيات.',
            skillsSubtitle: 'مهاراتي', skillsTitle: 'المهارات',
            programming: 'البرمجة', programmingDesc: 'خبرة في HTML, CSS, JavaScript.',
            graphicDesign: 'التصميم الجرافيكي', graphicDesignDesc: 'تصميم جرافيكي.',
            editing: 'المونتاج', editingDesc: 'مونتاج فيديوهات.',
            contactSubtitle: 'تواصل معي', contactTitle: 'أخبرني عن مشروعك',
            email: 'البريد الإلكتروني', phone: 'الهاتف', location: 'الموقع',
            formName: 'اسمك', formEmail: 'البريد الإلكتروني', formSubject: 'الموضوع', formMessage: 'الرسالة',
            sendBtn: 'إرسال الرسالة', footerText: 'أصمم تجارب رقمية استثنائية',
            quickLinks: 'روابط سريعة', footerServices: 'الخدمات', copyright: 'جميع الحقوق محفوظة', loading: 'جاري التحميل...'
        },
        en: {
            home: 'Home', about: 'About', services: 'Services', contact: 'Contact',
            heroSubtitle: 'Welcome to', heroText: 'I design exceptional digital experiences.',
            contactBtn: 'Contact Me', projects: 'Completed Project', years: 'Years Experience', satisfaction: 'Client Satisfaction',
            servicesSubtitle: 'What I Offer', servicesTitle: 'My Services',
            webDesign: 'Web Design', webDesignDesc: 'Modern website designs.',
            responsive: 'Responsive Design', responsiveDesc: 'Websites for all devices.',
            uiDesign: 'UI Design', uiDesignDesc: 'User-friendly interfaces.',
            performance: 'Performance', performanceDesc: 'Website speed optimization.',
            aboutSubtitle: 'Who I Am', aboutTitle: 'Professional Web Designer',
            aboutText1: 'Enthusiastic web designer.', aboutText2: 'Using latest technologies.',
            skillsSubtitle: 'My Skills', skillsTitle: 'Skills',
            programming: 'Programming', programmingDesc: 'HTML, CSS, JavaScript.',
            graphicDesign: 'Graphic Design', graphicDesignDesc: 'Graphic design.',
            editing: 'Video Editing', editingDesc: 'Video editing.',
            contactSubtitle: 'Contact Me', contactTitle: 'Tell Me About Your Project',
            email: 'Email', phone: 'Phone', location: 'Location',
            formName: 'Your Name', formEmail: 'Email Address', formSubject: 'Subject', formMessage: 'Message',
            sendBtn: 'Send Message', footerText: 'Digital Experiences',
            quickLinks: 'Quick Links', footerServices: 'Services', copyright: 'All Rights Reserved', loading: 'Loading...'
        }
    };

    const savedLang = localStorage.getItem('language') || 'ar';
    if (savedLang) applyLanguage(savedLang);

    if (langToggle) {
        langToggle.addEventListener('click', function() {
            const currentLang = html.getAttribute('lang') || 'ar';
            const newLang = currentLang === 'ar' ? 'en' : 'ar';
            applyLanguage(newLang);
            localStorage.setItem('language', newLang);
        });
    }

    function applyLanguage(lang) {
        const t = translations[lang];
        html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        html.setAttribute('lang', lang);

        const langAr = langToggle.querySelector('.lang-ar');
        const langEn = langToggle.querySelector('.lang-en');
        if (lang === 'ar') { langAr.classList.add('active'); langEn.classList.remove('active'); }
        else { langAr.classList.remove('active'); langEn.classList.add('active'); }

        const navLinks = document.querySelectorAll('.nav-link');
        if (navLinks[0]) navLinks[0].textContent = t.home;
        if (navLinks[1]) navLinks[1].textContent = t.about;
        if (navLinks[2]) navLinks[2].textContent = t.services;
        if (navLinks[3]) navLinks[3].textContent = t.contact;

        document.querySelector('.hero-subtitle').textContent = t.heroSubtitle;
        document.querySelector('.hero-text').textContent = t.heroText;
        document.querySelector('.hero-buttons .btn span').textContent = t.contactBtn;

        const statTexts = document.querySelectorAll('.stat-text');
        if (statTexts[0]) statTexts[0].textContent = t.projects;
        if (statTexts[1]) statTexts[1].textContent = t.years;
        if (statTexts[2]) statTexts[2].textContent = t.satisfaction;

        document.querySelector('.services .section-subtitle').textContent = t.servicesSubtitle;
        document.querySelector('.services .section-title').textContent = t.servicesTitle;

        const serviceCards = document.querySelectorAll('.service-card');
        if (serviceCards[0]) { serviceCards[0].querySelector('h3').textContent = t.webDesign; serviceCards[0].querySelector('p').textContent = t.webDesignDesc; }
        if (serviceCards[1]) { serviceCards[1].querySelector('h3').textContent = t.responsive; serviceCards[1].querySelector('p').textContent = t.responsiveDesc; }
        if (serviceCards[2]) { serviceCards[2].querySelector('h3').textContent = t.uiDesign; serviceCards[2].querySelector('p').textContent = t.uiDesignDesc; }
        if (serviceCards[3]) { serviceCards[3].querySelector('h3').textContent = t.performance; serviceCards[3].querySelector('p').textContent = t.performanceDesc; }

        document.querySelector('.about .section-subtitle').textContent = t.aboutSubtitle;
        document.querySelector('.about .section-title').textContent = t.aboutTitle;
        const aboutPs = document.querySelectorAll('.about-text p');
        if (aboutPs[0]) aboutPs[0].textContent = t.aboutText1;
        if (aboutPs[1]) aboutPs[1].textContent = t.aboutText2;

        document.querySelector('.skills .section-subtitle').textContent = t.skillsSubtitle;
        document.querySelector('.skills .section-title').textContent = t.skillsTitle;

        const skillCards = document.querySelectorAll('.skill-card');
        if (skillCards[0]) { skillCards[0].querySelector('h3').textContent = t.programming; skillCards[0].querySelector('p').textContent = t.programmingDesc; }
        if (skillCards[1]) { skillCards[1].querySelector('h3').textContent = t.graphicDesign; skillCards[1].querySelector('p').textContent = t.graphicDesignDesc; }
        if (skillCards[2]) { skillCards[2].querySelector('h3').textContent = t.editing; skillCards[2].querySelector('p').textContent = t.editingDesc; }

        document.querySelector('.contact .section-subtitle').textContent = t.contactSubtitle;
        document.querySelector('.contact .section-title').textContent = t.contactTitle;

        const contactDetails = document.querySelectorAll('.contact-details');
        if (contactDetails[0]) contactDetails[0].querySelector('h4').textContent = t.email;
        if (contactDetails[1]) contactDetails[1].querySelector('h4').textContent = t.phone;
        if (contactDetails[2]) contactDetails[2].querySelector('h4').textContent = t.location;

        document.querySelector('.footer-logo p').textContent = t.footerText;
        document.querySelector('.footer-links h4').textContent = t.quickLinks;
        document.querySelector('.footer-services h4').textContent = t.footerServices;
        document.querySelector('.footer-bottom p').textContent = '© AMR ESSAM. ' + t.copyright;

        document.querySelector('.loader-text').textContent = t.loading;
    }
});
