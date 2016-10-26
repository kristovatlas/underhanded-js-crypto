# uglify-js

PoC of [yan/@bcrypt's uglify 2.4.23 minification exploit](https://diracdeltas.github.io/blog/backdooring-js/).

## Files

 * example.js: Original excerpt by yan/@bcrypt
 * example.min.js: Uglified version of example.js matching the blog article.
 * example-lint.js: Lint-friendly, functioning version of the excerpt
 * example-lint.min.js: Uglified version of example-lint.js

## Requirements

 * uglify-js@2.4.23: `npm install -g uglify-js@2.4.23` if you want to compile yourself
 * nodejs

## Usage

### Using nodejs

Skip the uglify-js commands if you don't want to compile yourself.

    $ uglifyjs example-lint.js -c -o example-lint-min.js

    $ node example-lint.js
    $ node example-lint.min.js

Expected output:
```
User is not valid.
User is valid.
```
