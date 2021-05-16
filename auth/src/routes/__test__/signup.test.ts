import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);
});

it("return a 400 with an Invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "haha@haha.com", password: "jaja" })
    .expect(400);
});
it("return a 400 with an Invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "haha", password: "jajaajaja" })
    .expect(400);
});

it("return a 400 with msiing email and passord", async () => {
  return request(app).post("/api/users/signup").send({}).expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(400);
});

it("sets a cookie after successfull signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
