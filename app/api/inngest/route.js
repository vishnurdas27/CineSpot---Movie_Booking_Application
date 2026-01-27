import { serve } from "inngest/next";
import { Inngest } from "inngest";
import connectDB from "@/config/db"; // Check this path!
import User from "@/models/User";    // Check this path!

// 1. Define Inngest Client directly here
const inngest = new Inngest({ id: "cinespot" });

// 2. Define Function directly here
const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        await connectDB();
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        await User.create({
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url
        });
    }
);

// 3. Serve the API
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncUserCreation], // Add other functions here
});