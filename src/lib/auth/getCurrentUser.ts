import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}