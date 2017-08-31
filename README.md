# n9-micro-starter

REST API with TypeScript & [n9-node-micro](https://github.com/neo9/n9-node-micro)

[![Travis](https://img.shields.io/travis/neo9/n9-micro-starter/master.svg)](https://travis-ci.org/neo9/n9-micro-starter)
[![Coverage](https://img.shields.io/codecov/c/github/neo9/n9-micro-starter/master.svg)](https://codecov.io/gh/neo9/n9-micro-starter)

## Installation

```bash
git clone --depth 1 git@github.com:neo9/n9-micro-starter.git
cd n9-micro-starter/
npm install
```

You need also to remove the git history and start a new one:
```bash
rm -r .git/
git init
```

## Development

```bash
npm run dev
```

Server will listen on port `6686` (configurable via `src/conf/application.ts`) and will restart on changes.

### Logs

To configure the logs, use `log` option in your config file, see [n9-node-log](https://github.com/neo9/n9-node-log#log-level) to see the available options.

## Production

```bash
npm run build
npm start
```

The build output is configurable via `tsconfig.json`, default output to ES2015 to work on `node >= 6`.

## Linting

```bash
npm run lint
```

Configurable via `tslint.json`.

## Tests

```bash
npm test
```

The tests are made with [ava](https://github.com/avajs/ava), please note that every test is run in parallel for maximum speed.


