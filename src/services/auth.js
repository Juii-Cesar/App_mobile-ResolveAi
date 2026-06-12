import { supabase } from "./supabase";

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log(error);
    return;
  }

}
