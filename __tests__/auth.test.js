require("dotenv").config();

const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const routes = require("../routes");
const db = require("../helpers/db");
const { createUser, findUserByEmail } = require("../helpers/dbQueries");

const createTestApp = () => {
  const app = express();
  const sessionKeys = ["test_key_1", "test_key_2"];

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(
    cookieSession({
      name: "LoginCookieSession",
      keys: sessionKeys,
    }),
  );

  app.use((req, res, next) => {
    req.session.login = req.session.login || "";
    next();
  });

  app.set("view engine", "pug");
  app.use(routes);

  return app;
};

describe("Authentication API Tests", () => {
  let app;
  let testEmail;
  let testPassword;

  const removeUserByEmail = async (email) => {
    const connection = await db.getConnection();
    try {
      await connection.query("DELETE FROM users WHERE email = ?", [email]);
    } finally {
      connection.release();
    }
  };

  beforeAll(() => {
    app = createTestApp();
    testEmail = `test-${Date.now()}@example.com`;
    testPassword = "TestPassword123";
  });

  afterAll(async () => {
    await removeUserByEmail(testEmail);
  });


  // API END POINT 1: REGISTRATION --------------------------------

  describe("POST /registry/", () => {
    test("happy path: should create a new user and redirect", async () => {
      await removeUserByEmail(testEmail);
      const res = await request(app)
        .post("/registry/")
        .send({ email: testEmail, password: testPassword });

      expect(res.status).toBe(302);
      expect(res.headers.location).toBe("/");
    });

    test("sad path: should reject duplicate email and redirect to registry", async () => {
      const existing = await findUserByEmail(testEmail);
      if (!existing) {
        await createUser(testEmail, testPassword);
      }
      const res = await request(app)
        .post("/registry/")
        .send({ email: testEmail, password: "AnotherPassword" });

      expect(res.status).toBe(302);
      expect(res.headers.location).toBe("/registry/");
    });

    test("sad path: shoudl fail if email is missing and redirect to registry", async () => {
      const res = await request(app)
        .post("/registry/")
        .send({ password: testPassword });

      expect(res.status).toBe(302);
      expect(res.headers.location).toBe("/registry/");
    });

    test("sad path: should fail if password is missing and redirect to registry", async () => {
      const res = await request(app)
        .post("/registry/")
        .send({ email: testEmail });

      expect(res.status).toBe(302);
      expect(res.headers.location).toBe("/registry/");
    });
  });


  // API END POINT 2: LOGIN --------------------------------

  describe("POST /login/", () => {
    test("happy path: should login and redirect to /tasks/", async () => {
      const existing = await findUserByEmail(testEmail);
      if (!existing) {
        await createUser(testEmail, testPassword);
      }
      const res = await request(app)
        .post("/login/")
        .send({ email: testEmail, password: testPassword });

      expect(res.status).toBe(302);
      expect(res.headers.location).toBe("/tasks/");
    });

    test("sad path: should reject invalid password and redirect to /error", async () => {
      const existing = await findUserByEmail(testEmail);
      if (!existing) {
        await createUser(testEmail, testPassword);
      }
      const res = await request(app)
        .post("/login/")
        .send({ email: testEmail, password: "wrong_password" });

      expect(res.status).toBe(302);
      expect(res.headers.location).toBe("/error");
    });

    test("sad path: should reject non-existent email and redirect to /error", async () => {
      const res = await request(app)
        .post("/login/")
        .send({ email: "non_existent_email", password: testPassword });

      expect(res.status).toBe(302);
      expect(res.headers.location).toBe("/error");
    });
  });
});