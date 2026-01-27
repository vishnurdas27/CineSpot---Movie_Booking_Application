import { Inngest } from "inngest";
import User from "../models/user";

export const inngest = new Inngest({ id: "cinespot" });

// Function to save user data to database
const syncUserCreation = inggest.createFunction(
    {id: 'sync-user-from-clerk'},
    {event: 'clerk/user.created'},
    async ({event})=>{
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        const userData = {
            _id :id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url
        }
        await User.create(userData)
    }
)


export const functions = [syncUserCreation];
