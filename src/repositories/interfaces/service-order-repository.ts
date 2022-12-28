import { ServiceOrderModel } from "../../models/service-order.model";

export interface IServiceOrderRepository {
  save(data: ServiceOrderModel): Promise<ServiceOrderModel>;
  findById(params: { service_order_id: string }): Promise<ServiceOrderModel>;
  update(data: ServiceOrderModel): Promise<ServiceOrderModel>;
}
