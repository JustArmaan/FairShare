import { Elysia, ListenCallback } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import { html } from '@elysiajs/html';
import { indexRouter } from './routes/indexRouter';
import open from 'open';
const PORT = process.env.PORT || 3000;

declare global {
  var ws: any;
  var isOpened: boolean;
}
export const app = new Elysia()
  .use(staticPlugin())
  .use(indexRouter)
  .use(html())
  .ws(`/live-reload`, {
    open: (ws) => {
      globalThis.ws = ws;
    },
  });

// hot reload for server when running dev
const callback: ListenCallback = async ({ hostname, port }) => {
  if (!globalThis.isOpened) {
    globalThis.isOpened = true;
    open(`http://${hostname}:${port}`);
  }

  if (globalThis.ws) globalThis.ws.send('live-reload');
};

if (process.env.IS_DEV) {
  console.log('Running in dev environment!');
  app.listen(PORT, callback);
} else {
  app.listen(PORT);
}

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
