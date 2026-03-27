/* =====================================================
   PRIYANSHU KUMAR CHOUDHARY — PORTFOLIO SCRIPT
   Space background + n8n connectors + animations
===================================================== */

// ============================================================
// 1. LOADING SCREEN
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loaderBar');
  const loaderText = document.getElementById('loaderText');
  const messages = ['LOADING NODES...', 'CONNECTING PIPELINE...', 'BOOTING UNIVERSE...', 'READY TO LAUNCH!'];
  let progress = 0;
  let msgIdx = 0;

  // Animate loader canvas with star particles
  const lCanvas = document.getElementById('loaderCanvas');
  const lCtx = lCanvas.getContext('2d');
  lCanvas.width = window.innerWidth;
  lCanvas.height = window.innerHeight;

  const lStars = Array.from({ length: 200 }, () => ({
    x: Math.random() * lCanvas.width,
    y: Math.random() * lCanvas.height,
    r: Math.random() * 1.5,
    a: Math.random(),
    speed: Math.random() * 0.5 + 0.2
  }));

  function drawLoaderStars() {
    lCtx.clearRect(0, 0, lCanvas.width, lCanvas.height);
    lStars.forEach(s => {
      lCtx.globalAlpha = s.a;
      lCtx.fillStyle = '#fff';
      lCtx.beginPath();
      lCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      lCtx.fill();
      s.a += (Math.random() - 0.5) * 0.02;
      s.a = Math.max(0.1, Math.min(1, s.a));
    });
    lCtx.globalAlpha = 1;
    if (loader.style.display !== 'none') requestAnimationFrame(drawLoaderStars);
  }
  drawLoaderStars();

  // Progress bar fill
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress > 100) progress = 100;
    loaderBar.style.width = progress + '%';

    // Change text at intervals
    if (progress > 25 && msgIdx === 0) { loaderText.textContent = messages[1]; msgIdx = 1; }
    if (progress > 60 && msgIdx === 1) { loaderText.textContent = messages[2]; msgIdx = 2; }
    if (progress >= 100 && msgIdx === 2) {
      loaderText.textContent = messages[3];
      msgIdx = 3;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(() => { loader.style.display = 'none'; }, 800);
        // Start all animations after loader hides
        initApp();
      }, 600);
    }
  }, 120);
});

// ============================================================
// 2. INIT APP — called after loader
// ============================================================
function initApp() {
  initSpaceBackground();
  initCursor();
  initNavbar();
  initTyping();
  initConnectors();
  initReveal();
  initSkillBars();
  initBackToTop();
  initMobileMenu();
  initFormSubmit();
}

// ============================================================
// 3. SPACE BACKGROUND — parallax stars, planets, nebulae
// ============================================================
function initSpaceBackground() {
  const canvas = document.getElementById('spaceCanvas');
  const ctx = canvas.getContext('2d');

  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  let mouseX = W / 2, mouseY = H / 2;
  let targetX = W / 2, targetY = H / 2;

  // Generate stars with depth layers
  const layers = [
    { count: 120, r: 0.5, speed: 0.005, opacity: 0.3 },  // far
    { count: 80,  r: 1,   speed: 0.015, opacity: 0.5 },  // mid
    { count: 40,  r: 1.5, speed: 0.03,  opacity: 0.8 },  // near
  ];

  const stars = [];
  layers.forEach(l => {
    for (let i = 0; i < l.count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        ox: Math.random() * W,  // original x
        oy: Math.random() * H,  // original y
        r: l.r + Math.random() * 0.5,
        speed: l.speed,
        opacity: l.opacity * (0.7 + Math.random() * 0.3),
        twinkle: Math.random() * Math.PI * 2
      });
    }
  });

  // Floating planets
  const planets = [
    { x: W * 0.15, y: H * 0.2, r: 28, color: '#1e3a5f', glow: 'rgba(30,58,95,0.4)', speed: 0.008, ox: W*0.15, oy: H*0.2 },
    { x: W * 0.85, y: H * 0.35, r: 18, color: '#2d1b4e', glow: 'rgba(124,58,237,0.3)', speed: 0.012, ox: W*0.85, oy: H*0.35 },
    { x: W * 0.75, y: H * 0.75, r: 12, color: '#0f3460', glow: 'rgba(0,212,255,0.2)', speed: 0.02, ox: W*0.75, oy: H*0.75 },
  ];

  // Nebula blobs (static gradient circles)
  const nebulae = [
    { x: W * 0.2, y: H * 0.4, r: 200, color: 'rgba(124,58,237,0.04)' },
    { x: W * 0.8, y: H * 0.6, r: 250, color: 'rgba(0,212,255,0.03)' },
    { x: W * 0.5, y: H * 0.8, r: 180, color: 'rgba(79,70,229,0.04)' },
  ];

  // Scroll parallax offset
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  // Mouse parallax
  document.addEventListener('mousemove', e => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  let time = 0;

  function draw() {
    // Smooth cursor follow
    mouseX += (targetX - mouseX) * 0.06;
    mouseY += (targetY - mouseY) * 0.06;

    const offsetX = (mouseX - W / 2) * 0.01;
    const offsetY = (mouseY - H / 2) * 0.01;

    ctx.clearRect(0, 0, W, H);

    // Draw nebulae
    nebulae.forEach(n => {
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      grad.addColorStop(0, n.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw stars with parallax
    time += 0.01;
    stars.forEach(s => {
      s.twinkle += 0.03;
      const flicker = 0.7 + 0.3 * Math.sin(s.twinkle);

      // Parallax offset (faster for closer stars)
      const px = s.ox + offsetX / s.speed * 0.01;
      const py = s.oy + offsetY / s.speed * 0.01;

      ctx.globalAlpha = s.opacity * flicker;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px % W, py % H, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw planets with parallax + float animation
    planets.forEach((p, i) => {
      const floatY = Math.sin(time * 0.5 + i) * 8;
      const px = p.ox + offsetX * p.speed * 30;
      const py = p.oy + offsetY * p.speed * 30 + floatY;

      // Glow halo
      const glow = ctx.createRadialGradient(px, py, p.r * 0.5, px, py, p.r * 2.5);
      glow.addColorStop(0, p.glow);
      glow.addColorStop(1, 'transparent');
      ctx.globalAlpha = 1;
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(px, py, p.r * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Planet body gradient
      const grad = ctx.createRadialGradient(px - p.r * 0.3, py - p.r * 0.3, 0, px, py, p.r);
      grad.addColorStop(0, lightenColor(p.color, 40));
      grad.addColorStop(1, p.color);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fill();

      // Ring for first planet
      if (i === 0) {
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = lightenColor(p.color, 60);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(px, py, p.r * 1.8, p.r * 0.4, -0.3, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
}

// Helper — lighten hex color
function lightenColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `rgb(${r},${g},${b})`;
}

// ============================================================
// 4. CUSTOM CURSOR
// ============================================================
function initCursor() {
  const glow = document.getElementById('cursorGlow');
  const dot = document.getElementById('cursorDot');
  let gx = 0, gy = 0, dx = 0, dy = 0;

  document.addEventListener('mousemove', e => {
    dx = e.clientX;
    dy = e.clientY;
  });

  function moveCursor() {
    gx += (dx - gx) * 0.08;
    gy += (dy - gy) * 0.08;
    glow.style.left = gx + 'px';
    glow.style.top = gy + 'px';
    dot.style.left = dx + 'px';
    dot.style.top = dy + 'px';
    requestAnimationFrame(moveCursor);
  }
  moveCursor();

  // Scale dot on hover over interactive elements
  document.querySelectorAll('a, button, .sk-node, .proj-card, .glass').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform = 'translate(-50%,-50%) scale(2.5)';
      dot.style.opacity = '0.5';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform = 'translate(-50%,-50%) scale(1)';
      dot.style.opacity = '1';
    });
  });
}

// ============================================================
// 5. NAVBAR — scroll effect + mobile
// ============================================================
function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

function initMobileMenu() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileNav');

  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => menu.classList.remove('open'));
  });
}

// ============================================================
// 6. TYPING ANIMATION
// ============================================================
function initTyping() {
  const el = document.getElementById('typingEl');
  const roles = [
    'Data Scientist',
    'Web Developer',
    'ML Enthusiast',
    'Problem Solver',
    'Self-Taught Dev'
  ];
  let roleIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = roles[roleIdx];
    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 2000); // pause at end
        return;
      }
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(type, deleting ? 60 : 110);
  }
  type();
}

// ============================================================
// 7. n8n CONNECTOR LINES — SVG animated paths
// ============================================================
function initConnectors() {
  const svg = document.getElementById('connectorSvg');
  const pipeline = document.getElementById('pipeline');

  // Define which nodes connect
  const connections = [
    { from: 'out-hero',     to: 'in-about' },
    { from: 'out-about',    to: 'in-skills' },
    { from: 'out-skills',   to: 'in-projects' },
    { from: 'out-projects', to: 'in-journey' },
    { from: 'out-journey',  to: 'in-contact' },
  ];

  // Create gradient def
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  grad.setAttribute('id', 'connGrad');
  grad.setAttribute('x1', '0%'); grad.setAttribute('y1', '0%');
  grad.setAttribute('x2', '0%'); grad.setAttribute('y2', '100%');
  const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop1.setAttribute('offset', '0%'); stop1.setAttribute('stop-color', '#00d4ff'); stop1.setAttribute('stop-opacity', '0.7');
  const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop2.setAttribute('offset', '100%'); stop2.setAttribute('stop-color', '#7c3aed'); stop2.setAttribute('stop-opacity', '0.4');
  grad.appendChild(stop1); grad.appendChild(stop2);
  defs.appendChild(grad);
  svg.appendChild(defs);

  function getCenter(id) {
    const el = document.getElementById(id);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const pRect = pipeline.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - pRect.left,
      y: rect.top + rect.height / 2 - pRect.top + window.scrollY
    };
  }

  function drawConnectors() {
    // Clear old paths (keep defs)
    const old = svg.querySelectorAll('path, circle');
    old.forEach(e => e.remove());

    connections.forEach((c, i) => {
      const from = getCenter(c.from);
      const to = getCenter(c.to);
      if (!from || !to) return;

      // Bezier curve — n8n style
      const dy = to.y - from.y;
      const cp1x = from.x, cp1y = from.y + dy * 0.4;
      const cp2x = to.x,   cp2y = to.y - dy * 0.4;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${from.x} ${from.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${to.x} ${to.y}`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'url(#connGrad)');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('stroke-dasharray', '8 5');
      path.setAttribute('opacity', '0.5');
      path.style.animation = `dashFlow ${3 + i * 0.3}s linear infinite`;
      svg.appendChild(path);

      // Moving dot along path (data packet animation)
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('r', '4');
      dot.setAttribute('fill', '#00d4ff');
      dot.setAttribute('opacity', '0.8');
      svg.appendChild(dot);

      // Animate dot along path
      animateDotOnPath(dot, path, 3500 + i * 400);
    });
  }

  function animateDotOnPath(dot, path, duration) {
    let start = null;
    const len = path.getTotalLength ? path.getTotalLength() : 200;

    function step(ts) {
      if (!start) start = ts;
      const progress = ((ts - start) % duration) / duration;
      try {
        const pt = path.getPointAtLength(progress * len);
        dot.setAttribute('cx', pt.x);
        dot.setAttribute('cy', pt.y);
      } catch(e) {}
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Draw on load and resize
  setTimeout(drawConnectors, 200);
  window.addEventListener('resize', drawConnectors);
  window.addEventListener('scroll', drawConnectors);
}

// ============================================================
// 8. SCROLL REVEAL
// ============================================================
function initReveal() {
  const items = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger the delay for grid items
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        let idx = 0;
        siblings.forEach((s, si) => { if (s === entry.target) idx = si; });
        entry.target.style.transitionDelay = `${idx * 0.1}s`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  items.forEach(item => observer.observe(item));
}

// ============================================================
// 9. SKILL BAR ANIMATION
// ============================================================
function initSkillBars() {
  const bars = document.querySelectorAll('.sk-fill');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(b => observer.observe(b));
}

// ============================================================
// 10. BACK TO TOP
// ============================================================
function initBackToTop() {
  const btn = document.getElementById('backTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================================
// 11. CONTACT FORM
// ============================================================
function initFormSubmit() {}

function handleFormSubmit(btn) {
  // Simple feedback (no backend needed)
  const original = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-check"></i> Signal Sent!';
  btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.background = '';
    btn.disabled = false;
  }, 3000);
}

// ============================================================
// 12. CSS ANIMATION FOR DASH FLOW (injected)
// ============================================================
const styleTag = document.createElement('style');
styleTag.textContent = `
  @keyframes dashFlow { to { stroke-dashoffset: -52; } }
`;
document.head.appendChild(styleTag);

// ============================================================
// 13. NODE GLOW EFFECT ON HOVER
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.node-section').forEach(section => {
    section.addEventListener('mouseenter', () => {
      section.style.filter = 'drop-shadow(0 0 30px rgba(0,212,255,0.05))';
    });
    section.addEventListener('mouseleave', () => {
      section.style.filter = 'none';
    });
  });
});
