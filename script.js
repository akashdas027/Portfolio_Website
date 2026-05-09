document.addEventListener('DOMContentLoaded', () => {

  // ===================================
  // 1. DYNAMIC STARFIELD BACKGROUND
  // ===================================
  const starfield = document.getElementById('starfield');
  const ctx = starfield.getContext('2d');

  function resizeCanvas() {
    starfield.width = window.innerWidth;
    starfield.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const mouse = { x: starfield.width / 2, y: starfield.height / 2 };
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  const stars = [];
  const numStars = 500;

  class Star {
    constructor() {
      this.x = Math.random() * starfield.width;
      this.y = Math.random() * starfield.height;
      this.z = Math.random() * starfield.width; // Depth
      this.size = Math.random() * 2 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.5;
    }

    update() {
      this.z -= 0.5;
      if (this.z < 1) {
        this.z = starfield.width;
        this.x = Math.random() * starfield.width;
        this.y = Math.random() * starfield.height;
      }
    }

    draw() {
      const sx = (this.x - starfield.width / 2) * (starfield.width / this.z) + starfield.width / 2;
      const sy = (this.y - starfield.height / 2) * (starfield.width / this.z) + starfield.height / 2;
      const r = this.size * (starfield.width / this.z);

      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < numStars; i++) {
    stars.push(new Star());
  }

  function animateStarfield() {
    ctx.clearRect(0, 0, starfield.width, starfield.height);

    // Draw "Nebula" mouse follower
    const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 100);
    const theme = document.body.getAttribute('data-theme');
    const nebulaColor = theme === 'dark' ? 'rgba(58, 134, 255, 0.15)' : 'rgba(106, 137, 204, 0.15)';
    gradient.addColorStop(0, nebulaColor);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, starfield.width, starfield.height);

    stars.forEach(star => {
      star.update();
      star.draw();
    });

    requestAnimationFrame(animateStarfield);
  }
  animateStarfield();

  // ===================================
  // 2. THEME TOGGLE
  // ===================================
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  const savedTheme = localStorage.getItem('theme') || 'dark';
  body.setAttribute('data-theme', savedTheme);
  themeToggle.classList.toggle('fa-sun', savedTheme === 'dark');
  themeToggle.classList.toggle('fa-moon', savedTheme !== 'dark');

  themeToggle.addEventListener('click', () => {
    let currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.classList.toggle('fa-sun');
    themeToggle.classList.toggle('fa-moon');
  });

  // ===================================
  // 3. NAVBAR & MOBILE MENU
  // ===================================
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  }));

  // ===================================
  // 4. SCROLL-BASED FADE-IN ANIMATIONS
  // ===================================
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('section').forEach(section => observer.observe(section));

  // ===================================
  // 5. 3D INTERACTIVE CARD TILT EFFECT
  // ===================================
  const interactiveCards = document.querySelectorAll('.interactive-card');
  interactiveCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });

  // ===================================
  // 6. CONTACT FORM VALIDATION
  // ===================================
  const form = document.getElementById('contact-form');
  if (form) {
    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const messageEl = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    form.addEventListener('submit', e => {
      e.preventDefault();
      let isValid = true;

      nameError.textContent = '';
      emailError.textContent = '';
      messageError.textContent = '';
      
      if (nameEl.value.trim() === '') {
        nameError.textContent = 'Name is required.';
        isValid = false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
        emailError.textContent = 'A valid email is required.';
        isValid = false;
      }
      if (messageEl.value.trim().length < 10) {
        messageError.textContent = 'Message must be at least 10 characters.';
        isValid = false;
      }
      
      if (isValid) {
        alert('Thank you! Your message has been sent.');
        form.reset();
      }
    });
  }

  // ===================================
  // 7. SCROLL TO TOP BUTTON
  // ===================================
  const scrollTopBtn = document.getElementById('scroll-top');
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  });
});