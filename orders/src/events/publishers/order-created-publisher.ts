import { OrderCreatedEvent, Publisher, Subjects } from "@ncorg/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
