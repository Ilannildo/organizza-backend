import { Response } from "express";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { RequestWithAuth } from "../../../utils/types";
import { HttpStatus } from "../../../utils/httpStatus";
import { Codes } from "../../../utils/codes";
import { IPaymentMethodRepository } from "../../../repositories/interfaces/payment-method-repository";
import { IServiceOrderRepository } from "../../../repositories/interfaces/service-order-repository";
import { IGetPaymentMethodResponse } from "./get-payment-method.dto";

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

      const paymentResponse: IGetPaymentMethodResponse[] = [];
      paymentMethods.forEach((paymentMethod) => {
        paymentResponse.push({
          information: paymentMethod.informations,
          payment_id: paymentMethod.id,
          payment_title: paymentMethod.name,
          payment_type: paymentMethod.payment_form,
        });
      });

      return sendSuccessful(response, paymentResponse, HttpStatus.OK);
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
