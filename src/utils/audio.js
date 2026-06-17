let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSuccess() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      
      gain.gain.setValueAtTime(0.15, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.35);
    });
  } catch (e) {
    console.warn("Audio play failed:", e);
  }
}

export function playLevelUp() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Sweeping oscillator
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.5);
    
    // Filter to make it sound retro and smooth
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.Q.setValueAtTime(5, now);
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.6);
    
    // High-pitched bells at the end
    const notes = [659.25, 783.99, 1046.50]; // E5, G5, C6
    notes.forEach((freq, i) => {
      const bOsc = ctx.createOscillator();
      const bGain = ctx.createGain();
      bOsc.type = 'sine';
      bOsc.frequency.setValueAtTime(freq, now + 0.4 + i * 0.08);
      
      bGain.gain.setValueAtTime(0.1, now + 0.4 + i * 0.08);
      bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4 + i * 0.08 + 0.25);
      
      bOsc.connect(bGain);
      bGain.connect(ctx.destination);
      
      bOsc.start(now + 0.4 + i * 0.08);
      bOsc.stop(now + 0.4 + i * 0.08 + 0.3);
    });
  } catch (e) {
    console.warn("Audio play failed:", e);
  }
}

export function playEat() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // We synthesize two rapid crunching sound bursts
    for (let crunch = 0; crunch < 2; crunch++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      osc.type = 'triangle';
      // Fast pitch drop & modulation for crunchiness
      osc.frequency.setValueAtTime(300 - crunch * 50, now + crunch * 0.12);
      osc.frequency.exponentialRampToValueAtTime(50, now + crunch * 0.12 + 0.08);
      
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(200, now + crunch * 0.12);
      filter.Q.setValueAtTime(10, now + crunch * 0.12);
      
      gain.gain.setValueAtTime(0.2, now + crunch * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, now + crunch * 0.12 + 0.08);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + crunch * 0.12);
      osc.stop(now + crunch * 0.12 + 0.1);
    }
  } catch (e) {
    console.warn("Audio play failed:", e);
  }
}

export function playFail() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now); // A3
    osc.frequency.linearRampToValueAtTime(110, now + 0.5); // A2 (sliding down)
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.6);
  } catch (e) {
    console.warn("Audio play failed:", e);
  }
}

export function playPetChirp() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // Two quick high-pitched sweeps
    [523.25, 659.25].forEach((freq, i) => { // C5, E5
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + i * 0.08 + 0.06);
      
      gain.gain.setValueAtTime(0.1, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.07);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.08);
    });
  } catch (e) {
    console.warn("Audio play failed:", e);
  }
}
