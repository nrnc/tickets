import { Listener, Subjects, TicketUpdatedEvent } from "@ncorg/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  onMessage = async (data: TicketUpdatedEvent["data"], msg: Message) => {
    const ticket = await Ticket.findByEvent(data);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    const { title, price } = data;
    // const ticket = Ticket.build({ id, title, price });
    ticket.set({ title, price });
    await ticket.save();
    msg.ack();
  };
}
