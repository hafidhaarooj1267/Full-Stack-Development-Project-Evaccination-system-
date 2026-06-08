// ========== FRONTEND JAVASCRIPT ==========
// For pages: index.html, how-it-works.html, blog.html, services.html, login.html, register.html
function toggleMenu() {
  document.getElementById("nav-links").classList.toggle("show");
}
// ========== 1. COUNTER ANIMATION ==========
function animateCounter(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    element.innerText = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Trigger counters when visible
const statsSection = document.querySelector('.stats-banner');
let animated = false;
if (statsSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        const count1 = document.getElementById('count1');
        const count2 = document.getElementById('count2');
        const count3 = document.getElementById('count3');
        const count4 = document.getElementById('count4');
        if (count1) animateCounter(count1, 0, 12840, 2000);
        if (count2) animateCounter(count2, 0, 164, 1500);
        if (count3) animateCounter(count3, 0, 45600, 2200);
        if (count4) animateCounter(count4, 0, 9870, 2000);
      }
    });
  }, { threshold: 0.3 });
  observer.observe(statsSection);
}

// ========== 2. FAQ TOGGLE ==========
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  if (question) {
    question.addEventListener('click', () => {
      item.classList.toggle('active');
      const icon = item.querySelector('.fa-chevron-down');
      if (icon) {
        if (item.classList.contains('active')) {
          icon.style.transform = 'rotate(180deg)';
        } else {
          icon.style.transform = 'rotate(0deg)';
        }
      }
    });
  }
});

// ========== 3. LOGIN FORM (localStorage demo) ==========
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value;
    const errorDiv = document.getElementById('loginError');

    if (!email || !password || !role) {
      errorDiv.innerText = 'Please fill all fields and select role.';
      return;
    }

    localStorage.setItem('userRole', role);
    localStorage.setItem('userEmail', email);

    if (role === 'parent') {
      window.location.href = 'parent-dashboard.html';
    } else if (role === 'hospital') {
      window.location.href = 'hospital-dashboard.html';
    } else if (role === 'admin') {
      window.location.href = 'admin-dashboard.html';
    }
  });
}

// ========== 4. REGISTER FORM ==========
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  // Animated bubbles
  function createBubbles() {
    const container = document.getElementById('bubbles');
    if (!container) return;
    for (let i = 0; i < 20; i++) {
      let bubble = document.createElement('div');
      bubble.classList.add('bubble');
      let size = Math.random() * 80 + 20;
      bubble.style.width = size + 'px';
      bubble.style.height = size + 'px';
      bubble.style.left = Math.random() * 100 + '%';
      bubble.style.animationDuration = Math.random() * 8 + 6 + 's';
      bubble.style.animationDelay = Math.random() * 5 + 's';
      container.appendChild(bubble);
    }
  }
  createBubbles();

  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value;
    const msgDiv = document.getElementById('registerMsg');

    if (!fullname || !email || !phone || !password || !role) {
      msgDiv.innerText = 'All fields are required.';
      return;
    }
    if (password.length < 4) {
      msgDiv.innerText = 'Password must be at least 4 characters.';
      return;
    }

    let users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (users.find(u => u.email === email)) {
      msgDiv.innerText = 'Email already registered. Please login.';
      return;
    }
    users.push({ fullname, email, phone, role, password });
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    localStorage.setItem('userRole', role);
    localStorage.setItem('userEmail', email);

    msgDiv.style.color = '#28A745';
    msgDiv.innerText = 'Registration successful! Redirecting...';
    setTimeout(() => {
      if (role === 'parent') window.location.href = 'parent-dashboard.html';
      else if (role === 'hospital') window.location.href = 'hospital-dashboard.html';
      else window.location.href = 'login.html';
    }, 1200);
  });
}

// ========== 5. LOGOUT FUNCTION ==========
function logout() {
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
  alert('Logged out safely');
  window.location.href = 'login.html';
}

// ========== 6. FLOATING SHAPES FOR BACKEND PAGES ==========
function createFloatingShapes() {
  const container = document.getElementById('floatingShapes');
  if (!container) return;
  container.innerHTML = '';
  const shapes = ['shape-1', 'shape-2', 'shape-3', 'shape-4'];
  shapes.forEach(shape => {
    const div = document.createElement('div');
    div.className = shape;
    container.appendChild(div);
  });
}

// Initialize floating shapes if element exists
if (document.getElementById('floatingShapes')) {
  createFloatingShapes();
}