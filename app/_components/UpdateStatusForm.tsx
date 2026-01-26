//_components/updateStatusForm.tsx
"use client";

import { useState } from "react";
import { StatusType } from "../_models/order";
import { useRouter } from "next/navigation";
import Button from "./ui/Button";
import { LoaderCircle } from "lucide-react";

const statuses: StatusType[] = [
  "PENDING",
  "SENT",
  "CONFIRMED",
  "CANCELLED",
  "READY_PICKUP",
];

export default function UpdateStatusForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isUpdateStatus, setIsUpdateStatus] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    console.log("form-input newStatus:", payload.newStatus);

    const res = await fetch(`/api/admin/orders/update-status/${orderId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      console.log("state error:", data);
      return;
    }

    console.log("status updated!");

    //stop Loader before redirecting
    setLoading(false);
    setIsUpdated(true);
    setIsUpdateStatus(false);
    // router.push(`/admin/orders?status=${data.status}`);
    router.refresh();
  }

  return (
    <div className="rounded-lg p-6 shadow-lg gap-6">
      {!isUpdateStatus && (
        <Button
          className="rounded-lg bg-gray-700 px-2 text-white hover:bg-gray-600 hover:underline active:scale-95 transition"
          onClick={() => setIsUpdateStatus(true)}
        >
          Update status
        </Button>
      )}
      {isUpdateStatus && !isUpdated && (
        <form
          className="w-full max-w-2xl mx-auto space-y-6 p-6 rounded-2xl shadow-xl bg-gray-700 flex flex-col items-center gap-5"
          onSubmit={handleSubmit}
        >
          <label htmlFor="newStatus" className="text-xl">
            Choose New Status below:
          </label>
          <select
            name="newStatus"
            id="status"
            className="border p-2 rounded-lg cursor-pointer"
          >
            {statuses.map((status, idx) => (
              <option key={idx} value={status} className="bg-gray-900">
                {status}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-3 w-full">
            <Button className="w-full text-xl" variant="tertiary" type="submit">
              {loading ? (
                <span className="animate-spin">
                  <LoaderCircle />
                </span>
              ) : (
                "Submit"
              )}
            </Button>
            <Button
              onClick={() => setIsUpdateStatus(false)}
              className="w-full text-center text-lg py-2 rounded-xl border border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-300 active:scale-95 flex items-center justify-center gap-3"
            >
              Close
            </Button>
          </div>
        </form>
      )}
      {isUpdated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl text-center font-semibold mb-4">
              Status Updated🎉
            </h2>
            <button
              onClick={() => {
                setIsUpdated(false);
                setTimeout(() => {
                  router.replace("/admin/orders", { scroll: false });
                }, 300);
              }}
              className="w-full rounded-lg bg-black text-white py-2 cursor-pointer hover:bg-neutral-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
