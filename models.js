import { Sequelize, DataTypes } from "sequelize";

export const sequelize = new Sequelize("sqlite:data/db.sqlite");

export const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export const Subject = sequelize.define("Subject", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export const Grade = sequelize.define("Grade", {
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Grade.belongsTo(Subject);
Subject.hasMany(Grade);

Grade.belongsTo(User);
User.hasMany(Grade);

User.belongsToMany(Subject, { through: "UserSubjects" });
Subject.belongsToMany(User, { through: "UserSubjects" });

await sequelize.sync();
