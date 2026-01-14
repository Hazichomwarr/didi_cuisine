//app/_components/SendOrderForm.tsx
"use client";

import React, { useState } from "react";
import Button from "./ui/Button";
import { useRouter } from "next/navigation";

export default function SendOrderForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/order/review/submit", { method: "POST" });
      if (!res.ok) {
        setLoading(false);
        router.push("/order/review");
        return;
      }
      router.push("/order/confirm");
    } catch {
      setLoading(false);
      router.push("/order/review");
    }
  }
  return (
    <form onSubmit={handleSubmit} noValidate className="flex-1">
      <Button
        className="w-full bg-green-700 hover:bg-green-800 text-white"
        type="submit"
        disabled={loading}
      >
        {loading ? "sending..." : "Send Order"}
      </Button>
    </form>
  );
}
