import { EventCoverRepository } from "../../../repositories/implementations/EventCoverRepository";
import { UploadEventCoverController } from "./UploadEventCoverController";
import { UploadEventCoverUseCase } from "./UploadEventCoverUseCase";

const eventCoverRepository = new EventCoverRepository();
const uploadEventCoverUseCase = new UploadEventCoverUseCase(
  eventCoverRepository
);
export const uploadEventCoverController = new UploadEventCoverController(
  uploadEventCoverUseCase
);
