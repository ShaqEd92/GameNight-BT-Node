import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import routes from "./routes/routes.js";

const app = express();
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticRoot = path.join(__dirname, "./public");

app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(staticRoot));
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(routes);
app.use((req, res, next) => {
  return res.status(404).render("pageNotFound");
});

const PORT = 4000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
