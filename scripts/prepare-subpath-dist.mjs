import { readFile, readdir, mkdir, rename } from 'node:fs/promises'
import { join } from 'node:path'

const distDir = 'dist'

async function readViteBase() {
  const config = await readFile('vite.config.js', 'utf8')
  const match = config.match(/\bbase\s*:\s*(['"`])([^'"`]+)\1/)

  return match ? match[2] : '/'
}

function getBaseSegments(value) {
  if (!value || value === '/') {
    return []
  }

  try {
    const parsed = new URL(value)
    return parsed.pathname.split('/').filter(Boolean)
  } catch {
    return value.split('/').filter(Boolean)
  }
}

const base = await readViteBase()
const segments = getBaseSegments(base)

if (segments.length === 0) {
  console.log('No subpath base configured; dist layout unchanged.')
  process.exit(0)
}

const targetDir = join(distDir, ...segments)
const topLevelDir = segments[0]

await mkdir(targetDir, { recursive: true })

const entries = await readdir(distDir, { withFileTypes: true })

for (const entry of entries) {
  if (entry.name === topLevelDir) {
    continue
  }

  await rename(join(distDir, entry.name), join(targetDir, entry.name))
}

console.log(`Moved dist output into ${targetDir} for base ${base}.`)
