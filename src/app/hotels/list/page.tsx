import { redirect } from "next/navigation";
import getUser from "../../../../lib/get-user";
import HotelList from "@/app/components/hotel-list";

export default async function Page() {

    const user = await getUser();
    if (!user) {
        redirect("/login")
    }

    return <HotelList />

}