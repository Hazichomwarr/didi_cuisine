//app/_components/PhoneInput.tsx

"use client";

import { useState } from "react";
import { Input } from "./ui/Input";
import { formatPhone } from "../_utils/formConfig";

interface Props {
  defaultValue: string;
  inputError?: string;
  error?: boolean;
}

export default function PhoneInput({ defaultValue, inputError, error }: Props) {
  const [phoneValue, setPhoneValue] = useState<string>(
    formatPhone(defaultValue.substring(2)),
  );
  return (
    <div className="grid grid-cols-[max-content_1fr] ui-input focus:ui-input-focus">
      <span className="text-gray-400 pr-2 border-r mt-1 border-gray-300 mr-2 select-none h-9">
        +1
      </span>
      <Input
        type="tel"
        name="phone"
        placeholder="Phone: 000-000-0000"
        inputError={inputError}
        error={error}
        onChange={(e) => setPhoneValue(formatPhone(e.target.value))}
        value={phoneValue}
        required
      />
    </div>

    // <div className="w-full grid grid-cols-[max-content_1fr] items-center ui-input focus-within:ring-2 focus-within:ring-blue-800">
    //   {/* The Prefix */}
    //   <span className="text-gray-500 pr-2 border-r border-gray-200 mr-2 select-none">
    //     +1
    //   </span>

    //   {/* The Actual Input */}
    //   <Input
    //     type="tel"
    //     name="phone"
    //     placeholder="Phone: 000-000-0000"
    //     /* Remove the border/ring from the Input component itself */
    //     className="border-none focus:ring-0 p-0 outline-none flex-1"
    //     inputError={inputError}
    //     error={error}
    //     onChange={(e) => setPhoneValue(formatPhone(e.target.value))}
    //     value={phoneValue}
    //     required
    //   />
    // </div>
  );
}
