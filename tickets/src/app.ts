import express, { json } from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { NotFoundError, errorHandler, currentUser } from "@ncorg/common";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTiccketRouter } from "./routes/update";

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
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTiccketRouter);
app.all("*", () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
