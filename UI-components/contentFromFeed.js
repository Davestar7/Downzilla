import {popUp, alert} from "./popup.js"
import { userData } from "../js/auth/afterauth.js"
import header from "./header.js"
import { islogedIn } from "../js/checkuserlogin.js"
import { routes, icons, loader } from "./env/env.js"
import { queryLoadable } from "../js/operation/download.js"
import { historyRender } from "../js/operation/downloadDis.js"
import { changePath } from "../js/createPage.js"
import { backFunction } from "../js/checkcondition.js"

function main() {
    let page = document.getElementById("contentPage")
    const head = header()

    const structure = `
                        <header id="head">${head}</header>
                        <section id="hps">
                            <div id="historyPage">
                                <div id="Hhead">
                                    <button id="backbtnU"><span>${icons.ARROWLEFT}</span></button>
                                    <button id="starrer"></button>
                                </div>
                                <div id="hisConP">
                                    ${loader("Getting data...")}
                                </div>
                            </div>
                            <div id="allV"></div>
                        </section>
                        `
    page.innerHTML = structure

    document.getElementById("backbtnU").addEventListener("click", () => {
        backFunction()
    })

    if (islogedIn === false) {
        popUp()
    }

    sideRender()
    handleRender()
}

async function handleRender() {
    const ele = document.getElementById("hisConP")
    
    try {
        const url = window.location.pathname
        const splitted = url.split("/")
        const id = splitted[splitted.length-1]
        console.log(`the content id: ${id}`)

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
        const type = data.data.type
        const stares = data.data.stars || 0
        console.log(`content of url ${irl} of type ${type}`)
        const st = document.getElementById("starrer")
        st.innerHTML = `<b>${icons.STARED} ${Number(stares)}</b>`
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

        ele.innerHTML = queryLoadable("loading Content...")

        const ids = stored.data
        
        const start = await fetch(routes.getDData, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({id: ids})
        })
        const res = await start.json()
        if (res.success != true) {
            alert(`failed!! ${e.message}`)
            ele.innerHTML = `<em>Failed: ${data.message}</em>`
            return
        }

        historyRender(res, true, type)
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
    let t;
    side.innerHTML = ""
    list.forEach(e => {
        console.log(e)
        const title = e.title;
        t = title
        const discription = e.description || "no discription"
        const type = e.type
        let imgurl = e.cloudinaryUrl
        const ids = e._id
        const uri = e.url
        const star = e.stars.length
        let newDiscrp = "";
        const maxLen = 88

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
                        <div class="sidelisti" id="${ids}" data-newhistory="${ids}">
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
            document.getElementById(ids).style.background = "rgba(158, 250, 158, 0.507)"
        }
    })

    const classPoint = document.querySelectorAll(".sidelisti")

    console.log(classPoint.length)
    
    classPoint.forEach(eh => {
        eh.addEventListener("click", (e) => {
            const clicked = e.target
            const pointer = clicked.dataset.newhistory
            console.log(`cliced id ${pointer}`)

            changePath(pointer, t)
        })
    })

    if (islogedIn() === false) {
        alert("please login/signup")
        popUp()
    }
}

export default main