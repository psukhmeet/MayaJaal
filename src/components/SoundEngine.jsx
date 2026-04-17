import { useEffect, useRef } from 'react';
import { useMind } from '../context/MindContext';

export default function SoundEngine() {
  const { muted, emotion } = useMind();
  const refs = useRef({});

  const PARAMS = {
    calm:  { freq: 55,  lfo: 0.3,  tick: 1800, gain: 0.035 },
    joy:   { freq: 110, lfo: 0.8,  tick: 900,  gain: 0.045 },
    fear:  { freq: 40,  lfo: 0.15, tick: 2500, gain: 0.028 },
    angry: { freq: 180, lfo: 2.5,  tick: 350,  gain: 0.06  },
  };

  function createTick(ctx, master) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (d.length * 0.08));
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filt = ctx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = 2200;
    const g = ctx.createGain();
    g.gain.value = 0.12;
    src.connect(filt); filt.connect(g); g.connect(master);
    src.start();
  }

  useEffect(() => {
    if (muted) {
      refs.current?.ctx?.suspend();
      clearInterval(refs.current?.tick);
      return;
    }

    if (!refs.current.ctx) {
      refs.current.ctx = new (window.AudioContext || window.webkitAudioContext)();
      refs.current.master = refs.current.ctx.createGain();
      refs.current.master.gain.value = 1;
      refs.current.master.connect(refs.current.ctx.destination);
    }

    const ctx = refs.current.ctx;
    if (ctx.state === 'suspended') ctx.resume();
    const master = refs.current.master;
    const p = PARAMS[emotion];

    // Clean up previous oscillators
    try { refs.current.hum?.stop(); } catch(e) {}
    try { refs.current.lfo?.stop(); } catch(e) {}

    const hum = ctx.createOscillator();
    hum.type = 'sawtooth';
    hum.frequency.value = p.freq;
    const humG = ctx.createGain();
    humG.gain.value = p.gain;
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = p.lfo;
    const lfoG = ctx.createGain();
    lfoG.gain.value = p.freq * 0.08;
    lfo.connect(lfoG); lfoG.connect(hum.frequency);
    hum.connect(humG); humG.connect(master);
    hum.start(); lfo.start();
    refs.current.hum = hum;
    refs.current.lfo = lfo;

    clearInterval(refs.current.tick);
    refs.current.tick = setInterval(() => createTick(ctx, master), p.tick);

    return () => {
      try { hum.stop(); } catch(e) {}
      try { lfo.stop(); } catch(e) {}
      clearInterval(refs.current.tick);
    };
  }, [muted, emotion]);

  return null;
}
