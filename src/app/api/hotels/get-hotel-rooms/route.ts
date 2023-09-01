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
        let bookingList: any[] = []
        if (requestBody.dates[0] > 0 && requestBody.dates[1] > 0) {
            const bookings = await db
                .collection("bookings")
                .find({
                    $and: [{
                        hotelId: requestBody.id,
                        $or: [
                            { startDate: { $gte: requestBody.dates[0] } },
                            { endDate: { $lte: requestBody.dates[1], $gte: requestBody.dates[0] } }
                        ]
                    }]
                },
                    {
                        projection: { roomNumber: 1 }
                    }
                );
            for await (const doc of bookings) {
                bookingList.push(doc.roomNumber);
            }
        }
        const projection = { rooms: 1 }
        const rooms = await db
            .collection("hotels")
            .findOne(
                {
                    "rooms.sleeps": { $gte: requestBody.peopleCount },
                    _id: new ObjectId(requestBody.id)
                },
                {
                    projection: projection
                }
            );
        if (bookingList.length != 0) {
            let roomList = rooms?.rooms.filter((room: any) => !bookingList.includes(room.roomNumber));
            return NextResponse.json(JSON.stringify({ rooms: roomList }), { status: 200 });
        } else {
            if (rooms == null) {
                return NextResponse.json(JSON.stringify({ rooms: [] }), { status: 200 });
            }
            return NextResponse.json(JSON.stringify(rooms), { status: 200 });
        }
    } catch (error) {
        console.log("Error fetching rooms", error);
        return NextResponse.json(JSON.stringify(error), { status: 500 });
    }
}