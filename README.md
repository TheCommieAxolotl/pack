# pack
A snappy start for your next big thing.

---

have you ever found yourself installing the same things over and over again in mega commands like this?
```bash
pnpm add rollup @rollup/plugin-node-resolve typescript @rollup/plugin-typescript @rollup/plugin-commonjs tslib
```

well pack offers simple command line tools to make your life easier.
```bash
pack create rollup typescript
```

simple as that.

## What does pack support?
pack currently supports a few common bundling options.
- [rollup](https://rollupjs.org/)
- [webpack](https://webpack.js.org/)
- [vite](https://vitejs.dev/)
- vanilla

### Tools
- [typescript](https://www.typescriptlang.org/)
- [eslint](https://eslint.org/)
- [prettier](https://prettier.io/)

## How do I get started?
```bash
pnpm add -g create-npack@latest
```

## How do I use pack?
```bash
pack <command>

# Commands:
#   pack create <template> [options]  Create a new project from a template
#   pack include                      Whitelist files to be included in npm package
```
