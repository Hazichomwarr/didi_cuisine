// app/order/actions.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  MenuKEY,
  SanitizedOrderItem,
  UserInfoSanitized,
} from "../_models/order";
import { InitialStateType } from "./page";
import { orderTotalPrice } from "../_utils/formConfig";
import {
  parsePhoneNumberFromString,
  isValidPhoneNumber,
} from "libphonenumber-js";
import { MENU } from "../_menuConfig/menu";

type OrderErrors = {
  name?: string;
  phone?: string;
  deliveryOption?: string;
  address?: string;
  menuItems?: string;
};

export async function submitOrder(
  prevState: InitialStateType,
  formData: FormData
) {
  const raw = Object.fromEntries(formData.entries());
  console.log("raw:", raw);

  const menuItems = Object.entries(raw)
    .filter(([key]) => key.startsWith("items["))
    .map(([key, value]) => {
      const productId = key.match(/items\[(.*)\]/)?.[1];
      return { productId: productId as MenuKEY, quantity: Number(value) };
    })
    .filter((item) => item.quantity > 0);

  //default values for name, phone, delivery options and notes
  const userInfos: UserInfoSanitized = {
    name: raw.name?.toString().trim(),

    phone: parsePhoneNumberFromString(
      raw.phone?.toString().trim(),
      "US"
    )!.format("E.164"),
    deliveryOption: raw.deliveryOption?.toString().trim(),
    address: raw.address?.toString().trim(),
    notes: raw.notes?.toString().trim(),
  };

  // console.log("phone-number:", userInfos.phone);
  // console.log("userInfos:", userInfos);
  // console.log("items selected:", menuItems);

  //Error Array
  const missingInputs: OrderErrors = {};
  const ADDRESS_REGEX =
    /^\s*\d+\s+[A-Za-z0-9.\-'\s]+\s+[A-Za-z.\-'\s]+\s+[A-Za-z]{2}\s*$/;

  if (menuItems.length === 0)
    missingInputs.menuItems = "Select at least one menu item.";
  if (userInfos.name.length < 3) missingInputs.name = "Valid name required.";
  if (!isValidPhoneNumber(userInfos.phone, "US"))
    missingInputs.phone = "Invalid Phone Number";
  if (!userInfos.deliveryOption)
    missingInputs.deliveryOption = "Delivery option is missing.";
  if (
    userInfos.deliveryOption === "delivery" &&
    !ADDRESS_REGEX.test(userInfos.address)
  ) {
    missingInputs.address =
      'Valid Address is required for delivery. (Ex: "123 Main street, City, State")';
  }

  if (Object.keys(missingInputs).length > 0) {
    console.log("missings:", missingInputs);
    const total = 0;
    return { errors: missingInputs, values: { userInfos, menuItems, total } };
  }

  //Order Total Price
  const total = orderTotalPrice(menuItems, MENU);
  console.log("orderTotal price:", total);

  //create OrderDraft
  const orderDraft = {
    userInfos,
    menuItems,
    total,
    createdAt: Date.now(),
  };
  console.log("order-draft:", orderDraft);

  //Persist draft (temporary)
  const cookieStore = await cookies();
  cookieStore.set("order_draft", JSON.stringify(orderDraft), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 10, //10mins
  });

  //Move flow forward
  redirect("order/review");
}
