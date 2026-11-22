// Mission Control Web Audio Synthesizer (No external assets required)
let audioCtx = null;
let humOsc = null;
let humGain = null;
let isAudioActive = false;

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function toggleMissionAudio(enable) {
  const ctx = getAudioContext();
  if (!ctx) return false;

  if (enable) {
    isAudioActive = true;
    if (!humOsc) {
      humOsc = ctx.createOscillator();
      const subOsc = ctx.createOscillator();
      humGain = ctx.createGain();

      humOsc.type = 'sine';
      humOsc.frequency.setValueAtTime(55, ctx.currentTime);

      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(110, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, ctx.currentTime);

      humGain.gain.setValueAtTime(0.03, ctx.currentTime);

      humOsc.connect(filter);
      subOsc.connect(filter);
      filter.connect(humGain);
      humGain.connect(ctx.destination);

      humOsc.start();
      subOsc.start();
    } else if (humGain) {
      humGain.gain.setTargetAtTime(0.03, ctx.currentTime, 0.1);
    }
    playTelemetryChirp();
    return true;
  } else {
    isAudioActive = false;
    if (humGain && ctx) {
      humGain.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
    }
    return false;
  }
}

export function playTelemetryChirp() {
  if (!isAudioActive) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(2200, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.06);

    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch (e) {}
}

export function playAlarmChirp() {
  if (!isAudioActive) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(660, now + 0.08);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  } catch (e) {}
}
