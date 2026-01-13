//app/order/confirm/@modal/(.)confirm/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function ConfirmModal() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Order Confirmed 🎉</h2>

        <p className="mb-6">
          Thanks for your order! We’ll contact you shortly.
        </p>

        <button
          onClick={() => router.back()}
          className="w-full rounded-lg bg-black text-white py-2"
        >
          Close
        </button>
      </div>
    </div>
  );
}
