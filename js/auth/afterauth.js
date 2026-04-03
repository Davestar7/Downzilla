import {islogedIn} from '../checkuserlogin.js';
import {comfirmPage} from '../checkcondition.js'
import {condition, secondCondition} from '../alert.js'
import {routes} from '../../UI-components/env/env.js'
import header from '../../UI-components/header.js'
import { alert } from '../../UI-components/popup.js';

function updateAuth(userd) {

    if (userd.success != true) {
        islogedIn(false)
        condition()
        comfirmPage()
        secondCondition()
        header()
        return
    }
    const userdata = userd.user
    console.log(userd)
    userData.username = userdata.username
    userData.names = userdata.name
    userData.email = userdata.email
    userData.userId = userdata.id
    userData.downloadHistory = userdata.downloadHistory
    islogedIn(true)
    comfirmPage()
    console.log(`user: ${userData.userId}`)
}

async function logout() {
    const logou = await fetch(routes.logout, {
        method: "GET",
        headers: {"content-Type": "application/json"},
       credentials: "include"
    })

    const res = await logou.json()
    console.log(res)
    if (res.success != true) {
        alert('logout failed please try again')
        return
    }

    localStorage.removeItem("DZAT")
    islogedIn(false)
    updateAuth("")
    comfirmPage()
    condition()
    alert("logout successfull")
    window.location.reload()
}

let userData = {
    username: "",
    names: "",
    email: "",
    userId: "",
    downloadHistory: []
}

export {updateAuth, userData, logout}