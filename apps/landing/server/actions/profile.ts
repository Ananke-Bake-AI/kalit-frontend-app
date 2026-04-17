"use server"

import { auth, signOut } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function updateProfile(data: { name?: string }) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Not authenticated" }
  }

  if (data.name !== undefined && data.name.length < 2) {
    return { error: "Name must be at least 2 characters" }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: data.name },
  })

  return { success: true }
}

export async function deleteAccount() {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Not authenticated" }
  }

  // Delete all user data (cascading deletes handle related records)
  await prisma.user.delete({
    where: { id: session.user.id },
  })

  return { success: true }
}
