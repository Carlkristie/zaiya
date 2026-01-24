"use client";
import { useEffect, useRef, useCallback } from "react";

interface LiquidRevealProps {
  imageA: string; // Base image (face/background - shown through distortion)
  imageB: string; // Overlay image (helmet - gets distorted)
  className?: string;
  children?: React.ReactNode;
}

// Vertex shader - simple fullscreen quad
const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_uv;
  
  void main() {
    v_uv = a_texCoord;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Physics simulation shader (velocity field)
const simulationShaderSource = `
  precision highp float;
  
  varying vec2 v_uv;
  
  uniform sampler2D u_velocityTexture;
  uniform vec2 u_mouse;
  uniform vec2 u_mouseDelta;
  uniform float u_mouseActive;
  uniform float u_time;
  uniform float u_aspectRatio;
  uniform float u_phantomActive;
  uniform vec2 u_phantomPos;
  uniform vec2 u_phantomDir;
  
  // Simplex noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  void main() {
    vec2 uv = v_uv;
    
    // Read previous velocity
    vec4 velocity = texture2D(u_velocityTexture, uv);
    
    // Aspect-correct the UV for distance calculations
    vec2 aspectUV = uv;
    aspectUV.x *= u_aspectRatio;
    
    // === Mouse Interaction ===
    vec2 aspectMouse = u_mouse;
    aspectMouse.x *= u_aspectRatio;
    float mouseDist = distance(aspectUV, aspectMouse);
    float mouseRadius = 0.15;
    float mouseStrength = 0.5;
    
    if (mouseDist < mouseRadius && u_mouseActive > 0.5) {
      float influence = smoothstep(mouseRadius, 0.0, mouseDist);
      vec2 dir = normalize(uv - u_mouse + 0.0001);
      velocity.xy += dir * influence * mouseStrength * 0.5;
      velocity.xy += u_mouseDelta * influence * 3.0;
    }
    
    // === Phantom Forces (Random triggers) ===
    vec2 aspectPhantom = u_phantomPos;
    aspectPhantom.x *= u_aspectRatio;
    float phantomDist = distance(aspectUV, aspectPhantom);
    float phantomRadius = 0.2;
    float phantomStrength = 0.35;
    
    if (phantomDist < phantomRadius && u_phantomActive > 0.5) {
      float influence = smoothstep(phantomRadius, 0.0, phantomDist);
      velocity.xy += u_phantomDir * influence * phantomStrength;
    }
    
    // === Ambient Noise Movement ===
    float noiseScale = 3.0;
    float noiseSpeed = 0.2;
    float noise1 = snoise(vec2(uv.x * noiseScale + u_time * noiseSpeed, uv.y * noiseScale));
    float noise2 = snoise(vec2(uv.x * noiseScale, uv.y * noiseScale + u_time * noiseSpeed + 100.0));
    vec2 ambientForce = vec2(cos(noise1 * 3.14159), sin(noise2 * 3.14159)) * 0.002;
    velocity.xy += ambientForce;
    
    // === Advection (Self-advect for swirl effect) ===
    vec2 advectedUV = uv - velocity.xy * 0.015;
    advectedUV = clamp(advectedUV, 0.001, 0.999);
    vec4 advectedVel = texture2D(u_velocityTexture, advectedUV);
    velocity.xy = mix(velocity.xy, advectedVel.xy, 0.15);
    
    // === Decay / Viscosity ===
    velocity.xy *= 0.97;
    
    // Clamp velocity to prevent overflow
    velocity.xy = clamp(velocity.xy, -1.0, 1.0);
    
    gl_FragColor = velocity;
  }
`;

// Render shader (displacement + reveal)
const renderShaderSource = `
  precision highp float;
  
  varying vec2 v_uv;
  
  uniform sampler2D u_baseTexture;     // Face/background
  uniform sampler2D u_overlayTexture;  // Helmet
  uniform sampler2D u_velocityTexture; // Simulation output
  uniform vec2 u_baseSize;
  uniform vec2 u_overlaySize;
  uniform vec2 u_resolution;
  uniform float u_distortionStrength;
  uniform float u_revealStrength;
  
  // Cover UV calculation
  vec2 getCoverUV(vec2 uv, vec2 texSize, vec2 planeSize) {
    float planeAspect = planeSize.x / planeSize.y;
    float texAspect = texSize.x / texSize.y;
    
    vec2 scale = vec2(1.0);
    vec2 offset = vec2(0.0);
    
    if (planeAspect > texAspect) {
      scale.y = texAspect / planeAspect;
      offset.y = (1.0 - scale.y) * 0.5;
    } else {
      scale.x = planeAspect / texAspect;
      offset.x = (1.0 - scale.x) * 0.5;
    }
    
    return uv * scale + offset;
  }
  
  void main() {
    vec2 uv = vec2(v_uv.x, 1.0 - v_uv.y); // Flip Y
    
    // Get velocity/force from physics simulation
    vec4 velocity = texture2D(u_velocityTexture, v_uv);
    float velocityMagnitude = length(velocity.xy);
    
    // Distort UVs based on velocity
    vec2 distortion = velocity.xy * u_distortionStrength;
    vec2 distortedUV = uv - distortion;
    
    // Calculate cover UVs
    vec2 baseUV = getCoverUV(uv, u_baseSize, u_resolution);
    vec2 overlayUV = getCoverUV(distortedUV, u_overlaySize, u_resolution);
    
    // Sample textures
    vec4 baseColor = texture2D(u_baseTexture, baseUV);
    vec4 overlayColor = texture2D(u_overlayTexture, overlayUV);
    
    // Chromatic aberration on overlay based on velocity
    float chromaOffset = velocityMagnitude * 0.025;
    vec4 overlayR = texture2D(u_overlayTexture, overlayUV + vec2(chromaOffset, 0.0));
    vec4 overlayB = texture2D(u_overlayTexture, overlayUV - vec2(chromaOffset, 0.0));
    overlayColor = vec4(overlayR.r, overlayColor.g, overlayB.b, overlayColor.a);
    
    // Calculate reveal amount based on velocity magnitude
    float revealAmount = smoothstep(0.0, 0.05, velocityMagnitude * u_revealStrength);
    revealAmount = clamp(revealAmount, 0.0, 1.0);
    
    // Blend: overlay dissolves to reveal base where velocity is high
    vec4 finalColor = mix(overlayColor, baseColor, revealAmount);
    
    // Add subtle edge glow at medium velocity
    float edgeGlow = smoothstep(0.05, 0.2, velocityMagnitude) * (1.0 - smoothstep(0.2, 0.5, velocityMagnitude));
    finalColor.rgb += vec3(0.08, 0.12, 0.18) * edgeGlow * 0.4;
    
    gl_FragColor = finalColor;
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;
  
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function loadTexture(gl: WebGLRenderingContext, url: string): Promise<{ texture: WebGLTexture; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const texture = gl.createTexture();
    if (!texture) {
      reject(new Error("Failed to create texture"));
      return;
    }
    
    const image = new Image();
    image.crossOrigin = "anonymous";
    
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      
      resolve({ texture, width: image.width, height: image.height });
    };
    
    image.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    image.src = url;
  });
}

interface FBO {
  framebuffer: WebGLFramebuffer;
  texture: WebGLTexture;
}

function createFBO(gl: WebGLRenderingContext, width: number, height: number, useFloat: boolean): FBO | null {
  const texture = gl.createTexture();
  if (!texture) return null;
  
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  if (useFloat) {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, null);
  } else {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  }
  
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  
  const framebuffer = gl.createFramebuffer();
  if (!framebuffer) return null;
  
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    console.warn("Framebuffer not complete:", status);
    return null;
  }
  
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  
  return { framebuffer, texture };
}

export default function LiquidReveal({ imageA, imageB, className = "", children }: LiquidRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  
  // Programs
  const simProgramRef = useRef<WebGLProgram | null>(null);
  const renderProgramRef = useRef<WebGLProgram | null>(null);
  
  // Uniforms
  const simUniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
  const renderUniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
  
  // Ping-pong FBOs for velocity simulation
  const fboRef = useRef<{ read: FBO | null; write: FBO | null }>({ read: null, write: null });
  
  // Textures
  const texturesRef = useRef<{
    base: WebGLTexture | null;
    overlay: WebGLTexture | null;
    baseSize: [number, number];
    overlaySize: [number, number];
  }>({
    base: null,
    overlay: null,
    baseSize: [1, 1],
    overlaySize: [1, 1],
  });
  
  // Mouse state
  const mouseRef = useRef({
    current: { x: 0.5, y: 0.5 },
    previous: { x: 0.5, y: 0.5 },
    isActive: false,
  });
  
  // Phantom force state (random triggers)
  const phantomRef = useRef({
    active: false,
    position: { x: 0.5, y: 0.5 },
    direction: { x: 0, y: 0 },
    nextTrigger: 1500,
    duration: 0,
  });
  
  // Geometry buffers
  const buffersRef = useRef<{
    position: WebGLBuffer | null;
    texCoord: WebGLBuffer | null;
  }>({ position: null, texCoord: null });
  
  const simSizeRef = useRef({ width: 256, height: 256 });
  const hasFloatTexturesRef = useRef(false);
  
  const initWebGL = useCallback(async () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const gl = canvas.getContext("webgl", { 
      alpha: true, 
      premultipliedAlpha: false,
      antialias: true 
    });
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }
    
    // Check for float texture support
    const floatExt = gl.getExtension("OES_texture_float");
    const floatLinear = gl.getExtension("OES_texture_float_linear");
    hasFloatTexturesRef.current = !!(floatExt && floatLinear);
    
    if (!hasFloatTexturesRef.current) {
      console.warn("Float textures not fully supported, using fallback");
    }
    
    glRef.current = gl;
    
    // Create vertex shader (shared)
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    if (!vertexShader) return;
    
    // Create simulation program
    const simFragShader = createShader(gl, gl.FRAGMENT_SHADER, simulationShaderSource);
    if (!simFragShader) return;
    const simProgram = createProgram(gl, vertexShader, simFragShader);
    if (!simProgram) return;
    simProgramRef.current = simProgram;
    
    // Create render program
    const vertexShader2 = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    if (!vertexShader2) return;
    const renderFragShader = createShader(gl, gl.FRAGMENT_SHADER, renderShaderSource);
    if (!renderFragShader) return;
    const renderProgram = createProgram(gl, vertexShader2, renderFragShader);
    if (!renderProgram) return;
    renderProgramRef.current = renderProgram;
    
    // Set up geometry
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const texCoords = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
    
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    buffersRef.current.position = positionBuffer;
    
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
    buffersRef.current.texCoord = texCoordBuffer;
    
    // Get uniform locations for simulation program
    simUniformsRef.current = {
      u_velocityTexture: gl.getUniformLocation(simProgram, "u_velocityTexture"),
      u_mouse: gl.getUniformLocation(simProgram, "u_mouse"),
      u_mouseDelta: gl.getUniformLocation(simProgram, "u_mouseDelta"),
      u_mouseActive: gl.getUniformLocation(simProgram, "u_mouseActive"),
      u_time: gl.getUniformLocation(simProgram, "u_time"),
      u_aspectRatio: gl.getUniformLocation(simProgram, "u_aspectRatio"),
      u_phantomActive: gl.getUniformLocation(simProgram, "u_phantomActive"),
      u_phantomPos: gl.getUniformLocation(simProgram, "u_phantomPos"),
      u_phantomDir: gl.getUniformLocation(simProgram, "u_phantomDir"),
    };
    
    // Get uniform locations for render program
    renderUniformsRef.current = {
      u_baseTexture: gl.getUniformLocation(renderProgram, "u_baseTexture"),
      u_overlayTexture: gl.getUniformLocation(renderProgram, "u_overlayTexture"),
      u_velocityTexture: gl.getUniformLocation(renderProgram, "u_velocityTexture"),
      u_baseSize: gl.getUniformLocation(renderProgram, "u_baseSize"),
      u_overlaySize: gl.getUniformLocation(renderProgram, "u_overlaySize"),
      u_resolution: gl.getUniformLocation(renderProgram, "u_resolution"),
      u_distortionStrength: gl.getUniformLocation(renderProgram, "u_distortionStrength"),
      u_revealStrength: gl.getUniformLocation(renderProgram, "u_revealStrength"),
    };
    
    // Create ping-pong FBOs
    const simWidth = simSizeRef.current.width;
    const simHeight = simSizeRef.current.height;
    
    // Try float first, fall back to unsigned byte
    let fboRead = createFBO(gl, simWidth, simHeight, hasFloatTexturesRef.current);
    let fboWrite = createFBO(gl, simWidth, simHeight, hasFloatTexturesRef.current);
    
    if (!fboRead || !fboWrite) {
      console.warn("Float FBO failed, trying unsigned byte");
      fboRead = createFBO(gl, simWidth, simHeight, false);
      fboWrite = createFBO(gl, simWidth, simHeight, false);
    }
    
    fboRef.current.read = fboRead;
    fboRef.current.write = fboWrite;
    
    // Load textures
    try {
      const [baseData, overlayData] = await Promise.all([
        loadTexture(gl, imageA),
        loadTexture(gl, imageB),
      ]);
      
      texturesRef.current = {
        base: baseData.texture,
        overlay: overlayData.texture,
        baseSize: [baseData.width, baseData.height],
        overlaySize: [overlayData.width, overlayData.height],
      };
    } catch (error) {
      console.error("Failed to load textures:", error);
    }
  }, [imageA, imageB]);
  
  const setupAttributes = useCallback((program: WebGLProgram) => {
    const gl = glRef.current;
    if (!gl) return;
    
    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.bindBuffer(gl.ARRAY_BUFFER, buffersRef.current.position);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    
    const texLoc = gl.getAttribLocation(program, "a_texCoord");
    gl.bindBuffer(gl.ARRAY_BUFFER, buffersRef.current.texCoord);
    gl.enableVertexAttribArray(texLoc);
    gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0);
  }, []);
  
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const gl = glRef.current;
    if (!canvas || !container || !gl) return;
    
    const dpr = Math.min(window.devicePixelRatio, 2);
    const rect = container.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  }, []);
  
  const render = useCallback((time: number) => {
    const gl = glRef.current;
    const simProgram = simProgramRef.current;
    const renderProgram = renderProgramRef.current;
    const fbo = fboRef.current;
    const textures = texturesRef.current;
    
    if (!gl || !simProgram || !renderProgram || !fbo.read || !fbo.write || !textures.base || !textures.overlay) {
      animationRef.current = requestAnimationFrame(render);
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) {
      animationRef.current = requestAnimationFrame(render);
      return;
    }
    
    const mouse = mouseRef.current;
    const phantom = phantomRef.current;
    const simUniforms = simUniformsRef.current;
    const renderUniforms = renderUniformsRef.current;
    
    // Calculate mouse delta
    const mouseDelta = {
      x: (mouse.current.x - mouse.previous.x) * 0.5,
      y: (mouse.current.y - mouse.previous.y) * 0.5,
    };
    mouse.previous.x = mouse.current.x;
    mouse.previous.y = mouse.current.y;
    
    // Update phantom forces (random triggers)
    phantom.nextTrigger -= 16;
    phantom.duration -= 16;
    
    if (phantom.nextTrigger <= 0) {
      phantom.active = true;
      phantom.position.x = 0.15 + Math.random() * 0.7;
      phantom.position.y = 0.15 + Math.random() * 0.7;
      const angle = Math.random() * Math.PI * 2;
      phantom.direction.x = Math.cos(angle) * 0.6;
      phantom.direction.y = Math.sin(angle) * 0.6;
      phantom.duration = 400 + Math.random() * 600;
      phantom.nextTrigger = 2000 + Math.random() * 4000;
    }
    
    if (phantom.duration <= 0) {
      phantom.active = false;
    }
    
    const aspectRatio = canvas.width / canvas.height;
    const simWidth = simSizeRef.current.width;
    const simHeight = simSizeRef.current.height;
    
    // === SIMULATION PASS ===
    gl.useProgram(simProgram);
    setupAttributes(simProgram);
    
    // Bind read FBO texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fbo.read.texture);
    gl.uniform1i(simUniforms.u_velocityTexture, 0);
    
    // Set simulation uniforms
    gl.uniform2f(simUniforms.u_mouse, mouse.current.x, 1.0 - mouse.current.y);
    gl.uniform2f(simUniforms.u_mouseDelta, mouseDelta.x, -mouseDelta.y);
    gl.uniform1f(simUniforms.u_mouseActive, mouse.isActive ? 1.0 : 0.0);
    gl.uniform1f(simUniforms.u_time, time * 0.001);
    gl.uniform1f(simUniforms.u_aspectRatio, aspectRatio);
    gl.uniform1f(simUniforms.u_phantomActive, phantom.active ? 1.0 : 0.0);
    gl.uniform2f(simUniforms.u_phantomPos, phantom.position.x, 1.0 - phantom.position.y);
    gl.uniform2f(simUniforms.u_phantomDir, phantom.direction.x, phantom.direction.y);
    
    // Render to write FBO
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.write.framebuffer);
    gl.viewport(0, 0, simWidth, simHeight);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    // Swap FBOs
    const temp = fbo.read;
    fbo.read = fbo.write;
    fbo.write = temp;
    
    // === RENDER PASS ===
    gl.useProgram(renderProgram);
    setupAttributes(renderProgram);
    
    // Bind textures
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures.base);
    gl.uniform1i(renderUniforms.u_baseTexture, 0);
    
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures.overlay);
    gl.uniform1i(renderUniforms.u_overlayTexture, 1);
    
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, fbo.read.texture);
    gl.uniform1i(renderUniforms.u_velocityTexture, 2);
    
    // Set render uniforms
    gl.uniform2f(renderUniforms.u_baseSize, textures.baseSize[0], textures.baseSize[1]);
    gl.uniform2f(renderUniforms.u_overlaySize, textures.overlaySize[0], textures.overlaySize[1]);
    gl.uniform2f(renderUniforms.u_resolution, canvas.width, canvas.height);
    gl.uniform1f(renderUniforms.u_distortionStrength, 0.12);
    gl.uniform1f(renderUniforms.u_revealStrength, 2.5);
    
    // Render to screen
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    animationRef.current = requestAnimationFrame(render);
  }, [setupAttributes]);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    mouseRef.current.current.x = (e.clientX - rect.left) / rect.width;
    mouseRef.current.current.y = (e.clientY - rect.top) / rect.height;
  }, []);
  
  const handleMouseEnter = useCallback(() => {
    mouseRef.current.isActive = true;
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    mouseRef.current.isActive = false;
  }, []);
  
  useEffect(() => {
    initWebGL();
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
    }
    
    window.addEventListener("resize", resize);
    
    animationRef.current = requestAnimationFrame(render);
    
    const timeoutId = setTimeout(resize, 100);
    
    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
      clearTimeout(timeoutId);
    };
  }, [initWebGL, resize, render, handleMouseMove, handleMouseEnter, handleMouseLeave]);
  
  return (
    <div ref={containerRef} className={`relative w-full h-screen overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: "block" }}
      />
      <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
