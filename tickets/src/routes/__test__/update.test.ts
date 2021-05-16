import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

it("returns a 404 if id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const title = "haha";
  const price = 10;
  await request(app)
    .put("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price })
    .expect(404);
});
it("returns a 401 if user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const title = "haha";
  const price = 10;
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title, price })
    .expect(401);
});
it("returns a 401 if user doesnot own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "hahaha", price: 10 })
    .expect(201);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({ title: "ysdfgahjzjfh", price: 10 })
    .expect(401);
});
it("returns a 400 if user provide invalid title or price", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "hahaha", price: 10 })
    .expect(201);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 10 })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "teteefsdjf", price: -10 })
    .expect(400);
});

it("updates the ticket provided the valid input", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "hahaha", price: 10 })
    .expect(201);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "hahahha", price: 10000 })
    .expect(200);
});

it("publishes an event", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "hahaha", price: 10 })
    .expect(201);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "hahahha", price: 10000 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects updates if it's in peding status or cretaed order status", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "hahaha", price: 10 })
    .expect(201);
  const ticket = await Ticket.findById(response.body.id);
  ticket?.set({ orderId: mongoose.Types.ObjectId().toHexString });
  await ticket?.save();
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "hahahha", price: 10000 })
    .expect(400);
});
