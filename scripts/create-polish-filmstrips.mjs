import { spawnSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const root = 'docs/recordings/polish';
const cases = [
  ['desktop-complete','desktop-filmstrip',240], ['phone-complete','phone-filmstrip',156],
  ['desktop-scrubbing','scrubbing-filmstrip',240], ['phone-scrubbing','phone-scrubbing-filmstrip',156],
  ['guest-sponsors-preview','guest-desktop-filmstrip',240], ['guest-sponsors-phone-preview','guest-phone-filmstrip',156],
  ['desktop-reduced','desktop-reduced-filmstrip',240], ['phone-reduced','phone-reduced-filmstrip',156],
];
const run = (program,args) => {
  const result = spawnSync(program,args,{encoding:'utf8',windowsHide:true});
  if(result.status !== 0) throw new Error(result.stderr || `${program} failed`);
  return result.stdout;
};
const manifest = [];
for(const [clip,name,width] of cases) {
  const file = `${root}/${clip}.webm`;
  const metadata = JSON.parse(run('ffprobe',['-v','error','-show_entries','format=duration','-of','json',file]));
  const duration = Number(metadata.format.duration);
  // Sample the entire recording, even when development compilation or capture takes longer.
  run('ffmpeg',['-hide_banner','-loglevel','error','-threads','1','-filter_threads','1','-i',file,'-vf',`fps=${24/duration},scale=${width}:-1,tile=6x4`,'-frames:v','1','-threads','1','-y',`${root}/${name}.png`]);
  manifest.push({clip:file,duration,filmstrip:`${root}/${name}.png`,samples:24});
}
await writeFile(`${root}/filmstrips.json`,JSON.stringify(manifest,null,2));
console.log('Decoded 24 sequential frames from each of 8 complete recordings.');
