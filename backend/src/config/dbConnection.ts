


// 


import { connect } from "mongoose"



export async function connectDB() {
    if (!process.env.MONGO_URI) {
        throw new Error("Mongo URI is missing")
    }
    try {
        await connect(process.env.MONGO_URI!)

        console.log("MongoDB connected")
    } catch (error) {
        console.log(error)
    }
}