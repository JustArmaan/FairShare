import express from 'express';
import { renderToHtml } from 'jsxte';
import { Breakdown } from '../views/pages/Breakdown/Breakdown';

const router = express.Router();

router.get('/page', async (req, res) => {
  const html = renderToHtml(<Breakdown />);

  res.send(html);
});

export const breakdownRouter = router;
