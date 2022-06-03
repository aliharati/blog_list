const bcrypt = require("bcryptjs");
const User = require("../models/user");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const { usersInDb } = require("./test_helper");

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  }, 13000);

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await usersInDb();
    const newUser = {
      username: "violy",
      name: "Ali Harati",
      password: "4832",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const names = usersAtEnd.map((user) => user.username);
    expect(names).toContain(newUser.username);
  });
  test("creation fail if username is shorter than 3 charachters", async () => {
    const usersAtStart = usersInDb();
    const newUser = {
      username: "al",
      name: "ali",
      password: "1234",
    };
    await api.post("/api/users").send(newUser).expect(400);
  });
  test("creation fail if username is not unique", async () => {
    const usersAtStart = usersInDb();
    const newUser = {
      username: "violy",
      name: "ali",
      password: "1234",
    };
    await api.post("/api/users").send(newUser);

    const secondUser = {
      username: "violy",
      name: "alwwwi",
      password: "123wwww4",
    };
    await api.post("/api/users").send(secondUser).expect(400);
  });
});
