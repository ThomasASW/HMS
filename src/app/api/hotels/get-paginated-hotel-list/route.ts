import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import Hotel from "../../../../../models/hotel";
import HotelPage from "../../../../../models/hotel-page";

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
        await db.collection("hotels").createIndex({ name: "text", address: "text" });
        let hotelFilter: any = {};
        const requestBody = await request.json();
        const check = [undefined, '']
        if (!check.includes(requestBody.name) && !check.includes(requestBody.address)) {
            hotelFilter.$text = { $search: `${requestBody.name} ${requestBody.address}`, $caseSensitive: false }
        } else {
            if (!check.includes(requestBody.name)) {
                hotelFilter.$text = { $search: requestBody.name, $caseSensitive: false }
            }
            if (!check.includes(requestBody.address)) {
                hotelFilter.$text = { $search: requestBody.address, $caseSensitive: false }
            }
        }
        if (requestBody.state != undefined) {
            hotelFilter.state = { $eq: requestBody.state }
        }
        if (requestBody.country != undefined) {
            hotelFilter.country = { $eq: requestBody.country }
        }
        const cursor = await db
            .collection<Hotel>("hotels")
            .find(
                hotelFilter,
                {
                    sort: { _id: -1 },
                    skip: ((requestBody.pageNumber - 1) * requestBody.pageSize),
                    limit: requestBody.pageSize
                }
            );
        const total = await db
            .collection<Hotel>("hotels")
            .countDocuments();
        let hotels: Hotel[] = [];
        for await (const doc of cursor) {
            hotels.push(doc);
        }
        let hotelPage: HotelPage = new HotelPage(total, hotels);
        return NextResponse.json(JSON.stringify(hotelPage), { status: 200 });
    } catch (error) {
        console.log("Error fetching hotels");
        return NextResponse.json(JSON.stringify(error), { status: 500 });
    }
}