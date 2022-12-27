import { Request, Response } from "express";
import { IEventsRepository } from "../../../repositories/interfaces/event-repository";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { Codes } from "../../../utils/codes";
import { IGetEventPageRespose } from "./get-event-page.dto";

export class GetEventPageController {
  constructor(private eventsRepository: IEventsRepository) {}

  async handle(request: Request, response: Response) {
    const { slug } = request.query;
    const slugString = String(slug);

    try {
      let event = await this.eventsRepository.findBySlug(slugString);

      if (!event) {
        throw new Error("Não encontramos o evento");
      }

      const nowDate = new Date();
      if (
        event.end_date.getDate() <= nowDate.getDate() &&
        event.end_time.getTime() <= nowDate.getTime()
      ) {
        event = await this.eventsRepository.update({
          ...event,
          status: "finished",
        });
      }

      const eventRespose: IGetEventPageRespose = {
        event_id: event.id,
        title: event.title,
        end_date: event.end_date,
        start_date: event.start_date,
        event_responsible_email: event.event_responsible.email,
        event_responsible_name: event.event_responsible.name,
        is_finished: event.status === "finished" ? true : false,
        short_description: event.short_description,
        venue_type: event.venue_type,
        event_cover_url: event.event_cover ? event.event_cover.url : null,
        summary: event.summary,
        facebook_url: event.logo_url,
        instagram_url: event.facebook_url,
        logo_url: event.instagram_url,
        twitter_url: event.twitter_url,
      };

      return sendSuccessful(response, eventRespose, HttpStatus.OK);
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
