/* =====================
       CURSOR
    ===================== */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
  // influence floating petals
  document.querySelectorAll('.petal').forEach(p => {
    const px = parseFloat(p.style.left);
    const py = parseFloat(p.getBoundingClientRect().top);
    const dx = mx - px;
    const dy = my - py;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 150) {
      const force = (150 - dist) / 150;
      p.style.transform = `translate(${-dx * force * 0.5}px, ${-dy * force * 0.5}px)`;
    } else {
      p.style.transform = '';
    }
  });
  // trail sparkle
  if (Math.random() > .7) {
    const d = document.createElement('div');
    d.style.cssText = `position:fixed;pointer-events:none;z-index:9990;
      left:${mx}px;top:${my}px;width:4px;height:4px;
      background:var(--gold);border-radius:50%;
      transform:translate(-50%,-50%);
      animation:trailFade .7s ease forwards;`;
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 700);
  }
});
// ring lags behind cursor
function animateRing() {
  rx += (mx - rx) * .1; ry += (my - ry) * .1;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();
// ring scale on hover
document.querySelectorAll('a,button,.ceremony-card,.gs-item,.photo-frame').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1.7)';
    ring.style.width = '70px'; ring.style.height = '70px';
    ring.style.borderColor = 'rgba(212,162,36,.55)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.width = '48px'; ring.style.height = '48px';
    ring.style.borderColor = 'rgba(212,162,36,.35)';
  });
});
// Heart particles spawning logic with increased quantity
function spawnHearts(e) {
  if (Math.random() > 0.6) { // Increased frequency
    const count = Math.random() > 0.8 ? 2 : 1; // Sometimes spawn two
    for (let i = 0; i < count; i++) {
      const h = document.createElement('div');
      h.className = 'heart-particle';
      h.innerHTML = Math.random() > 0.5 ? '❤' : '❣';
      h.style.left = e.clientX + 'px';
      h.style.top = e.clientY + 'px';
      h.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'px');
      h.style.setProperty('--ty', (Math.random() - 1) * 200 + 'px');
      h.style.setProperty('--tr', (Math.random() - 0.5) * 90 + 'deg');
      h.style.color = Math.random() > 0.5 ? 'var(--gold)' : '#F4A8B8';
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 1500);
    }
  }
}
// Automatic burst for arrival/animation
function heartBurst(x, y, count = 10) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const h = document.createElement('div');
      h.className = 'heart-particle';
      h.innerHTML = Math.random() > 0.5 ? '❤' : '❣';
      h.style.left = x + 'px';
      h.style.top = y + 'px';
      h.style.setProperty('--tx', (Math.random() - 0.5) * 400 + 'px');
      h.style.setProperty('--ty', (Math.random() - 1) * 400 + 'px');
      h.style.setProperty('--tr', (Math.random() - 0.5) * 180 + 'deg');
      h.style.color = Math.random() > 0.5 ? 'var(--gold)' : '#F4A8B8';
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 1500);
    }, i * 50);
  }
}
document.querySelectorAll('.gs-item, .photo-frame, .person-photo, .ceremony-card, #dua, .rsvp-inner, .venue-visual, .nav-logo, .footer-names').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    // No particles for hero section photos as requested
    if (!el.closest('#hero')) spawnHearts(e);
    // Sparkle trail
    if (Math.random() > 0.85) {
      const d = document.createElement('div');
      d.className = 'sparkle-burst';
      d.style.left = e.clientX + 'px'; d.style.top = e.clientY + 'px';
      d.style.color = 'var(--gold-light)';
      d.innerHTML = '✦';
      document.body.appendChild(d);
      setTimeout(() => d.remove(), 600);
    }
    // Magnetic effect for gallery items specifically
    if (el.classList.contains('gs-item')) {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const moveX = (e.clientX - centerX) * 0.05;
      const moveY = (e.clientY - centerY) * 0.05;
      el.querySelector('.gs-photo').style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
  });
  el.addEventListener('mouseleave', () => {
    if (el.classList.contains('gs-item')) {
      el.querySelector('.gs-photo').style.transform = '';
    }
  });
});
// Individual Photo Observer for arrival bursts (hearts only, no glow)
const photoObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const rect = entry.target.getBoundingClientRect();
      // Arrival burst - No hearts for Hero images
      if (!entry.target.closest('#hero')) {
        heartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
      }
      photoObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.gs-item, .photo-frame, .person-photo, .ceremony-card, .venue-visual').forEach(el => {
  photoObserver.observe(el);
});
// click burst
document.addEventListener('click', e => {
  // Don't burst if clicking a button to prevent event interference on mobile
  if (e.target.closest('button') || document.body.clientWidth <= 900) return;
  ['✦', '☽', '✨', '🌙', '❧'].forEach((sym, i) => {
    setTimeout(() => {
      const s = document.createElement('div');
      s.className = 'sparkle-burst';
      s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px';
      s.style.color = ['#D4A224', '#F4A8B8', '#A8DDF4', '#D4A224', '#F5C842'][i];
      s.innerHTML = sym;
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 700);
    }, i * 60);
  });
});
/* trail fade keyframes */
const sty = document.createElement('style');
sty.textContent = `@keyframes trailFade{0%{opacity:.55;transform:translate(-50%,-50%) scale(1);}100%{opacity:0;transform:translate(-50%,-50%) scale(0);}}`;
document.head.appendChild(sty);
/* =====================
   CURTAIN OPEN
===================== */
// Build rings
const ringRow = document.getElementById('ringRow');
for (let i = 0; i < 22; i++) {
  const r = document.createElement('div'); r.className = 'c-ring'; ringRow.appendChild(r);
}
function openCurtain() {
  const panels = document.getElementById('cPanels');
  const wrap = document.getElementById('curtain-wrap');
  panels.classList.add('open');
  setTimeout(() => {
    wrap.classList.add('opened');
    // Trigger hero animations right as curtain fades out
    document.querySelectorAll('.hero-anim').forEach((el, index) => {
      // Add standard base fade-up class logic or anim-in to ensure it works beautifully
      setTimeout(() => {
        el.classList.add('anim-in');
        if (!el.classList.contains('anim-left') && !el.classList.contains('anim-right') && !el.classList.contains('anim-zoom') && !el.classList.contains('anim-up') && !el.classList.contains('anim-down')) {
          // Give a default slow fade down to standard hero elements that don't have directional classes
          el.classList.add('anim-up', 'anim-in');
          el.style.opacity = '1';
          el.style.transform = 'translate(0, 0)';
        }
      }, index * 100);
    });
    setTimeout(() => {
      wrap.style.display = 'none';
      // ── Hero photo one-time glow: add class to each photo-frame ──
      document.querySelectorAll('.photo-frame').forEach(pf => {
        pf.classList.add('hero-glow-active');
      });
      // Auto-start nasheed from the hook after curtain closes
      const aud = document.getElementById('nasheedAudio');
      const btn = document.getElementById('nasheedBtn');
      if (aud && !isPlaying) {
        aud.currentTime = HOOK_TIME;
        aud.play().then(() => {
          firstPlay = false;
          isPlaying = true;
          btn.innerHTML = '&#10074;&#10074;';
          btn.classList.add('playing');
        }).catch(() => {
          // Autoplay blocked by browser. User must click play.
          console.log("Autoplay prevented. User interaction required.");
        });
      }
    }, 600);
  }, 2000);
}
/* =====================
   SCROLL ANIMATIONS ✦ fade-up (existing)
===================== */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: .12 });
document.querySelectorAll('.fade-up,.tl-item').forEach(el => obs.observe(el));
/* =====================
   DIRECTIONAL ANIMATIONS ✦ anim-left/right/up/down/zoom/zout
===================== */
const animObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    // Exclude elements with hero-anim from intersection observer triggering
    if (e.isIntersecting && !e.target.classList.contains('hero-anim')) {
      e.target.classList.add('anim-in');
      // Once triggered, unobserve so it doesn't reset on scroll-back
      animObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.anim-left,.anim-right,.anim-up,.anim-down,.anim-zoom,.anim-zout')
  .forEach(el => animObs.observe(el));
/* =====================
   PARALLAX RINGS
===================== */
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  document.querySelectorAll('.mandala').forEach((m, i) => {
    m.style.transform = `rotate(${y * .04 * (i + 1)}deg)`;
  });
  // hero blob parallax
  document.querySelectorAll('.hero-blob').forEach((b, i) => {
    b.style.transform = `translateY(${y * .08 * (i + 1)}px)`;
  });
});
/* =====================
   FLOATING SYMBOLS
===================== */
function createPetal() {
  const p = document.createElement('div');
  p.className = 'petal';
  p.innerHTML = ['✦', '✦', '·', '�✦�', '❧'][Math.floor(Math.random() * 5)];
  p.style.left = Math.random() * 100 + 'vw';
  p.style.top = '-20px';
  p.style.fontSize = (Math.random() * 10 + 6) + 'px';
  p.style.color = Math.random() > .5 ? '#D4A224' : 'rgba(212,162,36,.4)';
  p.style.animationDuration = (Math.random() * 10 + 8) + 's';
  p.style.animationDelay = (Math.random() * 4) + 's';
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 18000);
}
setInterval(createPetal, 1800);
/* =====================
   RSVP SUBMIT
===================== */
function handleRsvp(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.submit-btn');
  btn.textContent = '�✦ JazakAllah Khayran!';
  btn.style.background = 'var(--gold)';
  btn.style.color = '#1C0E30';
  btn.style.borderColor = 'var(--gold)';
  for (let i = 0; i < 14; i++) {
    setTimeout(() => {
      const s = document.createElement('div');
      s.className = 'sparkle-burst';
      const rect = btn.getBoundingClientRect();
      s.style.left = (rect.left + Math.random() * rect.width) + 'px';
      s.style.top = (rect.top + Math.random() * rect.height) + 'px';
      s.style.color = '#D4A224';
      s.innerHTML = ['✦', '✦', '✦', '❧'][Math.floor(Math.random() * 4)];
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 700);
    }, i * 70);
  }
}
/* =====================
   MAGNETIC HEADINGS
===================== */
document.querySelectorAll('.hero-names,.section-title,.c-names').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * .04;
    const y = (e.clientY - r.top - r.height / 2) * .04;
    el.style.transform = `translate(${x}px,${y}px)`;
  });
  el.addEventListener('mouseleave', () => el.style.transform = '');
});
/* =====================
   NASHEED PLAYER
===================== */
const audio = document.getElementById('nasheedAudio');
const playBtn = document.getElementById('nasheedBtn');
const HOOK_TIME = 20; // seconds ✦ jump to the hook on first play
let firstPlay = true;
let isPlaying = false;
playBtn.addEventListener('click', () => {
  if (!isPlaying) {
    if (firstPlay) {
      audio.currentTime = HOOK_TIME;
      firstPlay = false;
    }
    audio.play().then(() => {
      isPlaying = true;
      playBtn.innerHTML = '&#10074;&#10074;';
      playBtn.classList.add('playing');
    }).catch((err) => {
      console.error("Audio play failed:", err);
    });
  } else {
    audio.pause();
    isPlaying = false;
    playBtn.innerHTML = '&#9654;';
    playBtn.classList.remove('playing');
  }
});
audio.addEventListener('ended', () => {
  isPlaying = false;
  firstPlay = true;
  playBtn.innerHTML = '&#9654;';
  playBtn.classList.remove('playing');
});

/* =====================
   GALLERY HOVER — DYNAMIC Z-INDEX ELEVATION
   Brings hovered photo to front above overlapping neighbours.
   Original z-index is stored and restored on mouseleave.
===================== */
document.querySelectorAll('.gs-item').forEach(item => {
  // Store the original z-index set via inline style in the HTML
  const originalZ = item.style.zIndex || item.getAttribute('data-orig-z') || '';
  item.setAttribute('data-orig-z', originalZ);

  item.addEventListener('mouseenter', () => {
    item.style.zIndex = '100';
    item.classList.add('gs-hover-front');
  });

  item.addEventListener('mouseleave', () => {
    item.style.zIndex = item.getAttribute('data-orig-z');
    item.classList.remove('gs-hover-front');
  });
});