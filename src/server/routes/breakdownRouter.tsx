import express from 'express';
import { renderToHtml } from 'jsxte';
import { Breakdown } from '../views/pages/Breakdown/Breakdown';

const router = express.Router();

const examples = [
  {
    tailwindColorClass: 'bg-accent-red',
    percentage: 0.7,
    cost: 800,
    title: 'Food',
  },
  {
    tailwindColorClass: 'bg-accent-blue',
    percentage: 0.23,
    cost: 200,
    title: 'Rent',
  },
  {
    tailwindColorClass: 'bg-accent-green',
    percentage: 0.07,
    cost: 200,
    title: 'GPT-4',
  },
];

router.get('/page', async (_, res) => {
  const html = renderToHtml(<Breakdown categories={examples} />);

  res.send(html);
});

export const breakdownRouter = router;
