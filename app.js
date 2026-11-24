/* ==========================================================================
   KRONOS · C6 — INTERACTIVE PHYSICS, 3D ALLOTROPE ENGINE & CHOREOGRAPHY
   ========================================================================== */

(() => {
  "use strict";

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ========================================================================
     1. SYNTHESIZED HOROLOGICAL WEB AUDIO ENGINE
     ======================================================================== */
  const SoundEngine = (() => {
    let ctx = null;
    let enabled = false;

    function ensureContext() {
      if (!ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) ctx = new AudioCtx();
      }
      if (ctx && ctx.state === "suspended") {
        ctx.resume();
      }
      return ctx;
    }

    function playTick(accent = false) {
      if (!enabled || !ensureContext()) return;
      const now = ctx.currentTime;

      // Crisp metallic escapement impulse
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(accent ? 4200 : 3400, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.018);

      gain.gain.setValueAtTime(accent ? 0.055 : 0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.024);
    }

    function playPluck(intensity = 0.5) {
      if (!enabled || !ensureContext()) return;
      const now = ctx.currentTime;
      const notes = [220, 277.18, 329.63, 440, 554.37, 659.25];
      const baseFreq = notes[Math.floor(Math.random() * notes.length)];

      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc2.type = "triangle";
      osc.frequency.setValueAtTime(baseFreq, now);
      osc2.frequency.setValueAtTime(baseFreq * 2.005, now);

      const vol = clamp(intensity * 0.08, 0.02, 0.09);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.5);
      osc2.stop(now + 0.5);
    }

    function playPhaseShift(modeIdx = 0) {
      if (!enabled || !ensureContext()) return;
      const now = ctx.currentTime;
      const roots = [196, 246.94, 293.66, 369.99];
      const f = roots[modeIdx % roots.length];

      [1, 1.5, 2].forEach((mult, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(f * mult, now);
        osc.frequency.exponentialRampToValueAtTime(f * mult * 1.015, now + 0.36);

        gain.gain.setValueAtTime(0.032 / (idx + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      });
    }

    function playLaserSpark() {
      if (!enabled || !ensureContext()) return;
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.045);
        gain.gain.setValueAtTime(0.045, now + i * 0.045);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.045 + 0.38);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.045);
        osc.stop(now + i * 0.045 + 0.4);
      });
    }

    function toggle() {
      enabled = !enabled;
      if (enabled) {
        ensureContext();
        playPhaseShift(2);
      }
      return enabled;
    }

    return {
      playTick,
      playPluck,
      playPhaseShift,
      playLaserSpark,
      toggle,
      isEnabled: () => enabled,
    };
  })();

  /* ========================================================================
     2. ATOMIC PRELOADER, THEME SWITCHER & MOBILE NAVIGATION
     ======================================================================== */
  function initPreloaderAndChrome() {
    const preloader = document.getElementById("preloader");
    const percentEl = document.getElementById("preloader-percent");
    const barEl = document.getElementById("preloader-bar-fill");
    const statusEl = document.getElementById("preloader-status");

    const statuses = [
      "KHỞI TẠO MẠNG TINH THỂ CARBON...",
      "NÉN 72 LỚP SỢI NTPT ĐA HƯỚNG...",
      "CÂN CHỈNH LỒNG TOURBILLON BA TRỤC...",
      "SẴN SÀNG · CALIBRE C6",
    ];

    if (prefersReducedMotion) {
      preloader?.classList.add("is-done");
      document.body.classList.add("is-ready");
    } else {
      const duration = 920;
      const start = performance.now();

      function tickLoader(now) {
        const t = clamp((now - start) / duration, 0, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const pct = Math.round(eased * 100);

        if (percentEl) percentEl.textContent = `${String(pct).padStart(3, "0")}%`;
        if (barEl) barEl.style.width = `${pct}%`;
        if (statusEl) {
          const idx = Math.min(statuses.length - 1, Math.floor(eased * statuses.length));
          statusEl.textContent = statuses[idx];
        }

        if (t < 1) {
          requestAnimationFrame(tickLoader);
        } else {
          setTimeout(() => {
            preloader?.classList.add("is-done");
            document.body.classList.add("is-ready");
          }, 110);
        }
      }
      requestAnimationFrame(tickLoader);
    }

    // Theme Switcher
    const themeBtn = document.getElementById("theme-toggle");
    const themeLabel = document.getElementById("theme-label");
    themeBtn?.addEventListener("click", () => {
      const html = document.documentElement;
      const next = html.getAttribute("data-theme") === "obsidian" ? "titanium" : "obsidian";
      html.setAttribute("data-theme", next);
      if (themeLabel) {
        themeLabel.textContent = next === "obsidian" ? "Carbon Đen" : "Titan Trắng";
      }
      SoundEngine.playTick(true);
    });

    // Audio Switcher
    const audioBtn = document.getElementById("audio-toggle");
    audioBtn?.addEventListener("click", () => {
      const on = SoundEngine.toggle();
      audioBtn.setAttribute("aria-pressed", String(on));
    });

    // Mobile Menu
    const mobileToggle = document.getElementById("mobile-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    mobileToggle?.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("open");
      mobileToggle.setAttribute("aria-expanded", String(open));
    });
    document.querySelectorAll(".mobile-link").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu?.classList.remove("open");
        mobileToggle?.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ========================================================================
     3. CUSTOM SPRING VELOCITY CURSOR, MAGNETIC PULL & CARD GLARE
     ======================================================================== */
  function initCursorAndGlare() {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    const labelEl = document.getElementById("cursor-label");

    if (finePointer && dot && ring && !prefersReducedMotion) {
      let mx = window.innerWidth / 2;
      let my = window.innerHeight / 2;
      let rx = mx;
      let ry = my;
      let activated = false;

      window.addEventListener(
        "pointermove",
        (e) => {
          mx = e.clientX;
          my = e.clientY;
          if (!activated) {
            activated = true;
            rx = mx;
            ry = my;
            document.body.classList.add("custom-cursor-ready");
          }

          const cursorHost = e.target.closest("[data-cursor]");
          if (cursorHost && labelEl) {
            const txt = cursorHost.getAttribute("data-cursor");
            if (txt) {
              labelEl.textContent = txt;
              ring.classList.add("has-label");
            }
          } else {
            ring.classList.remove("has-label");
          }
        },
        { passive: true }
      );

      function renderCursor() {
        const dx = mx - rx;
        const dy = my - ry;
        rx += dx * 0.2;
        ry += dy * 0.2;

        dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;

        const speed = Math.hypot(dx, dy);
        const isLabeled = ring.classList.contains("has-label");
        if (!isLabeled && speed > 1.5) {
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          const stretch = clamp(1 + speed * 0.012, 1, 1.38);
          const squash = 1 / Math.sqrt(stretch);
          ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) rotate(${angle}deg) scale(${stretch}, ${squash})`;
        } else {
          ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
        }

        requestAnimationFrame(renderCursor);
      }
      requestAnimationFrame(renderCursor);

      // Magnetic Controls
      document.querySelectorAll("[data-magnetic]").forEach((el) => {
        el.addEventListener("pointermove", (e) => {
          const rect = el.getBoundingClientRect();
          const ox = (e.clientX - (rect.left + rect.width / 2)) * 0.24;
          const oy = (e.clientY - (rect.top + rect.height / 2)) * 0.24;
          el.style.transform = `translate3d(${ox.toFixed(1)}px, ${oy.toFixed(1)}px, 0)`;
        });
        el.addEventListener("pointerleave", () => {
          el.style.transform = "";
        });
      });
    }

    // Specular Anisotropic Glare Cards
    document.querySelectorAll(".glare-card").forEach((card) => {
      card.addEventListener(
        "pointermove",
        (e) => {
          const rect = card.getBoundingClientRect();
          const gx = ((e.clientX - rect.left) / rect.width) * 100;
          const gy = ((e.clientY - rect.top) / rect.height) * 100;
          card.style.setProperty("--gx", `${gx.toFixed(1)}%`);
          card.style.setProperty("--gy", `${gy.toFixed(1)}%`);
        },
        { passive: true }
      );
    });
  }

  /* ========================================================================
     4. SCROLL REVEALS, ODOMETER COUNTERS, MARQUEE VELOCITY & NAV SPY
     ======================================================================== */
  function initScrollChoreography() {
    // Reveal elements
    const revealEls = document.querySelectorAll(".reveal-up, .reveal-scale");
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    revealEls.forEach((el) => revealObs.observe(el));

    // Odometer Counters
    const counterEls = document.querySelectorAll("[data-count]");
    const countObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          countObs.unobserve(el);

          const target = parseFloat(el.getAttribute("data-count") || "0");
          const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
          const dur = 1350;
          const t0 = performance.now();

          function stepCount(now) {
            const p = clamp((now - t0) / dur, 0, 1);
            const ease = 1 - Math.pow(1 - p, 4);
            const val = target * ease;
            el.textContent = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString("en-US");
            if (p < 1) requestAnimationFrame(stepCount);
          }
          requestAnimationFrame(stepCount);
        });
      },
      { threshold: 0.5 }
    );
    counterEls.forEach((el) => countObs.observe(el));

    // Scroll Progress + Velocity Marquee + Section Active Spy
    const progressBar = document.getElementById("scroll-progress-bar");
    const marqueeTrack = document.getElementById("marquee-track-1");
    const navLinks = document.querySelectorAll(".nav-link[data-section]");
    const sections = Array.from(navLinks)
      .map((l) => document.getElementById(l.getAttribute("data-section")))
      .filter(Boolean);

    let lastScrollY = window.scrollY;
    let velocity = 0;
    let marqueeOffset = 0;

    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        if (progressBar) {
          progressBar.style.transform = `scaleX(${clamp(y / maxScroll, 0, 1).toFixed(4)})`;
        }

        const delta = y - lastScrollY;
        velocity = clamp(velocity + delta * 0.08, -26, 26);
        lastScrollY = y;

        // Active Nav Link
        const spyY = y + window.innerHeight * 0.34;
        let currentId = sections[0]?.id;
        for (const sec of sections) {
          if (sec.offsetTop <= spyY) currentId = sec.id;
        }
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("data-section") === currentId);
        });
      },
      { passive: true }
    );

    if (marqueeTrack && !prefersReducedMotion) {
      function tickMarquee() {
        const group = marqueeTrack.firstElementChild;
        const groupW = group ? group.offsetWidth : 900;
        velocity *= 0.92;
        const speed = 0.75 + Math.abs(velocity) * 0.28;
        const dir = velocity < -0.6 ? -1 : 1;
        marqueeOffset -= speed * dir;

        if (marqueeOffset <= -groupW) marqueeOffset += groupW;
        if (marqueeOffset > 0) marqueeOffset -= groupW;

        const skew = clamp(velocity * -0.18, -4.5, 4.5);
        marqueeTrack.style.transform = `translate3d(${marqueeOffset.toFixed(2)}px, 0, 0) skewX(${skew.toFixed(2)}deg)`;
        requestAnimationFrame(tickMarquee);
      }
      requestAnimationFrame(tickMarquee);
    }
  }

  /* ========================================================================
     5. ENGINE 1: HERO 3D ATOMIC ALLOTROPE MORPHING & TOURBILLON STAGE
     ======================================================================== */
  function initHero3DEngine() {
    const canvas = document.getElementById("hero-3d-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const titleEl = document.getElementById("hero-lattice-title");
    const teleEl = document.getElementById("hero-bond-telemetry");
    const dragHint = document.getElementById("stage-drag-hint");
    const N = 60;

    // 1. Exact C60 Truncated Icosahedron (60 vertices, 90 covalent bonds)
    function buildFullerene() {
      const phi = (1 + Math.sqrt(5)) / 2;
      const raw = [];
      const evenPerms = [
        [0, 1, 2],
        [1, 2, 0],
        [2, 0, 1],
      ];

      function addWithSigns(base) {
        const signLists = [[]];
        for (let i = 0; i < 3; i++) {
          const next = [];
          const vals = Math.abs(base[i]) < 1e-6 ? [0] : [base[i], -base[i]];
          for (const prefix of signLists) {
            for (const v of vals) next.push([...prefix, v]);
          }
          signLists.splice(0, signLists.length, ...next);
        }
        for (const p of evenPerms) {
          for (const s of signLists) {
            raw.push([s[p[0]], s[p[1]], s[p[2]]]);
          }
        }
      }

      addWithSigns([0, 1, 3 * phi]);
      addWithSigns([1, 2 + phi, 2 * phi]);
      addWithSigns([phi, 2, 2 * phi + 1]);

      // Deduplicate & normalize to radius 1
      const pts = [];
      for (const p of raw) {
        if (!pts.some((q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) < 0.05)) {
          const len = Math.hypot(p[0], p[1], p[2]);
          pts.push({ x: p[0] / len, y: p[1] / len, z: p[2] / len });
        }
      }
      return pts.slice(0, N);
    }

    // 2. Diamond Cubic sp3 Tetrahedral Crystal (60 vertices)
    function buildDiamond() {
      const candidates = [];
      const basis = [
        [0, 0, 0],
        [0, 0.5, 0.5],
        [0.5, 0, 0.5],
        [0.5, 0.5, 0],
        [0.25, 0.25, 0.25],
        [0.25, 0.75, 0.75],
        [0.75, 0.25, 0.75],
        [0.75, 0.75, 0.25],
      ];
      for (let ix = -1; ix <= 1; ix++) {
        for (let iy = -1; iy <= 1; iy++) {
          for (let iz = -1; iz <= 1; iz++) {
            for (const b of basis) {
              const x = ix + b[0] - 0.375;
              const y = iy + b[1] - 0.375;
              const z = iz + b[2] - 0.375;
              candidates.push({ x, y, z, r: Math.hypot(x, y, z) });
            }
          }
        }
      }
      candidates.sort((a, b) => a.r - b.r);
      const selected = candidates.slice(0, N);
      const maxR = selected[selected.length - 1].r || 1;
      return selected.map((p) => ({
        x: (p.x / maxR) * 1.06,
        y: (p.y / maxR) * 1.06,
        z: (p.z / maxR) * 1.06,
      }));
    }

    // 3. 2D Hexagonal Graphene Wave Sheet (60 vertices)
    function buildGraphene() {
      const pts = [];
      const rows = 6;
      const cols = 10;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const u = (c - (cols - 1) / 2) * 0.23;
          const v = (r - (rows - 1) / 2) * 0.26 + ((c + r) % 2 === 0 ? 0.045 : -0.045);
          const wave = Math.sin(u * 2.6) * Math.cos(v * 2.2) * 0.22;
          pts.push({ x: u, y: wave, z: v });
        }
      }
      return pts.slice(0, N);
    }

    // 4. Helical Carbon Nanotube Cylinder (60 vertices)
    function buildNanotube() {
      const pts = [];
      const rings = 10;
      const perRing = 6;
      for (let r = 0; r < rings; r++) {
        const y = ((r - (rings - 1) / 2) / ((rings - 1) / 2)) * 1.05;
        const twist = r * (Math.PI / 6);
        for (let k = 0; k < perRing; k++) {
          const a = (k / perRing) * Math.PI * 2 + twist + (k % 2 === 0 ? 0.14 : -0.14);
          const rad = 0.56;
          pts.push({ x: Math.cos(a) * rad, y, z: Math.sin(a) * rad });
        }
      }
      return pts.slice(0, N);
    }

    function computeEdges(pts, maxNeighbors, maxDist) {
      const edges = new Set();
      const result = [];
      for (let i = 0; i < pts.length; i++) {
        const dists = [];
        for (let j = 0; j < pts.length; j++) {
          if (i === j) continue;
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y, pts[i].z - pts[j].z);
          if (d <= maxDist) dists.push({ j, d });
        }
        dists.sort((a, b) => a.d - b.d);
        for (let k = 0; k < Math.min(maxNeighbors, dists.length); k++) {
          const a = Math.min(i, dists[k].j);
          const b = Math.max(i, dists[k].j);
          const key = `${a}-${b}`;
          if (!edges.has(key)) {
            edges.add(key);
            result.push([a, b]);
          }
        }
      }
      return result;
    }

    const shapes = {
      fullerene: {
        title: "C₆₀ BUCKMINSTERFULLERENE",
        meta: "LAI HÓA sp² · 60 NÚT · 90 LIÊN KẾT CẦU",
        pts: buildFullerene(),
        colorA: "#E5994B",
        colorB: "#F5B971",
      },
      diamond: {
        title: "TINH THỂ KIM CƯƠNG TỨ DIỆN",
        meta: "LAI HÓA sp³ · GÓC 109.5° · 10 MOHS",
        pts: buildDiamond(),
        colorA: "#7CE7E1",
        colorB: "#E5994B",
      },
      graphene: {
        title: "MÀNG ĐƠN NGUYÊN TỬ GRAPHENE",
        meta: "MẠNG LỤC GIÁC 2D · SÓNG DIRAC ĐÀN HỒI",
        pts: buildGraphene(),
        colorA: "#E5994B",
        colorB: "#7CE7E1",
      },
      nanotube: {
        title: "ỐNG NANO CARBON XOẮN CHIRAL",
        meta: "SIÊU DẪN CƠ HỌC · BỀN GẤP 100× THÉP",
        pts: buildNanotube(),
        colorA: "#F5B971",
        colorB: "#7CE7E1",
      },
    };

    shapes.fullerene.edges = computeEdges(shapes.fullerene.pts, 3, 0.55);
    shapes.diamond.edges = computeEdges(shapes.diamond.pts, 4, 0.58);
    shapes.graphene.edges = computeEdges(shapes.graphene.pts, 3, 0.36);
    shapes.nanotube.edges = computeEdges(shapes.nanotube.pts, 3, 0.48);

    let currentMode = "fullerene";
    const nodes = shapes.fullerene.pts.map((p) => ({
      x: p.x,
      y: p.y,
      z: p.z,
      vx: 0,
      vy: 0,
      vz: 0,
      heat: 0,
    }));

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rotX = 0.28;
    let rotY = 0.55;
    let velX = 0.0012;
    let velY = 0.0038;
    let isDragging = false;
    let lastPX = 0;
    let lastPY = 0;
    let pulseWave = -1;
    let visible = true;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const obs = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    obs.observe(canvas);

    // Drag Orbit Controls
    const wrap = canvas.parentElement;
    wrap.addEventListener("pointerdown", (e) => {
      isDragging = true;
      lastPX = e.clientX;
      lastPY = e.clientY;
      wrap.setPointerCapture(e.pointerId);
      if (dragHint) dragHint.style.opacity = "0";
    });
    wrap.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      const dx = e.clientX - lastPX;
      const dy = e.clientY - lastPY;
      lastPX = e.clientX;
      lastPY = e.clientY;
      velY = dx * 0.0065;
      velX = dy * 0.0065;
      rotY += velY;
      rotX = clamp(rotX + velX, -1.35, 1.35);
    });
    const endDrag = () => {
      isDragging = false;
    };
    wrap.addEventListener("pointerup", endDrag);
    wrap.addEventListener("pointercancel", endDrag);

    // Mode Switcher Dock
    const dockBtns = document.querySelectorAll(".dock-btn[data-mode]");
    dockBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-mode");
        if (!shapes[mode]) return;
        currentMode = mode;
        dockBtns.forEach((b) => {
          const active = b === btn;
          b.classList.toggle("active", active);
          b.setAttribute("aria-selected", String(active));
        });
        if (titleEl) titleEl.textContent = shapes[mode].title;
        if (teleEl) teleEl.textContent = shapes[mode].meta;
        pulseWave = 0;
        SoundEngine.playPhaseShift(idx);
      });
    });

    // Thermal Shockwave Trigger
    document.getElementById("hero-pulse-btn")?.addEventListener("click", () => {
      pulseWave = 0;
      for (const n of nodes) {
        const len = Math.hypot(n.x, n.y, n.z) || 1;
        n.vx += (n.x / len) * 0.11;
        n.vy += (n.y / len) * 0.11;
        n.vz += (n.z / len) * 0.11;
        n.heat = 1;
      }
      SoundEngine.playPluck(0.95);
    });

    function project3D(x, y, z, scale) {
      const cy = Math.cos(rotY);
      const sy = Math.sin(rotY);
      const cx = Math.cos(rotX);
      const sx = Math.sin(rotX);

      const x1 = x * cy - z * sy;
      const z1 = x * sy + z * cy;
      const y2 = y * cx - z1 * sx;
      const z2 = y * sx + z1 * cx;

      const fov = 3.2;
      const persp = fov / (fov - z2);
      return {
        sx: width * 0.5 + x1 * scale * persp,
        sy: height * 0.5 + y2 * scale * persp,
        z: z2,
        persp,
      };
    }

    function drawGyroRing(radius, rx, ry, rz, color, alpha, dashed) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 1.25;
      if (dashed) ctx.setLineDash([5, 5]);
      ctx.beginPath();
      const segs = 56;
      const scale = Math.min(width, height) * 0.34;
      for (let i = 0; i <= segs; i++) {
        const a = (i / segs) * Math.PI * 2;
        let x = Math.cos(a) * radius;
        let y = Math.sin(a) * radius;
        let z = 0;

        // Local 3-axis tourbillon rotation
        const y1 = y * Math.cos(rx) - z * Math.sin(rx);
        const z1 = y * Math.sin(rx) + z * Math.cos(rx);
        const x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
        const z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
        const x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
        const y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);

        const p = project3D(x3, y3, z2, scale);
        if (i === 0) ctx.moveTo(p.sx, p.sy);
        else ctx.lineTo(p.sx, p.sy);
      }
      ctx.stroke();
      ctx.restore();
    }

    function renderHero(now) {
      if (visible && width > 0) {
        const t = now * 0.001;
        ctx.clearRect(0, 0, width, height);

        if (!isDragging && !prefersReducedMotion) {
          velY = lerp(velY, 0.0038, 0.04);
          velX = lerp(velX, Math.sin(t * 0.5) * 0.0005, 0.04);
          rotY += velY;
          rotX = clamp(rotX + velX, -1.25, 1.25);
        }

        if (pulseWave >= 0) {
          pulseWave += 0.032;
          if (pulseWave > 1.8) pulseWave = -1;
        }

        const shape = shapes[currentMode];
        const targets = shape.pts;
        const scale = Math.min(width, height) * 0.34;

        // Inner Tri-Axial Tourbillon Gyroscope Cage
        drawGyroRing(0.42, t * 1.1, t * 0.7, 0, "#E5994B", 0.36, false);
        drawGyroRing(0.32, -t * 0.85, t * 1.35, t * 0.5, "#7CE7E1", 0.34, true);

        // Update spring morphing positions & project
        const projected = [];
        for (let i = 0; i < N; i++) {
          const n = nodes[i];
          const tg = targets[i];
          let tx = tg.x;
          let ty = tg.y;
          let tz = tg.z;

          if (currentMode === "graphene" && !prefersReducedMotion) {
            ty = Math.sin(tx * 3.2 + t * 2.4) * Math.cos(tz * 2.8 - t * 1.8) * 0.24;
          }

          n.vx = (n.vx + (tx - n.x) * 0.085) * 0.82;
          n.vy = (n.vy + (ty - n.y) * 0.085) * 0.82;
          n.vz = (n.vz + (tz - n.z) * 0.085) * 0.82;

          n.x += n.vx;
          n.y += n.vy;
          n.z += n.vz;

          if (pulseWave >= 0) {
            const r = Math.hypot(n.x, n.y, n.z);
            if (Math.abs(r - pulseWave) < 0.22) n.heat = Math.max(n.heat, 0.95);
          }
          n.heat *= 0.94;

          const p = project3D(n.x, n.y, n.z, scale);
          projected.push({ ...p, heat: n.heat, idx: i });
        }

        // Draw covalent bonds depth-aware
        ctx.lineCap = "round";
        for (const [a, b] of shape.edges) {
          const pa = projected[a];
          const pb = projected[b];
          const zAvg = (pa.z + pb.z) * 0.5;
          const depthAlpha = clamp(0.16 + (zAvg + 1.1) * 0.32, 0.1, 0.85);
          const heatMix = Math.max(pa.heat, pb.heat);

          ctx.beginPath();
          ctx.moveTo(pa.sx, pa.sy);
          ctx.lineTo(pb.sx, pb.sy);
          ctx.lineWidth = (1.05 + heatMix * 1.6) * ((pa.persp + pb.persp) * 0.45);
          ctx.strokeStyle =
            heatMix > 0.25
              ? `rgba(124, 231, 225, ${clamp(depthAlpha + 0.3, 0, 1)})`
              : currentMode === "diamond"
              ? `rgba(124, 231, 225, ${depthAlpha})`
              : `rgba(229, 153, 75, ${depthAlpha})`;
          ctx.stroke();
        }

        // Depth-sort atoms back-to-front
        projected.sort((a, b) => a.z - b.z);
        for (const p of projected) {
          const rad = clamp((2.6 + p.heat * 2.5) * p.persp, 1.8, 7.2);
          const frontFactor = clamp((p.z + 1.15) / 2.3, 0.15, 1);

          // Glow halo for foreground or heated atoms
          if (frontFactor > 0.62 || p.heat > 0.2) {
            const g = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, rad * 3.2);
            const glowCol =
              p.heat > 0.25 || currentMode === "diamond"
                ? `rgba(124, 231, 225, ${0.34 * frontFactor + p.heat * 0.3})`
                : `rgba(229, 153, 75, ${0.32 * frontFactor})`;
            g.addColorStop(0, glowCol);
            g.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(p.sx, p.sy, rad * 3.2, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(p.sx, p.sy, rad, 0, Math.PI * 2);
          ctx.fillStyle =
            p.heat > 0.3
              ? "#FFFFFF"
              : currentMode === "diamond"
              ? `rgba(210, 252, 250, ${0.35 + frontFactor * 0.65})`
              : `rgba(248, 212, 166, ${0.32 + frontFactor * 0.68})`;
          ctx.fill();
        }
      }
      requestAnimationFrame(renderHero);
    }
    requestAnimationFrame(renderHero);
  }

  /* ========================================================================
     6. ENGINE 2: 12 GPa STICKY SCROLL-SCRUBBED PHASE CANVAS
     ======================================================================== */
  function initPressureScrollytelling() {
    const outer = document.getElementById("pressure-journey");
    const canvas = document.getElementById("phase-scrub-canvas");
    if (!outer || !canvas) return;
    const ctx = canvas.getContext("2d");

    const stepBtns = document.querySelectorAll(".phase-step[data-phase-jump]");
    const phaseCards = document.querySelectorAll(".phase-card[data-phase-card]");
    const elPress = document.getElementById("tele-pressure");
    const elTemp = document.getElementById("tele-temp");
    const elSp3 = document.getElementById("tele-sp3");
    const elMohs = document.getElementById("tele-mohs");
    const miniFill = document.getElementById("scrub-mini-fill");
    const pctLabel = document.getElementById("scrub-percent-label");

    let targetProgress = 0;
    let smoothProgress = 0;
    let activePhase = 0;
    let width = 0;
    let height = 0;
    let visible = false;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const obs = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
      },
      { threshold: 0.02 }
    );
    obs.observe(outer);

    function updateScrollProgress() {
      const rect = outer.getBoundingClientRect();
      const scrollable = Math.max(1, outer.offsetHeight - window.innerHeight);
      targetProgress = clamp(-rect.top / scrollable, 0, 1);
    }
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress();

    // Jump buttons
    stepBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-phase-jump") || "0", 10);
        const scrollable = Math.max(1, outer.offsetHeight - window.innerHeight);
        const dest = outer.offsetTop + (idx / 3.05) * scrollable;
        window.scrollTo({ top: dest, behavior: "smooth" });
        SoundEngine.playPhaseShift(idx);
      });
    });

    // Particle ensemble with 4 target formations
    const COUNT = 88;
    const particles = Array.from({ length: COUNT }, (_, i) => {
      const angle = (i / COUNT) * Math.PI * 2 * 3;
      const rad = 0.16 + ((i * 37) % 100) / 145;
      // Nebula spiral
      const nebX = Math.cos(angle) * rad;
      const nebY = Math.sin(angle) * rad;

      // Forged Carbon 72-layer ribbon bands
      const band = i % 8;
      const along = (Math.floor(i / 8) / 10 - 0.5) * 1.5;
      const forgeX = along;
      const forgeY = ((band - 3.5) / 4.2) * 0.78 + Math.sin(along * 3.4 + band) * 0.08;

      // Hexagonal 2D Graphene Grid
      const cols = 11;
      const gxCol = i % cols;
      const gxRow = Math.floor(i / cols);
      const graphX = ((gxCol - 5) / 5.5) * 0.85;
      const graphY = ((gxRow - 3.5) / 4.5) * 0.78 + ((gxCol + gxRow) % 2 === 0 ? 0.04 : -0.04);

      // Diamond Octahedral Facets
      const ring = i % 4;
      const a2 = (Math.floor(i / 4) / 22) * Math.PI * 2;
      const r2 = [0.08, 0.28, 0.48, 0.68][ring];
      const diaX = Math.cos(a2) * r2 * (i % 2 === 0 ? 1 : 0.76);
      const diaY = Math.sin(a2) * r2;

      return { nebX, nebY, forgeX, forgeY, graphX, graphY, diaX, diaY, seed: i * 0.73 };
    });

    function renderPhase(now) {
      if (visible && width > 0) {
        smoothProgress = lerp(smoothProgress, targetProgress, 0.11);
        const p = smoothProgress;
        const t = now * 0.001;

        // Update UI Phase Stepper & Cards
        const nextPhase = Math.min(3, Math.floor(p * 3.99));
        if (nextPhase !== activePhase) {
          activePhase = nextPhase;
          stepBtns.forEach((b, idx) => b.classList.toggle("active", idx === activePhase));
          phaseCards.forEach((c, idx) => c.classList.toggle("active", idx === activePhase));
          SoundEngine.playTick(true);
        }

        // Update Live Telemetry Readouts
        const gpa = Math.pow(p, 1.7) * 12.0;
        const temp = Math.round(120 + p * 3430);
        const sp3 = Math.round(4 + Math.pow(p, 2.1) * 96);
        const mohs = (2.5 + Math.pow(p, 1.35) * 7.5).toFixed(1);

        if (elPress) elPress.innerHTML = `${gpa.toFixed(2)} <small>GPa</small>`;
        if (elTemp) elTemp.innerHTML = `${temp.toLocaleString("en-US")} <small>°C</small>`;
        if (elSp3) elSp3.innerHTML = `${sp3} <small>%</small>`;
        if (elMohs) elMohs.innerHTML = `${mohs} <small>Mohs</small>`;
        if (miniFill) miniFill.style.width = `${(p * 100).toFixed(1)}%`;
        if (pctLabel) pctLabel.textContent = `${String(Math.round(p * 100)).padStart(2, "0")}%`;

        // Draw Canvas Scene
        ctx.clearRect(0, 0, width, height);
        const cx = width * 0.5;
        const cy = height * 0.48;
        const scale = Math.min(width, height) * 0.46;

        // Ambient radial core glow shifting from warm nebula amber -> ice diamond cyan
        const coreGrad = ctx.createRadialGradient(cx, cy, 4, cx, cy, scale * 1.15);
        const cyanMix = clamp((p - 0.55) / 0.45, 0, 1);
        coreGrad.addColorStop(
          0,
          cyanMix > 0.3
            ? `rgba(124, 231, 225, ${0.14 + cyanMix * 0.14})`
            : `rgba(229, 153, 75, ${0.18 - cyanMix * 0.06})`
        );
        coreGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = coreGrad;
        ctx.fillRect(0, 0, width, height);

        // Diamond Prism Caustic Rays in Phase 4
        if (p > 0.68) {
          const rayAlpha = clamp((p - 0.68) / 0.32, 0, 1);
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(t * 0.18);
          for (let r = 0; r < 6; r++) {
            ctx.rotate(Math.PI / 3);
            const g = ctx.createLinearGradient(0, 0, scale * 1.1, 0);
            g.addColorStop(0, `rgba(124, 231, 225, ${0.26 * rayAlpha})`);
            g.addColorStop(0.5, `rgba(229, 153, 75, ${0.14 * rayAlpha})`);
            g.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(scale * 1.15, -18);
            ctx.lineTo(scale * 1.15, 18);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();

          // Rotating Octahedral Crystal Wireframe
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(-t * 0.25);
          const cr = scale * 0.66 * rayAlpha;
          ctx.strokeStyle = `rgba(124, 231, 225, ${0.65 * rayAlpha})`;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          for (let k = 0; k < 8; k++) {
            const a = (k / 8) * Math.PI * 2;
            const px = Math.cos(a) * cr;
            const py = Math.sin(a) * cr;
            if (k === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
        }

        // Interpolate particle coordinates across the 4 stages
        const screenPts = particles.map((pt) => {
          let x, y;
          if (p < 0.333) {
            const k = p / 0.333;
            const rotNebX = pt.nebX * Math.cos(t * 0.35) - pt.nebY * Math.sin(t * 0.35);
            const rotNebY = pt.nebX * Math.sin(t * 0.35) + pt.nebY * Math.cos(t * 0.35);
            x = lerp(rotNebX, pt.forgeX, k);
            y = lerp(rotNebY, pt.forgeY + Math.sin(t * 2 + pt.seed) * 0.025, k);
          } else if (p < 0.666) {
            const k = (p - 0.333) / 0.333;
            x = lerp(pt.forgeX, pt.graphX, k);
            y = lerp(pt.forgeY, pt.graphY + Math.sin(t * 2.5 + pt.graphX * 4) * 0.02, k);
          } else {
            const k = (p - 0.666) / 0.334;
            const rotDiaX = pt.diaX * Math.cos(t * 0.28) - pt.diaY * Math.sin(t * 0.28);
            const rotDiaY = pt.diaX * Math.sin(t * 0.28) + pt.diaY * Math.cos(t * 0.28);
            x = lerp(pt.graphX, rotDiaX, k);
            y = lerp(pt.graphY, rotDiaY, k);
          }
          return { sx: cx + x * scale, sy: cy + y * scale };
        });

        // Connect neighboring atoms as pressure increases
        if (p > 0.18) {
          const maxBond = scale * lerp(0.32, 0.28, p);
          ctx.lineWidth = 1.1;
          for (let i = 0; i < screenPts.length; i++) {
            for (let j = i + 1; j < screenPts.length; j++) {
              const d = Math.hypot(screenPts[i].sx - screenPts[j].sx, screenPts[i].sy - screenPts[j].sy);
              if (d < maxBond) {
                const alpha = (1 - d / maxBond) * clamp((p - 0.18) * 0.85, 0, 0.55);
                ctx.strokeStyle =
                  p > 0.68 ? `rgba(124, 231, 225, ${alpha})` : `rgba(229, 153, 75, ${alpha})`;
                ctx.beginPath();
                ctx.moveTo(screenPts[i].sx, screenPts[i].sy);
                ctx.lineTo(screenPts[j].sx, screenPts[j].sy);
                ctx.stroke();
              }
            }
          }
        }

        // Draw Carbon Nuclei
        for (const sp of screenPts) {
          ctx.beginPath();
          ctx.arc(sp.sx, sp.sy, p > 0.7 ? 3.2 : 2.7, 0, Math.PI * 2);
          ctx.fillStyle = p > 0.68 ? "#DDFCFB" : "#F5C284";
          ctx.fill();
        }
      }
      requestAnimationFrame(renderPhase);
    }
    requestAnimationFrame(renderPhase);
  }

  /* ========================================================================
     7. ENGINE 3: INTERACTIVE 2D GRAPHENE HOOKE SPRING-PHYSICS LAB
     ======================================================================== */
  function initGraphenePlayground() {
    const canvas = document.getElementById("graphene-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const energyEl = document.getElementById("graphene-energy");

    let stiffness = 0.075;
    let damping = 0.935;
    let forceRadius = 135;
    let mode = "ripple"; // ripple | pluck | shockwave

    let width = 0;
    let height = 0;
    let nodes = [];
    let springs = [];
    let visible = false;

    const pointer = { x: -999, y: -999, vx: 0, vy: 0, active: false, down: false, grabbed: null };
    const shockRings = [];

    function buildHexLattice() {
      nodes = [];
      springs = [];
      const spacingX = width < 640 ? 34 : 40;
      const spacingY = spacingX * 0.866;
      const cols = Math.max(8, Math.floor((width - 40) / spacingX));
      const rows = Math.max(6, Math.floor((height - 40) / spacingY));
      const offsetX = (width - (cols - 1) * spacingX) * 0.5;
      const offsetY = (height - (rows - 1) * spacingY) * 0.5;

      const grid = [];
      for (let r = 0; r < rows; r++) {
        const rowArr = [];
        for (let c = 0; c < cols; c++) {
          // Honeycomb brick pattern: shift alternate rows and stagger y slightly for true 120-deg hexagons
          const shift = (r % 2) * (spacingX * 0.5);
          const staggerY = (r + c) % 2 === 0 ? -spacingY * 0.14 : spacingY * 0.14;
          const ox = offsetX + c * spacingX + shift - spacingX * 0.25;
          const oy = offsetY + r * spacingY + staggerY;
          const pinned = r === 0 || r === rows - 1 || c === 0 || c === cols - 1;
          const node = { x: ox, y: oy, ox, oy, vx: 0, vy: 0, pinned };
          nodes.push(node);
          rowArr.push(node);
        }
        grid.push(rowArr);
      }

      // Connect true honeycomb covalent springs (horizontal + alternating vertical bridges)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const a = grid[r][c];
          if (c + 1 < cols) {
            const b = grid[r][c + 1];
            springs.push({ a, b, rest: Math.hypot(a.ox - b.ox, a.oy - b.oy) });
          }
          if (r + 1 < rows) {
            const b = grid[r + 1][c];
            if ((r + c) % 2 === 0 || c === 0 || c === cols - 1) {
              springs.push({ a, b, rest: Math.hypot(a.ox - b.ox, a.oy - b.oy) });
            }
            const diagC = r % 2 === 0 ? c - 1 : c + 1;
            if (diagC >= 0 && diagC < cols && (r + c) % 2 === 1) {
              const d = grid[r + 1][diagC];
              springs.push({ a, b: d, rest: Math.hypot(a.ox - d.ox, a.oy - d.oy) });
            }
          }
        }
      }
    }

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildHexLattice();
    }
    resize();
    window.addEventListener("resize", resize);

    const obs = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    obs.observe(canvas);

    // Controls
    document.querySelectorAll(".mode-pill[data-gmode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        mode = btn.getAttribute("data-gmode") || "ripple";
        document.querySelectorAll(".mode-pill[data-gmode]").forEach((b) => b.classList.toggle("active", b === btn));
        SoundEngine.playTick(true);
      });
    });

    document.getElementById("graphene-reset")?.addEventListener("click", () => {
      for (const n of nodes) {
        n.x = n.ox;
        n.y = n.oy;
        n.vx = 0;
        n.vy = 0;
      }
      SoundEngine.playTick(true);
    });

    const sStiff = document.getElementById("ctrl-stiffness");
    const vStiff = document.getElementById("val-stiffness");
    sStiff?.addEventListener("input", () => {
      stiffness = parseFloat(sStiff.value);
      if (vStiff) vStiff.textContent = stiffness.toFixed(3);
    });

    const sDamp = document.getElementById("ctrl-damping");
    const vDamp = document.getElementById("val-damping");
    sDamp?.addEventListener("input", () => {
      damping = parseFloat(sDamp.value);
      if (vDamp) vDamp.textContent = damping.toFixed(3);
    });

    const sRad = document.getElementById("ctrl-radius");
    const vRad = document.getElementById("val-radius");
    sRad?.addEventListener("input", () => {
      forceRadius = parseFloat(sRad.value);
      if (vRad) vRad.textContent = `${Math.round(forceRadius)} px`;
    });

    // Pointer physics interaction
    const shell = canvas.parentElement;
    function localCoords(e) {
      const r = shell.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    function triggerShockwave(x, y) {
      shockRings.push({ x, y, r: 6, alpha: 0.95 });
      for (const n of nodes) {
        if (n.pinned) continue;
        const dx = n.x - x;
        const dy = n.y - y;
        const d = Math.hypot(dx, dy) || 1;
        if (d < forceRadius * 1.8) {
          const f = (1 - d / (forceRadius * 1.8)) * 18;
          n.vx += (dx / d) * f;
          n.vy += (dy / d) * f;
        }
      }
      SoundEngine.playPluck(0.9);
    }

    shell.addEventListener("pointerdown", (e) => {
      const p = localCoords(e);
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.down = true;
      pointer.active = true;
      shell.setPointerCapture(e.pointerId);

      if (mode === "shockwave") {
        triggerShockwave(p.x, p.y);
      } else if (mode === "pluck") {
        let best = null;
        let bestD = 64;
        for (const n of nodes) {
          if (n.pinned) continue;
          const d = Math.hypot(n.x - p.x, n.y - p.y);
          if (d < bestD) {
            bestD = d;
            best = n;
          }
        }
        pointer.grabbed = best;
      } else {
        triggerShockwave(p.x, p.y);
      }
    });

    shell.addEventListener("pointermove", (e) => {
      const p = localCoords(e);
      pointer.vx = clamp(p.x - pointer.x, -36, 36);
      pointer.vy = clamp(p.y - pointer.y, -36, 36);
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.active = true;

      if (mode === "ripple" && !pointer.grabbed) {
        for (const n of nodes) {
          if (n.pinned) continue;
          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < forceRadius && d > 0.1) {
            const w = Math.pow(1 - d / forceRadius, 2);
            n.vx += pointer.vx * w * 0.24 + (dx / d) * w * 0.65;
            n.vy += pointer.vy * w * 0.24 + (dy / d) * w * 0.65;
          }
        }
      }
    });

    const releasePointer = () => {
      if (pointer.grabbed) {
        const stretch = Math.hypot(pointer.grabbed.x - pointer.grabbed.ox, pointer.grabbed.y - pointer.grabbed.oy);
        SoundEngine.playPluck(clamp(stretch / 80, 0.25, 1));
        pointer.grabbed = null;
      }
      pointer.down = false;
    };
    shell.addEventListener("pointerup", releasePointer);
    shell.addEventListener("pointercancel", releasePointer);
    shell.addEventListener("pointerleave", () => {
      pointer.active = false;
    });

    function stepGraphene() {
      if (visible && width > 0) {
        // Spring forces between covalent neighbors
        for (const s of springs) {
          const dx = s.b.x - s.a.x;
          const dy = s.b.y - s.a.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const diff = (dist - s.rest) * stiffness;
          const fx = (dx / dist) * diff;
          const fy = (dy / dist) * diff;
          if (!s.a.pinned) {
            s.a.vx += fx;
            s.a.vy += fy;
          }
          if (!s.b.pinned) {
            s.b.vx -= fx;
            s.b.vy -= fy;
          }
        }

        // Restoring anchor force & integration
        let totalEnergy = 0;
        for (const n of nodes) {
          if (n.pinned) continue;
          if (n === pointer.grabbed) {
            n.x = lerp(n.x, pointer.x, 0.45);
            n.y = lerp(n.y, pointer.y, 0.45);
            n.vx = 0;
            n.vy = 0;
            continue;
          }
          n.vx += (n.ox - n.x) * (stiffness * 0.35);
          n.vy += (n.oy - n.y) * (stiffness * 0.35);
          n.vx *= damping;
          n.vy *= damping;
          n.x += n.vx;
          n.y += n.vy;
          totalEnergy += n.vx * n.vx + n.vy * n.vy;
        }

        if (energyEl) {
          energyEl.textContent = `${(totalEnergy * 0.045).toFixed(2)} eV`;
        }

        // Render Lattice
        ctx.clearRect(0, 0, width, height);

        // Interaction Field Halo
        if (pointer.active) {
          const g = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, forceRadius);
          g.addColorStop(0, "rgba(229, 153, 75, 0.11)");
          g.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(pointer.x, pointer.y, forceRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Expanding Shockwave Rings
        for (let i = shockRings.length - 1; i >= 0; i--) {
          const ring = shockRings[i];
          ring.r += 7.5;
          ring.alpha *= 0.94;
          ctx.strokeStyle = `rgba(124, 231, 225, ${ring.alpha})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
          ctx.stroke();
          if (ring.alpha < 0.03) shockRings.splice(i, 1);
        }

        // Draw Covalent Bonds colored by live mechanical strain
        for (const s of springs) {
          const dist = Math.hypot(s.b.x - s.a.x, s.b.y - s.a.y);
          const strain = clamp(Math.abs(dist - s.rest) / 22, 0, 1);
          ctx.beginPath();
          ctx.moveTo(s.a.x, s.a.y);
          ctx.lineTo(s.b.x, s.b.y);
          ctx.lineWidth = 1.1 + strain * 1.9;
          if (strain > 0.35) {
            ctx.strokeStyle = `rgba(124, 231, 225, ${0.45 + strain * 0.55})`;
          } else {
            ctx.strokeStyle = `rgba(229, 153, 75, ${0.22 + strain * 0.65})`;
          }
          ctx.stroke();
        }

        // Draw Carbon Atoms
        for (const n of nodes) {
          const disp = Math.hypot(n.x - n.ox, n.y - n.oy);
          const hot = clamp(disp / 24, 0, 1);
          ctx.beginPath();
          ctx.arc(n.x, n.y, n === pointer.grabbed ? 5.8 : 2.5 + hot * 2.1, 0, Math.PI * 2);
          ctx.fillStyle =
            n === pointer.grabbed
              ? "#FFFFFF"
              : hot > 0.35
              ? "#7CE7E1"
              : n.pinned
              ? "rgba(255,255,255,0.25)"
              : "#F5B971";
          ctx.fill();
        }
      }
      requestAnimationFrame(stepGraphene);
    }
    requestAnimationFrame(stepGraphene);
  }

  /* ========================================================================
     8. ENGINE 4: 3D EXPLODED CALIBRE STACK & 10X OPTICAL X-RAY LOUPE
     ======================================================================== */
  function initExplodedStackAndLoupe() {
    // A. 3D Exploded Isometric Stack
    const slider = document.getElementById("explode-slider");
    const valLabel = document.getElementById("explode-val");
    const toggleBtn = document.getElementById("explode-toggle-btn");
    const stack = document.getElementById("exploded-stack");
    const viewport = document.getElementById("exploded-viewport");
    const isoLayers = document.querySelectorAll(".iso-layer[data-layer]");
    const specCards = document.querySelectorAll(".layer-spec-card[data-layer-btn]");

    function setExplode(pct) {
      const gap = (pct / 100) * 86;
      stack?.style.setProperty("--explode-gap", `${gap.toFixed(1)}px`);
      if (valLabel) valLabel.textContent = `${Math.round(pct)}%`;
      if (slider) slider.value = String(pct);
    }

    slider?.addEventListener("input", () => {
      setExplode(parseFloat(slider.value));
    });

    toggleBtn?.addEventListener("click", () => {
      const cur = parseFloat(slider?.value || "68");
      setExplode(cur > 20 ? 0 : 78);
      SoundEngine.playPhaseShift(1);
    });

    function focusLayer(idx) {
      isoLayers.forEach((l) => l.classList.toggle("active-focus", Number(l.getAttribute("data-layer")) === idx));
      specCards.forEach((c) => c.classList.toggle("active", Number(c.getAttribute("data-layer-btn")) === idx));
      SoundEngine.playTick(true);
    }

    isoLayers.forEach((l) => {
      l.addEventListener("click", () => focusLayer(Number(l.getAttribute("data-layer"))));
    });
    specCards.forEach((c) => {
      c.addEventListener("click", () => {
        focusLayer(Number(c.getAttribute("data-layer-btn")));
        if (parseFloat(slider?.value || "0") < 35) setExplode(72);
      });
    });

    viewport?.addEventListener("pointermove", (e) => {
      if (prefersReducedMotion || !stack) return;
      const r = viewport.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      stack.style.setProperty("--stack-rx", `${(56 - ny * 16).toFixed(2)}deg`);
      stack.style.setProperty("--stack-rz", `${(-36 + nx * 22).toFixed(2)}deg`);
    });
    viewport?.addEventListener("pointerleave", () => {
      stack?.style.setProperty("--stack-rx", "56deg");
      stack?.style.setProperty("--stack-rz", "-36deg");
    });

    // B. 10x Optical X-Ray Loupe
    const xrayStage = document.getElementById("xray-stage");
    const coordsEl = document.getElementById("loupe-coords");
    const radSlider = document.getElementById("loupe-radius-slider");
    const fullToggle = document.getElementById("xray-full-toggle");

    if (xrayStage) {
      let tx = 50;
      let ty = 62;
      let cx = 50;
      let cy = 62;

      const updateTarget = (e) => {
        const r = xrayStage.getBoundingClientRect();
        tx = clamp(((e.clientX - r.left) / r.width) * 100, 4, 96);
        ty = clamp(((e.clientY - r.top) / r.height) * 100, 4, 96);
      };

      xrayStage.addEventListener("pointermove", updateTarget, { passive: true });
      xrayStage.addEventListener("pointerdown", (e) => {
        xrayStage.setPointerCapture(e.pointerId);
        updateTarget(e);
      });

      radSlider?.addEventListener("input", () => {
        xrayStage.style.setProperty("--loupe-r", `${radSlider.value}px`);
      });

      fullToggle?.addEventListener("click", () => {
        const full = xrayStage.classList.toggle("full-scan");
        fullToggle.setAttribute("aria-pressed", String(full));
        SoundEngine.playPhaseShift(3);
      });

      function animateLoupe() {
        cx = lerp(cx, tx, 0.22);
        cy = lerp(cy, ty, 0.22);
        xrayStage.style.setProperty("--lx", `${cx.toFixed(2)}%`);
        xrayStage.style.setProperty("--ly", `${cy.toFixed(2)}%`);
        if (coordsEl) {
          coordsEl.textContent = `X: ${Math.round(cx)}% · Y: ${Math.round(cy)}%`;
        }
        requestAnimationFrame(animateLoupe);
      }
      requestAnimationFrame(animateLoupe);
    }
  }

  /* ========================================================================
     9. ENGINE 5: HOROLOGICAL CHRONO-BENCH & ACOUSTIC OSCILLOSCOPE
     ======================================================================== */
  function initChronoBench() {
    const canvas = document.getElementById("chrono-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const kpiAmp = document.getElementById("kpi-amp");
    const kpiBeat = document.getElementById("kpi-beat");
    const kpiRate = document.getElementById("kpi-rate");

    let currentHz = 4.0; // 28,800 vph = 8 beats/sec = 4 Hz
    let width = 0;
    let height = 0;
    let visible = false;
    let lastBeatIndex = -1;
    const trace = new Array(220).fill(0);

    const presets = {
      "2.5": { amp: "294°", beat: "0.1 ms", rate: "+0.12 s/d" },
      "4.0": { amp: "312°", beat: "0.0 ms", rate: "+0.04 s/d" },
      "5.0": { amp: "305°", beat: "0.0 ms", rate: "+0.02 s/d" },
      "10.0": { amp: "280°", beat: "0.0 ms", rate: "±0.00 s/d" },
    };

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const obs = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
      },
      { threshold: 0.15 }
    );
    obs.observe(canvas);

    document.querySelectorAll(".freq-btn[data-hz]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const hzStr = btn.getAttribute("data-hz") || "4.0";
        currentHz = parseFloat(hzStr);
        document.querySelectorAll(".freq-btn[data-hz]").forEach((b) => b.classList.toggle("active", b === btn));
        const info = presets[hzStr];
        if (info) {
          if (kpiAmp) kpiAmp.textContent = info.amp;
          if (kpiBeat) kpiBeat.textContent = info.beat;
          if (kpiRate) kpiRate.textContent = info.rate;
        }
        lastBeatIndex = -1;
        SoundEngine.playTick(true);
      });
    });

    function renderChrono(now) {
      if (visible && width > 0) {
        const t = now * 0.001;
        const beatsPerSec = currentHz * 2;
        const beatIndex = Math.floor(t * beatsPerSec);
        let impulse = 0;

        if (beatIndex !== lastBeatIndex) {
          lastBeatIndex = beatIndex;
          impulse = beatIndex % 2 === 0 ? 1 : -0.88;
          SoundEngine.playTick(beatIndex % 2 === 0);
        }

        // Push oscilloscope sample
        const harmonic = Math.sin(t * Math.PI * 2 * currentHz) * 0.18;
        trace.push(impulse !== 0 ? impulse : harmonic * (Math.random() * 0.25 + 0.85));
        if (trace.length > 220) trace.shift();

        ctx.clearRect(0, 0, width, height);

        const isCompact = width < 680;
        const wheelCX = isCompact ? width * 0.5 : width * 0.26;
        const wheelCY = height * 0.5;
        const wheelR = Math.min(isCompact ? width * 0.28 : width * 0.16, height * 0.36);

        // 1. Oscillating Balance Wheel & Breathing Graphene Hair-Spring
        const swingAngle = Math.sin(t * Math.PI * 2 * currentHz) * 1.45;
        ctx.save();
        ctx.translate(wheelCX, wheelCY);

        // Outer Timing Scale Ticks
        for (let i = 0; i < 36; i++) {
          const a = (i / 36) * Math.PI * 2;
          ctx.strokeStyle = i % 3 === 0 ? "rgba(229,153,75,0.45)" : "rgba(255,255,255,0.12)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * (wheelR * 1.14), Math.sin(a) * (wheelR * 1.14));
          ctx.lineTo(Math.cos(a) * (wheelR * 1.22), Math.sin(a) * (wheelR * 1.22));
          ctx.stroke();
        }

        // Balance Wheel Rim & Spokes
        ctx.save();
        ctx.rotate(swingAngle);
        ctx.strokeStyle = "#E5994B";
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.arc(0, 0, wheelR, 0, Math.PI * 2);
        ctx.stroke();

        for (let s = 0; s < 3; s++) {
          const sa = (s / 3) * Math.PI * 2;
          ctx.strokeStyle = "rgba(245, 185, 113, 0.8)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(sa) * wheelR, Math.sin(sa) * wheelR);
          ctx.stroke();

          // Micro regulating gold weights
          ctx.fillStyle = "#7CE7E1";
          ctx.beginPath();
          ctx.arc(Math.cos(sa + 0.52) * wheelR, Math.sin(sa + 0.52) * wheelR, 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Breathing Spiral Hair-Spring
        const breath = 1 + Math.sin(t * Math.PI * 2 * currentHz) * 0.12;
        ctx.strokeStyle = "#7CE7E1";
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        const turns = 4.2;
        for (let i = 0; i <= 90; i++) {
          const u = i / 90;
          const a = u * turns * Math.PI * 2 + swingAngle * 0.35;
          const sr = u * wheelR * 0.56 * breath;
          const px = Math.cos(a) * sr;
          const py = Math.sin(a) * sr;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Ruby Jewel Pivot
        ctx.fillStyle = "#FF4F79";
        ctx.beginPath();
        ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 2. Acoustic Timing Machine Oscilloscope (Right Panel)
        if (!isCompact) {
          const ox = width * 0.48;
          const ow = width * 0.47;
          const oy = height * 0.18;
          const oh = height * 0.64;
          const midY = oy + oh * 0.5;

          // Precision Grid
          ctx.strokeStyle = "rgba(255,255,255,0.06)";
          ctx.lineWidth = 1;
          for (let g = 0; g <= 4; g++) {
            const gy = oy + (g / 4) * oh;
            ctx.beginPath();
            ctx.moveTo(ox, gy);
            ctx.lineTo(ox + ow, gy);
            ctx.stroke();
          }

          // Waveform Trace
          ctx.strokeStyle = "#7CE7E1";
          ctx.lineWidth = 1.8;
          ctx.shadowColor = "rgba(124, 231, 225, 0.55)";
          ctx.shadowBlur = 10;
          ctx.beginPath();
          for (let i = 0; i < trace.length; i++) {
            const px = ox + (i / (trace.length - 1)) * ow;
            const py = midY - trace[i] * (oh * 0.44);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Label
          ctx.fillStyle = "rgba(255,255,255,0.48)";
          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.fillText(`ACOUSTIC ESCAPEMENT TRACE · ${(currentHz * 2).toFixed(1)} BEATS/S`, ox + 6, oy - 10);
        }
      }
      requestAnimationFrame(renderChrono);
    }
    requestAnimationFrame(renderChrono);
  }

  /* ========================================================================
     10. ENGINE 6: BESPOKE MONOLITH 3D CARD & LASER SPARK CELEBRATION
     ======================================================================== */
  function initBespokeForge() {
    const card = document.getElementById("monolith-card");
    const stage = document.getElementById("monolith-stage");
    const engraveInput = document.getElementById("engrave-input");
    const serialInput = document.getElementById("serial-input");
    const cardEngrave = document.getElementById("card-engrave-text");
    const cardSerial = document.getElementById("card-serial");
    const cardEditionTitle = document.getElementById("card-edition-title");
    const cardStrapSub = document.getElementById("card-strap-sub");
    const cardHash = document.getElementById("card-hash");
    const priceEl = document.getElementById("config-price");
    const feedbackEl = document.getElementById("mint-feedback");
    const form = document.getElementById("forge-form");
    const sparkCanvas = document.getElementById("spark-canvas");

    let selectedEdition = "obsidian";
    let selectedStrap = "Fluoro-Carbon Đúc";

    function computeShortHash(str) {
      let h = 2166136261;
      for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return (h >>> 0).toString(16).toUpperCase().padStart(8, "0").slice(0, 6);
    }

    function updateHash() {
      const raw = `${selectedEdition}-${engraveInput?.value}-${serialInput?.value}-${selectedStrap}`;
      if (cardHash) cardHash.textContent = `SHA-C6 · ${computeShortHash(raw)}`;
    }

    // Edition Switch
    document.querySelectorAll(".edition-opt[data-edition]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedEdition = btn.getAttribute("data-edition") || "obsidian";
        document.querySelectorAll(".edition-opt").forEach((b) => b.classList.toggle("active", b === btn));
        if (card) {
          card.classList.remove("edition-obsidian", "edition-cryo", "edition-magma");
          card.classList.add(`edition-${selectedEdition}`);
        }
        if (cardEditionTitle) cardEditionTitle.textContent = btn.getAttribute("data-edition-name") || "";
        if (priceEl) priceEl.textContent = btn.getAttribute("data-price") || "$48,000";
        updateHash();
        SoundEngine.playPhaseShift(0);
      });
    });

    // Strap Switch
    document.querySelectorAll(".strap-pill[data-strap]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedStrap = btn.getAttribute("data-strap") || "";
        document.querySelectorAll(".strap-pill").forEach((b) => b.classList.toggle("active", b === btn));
        if (cardStrapSub) cardStrapSub.textContent = `DÂY ${selectedStrap.toUpperCase()} · CALIBRE C6-T`;
        updateHash();
        SoundEngine.playTick(true);
      });
    });

    // Live Laser Engraving Text
    engraveInput?.addEventListener("input", () => {
      const val = engraveInput.value.trim().toUpperCase() || "CARBON · C6";
      if (cardEngrave) {
        cardEngrave.textContent = val;
        cardEngrave.classList.add("laser-flash");
        clearTimeout(cardEngrave._timer);
        cardEngrave._timer = setTimeout(() => cardEngrave.classList.remove("laser-flash"), 220);
      }
      updateHash();
      SoundEngine.playTick(false);
    });

    serialInput?.addEventListener("input", () => {
      const n = clamp(parseInt(serialInput.value || "6", 10) || 6, 1, 60);
      if (cardSerial) cardSerial.textContent = `NO. ${String(n).padStart(2, "0")} / 60`;
      updateHash();
      SoundEngine.playTick(false);
    });

    // 3D Holographic Tilt
    stage?.addEventListener("pointermove", (e) => {
      if (!card || prefersReducedMotion) return;
      const r = stage.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const ry = (px - 0.5) * 24;
      const rx = (0.5 - py) * 22;
      card.style.setProperty("--card-rx", `${rx.toFixed(2)}deg`);
      card.style.setProperty("--card-ry", `${ry.toFixed(2)}deg`);
      card.style.setProperty("--holo-x", `${(px * 100).toFixed(1)}%`);
      card.style.setProperty("--holo-y", `${(py * 100).toFixed(1)}%`);
    });
    stage?.addEventListener("pointerleave", () => {
      card?.style.setProperty("--card-rx", "0deg");
      card?.style.setProperty("--card-ry", "0deg");
      card?.style.setProperty("--holo-x", "50%");
      card?.style.setProperty("--holo-y", "50%");
    });

    // Laser Spark Celebration Emitter
    const sparks = [];
    let sparkAnimating = false;
    const sCtx = sparkCanvas?.getContext("2d");

    function spawnSparks() {
      if (!sparkCanvas || !sCtx) return;
      const rect = sparkCanvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sparkCanvas.width = Math.round(rect.width * dpr);
      sparkCanvas.height = Math.round(rect.height * dpr);
      sCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cx = rect.width * 0.5;
      const cy = rect.height * 0.54;
      for (let i = 0; i < 85; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 2 + Math.random() * 8.5;
        sparks.push({
          x: cx,
          y: cy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 2.2,
          life: 1,
          decay: 0.014 + Math.random() * 0.02,
          color: i % 3 === 0 ? "#7CE7E1" : "#F5B971",
          size: 1.5 + Math.random() * 2.5,
        });
      }

      if (!sparkAnimating) {
        sparkAnimating = true;
        requestAnimationFrame(tickSparks);
      }
    }

    function tickSparks() {
      if (!sparkCanvas || !sCtx) return;
      const w = sparkCanvas.clientWidth;
      const h = sparkCanvas.clientHeight;
      sCtx.clearRect(0, 0, w, h);

      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.vy += 0.14;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        if (p.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        sCtx.globalAlpha = p.life;
        sCtx.fillStyle = p.color;
        sCtx.beginPath();
        sCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        sCtx.fill();
      }
      sCtx.globalAlpha = 1;

      if (sparks.length > 0) {
        requestAnimationFrame(tickSparks);
      } else {
        sparkAnimating = false;
      }
    }

    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      spawnSparks();
      SoundEngine.playLaserSpark();
      const serial = String(clamp(parseInt(serialInput?.value || "6", 10) || 6, 1, 60)).padStart(2, "0");
      const owner = (engraveInput?.value || "CARBON · C6").trim().toUpperCase();
      const code = cardHash?.textContent?.split("·")[1]?.trim() || "8F06A9";
      if (feedbackEl) {
        feedbackEl.textContent = `✓ Đã khắc chứng thư KRONOS #${serial}/60 cho "${owner}" · Mã xác thực: C6-${code}`;
      }
    });
  }

  /* ========================================================================
     INITIALIZE ALL SYSTEMS
     ======================================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    initPreloaderAndChrome();
    initCursorAndGlare();
    initScrollChoreography();
    initHero3DEngine();
    initPressureScrollytelling();
    initGraphenePlayground();
    initExplodedStackAndLoupe();
    initChronoBench();
    initBespokeForge();
  });
})();
