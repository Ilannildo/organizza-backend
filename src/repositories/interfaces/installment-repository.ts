import { InstallmentModel } from "../../models/installment.model";
import { RoleModel } from "../../models/roles.model";

export interface IInstallmentRepository {
  findById(installment_id: string): Promise<InstallmentModel>;
  findByPaymentMethodId(id: string): Promise<InstallmentModel[]>;
  findAll(): Promise<InstallmentModel[]>;
  save(role: InstallmentModel): Promise<InstallmentModel>;
}