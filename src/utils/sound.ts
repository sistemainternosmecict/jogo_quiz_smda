interface WebkitWindow {
  webkitAudioContext?: typeof AudioContext;
}

/**
 * Sintetizador de áudio 100% offline via Web Audio API para o Quiz SaquaPet.
 * Todos os timbres são desenhados para serem agradáveis e acolhedores para crianças.
 */
export class SoundEffects {
  private ctx: AudioContext | null = null;
  private muted = false;

  private getAudioContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') {
      return null;
    }

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as WebkitWindow).webkitAudioContext;

      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  private playTone(
    ctx: AudioContext,
    frequency: number,
    startTime: number,
    duration: number,
    type: OscillatorType,
    volume: number,
    endFrequency?: number,
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, startTime);

    if (endFrequency !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(
        endFrequency,
        startTime + duration,
      );
    }

    // Envelope suave evita estalos nos alto-falantes da lousa digital
    const attackTime = Math.min(0.015, duration * 0.25);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + attackTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
  }

  getMuted(): boolean {
    return this.muted;
  }

  playClick(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      this.playTone(ctx, 520, now, 0.065, 'sine', 0.14, 720);
    } catch {
      // Ignora falhas de áudio em ambientes restritos
    }
  }

  playCorrect(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // Dó5, Mi5, Sol5, Dó6
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        this.playTone(ctx, freq, now + idx * 0.075, 0.28, 'triangle', 0.2);
      });
    } catch {
      // Ignora falhas de áudio em ambientes restritos
    }
  }

  playWrong(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      // Tom suave e gentil em onda senoidal, sem sonoridade áspera ou punitiva
      const notes = [329.63, 261.63]; // Mi4 -> Dó4
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        this.playTone(ctx, freq, now + idx * 0.13, 0.18, 'sine', 0.13);
      });
    } catch {
      // Ignora falhas de áudio em ambientes restritos
    }
  }

  playCategoryChange(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const notes = [587.33, 783.99, 987.77]; // Ré5, Sol5, Si5
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        this.playTone(ctx, freq, now + idx * 0.065, 0.2, 'sine', 0.15);
      });
    } catch {
      // Ignora falhas de áudio em ambientes restritos
    }
  }

  playVictory(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const melody = [
        { freq: 523.25, duration: 0.14 },
        { freq: 659.25, duration: 0.14 },
        { freq: 783.99, duration: 0.14 },
        { freq: 1046.5, duration: 0.34 },
        { freq: 880.0, duration: 0.18 },
        { freq: 1046.5, duration: 0.52 },
      ];

      let cursor = ctx.currentTime;

      melody.forEach((note) => {
        this.playTone(ctx, note.freq, cursor, note.duration, 'triangle', 0.22);
        cursor += note.duration * 0.85;
      });
    } catch {
      // Ignora falhas de áudio em ambientes restritos
    }
  }
}

export const sounds = new SoundEffects();
