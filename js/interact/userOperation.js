import { userData } from "../auth/afterauth.js";
import { routes, icons, loader } from "../../UI-components/env/env.js";
import { pushUrl } from "../createPage.js";
import { comfirmPage } from "../checkcondition.js";
import { uploadContent } from "./history.js";

let storedHistory = null
async function updateHistory() {
    console.log(userData)
    const body = document?.getElementById("his")
    console.log(body)
    const userid = userData.userId
    console.log(userid)
    if (userid === false) {
        body.innerHTML = "please login, No activity found"
    }
    let history;
    body.innerHTML = `<div id="loadhiscon">${loader("loading please wait...")}</div>`
    console.log(storedHistory)
    
    if (storedHistory) {
        history = storedHistory   
    } else {
        const res = await fetch(routes.getHistory, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({id: userid})
        })
        const response = await res.json()
        if (response.success != true) {
            console.log(`failed message: ${response.message}`)
            updateHistoryUi(response.message, false)
            return
        }

        storedHistory = response.data
    }

    updateHistoryUi(storedHistory, true)
}

function updateHistoryUi(data, state) {
    const body = document?.getElementById("his")
    body.innerHTML = loader("please wait...")
    if (state === false) {
        body.innerHTML = `Something went wong getting activities: ${data}`
        return
    }

    console.log(data)
    const historys = data || []

    body.innerHTML = ""
    let t
    historys.forEach(e => {
        console.log(e)
        const title = e.title;
        t = title
        const discription = e.description || ""
        const isPublic = e.isPublic
        const type = e.type
        const id = e._id
        console.log(title + " "+ id)
        let imgurl = e.cloudinaryUrl
        const uri = e.url
        const star = e.stars
        let newDiscrp = "";
        const maxLen = 312
        console.log(`text lenght: ${discription.length}`)

        if (discription.length < maxLen) {
            newDiscrp = discription
        } else if (discription.length >= maxLen) {
            newDiscrp = `${discription.slice(0, maxLen)}...`
        }

        let btnopt
        if (type == "playlist") {
            btnopt = "view playlist"
        } else {
            btnopt = "Download Details"
        }

        let uploadtxt
        if (isPublic == true) {
            uploadtxt = 'Uploaded'
        } else {
            uploadtxt = "upload"
        }

        if (!imgurl) {
            imgurl = "/images/large.png"
        }

        const template = document.createElement("template")
        template.innerHTML = `<div id="historyCon">
                            <div id="hisConOne">
                                <div id="hisimg">
                                    <img src="${imgurl}" id="himg"></img>
                                </div>
                                <div id="mdata">
                                    <div id="metadataSec">
                                        <h3>${title}</h3>
                                        <p>${newDiscrp}</p>
                                        <p id="secP">${type}</p>
                                    </div>
                                    <div id="starsSec">
                                        <p>Stars: ${icons.STARED} ${star}</p>
                                        <button>${icons.DELETE}</button>                               
                                    </div>
                                </div>
                            </div>
                            <div id="hisContTwo">
                                <button data-history="${id}" id="getHisD" class="getHisD">${btnopt}</button>
                                <button data-upload="${id}" id="hisUp" class="hisUp">${uploadtxt}</button>
                            </div>
                        </div>`
        body.prepend(template.content.firstElementChild)
    });

    document.querySelectorAll(".getHisD").forEach((e) => {
        e.addEventListener("click", (e) => {
            const btn = e.target
            const id = btn.dataset.history
            console.log(`btn id ${id}`)
            document.getElementById("contentPage").innerHTML = loader()
            pushUrl(id, `downzilla-${t}`, true)
            comfirmPage()
        })
    })

    document.querySelectorAll(".hisUp").forEach((e) => {
        e.addEventListener("click", (e) => {
            const btn = e.target
            const id = btn.dataset.upload
            console.log(`btn id ${id}`)

            historys.forEach(e => {
                if (e._id === id) {
                    uploadContent(e.title, {url: e.cloudinaryUrl, id: e.cloudinaryId}, e.description, e.url, e.source, e.type, btn)
                }
            })
        })
    })
}

export { updateHistory }