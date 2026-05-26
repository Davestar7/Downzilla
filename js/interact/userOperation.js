import { userData } from "../auth/afterauth.js";
import { routes, icons, loader } from "../../UI-components/env/env.js";
import { pushUrl } from "../createPage.js";
import { comfirmPage } from "../checkcondition.js";
import { uploadContent } from "./history.js";
import { alert } from "../../UI-components/popup.js";
import { shouldStar } from "./feedRender.js";

let storedHistory = null

function updateHistory() {
    
    const bod = document.querySelector("#hisy")
    //bod.style.display = "block"
    const userid = userData.userId
    
    if (userid === false) {
        bod.innerText = "please login, No activity found"
        return
    }
    let history;
    
    queryres()
    async function queryres() {
        document.getElementById("hisy").innerHTML = loader("just one sec...")
        
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
                updateHistoryUi(response.message, false)
                return
            }

            storedHistory = response.data
        }
    }

    updateHistoryUi(storedHistory, true)
}

function updateHistoryUi(data, state) {
    const body = document.querySelector("#hisy")

    body.innerHTML = loader("please wait...")
    if (state === false) {
        body.innerHTML = `Something went wong getting activities: ${data}`
        return
    }

    const historys = data || []

    if (!history) {
        const ans = `<b style="text-align: center;">No data found, it seems you have no activity</b>`
        body.innerHTML = ans;
        return
    }

    const contentdata = new Map()

    body.innerHTML = ""
    historys.forEach(e => {
        
        const title = e.title;
        const discription = e.description || ""
        const isPublic = e.isPublic
        const type = e.type
        const id = e._id
        const cloudId = e.cloudinaryId || ""
        let imgurl = e.cloudinaryUrl
        const uri = e.url
        const star = e.stars
        let newDiscrp = "";
        const maxLen = 312
        
        contentdata.set(id, {
            url: uri,
            title: title,
            type: type,
            cloudId: cloudId
        })

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
        template.innerHTML = `<div id="historyCon" title="${title} downzilla", class="${id}">
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
                                        <button class="deletebtn" data-id="${id}" style="padding="2px" title="delete">${icons.DELETE}</button>                               
                                    </div>
                                </div>
                            </div>
                            <div id="hisContTwo">
                                <button data-history="${id}" id="getHisD" class="getHisD" title="view content">${btnopt}</button>
                                <button data-upload="${id}" id="hisUp" class="hisUp" title="upload">${uploadtxt}</button>
                            </div>
                        </div>`
        body.prepend(template.content.firstElementChild)
    });

    document.querySelectorAll(".getHisD").forEach((e) => {
        e.addEventListener("click", (e) => {
            const btn = e.target
            const id = btn.dataset.history
            const dtat = contentdata.get(id)
            document.getElementById("contentPage").innerHTML = loader()
            pushUrl(id, `downzilla-${dtat.title}`, true)
            comfirmPage()
        })
    })

    document.querySelectorAll(".hisUp").forEach((e) => {
        e.addEventListener("click", (e) => {
            const btn = e.target
            const id = btn.dataset.upload
            
            historys.forEach(e => {
                if (e._id === id) {
                    uploadContent(e.title, {url: e.cloudinaryUrl, id: e.cloudinaryId}, e.description, e.url, e.source, e.type, btn)
                }
            })
        })
    })

    document.querySelectorAll(".deletebtn").forEach((e) => {
        e.addEventListener("click", (el) => {
            const id = el.currentTarget.dataset.id
            const data = contentdata.get(id)
            deleteContent(id, data.title, data.url, data.cloudId)
        })
    })
}

let allStarU = []
async function staredContentUi() {
    
    const bod = document.querySelector("#hisy")
    bod.innerHTML = loader("just a sec...")
    const userId = userData.userId

    const res = await fetch(routes.staredContent, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: userId})
    })

    const result = await res.json()
    if (result.success !== true) {
        bod.innerHTML = `<i>Failed, please try again</i>`
        return
    }
    
    const output = result.data
    if (!output) {
        const ans = `<b style="text-align: center;">No data found, it seems you have not saved any activity</b>`
        bod.innerHTML = ans;
        return
    }

    let pgtitle;
    let all = 0
    allStarU = []
    let innerPage = ""

    output.forEach((data) => {
        const title = data.title
        const discrip = data.description || "no discription"
        const imgurl = data.cloudinaryurl
        const id = data._id
        const star = data.stars || []
        const publisher = data.publisername 
        const publisherId = data.publiserId
        const source = data.source
        pgtitle = title

        let image
        if (imgurl === null) {
            image = "/images/large.png"
        } else {
            image = imgurl
        }

        const maxLen = 230
        let disc;
        if (discrip.length < maxLen) {
            disc = discrip
        } else if (discrip.length >= maxLen) {
            disc = `${discrip.slice(0, maxLen)}... ${icons.DROP}`
        }

        let totalStars = Number(star.length)
        allStarU.push(star)

        let starButton;
        all = all + 1

        if (star.includes(userData.userId)) {
            starButton = `<button id="starBtn" class="cstarrer starbtn" data-index="${all}" data-id="${id}" data-pubid="${publisherId}" style="background-color: rgb(139, 214, 139);
                        border: 2px solid green;
                        font-weight: 700;
                        color: gold;
                        width: 10%;
                        cursor: pointer;
                        border-radius: 5px;
                "><span id="numberStar" class="numberStar">${totalStars}</span>${icons.STARED}</button>`
        } else {
            starButton = `<button id="starBtn" class="starbtn" data-index="${all}" data-id="${id}" data-pubid="${publisherId}" style="width: 8em;
                        border: 1px solid rgb(42, 90, 42);
                        text-align: center;
                        background-color: white;
                        border-radius: 9px;
                        font-weight: 700;
                        transition: 1s ease;
                "> <span id="numberStar" class="numberStar">${totalStars}</span>${icons.STARED}</button>`
        }

        const st = `<div id="renderContCon">
                        <div id="renderRT">
                            <div id="rimg">
                                <img src="${image}" title="${title}">
                            </div>
                            <div id="renderdis">
                                <h3>${title}</h3>
                                <span>${disc}</span>
                                <i id="publ"><b>${publisher}</b> <b>${source}</b></i>
                            </div>
                        </div>
                        <div id="renderBtnCon">
                            ${starButton}
                            <button id="detbtn" class="detailbtn" data-id="${id}">View</button>
                        </div>
                    </div>`
        innerPage += st
    })
    bod.innerHTML = innerPage

    const detBtn = document.querySelectorAll(".detailbtn")
    detBtn.forEach(e => {
        e.addEventListener("click", (el) => {
            const bt = el.target
            const innerId = bt.dataset.id

            history.replaceState(null, null, "RenderFeed")
            const win = window.location.pathname
            const newUrl = `${win}/${innerId}`
            history.replaceState(null, null, "")
            history.pushState(null, null, newUrl)
            comfirmPage()
        })
    })

    const starbtn = document.querySelectorAll(".starbtn")
    starbtn.forEach((e) => {
        e.addEventListener("click", (el) => {
            shouldStar(el, false, allStarU, true)
        })
    })

}

async function deleteContent(contentId, title, url, cloudId) {
    try {
        const del = await fetch(routes.deleteHistory, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({userId: userData.userId, id: contentId, title: title, url: url, cloudId: cloudId})
        })
        const deleted = await del.json()

        alert(deleted.message, 3000)
        if(deleted.success === true) {
           storedHistory = null
           document.getElementsByClassName(contentId)[0].style.display = "none"
        }
    } catch (e) {
        alert("error deleting", 3000)
    }
}

export { updateHistory, staredContentUi }