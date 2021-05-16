import express, { json } from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { NotFoundError, errorHandler, currentUser } from "@ncorg/common";
import { indexOrderRouter } from "./routes";
import { createOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { deleteOrderRouter } from "./routes/delete";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use(currentUser);
app.use(createOrderRouter);
app.use(indexOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);
app.all("*", () => {
  console.log("object");
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
