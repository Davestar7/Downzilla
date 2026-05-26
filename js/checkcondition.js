import {popUp, alert} from '../UI-components/popup.js'
import {secondCondition, isConnected} from './alert.js'
import {loadOnStart} from '../js/createPage.js'
import { iconCheck, routes } from '../UI-components/env/env.js'
import historyPage from "../UI-components/historyData.js"
import {main as renderContent} from "../UI-components/contentFromFeed.js"
import {main as setting} from "../UI-components/setting.js"
import sharedUser from "./interact/privateSharedData.js"

let passloc = window.location
comfirmPage()

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
    const path = checkUrl()
    let stringUrl;
    
    if (path.length > 3) {
        
        passloc = window.location
        path.forEach((i, dex) => {
            if (i !== dex+1) {
                
                stringUrl = i.toLocaleLowerCase().toString();
                console.log(`${path.length} === ${dex+1}`)
                if (path.length === dex+1) {
                    console.log("resieved")
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
    console.log(pathname)
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
        case 'TandC': 
            popUp('TandC', ifReload)
        break
        case 'forgotpassword':
            popUp('forgotpassword', ifReload)
        break
        case 'info':
            setting()
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
    console.log(uri[uri.length-3])
    if (uri[uri.length-3] === "shared") {
        sharedUser()
        return
    }

    if (check === "user") {
        historyPage()
    } else if (check === "RenderFeed") {
        renderContent()
    } else {
        notFoundUi(path)
    }
}

async function backFunction(cancelSomething = null, id= null) {
    history.back()
    comfirmPage()

    if (cancelSomething != null && id != null) {
        const cenn = await fetch(routes.cancelQuery, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({id: id})
        }) 
        const p = await cenn.json()
        alert(p.message, 1000)
    }
}

function notFoundUi(path) {
    const ui = `<b>404 ${path} is not a know path</b><br><a href="/" style="color:blue;">Go to downzilla download page</a>`
    document.getElementById("contentPage").innerHTML = ui
}

export {checkUrl, updateHomeUrl, comfirmPage, passloc, backFunction}