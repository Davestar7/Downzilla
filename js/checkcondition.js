import {popUp} from '../UI-components/popup.js'
import {secondCondition, isConnected} from './alert.js'
import {loadOnStart} from '../js/createPage.js'
import { iconCheck } from '../UI-components/env/env.js'
import historyPage from "../UI-components/historyData.js"

comfirmPage()
let passloc = window.location

function Url() {
    const host = window.location.pathname
    return host
}

function checkUrl() {
    var host = Url()
    const path = host.split("/")
    return path
}

function updateHomeUrl(path) {
    const homePath = path
    history.pushState(null, null, homePath)
    comfirmPage()
}

function comfirmPage() {
    console.log("am called")
    const path = checkUrl()
    let stringUrl;
    if (path.length > 3) {
        passloc = window.location
        path.forEach((i, dex) => {
            if (i.toString >= path[3]) {
                stringUrl = i.toLocaleLowerCase().toString();
                if (path.length == dex+1) {
                    loadOnUrl(stringUrl)
                }
                passloc = window.location;
            }
        })
    }else {
        loadOnStart()
    }
    isConnected()
    navListiner()
    iconCheck()
}

// check pages url
function loadOnUrl(pathname) {
    const ifReload = true;
    switch (pathname) {
        case 'auth':
                secondCondition()
            break;
        case 'login': 
            popUp('login', ifReload)
        break
        case 'signup': 
            popUp('signup', ifReload)
        break
        case 'tandc': 
            popUp('TandC', ifReload)
        break
        case 'forgotpassword':
            popUp('forgotpassword', ifReload)
        break
        default:
            checkIfUrlIsUnknown(pathname)
            break;
    }
}

function navListiner() {
    window.addEventListener("popstate", () => {
        comfirmPage()
    })
}

function checkIfUrlIsUnknown(path) {
    const url = window.location.pathname
    const uri = url.split("/")

    const check = uri[uri.length-2]
    console.log(check)

    if (check === "user") {
        historyPage()
    } else if (check === "renderfeed") {

    } else {

    }
}

function backFunction() {
    history.back()
    comfirmPage()
}

export {checkUrl, updateHomeUrl, comfirmPage, passloc, backFunction}