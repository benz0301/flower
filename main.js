const stage = document.querySelector('.phone-stage');
const viewer = document.querySelector('model-viewer');
const overlay = document.querySelector('.question-overlay');
const yesBtn = document.querySelector('.btn-yes');
const noBtn = document.querySelector('.btn-no');
const fxLayer = document.querySelector('.fx-layer');
const celebrateLayer = document.querySelector('.celebrate-layer');

function bat(color, x, y, dx, dy, rot) {
  const el = document.createElement('span');
  el.className = 'bat';
  el.textContent = '🦇';
  el.style.color = color;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.style.setProperty('--tx', dx + 'px');
  el.style.setProperty('--ty', dy + 'px');
  el.style.setProperty('--rot', rot + 'deg');
  el.addEventListener('animationend', () => el.remove());
  fxLayer.appendChild(el);
}
function spark(x, y, dx, dy) {
  const el = document.createElement('span');
  el.className = 'spark';
  el.textContent = '✨';
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.style.setProperty('--tx', dx + 'px');
  el.style.setProperty('--ty', dy + 'px');
  el.addEventListener('animationend', () => el.remove());
  fxLayer.appendChild(el);
}

function burstBats(x, y) {
  const colors = ['#dc143c', '#8a2be2', '#800080'];
  const count = 12;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6;
    const dist = 30 + Math.random() * 40;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * -dist - 20;
    const rot = (Math.random() * 120 - 60).toFixed(1);
    const color = colors[Math.floor(Math.random() * colors.length)];
    bat(color, x, y, dx, dy, rot);
    if (i % 3 === 0) {
      spark(x + dx * 0.4, y + dy * 0.4, dx * 0.2, dy * 0.2);
    }
  }
}

function heartConfetti() {
  const rect = stage.getBoundingClientRect();
  const count = 40;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'c-heart';
    el.textContent = '❤';
    const startX = Math.random() * rect.width;
    const startY = Math.random() * 20 + 10;
    const dx = (Math.random() * 60 - 30).toFixed(1);
    const dy = (rect.height - startY + Math.random() * 60).toFixed(1);
    const rot = (Math.random() * 120 - 60).toFixed(1);
    el.style.left = startX + 'px';
    el.style.top = startY + 'px';
    el.style.setProperty('--tx', dx + 'px');
    el.style.setProperty('--ty', dy + 'px');
    el.style.setProperty('--rot', rot + 'deg');
    el.addEventListener('animationend', () => el.remove());
    celebrateLayer.appendChild(el);
  }
}

function showQuestion(ev) {
  overlay.setAttribute('aria-hidden', 'false');
  noBtn.style.transform = 'translate(0, 0)';
  const rect = stage.getBoundingClientRect();
  const cx = ev?.clientX ? (ev.clientX - rect.left) : rect.width / 2;
  const cy = ev?.clientY ? (ev.clientY - rect.top) : rect.height / 2;
  burstBats(cx, cy);
  setTimeout(() => yesBtn.focus({ preventScroll: true }), 60);
}
function hideQuestion() {
  overlay.setAttribute('aria-hidden', 'true');
  viewer.focus();
}
function dodgeNo(ev) {
  const bounds = ev.currentTarget.parentElement.getBoundingClientRect();
  const offsetX = (Math.random() * bounds.width * 0.6) - bounds.width * 0.3;
  const offsetY = (Math.random() * bounds.height * 0.6) - bounds.height * 0.3;
  noBtn.style.transform = `translate(${offsetX.toFixed(0)}px, ${offsetY.toFixed(0)}px)`;
}
function acceptYes() {
  stage.classList.add('pulse');
  heartConfetti();
  const title = document.getElementById('q-title');
  title.textContent = 'yaaay! ❤️';
  setTimeout(() => {
    hideQuestion();
    stage.classList.remove('pulse');
    title.textContent = 'do you wanna be my gf?';
  }, 1600);
}

viewer.addEventListener('click', showQuestion);
viewer.addEventListener('touchend', (e) => {
  e.preventDefault();
  const touch = e.changedTouches && e.changedTouches[0];
  if (touch) {
    showQuestion({ clientX: touch.clientX, clientY: touch.clientY });
  } else {
    showQuestion();
  }
}, { passive: false });

noBtn.addEventListener('mouseenter', dodgeNo);
noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); dodgeNo(e); }, { passive: false });
yesBtn.addEventListener('click', acceptYes);
