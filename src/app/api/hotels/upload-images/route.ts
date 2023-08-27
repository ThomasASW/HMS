import { mkdir, stat, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { format } from "date-fns";
import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import AddHotel from "../../../../../models/add-hotel";
import HotelImage from "../../../../../models/hotel-images";

function getFileSplit(filename: string) {
    let index = filename.lastIndexOf(".");
    let fileNameWithoutExtension = filename.substring(0, index);
    let extension = filename.substring(index + 1);
    return [fileNameWithoutExtension, extension];
}

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    console.log(formData);

    const files = formData.getAll("files[]") as Blob[] | null;
    const id = formData.get("hotelId") as string | null;
    if (files == null || files.length == 0) {
        return NextResponse.json(
            { error: "No file found" },
            { status: 400 }
        );
    } else if (id == null) {
        return NextResponse.json(
            { error: "Invalid hotel id" },
            { status: 400 }
        );
    } else {
        try {
            const client = await clientPromise;
            const db = client.db("hms");
            const hotel = await db
                .collection<AddHotel>("hotels")
                .findOne(
                    {
                        _id: new ObjectId(id)
                    }
                )

            if (hotel != null) {
                const relativeUploadDir = "/uploads";
                const uploadDir = join(process.cwd(), "public", relativeUploadDir);

                try {
                    await stat(uploadDir);
                } catch (error: any) {
                    if (error.code === "ENOENT") {
                        await mkdir(uploadDir, { recursive: true })
                    } else {
                        console.log(
                            "Error while trying to create directory when uploading a file\n",
                            error
                        );
                        return NextResponse.json(
                            { error: "Server error" },
                            { status: 500 }
                        )
                    }
                }

                let fileUrls: string[] = [];
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const buffer = Buffer.from(await file.arrayBuffer());

                    try {
                        let newFileName = getFileSplit(file.name);
                        let fileNameWithDate = `${newFileName[0]}-${format(Date.now(), "dd-MM-yyyy-hh-mm-ss")}.${newFileName[1]}`
                        await writeFile(`${uploadDir}/${fileNameWithDate}`, buffer);
                        fileUrls.push(`${relativeUploadDir}/${fileNameWithDate}`);
                    } catch (error) {
                        console.log(
                            "Error uploading file\n",
                            error
                        );
                        return NextResponse.json(
                            { error: "Server error" },
                            { status: 500 }
                        )
                    }
                }
                let images: HotelImage[] = []
                for (let i = 0; i < fileUrls.length; i++) {
                    const fileUrl = fileUrls[i];
                    images.push({
                        imageURL: fileUrl,
                        imageDesc: "",
                        imageType: null,
                        roomNumber: null
                    })
                }
                const updateDoc = {
                    $set: {
                        images: images
                    }
                }
                try {
                    await db
                        .collection("hotels")
                        .updateOne({ _id: hotel._id }, updateDoc);
                } catch (error) {
                    return NextResponse.json(
                        { error: "Server error" },
                        { status: 500 }
                    );
                }
                return NextResponse.json({ fileUrls: fileUrls }, { status: 200 });
            } else {
                return NextResponse.json(
                    { error: "Invalid hotel id" },
                    { status: 400 }
                );
            }
        } catch (error) {
            return NextResponse.json(
                { error: "Server error" },
                { status: 500 }
            );
        }
    }
}