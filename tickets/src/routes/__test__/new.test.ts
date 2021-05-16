import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("has a route listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});
it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});
it("returns other than 401 if user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});
it("return error if invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "", price: 10 })
    .expect(400);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ price: 10 })
    .expect(400);
});
it("return error if invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "asasadd", price: -10 })
    .expect(400);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "ertegfd" })
    .expect(400);
});
it("creates a ticket with valid parameters", async () => {
  //add a check to make sure ticket was saved
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);
  let title = "asasadd";
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price: 10 })
    .expect(201);
  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(10);
});

it("publishes an event", async () => {
  let title = "asasadd";
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price: 10 })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
