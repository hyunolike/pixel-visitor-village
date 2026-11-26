// Export the existing original sprite as a service guide portrait, no generated character.
import { visitorPixels } from '../../src/characters.ts';
import { spawnSync } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
await mkdir('src/assets/map', { recursive: true });
const result = spawnSync('ffmpeg', ['-y', '-v', 'error', '-f', 'rawvideo', '-pixel_format', 'rgba', '-video_size', '20x28', '-i', 'pipe:0', '-frames:v', '1', '-vf', 'scale=80:112:flags=neighbor', 'src/assets/map/guide.png'], { input: Buffer.from(visitorPixels(2, 'front', 6)) });
if (result.status !== 0) throw new Error(result.stderr?.toString() || 'Portrait export failed');
console.log('Exported existing style2 greeting sprite at 4x nearest-neighbor.');
