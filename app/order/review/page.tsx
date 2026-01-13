//order/review/page.tsx
import { OrderDraftType } from "@/app/_models/order";
import Button from "@/app/_components/ui/Button";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OrderPriceDetails from "@/app/_components/OrderPriceDetails";
import reviewOrder from "./action";
import { MENU } from "@/app/_menuConfig/menu";
import PageTransition from "@/app/_components/ui/PageTransition";

export default async function ReviewPage() {
  //Get OrderDraft from cookies
  const cookieStore = await cookies();
  const cookie = cookieStore.get("order_draft");
  if (!cookie) redirect("/order");

  const orderDraft: OrderDraftType = JSON.parse(cookie.value);
  if (!orderDraft.menuItems.length) redirect("/order");

  return (
    // <PageTransition>
    //   <div className="max-w-2xl mx-auto my-2 p-6 space-y-4 shadow-md bg-stone-50">
    //     <h1 className="text-2xl font-bold">Review Your Order</h1>

    //     <ul className="space-y-2">
    //       {orderDraft.menuItems.map((item) => {
    //         const { productId, quantity } = item;
    //         const label = MENU[productId].label;
    //         return (
    //           <li
    //             key={productId}
    //             className=" grid grid-cols-2 border-b border-gray-300 p-4"
    //           >
    //             <span>{label}</span>
    //             <span className="font-bold">QTY: {quantity}</span>
    //           </li>
    //         );
    //       })}
    //     </ul>
    //     <OrderPriceDetails
    //       total={orderDraft.total}
    //       delivery={orderDraft.userInfos.deliveryOption === "delivery"}
    //     />
    //     <div className="grid grid-cols-2">
    //       <a
    //         href="/order"
    //         className="bg-blue-700 px-3 w-fit py-2 text-lg rounded-md text-white hover:bg-blue-600"
    //       >
    //         Edit Order
    //       </a>

    //       <form action={reviewOrder}>
    //         <Button variant="tertiary">Send Order</Button>
    //       </form>
    //     </div>
    //   </div>
    // </PageTransition>
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

            <form action={reviewOrder} className="flex-1">
              <Button className="w-full bg-green-700 hover:bg-green-800 text-white">
                Send Order
              </Button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
