import { spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Native decoding avoids Chromium 140 returning blank VP9 video/canvas captures.
const clip = resolve(process.argv[2] ?? 'docs/recordings/refinement/desktop.webm');
const output = resolve(process.argv[3] ?? 'docs/recordings/polish-before-inspection');
const result = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_name,width,height', '-of', 'json', clip], { encoding: 'utf8', windowsHide: true });
if (result.status !== 0) throw new Error(result.stderr || 'ffprobe is required on PATH.');
const metadata = JSON.parse(result.stdout);
const duration = Number(metadata.format.duration);
const requested = process.argv.slice(4).map(Number);
const times = (requested.length ? requested : [6,7.5,9,16.8,17.1,17.7,18]).filter(time => Number.isFinite(time) && time >= 0 && time < duration);
await mkdir(output, { recursive: true });
for (const time of times) {
  const frame = `${output}/${String(time).replace('.', '-')}.png`;
  const decoded = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-threads', '1', '-ss', String(time), '-i', clip, '-frames:v', '1', '-threads', '1', '-y', frame], { encoding: 'utf8', windowsHide: true });
  if (decoded.status !== 0) throw new Error(decoded.stderr || 'ffmpeg frame extraction failed.');
}
const inspection = { clip, duration, streams: metadata.streams, inspectedSeconds: times };
await writeFile(`${output}/inspection.json`, JSON.stringify(inspection, null, 2));
console.log(JSON.stringify(inspection));
