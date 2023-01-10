import { Request, Response } from "express";
import { IEventsRepository } from "../../../repositories/interfaces/event-repository";
import { ITicketServiceOrderRepository } from "../../../repositories/interfaces/ticket-service-order-repository";
import { Codes } from "../../../utils/codes";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { calculateTicketFee, calculateTicketValue } from "../../../utils/roles";
import { IGetEventPanelSalesResponse } from "./get-event-panel-sales.dto";

export class GetEventPanelSalesController {
  constructor(
    private eventsRepository: IEventsRepository,
    private ticketServiceOrderRepository: ITicketServiceOrderRepository
  ) {}

  async handle(request: Request<{ event_id: string }>, response: Response) {
    try {
      const { event_id } = request.params;
      let event = await this.eventsRepository.findById(event_id);

      if (!event) {
        throw new Error("Evento não encontrado");
      }

      const serviceOrderCompleted =
        await this.ticketServiceOrderRepository.findAllByEventId({
          eventId: event.id,
          status: "settled",
        });

      const total = serviceOrderCompleted.reduce(
        (accumulator, serviceOrder) => {
          return (accumulator += serviceOrder.service_order.amount_total);
        },
        0
      );

      const serviceOrderProcessing =
        await this.ticketServiceOrderRepository.findAllByEventId({
          eventId: event.id,
          status: "processing",
        });

      const processing = serviceOrderProcessing.reduce(
        (accumulator, serviceOrder) => {
          const fee = calculateTicketFee({
            ticket_price_type:
              serviceOrder.service_order.ticket_service_order.ticket
                .ticket_price_type,
            value: serviceOrder.service_order.ticket_service_order.ticket.value,
          });

          const ticketValue = calculateTicketValue({
            fee,
            includeFee:
              serviceOrder.service_order.ticket_service_order.ticket
                .include_fee,
            value: serviceOrder.service_order.ticket_service_order.ticket.value,
          });

          return (accumulator += ticketValue);
        },
        0
      );

      const eventPanelResponse: IGetEventPanelSalesResponse = {
        processing,
        total,
      };

      return sendSuccessful(response, eventPanelResponse);
    } catch (error) {
      return sendError(
        response,
        Codes.UNKNOWN_ERROR,
        error.message || "Unexpected error",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }
  }
}
