import { Inngest } from "inngest";
import connectDB from "../configs/db.js"; // ⚠️ MAKE SURE THIS PATH IS CORRECT to your db connection file
import User from "../models/User.js"; // Ensure this matches your filename casing exactly

// Initialize the client
export const inngest = new Inngest({ id: "cinespot" });

// 1. Create Function (Exported)
export const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        await connectDB(); // <--- CRITICAL: Connect to DB first
        
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url
        };
        await User.create(userData);
    }
);

// 2. Delete Function (Exported)
export const syncUserDeletion = inngest.createFunction(
    { id: 'delete-user-from-clerk' },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        await connectDB();
        
        const { id } = event.data;
        await User.findByIdAndDelete(id);
    }
);

// 3. Update Function (Exported)
export const syncUserUpdation = inngest.createFunction(
    { id: 'update-user-from-clerk' },
    { event: 'clerk/user.updated' },
    async ({ event }) => {
        await connectDB();
        
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url
        };
        await User.findByIdAndUpdate(id, userData);
    }
);

// Export all as an array for the route
export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation
];