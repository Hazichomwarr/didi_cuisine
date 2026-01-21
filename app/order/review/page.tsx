//order/review/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { OrderDraftType } from "@/app/_models/order";
import OrderPriceDetails from "@/app/_components/OrderPriceDetails";
import { MENU } from "@/app/_menuConfig/menu";
import PageTransition from "@/app/_components/ui/PageTransition";
import SendOrderForm from "@/app/_components/SendOrderForm";

export default async function ReviewPage() {
  //Get OrderDraft from cookies
  const cookieStore = await cookies();
  const cookie = cookieStore.get("order_draft");
  if (!cookie) redirect("/order");

  const orderDraft: OrderDraftType = JSON.parse(cookie.value);
  if (!orderDraft.menuItems.length) redirect("/order");

  //Get csrfToken
  const csrfToken = cookieStore.get("csrf_token")?.value;
  if (!csrfToken) redirect("/order");

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 space-y-6">
          <h1 className="text-2xl font-semibold text-gray-800 text-center">
            Review Your Order
          </h1>

          {/* Order Items */}
          <ul className="divide-y divide-gray-200">
            {orderDraft.menuItems.map((item) => {
              const { productId, quantity } = item;
              const label = MENU[productId].label;

              return (
                <li
                  key={productId}
                  className="flex justify-between items-center py-3"
                >
                  <span className="text-gray-700">{label}</span>
                  <span className="font-semibold text-gray-900">
                    × {quantity}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* Pricing */}
          <div className="bg-gray-50 rounded-xl p-4">
            <OrderPriceDetails
              total={orderDraft.total}
              delivery={orderDraft.userInfos.deliveryOption === "delivery"}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/order"
              className="flex-1 text-center py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Edit Order
            </a>

            <SendOrderForm csrfToken={csrfToken} />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
