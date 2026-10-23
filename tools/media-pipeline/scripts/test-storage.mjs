import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = fs.readFileSync(".env", "utf-8");
const url = env.match(/VITE_SUPABASE_URL="([^"]+)"/)[1];
const key = env.match(/VITE_SUPABASE_PUBLISHABLE_KEY="([^"]+)"/)[1];

const supabase = createClient(url, key);

async function main() {
  const { data, error } = await supabase.storage.from("HOP-films").list();
  if (error) {
    console.error("Storage list error:", error);
  } else {
    console.log("HOP-films bucket files count:", data.length);
    console.log("Files:", data.map((f) => f.name));
  }
}
main();
