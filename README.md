# node-ts-skeleton

Express.js REST API with TypeScript.

## Installation

```bash
git clone ssh://git@scm.bytefactory.fr:2222/n9node/node-ts-skeleton.git
cd node-ts-skeleton/
yarn
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

Server will listen on port 6686 (configurable via `src/conf/application.ts`) and will restart on changes.

### Debug

The log are displayed via `DEBUG=node-ts-skeleton:*` defined in `nodemon.json`, please rename it if you rename your application name (`package.json`).

## Production

```bash
npm run build
npm start
```

The build output is configurable via `tsconfig.json`, default output to ES2015 to work on `node >= 4`.

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


