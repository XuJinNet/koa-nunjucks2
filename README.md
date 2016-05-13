koa-nunjucks2    [![License][license-img]][license-url]
===============
  [![NPM](https://nodei.co/npm/koa-nunjucks2.png?compact=true)](https://nodei.co/npm/koa-nunjucks2/)

  koa2 middleware for Nunjucks.

## Installation
```
$ npm install koa-nunjucks2 --save
```

## Middleware Setup
First, require koa-nunjucks2. It returns a function that will return a middleware async function.

```js
let koaNunjucks2 = require('koa-nunjucks2');
let koaNunjucks2Middleware = koaNunjucks2('views', {autoescape: true});
```

The function takes four arguments:
* **templatesPath** *(default: current working directory)*: Where is the templates, will pass to [nunjucks.configure()](http://mozilla.github.io/nunjucks/api.html#configure) function.
* **nunjucksOptions**: Object of [Nunjucks config options](https://mozilla.github.io/nunjucks/api.html#configure).
* **extConfig** *(default: {suffix: '.html', contentType: 'text/html; charset=UTF-8', renderToResponseBody: true})*: Extended config of this middleware.
* **callback**: The environment will pass to the callback function, it can be used to add filters and so on.

Next, "use" the middleware function (before any other middleware that attempts to use it).

```js
const Koa = require('koa');
const app = new Koa();
app.use(koaNunjucks2Middleware);
```

## Usage
The render function is attached to the Koa context. The function renders the view and automatically sets it as the response body if "renderToResponseBody" set true.

```js
await ctx.render('home', { username: 'Whatever name' });
```
The render function takes two arguments as defined by [nunjucks.render](http://mozilla.github.io/nunjucks/api.html#render). It does NOT take a callback, but return a promise. If "renderToResponseBody" set false, the render result will return by promise.

If you want to make a variable available in all templates, use [koa ctx.state](https://github.com/koajs/koa/blob/master/docs/api/context.md#ctxstate).

# License
  [MIT][license-url]

[license-img]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: LICENSE