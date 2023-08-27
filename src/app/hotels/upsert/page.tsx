import { redirect } from "next/navigation";
import getUser from "../../../../lib/get-user";
import HotelForm from "@/app/components/hotel-form";

export default async function Page() {

    const user = await getUser();
    if (!user) {
        redirect("/login")
    }

    return <HotelForm />
}