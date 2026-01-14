//app/api/order/review/submit/route.ts

//import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { OrderDraftType } from "@/app/_models/order";
import { MENU } from "@/app/_menuConfig/menu";
import { sendSMS } from "@/app/_lib/twilio";

const BUSINESS_PHONE = "+19294537790";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("order_draft");
  if (!cookie) return NextResponse.json({}, { status: 403 });

  const orderDraft: OrderDraftType = JSON.parse(cookie.value);
  if (!orderDraft.menuItems.length) {
    return NextResponse.json({}, { status: 403 });
  }

  const { name, phone, deliveryOption, address, notes } = orderDraft.userInfos;
  const isDelivery = deliveryOption === "delivery";

  //Concat all items into a string
  const els = [];
  for (const item of orderDraft.menuItems) {
    els.push(`- ${MENU[item.productId].label} x${item.quantity}`);
  }

  //Order-ID timestamp & ETA
  const orderId = `DK-${Date.now().toString().slice(-6)}`;
  const timestamp = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const ETA = isDelivery ? "45–60 minutes Delivery" : "25–35 minutes Pickup";

  const receipt = `🍽️ NEW ORDER - DIDI'S CUISINE
  Order ID: ${orderId}
  Placed: ${timestamp}
  ETA: ${ETA}

  Customer:
  👤 Name: ${name}
  📞 Phone: ${phone}
  ${deliveryOption === "delivery" ? "🚚 Delivery" : "📦 Pickup"}
  ${isDelivery ? `📍 Address: ${address}` : ""}

  🧾Order: \n${els.join("\n")}
  ${notes ? `📝 NOTES: ${notes}` : ""}

  💰 Subtotal: ${orderDraft.total}
  ${isDelivery ? `🚚 Delivery: +5.00` : "\t------------"}
  💵 Total: ${isDelivery ? orderDraft.total + 5 : orderDraft.total}
  
  Thank you for your order 🙏`;

  console.log("Receipt:", receipt);

  // (option-1): Send it via whatsAPP
  // const encodedMessage = encodeURIComponent(receipt);
  // redirect(`https://wa.me/${phone}?text=${encodedMessage}`);

  //(option-2): Send via Twilio SMS API
  const res = await sendSMS(BUSINESS_PHONE, receipt);
  if (res) {
    console.log("SMS sent successfully!");
    cookieStore.delete("order_draft"); //Delete the cookie
    return NextResponse.json({}, { status: 200 });
  } else {
    console.error("Failed to send SMS. Try again");
    return NextResponse.json({}, { status: 500 });
  }
}
