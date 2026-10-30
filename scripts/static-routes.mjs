import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { build } from 'vite';
// Keep route exports aligned with the actual content manifest, not a second slug list.
const result = await build({ configFile: false, logLevel: 'silent', build: { write: false, lib: { entry: 'src/data/events.ts', formats: ['es'] }, minify: false } });
const bundle = Array.isArray(result) ? result[0] : result;
const chunk = bundle.output.find(file => file.type === 'chunk');
const { events } = await import(`data:text/javascript;base64,${Buffer.from(chunk.code).toString('base64')}`);
const slugs = events.filter(event => event.published).map(event => event.slug);
if (slugs.some(slug => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))) throw new Error('Event slugs must use lowercase letters, numbers, and single hyphens.');
const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
for (const route of ['events', 'schedule', ...slugs.map(slug => `events/${slug}`)]) {
  const directory = new URL(`../dist/${route}/`, import.meta.url);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL('index.html', directory), html);
}
await writeFile(new URL('../dist/404.html', import.meta.url), html);
console.log(`Static route entrypoints written for ${slugs.length} events, events, schedule, and 404.`);
