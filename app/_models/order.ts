//app/_models/order.ts
export type MenuKEY =
  | "dibi"
  | "chicken"
  | "jollof-rice"
  | "jollof-chicken"
  | "jollof-dibi"
  | "alloco";

export interface MenuItemType {
  id: MenuKEY;
  label: string;
  price: number;
}

export type Menu = Record<MenuKEY, MenuItemType>;

export type SanitizedOrderItem = {
  productId: MenuKEY;
  quantity: number;
};

export type UserInfoSanitized = {
  name: string;
  phone: string;
  deliveryOption: string;
  address: string;
  notes: string;
};

export type OrderDraftType = {
  userInfos: UserInfoSanitized;
  menuItems: SanitizedOrderItem[];
  total: number;
  createdAt: Date;
};

// ---------------DB TYPES-----------------------

export type StatusType =
  | "PENDING"
  | "SENT"
  | "CONFIRMED"
  | "CANCELLED"
  | "READY_PICKUP";

export type ItemDB = {
  id: string;
  label: string;
  quantity: number;
};

export type FetchOrders = {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryOption: string;
  total: number;
  trackingNumber: number;
  status: StatusType;
  createdAt: Date;
  items: ItemDB[];
};
