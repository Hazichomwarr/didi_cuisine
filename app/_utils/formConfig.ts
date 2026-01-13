//app/utils/formConfig.ts
import { Menu, SanitizedOrderItem } from "../_models/order";

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  const parts = digits.match(/(\d{0,3})(\d{0,3})(\d{0,4})/) || [];
  return [parts[1], parts[2], parts[3]].filter(Boolean).join("-");
}

//app/_utils/formConfig.ts
export function orderTotalPrice(
  selected: SanitizedOrderItem[],
  MENU: Menu
): number {
  let total = 0;

  for (const item of selected) {
    const { productId, quantity } = item;
    total += MENU[productId].price * quantity;
  }

  return Math.round(total * 100) / 100;
}
