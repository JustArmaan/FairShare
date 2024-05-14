import express from 'express';
import { renderToHtml } from 'jsxte';
import { Header } from '../views/components/Header';
import { Nav } from '../views/components/Navigation';
const router = express.Router();

router.get('/header', (_, res) => {
  try {
    const html = renderToHtml(<Header />);
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

router.get('/nav', (_, res) => {
  try {
    const html = renderToHtml(<Nav />);
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

router.get('/empty', (req, res) => {
  res.send('');
});

export const indexRouter = router;
