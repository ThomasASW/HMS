import { redirect } from "next/navigation";
import getUser from "../../../lib/get-user";
import RegisterForm from "../components/register-form";

export default async function Page() {

    const user = await getUser();
    if (user) {
        redirect("/hotels")
    }

    return <RegisterForm />
}