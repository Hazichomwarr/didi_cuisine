//app/api/order/review/submit/route.ts

//import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { OrderDraftType } from "@/app/_models/order";
import { MENU } from "@/app/_menuConfig/menu";
// import { sendSMS } from "@/app/_lib/twilio";
import { sendOrderEmail } from "@/app/_lib/email";
import { prisma } from "@/app/_lib/prisma";

export async function POST() {
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

  //persit order to DB
  const order = await prisma.order.create({
    data: {
      customerName: name,
      customerPhone: phone,
      deliveryOption,
      address: isDelivery ? address : null,
      notes,
      total: isDelivery ? orderDraft.total + 5 : orderDraft.total,
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

  // const fullOrder = await prisma.order.findUnique({
  //   where: {id: order.id},
  //   include: {items: true}
  // })

  //Order-ID timestamp & ETA
  const orderId = order.id;
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

  💰 Subtotal: ${orderDraft.total}
  ${isDelivery ? `🚚 Delivery: +5.00` : "\t------------"}
  💵 Total: ${isDelivery ? orderDraft.total + 5 : orderDraft.total}
  
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

  //(option-3): Send via SendGrid Email
  try {
    await sendOrderEmail(receipt);
    console.log("Email sent successfully!", receipt);
    cookieStore.delete("order_draft"); //Delete the cookie
    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    console.error("Failed to send Email", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
