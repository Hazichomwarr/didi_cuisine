//_components/OrderForm.tsx

"use client";

import { useActionState } from "react";
import { submitOrder } from "../order/action";
import { MENU } from "../_menuConfig/menu";
import MenuItem from "./MenuItem";
import Button from "./ui/Button";
import { Input } from "./ui/Input";
import { InitialStateType } from "../order/page";
import PhoneInput from "./PhoneInput";
import { MenuItemType, MenuKEY } from "../_models/order";

type Props = { initialState: InitialStateType };

export default function OrderForm({ initialState }: Props) {
  const [state, action] = useActionState(submitOrder, initialState);

  const { errors, values } = state;
  const MenuKeys = Object.keys(MENU) as MenuKEY[];

  return (
    <form
      action={action}
      className="w-full max-w-2xl mx-auto space-y-6 p-6 rounded-2xl shadow-xl bg-white"
    >
      <div className="w-full bg-gray-50 rounded-xl p-4 space-y-3">
        {/* Name + Phone Number */}
        <div className="grid grid-rows-2 items-start gap-3 p-2 border rounded-md border-gray-300">
          <Input
            type="text"
            name="name"
            defaultValue={values.userInfos.name}
            placeholder="Enter your Name"
            className="ui-input focus:ui-input-focus"
            inputError={errors.name}
            error={Boolean(errors.name)}
            required
          />
          <PhoneInput
            defaultValue={values.userInfos.phone}
            inputError={errors.phone}
            error={Boolean(errors.phone)}
          />
        </div>

        {/* MENU ITEMS */}
        <div
          className={`flex flex-col items-start gap-2 border p-2 rounded-md border-gray-300 ${
            Boolean(errors.menuItems) && "border-red-800"
          }`}
        >
          <h3 className="text-center mb-4 text-2xl text-gray-800">
            Select dishes
          </h3>
          {MenuKeys.map((key) => {
            const { id, label, price } = MENU[key] as MenuItemType;
            return (
              <MenuItem
                key={id}
                item={id}
                label={label}
                price={price}
                defaultQty={
                  values.menuItems.find((i) => i.productId === id)?.quantity ??
                  0
                }
              />
            );
          })}
          {errors.menuItems && (
            <p className="text-red-600">{errors.menuItems}</p>
          )}
        </div>

        {/* Delivery Option */}
        <div className="flex flex-col items-start gap-2 border p-2 rounded-md border-gray-300">
          <h3 className="text-center mb-4 text-2xl text-gray-800">
            Delivery Options
          </h3>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="deliveryOption"
              value="pickup"
              defaultChecked={values.userInfos.deliveryOption === "pickup"}
            />
            Pickup
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="deliveryOption"
              value="delivery"
              defaultChecked={values.userInfos.deliveryOption === "delivery"}
            />
            Delivery
          </label>
          <div>
            <Input
              type="text"
              name="address"
              defaultValue={values.userInfos.address}
              placeholder="Enter Delivery Address.."
              className="ui-input focus:ui-input-focus"
              inputError={errors.address}
              error={Boolean(errors.address)}
            />
          </div>
        </div>

        <div className="text-2xl text-gray-800">
          Special instructions or notes ? (optional)
        </div>
        <textarea
          name="notes"
          defaultValue={values.userInfos.notes}
          placeholder="Any special Instructions or food notes here..."
          rows={4}
          cols={24}
          className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        ></textarea>

        <div className="flex flex-col items-center gap-2 w-full">
          <Button className="w-full" variant="tertiary" type="submit">
            Submit Order
          </Button>
          <a
            href="/"
            className="w-full text-center py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 active:scale-95"
          >
            Cancel
          </a>
        </div>
      </div>
    </form>
  );
}
