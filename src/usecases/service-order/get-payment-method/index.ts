import { PrismaPaymentMethodRepository } from "../../../repositories/implementations/prisma-payment-method.respository";
import { PrismaServiceOrderRepository } from "../../../repositories/implementations/prisma-service-order.repository";
import { GetPaymentMethodController } from "./get-payment-method.controller";

const prismaPaymentMethodRepository = new PrismaPaymentMethodRepository();
const prismaServiceOrderRepository = new PrismaServiceOrderRepository();

export const getPaymentMethodController = new GetPaymentMethodController(
  prismaPaymentMethodRepository,
  prismaServiceOrderRepository
);
