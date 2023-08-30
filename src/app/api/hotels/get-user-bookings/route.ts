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
        const cursor = await db
            .collection("bookings")
            .find(
                {
                    user: requestBody.id
                }
            );
        let bookingsList = []
        for await (const doc of cursor) {
            bookingsList.push(doc);
        }
        if (bookingsList.length != 0) {
            let hotelList = []
            for (let i = 0; i < bookingsList.length; i++) {
                const booking = bookingsList[i];
                const hotel = await db
                    .collection("hotels")
                    .findOne(
                        {
                            _id: new ObjectId(booking.hotelId)
                        }
                    );
                if (hotel != null) {
                    hotelList.push(hotel);
                }
            }
            return NextResponse.json(JSON.stringify({ bookings: bookingsList, hotels: hotelList }), { status: 200 });
        } else {
            return NextResponse.json(JSON.stringify({ hotels: [] }), { status: 200 });
        }
    } catch (error) {
        console.log("Error fetching hotels", error);
        return NextResponse.json(JSON.stringify(error), { status: 500 });
    }
}