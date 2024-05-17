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

router.get('/menu', (req, res) => {
  try {
    const open = req.query.open as string;

    const html = renderToHtml(<Menu value={open==="true"}/>);
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

router.get('/empty', (req, res) => {
  res.send('');
});

router.get('/onboard', (req, res) => {
  if (!req.user) {
    const html = renderToHtml(<Login />);
    return res.send(html);
  } else {
    const html = renderToHtml(
      <>
        <div
          id="header"
          hx-get="/header"
          hx-trigger="load"
          hx-swap="outerHTML"
        ></div>
        <div
          id="app"
          hx-get="/home/page"
          hx-trigger="load"
          hx-swap="innerHTML"
        ></div>
        <div id="nav" hx-get="/nav" hx-trigger="load" hx-swap="outerHTML"></div>
      </>
    );
    return res.send(html);
  }
});

export const indexRouter = router;
