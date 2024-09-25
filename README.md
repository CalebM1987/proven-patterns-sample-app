# proven-patterns-sample-app

This app is meant to serve as a demo app for my [Proven Patterns for Creating Custom Mapping Applications](https://gis.bolton-menk.com/presentations/proven-patterns-for-custom-apps-2024/) talk.

> this is meant to be a very simple app, and to serve as a basic template that can be extended to incorporate more custom functionality. This provides basic functionality to allow you to switch between different configurations/deployments.


## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
