import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

interface JwtPayload {
    userId: string,
    role: string
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
                        _id: new ObjectId(data.userId),
                    },
                    {
                        projection: {
                            _id: 1, email: 1, role: 1
                        }
                    }
                );
            if (user !== null) {
                return JSON.stringify(user);
            } else {
                return null
            }
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}