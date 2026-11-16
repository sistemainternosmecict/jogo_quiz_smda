import { onCleanup, onMount, type Component } from 'solid-js';

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  tilt: number;
  tiltSpeed: number;
  color: string;
  shape: 'ribbon' | 'circle' | 'diamond';
}

const CONFETTI_COLORS = [
  '#FFB703', // Amarelo Sol
  '#0284C7', // Azul SaquaPet
  '#06D6A0', // Turquesa Pet
  '#10B981', // Verde Verdadeiro
  '#EF4444', // Coral Alegre
  '#DB2777', // Rosa Carinho
  '#6366F1', // Índigo Amigável
] as const;

const PARTICLE_COUNT = 120;

const createParticle = (
  width: number,
  height: number,
  spawnFromTop: boolean,
): ConfettiParticle => {
  const shapes: ConfettiParticle['shape'][] = ['ribbon', 'circle', 'diamond'];
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  const color =
    CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];

  return {
    x: Math.random() * width,
    y: spawnFromTop ? -20 - Math.random() * height * 0.35 : Math.random() * height,
    vx: (Math.random() - 0.5) * 2.4,
    vy: 2.2 + Math.random() * 3.8,
    size: 8 + Math.random() * 11,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.14,
    tilt: Math.random() * Math.PI * 2,
    tiltSpeed: 0.05 + Math.random() * 0.08,
    color,
    shape,
  };
};

/**
 * Efeito festivo de confetes em Canvas 60 FPS para a tela de vitória do Quiz SaquaPet.
 */
export const Confetti: Component = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    const canvas = canvasRef;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    let disposed = false;
    let animationFrameId = 0;
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let lastTime = performance.now();

    const syncCanvasSize = (): void => {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.max(1, Math.floor(viewportWidth * dpr));
      canvas.height = Math.max(1, Math.floor(viewportHeight * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    syncCanvasSize();

    const particles: ConfettiParticle[] = Array.from(
      { length: PARTICLE_COUNT },
      () => createParticle(viewportWidth, viewportHeight, false),
    );

    const handleResize = (): void => {
      syncCanvasSize();
    };

    window.addEventListener('resize', handleResize);

    const drawFrame = (now: number): void => {
      if (disposed) {
        return;
      }

      const elapsedMs = Math.min(48, Math.max(4, now - lastTime));
      const frameScale = elapsedMs / 16.6667;
      lastTime = now;

      ctx.clearRect(0, 0, viewportWidth, viewportHeight);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];

        p.x += (p.vx + Math.sin(p.tilt) * 0.9) * frameScale;
        p.y += p.vy * frameScale;
        p.rotation += p.rotationSpeed * frameScale;
        p.tilt += p.tiltSpeed * frameScale;

        if (p.y > viewportHeight + 32) {
          particles[i] = createParticle(viewportWidth, viewportHeight, true);
          continue;
        }

        if (p.x < -30) {
          p.x = viewportWidth + 24;
        } else if (p.x > viewportWidth + 30) {
          p.x = -24;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(1, Math.max(0.25, Math.abs(Math.cos(p.tilt))));
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'diamond') {
          const half = p.size * 0.55;
          ctx.beginPath();
          ctx.moveTo(0, -half);
          ctx.lineTo(half, 0);
          ctx.lineTo(0, half);
          ctx.lineTo(-half, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(-p.size * 0.6, -p.size * 0.3, p.size * 1.2, p.size * 0.6);
        }

        ctx.restore();
      }

      animationFrameId = window.requestAnimationFrame(drawFrame);
    };

    animationFrameId = window.requestAnimationFrame(drawFrame);

    onCleanup(() => {
      disposed = true;
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    });
  });

  return <canvas ref={(el) => { canvasRef = el; }} class="confetti-canvas" aria-hidden="true" />;
};
