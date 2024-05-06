import express from "express";
import { indexRouter } from "./routes/indexRouter";
import ViteExpress from "vite-express";
import { breakdownRouter } from "./routes/breakdownRouter";
import { configureApp } from "./middleware/express.middleware";
import { homeRouter } from "./routes/homeRouter";
import { transactionRouter } from "./routes/transactionRouter";
import { apiRouterV0 } from "./routes/api/v0/apiRouter";

const PORT = process.env.PORT || 3000;

const app = express();

configureApp(app);

app.use(indexRouter);
app.use("/breakdown", breakdownRouter);
app.use("/home", homeRouter);
app.use("/transactions", transactionRouter);
app.use("/api/v0", apiRouterV0);

/*
app.use((_: Request, res: Response) => {
  res.status(404).send('Page not found');
});

app.use((error: Error, _: Request, res: Response) => {
  console.error(error);
  res.status(500).send('Internal Server Error');
});
*/

ViteExpress.listen(app, PORT as number, () =>
  console.log(`Server is running on port ${PORT}...`)
);
