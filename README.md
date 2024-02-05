# Problem

Cannot use default NodeJS global require at runtime in webpack

# How to reproduce

- Change .env-template => .env and fill in values
- `npm install` (this was not a pnpm issue after all!)
- `npm run dev`
- Open `http://localhost:3000/api` in the browser and observe the problem

# Why

Read this [https://stackoverflow.com/questions/58215361/importing-from-outside-webpack-runtime-importing](https://stackoverflow.com/questions/58215361/importing-from-outside-webpack-runtime-importing).

The `require(provider).default` line at [https://github.com/MagnivOrg/prompt-layer-js/blob/master/src/index.ts#L32](https://github.com/MagnivOrg/prompt-layer-js/blob/master/src/index.ts#L32) breaks when using webpack via NextJS.

# Solution

Ensure the final build of `promptlayer-js` uses `__non_webpack_require__` instead of `require`. We can see that this works by cutting off the dev server, manually opening `node_modules/promptlayer/dist/index.js`, find/replace `a=require(o)` to `a=__non_webpack_require__(o)`, and then restarting the dev server with `npm run dev`:

# Personal opinion

Considering the diversity of ways that JS code is compiled/transpiled in the wild, I think using `require` dynamically is rarely a good idea inside library code. Ideally, you all would support an API more like this:

```typescript
import { initPromptlayer } from "promptlayer";
import openai from "openai";

// note: as a bonus, doing it this way would ensure that types could
// be preserved via Typescript generics on your end. No need for a user to cast like
// in the current getting started example.
const promptlayer = initPromptLayer({ openai });
const openai = new promptlayer.OpenAI();
```
