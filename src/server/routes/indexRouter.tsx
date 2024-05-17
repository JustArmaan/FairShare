import express from 'express';
import { renderToHtml } from 'jsxte';
import { Header } from '../views/components/Header';
import { Nav } from '../views/components/Navigation';
import { Menu } from '../views/components/Menu';
import { Login } from '../views/pages/Onboarding/Login';
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

router.get('/menu', (_, res) => { 
  try {
    const html = renderToHtml(<Menu />);
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

router.get('/empty', (req, res) => {
  res.send('');
});

router.get('/onboard', (req, res) => {
  const html = renderToHtml(<Login/>);
  res.send(html)
})

export const indexRouter = router;
