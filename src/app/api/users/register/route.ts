import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import AddUser from "../../../../../models/add-user";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

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
        const requestBody: AddUser = await request.json();
        const userExist = await db
            .collection("hms")
            .find(
                {
                    email: requestBody.email
                }
            );
        console.log(userExist);
        if (userExist) {
            console.log("Email already in use");
            return NextResponse.json({}, { status: 422 });
        }
        const user = await db
            .collection("users")
            .insertOne(requestBody);
        console.log(user);
        const token = jwt.sign({ userId: user?.insertedId }, "mQ46qpFwfE1BHuqMC+qlm19qBAD9fVPgh28werwe3ASFlAfnKjM=", { expiresIn: "1d" });
        cookies().set("token", token, {
            maxAge: 60 * 60 * 24,
            path: "/"
        });
        return NextResponse.json(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.log("Error adding user");
        return NextResponse.json(JSON.stringify(error), { status: 500 });
    }
}