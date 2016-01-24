#!/usr/bin/env node
const fromString = require('from2-string')
const concat = require('concat-stream')
const stdout = require('stdout-stream')
const cliclopts = require('cliclopts')
const minimist = require('minimist')
const assert = require('assert')
const remark = require('remark')
const pump = require('pump')
const util = require('util')
const fs = require('fs')

const pkg = require('../package.json')
const main = require('../')

const opts = cliclopts([
  { name: 'help', abbr: 'h', boolean: true },
  { name: 'version', abbr: 'v', boolean: true },
  { name: 'yaml', abbr: 'y', boolean: true },
  { name: 'position', abbr: 'p', default: 4 },
  { name: 'title', abbr: 't', default: 'API' },
  { name: 'write', abbr: 'w', boolean: true }
])

const argv = minimist(process.argv.slice(2), opts.options())

// parse options
if (argv.version) {
  const version = require('../package.json').version
  process.stdout.write('v' + version + '\n')
  process.exit(0)
} else if (argv.help) {
  process.stdout.write(pkg.name + ' - ' + pkg.description + '\n')
  usage(0)
} else if (!argv._.length) {
  process.stderr.write('Error: no files specified\n')
  usage(1)
} else if (argv._.length === 1) {
  process.stdin.pipe(concat(function (buf) {
    useMain(argv._[0], String(buf))
  }))
} else {
  fs.readFile(argv._[1], { encoding: 'utf8' }, function (err, swagger) {
    if (err) return handleErr(err)
    useMain(argv._[0], swagger)
  })
}

// read a file and inject a string of swagger
// (str, str) -> null
function useMain (mdFile, swagger) {
  const mainOpts = {
    position: argv.position,
    title: argv.title
  }
  opts.yaml ? mainOpts.yaml = true : mainOpts.json = true

  fs.readFile(mdFile, { encoding: 'utf8' }, function (err, md) {
    assert.ifError(err)
    const compiled = remark()
      .use(main(swagger, mainOpts))
      .process(md)

    const rs = fromString(compiled)
    const ws = argv.w ? fs.createWriteStream(mdFile) : stdout
    pump(rs, ws, handleErr)
  })
}

// handle an error
// str -> null
function handleErr (err) {
  if (err) {
    process.stderr.write(util.format(err) + '\n')
    process.exit(1)
  }
}

// print usage & exit
// num? -> null
function usage (exitCode) {
  const rs = fs.createReadStream(__dirname + '/usage.txt')
  const ws = process.stdout
  rs.pipe(ws)
  ws.on('finish', process.exit.bind(null, exitCode))
}
