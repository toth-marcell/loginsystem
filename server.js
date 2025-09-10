import express from "express";
import { User } from "./models.js";

const app = express();
app.use(express.static("public"));
app.use(express.json());

app.post("/api/login", async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findOne({ where: { name } });
  if (user) {
    if (user.password == password) {
      res.json({ msg: "Siker!" });
    } else {
      res.status(400).json({ msg: "Rossz jelszó!" });
    }
  } else {
    res.status(400).json({ msg: "Nincs ilyen felhasználó!" });
  }
});

app.post("/api/register", async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({ msg: "Nem lehet üres név vagy jelszó!" });
  }
  const existingUser = await User.findOne({ where: { name } });
  if (existingUser) {
    return res.status(400).json({ msg: "Ez a név már használatban van!" });
  }
  res.json({ msg: "Siker!", user: await User.create({ name, password }) });
});

app.get("/api/getSecret", (req, res) => {
  if (req.headers.authorization == "titok") {
    return res.json({ secret: "Szia!" });
  }
  return res.status(400).json({ msg: "Nincs erre jogod!" });
});

const port = 3000;
app.listen(port, () => console.log(`Listening on :${port}`));
