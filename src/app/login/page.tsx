import { redirect } from "next/navigation";
import getUser from "../../../lib/get-user";
import LoginForm from "../components/login-form";

export default async function Page() {

    const user = await getUser();
    if (user !== null) {
        redirect("/hotels")
    }

    return <LoginForm />
}