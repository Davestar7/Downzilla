import { userData } from "../js/auth/afterauth.js";
import { icons, loader, routes } from "./env/env.js"
import header from "./header.js";
import { queryLoadable, cancelListerner } from "../js/operation/download.js";
import { historyRender } from "../js/operation/downloadDis.js";
import { alert, popUp } from "./popup.js";
import { backFunction } from "../js/checkcondition.js";
import { islogedIn } from "../js/checkuserlogin.js";
import { changePath } from "../js/createPage.js";
import { uploadContent } from "../js/interact/history.js";

function main() {
    console.log("history page called")
    let page = document.getElementById("contentPage")
    const head = header()

    const structure = `
                        <header id="head">${head}</header>
                        <section id="hps">
                            <div id="historyPage">
                                <div id="Hhead">
                                    <button id="backbtnU"><span>${icons.ARROWLEFT}</span></button>
                                </div>
                                <div id="hisConP">
                                    ${loader("Getting data...")}
                                </div>
                            </div>
                            <div id="allV"></div>
                        </section>
                        `
    page.innerHTML = structure
    updateUiData()

    document.getElementById("backbtnU").addEventListener("click", () => {
        backFunction()
    })
}

async function updateUiData() {
    if (islogedIn() === undefined) {
        setTimeout(() => {
            updateUiData()
        }, 3000);
    } else if (islogedIn() === false) {
        alert("You are not Logged in", 8000)
        document.getElementById("hisConP").innerHTML = "this Artivity is not found \n Not logged-in!"
        popUp()
    } else if (islogedIn() === true) {
        const link = document.location.pathname
        const idlink = link.split("/")
        const id = idlink[idlink.length-1]
        const userId = userData.userId
        historyPageAsideUi(userId)
        
        const history = await fetch(routes.getSingleHistory, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({Hid: id, id: userId})
        })
        const datas = await history.json()
        console.log(datas)
        if (datas.success != true) {
            alert("failed to get Data", 3000)
            document.getElementById("hisConP").innerHTML = `failed!!! \n ${data.message}`
            return
        }
        const url = datas.data.url
        const isPublic = datas.data.isPublic
        const type = datas.data.type
        console.log(`is this history public? ${isPublic}`)

        const addToMappable = await fetch(routes.startQuery, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({url: url})
        })
        const idData = await addToMappable.json()
        if (idData.success != true) {
            alert("failed to get this activity")
            document.getElementById("hisConP").innerHTML = `failed!!! \n ${data.message}`
            return
        }

        const load = document.getElementById("hisConP")
        load.innerHTML = queryLoadable("getting Data...")
        const ids = idData.data
        cancelListerner(ids)
        updateData(ids, isPublic, type)
    }
}

async function updateData(id, isPublic, type) {
    console.log(`query id ${id}`)

    const res = await fetch(routes.getDData, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({id: id})
    })
    const data = await res.json()
    console.log(data) 
    if (data.success !== true) {
        alert("something went wong get Data", 5000)
        document.getElementById("hisConP").innerHTML = `failed!!! \n ${data.message}`
        return
    }

    historyRender(data, isPublic, type)
}

async function historyPageAsideUi(id) {
    const side = document.getElementById("allV")
    side.innerHTML = loader("fetching...")
    const res = await fetch(routes.getHistory, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({id: id})
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
        const discription = e.description || ""
        const isPublic = e.isPublic
        const type = e.type
        let imgurl = e.cloudinaryUrl
        const ids = e._id
        const uri = e.url
        const star = e.stars
        let newDiscrp = "";
        const maxLen = 88
        console.log(`text lenght for list: ${discription.length}`)

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

    const classPoint = document.querySelectorAll(".sidelisti")[0]
    
    classPoint.forEach((e) => {
        e.addEventListener("click", (e) => {
            const clicked = e.target
            const pointer = clicked.dataset.newhistory
            console.log(`cliced id ${pointer}`)

            changePath(pointer, t)
        })
    })
}

export default main