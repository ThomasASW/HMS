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
        const user = await db
            .collection("users")
            .findOne(
                {
                    _id: new ObjectId(requestBody.userId)
                }
            );
        console.log(user);
        if (user != null && user.role == "admin") {
            const deleteHotel = await db
                .collection("hotels")
                .deleteOne(
                    {
                        _id: new ObjectId(requestBody.hotelId)
                    }
                );
            console.log(deleteHotel);
            return NextResponse.json(JSON.stringify({ result: deleteHotel }), { status: 200 });
        } else {
            return NextResponse.json(JSON.stringify({ result: "Insufficient permission" }), { status: 500 });
        }
    } catch (error) {
        console.log("Error deleting hotel", error);
        return NextResponse.json(JSON.stringify(error), { status: 500 });
    }
}