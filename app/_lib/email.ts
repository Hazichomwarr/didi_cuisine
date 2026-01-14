import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// type OrderEmailPayload = {
//   orderId: string;
//   name: string;
//   phone: string;
//   total: number;
//   items: string;
//   notes?: string;
// };

export async function sendOrderEmail(payload: string) {
  const msg = {
    to: process.env.ADMIN_ORDER_EMAIL!,
    from: process.env.FROM_EMAIL!,
    subject: `🍽️ New Order - Didi's Cuisine`,
    text: payload,
  };

  await sgMail.send(msg);
}
