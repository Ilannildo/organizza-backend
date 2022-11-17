import { EventTypeModel } from "../../models/event_type.model";
import { MainSubjectModel } from "../../models/main_subject.model";
import { client } from "../../prisma/client";
import { IMainSubjectRepository } from "../interfaces/IMainSubjectRepository";

export class MainSubjectsRepository implements IMainSubjectRepository {
  findById(mainSubjectId: string): Promise<MainSubjectModel> {
    throw new Error("Method not implemented.");
  }
  async findAll(): Promise<MainSubjectModel[]> {
    const subjects = await client.mainSubject.findMany();
    return subjects;
  }
  save(data: MainSubjectModel): Promise<MainSubjectModel> {
    throw new Error("Method not implemented.");
  }

}
