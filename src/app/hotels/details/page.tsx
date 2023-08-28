import { redirect } from "next/navigation";
import getUser from "../../../../lib/get-user";
import RoomList from "@/app/components/room-list";

export default async function Page() {

    const user = await getUser();
    if (!user) {
        redirect("/login")
    }

    return <RoomList user={user} />

}