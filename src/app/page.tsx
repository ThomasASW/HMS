import { redirect } from "next/navigation";
import getUser from "../../lib/get-user";

export default async function Page() {

    const user = await getUser();
    if (!user) {
        redirect("/login")
    } else {
        redirect("/hotels/list")
    }

    return <></>

}