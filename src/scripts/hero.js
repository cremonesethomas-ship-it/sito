/* ============================================================
   Hero WebGL — superficie della laguna con riflessi dorati
   Caricato solo sulla home. Degrada a gradiente statico.
   ============================================================ */

const canvas = document.getElementById('heroCanvas');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = window.matchMedia('(pointer: coarse)').matches;
const lowRam = (navigator.deviceMemory || 8) < 4;
const lowCores = (navigator.hardwareConcurrency || 8) < 4;

if (canvas && !reduced && !lowRam && !lowCores && (!coarse || window.innerWidth > 900)) {
  init().catch(() => { /* fallback statico già a schermo */ });
}

async function init() {
  const THREE = await import('./lib/three.module.js');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const uniforms = {
    uTime:     { value: 0 },
    uRes:      { value: new THREE.Vector2(1, 1) },
    uMouse:    { value: new THREE.Vector2(0.5, 0.5) },
    uGold:     { value: new THREE.Color('#c9a84c') },
    uGoldHi:   { value: new THREE.Color('#e8c975') },
    uLagoon:   { value: new THREE.Color('#1d2b28') },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    vertexShader: /* glsl */`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */`
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2  uRes;
      uniform vec2  uMouse;
      uniform vec3  uGold;
      uniform vec3  uGoldHi;
      uniform vec3  uLagoon;

      // rumore value-noise leggero
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }
      float fbm(vec2 p) {
        float v = 0.0, a = 0.5;
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p = p * 2.03 + vec2(11.3, 7.7);
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = vUv;
        vec2 p = uv;
        p.x *= uRes.x / uRes.y;

        float t = uTime * 0.06;

        // onde della laguna: due strati sfasati
        float w1 = fbm(p * 2.6 + vec2(t, t * 0.4));
        float w2 = fbm(p * 5.2 - vec2(t * 0.7, t * 0.25));
        float water = w1 * 0.65 + w2 * 0.35;

        // increspatura attorno al puntatore
        vec2 m = uMouse;
        m.x *= uRes.x / uRes.y;
        float d = distance(p, m);
        float ripple = smoothstep(0.55, 0.0, d) * sin(d * 26.0 - uTime * 1.6) * 0.06;
        water += ripple;

        // bande di luce dorata: riflessi sull'acqua
        float bands = sin((uv.y * 16.0) + water * 7.0 - uTime * 0.35);
        bands = pow(max(bands, 0.0), 7.0);

        float glow = smoothstep(0.85, 0.0, distance(uv, vec2(0.62, 0.42)));

        vec3 col = mix(vec3(0.031), uLagoon, water * 0.35);
        col += uGold  * bands * 0.46 * (0.4 + glow);
        col += uGoldHi * pow(water, 3.2) * 0.3;
        col += uGold * glow * 0.07;

        // vignettatura
        float vig = smoothstep(1.15, 0.25, distance(uv, vec2(0.5)));
        col *= 0.55 + vig * 0.45;

        float alpha = clamp(0.38 + water * 0.6 + bands * 0.55, 0.0, 1.0);
        gl_FragColor = vec4(col, alpha);
      }
    `,
  });

  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

  function resize() {
    const w = canvas.clientWidth || canvas.parentElement.clientWidth;
    const h = canvas.clientHeight || canvas.parentElement.clientHeight;
    renderer.setSize(w, h, false);
    uniforms.uRes.value.set(w, h);
  }
  resize();
  addEventListener('resize', resize, { passive: true });

  let tx = 0.5, ty = 0.45;
  addEventListener('pointermove', e => {
    tx = e.clientX / innerWidth;
    ty = 1 - e.clientY / innerHeight;
  }, { passive: true });

  // Si ferma quando l'hero esce dallo schermo: niente GPU sprecata
  let visible = true;
  const hero = document.getElementById('hero');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 }).observe(hero);
  }

  const start = performance.now();
  (function loop(now) {
    requestAnimationFrame(loop);
    if (!visible) return;
    uniforms.uTime.value = (now - start) / 1000;
    uniforms.uMouse.value.x += (tx - uniforms.uMouse.value.x) * 0.045;
    uniforms.uMouse.value.y += (ty - uniforms.uMouse.value.y) * 0.045;
    renderer.render(scene, camera);
  })(start);

  canvas.classList.add('is-ready');
}
