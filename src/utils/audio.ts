let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTickSound(ctx: AudioContext, time: number, volume = 0.15) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(650, time);
  osc.frequency.exponentialRampToValueAtTime(120, time + 0.035);

  gain.gain.setValueAtTime(volume, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.035);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(time);
  osc.stop(time + 0.035);
}

export function playSpinStart() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Rising energetic synth tone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(261.63, now); // C4
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.35); // A5

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);

    // Initial tick
    playTickSound(ctx, now, 0.25);
  } catch (e) {
    console.warn('Audio play failed:', e);
  }
}

export function startSpinningTicks(durationMs = 7000): () => void {
  try {
    const ctx = getAudioContext();
    const startTime = ctx.currentTime;

    const totalTicks = 36;
    const timeouts: number[] = [];

    for (let i = 0; i < totalTicks; i++) {
      const normalizedIndex = i / (totalTicks - 1);
      // Smooth deceleration curve
      const progress = 1 - Math.pow(1 - normalizedIndex, 0.45);
      const delayMs = progress * durationMs;

      const tid = window.setTimeout(() => {
        const remainingVol = Math.max(0.06, 0.2 * (1 - normalizedIndex * 0.7));
        playTickSound(ctx, ctx.currentTime, remainingVol);
      }, delayMs);

      timeouts.push(tid);
    }

    return () => {
      timeouts.forEach(clearTimeout);
    };
  } catch (e) {
    return () => {};
  }
}

export function playWinSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Victory fanfare notes: C5, E5, G5, C6 chime
    const notes = [
      { freq: 523.25, time: 0 },    // C5
      { freq: 659.25, time: 0.12 }, // E5
      { freq: 783.99, time: 0.24 }, // G5
      { freq: 1046.50, time: 0.38 } // C6
    ];

    notes.forEach((note, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const start = now + note.time;
      const duration = idx === notes.length - 1 ? 0.9 : 0.3;

      osc.type = idx === notes.length - 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(note.freq, start);

      gain.gain.setValueAtTime(0.01, start);
      gain.gain.linearRampToValueAtTime(0.25, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + duration);
    });
  } catch (e) {
    console.warn('Win sound failed:', e);
  }
}
