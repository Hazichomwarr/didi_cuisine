// //app/order/status/order-status/page.tsx
// import { redirect } from "next/navigation";
// import Link from "next/link";

// const STATUS_CONFIG = {
//   PENDING: {
//     title: "Order Received",
//     message: "We’re preparing your order. Hang tight!",
//     color: "bg-yellow-100 text-yellow-800",
//     emoji: "⏳",
//   },
//   SENT: {
//     title: "Out for Delivery",
//     message: "Your order is on the way 🚗💨",
//     color: "bg-blue-100 text-blue-800",
//     emoji: "📦",
//   },
//   CONFIRMED: {
//     title: "Order Delivered",
//     message: "Enjoy your meal! 🍽️",
//     color: "bg-green-100 text-green-800",
//     emoji: "✅",
//   },
//   CANCELLED: {
//     title: "Order Cancelled",
//     message: "This order was cancelled. Please contact support if needed.",
//     color: "bg-red-100 text-red-800",
//     emoji: "❌",
//   },
//   READY_PICKUP: {
//     title: "Order Ready for Pickup",
//     message: "Your order is ready and all yours. Come get it. 🍽️",
//     color: "bg-green-100 text-green-800",
//     emoji: "✅",
//   },
// } as const;

// type StatusType =
//   | "PENDING"
//   | "SENT"
//   | "CONFIRMED"
//   | "CANCELLED"
//   | "READY_PICKUP";

// export default async function StatusPage({
//   searchParams,
// }: {
//   searchParams: Promise<{ status?: StatusType }>;
// }) {
//   const sp = await searchParams;
//   const status = sp?.status;
//   console.log("status:", status);
//   if (!status || !(status in STATUS_CONFIG)) {
//     redirect("/");
//   }

//   const config = STATUS_CONFIG[status];

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//       <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl text-center space-y-4">
//         <div
//           className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${config.color}`}
//         >
//           <span>{config.emoji}</span>
//           <span>{config.title}</span>
//         </div>

//         <h2 className="text-2xl font-semibold text-gray-800">
//           Status: {status}
//         </h2>

//         <p className="text-gray-600">{config.message}</p>

//         <Link
//           href="/"
//           className="block w-full rounded-lg bg-black text-white py-2 mt-4 hover:bg-neutral-800 active:scale-95 transition"
//         >
//           Close
//         </Link>
//       </div>
//     </div>
//   );
// }
