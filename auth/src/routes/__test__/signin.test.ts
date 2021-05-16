import request from "supertest";
import { app } from "../../app";

it("fails when email taht does not exist is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "passwrod" })
    .expect(400);
});

it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "passwrod" })
    .expect(201);
  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "passwrod2323222" })
    .expect(400);
});

it("respons with a cookie when given valid creds", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "passwrod" })
    .expect(201);
  const response = await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "passwrod" })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
