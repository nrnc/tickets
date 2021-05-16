import { Publisher, Subjects, TicketCreatedEvent } from "@ncorg/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
