import { ExpirationCompleteEvent, Publisher, Subjects } from "@ncorg/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
