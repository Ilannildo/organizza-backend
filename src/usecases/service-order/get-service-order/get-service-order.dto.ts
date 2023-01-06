export interface IGetServiceOrderResponse {
    service_order_id: string;
    total: number;
    subtotal: number;
    fee: number;
    quantity: number;
    expires_in: number;
    ticket: {
      event_title: string;
      title: string;
      icon_url?: string;
    };
  }