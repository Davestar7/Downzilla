import {footers} from '../UI-components/env/env.js';
import {MainStructure} from '../UI-components/downloadPage.js'
import feedPage from '../UI-components/renderfeed.js'
import userPage from '../UI-components/user.js'
import {pushUrl} from './createPage.js'
import {comfirmPage} from '../js/checkcondition.js'

function done(cc) {
    begin(cc)
}

// strictly for nav operation
function begin(start) {
    var feed = footers[0].url
    var downloader = footers[1].url
    var users = footers[2].url
    const page = document.getElementById("contentPage")

    const feedsp = feed.split('/')
    const downloadsp = downloader.split('/')
    const usersp = users.split('/')

    const feedCk = feedsp[2]
    const downloadCk = downloadsp[2]
    const userCk = usersp[2]
    if (start == true) {
        const navfeed = document.getElementById(feedCk)
        const home = document.getElementById(downloadCk)
        const user = document.getElementById(userCk)
        
        if (navfeed != null) {
            navfeed.addEventListener('click', () => {
                page.innerHTML = `<em>loading...</em>`
                pushUrl(feed, footers[0].title)
                feedPage()
            })
        }

        if (home != null) {
            home.addEventListener('click', () => {
                page.innerHTML = `<em>loading...</em>`
                pushUrl(downloader, footers[1].title)
                MainStructure()

                setTimeout(()=>{
                    let ur = localStorage.getItem("DZDP")
                    console.log(ur)
                    if (ur != null) {
                        document.getElementById('downloadinput').value = ur.toString()
                    }
                }, 1000)
            })
        }

        if (user != null) {
            user.addEventListener('click', () => {
                page.innerHTML = `<em>loading...</em>`
                pushUrl(users, footers[2].title)
                userPage()
            })
        }
        
    }
}

export {done}