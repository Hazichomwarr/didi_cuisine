//app/api/order/review/submit/route.ts

//import { redirect } from "next/navigation";
// import { sendSMS } from "@/app/_lib/twilio";
import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { orderLimit } from "@/app/_lib/rateLimit";
import {verifyDraft} from "@/app/_lib/draftSignature"

import { OrderDraftType } from "@/app/_models/order";
import { MENU } from "@/app/_menuConfig/menu";

import { sendOrderEmail } from "@/app/_lib/email";
import { prisma } from "@/app/_lib/prisma";

export async function POST() {

  //Ratelimiter (before cookie)
  const ip = (await headers()).get("x-forwarded-for") ?? "anonymous";
  const { success } = await orderLimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const cookieStore = await cookies();

  //before anything verify the csrf token
  const csrfToken = cookieStore.get("csrf_token")?.value;
  const headerToken = (await headers()).get("x-csrf-token");
  if (!csrfToken || csrfToken !== headerToken) {
    return NextResponse.json({ error: "Invalid CSRF" }, { status: 403 });
  }
  console.log(`csrf tookens match?: ${csrfToken === headerToken}`);

  //Now get user Order from the signed cookie
  const cookie = cookieStore.get("order_draft");
  if (!cookie) return NextResponse.json({}, { status: 403 });

  const parsed = JSON.parse(cookie.value);
  if (!parsed?.data || !parsed?.sig) {
    return NextResponse.json({error: "Invalid draft"}, {status: 403})
  }
  if (!verifyDraft(parsed.data, parsed.sig)) {
    return NextResponse.json({error: "Draft tampered"}, {status: 403})
  }
  console.log("order-draft and signedDraft values match!")

  const orderDraft: OrderDraftType = parsed.data;
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

  //Recalculate order total server-side
  const computedTotal = orderDraft.menuItems.reduce((sum, item) => {
    return sum + MENU[item.productId].price * item.quantity;
  }, 0);

  //persit order to DB

  try {
    await prisma.$transaction(async (tx) => {
      await tx.order.create({
        data: {
          customerName: name,
          customerPhone: phone,
          deliveryOption,
          address: isDelivery ? address : null,
          notes,
          total: isDelivery ? computedTotal + 5 : computedTotal,
          status: "PENDING",
          items: {
            create: orderDraft.menuItems.map((item) => ({
              productId: item.productId,
              label: MENU[item.productId].label,
              price: MENU[item.productId].price,
              quantity: item.quantity,
            })),
          },
        },
      });
    });
  } catch (err) {
    console.log("DB error:", err);
    return NextResponse.json({ error: "Order failed" }, { status: 500 });
  }

  //Order-ID timestamp & ETA
  const orderId = Date.now();
  const timestamp = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const ETA = isDelivery ? "45–60 minutes Delivery" : "25–35 minutes Pickup";

  const receipt = `🍽️ NEW ORDER - DIDI'S CUISINE
  Order ID: ${orderId}
  Placed: ${timestamp}
  

  Customer:
  👤 Name: ${name}
  📞 Phone: ${phone}
  ${deliveryOption === "delivery" ? "🚚 Delivery" : "📦 Pickup"}
  ${isDelivery ? `📍 Address: ${address}` : ""}

  🧾Order: \n${els.join("\n")}
  ${notes ? `📝 NOTES: ${notes}` : ""}

  💰 Subtotal: ${computedTotal}
  ${isDelivery ? `🚚 Delivery: +5.00` : "\t------------"}
  💵 Total: ${isDelivery ? computedTotal + 5 : computedTotal}
  
  Thank you for your order 🙏
  ETA: ${ETA}`;

  // (option-1): Send it via whatsAPP
  // const encodedMessage = encodeURIComponent(receipt);
  // redirect(`https://wa.me/${phone}?text=${encodedMessage}`);

  //(option-2): Send via Twilio SMS API
  // const res = await sendSMS(BUSINESS_PHONE, receipt);
  // if (res) {
  //   console.log("SMS sent successfully!", receipt);
  //   cookieStore.delete("order_draft"); //Delete the cookie
  //   return NextResponse.json({}, { status: 200 });
  // } else {
  //   console.error("Failed to send SMS. Falling back on Email");
  //   return NextResponse.json({ error: "Failed to sent sms" }, { status: 500 });
  // }

  //(Option-3): Send email to admin via SendGrid
  try {
    await sendOrderEmail(receipt);
    console.log("Email sent successfully!", receipt);
    cookieStore.delete("order_draft"); //Delete the draft cookie
    cookieStore.delete("csrf_token"); //Delete csrf token
    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    console.error("Failed to send Email", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }

  // const fullOrder = await prisma.order.findUnique({
  //   where: {id: order.id},
  //   include: {items: true}
  // })
}
