import { PrismaEventCoverRepository } from "../../../repositories/implementations/prisma-event-cover.repository";
import { UploadEventCoverController } from "./upload-event-cover.controller";

const prismaEventCoverRepository = new PrismaEventCoverRepository();
export const uploadEventCoverController = new UploadEventCoverController(
  prismaEventCoverRepository
);
