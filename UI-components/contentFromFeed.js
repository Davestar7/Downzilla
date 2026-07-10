import {popUp, alert, uiLoader} from "./popup.js"
import { userData } from "../js/auth/afterauth.js"
import header from "./header.js"
import { islogedIn } from "../js/checkuserlogin.js"
import { routes, icons, loader } from "./env/env.js"
import { queryLoadable, cancelListerner } from "../js/operation/download.js"
import { historyRender, share } from "../js/operation/downloadDis.js"
import { changePath, pushUrl } from "../js/createPage.js"
import { backFunction } from "../js/checkcondition.js"
import { shouldStar } from "../js/interact/feedRender.js"
import {footers} from './env/env.js';
import feedPage from './renderfeed.js'

let started = false;

function main() {
    if (started) return
    started = true
    let page = document.getElementById("contentPage")
    const head = header()

    const structure = `
                        <header id="head">${head}</header>
                        <section id="hps">
                            <div id="historyPage">
                                <div id="Hhead">
                                    <button id="backbtnU"><span>${icons.ARROWLEFT}</span></button>
                                    <div id="starrercon"></div>
                                </div>
                                <div id="hisConP">
                                    ${loader("Getting data...")}
                                </div>
                            </div>
                            <div id="allV"></div>
                        </section>
                        `
    page.innerHTML = structure
    const tit = "Shared content on downzilla, download from over 200+ sites on downzilla"
    const metadis = `${tit} - shared on downzilla`
    document.querySelector('meta[name="description"]').setAttribute('content', metadis)

    document.getElementById("backbtnU").addEventListener("click", backFunction, { once: true })
    
    if (islogedIn === false) {
        popUp()
    }

    
    sideRender()
    handleRender()
}

let allList = []

async function handleRender() {
    
    const ele = document.getElementById("hisConP")
    
    try {
        const url = window.location.pathname
        const splitted = url.split("/")
        const id = splitted[splitted.length-1]

        const getData = await fetch(routes.getSingleFeed, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({id: id})
        })
        const data = await getData.json()
        if (data.success != true) {
            alert(`failed: ${data.message}`, 2000)
            ele.innerHTML = `<em>Failed: ${data.message}</em>`
            return
        }

        const irl = data.data.url
        const titl = data.data.title
        const type = data.data.type
        const cid = data.data._id
        const star = data.data.stars || []
        const publisher = data.data.publisername 
        const publisherId = data.data.publiserId
        document.title = `downzilla - ${titl}`
        
        const st = document.getElementById("starrercon")
        
        let totalStars = Number(star.length)
        let starButton;
        allList = []
        allList.push(star)
        if (star.includes(userData.userId)) {
            starButton = `<button id="starBtn" class="cstarrer" data-index="1" data-id="${cid}" data-pubid="${publisherId}" style="background-color: rgb(157, 111, 190);
                        border: 2px solid purple;
                        font-weight: 700;
                        color: gold;
                        width: 10em;
                        cursor: pointer;
                        border-radius: 5px;
                "><span id="numberStar" class="numberStar" style="color: white;">${totalStars}</span>${icons.STARED}</button>`
        } else {
            starButton = `<button id="starBtn" class="starbtn" data-index="1" data-id="${cid}" data-pubid="${publisherId}" style="width: 10em;
                        border: 1px solid rgb(42, 90, 42);
                        text-align: center;
                        background-color: white;
                        border-radius: 9px;
                        font-weight: 700;
                        transition: 1s ease;
                "><span id="numberStar" class="numberStar">${totalStars}</span>${icons.STARED}</button>`
        }

        st.innerHTML = starButton

        const stars = document?.getElementById("starBtn")

        if (stars) {
            stars.addEventListener("click", (e) => {
                console.log("star button clicted")
                shouldStar(e)
            })
        }
        
        // come back to add prerendered content from this data here

        const beginQ = await fetch(routes.startQuery, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({url: irl, type: type})
        })
        const stored = await beginQ.json()
        if (stored.success != true) {
            alert("retry uncompleted action", 4000)
            ele.innerHTML = `<em>Failed: ${data.message}</em>`
            return
        }
        document.getElementById("backbtnU").removeEventListener("click", backFunction)
        document.getElementById("backbtnU").addEventListener("click", () => {
            backFunction(true, stored.data)
        }, { once: true })

        ele.innerHTML = queryLoadable("loading Content...")
        
        const ids = stored.data
        cancelListerner(ids)
        
        let res;
        if (type === "video") {
            const start = await fetch(routes.getDData, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({id: ids})
            })
            res = await start.json()
        } else if (type === "playlist") {
            const state = await fetch(routes.beginPlaylist, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({id: ids})
            })
            res = await state.json()
        }
        started = false
        if (res.success != true) {
            alert(`failed!!!`)
            ele.innerHTML = `<em>Failed:<span id="reterr"> ${res.message}</span></em>`
            return
        }

        historyRender(res, true, type, null, true, id)
        document.getElementById("sharedby").innerText = publisher
        document.getElementById("origin").innerHTML = `<a href="${irl}" style="width: 100%; height: 100%;" target="_blank">View Original</a>`
        document.getElementById("sharefeed").addEventListener("click", () => {
            share("public", {one: cid}, titl)
        })
    } catch (e) {
        alert("failed load Data", 3000)

        ele.innerHTML = `<em>Failed: ${e.message}</em>`
    }
}

async function sideRender() {
    const side = document.getElementById("allV")
    side.innerHTML = loader("fetching...")
    const res = await fetch(routes.getfeed, {
        method: "GET",
        headers: {"Content-Type": "application/json", "page": 1},
        credentials: "include"
    })
    const data = await res.json()

    if (data.success !== true) {
        side.innerHTML = `<i>failed to get data</i>`
        return
    }
    const list = data.data || []
    
    side.innerHTML = ""
    list.forEach(e => {
        
        const title = e.title;
        
        const discription = e.description || "no discription"
        const type = e.type
        let imgurl = e.cloudinaryurl
        const ids = e._id
        const uri = e.url
        const star = e.stars.length
        let newDiscrp = "";
        const maxLen = 187

        if (discription.length < maxLen) {
            newDiscrp = discription
        } else if (discription.length >= maxLen) {
            newDiscrp = `${discription.slice(0, maxLen)}...`
        }

        if (!imgurl) {
            imgurl = "/images/large.png"
        }

        const template = document.createElement("template")

        template.innerHTML = `
                    <div id="sidePan" title="${title}">
                        <div class="sidelisti" id="${ids}" data-newhistory="${ids}" title="${title}">
                            <div id="mdside">
                                <div id="sideimg">
                                    <img src="${imgurl}"></img>
                                </div>
                            </div>
                            <div id="ds">
                                <div id="sidem">
                                    <b>${title}</b>
                                    <p>${newDiscrp}</p>
                                </div>
                                <div id="sidebtn">
                                    <b>${icons.STARED} ${star}</b>
                                    <button>${icons.DELETE}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
        side.prepend(template.content.firstElementChild)
        const link = document.location.pathname
        const idlink = link.split("/")
        const pageId = idlink[idlink.length-1]
        if (ids === pageId) {
            document.getElementById(ids).style.background = "rgba(157, 111, 196, 0.5)"
        }
    })

    const classPoint = document.querySelectorAll(".sidelisti")

    console.log(classPoint.length)
    
    classPoint.forEach(eh => {
        eh.addEventListener("click", (e) => {
            // const clicked = e.currentTarget
            const pointer = e.currentTarget.dataset.newhistory
            const t = e.currentTarget.title

            changePath(pointer, t)
        })
    })

    if (islogedIn() === false) {
        alert("please login/signup")
        setTimeout(() => {
           popUp()
        }, 2000)
    }

    const atemp = document.createElement("template")
    atemp.innerHTML = `<span id="atemp" style="color purple; text-decoration: underline; padding-top: 5vh;">more </span>`;
    side.append(atemp.content.firstElementChild);

    document.getElementById("atemp").addEventListener('click', () => {
                uiLoader(true, false, "please wait..", 1000)
                pushUrl(`${footers[0].url}?page=2`, footers[0].title)
                feedPage()
            })
}

export { main, allList }
