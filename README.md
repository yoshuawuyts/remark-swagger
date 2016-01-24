# remark-swagger [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5] [![test coverage][6]][7]
[![downloads][8]][9] [![js-standard-style][10]][11]

Insert a swagger specification into a markdown file.

## Installation
```sh
$ npm install remark-swagger
```

## Example output
<table>
  <tr>
    <td><b>path</b></td>
    <td><b>method</b></td>
    <td><b>summary</b></td>
  </tr>
  <tr>
    <td>/foo/bar</td>
    <td>GET</td>
    <td>get all bars in the area</td>
  </tr>
  <tr>
    <td>/bin/baz</td>
    <td>PUT</td>
    <td>add a new baz to the region</td>
  </tr>
</table>

## Usage
```js
const swagger = require('remark-swagger')
const remark = require('remark')
const fs = require('fs')

const spec = fs.readFileSync('./swagger-spec.json')
const readme = fs.readFileSync('./README.md')

const res = remark()
  .use(swagger(spec, { position: 3, title: 'API' }))
  .process(readme)

process.stdout.write(res, '\n')
```

## CLI
```txt
Usage: remark-swagger [options] <markdown> [swagger]

Options:
  -h, --help        Output usage information
  -v, --version     Output version number
  -y, --yaml        Use swagger YAML instead of JSON
  -p, --position    Heading position, defaults to 4
  -t, --title       Heading title, defaults to API
  -w, --write       Persist changes to markdown file

Examples:
  $ remark-swagger README.md swagger.json    # Inject swagger into markdown
  $ remark-swagger README.md < swagger.json  # Inject swagger into markdown

Docs: https://github.com/yoshuawuyts/remark-swagger
Bugs: https://github.com/yoshuawuyts/remark-swagger/issues
```

## API
### remarkSwagger

- __opts.yaml:__ parse a yaml string
- __opts.json:__ parse a JSON string
- __opts.position:__ header position to insert the table. Defaults to 3
- __opts.title:__ header title for the table. Defaults to `'API'`.

## See Also
- [swagger ui example](http://petstore.swagger.io/)
- [swagger yaml example](https://github.com/swagger-api/swagger-editor/blob/f571a6a46145587dfd3e311312cda969844e182c/app/spec-files/default.yaml)
- [remark-toc](https://github.com/wooorm/remark-toc)

## License
[MIT](https://tldrlegal.com/license/mit-license)

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/remark-swagger.svg?style=flat-square
[3]: https://npmjs.org/package/remark-swagger
[4]: https://img.shields.io/travis/yoshuawuyts/remark-swagger/master.svg?style=flat-square
[5]: https://travis-ci.org/yoshuawuyts/remark-swagger
[6]: https://img.shields.io/codecov/c/github/yoshuawuyts/remark-swagger/master.svg?style=flat-square
[7]: https://codecov.io/github/yoshuawuyts/remark-swagger
[8]: http://img.shields.io/npm/dm/remark-swagger.svg?style=flat-square
[9]: https://npmjs.org/package/remark-swagger
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
