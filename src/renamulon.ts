#!/usr/bin/env node

import { execSync } from 'child_process'
import * as fs from 'fs'
import {
  endsWith,
  forEach,
  forEachRight,
  includes,
  last,
  map,
  replace,
  some,
  startsWith,
} from 'lodash'
import * as path from 'path'
import * as yargs from 'yargs'
import { DEFAULT_EXTENSIONS, EXCLUDED_FOLDERS, FORMAT_CHOICES } from './constants'
import { Formatter } from './formatter'
import { Format } from './types'

const { argv } = yargs
  .usage(`Usage: $0 <directory> [-f format] [-x extensions] [-r] [-d] [-g]`)
  .demandCommand(1, 'Enter a root directory')
  .option('format', {
    alias: 'f',
    choices: FORMAT_CHOICES,
    demandOption: true,
    desc: 'Format type',
  })
  .option('ext', {
    alias: 'x',
    default: DEFAULT_EXTENSIONS,
    array: true,
    desc: 'File extensions to include in renaming',
  })
  .option('remove-dots', {
    alias: 'r',
    type: 'boolean',
    default: false,
    desc: 'Modify dot structure',
  })
  .option('use-git', {
    alias: '-g',
    type: 'boolean',
    default: false,
    desc: 'Use git mv instead of mv',
  })
  .option('dry', {
    alias: 'd',
    type: 'boolean',
    default: false,
    desc: 'Execute without making changes',
  })

export class Renamulon {
  private static extensions: string[] = []
  private static format: Format = 'kebab'
  private static removeDots: boolean = true
  private static dry: boolean = false
  private static useGit: boolean = false
  private static root: string = '.'

  private static dirs: string[] = []
  private static files: string[] = []
  private static updatedFiles: Record<string, boolean> = {}

  public static main(): void {
    this.extensions = argv.ext
    this.format = argv.format
    this.removeDots = argv['remove-dots']
    this.useGit = argv['use-git']
    this.dry = argv.dry
    this.root = path.resolve(process.cwd(), argv._[0])

    try {
      if (!fs.existsSync(this.root)) throw new Error('Directory does not exist')
      if (!fs.lstatSync(this.root).isDirectory())
        throw new Error(`"${this.root}" is not a directory`)
      this.readFoldersRecur(this.root)
      this.renameFiles()
      this.checkImports()
      this.renameDirs()
    } catch (e) {
      this.handleError(e)
    }
  }

  public static readFoldersRecur(start: string): void {
    const dirents = fs.readdirSync(start, { withFileTypes: true })

    if (dirents.length === 0) {
      return
    }

    forEach(dirents, (dirent) => {
      if (startsWith(dirent.name, '.') || includes(EXCLUDED_FOLDERS, dirent.name)) return
      const absolute = path.resolve(start, dirent.name)

      if (dirent.isDirectory()) {
        this.dirs.push(absolute)
        return this.readFoldersRecur(absolute)
      }

      if (some(this.extensions, (ext) => endsWith(dirent.name, ext))) {
        this.files.push(absolute)
        this.updatedFiles[absolute] = false
      }
    })
  }

  public static buildFileName(dir: string, name: string, ext: string): string {
    return path.resolve(dir, [name, ext].join(''))
  }

  public static rename(from: string, to: string): void {
    if (this.useGit) {
      execSync(`git add ${from}`, { cwd: this.root })
      execSync(`git mv ${from} ${from}-temp`, { cwd: this.root })
      execSync(`git mv ${from}-temp ${to}`, { cwd: this.root })
      return
    }

    fs.renameSync(from, to)
  }

  public static update(from: string, to: string, notPaths?: boolean): void {
    if (from === to) {
      return
    }

    console.log(from + ' --> ' + to)

    if (notPaths) {
      return
    }

    if (this.dry) {
      return
    }

    this.rename(from, to)
  }

  public static renameDirs(): void {
    forEachRight(this.dirs, (_dir) => {
      const { dir, name: original } = path.parse(_dir)
      const formatted = Formatter.format(original, this.format, this.removeDots)
      this.update(_dir, path.resolve(dir, formatted))
    })
  }

  public static renameFiles(): void {
    forEach(this.files, (file, i) => {
      const { dir, name: original, ext } = path.parse(file)

      if (original === 'index' || original === '_index') {
        return
      }

      const formatted = this.buildFileName(
        dir,
        Formatter.format(original, this.format, this.removeDots),
        ext,
      )

      this.updatedFiles[file] = true
      this.files[i] = this.dry ? file : formatted
      this.update(file, path.resolve(dir, formatted))
    })
  }

  public static checkImports(): void {
    forEach(this.files, (file) => {
      const { dir, name, ext } = path.parse(file)
      const filePath = this.buildFileName(dir, name, ext)
      this.updateFileImports(filePath)
    })
  }

  public static updateFileImports(filePath: string): void {
    const { dir } = path.parse(filePath)
    const contents = fs.readFileSync(filePath, 'utf8')
    let updates: number = 0

    const updated = replace(
      contents,
      /(((?:import)|(?:export)) (?:.+) from (\'|\")\.(.+)(\'|\"))/g,
      (original) => {
        const imports = original.split(/\s+/)
        let name = last(imports) as string
        const quoteMark = last(name) as string
        name = name.slice(1, name.length - 1)
        const absolute = path.resolve(dir, name)

        if (fs.existsSync(absolute)) {
          return original
        }

        const combos = this.extensions.map((extension) => `${absolute}.${extension}`)

        if (!some(combos, (combo) => this.updatedFiles[combo])) {
          return original
        }

        const formatted = map(name.split('/'), (part) =>
          Formatter.format(part, this.format, this.removeDots),
        ).join('/')

        if (formatted === name) {
          return original
        }

        const update = [
          ...imports.slice(0, imports.length - 1),
          quoteMark + formatted + quoteMark,
        ].join(' ')

        this.update(original, update, true)

        updates++
        return update
      },
    )

    if (updates === 0 || this.dry) {
      return
    }

    fs.writeFileSync(filePath, updated)
  }

  public static handleError<E extends Error>(error: E): void {
    if (error instanceof Error) {
      console.error(error.message)
    }

    process.exit(1)
  }
}

Renamulon.main()
