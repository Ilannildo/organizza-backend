import { Response } from "express";
import { ISubscriptionRepository } from "../../../repositories/interfaces/susbcription-repository";
import { Codes } from "../../../utils/codes";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { RequestWithAuth } from "../../../utils/types";
import { IGetUserSubscriptionsResponse } from "./get-user-subscriptions.dto";

interface IQuery {
  page: number;
  limit: number;
  search: string;
}

export class GetUserSubscriptionsController {
  constructor(private subscriptionRepository: ISubscriptionRepository) {}

  async handle(request: RequestWithAuth, response: Response) {
    try {
      const { user } = request;
      let { page = 1, limit = 20, search } = request.query as unknown as IQuery;

      const [total, susbcriptions] =
        await this.subscriptionRepository.findPaginateByUserId({
          userId: user.uid,
          limit,
          page,
          search,
        });

      const userSubscriptionsResponse: IGetUserSubscriptionsResponse[] = [];
      for (const subscription of susbcriptions) {
        userSubscriptionsResponse.push({
          id: subscription.id,
          code: subscription.code_ref,
          event_title: subscription.event.title,
          start_date: subscription.event.start_date,
          status: subscription.status,
          subscription_date: subscription.created_at,
        });
      }

      return sendSuccessful(response, {
        subscriptions: userSubscriptionsResponse,
        total,
        page,
        limit,
      });
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
