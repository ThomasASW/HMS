import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "../../../../../lib/mongodb";
import jwt from "jsonwebtoken";

export async function POST(request: Request, response: NextResponse) {
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
        const projection = { _id: 1, email: 1, role: 1 }
        const user = await db
            .collection("users")
            .findOne(
                {
                    email: requestBody.email,
                    password: requestBody.password
                },
                {
                    projection: projection
                }
            );
        console.log("user - login", user);
        if (user != null) {
            const token = jwt.sign({ userId: user?._id, role: user?.role }, "mQ46qpFwfE1BHuqMC+qlm19qBAD9fVPgh28werwe3ASFlAfnKjM=", { expiresIn: "1d" });
            cookies().set("token", token, {
                maxAge: 60 * 60 * 24,
                path: "/"
            });
        }
        return NextResponse.json(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.log("Error fetching user");
        return NextResponse.json(JSON.stringify(error), { status: 500 });
    }
}