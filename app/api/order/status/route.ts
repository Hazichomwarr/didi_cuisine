//app/api/order/status/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/_lib/prisma";
import parsePhoneNumberFromString, {
  isValidPhoneNumber,
} from "libphonenumber-js";

export type infosErrorsType = { trackingNumber?: string; phone?: string };

export async function POST(req: Request) {
  const formData = await req.json();
  // console.log("formData_raw:", formData);

  const trackingInfos = {
    trackingNumber: formData.trackingNumber,
    phone:
      parsePhoneNumberFromString(formData.phone?.trim(), "US")?.format(
        "E.164",
      ) ?? "",
  };
  console.log("tracking-infos:", trackingInfos);

  const { trackingNumber, phone } = trackingInfos;

  //Validate inputs
  const infosErrors: infosErrorsType = {};
  if (trackingNumber.length < 7) {
    infosErrors.trackingNumber = "Tracking number should be 7 digits.";
  }
  if (!isValidPhoneNumber(phone, "US"))
    infosErrors.phone = "Invalid US Phone Number.";

  if (Object.keys(infosErrors).length > 0) {
    console.log("input-errors:", infosErrors);
    return NextResponse.json(infosErrors, { status: 400 });
  }
  //Fetch order status from DB
  try {
    const orderStatus = await prisma.order.findFirst({
      where: { customerPhone: phone, trackingNumber: Number(trackingNumber) },
      select: { status: true },
    });
    console.log("orderStatus from DB:", orderStatus);
    return NextResponse.json(orderStatus);
  } catch (error) {
    console.log("falied to fetch tracking number", error);
    return NextResponse.json(
      { error: "failed to fetch Tracking number" },
      { status: 500 },
    );
  }
}
