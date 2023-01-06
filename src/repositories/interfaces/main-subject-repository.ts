import { MainSubjectModel } from "../../models/main-subject.model";

export interface IMainSubjectRepository {
  findById(mainSubjectId: string): Promise<MainSubjectModel>;
  findAll(): Promise<MainSubjectModel[]>;
  save(data: MainSubjectModel): Promise<MainSubjectModel>;
}
