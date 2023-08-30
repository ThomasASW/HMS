import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

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
        const requestBody = await request.json();
        const deleteBooking = await db
            .collection("bookings")
            .deleteOne(
                {
                    _id: new ObjectId(requestBody.id)
                }
            );
        console.log(deleteBooking);
        return NextResponse.json(JSON.stringify({ result: deleteBooking }), { status: 200 });
    } catch (error) {
        console.log("Error deleting booking", error);
        return NextResponse.json(JSON.stringify(error), { status: 500 });
    }
}