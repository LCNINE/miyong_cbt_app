// lib/supabaseClient.ts
import { Database } from "@/type/database.types";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aqwfljjtpddgqznegtfu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxd2Zsamp0cGRkZ3F6bmVndGZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNTUwNTAxNSwiZXhwIjoyMDQxMDgxMDE1fQ.C-rifI7V5uk1ejO61vmNe4e9xzoEsStPrBrL9cGzh9E";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
