import { Publisher, Subjects, TicketUpdatedEvent } from "@ncorg/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
