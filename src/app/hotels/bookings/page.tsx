import { redirect } from "next/navigation";
import getUser from "../../../../lib/get-user";
import BookingsList from "@/app/components/bookings-list";

export default async function Page() {

    const user = await getUser();
    if (!user) {
        redirect("/login")
    }

    return <BookingsList user={user} />

}