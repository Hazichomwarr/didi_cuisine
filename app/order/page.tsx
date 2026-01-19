//app/order/page.tsx
import { cookies } from "next/headers";
import OrderForm2 from "../_components/OrderForm2";
import { OrderDraftType, MenuKEY } from "../_models/order";
import PageTransition from "../_components/ui/PageTransition";
import { MENU } from "../_menuConfig/menu"

export type InitialStateType = {
  errors: Record<string, string>;
  values: Omit<OrderDraftType, "createdAt">;
};

export default async function OrderPage({searchParams}: {
  searchParams: {
    add?: string;
  }}) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("order_draft");
  //get query from url if any
  const query = await searchParams;
  const sanitizedQuery: MenuKEY | null = typeof query.add === 'string'
    ? MENU[query.add].id as MenuKEY
    : null
  
  console.log('sanitizedQuery:', sanitizedQuery)
  console.log("id:",MENU[query.add].id)
  // const selectedItem =
  // query?.add && MENU[query.add as MenuKEY]
  //   ? [{ productId: query.add a, quantity: 1 }]
  //   : [];

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
          menuItems: sanitizedQuery ? [{ productId: sanitizedQuery, quantity: 1 }] : [],

          total: 0,
        },
      };

  const headerString = cookie ? "Edit Order" : "Start Order";

  return (
    <PageTransition>
      {/* <div className="relative space-y-6 flex flex-col items-center p-6 mx-auto my-2 ">
        <div className="absolute inset-0 bg-amber-700" /> */}
      <div
        className="relative z-10 w-full flex flex-col items-center space-y-6 bg-cover"
        style={{
          backgroundImage: "url(/foodImages/didiLogo.png)",
        }}
      >
        <h3 className="text-3xl font-semibold text-white p-1">
          {headerString}
        </h3>
        <OrderForm2 initialState={initialState} />
      </div>
      {/* </div> */}
    </PageTransition>
  );
}
