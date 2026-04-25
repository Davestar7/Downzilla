import { icons, loader, routes } from "../../UI-components/env/env.js";
import { popUp, uiLoader } from "../../UI-components/popup.js";
import { userData } from "../auth/afterauth.js";
import { alert as alerts } from "../../UI-components/popup.js";
import { pushUrl, changePath } from "../createPage.js";
import { comfirmPage } from "../checkcondition.js";

let totalContainablePage = null
let backup = []
async function handleFeedDisplay() {
    const section = document.getElementById("feedCon")
    const dis = `
                <div id="fcon">
                    <div id="renderf">${loader("just a sec...")}</div>
                    <div id="pagenav">1</div>
                </div>
                `
    section.innerHTML = dis

    searchRender()
    choosePage()
    
    function choosePage() {
        const foot = document.getElementById("pagenav")

        foot.innerHTML = `<ul id="pagenumb"></ul>`
        const footer = document.getElementById("pagenumb")

        if (totalContainablePage === null) {
            getContent()
        } else {
            if (typeof totalContainablePage === Number) { 
                const curentPageParam = new URL(window.location.href)
                const curentPage = curentPageParam.searchParams.get("page")
                console.log(`current page: ${curentPage}`)
                let navStr

                for (let i = 0; i < totalContainablePage; i++) {
                    console.log(`each page: ${i}`)

                    if (i+1 === Number(curentPage)) {
                        footer.innerHTML += `
                                            <b>Page ${i+1}</b>
                                            `
                    } else {
                        navStr += `
                                    <li data-page="${i+1}" class="pli">${i+1}<li>
                                    `
                    }
                }
                document.getElementById("pagenumb").innerHTML = navStr
                changeRenderingPageNumber(curentPage)
            }
        }
    }

    function changeRenderingPageNumber(pageNumber) {
        getContent(pageNumber)

        // update the footer the click operation
        const lis = document.querySelectorAll(".pli")
        lis.forEach(e => {
            e.addEventListener("click", (child) => {
                const url = new URL(window.location.href)
                url.searchParams.set("page", child.dataset.page)
                window.history.replaceState({}, "", url.href)
                getContent(Number(child.dataset.page))
            })
        })
    }

    async function getContent(page = 1) {
        if (backup.length === 0) {
            const res = await fetch(routes.getfeed, {
                method: "GET",
                headers: {"Content-Type": "application/json", "page": page},
                credentials: "include",
            })
            const response = await res.json()
            console.log(response)

            if (response.success != true) {
                alerts("failed!!!", 2200)
                updateFeed(response, false)
                return
            }

            const pages = response.totalPage
            totalContainablePage = pages

            backup.push({page: page, data: response})

            updateFeed(response, true)
        } else {
            let returned;
            backup.forEach(e => {
                if (e.page === page) {
                    returned = e
                    return
                }
            })
            updateFeed(returned.data, true)
        }
    }

}

function updateFeed(data, successful) {
    const page = document.getElementById("renderf")
    if (successful === false) {
        page.innerHTML = `<em id="failed">Something went wong please try again</em><br><button id="retry">Reload</button>`

        document.getElementById("retry").addEventListener("click", () => {
            handleFeedDisplay()
        })
        return
    }

    console.log(data)

    const pages = data.totalPage
    const ur = new URL(window.location.href)
    ur.searchParams.set("page", Number(pages))
    window.history.pushState({}, "", ur)

    const foot = document.getElementById("pagenav")
    foot.innerHTML = `<ul id="pagenumb"></ul>`
    const footer = document.getElementById("pagenumb")

    let navStr = ""
    for (let i = 0; i < pages; i++) {
        console.log(`each page: ${i}`)

        if (i+1 === Number(pages)) {
            foot.innerHTML += `
                                <b>Page ${i+1}</b>
                                 `
        } else {
            navStr += `
                        <li data-page="${i+1}" class="pli">${i+1}</li>
                         `
        }
    }
    document.getElementById("pagenumb").innerHTML = navStr
 
    const mainData = data.data
    let innerPage = ""
    let pgtitle;

    mainData.forEach((data) => {
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

        const maxLen = 312
        let disc;
        if (discrip.length < maxLen) {
            disc = discrip
        } else if (discrip.length >= maxLen) {
            disc = `${discrip.slice(0, maxLen)}... ${icons.DROP}`
        }

        console.log(star.length)
        let totalStars = Number(star.length)

        let starButton;

        if (star.includes(userData.userId)) {
            starButton = `<button id="starBtn" class="cstarrer" data-ts="${totalStars}" data-id="${id}" data-pubid="${publisherId}" style="background-color: rgb(139, 214, 139);
                        border: 2px solid green;
                        font-weight: 700;
                        color: black;
                        width: 10%;
                        cursor: pointer;
                        border-radius: 5px;
                "><span id="numberStar">${totalStars}</span>${icons.STARED}</button>`
        } else {
            starButton = `<button id="starBtn" class="starbtn" data-ts="${totalStars}" data-id="${id}" data-pubid="${publisherId}" style="width: 8em;
                        border: 1px solid rgb(42, 90, 42);
                        text-align: center;
                        background-color: white;
                        border-radius: 9px;
                        font-weight: 700;
                        transition: 1s ease;
                "> <span id="numberStar">${totalStars}</span>${icons.STARED}</button>`
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
    page.innerHTML = innerPage

    const detBtn = document.querySelectorAll(".detailbtn")
    detBtn.forEach(e => {
        e.addEventListener("click", (el) => {
            const bt = el.target
            const innerId = bt.dataset.id

            pushUrl(innerId, pgtitle, true)
            comfirmPage()
        })
    })

    const starbtn = document.querySelectorAll(".starbtn")
    starbtn.forEach((e) => {
        // e.removeEventListener("click", starFunction, { once: true })
        e.addEventListener("click", (el) => {
            el.target.style.background = "rgb(139, 214, 139)"
            console.log("star function clicked")
            const cid = el.target.dataset.id
            const uid = el.target.dataset.pubid
            const currentStars = currentStar || el.target.dataset.ts
            console.log(`star id: ${cid} uploaderId: ${uid}`)
            el.target.classList.remove("starbtn")
            el.target.classList.add("cstarrer")
            starContent(cid, uid, el.target, "starbtn", currentStars)
        }, { once: true })
    })

    document?.querySelectorAll(".cstarrer").forEach((e) => {
        // e.removeEventListener("click", unstarFunction, { once: true })
        e.addEventListener("click", (el) => {
            el.target.style.background = "white"
            unstarFunction(el)
        }, { once: true })
    })
}

function searchRender() {
    const btn = document.getElementById("searchrun")
    const input = document.getElementById("sher")

    btn.addEventListener("click", async () => {
        console.log("search feed clicked")
        uiLoader(true, false)
        const text= input.value.toString()
        console.log(`searching values: ${text}`)

        if (text === "") {
            uiLoader(false, true)
            handleFeedDisplay()
            return
        }

        const re = await fetch(routes.searchContent, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({text: text})
        })
        const res = await re.json()
        console.log(res)
        uiLoader(false, true)
        if (res.success != true) {
            alerts("unable to search, something went wong", 5000)
            handleFeedDisplay()
            return
        }

        if (res.data.length === 0) {
            const page = document.getElementById("renderf")
            page.innerHTML = `<em id="failed">Content not found</em>`
            setTimeout(() => {
                handleFeedDisplay()
            }, 6000);
        } else {
            updateFeed(res, true)
        }
    })
}

async function starContent(id, publiserId, btn, oldClass, currentStars) {
    const starnum = document.getElementById("numberStar")
    const n = Number(currentStars)
    console.log(`star number: ${n}`)
    starnum.innerText = n+1
    console.log(`userId: ${userData.userId}`)

    const res = await fetch(routes.star, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({id: id, userId: userData.userId, uploaderId: publiserId})
    })
    const result = await res.json()
    if (result.success != true) {
        alerts(result.message, 2000)
        btn.classList.remove("cstarrer")
        btn.classList.add(oldClass)
        starnum.innerText = currentStars-1
        btn.addEventListener("click", (el) => {
            el.target.style.background = "white"
            console.log("star failed but reclicked")
            starFunction(el)
        }, { once: true })
        return
    }

    document.querySelectorAll(".cstarrer").forEach((e) => {
        e.addEventListener("click", (btns) => {
            // btns.removeEventListener("click", unstarFunction)
            btns.addEventListener("click", (el) => {
                unstarFunction(el, currentStars+1)
            }, {once: true})
        })
    })

}

async function unstarContent(id, publiserId, btn, oldClass, currentStars) {
    const starnum = document.getElementById("numberStar")
    const n = Number(currentStars)
    console.log(n)
    starnum.innerText = n-1

    try {
        const res = await fetch(routes.removeStar, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({id: id, userId: userData.userId, uploaderId: publiserId})
        })
        const result = await res.json()
        if (result.success != true) {
            alerts(result.message, 2000)
            btn.classList.remove(oldClass)
            btn.classList.add("cstarrer")
            starnum.innerText = currentStars+1
            btn.addEventListener("click", (el) => {
                el.target.style.background = "rgb(139, 214, 139)"
                console.log("unstar failed but reclicked")
                unstarFunction(el)
            }, { once: true })
            return
        }

        const starbtn = document.querySelectorAll(`.${oldClass}`)
        starbtn.forEach((e) => {
            // e.removeEventListener("click", starFunction)
            e.addEventListener("click", (el) => {
                starFunction(el, currentStars-1)
            }, {once: true})
        })

    } catch (e) {
        alerts("failed", 2000)
    }
}

function starFunction(el, currentStar = null) {    
    console.log("star function clicked")
    const cid = el.target.dataset.id
    const uid = el.target.dataset.pubid
    const currentStars = currentStar || el.target.dataset.ts
    console.log(`star id: ${cid} uploaderId: ${uid}`)
    el.target.classList.remove("starbtn")
    el.target.classList.add("cstarrer")
    starContent(cid, uid, el.target, "starbtn", currentStars)
}

function unstarFunction(btn, currentStar = null) {
    console.log("star function clicked")
    const cid = btn.target.dataset.id
    const uid = btn.target.dataset.pubid
    const currentStars = currentStar || el.target.dataset.ts
    btn.target.classList.add("starbtn")
    btn.target.classList.remove("cstarrer")
    unstarContent(cid, uid, btn.target, "starbtn", currentStars)
}

export { handleFeedDisplay, starFunction, unstarFunction }