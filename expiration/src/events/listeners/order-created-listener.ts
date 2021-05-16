import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@ncorg/common";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  onMessage = async (data: OrderCreatedEvent["data"], msg: Message) => {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log("Will be daaying", delay);
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      { delay: delay }
    );
    // ack the message
    msg.ack();
  };
}
