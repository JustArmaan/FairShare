import express from 'express';
import { renderToHtml } from 'jsxte';
import { Header } from '../views/components/Header';
import { Nav } from '../views/components/Navigation';
const router = express.Router();

/*
router.get('/menu', async (_, res) => {
  try {
    const html = renderToHtml(<Menu />);
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});
*/

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

export const indexRouter = router;
