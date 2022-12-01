import { EventCoverRepository } from "../../../repositories/implementations/EventCoverRepository";
import { UploadEventCoverController } from "./UploadEventCoverController";

const eventCoverRepository = new EventCoverRepository();
export const uploadEventCoverController = new UploadEventCoverController(
  eventCoverRepository
);
