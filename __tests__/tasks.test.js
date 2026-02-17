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
    })
  );

  app.use((req, res, next) => {
    req.session.login = req.session.login || "";
    next();
  });

  app.use(routes);

  return app;
};

describe("Tasks API Tests", () => {
  let app;
  let agent;
  let testEmail;
  let testPassword;
  let userId;
  let createdTaskRowId;   
  let createdTaskCustomId; 

  beforeAll(async () => {
    app = createTestApp();
    agent = request.agent(app);

    testEmail = `tasktest-${Date.now()}@example.com`;
    testPassword = "TestPassword123";

    await createUser(testEmail, testPassword);
    const user = await findUserByEmail(testEmail);
    userId = user.id;

    await agent.post("/login/").send({
      email: testEmail,
      password: testPassword,
    });
  });

  afterAll(async () => {
    const connection = await db.getConnection();
    await connection.query("DELETE FROM tasks WHERE user_id = ?", [userId]);
    await connection.query("DELETE FROM users WHERE id = ?", [userId]);
    connection.release();
  });

  // API END POINT 1: CREATE TASK (POST /tasks/)

  describe("POST /tasks/", () => {
    test("happy path: should create task and redirect", async () => {
      const res = await agent.post("/tasks/").send({
        task: "API Test Task",
      });

      expect(res.status).toBe(302);
      expect(res.headers.location).toBe("/tasks/");

      // verify DB insert
      const connection = await db.getConnection();
      const [rows] = await connection.query(
        "SELECT * FROM tasks WHERE user_id = ? AND name = ?",
        [userId, "API Test Task"]
      );
      connection.release();

      expect(rows.length).toBeGreaterThan(0);

      createdTaskRowId = rows[0].id;
      createdTaskCustomId = rows[0].task_id || rows[0].id;
    });

    test("sad path: should redirect to /error/ if not logged in", async () => {
      const newAgent = request.agent(app);

      const res = await newAgent.post("/tasks/").send({
        task: "Unauthorized Task",
      });

      expect(res.status).toBe(302);
      expect(res.headers.location).toBe("/error/");
    });
  });

  // API END POINT 2: EDIT TASK NAME (PUT /edit/)

  describe("PUT /edit/", () => {
    test("happy path: should edit task name", async () => {
      const res = await agent.put("/edit/").send({
        ID: createdTaskCustomId,
        name: "Updated Task Name",
      });

      expect(res.status).toBe(200);
      expect(res.text).toBe("ok edit done");
    });

    test("sad path: should return 401 if not logged in", async () => {
      const newAgent = request.agent(app);

      const res = await newAgent.put("/edit/").send({
        ID: createdTaskCustomId,
        name: "Fail Edit",
      });

      expect(res.status).toBe(401);
    });
  });

  // API END POINT 3: MARK TASK AS COMPLETE (PUT /task/:id)

  describe("PUT /task/:id", () => {
    test("happy path: should mark task as complete", async () => {
      const res = await agent.put(`/task/${createdTaskCustomId}`);

      expect(res.status).toBe(200);
      expect(res.text).toBe("change to done succesful");
    });

    test("sad path: should return 401 if not logged in", async () => {
      const newAgent = request.agent(app);

      const res = await newAgent.put(`/task/${createdTaskCustomId}`);

      expect(res.status).toBe(401);
    });
  });

  // API END POINT 4: DELETE TASK (DELETE /task/:id)

  describe("DELETE /task/:id", () => {
    test("happy path: should delete task", async () => {
      const res = await agent.delete(
        `/task/${createdTaskCustomId}`
      );

      expect(res.status).toBe(200);
      expect(res.text).toBe("delete task succesful");

      // verify deletion
      const connection = await db.getConnection();
      const [rows] = await connection.query(
        "SELECT * FROM tasks WHERE id = ?",
        [createdTaskRowId]
      );
      connection.release();

      expect(rows.length).toBe(0);
    });

    test("sad path: should return 401 if not logged in", async () => {
      const newAgent = request.agent(app);

      const res = await newAgent.delete(
        `/task/${createdTaskCustomId}`
      );

      expect(res.status).toBe(401);
    });
  });
});
