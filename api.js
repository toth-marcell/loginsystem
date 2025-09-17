import express from "express";
import JWT from "jsonwebtoken";
import { Grade, Subject, User, UserSubject } from "./models.js";

const app = express();
export default app;

app.use(express.json());

const secret = "secret!!!";

app.post("/login", async (req, res) => {
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

app.post("/register", async (req, res) => {
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

app.get("/getSecret", auth, (req, res) => {
  return res.json({ msg: `Szia ${req.username}!` });
});

app.get("/moreSecrets", auth, (req, res) => {
  return res.json({ msg: "Hello, world!" });
});

app.post("/subject", auth, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ msg: "Kötelező nevet megadni!" });
  res.json(await Subject.create({ name }));
});

app.post("/grade", auth, async (req, res) => {
  const { number, SubjectId, UserId } = req.body;
  if (!number)
    return res.status(400).json({ msg: "Kötelező értéket megadni!" });
  if (!Subject || !UserId)
    return res
      .status(400)
      .json({ msg: "Kötelező felhasználót és tantárgyat megadni!" });
  res.json(await Grade.create({ number, SubjectId, UserId }));
});

app.get("/subject", async (req, res) => {
  res.json(await Subject.findAll({ include: [User, Grade] }));
});

app.get("/grade", async (req, res) => {
  res.json(await Grade.findAll({ include: [User, Subject] }));
});

app.get("/users", async (req, res) => {
  res.json(
    await User.findAll({
      attributes: ["id", "name", "createdAt", "updatedAt"],
    }),
  );
});

app.delete("/users/:id", auth, async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id);
  if (!user) return res.status(400).json({ msg: "Nincs ilyen felhasználó!" });
  await user.destroy();
  res.json({ msg: "Siker!" });
});

app.delete("/subject/:id", auth, async (req, res) => {
  const id = req.params.id;
  const subject = await Subject.findByPk(id);
  if (!subject) return res.status(400).json({ msg: "Nincs ilyen tantárgy!" });
  await subject.destroy();
  res.json({ msg: "Siker!" });
});

app.delete("/grade/:id", auth, async (req, res) => {
  const id = req.params.id;
  const grade = await Grade.findByPk(id);
  if (!grade) return res.status(400).json({ msg: "Nincs ilyen jegy!" });
  await grade.destroy();
  res.json({ msg: "Siker!" });
});

app.delete("/usersubject", auth, async (req, res) => {
  const { UserId, SubjectId } = req.query;
  const usersubject = await UserSubject.findOne({
    where: { UserId, SubjectId },
  });
  if (!usersubject)
    return res
      .status(400)
      .json({ msg: "Nincs ilyen felhasználó-tantárgy kapcsolat!" });
  await usersubject.destroy();
  res.json({ msg: "Siker!" });
});
