import { redirect } from "next/navigation";
import getUser from "../../../../../lib/get-user";
import HotelBookingsList from "@/app/components/hotel-bookings-list";

export default async function Page() {

    const user = await getUser();
    if (!user) {
        redirect("/login")
    } else {
        const details = JSON.parse(user);
        if (details.role != "admin") {
            redirect("/hotels/list")
        }
    }

    return <HotelBookingsList user={user} />

}