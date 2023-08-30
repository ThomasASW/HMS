import { redirect } from "next/navigation";
import getUser from "../../../../../lib/get-user";
import HotelListAdmin from "@/app/components/hotel-list-admin";

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

    return <HotelListAdmin user={user} />

}