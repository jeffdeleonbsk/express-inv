import dotenv from "dotenv";
import express, { Request, Response } from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";

import usersRouter from "./modules/users/routes";

import { bindToContainer } from "./bindToContainer";

dotenv.config();
const app = express();
const PORT = process.env.SERVER_PORT;

app.use(expressLayouts);
app.set("layout", "layouts/layout");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "modules"));
app.use("/users", usersRouter);

app.listen(PORT, () => {
    bindToContainer();
    console.log(`Listening osssn port: ${PORT}` + PORT);
});
