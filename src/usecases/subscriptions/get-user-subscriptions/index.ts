import { PrismaSubscriptionRepository } from "../../../repositories/implementations/prisma-subscription.respository";
import { GetUserSubscriptionsController } from "./get-user-subscriptions.controller";

const prismaSubscriptionRepository = new PrismaSubscriptionRepository();

export const getUserSubscriptionsController =
  new GetUserSubscriptionsController(prismaSubscriptionRepository);
