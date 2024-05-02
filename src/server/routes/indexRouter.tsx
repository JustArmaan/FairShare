import express from 'express';
import { renderToHtml } from 'jsxte';
import { Overview } from '../views/pages/Overview/Overview';
import { Header } from '../views/components/Header';
import { Nav } from '../views/components/Navigation';
import { Default } from '../views/components/Default';
import { Menu } from '../views/components/Menu';
const router = express.Router();

router.get('/home', async (_, res) => {
  const html = renderToHtml(<Nav/>);
  res.send(html);
});

router.get('/menu', async (_, res) => {
  const html = renderToHtml(<Menu/>);
  res.send(html);
});

router.post('/test', (_, res) => {
  res.send('Success!');
});

router.get('/transactions', (_, res) => {
  console.log('/transactions route was called');
  const transactions = [
    { id: 1, type: 'deposit', amount: 102 },
    { id: 2, type: 'withdrawal', amount: 50 },
  ];

  res.json(transactions);
});

export const indexRouter = router;
