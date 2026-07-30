// server/src/supabase.ts
const { createClient } = require("@supabase/supabase-js");
const WebSocket = require("ws");

const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    realtime: {
      transport: WebSocket,
    },
  }
);

module.exports = supabase;