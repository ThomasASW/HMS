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
        const projection = { roomCount: { $size: "$rooms" } }
        const roomCount = await db
            .collection("hotels")
            .findOne(
                {
                    _id: new ObjectId(requestBody.id)
                },
                {
                    projection: projection
                }
            )
        console.log(roomCount);
        return NextResponse.json(JSON.stringify(roomCount), { status: 200 });
    } catch (error) {
        console.log("Error fetching room count");
        return NextResponse.json(JSON.stringify(error), { status: 500 });
    }
}