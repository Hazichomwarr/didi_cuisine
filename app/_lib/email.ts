//app/_lib/email.ts
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendOrderEmail(payload: string) {
  const msg = {
    to: process.env.ADMIN_ORDER_EMAIL!,
    from: process.env.FROM_EMAIL!,
    subject: `🍽️ New Order - Didi's Cuisine`,
    text: payload,
  };

  const [response] = await sgMail.send(msg);
  console.log("SendGrid status:", response.statusCode);
  console.log("SendGrid headers:", response.headers);
}
