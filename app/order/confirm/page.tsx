//app/order/confirm/page.tsx

import PageTransition from "@/app/_components/ui/PageTransition";

export default function ConfirmPage() {
  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-6 text-center space-y-4">
          <h2 className="text-3xl font-semibold text-green-700">
            Order Confirmed 🎉
          </h2>

          <p className="text-gray-700 text-base leading-relaxed">
            Your order has been sent successfully.
            <br />
            You’ll receive an e-receipt on your phone shortly.
          </p>

          <a
            href="/"
            className="inline-block mt-4 rounded-xl bg-green-700 text-white px-6 py-3 hover:bg-green-800 active:scale-95 transition"
          >
            Close
          </a>
        </div>
      </div>
    </PageTransition>
  );
}
