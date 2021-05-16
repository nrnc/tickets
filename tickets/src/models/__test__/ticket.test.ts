import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async (done) => {
  //create an instance of an ticket

  const ticket = Ticket.build({
    title: "concert",
    price: 10,
    userId: "124",
  });

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  await firstInstance?.save();
  try {
    await secondInstance?.save();
  } catch (error) {
    return done();
  }

  throw new Error("Should not reach thsi point");
});
