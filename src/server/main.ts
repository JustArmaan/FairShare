import express from 'express';
import { indexRouter } from './routes/indexRouter';
import ViteExpress from 'vite-express';
import { breakdownRouter } from './routes/breakdownRouter';
import { configureApp } from './middleware/express.middleware';
import { homeRouter } from './routes/homeRouter';
import { transactionRouter } from './routes/transactionRouter';
import { groupRouter } from './routes/groupRouter';
import { apiRouterV0 } from './routes/api/v0/apiRouter';
import { authRouter } from './routes/authRouter';
import { transferRouter } from './routes/transferRouter';
import { notificationRouter } from './routes/notificationRouter';
const PORT = process.env.PORT || 3000;

const app = express();

configureApp(app);

app.use(indexRouter);
app.use('/api/v0', apiRouterV0);
app.use('/breakdown', breakdownRouter);
app.use('/home', homeRouter);
app.use('/transactions', transactionRouter);
app.use('/groups', groupRouter);
app.use('/auth', authRouter);
app.use('/transfer', transferRouter);
app.use('/notification', notificationRouter )



ViteExpress.listen(app, PORT as number, () =>
  console.log(`Server is running on port ${PORT}...`)
);
