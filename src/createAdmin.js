import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://eqiiqmeonihhughhuugm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxaWlxbWVvbmloaHVnaGh1dWdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDAzODg2MiwiZXhwIjoyMDc5NjE0ODYyfQ.GUCuQF-jpKrqNymx-H-nkfJZ-uzbsrkblS-a0FSKvNg" // service role key, secret
);

async function makeAdmin(email) {
  const { data, error } = await supabase.auth.admin.updateUserById(
    (
      await supabase.auth.getUserByEmail(email)
    ).data.id,
    { user_metadata: { role: "admin" } }
  );

  if (error) console.error(error);
  else console.log("User updated:", data);
}

// Example
makeAdmin("fmolontoc@gmail.com");
