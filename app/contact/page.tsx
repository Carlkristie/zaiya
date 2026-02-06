"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════
   WebGL Shader Mist — GPU-accelerated, 60fps
   • Simplex noise fBm computed entirely on GPU
   • 4 parallax layers at different speeds
   • Mouse-reactive repulsion via uniform
   • Vertical density mask (densest at junction)
   • Subtle color variance (off-white ↔ cool-gray)
   • Turbulence for organic irregular flow
   ═══════════════════════════════════════════════════════════════════ */

const VERT_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAG_SHADER = `
  precision highp float;

  uniform vec2  u_resolution;
  uniform float u_time;
  uniform vec2  u_mouse;     // normalised 0–1, (-1,-1) when inactive
  uniform float u_dpr;

  /* ── Simplex 2D (Ashima / MIT) ── */
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v){
    const vec4 C = vec4(
       0.211324865405187,   // (3-sqrt(3))/6
       0.366025403784439,   // 0.5*(sqrt(3)-1)
      -0.577350269189626,   // -1+2*C.x
       0.024390243902439);  // 1/41
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                            + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                            dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
    vec3 h  = abs(x_) - 0.5;
    vec3 ox = floor(x_ + 0.5);
    vec3 a0 = x_ - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x  + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  /* ── Fractional Brownian Motion (6 octaves) ── */
  float fbm(vec2 p, float t){
    float v = 0.0, a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for(int i = 0; i < 6; i++){
      v += a * snoise(p + t);
      p = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  /* ── Turbulence: warps coordinates for organic flow ── */
  vec2 turbulence(vec2 p, float t){
    float tx = fbm(p + vec2(1.7, 9.2) + 0.15 * t, t * 0.1);
    float ty = fbm(p + vec2(8.3, 2.8) + 0.12 * t, t * 0.08);
    return vec2(tx, ty);
  }

  void main(){
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 st = vec2(uv.x * aspect, uv.y);

    float t = u_time;

    /* ── 4 mist layers with parallax speeds ── */
    float mist = 0.0;

    // Layer 1 — large slow clouds (back)
    {
      vec2 p = st * 1.8;
      vec2 turb = turbulence(p * 0.4, t * 0.08);
      p += turb * 0.6;
      p.x += t * 0.025;
      p.y += sin(t * 0.06) * 0.15;
      float n = fbm(p, t * 0.04);
      n = smoothstep(-0.1, 0.65, n);
      mist += n * 0.38;
    }
    // Layer 2 — medium speed (mid-back)
    {
      vec2 p = st * 2.5 + vec2(50.0);
      vec2 turb = turbulence(p * 0.5, t * 0.1);
      p += turb * 0.5;
      p.x += t * 0.04;
      p.y -= sin(t * 0.09 + 1.0) * 0.12;
      float n = fbm(p, t * 0.06);
      n = smoothstep(0.0, 0.7, n);
      mist += n * 0.30;
    }
    // Layer 3 — fine wisps (mid-front)
    {
      vec2 p = st * 4.0 + vec2(120.0);
      vec2 turb = turbulence(p * 0.6, t * 0.12);
      p += turb * 0.4;
      p.x += t * 0.065;
      p.y += cos(t * 0.12 + 2.5) * 0.1;
      float n = fbm(p, t * 0.08);
      n = smoothstep(0.05, 0.75, n);
      mist += n * 0.22;
    }
    // Layer 4 — fastest thin tendrils (front)
    {
      vec2 p = st * 6.0 + vec2(200.0);
      vec2 turb = turbulence(p * 0.7, t * 0.14);
      p += turb * 0.35;
      p.x -= t * 0.08;
      p.y += sin(t * 0.15 + 4.0) * 0.08;
      float n = fbm(p, t * 0.1);
      n = smoothstep(0.1, 0.8, n);
      mist += n * 0.18;
    }

    /* ── Vertical density mask: densest at junction (uv.y ≈ 0.45) ── */
    float junction = 0.45;
    float dist = abs(uv.y - junction);
    // Asymmetric: allow wisps to drift further into the dark area (top)
    float maskTop = smoothstep(0.55, 0.0, dist) * step(uv.y, junction);  // into dark
    float maskBot = smoothstep(0.45, 0.0, dist) * step(junction, uv.y);  // into light
    float vMask = maskTop + maskBot;
    // Soften with a power curve for wispy edges
    vMask = pow(vMask, 1.2);

    mist *= vMask;

    /* ── Mouse repulsion ── */
    if(u_mouse.x > -0.5){
      vec2 mUv = u_mouse;
      float mDist = distance(uv, mUv);
      float repulse = smoothstep(0.0, 0.12, mDist);
      mist *= mix(0.08, 1.0, repulse);
    }

    /* ── Color: subtle off-white → cool-gray variance ── */
    // Top (dark side) gets cooler tint, bottom stays warm white
    vec3 warmWhite = vec3(0.98, 0.99, 1.0);
    vec3 coolGray  = vec3(0.886, 0.906, 0.93);  // ~#e2e8f0
    float colorMix = smoothstep(0.0, 1.0, uv.y);
    vec3 mistColor = mix(coolGray, warmWhite, colorMix);

    // Add very subtle purple tint in the densest areas
    vec3 purpleTint = vec3(0.92, 0.90, 0.97);
    mistColor = mix(mistColor, purpleTint, mist * 0.15);

    /* ── Top blend: dark bg fades into mist ── */
    float topBlend = smoothstep(0.0, 0.15, uv.y);

    /* ── Bottom blend: white bg fades into mist ── */
    float botBlend = smoothstep(1.0, 0.82, uv.y);

    float finalAlpha = clamp(mist * topBlend * botBlend, 0.0, 1.0);

    gl_FragColor = vec4(mistColor, finalAlpha);
  }
`;

/* ─── WebGL Mist Component ─── */
function MistTransition() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
  const mouseRef = useRef<[number, number]>([-1, -1]);
  const smoothMouseRef = useRef<[number, number]>([-1, -1]);
  const rafRef = useRef(0);
  const startTimeRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const initGL = useCallback((canvas: HTMLCanvasElement) => {
    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) return false;
    glRef.current = gl;

    // Compile shaders
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, VERT_SHADER);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, FRAG_SHADER);
    gl.compileShader(fs);

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);
    programRef.current = program;

    // Full-screen quad (two triangles)
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1,  -1, 1,
      -1,  1,  1, -1,   1, 1,
    ]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    uniformsRef.current = {
      u_resolution: gl.getUniformLocation(program, "u_resolution"),
      u_time: gl.getUniformLocation(program, "u_time"),
      u_mouse: gl.getUniformLocation(program, "u_mouse"),
      u_dpr: gl.getUniformLocation(program, "u_dpr"),
    };

    // Blending for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    return true;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isMobile) return;

    // Set canvas size
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      glRef.current?.viewport(0, 0, canvas.width, canvas.height);
    };

    if (!initGL(canvas)) return;
    resize();
    startTimeRef.current = performance.now();

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height; // flip Y for GL
      mouseRef.current = [x, y];
    };
    const onMouseLeave = () => {
      mouseRef.current = [-1, -1];
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    // Render loop
    const render = () => {
      const gl = glRef.current;
      const u = uniformsRef.current;
      if (!gl || !programRef.current) return;

      const t = (performance.now() - startTimeRef.current) / 1000;

      // Smooth mouse interpolation
      const target = mouseRef.current;
      const sm = smoothMouseRef.current;
      const lerp = 0.08;
      if (target[0] < 0) {
        sm[0] += (-1 - sm[0]) * lerp;
        sm[1] += (-1 - sm[1]) * lerp;
      } else {
        sm[0] += (target[0] - sm[0]) * lerp;
        sm[1] += (target[1] - sm[1]) * lerp;
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform2f(u.u_resolution, canvas.width, canvas.height);
      gl.uniform1f(u.u_time, t);
      gl.uniform2f(u.u_mouse, sm[0], sm[1]);
      gl.uniform1f(u.u_dpr, dpr);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 100);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      // Cleanup GL
      const gl = glRef.current;
      if (gl && programRef.current) {
        gl.deleteProgram(programRef.current);
      }
    };
  }, [initGL, isMobile]);

  // On mobile, render a simple CSS gradient transition instead
  if (isMobile) {
    return (
      <div
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        style={{
          height: '200px',
          zIndex: 5,
          background: 'linear-gradient(to bottom, transparent 0%, rgba(248,250,252,0.3) 30%, rgba(248,250,252,0.7) 60%, white 100%)',
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute bottom-0 left-0 w-full pointer-events-none"
      style={{ height: "400px", zIndex: 5 }}
    />
  );
}

/* ─── Contact Info Data ─── */
const contactMethods = [
  {
    label: "Email",
    value: "info@zaiya.com",
    href: "mailto:info@zaiya.com",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "Phone",
    value: "+1 234 567 890",
    href: "tel:+1234567890",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    label: "Location",
    value: "San Francisco, CA",
    href: null,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

/* ─── FAQ Data ─── */
const faqs = [
  {
    q: "What's your typical response time?",
    a: "We respond to all inquiries within 24 hours on business days. Urgent security matters receive priority attention.",
  },
  {
    q: "Do you offer free consultations?",
    a: "Yes — we provide a complimentary 30-minute discovery call to understand your needs and determine if we're the right fit.",
  },
  {
    q: "What industries do you work with?",
    a: "We serve startups, SaaS platforms, fintech, healthcare, and enterprise organizations. If you handle sensitive data, we can help.",
  },
  {
    q: "Can you work with our existing team?",
    a: "Absolutely. We integrate seamlessly with in-house teams as embedded engineers, security consultants, or technical advisors.",
  },
];

/* ─── FAQ Item ─── */
function FAQItem({ item, index }: { item: (typeof faqs)[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="border-b border-slate-200 last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 sm:py-6 text-left group"
      >
        <span className="text-sm sm:text-base font-medium text-slate-900 group-hover:text-slate-700 transition-colors pr-4">
          {item.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-slate-400 group-hover:border-slate-500 group-hover:text-slate-600 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 1v10M1 6h10" />
          </svg>
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="pb-5 sm:pb-6 text-sm text-slate-500 leading-relaxed max-w-xl">
          {item.a}
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ─── Form Component ─── */
function ContactForm() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    budget: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef<HTMLFormElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, wire this to your API / email service
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const inputClasses =
    "w-full px-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all duration-200";

  return (
    <motion.form
      ref={ref}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5 tracking-wide uppercase font-[family-name:var(--font-geist-mono)]">
            Name *
          </label>
          <input
            type="text"
            required
            placeholder="Jane Doe"
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            className={inputClasses}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5 tracking-wide uppercase font-[family-name:var(--font-geist-mono)]">
            Email *
          </label>
          <input
            type="email"
            required
            placeholder="jane@company.com"
            value={formState.email}
            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5 tracking-wide uppercase font-[family-name:var(--font-geist-mono)]">
            Company
          </label>
          <input
            type="text"
            placeholder="Acme Inc."
            value={formState.company}
            onChange={(e) => setFormState({ ...formState, company: e.target.value })}
            className={inputClasses}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5 tracking-wide uppercase font-[family-name:var(--font-geist-mono)]">
            Service Interested In
          </label>
          <select
            value={formState.service}
            onChange={(e) => setFormState({ ...formState, service: e.target.value })}
            className={`${inputClasses} appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_16px_center] bg-no-repeat pr-10`}
          >
            <option value="">Select a service</option>
            <option value="pentest">Penetration Testing</option>
            <option value="webdev">Web Development</option>
            <option value="cloud">Cloud Auditing</option>
            <option value="compliance">Compliance & GRC</option>
            <option value="consulting">Security Consulting</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1.5 tracking-wide uppercase font-[family-name:var(--font-geist-mono)]">
          Estimated Budget
        </label>
        <select
          value={formState.budget}
          onChange={(e) => setFormState({ ...formState, budget: e.target.value })}
          className={`${inputClasses} appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_16px_center] bg-no-repeat pr-10`}
        >
          <option value="">Select a range</option>
          <option value="5k-10k">$5,000 – $10,000</option>
          <option value="10k-25k">$10,000 – $25,000</option>
          <option value="25k-50k">$25,000 – $50,000</option>
          <option value="50k+">$50,000+</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1.5 tracking-wide uppercase font-[family-name:var(--font-geist-mono)]">
          Message *
        </label>
        <textarea
          required
          rows={5}
          placeholder="Tell us about your project, timeline, and any specific requirements…"
          value={formState.message}
          onChange={(e) => setFormState({ ...formState, message: e.target.value })}
          className={`${inputClasses} resize-none`}
        />
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="relative w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white text-sm font-medium rounded-full overflow-hidden group"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {submitted ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Sent — We&apos;ll be in touch
            </>
          ) : (
            <>
              Send Message
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </>
          )}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.button>
    </motion.form>
  );
}

/* ─── Main Page ─── */
export default function ContactPage() {
  const heroRef = useRef<HTMLElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const infoRef = useRef<HTMLDivElement>(null);
  const infoInView = useInView(infoRef, { once: true, margin: "-60px" });

  return (
    <main className="bg-white text-slate-900 overflow-x-clip">
      <Navbar />

      {/* ─── Hero Section ─── */}
      <section
        ref={heroRef}
        className="relative min-h-[60vh] sm:min-h-[70vh] flex items-end bg-slate-950 overflow-hidden pb-[200px]"
      >
        {/* Grid pattern background */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,.25) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,.25) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-500/6 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-5 sm:px-8 md:px-12 lg:px-16 pb-16 sm:pb-20 pt-32 sm:pt-36">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-xs tracking-[0.25em] uppercase text-slate-500 font-[family-name:var(--font-geist-mono)] mb-4"
          >
            Get in Touch
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white font-[family-name:var(--font-space-grotesk)] leading-[1.05] tracking-tight mb-5"
          >
            Let&apos;s Build
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-500">
              Something Secure
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400 max-w-lg leading-relaxed"
          >
            Have a project in mind? Whether you need a security audit, a new web
            application, or strategic consulting — we&apos;re here to help.
          </motion.p>
        </div>

        {/* Animated mist transition */}
        <MistTransition />
      </section>

      {/* ─── Form + Info Section ─── */}
      <section className="bg-white py-16 sm:py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Left: Contact Info */}
            <div ref={infoRef} className="lg:col-span-4 lg:pt-2">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={infoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="inline-block text-xs tracking-[0.25em] uppercase text-slate-400 font-[family-name:var(--font-geist-mono)] mb-3"
              >
                Contact Info
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 14 }}
                animate={infoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-slate-900 mb-8"
              >
                Reach out directly
              </motion.h2>

              <div className="space-y-6 mb-12">
                {contactMethods.map((method, i) => (
                  <motion.div
                    key={method.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={infoInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 flex-shrink-0">
                      {method.icon}
                    </div>
                    <div>
                      <p className="text-xs tracking-wider uppercase text-slate-400 font-[family-name:var(--font-geist-mono)] mb-0.5">
                        {method.label}
                      </p>
                      {method.href ? (
                        <a
                          href={method.href}
                          className="text-sm font-medium text-slate-900 hover:text-slate-600 transition-colors"
                        >
                          {method.value}
                        </a>
                      ) : (
                        <span className="text-sm font-medium text-slate-900">
                          {method.value}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Availability badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={infoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs font-medium text-emerald-700">
                  Currently accepting new projects
                </span>
              </motion.div>

              {/* Social links */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={infoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-10"
              >
                <p className="text-xs tracking-wider uppercase text-slate-400 font-[family-name:var(--font-geist-mono)] mb-3">
                  Follow Us
                </p>
                <div className="flex items-center gap-3">
                  {[
                    { label: "X", href: "#" },
                    { label: "LI", href: "#" },
                    { label: "GH", href: "#" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-xs font-medium text-slate-500 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 font-[family-name:var(--font-geist-mono)]"
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 md:p-10 shadow-sm">
                <h3 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-slate-900 mb-1">
                  Start a conversation
                </h3>
                <p className="text-sm text-slate-500 mb-8">
                  Fill out the form below and we&apos;ll get back to you within 24 hours.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <section className="bg-slate-950 py-16 sm:py-24 md:py-28">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block text-xs tracking-[0.25em] uppercase text-slate-500 font-[family-name:var(--font-geist-mono)] mb-3">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-space-grotesk)] text-white">
              Common Questions
            </h2>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
            {faqs.map((faq, i) => (
              <FAQItem key={i} item={faq} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Map / CTA Banner ─── */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="relative bg-slate-950 rounded-3xl overflow-hidden p-8 sm:p-12 md:p-16 lg:p-20"
          >
            {/* Decorative grid */}
            <div className="absolute inset-0 opacity-[0.03]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)
                  `,
                  backgroundSize: "40px 40px",
                }}
              />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <span className="inline-block text-xs tracking-[0.25em] uppercase text-slate-500 font-[family-name:var(--font-geist-mono)] mb-4">
                Ready to Start?
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-[family-name:var(--font-space-grotesk)] text-white mb-5 leading-tight">
                Your next project
                <br />
                starts with a conversation
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mb-8 max-w-md mx-auto">
                No commitment needed. Let&apos;s discuss your goals and see how we
                can bring them to life — securely and beautifully.
              </p>
              <a
                href="mailto:info@zaiya.com"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-slate-900 text-sm font-medium rounded-full hover:bg-slate-100 transition-colors group"
              >
                info@zaiya.com
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:translate-x-0.5 transition-transform"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
