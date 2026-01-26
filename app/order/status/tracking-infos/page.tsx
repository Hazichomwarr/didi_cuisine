//app/order/status/tracking-infos/page.tsx
import Trackingform from "@/app/_components/Trackingform";
//import Image from "next/image";

export default function TrackingInfoPage() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 bg-[url('/foodImages/didiLogo.png')] bg-cover bg-center">
      <div className="bg-gray-500 rounded-md p-6 w-full max-w-md shadow-lg flex flex-col items-center gap-6">
        {/* RESTO LOGO
        <Image
          src="/foodImages/didiLogo.png"
          alt="Didi's Cuisine logo"
          width={180}
          height={50}
          className="mx-auto object-fit rounded-lg relative z-50"
          loading="eager"
        /> */}
        <h2 className="text-3xl text-gray-100 mb-4">Tracking Infos</h2>
        <Trackingform />
      </div>
    </div>
  );
}
