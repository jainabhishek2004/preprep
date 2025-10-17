// src/app/api/syncUser/route.ts
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST() {
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.fullName,
      },
    });
  }

  return new Response("User synced", { status: 200 });
}
