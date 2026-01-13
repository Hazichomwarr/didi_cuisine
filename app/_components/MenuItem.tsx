//_components/MenuItem.tsx
"use client";

import { DollarSign, MinusCircle, PlusCircle } from "lucide-react";
import Button from "./ui/Button";
import { useState } from "react";

interface Props {
  item: string;
  label: string;
  price: number;
  defaultQty: number;
}

export default function MenuItem({ item, label, price, defaultQty }: Props) {
  const [numSelected, setNumSelected] = useState<number>(defaultQty);

  function handleMinus() {
    if (numSelected === 0) setNumSelected(0);
    setNumSelected((prev) => prev - 1);
  }

  return (
    <div className="w-full grid grid-cols-3 mb-3 items-center border-b border-gray-300 p-2">
      <label htmlFor={item} className="flex flex-col md:col-span-2">
        {label}
        <span className="flex items-center">
          <DollarSign size={15} />
          {price}
        </span>
      </label>
      <div className="flex gap-2 items-center">
        <input
          type="hidden"
          name={`items[${item}]`}
          id={item}
          value={`${numSelected}`}
        />
        <span className="mr-2 text-xl">
          {numSelected >= 1 ? numSelected : 0}
        </span>
        {numSelected >= 1 && (
          <Button variant="secondary" type="button" onClick={handleMinus}>
            <MinusCircle />
          </Button>
        )}
        <Button
          variant="secondary"
          className="flex gap-1"
          type="button"
          onClick={() => setNumSelected((prev) => prev + 1)}
        >
          <span>Add</span>
          <PlusCircle />
        </Button>
      </div>
    </div>
  );
}
