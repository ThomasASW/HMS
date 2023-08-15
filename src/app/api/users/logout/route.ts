import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request, response: NextResponse) {
    try {
        if (request.method !== "POST") {
            return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
        }
        cookies().delete("token");
        return NextResponse.json({}, { status: 200 });
    } catch (error) {
        console.log("Error logging user out");
        return NextResponse.json(JSON.stringify(error), { status: 500 });
    }
}