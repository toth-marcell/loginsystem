import express from "express";
import apiApp from "./api.js";

const app = express();

app.use(express.static("public"));
app.use("/api", apiApp);

const port = 3000;
app.listen(port, () => console.log(`Listening: http://localhost:${port}`));
