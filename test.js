const remark = require('remark')
const test = require('tape')
const path = require('path')
const fs = require('fs')

const swagger = require('./')

test('should assert input types', function (t) {
  t.plan(1)
  t.throws(swagger)
})

test('should input a bunch of swagger', function (t) {
  t.plan(1)

  const inf = fs.readFileSync(path.join(__dirname, 'test/input.md'), 'utf8')
  const outf = fs.readFileSync(path.join(__dirname, 'test/output.md'), 'utf8')
  const spec = fs.readFileSync(path.join(__dirname, 'test/api.yaml'), 'utf8')

  const rendered = remark()
    .use(swagger(spec, { yaml: true, position: 4, title: 'API' }))
    .process(inf)

  t.equal(rendered, outf, 'is rendered')
})
