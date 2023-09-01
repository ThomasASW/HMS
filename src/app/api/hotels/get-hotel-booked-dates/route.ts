import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";

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
        const cursor = await db
            .collection("bookings")
            .find(
                {
                    hotelId: requestBody.id
                },
                {
                    projection: {
                        startDate: 1,
                        endDate: 1
                    }
                }
            );
        let bookingsList = []
        for await (const doc of cursor) {
            bookingsList.push(doc);
        }
        return NextResponse.json(JSON.stringify({ bookings: bookingsList }), { status: 200 });
    } catch (error) {
        console.log("Error fetching hotels", error);
        return NextResponse.json(JSON.stringify(error), { status: 500 });
    }
}