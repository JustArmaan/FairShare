import express from 'express';
import { type Request, type Response } from 'express';
import session from 'express-session';
import { indexRouter } from './routes/indexRouter';
import bodyParser from 'body-parser';
import connectLiveReload from 'connect-livereload';
import path from 'node:path';
import liveReload from 'livereload';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(connectLiveReload());

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const liveReloadServer = liveReload.createServer();
liveReloadServer.watch(path.join(__dirname));
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 0);
});

app.use(indexRouter);

app.use((_: Request, res: Response) => {
  res.status(404).send('Page not found');
});

app.use((error: Error, _: Request, res: Response) => {
  console.error(error);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
