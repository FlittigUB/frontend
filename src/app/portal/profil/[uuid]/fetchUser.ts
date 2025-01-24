// app/portal/stillinger/[slug]/fetchJob.ts
import { User } from "@/common/types";
import axios from "axios";

/**
 * Fetches job details based on the slug.
 * @returns The user data or null if not found.
 * @param uuid
 */
export async function fetchUser(uuid: string): Promise<User | null> {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${uuid}`);
    if (!res) return null;
    //toast.success((await res.json()).name)
    console.log(res.data);
    return res.data.user;
  } catch {
    console.error('Kunne ikke finne bruker')
    return null;
  }
}
