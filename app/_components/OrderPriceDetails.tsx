//app/_components/OrderPriceDetails.tsx
"use client";

type Props = {
  delivery: boolean;
  total: number;
};

export default function OrderPriceDetails({ delivery, total }: Props) {
  return (
    <div className="p-2 grid grid-cols-2 gap-2">
      <p>Items total:</p>
      <span>${total}</span>
      {delivery && (
        <>
          <p>Delivery fees: </p> <span>+ $5</span>
        </>
      )}
      <p>Taxes:</p> <span> + $0.00</span>
      <p className="mt-2 font-bold">Net To Pay: </p>
      <span className="font-bold">${delivery ? total + 5 : total}</span>
    </div>
  );
}
