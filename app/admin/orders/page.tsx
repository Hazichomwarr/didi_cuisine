//app/admin/orders/page.tsx
import { prisma } from "@/app/_lib/prisma";
import { FetchOrders } from "@/app/_models/order";

async function getOrders(): Promise<FetchOrders[]> {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });
}

export default async function AdminOrderPage() {
  const orders = await getOrders();

  if (!orders)
    <p className="text-center text-2xl bg-amber-100">Failed to fetch Order.</p>;

  return (
    <main>
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      <div className="space-y-6">
        {orders.map((order: FetchOrders) => (
          <div
            key={order.id}
            className="max-w-full border rounded-xl p-4 bg-neutral-900 text-white"
          >
            <h2 className="text-2xl mb-5 bg-gray-800">
              {order.customerName} (${order.total})
            </h2>
            <p className="font-semibold text-gray-200 flex flex-col gap-2">
              <span className="block"> Tracking: {order.trackingNumber}</span>

              <span>Phone: {order.customerPhone}</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </p>

            <ul className="mt-3 space-y-1">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.label} x {item.quantity}
                </li>
              ))}
            </ul>

            <p className="mt-2 text-amber-400">Status: {order.status}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
