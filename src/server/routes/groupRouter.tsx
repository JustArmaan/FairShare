import express from 'express';
import { renderToHtml } from 'jsxte';
import { GroupPage } from '../views/pages/Group/GroupPage';

const router = express.Router();

router.get('/page', (req, res) => {
  try {
    const html = renderToHtml(<GroupPage />);
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

export const groupRouter = router;
