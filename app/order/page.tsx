//app/order/page.tsx
import { cookies } from "next/headers";
import OrderForm from "../_components/OrderForm";
import { OrderDraftType } from "../_models/order";
import PageTransition from "../_components/ui/PageTransition";

export type InitialStateType = {
  errors: Record<string, string>;
  values: Omit<OrderDraftType, "createdAt">;
};

export default async function OrderPage() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("order_draft");

  const initialState: InitialStateType = cookie
    ? {
        errors: {},
        values: JSON.parse(cookie.value) as Omit<OrderDraftType, "createdAt">,
      }
    : {
        errors: {},
        values: {
          userInfos: {
            name: "",
            phone: "",
            deliveryOption: "pickup",
            address: "",
            notes: "",
          },
          menuItems: [],
          total: 0,
        },
      };

  const headerString = cookie ? "Edit Order" : "Start Order";

  return (
    <PageTransition>
      <div
        className="relative space-y-6 flex flex-col items-center p-6 mx-auto my-2 bg-cover"
        style={{ backgroundImage: "url(/foodImages/chickenAvocado.jpeg)" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 w-full flex flex-col items-center space-y-6">
          <h3 className="text-3xl font-semibold text-white">{headerString}</h3>
          <OrderForm initialState={initialState} />
        </div>
      </div>
    </PageTransition>
  );
}
