import express from "express";
import http from "http";
import { renderToHtml } from "jsxte";
import ViteExpress from "vite-express";
import { errorHandler } from "./middleware/errorHandler.middleware";
import { configureApp } from "./middleware/express.middleware";
import { remapSvgs } from "./middleware/svgHandler.middleware";
import { apiRouterV0 } from "./routes/api/v0/apiRouter";
import { authRouter } from "./routes/authRouter";
import { billSplitRouter } from "./routes/billSplitRouter";
import { breakdownRouter } from "./routes/breakdownRouter";
import { errorRouter } from "./routes/errorRouter";
import { groupRouter } from "./routes/groups/groupRouter";
import { groupSplitRouter } from "./routes/groupSplitRouter";
import { homeRouter } from "./routes/homeRouter";
import { indexRouter } from "./routes/indexRouter";
import { institutionRouter } from "./routes/institutionRouter";
import { notificationRouter } from "./routes/notificationRouter";
import { onboardRouter } from "./routes/onboardRouter";
import { plaidMobileLinkRouter } from "./routes/plaidMobileLinkRouter";
import { receiptRouter } from "./routes/receiptRouter";
import { transactionRouter } from "./routes/transactionRouter";
import { transferRouter } from "./routes/transferRouter";
import { ErrorPage } from "./views/pages/Errors/Error";
import { sseHandler } from "./websockets/sse";
const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

await configureApp(app);

app.use(indexRouter);
app.use("/api/v0", apiRouterV0);
app.use(remapSvgs);
app.use("/breakdown", breakdownRouter);
app.use("/home", homeRouter);
app.use("/receipt", receiptRouter);
app.use("/transactions", transactionRouter);
app.use("/groups", groupRouter);
app.use("/auth", authRouter);
app.use("/transfer", transferRouter);
app.use("/notification", notificationRouter);
app.use("/institutions", institutionRouter);
app.use("/split", groupSplitRouter);
app.use("/mobile", plaidMobileLinkRouter);
app.use("/billSplit", billSplitRouter);
app.use("/onboard", onboardRouter);

app.use("/error", errorRouter);

app.use("", (req, res, next) => {
  console.log(req.url);
  const hxRequest = req.headers["hx-request"] === "true";
  if (hxRequest) {
    console.log("hxRequest", req.url);
    const html = renderToHtml(<ErrorPage status="404" />);
    return res.send(html);
  }
  next();
});

// ss endpoints
app.get("/api/sse", sseHandler);

const runningServer = server.listen(PORT as number, () => {
  console.log(`Server is running on port ${PORT}...`);
});

ViteExpress.bind(app, runningServer);

app.use(errorHandler);
