import { Elysia, t } from 'elysia';
import { html } from '@elysiajs/html';
import { Home } from '../pages/Home';

export const indexRouter = new Elysia()
  .get('/', () => <Home />)
  .post('/test', ({ body }) => {
    body.password
    }, {
    body: t.Object({
      username: t.Number(),
      password: t.String(),
    }),
  });
