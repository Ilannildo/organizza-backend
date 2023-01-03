import { InstallmentModel } from "../../models/installment.model";
import { client } from "../../prisma/client";
import { IInstallmentRepository } from "../interfaces/installment-repository";

export class PrismaInstallmentRepository implements IInstallmentRepository {
  findById(installment_id: string): Promise<InstallmentModel> {
    throw new Error("Method not implemented.");
  }
  async findByPaymentMethodId(id: string): Promise<InstallmentModel[]> {
    const installments = await client.installments.findMany({
      where: {
        payment_method_id: id,
        status: true,
      },
      orderBy: {
        number: "asc"
      }
    });
    return installments;
  }
  findAll(): Promise<InstallmentModel[]> {
    throw new Error("Method not implemented.");
  }
  save(role: InstallmentModel): Promise<InstallmentModel> {
    throw new Error("Method not implemented.");
  }
}
