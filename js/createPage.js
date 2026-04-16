import {MainStructure} from '../UI-components/downloadPage.js'
import feedPage from '../UI-components/renderfeed.js'
import userPage from '../UI-components/user.js'
import {footerMain} from '../UI-components/footer.js'
import {footers, iconCheck} from '../UI-components/env/env.js'
import { comfirmPage } from './checkcondition.js'
// import {userData} from './auth/afterauth.js'

function pushUrl(path, title, add=false) {
    var newUrl = path
    if (add === false) {
        if (path != null) {
            if (path != window.location.pathname) {
                history.pushState(null, null, newUrl)
            }
        }
    } else {
        const win = window.location.pathname
        console.log(win)
        newUrl = `${win}/${path}`
        console.log(newUrl)
        history.replaceState(null, null, "")
        history.pushState(null, null, newUrl)
    }
    document.title = title;
    footerMain()
    iconCheck()
}

function changePath(irl, title) {
    history.pushState(null, null, irl)
    document.title = `downzilla - ${title}`
    comfirmPage()
}

function loadOnStart() {
    const currentUrl = window.location
    if (currentUrl.pathname != "/") {
        const splited = currentUrl.pathname.split("/")
        
        if (splited[splited.length-1] == "downloader") {
            MainStructure()
            pushUrl(null, footers[1].title)
        } else if (splited[splited.length-1] == "RenderFeed") {
            feedPage()
            pushUrl(null, footers[0].title)
        } else if (splited[splited.length-1] == "user") {
            userPage()
            pushUrl(null, footers[2].title)
        }
    } else if (currentUrl.pathname == "/") {
        MainStructure()
    }

}

export {pushUrl, loadOnStart, changePath}