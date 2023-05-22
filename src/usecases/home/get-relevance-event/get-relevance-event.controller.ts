import { Request, Response } from "express";
import { getTopicsRelevance } from "../../../providers/relevance-main-subjects";
import { IEventsRepository } from "../../../repositories/interfaces/event-repository";
import { Codes } from "../../../utils/codes";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { IEventResponse } from "./get-relevance-event.dto";

export class GetRelevanceEventsController {
  constructor(private eventsRepository: IEventsRepository) {}

  async handle(request: Request, response: Response) {
    try {
      const events = await this.eventsRepository.findAllActivesAndPublic();
      // Cálculo da pontuação de relevância de cada evento
      const today = new Date();
      // Cálculo da pontuação de relevância de cada evento
      const scoredEvents = await Promise.all(
        events.map(async (event) => {
          const relevanceByAttendees =
            event.subscriptions.filter((sub) => sub.status === "completed")
              .length * 5;

          // const relevanceByRating = event.rating * 10;

          const relevanceByDate =
            (event.start_date.getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24);

          const mainSubjectRelevanceTopic = await getTopicsRelevance([
            event.main_subject.title,
          ]);
          const mainSubjectRelevance = mainSubjectRelevanceTopic.reduce(
            (acc, topic) => acc + topic.relevanceScore,
            0
          );
          const relevanceByLocation = event.venue_type === "online" ? 0 : 10;

          const relevanceScore =
            relevanceByAttendees +
            relevanceByDate +
            mainSubjectRelevance +
            relevanceByLocation;

          return {
            ...event,
            relevance_score: relevanceScore,
          };
        })
      );
      // Ordenação dos eventos pela pontuação de relevância e seleção dos 5 melhores
      const topFiveEvents = scoredEvents
        .sort((a, b) => b.relevance_score - a.relevance_score)
        .slice(0, 5);

      const formattedEvents: IEventResponse[] = topFiveEvents.map((event) => ({
        id: event.id,
        title: event.title,
        topic: event.main_subject.title,
        start_date: event.start_date,
        end_date: event.end_date,
        attendees: event.subscriptions.filter(
          (sub) => sub.status === "completed"
        ).length,
        location:
          event.venue_type === "presential"
            ? event.event_has_address
              ? event.event_has_address.address.city.name
              : "Evento presencial"
            : "Evento online",
        description: event.short_description,
        relevance_score: event.relevance_score,
        type: event.venue_type,
        cover_url: event.event_cover?.url,
        slug: event.slug,
      }));

      return sendSuccessful(response, formattedEvents, HttpStatus.OK);
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
