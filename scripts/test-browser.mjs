import { spawnSync } from 'node:child_process';
const args = process.argv.slice(2);
const custom = args.indexOf('--chromium');
if (custom >= 0) {
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE = args[custom + 1];
  args.splice(custom, 2);
}
const result = spawnSync(process.execPath, ['node_modules/@playwright/test/cli.js', 'test', ...args], { stdio: 'inherit', env: process.env });
process.exit(result.status ?? 1);
