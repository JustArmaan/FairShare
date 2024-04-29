import express from 'express';
import { renderToHtml } from 'jsxte';
import { Overview } from '../views/pages/Overview/Overview';

const router = express.Router();

router.get('/home', async (_, res) => {
  const html = renderToHtml(<Overview/>);
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
