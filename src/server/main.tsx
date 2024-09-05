import express from "express";
import { indexRouter } from "./routes/indexRouter";
import ViteExpress from "vite-express";
import { breakdownRouter } from "./routes/breakdownRouter";
import { configureApp } from "./middleware/express.middleware";
import { homeRouter } from "./routes/homeRouter";
import { transactionRouter } from "./routes/transactionRouter";
import { groupRouter } from "./routes/groups/groupRouter";
import { apiRouterV0 } from "./routes/api/v0/apiRouter";
import { authRouter } from "./routes/authRouter";
import { transferRouter } from "./routes/transferRouter";
import { notificationRouter } from "./routes/notificationRouter";
import http from "http";
import { Server } from "socket.io";
import { setupSocketConnectionListener } from "./websockets/connection";
const PORT = process.env.PORT || 3000;
import { institutionRouter } from "./routes/institutionRouter";
import { errorHandler } from "./middleware/errorHandler.middleware";
import { errorRouter } from "./routes/errorRouter";
import { ErrorPage } from "./views/pages/Errors/Error";
import { renderToHtml } from "jsxte";
import { plaidMobileLinkRouter } from "./routes/plaidMobileLinkRouter";
import { remapSvgs } from "./middleware/svgHandler.middleware";
import { receiptRouter } from "./routes/receiptRouter";
import { groupSplitRouter } from "./routes/groupSplitRouter";
import { billSplitRouter } from "./routes/billSplitRouter";
import { onboardRouter } from "./routes/onboardRouter";
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

// sockets

export const io = new Server(server);
setupSocketConnectionListener(io);

const runningServer = server.listen(PORT as number, () => {
  console.log(`Server is running on port ${PORT}...`);
});

ViteExpress.bind(app, runningServer);

app.use(errorHandler);
