import { MainSubjectModel } from "../../models/main_subject.model";

export interface IMainSubjectRepository {
  findById(mainSubjectId: string): Promise<MainSubjectModel>;
  findAll(): Promise<MainSubjectModel[]>;
  save(data: MainSubjectModel): Promise<MainSubjectModel>;
}
