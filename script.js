// Cursor glow effect
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor-glow');
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Particle animation in hero section
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 5 + 2}px;
            height: ${Math.random() * 5 + 2}px;
            background: rgba(108, 99, 255, ${Math.random() * 0.5});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            pointer-events: none;
            transform: translate(-50%, -50%);
        `;
        
        particlesContainer.appendChild(particle);
        
        animateParticle(particle);
    }
}

function animateParticle(particle) {
    const animation = particle.animate([
        {
            transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)`,
            opacity: Math.random()
        },
        {
            transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)`,
            opacity: Math.random()
        }
    ], {
        duration: Math.random() * 3000 + 2000,
        iterations: Infinity,
        direction: 'alternate',
        easing: 'ease-in-out'
    });
}

// Glitch effect for hero text
function createGlitchEffect() {
    const text = document.querySelector('.glitch-text');
    const originalText = text.textContent;
    
    setInterval(() => {
        if (Math.random() < 0.1) {
            text.style.textShadow = `
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px #ff0000,
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px #00ff00,
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px #0000ff
            `;
            
            setTimeout(() => {
                text.style.textShadow = 'none';
            }, 50);
        }
    }, 100);
}

// Intersection Observer for fade-in animations
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

// Apply fade-in animation to sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    createGlitchEffect();
});

// Add hover effect to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (y - centerY) / 20;
        const angleY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'none';
    });
});
