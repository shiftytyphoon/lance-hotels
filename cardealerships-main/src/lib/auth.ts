// Auth helpers for getting user and dealership in server components

import { createClient } from "./supabaseServer";

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getDealership() {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();

  // TODO: Query dealership_members to find user's dealership
  // const { data: membership } = await supabase
  //   .from("dealership_members")
  //   .select("dealership_id, dealerships(*)")
  //   .eq("user_id", user.id)
  //   .single();

  return null;
}

export async function requireAuth() {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireDealership() {
  const dealership = await getDealership();
  if (!dealership) {
    throw new Error("No dealership found");
  }
  return dealership;
}
