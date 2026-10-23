export interface OrderItemDetail {
  id: string;
  productId?: string | null;
  productName: string;
  productImage: string;
  category?: string;
  sku?: string;
  price: number;
  quantity: number;
  deliveryCharge: number;
  vendorId?: string | null;
  total: number;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  district: string;
  upazila?: string | null;
  city?: string | null;
  postalCode?: string | null;
  notes?: string | null;
  paymentMethod: string;
  paymentStatus: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  transactionId?: string | null;
  courierName?: string | null;
  trackingNumber?: string | null;
  estimatedDelivery?: string | null;
  trackingMilestones?: any[];
  items: OrderItemDetail[];
  createdAt: string;
  updatedAt?: string;
}

export interface GetOrdersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    orders: OrderRecord[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface SingleOrderResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: OrderRecord;
}

export interface QueryOrderParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  email?: string;
  phone?: string;
  vendorId?: string;
}

export interface UpdateOrderStatusPayload {
  id: string;
  status?: string;
  paymentStatus?: string;
  courierName?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}
