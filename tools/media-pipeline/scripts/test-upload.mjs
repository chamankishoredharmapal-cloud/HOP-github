import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = fs.readFileSync(".env", "utf-8");
const url = env.match(/VITE_SUPABASE_URL="([^"]+)"/)[1];
const key = env.match(/VITE_SUPABASE_PUBLISHABLE_KEY="([^"]+)"/)[1];

const supabase = createClient(url, key);

async function testUpload() {
  const testBuffer = Buffer.from("test-hop-video-pipeline");
  const { data, error } = await supabase.storage.from("HOP-films").upload("test-ping.txt", testBuffer, {
    upsert: true,
    cacheControl: "31536000",
  });
  if (error) {
    console.error("Upload error:", error);
  } else {
    console.log("Upload successful:", data);
    // clean up test file
    await supabase.storage.from("HOP-films").remove(["test-ping.txt"]);
    console.log("Test ping removed successfully.");
  }
}
testUpload();
