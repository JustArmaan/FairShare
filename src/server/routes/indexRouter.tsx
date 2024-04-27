import express from 'express';
import { renderToHtml } from 'jsxte';
import { Home } from '../views/pages/Home';

const router = express.Router();

router.get('/home', async (_, res) => {
  const html = renderToHtml(<Home />);
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
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
