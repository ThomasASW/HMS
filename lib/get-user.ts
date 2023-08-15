import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import clientPromise from "./mongodb";

interface JwtPayload {
    userId: string
}

export default async function getUser() {
    const token = cookies().get("token");

    try {
        if (token !== undefined) {
            const data = jwt.verify(token?.value, "mQ46qpFwfE1BHuqMC+qlm19qBAD9fVPgh28werwe3ASFlAfnKjM=") as JwtPayload;
            const client = await clientPromise;
            const db = client.db("hms");
            const user = await db
                .collection("users")
                .findOne(
                    {
                        email: data.userId,
                    }
                );
            return JSON.stringify(user);
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}