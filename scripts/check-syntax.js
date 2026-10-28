// Parses every tracked .js file under miniprogram/ and cloudfunctions/ with
// `node --check`. The mini program has no build step, so this is where a
// syntax error would otherwise first show up: on a customer's phone.
const { execFileSync } = require('child_process')

const files = execFileSync('git', ['ls-files', 'miniprogram/*.js', 'cloudfunctions/*.js'], { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean)

let failed = 0
for (const file of files) {
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' })
  } catch (e) {
    failed++
    process.stderr.write(`${file}\n${e.stderr}\n`)
  }
}
console.log(`checked ${files.length} files, ${failed} failed`)
process.exit(failed ? 1 : 0)
