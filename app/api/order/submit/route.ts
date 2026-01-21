// app/api/order/submit/route.ts

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import {signDraft} from "@/app/_lib/draftSignature"

import {
  parsePhoneNumberFromString,
  isValidPhoneNumber,
} from "libphonenumber-js";

import { MenuKEY, UserInfoSanitized } from "../../../_models/order";
import { orderTotalPrice } from "../../../_utils/formConfig";
import { MENU } from "@/app/_menuConfig/menu";

type OrderErrors = {
  name?: string;
  phone?: string;
  deliveryOption?: string;
  address?: string;
  menuItems?: string;
};

export async function POST(req: Request) {
  const formData = await req.json();
  //console.log("formData_raw:", formData);

  const menuItems = Object.entries(formData)
    .filter(([key]) => key.startsWith("items["))
    .map(([key, value]) => {
      const productId = key.match(/items\[(.*)\]/)?.[1];
      return { productId: productId as MenuKEY, quantity: Number(value) };
    })
    .filter((item) => item.quantity > 0);

  //default values for name, phone, delivery options and notes
  const userInfos: UserInfoSanitized = {
    name: formData.name?.trim(),
    phone:
      parsePhoneNumberFromString(formData.phone?.trim(), "US")?.format(
        "E.164",
      ) ?? "",
    deliveryOption: formData.deliveryOption?.trim(),
    address: formData.address?.trim(),
    notes: formData.notes?.trim(),
  };

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
      'Valid Address is required for delivery.\n(Ex: "123 Main street, City, State")';
  }

  if (Object.keys(missingInputs).length > 0) {
    console.log("missings:", missingInputs);
    // const total = 0;
    // return { errors: missingInputs, values: { userInfos, menuItems, total } };
    return NextResponse.json({ errors: missingInputs }, { status: 400 });
  }

  //Order Total Price
  const total = orderTotalPrice(menuItems, MENU);

  //create OrderDraft
  const orderDraft = {
    userInfos,
    menuItems,
    total,
    createdAt: Date.now(),
  };
  // console.log("order-draft:", orderDraft);

  //signe draft first
  const signedDraft = {data: orderDraft, sig: signDraft(orderDraft)}

  //Then Persist draft to cookies
  const cookieStore = await cookies();
  cookieStore.set("order_draft", JSON.stringify(signedDraft), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 10, //10mins
  });

  //set csrf token
  const csrfToken = randomUUID();
  cookieStore.set("csrf_token", csrfToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    path: "/",
  });

  return NextResponse.json({ csrfToken });
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
