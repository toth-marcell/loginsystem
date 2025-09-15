import express from "express";
import JWT from "jsonwebtoken";
import { User } from "./models.js";

const app = express();
app.use(express.static("public"));
app.use(express.json());

const secret = "secret!!!";

app.post("/api/login", async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findOne({ where: { name } });
  if (user) {
    if (user.password == password) {
      res.json({
        msg: "Siker!",
        token: JWT.sign({ name }, secret, { expiresIn: "1h" }),
      });
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
  await User.create({ name, password });
  res.json({
    msg: "Siker!",
    token: JWT.sign({ name }, secret, { expiresIn: "1h" }),
  });
});

function auth(req, res, next) {
  try {
    const jwt = JWT.verify(req.headers.authorization, secret);
    req.username = jwt.name;
    return next();
  } catch {
    return res.status(400).json({ msg: "Nincs erre jogod!" });
  }
}

app.get("/api/getSecret", auth, (req, res) => {
  return res.json({ msg: `Szia ${req.username}!` });
});

app.get("/api/moreSecrets", auth, (req, res) => {
  return res.json({ msg: "Hello, world!" });
});

const port = 3000;
app.listen(port, () => console.log(`Listening on :${port}`));
