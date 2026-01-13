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
    formatPhone(defaultValue.substring(2))
  );
  return (
    <Input
      type="tel"
      name="phone"
      placeholder="Phone number"
      className="ui-input focus:ui-input-focus"
      inputError={inputError}
      error={error}
      onChange={(e) => setPhoneValue(formatPhone(e.target.value))}
      value={phoneValue}
      required
    />
  );
}
