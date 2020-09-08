import { execSync } from 'child_process'
import * as fs from 'fs'
import {
  APP_CAMEL,
  APP_KEBAB,
  APP_ORIGINAL,
  APP_PASCAL,
  APP_SNAKE,
  HISTORY_CAMEL,
  HISTORY_KEBAB,
  HISTORY_ORIGINAL,
  HISTORY_PASCAL,
  HISTORY_SNAKE,
  INDEX_CAMEL,
  INDEX_KEBAB,
  INDEX_ORIGINAL,
  INDEX_PASCAL,
  INDEX_SNAKE,
  UTIL_INDEX_CAMEL,
  UTIL_INDEX_KEBAB,
  UTIL_INDEX_ORIGINAL,
  UTIL_INDEX_PASCAL,
  UTIL_INDEX_SNAKE,
} from './files'

const BASE = 'EXAMPLE_FOLDER'
const APP_FILE_SRC = `${BASE}/fIle-S/App.tsx`
const HISTORY_FILE_SRC = `${BASE}/fIle-S/util/history.ts`
const INDEX_FILE_SRC = `${BASE}/fIle-S/index.tsx`
const UTIL_INDEX_FILE_SRC = `${BASE}/fIle-S/util/index.ts`

beforeAll(() => {
  if (fs.existsSync(BASE)) {
    execSync(`rm -rf ${BASE}`)
  }

  fs.mkdirSync(`${BASE}/fIle-S/util`, { recursive: true })
  fs.writeFileSync(APP_FILE_SRC, APP_ORIGINAL, { encoding: 'utf8' })
  fs.writeFileSync(HISTORY_FILE_SRC, HISTORY_ORIGINAL, { encoding: 'utf8' })
  fs.writeFileSync(INDEX_FILE_SRC, INDEX_ORIGINAL, { encoding: 'utf8' })
  fs.writeFileSync(UTIL_INDEX_FILE_SRC, UTIL_INDEX_ORIGINAL, { encoding: 'utf8' })
})

afterAll(() => {
  execSync(`rm -rf ${BASE}`)
})

test('Files are set', () => {
  expect(fs.existsSync(BASE)).toBeTruthy()
  expect(fs.existsSync(APP_FILE_SRC)).toBeTruthy()
  expect(fs.existsSync(HISTORY_FILE_SRC)).toBeTruthy()
  expect(fs.existsSync(INDEX_FILE_SRC)).toBeTruthy()
  expect(fs.existsSync(UTIL_INDEX_FILE_SRC)).toBeTruthy()
})

describe('Renamulon', () => {
  it('should rename files to camel case with git', () => {
    expect(execSync(`ts-node src/renamulon ${BASE} -g -f camel`)).toBeTruthy()

    expect(fs.existsSync(`${BASE}/fIleS/app.tsx`)).toBeTruthy()
    expect(fs.existsSync(`${BASE}/fIleS/util/history.ts`)).toBeTruthy()
    expect(fs.existsSync(`${BASE}/fIleS/index.tsx`)).toBeTruthy()
    expect(fs.existsSync(`${BASE}/fIleS/util/index.ts`)).toBeTruthy()

    expect(fs.readFileSync(`${BASE}/fIleS/app.tsx`, 'utf8')).toBe(APP_CAMEL)
    expect(fs.readFileSync(`${BASE}/fIleS/util/history.ts`, 'utf8')).toBe(HISTORY_CAMEL)
    expect(fs.readFileSync(`${BASE}/fIleS/index.tsx`, 'utf8')).toBe(INDEX_CAMEL)
    expect(fs.readFileSync(`${BASE}/fIleS/util/index.ts`, 'utf8')).toBe(UTIL_INDEX_CAMEL)
  })

  it('should rename files to kebab case', () => {
    expect(execSync(`ts-node src/renamulon ${BASE} -g -f kebab`)).toBeTruthy()

    expect(fs.existsSync(`${BASE}/f-ile-s/app.tsx`)).toBeTruthy()
    expect(fs.existsSync(`${BASE}/f-ile-s/util/history.ts`)).toBeTruthy()
    expect(fs.existsSync(`${BASE}/f-ile-s/index.tsx`)).toBeTruthy()
    expect(fs.existsSync(`${BASE}/f-ile-s/util/index.ts`)).toBeTruthy()

    expect(fs.readFileSync(`${BASE}/f-ile-s/app.tsx`, 'utf8')).toBe(APP_KEBAB)
    expect(fs.readFileSync(`${BASE}/f-ile-s/util/history.ts`, 'utf8')).toBe(HISTORY_KEBAB)
    expect(fs.readFileSync(`${BASE}/f-ile-s/index.tsx`, 'utf8')).toBe(INDEX_KEBAB)
    expect(fs.readFileSync(`${BASE}/f-ile-s/util/index.ts`, 'utf8')).toBe(UTIL_INDEX_KEBAB)
  })

  it('should rename files to snake case', () => {
    expect(execSync(`ts-node src/renamulon ${BASE} -g -f snake`)).toBeTruthy()

    expect(fs.existsSync(`${BASE}/f_ile_s/app.tsx`)).toBeTruthy()
    expect(fs.existsSync(`${BASE}/f_ile_s/util/history.ts`)).toBeTruthy()
    expect(fs.existsSync(`${BASE}/f_ile_s/index.tsx`)).toBeTruthy()
    expect(fs.existsSync(`${BASE}/f_ile_s/util/index.ts`)).toBeTruthy()

    expect(fs.readFileSync(`${BASE}/f_ile_s/app.tsx`, 'utf8')).toBe(APP_SNAKE)
    expect(fs.readFileSync(`${BASE}/f_ile_s/util/history.ts`, 'utf8')).toBe(HISTORY_SNAKE)
    expect(fs.readFileSync(`${BASE}/f_ile_s/index.tsx`, 'utf8')).toBe(INDEX_SNAKE)
    expect(fs.readFileSync(`${BASE}/f_ile_s/util/index.ts`, 'utf8')).toBe(UTIL_INDEX_SNAKE)
  })

  it('should rename files to pascal case', () => {
    expect(execSync(`ts-node src/renamulon ${BASE} -g -f pascal`)).toBeTruthy()

    expect(fs.existsSync(`${BASE}/FIleS/App.tsx`)).toBeTruthy()
    expect(fs.existsSync(`${BASE}/FIleS/Util/History.ts`)).toBeTruthy()
    expect(fs.existsSync(`${BASE}/FIleS/index.tsx`)).toBeTruthy()
    expect(fs.existsSync(`${BASE}/FIleS/Util/index.ts`)).toBeTruthy()

    expect(fs.readFileSync(`${BASE}/FIleS/App.tsx`, 'utf8')).toBe(APP_PASCAL)
    expect(fs.readFileSync(`${BASE}/FIleS/Util/History.ts`, 'utf8')).toBe(HISTORY_PASCAL)
    expect(fs.readFileSync(`${BASE}/FIleS/index.tsx`, 'utf8')).toBe(INDEX_PASCAL)
    expect(fs.readFileSync(`${BASE}/FIleS/Util/index.ts`, 'utf8')).toBe(UTIL_INDEX_PASCAL)
  })
})
