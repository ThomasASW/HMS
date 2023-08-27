import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import HotelImage from "../../../../../models/hotel-images";
import AddHotel from "../../../../../models/add-hotel";
import { ObjectId } from "mongodb";

interface MetadataBody {
    metadata: HotelImage[],
    id: string
}

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
        const requestBody: MetadataBody = await request.json();
        const hotel = await db
            .collection<AddHotel>("hotels")
            .findOne(
                {
                    _id: new ObjectId(requestBody.id)
                }
            )
        if (hotel != null) {
            const updateDoc = {
                $set: {
                    images: requestBody.metadata
                }
            }
            await db
                .collection("hotels")
                .updateOne(
                    { _id: hotel._id },
                    updateDoc
                )
            return NextResponse.json({ message: "Success" }, { status: 200 })
        } else {
            return NextResponse.json(JSON.stringify({ error: "Invalid hotel id" }), { status: 400 });
        }
    } catch (error) {
        console.log("Error adding image metadata");
        return NextResponse.json(JSON.stringify(error), { status: 500 });
    }
}