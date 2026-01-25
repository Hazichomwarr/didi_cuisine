//app/_components/trackingInfos.tsx
"use client";

import React, { useState } from "react";
import Button from "./ui/Button";
import { Input } from "./ui/Input";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PhoneInput from "./PhoneInput";

export type TrackingErrorsType = { trackingNumber: string; phone: string };

export default function Trackingform() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<TrackingErrorsType>({
    trackingNumber: "",
    phone: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const res = await fetch("/api/order/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log("post-response:", res);

    if (!res.ok) {
      setLoading(false);

      const data = await res.json();
      setErrors(data.infosErrors);
      console.log("state error:", errors);
      return;
    }

    const data = await res.json();
    console.log("data from client form:", data);
    //stop Loader before redirecting
    setLoading(false);
    router.push(`/order/status/order-status?status=${data.status}`);
  }
  return (
    <form
      className="w-full max-w-2xl mx-auto space-y-6 p-6 rounded-2xl shadow-xl bg-gray-100"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-rows-2 items-start gap-3 p-2 rounded-md">
        <Input
          type="text"
          name="trackingNumber"
          placeholder="Enter Tracking Number"
          //   inputError={errors.trackingNumber}
          required
        />
        <PhoneInput
          defaultValue=""
          //   inputError={errors.phone}
          //   error={Boolean(errors.phone)}
        />
      </div>

      <div className="flex flex-col items-center gap-3 w-full">
        <Button className="w-full text-2xl" variant="tertiary" type="submit">
          {loading ? (
            <span className="animate-spin">
              <LoaderCircle />
            </span>
          ) : (
            "Submit"
          )}
        </Button>
        <Link
          href="/"
          className="w-full text-center text-lg py-2 rounded-xl border border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-300 active:scale-95 flex items-center justify-center gap-3"
        >
          Close
        </Link>
      </div>
    </form>
  );
}
