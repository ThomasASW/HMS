import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import AddHotel from "../../../../../models/add-hotel";

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
        const requestBody: AddHotel = await request.json();
        const hotel = await db
            .collection("hotels")
            .insertOne(requestBody);
        console.log(hotel);
        return NextResponse.json(JSON.stringify(hotel), { status: 200 });
    } catch (error) {
        console.log("Error adding user");
        return NextResponse.json(JSON.stringify(error), { status: 500 });
    }
}