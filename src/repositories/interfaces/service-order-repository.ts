import { ServiceOrderModel } from "../../models/service-order.model";

export interface IServiceOrderRepository {
  save(data: ServiceOrderModel): Promise<ServiceOrderModel>;
  update(data: ServiceOrderModel): Promise<ServiceOrderModel>;
}
