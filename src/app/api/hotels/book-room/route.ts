import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import AddBooking from "../../../../../models/add-booking";

export async function POST(request: Request, response: Response) {
    try {
        if (request.method !== "POST") {
            return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
        }
        if (request.body == null) {
            return NextResponse.json({ error: "Missing request body" }, { status: 400 })
        }
        const client = await clientPromise;
        const db = client.db("hms");
        const requestBody: AddBooking = await request.json();
        const booking = await db
            .collection<AddBooking>("bookings")
            .insertOne(requestBody)
        return NextResponse.json(booking, { status: 200 })
    } catch (error) {
        console.log("Error booking room", error);
        return NextResponse.json(JSON.stringify(error), { status: 500 });
    }
}