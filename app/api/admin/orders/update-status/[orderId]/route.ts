//api/admin/orders/update-status/[orderId]/route.ts
import { prisma } from "@/app/_lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const resolvedParams = await params;
  const orderId = resolvedParams.orderId;

  const formData = await req.json();
  const newStatusToInsert = formData.newStatus;

  //Update Status in DB
  try {
    const update = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatusToInsert },
    });

    return NextResponse.json({ status: update.status });
  } catch (error) {
    console.log("failed to update status", error);
    return NextResponse.json(
      { error: "failed to update order-status" },
      { status: 500 },
    );
  }
}
