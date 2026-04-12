import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://vvmucctcaaagfxdvzccj.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_m8LhxxVliAONC77JfzKrOg_zA60bxGa";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
