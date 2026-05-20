import { userData } from "../auth/afterauth.js";
import historyPage from "../../UI-components/historyData.js"

function main() {
    const url = window.location.pathname
    const plist = url.split("/")
    const user_id = plist[plist.length-2]
    const history_id = plist[plist.length-1]

    historyPage(user_id, history_id)
}

export default main