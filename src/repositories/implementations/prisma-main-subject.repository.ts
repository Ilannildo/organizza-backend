import { IMainSubjectRepository } from "../interfaces/main-subject-repository";
import { MainSubjectModel } from "../../models/main-subject.model";
import { client } from "../../prisma/client";

export class PrismaMainSubjectRepository implements IMainSubjectRepository {
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
