import { EventRepository } from "../../../repositories/implementations/EventsRepository";
import { TicketRepository } from "../../../repositories/implementations/TicketsRepository";
import { CreateEventTicketController } from "./CreateEventTicketController";

const eventRepository = new EventRepository();
const ticketRepository = new TicketRepository();

export const createEventTicketController = new CreateEventTicketController(
  eventRepository,
  ticketRepository
);
