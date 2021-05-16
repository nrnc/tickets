import nats from "node-nats-streaming";
import { TicketCreatePublisher } from "./events/ticket-created-publisher";
console.clear();
const stan = nats.connect("tickets", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");
  const publisher = new TicketCreatePublisher(stan);
  await publisher.publish({
    id: "123",
    title: "conecee",
    price: 12,
  });
  //   const data = {
  //     id: "1233",
  //     title: "concert",
  //     price: 10,
  //   };
  //   stan.publish("ticket:created", JSON.stringify(data), () => {
  //     console.log("Event Published");
  //   });
});
