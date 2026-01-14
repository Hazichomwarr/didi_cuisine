//app/_lib/email.ts
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendOrderEmail(payload: string) {
  const msg = {
    to: process.env.ADMIN_ORDER_EMAIL!,
    cc: process.env.ADMIN2_ORDER_EMAIL!,
    from: {
      email: process.env.FROM_EMAIL!,
      name: "Didi's Cuisine",
    },
    subject: `🍽️ New Order - Didi's Cuisine`,
    text: payload,
  };

  await sgMail.send(msg);
  //  const [response] = await sgMail.send(msg);
  // console.log("SendGrid status:", response.statusCode);
  // console.log("SendGrid headers:", response.headers);
}
