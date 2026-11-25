// Estimate tempo + beat phase of a music file (reads raw f32le mono 11025Hz from stdin).
const chunks = [];
process.stdin.on('data', d => chunks.push(d));
process.stdin.on('end', () => {
  const buf = Buffer.concat(chunks);
  const s = new Float32Array(buf.buffer, buf.byteOffset, Math.floor(buf.length / 4));
  const sr = 11025, hop = 64, fr = sr / hop;
  const env = []; let prev = 0;
  for (let i = 0; i + hop < s.length; i += hop) {
    let e = 0; for (let j = 0; j < hop; j++) e += s[i + j] * s[i + j];
    e = Math.sqrt(e / hop); env.push(Math.max(0, e - prev)); prev = e;
  }
  const at = k => { const k0 = Math.floor(k), f = k - k0; return (env[k0] ?? 0) * (1 - f) + (env[k0 + 1] ?? 0) * f; };
  const res = [];
  for (let bpm = 60; bpm <= 200; bpm += 0.25) {
    const lag = fr * 60 / bpm; let c = 0, n = 0;
    for (let i = 0; i + lag + 1 < env.length; i++) { c += env[i] * at(i + lag); n++; }
    res.push([c / n, bpm]);
  }
  const top = [...res].sort((a, b) => b[0] - a[0]).slice(0, 8);
  console.log('top', top.map(x => `${x[1]}`).join(' '));
  for (const [, bpm] of top.slice(0, 3)) {
    const per = fr * 60 / bpm; let bp = 0, bv = -1;
    for (let ph = 0; ph < per; ph += 0.25) { let v = 0; for (let t = ph; t < env.length; t += per) v += at(t); if (v > bv) { bv = v; bp = ph; } }
    console.log('bpm', bpm, 'first beat s', (bp / fr).toFixed(3), 'period', (60 / bpm).toFixed(4));
  }
});
