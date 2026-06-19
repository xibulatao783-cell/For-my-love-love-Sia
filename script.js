const starCanvas = document.getElementById('stars-canvas');
const starCtx = starCanvas.getContext('2d');
starCanvas.width = window.innerWidth;
starCanvas.height = window.innerHeight;

const stars = Array.from({ length: 220 }, () => ({
  x: Math.random() * starCanvas.width,
  y: Math.random() * starCanvas.height,
  r: Math.random() * 1.5 + 0.3,
  alpha: Math.random(),
  speed: Math.random() * 0.01 + 0.003
}));

function drawStars() {
  starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
  stars.forEach(s => {
    s.alpha += s.speed;
    if (s.alpha > 1 || s.alpha < 0) s.speed *= -1;
    starCtx.beginPath();
    starCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    starCtx.fillStyle = `rgba(192,132,252,${s.alpha * 0.6})`;
    starCtx.fill();
  });
  requestAnimationFrame(drawStars);
}
drawStars();

let input = '';
const CORRECT_CODE = '143';

function renderDots() {
  const container = document.getElementById('dots');
  container.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i < input.length ? ' filled' : '');
    container.appendChild(dot);
  }
}

function addNum(n) {
  if (input.length >= 3) return;
  input += n;
  renderDots();
  if (input.length === 3) setTimeout(checkCode, 300);
}

function deleteNum() {
  input = input.slice(0, -1);
  renderDots();
}

function clearNum() {
  input = '';
  renderDots();
}

function checkCode() {
  if (input === CORRECT_CODE) {
    goToForgive();
  } else {
    const err = document.getElementById('error-msg');
    err.classList.add('show');
    setTimeout(() => {
      err.classList.remove('show');
      input = '';
      renderDots();
    }, 1500);
  }
}

renderDots();

function goToForgive() {
  document.getElementById('passcode-page').classList.add('hidden');
  document.getElementById('forgive-page').classList.remove('hidden');
}

function goToMessage() {
  document.getElementById('forgive-page').classList.add('hidden');
  document.getElementById('message-page').classList.remove('hidden');
}

function goToHeart() {
  document.getElementById('message-page').classList.add('hidden');
  document.getElementById('heart-page').classList.remove('hidden');
  startMathHeart();
}

function moveNoBtn() {
  const btn = document.getElementById('no-btn');
  const parent = btn.parentElement;
  const maxX = parent.offsetWidth - btn.offsetWidth - 10;
  const randX = Math.floor(Math.random() * Math.max(maxX, 10));
  const randY = Math.floor(Math.random() * 60) - 30;
  btn.style.left = randX + 'px';
  btn.style.top = randY + 'px';
}

function startMathHeart() {
  const canvas = document.getElementById('heart-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const S = Math.min(W, H) * 0.28;

  const COLORS = [
    [79, 195, 247],
    [129, 212, 250],
    [41, 182, 246],
    [173, 216, 230],
    [224, 247, 250],
    [255, 255, 255],
  ];

  function heartX(t) { return 16 * Math.pow(Math.sin(t), 3); }
  function heartY(t) {
    return 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
  }
  function toCanvas(hx, hy) {
    return { x: cx + hx * (S / 16), y: cy - hy * (S / 16) };
  }

  let lineProgress = 0;
  let linesDone = false;
  const totalLines = 80;
  const lineSpeed = 0.008;

  const heartPoints = [];
  for (let t = 0; t <= Math.PI * 2; t += 0.01) {
    heartPoints.push(toCanvas(heartX(t), heartY(t)));
  }

  function insideHeart(px, py) {
    let inside = false;
    for (let i = 0, j = heartPoints.length - 1; i < heartPoints.length; j = i++) {
      const xi = heartPoints[i].x, yi = heartPoints[i].y;
      const xj = heartPoints[j].x, yj = heartPoints[j].y;
      const intersect = ((yi > py) !== (yj > py)) &&
        (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  const hxMin = Math.min(...heartPoints.map(p => p.x));
  const hxMax = Math.max(...heartPoints.map(p => p.x));
  const hyMin = Math.min(...heartPoints.map(p => p.y));
  const hyMax = Math.max(...heartPoints.map(p => p.y));

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      const t = Math.random() * Math.PI * 2;
      const tp = toCanvas(heartX(t), heartY(t));
      this.tx = tp.x + (Math.random() - 0.5) * 5;
      this.ty = tp.y + (Math.random() - 0.5) * 5;
      const angle = Math.random() * Math.PI * 2;
      const dist = (initial ? 0.6 : 0.35) * Math.max(W, H) * (0.4 + Math.random() * 0.6);
      this.x = cx + Math.cos(angle) * dist;
      this.y = cy + Math.sin(angle) * dist;
      this.size = Math.random() * 2.2 + 0.6;
      this.speed = 0.008 + Math.random() * 0.02;
      this.progress = 0;
      this.alpha = 0;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.pulsing = Math.random() * Math.PI * 2;
      this.delay = initial ? Math.random() * 2 : 0;
      this.timer = 0;
    }
    update() {
      this.timer++;
      if (this.timer < this.delay * 60) return;
      this.progress += this.speed;
      this.pulsing += 0.05;
      this.x += (this.tx - this.x) * this.speed * 2;
      this.y += (this.ty - this.y) * this.speed * 2;
      const p = this.progress;
      this.alpha = p < 0.3 ? p / 0.3 : p > 0.85 ? (1 - p) / 0.15 : 1;
      if (this.progress >= 1) this.reset(false);
    }
    draw() {
      if (this.timer < this.delay * 60) return;
      const pulse = 1 + Math.sin(this.pulsing) * 0.15;
      const [r, g, b] = this.color;
      const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3 * pulse);
      glow.addColorStop(0, `rgba(${r},${g},${b},${this.alpha})`);
      glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.5 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${this.alpha * 0.9})`;
      ctx.fill();
    }
  }

  const particles = Array.from({ length: 900 }, () => new Particle());

  function drawHeartOutline(alpha) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath();
    let first = true;
    for (const p of heartPoints) {
      if (first) { ctx.moveTo(p.x, p.y); first = false; }
      else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.strokeStyle = `rgba(79,195,247,${alpha * 0.25})`;
    ctx.lineWidth = 3;
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#4fc3f7';
    ctx.stroke();
    ctx.restore();
  }

  function drawVerticalLines(progress) {
    const visibleLines = Math.floor(progress * totalLines);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i <= visibleLines; i++) {
      const lx = hxMin + (i / totalLines) * (hxMax - hxMin);
      let topY = null, bottomY = null;
      for (let py = hyMin; py <= hyMax; py += 1) {
        if (insideHeart(lx, py)) {
          if (topY === null) topY = py;
          bottomY = py;
        }
      }
      if (topY !== null && bottomY !== null) {
        const brightness = 0.5 + 0.5 * Math.sin((i / totalLines) * Math.PI);
        const r = Math.floor(79 + brightness * 50);
        ctx.beginPath();
        ctx.moveTo(lx, topY);
        ctx.lineTo(lx, bottomY);
        ctx.strokeStyle = `rgba(${r},195,247,0.8)`;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#4fc3f7';
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.5);
    bg.addColorStop(0, 'rgba(0,15,40,0.5)');
    bg.addColorStop(1, 'rgba(0,5,16,0)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    if (!linesDone) {
      lineProgress += lineSpeed;
      drawVerticalLines(Math.min(lineProgress, 1));
      drawHeartOutline(Math.min(lineProgress, 1));
      if (lineProgress >= 1) linesDone = true;
    } else {
      drawVerticalLines(1);
      drawHeartOutline(1);
      ctx.globalCompositeOperation = 'lighter';
      particles.forEach(p => { p.update(); p.draw(); });
      ctx.globalCompositeOperation = 'source-over';
    }
    requestAnimationFrame(animate);
  }

  animate();
}

window.addEventListener('resize', () => {
  starCanvas.width = window.innerWidth;
  starCanvas.height = window.innerHeight;
  const hc = document.getElementById('heart-canvas');
  if (hc) { hc.width = window.innerWidth; hc.height = window.innerHeight; }
});
