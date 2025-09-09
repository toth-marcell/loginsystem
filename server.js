import express from "express";
import { User } from "./models.js";

if ((await User.findAll()).length == 0) {
  User.create({ name: "testuser", password: "password" });
}

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

const port = 3000;
app.listen(port, () => console.log(`Listening on :${port}`));
