import { Inngest } from "inngest";
import User from "../models/User.js";

export const inngest = new Inngest({ id: "cinespot" });

// Function to save user data to database
const syncUserCreation = Inggest.createFunction(
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

//Function to delete user from database
const syncUserDeletion = Inggest.createFunction(
    {id: 'delete-user-from-clerk'},
    {event: 'clerk/user.deleted'},
    async ({event})=>{
        const {id} = event.data 
        await User.findByIdAndDelete(id)
    }
)

//Function to update user from database
const syncUserUpdation = Inggest.createFunction(
    {id: 'update-user-from-clerk'},
    {event: 'clerk/user.updated'},
    async ({event})=>{
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        const userData = {
            _id :id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url
        }
        await User.findByIdAndUpdate(id, userData)
    }
)

export const functions = [syncUserCreation,
    syncUserDeletion,
    syncUserUpdation];
