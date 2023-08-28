import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";

export async function POST(request: Request, response: Response) {
    try {
        if (request.method !== "POST") {
            return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
        }
        const client = await clientPromise;
        const db = client.db("hms");
        const countries = await db
            .collection("hotels")
            .distinct("country");
        return NextResponse.json(JSON.stringify(countries), { status: 200 });
    } catch (error) {
        console.log("Error fetching hotels");
        return NextResponse.json(JSON.stringify(error), { status: 500 });
    }
}