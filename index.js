const u = require('unist-builder')
const assert = require('assert')
const yaml = require('yamljs')

module.exports = remarkSwagger

// Insert a swagger specification into a markdown file
// (str, obj) -> (fn, obj) -> null
function remarkSwagger (spec, opts) {
  opts = opts || {}

  assert.equal(typeof opts, 'object', 'opts is an object')

  const title = opts.title || 'API'
  const position = opts.position || 4

  if (opts.yaml) spec = yaml.parse(spec)
  if (opts.json) spec = JSON.parse(spec)

  assert.equal(typeof spec, 'object', 'spec is object')

  return function attacher () {
    return function transformer (ast, file) {
      const table = createTable(spec)
      const heading = u('heading', { depth: 2 }, [
        u('text', { value: title })
      ])

      const head = ast.children[position]
      if (head.type === 'header' && head.children[0].value === title) {
        // inject code into existing node
        ast.children[position + 1] = table
      } else {
        // inject code into new node
        ast.children.splice(position, 0, table)
        ast.children.splice(position, 0, heading)
      }
    }
  }
}

// create a table
// obj -> [obj]
function createTable (spec) {
  assert.equal(typeof spec.paths, 'object', 'paths should be object')

  const tableHead = u('tableHeader', [
    u('tableCell', [ u('text', 'Path') ]),
    u('tableCell', [ u('text', 'Method') ]),
    u('tableCell', [ u('text', 'Summary') ])
  ])

  // convert swagger to table rows
  const tableRows = Object.keys(spec.paths).reduce(function (arr, route) {
    Object.keys(spec.paths[route]).forEach(function (method) {
      const summary = spec.paths[route][method].summary || '[ not available ]'
      arr.push(u('tableRow', [
        u('tableCell', [ u('text', route) ]),
        u('tableCell', [ u('text', method.toUpperCase()) ]),
        u('tableCell', [ u('text', summary) ])
      ]))
    })
    return arr
  }, [])

  return u('table', [tableHead].concat(tableRows))
}
