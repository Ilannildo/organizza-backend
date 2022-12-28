import { Response } from "express";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { RequestWithAuth } from "../../../utils/types";
import { HttpStatus } from "../../../utils/httpStatus";
import { Codes } from "../../../utils/codes";
import { IPaymentMethodRepository } from "../../../repositories/interfaces/payment-method-repository";
import { IServiceOrderRepository } from "../../../repositories/interfaces/service-order-repository";

export class GetPaymentMethodController {
  constructor(
    private paymentMethodRepository: IPaymentMethodRepository,
    private serviceOrderRepository: IServiceOrderRepository
  ) {}
  async handle(request: RequestWithAuth, response: Response) {
    try {
      // recebe o body da requisição
      const { service_order_id } = request.params;

      const serviceOrder = await this.serviceOrderRepository.findById({
        service_order_id,
      });

      if (!serviceOrder) {
        return sendError(
          response,
          Codes.ENTITY__NOT_FOUND,
          "Essa ordem de serviço não existe",
          HttpStatus.NOT_FOUND
        );
      }

      const paymentMethods = await this.paymentMethodRepository.findAll();

      return sendSuccessful(response, paymentMethods, HttpStatus.OK);
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
