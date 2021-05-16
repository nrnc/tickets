import { OrderCancelled, Publisher, Subjects } from "@ncorg/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelled> {
  readonly subject = Subjects.OrderCancelled;
}
