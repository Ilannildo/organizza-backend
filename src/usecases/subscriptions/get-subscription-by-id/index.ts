import { PrismaSubscriptionRepository } from "../../../repositories/implementations/prisma-subscription.respository";
import { GetSubscriptionByIdController } from "./get-subscription-by-id.controller";

const prismaSubscriptionRepository = new PrismaSubscriptionRepository();

export const getSubscriptionByIdController = new GetSubscriptionByIdController(
  prismaSubscriptionRepository
);
