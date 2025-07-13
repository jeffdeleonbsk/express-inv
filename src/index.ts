import BodyParser from "body-parser";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import { bindToContainer } from "./app/bindToContainer";
import authRouter from "./app/routes/authRoutes";
import purchaseOrderRouter from "./app/routes/purchaseOrderRoutes";
import usersRouter from "./app/routes/userRoutes";

dotenv.config();
const app = express();
const PORT = process.env.SERVER_PORT;

app.use(expressLayouts);
// parse application/x-www-form-urlencoded
app.use(BodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(BodyParser.json());
app.set("layout", "layouts/layout");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "modules"));

app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/purchase-orders", purchaseOrderRouter);

app.listen(PORT, () => {
    bindToContainer();
    console.log(`Listening osssn port: ${PORT}` + PORT);
});
