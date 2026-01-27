import { serve } from "inngest/next";

// ⚠️ IMPORTANT: Note the path points to your 'server' folder
import { inngest, functions } from "../../../server/inggest/index.js"; 

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
});