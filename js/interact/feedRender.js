import { icons, loader, routes } from "../../UI-components/env/env.js";
import { popUp, uiLoader } from "../../UI-components/popup.js";
import { userData } from "../auth/afterauth.js";
import { alert as alerts } from "../../UI-components/popup.js";
import { pushUrl, changePath } from "../createPage.js";
import { comfirmPage } from "../checkcondition.js";
import { allList } from "../../UI-components/contentFromFeed.js";

let totalContainablePage = null
let backup = []
let already = false
async function handleFeedDisplay(newPage = null) {
    if (newPage != null) {
        changeRenderingPageNumber(newPage)
        return
    }
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
    infoWarn()
    
    function choosePage() {
        const foot = document.getElementById("pagenav")

        foot.innerHTML = `<ul id="pagenumb"></ul>`
        const footer = document.getElementById("pagenumb")
        footer.innerHTML = `<div id="rnavdiv"></div>`
        if (totalContainablePage === null) {
            getContent()
        } else {
            if (totalContainablePage) { 
                const curentPageParam = new URL(window.location.href)
                const curentPage = curentPageParam.searchParams.get("page")
                
                let navStr

                for (let i = 1; i <= totalContainablePage; i++) {

                    if (i === Number(curentPage)) {
                        footer.innerHTML += `
                                            <b>Page ${i}</b>
                                            `
                    } else {
                        navStr += `
                                    <span id="li" data-page="${i}" class="pli">${i}<span>
                                    `
                    }
                }
                document.getElementById("rnavdiv").innerHTML = navStr
                changeRenderingPageNumber(curentPage)
            }
        }
    }

    async function changeRenderingPageNumber(pageNumber) {
        await getContent(pageNumber)

        // update the footer the click operation
        const lis = document.querySelectorAll(".pli")
        lis.forEach(e => {
            e.addEventListener("click", (child) => {
                const url = new URL(window.location.href)
                url.searchParams.set("page", child.target.dataset.page)
                window.history.replaceState({}, "", url.href)
                getContent(Number(child.target.dataset.page))
            })
        })
    }

    async function getContent(page = 1) {
        uiLoader(true, false, "getting data...")
        
        if (backup.length == 0) {
            const res = await fetch(routes.getfeed, {
                method: "GET",
                headers: {"Content-Type": "application/json", "page": page},
                credentials: "include",
            })
            const response = await res.json()
            
            uiLoader(false, true)
            if (response.success != true) {
                alerts("failed!!!", 2200)
                updateFeed(response, false)
                return
            }

            const pages = response.totalPage
            totalContainablePage = Number(pages)

            backup.push({page: page, data: response})

            updateFeed(response, true)
        } else {
            let returned = null;
            backup.forEach(e => {
                if (e.currentPage === page) {
                    returned = e
                    return
                }
            })
            if (returned === null) {
                backup = [];
                changeRenderingPageNumber(page)
                return
            }
            updateFeed(returned.data, true)
        }
    }

}

let allStars = []

function updateFeed(data, successful) {
    const page = document.getElementById("renderf")
    if (successful === false) {
        page.innerHTML = `<em id="failed">Something went wong please try again</em><br><button id="retry">Reload</button>`

        document.getElementById("retry").addEventListener("click", () => {
            handleFeedDisplay()
        })
        return
    }

    const pages = data.totalPage
    const current = data.currentPage
    const ur = new URL(window.location.href)
    ur.searchParams.set("page", Number(current))
    window.history.pushState({}, "", ur)

    const foot = document.getElementById("pagenav")
    foot.innerHTML = `<ul id="pagenumb"></ul>`
    const footer = document.getElementById("pagenumb")
    footer.innerHTML = `<div id="rnavdiv"></div>`
    let navStr = ""
    for (let i = 1; i <= pages; i++) {
        
        if (i === Number(current)) {
            foot.innerHTML += `
                                <b>Page ${i}</b>
                                 `
        } else {
            navStr += `
                        <span id="li" data-page="${i}" class="pli">${i}</span>
                         `
        }
    }
    document.getElementById("rnavdiv").innerHTML = navStr
 
    const mainData = data.data
    let innerPage = ""

    let all = 0
    allStars = []

    mainData.forEach((data) => {
        const title = data.title
        const discrip = data.description || "no discription"
        const imgurl = data.cloudinaryurl
        const id = data._id
        const star = data.stars || []
        const publisher = data.publisername 
        const publisherId = data.publiserId
        const source = data.source

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

        let totalStars = Number(star.length)
        allStars.push(star)

        let starButton;
        all = all + 1

        if (star.includes(userData.userId)) {
            starButton = `<button id="starBtn" class="cstarrer starbtn" data-index="${all}" data-id="${id}" data-pubid="${publisherId}" style="background-color: rgb(94, 59, 111);
                        border: 2px solid rgb(94, 59, 128);
                        font-weight: 700;
                        color: gold;
                        width: 10%;
                        cursor: pointer;
                        border-radius: 5px;
                "><span id="numberStar" class="numberStar">${totalStars}</span>${icons.STARED}</button>`
        } else {
            starButton = `<button id="starBtn" class="starbtn" data-index="${all}" data-id="${id}" data-pubid="${publisherId}" style="width: 8em;
                        border: 1px solid rgb(94, 59, 128);
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
                            <button id="detbtn" class="detailbtn" data-id="${id}" title="${title}">View</button>
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
            let pgtitle = bt.title
            pushUrl(innerId, pgtitle, true)
            comfirmPage()
        })
    })

    const starbtn = document.querySelectorAll(".starbtn")
    starbtn.forEach((e) => {
        e.addEventListener("click", async (el) => {
            shouldStar(el)
        })
    })

    const lis = document?.querySelectorAll(".pli")
    lis.forEach(e => {
        e.addEventListener("click", (child) => {
            const url = new URL(window.location.href)
            url.searchParams.set("page", child.target.dataset.page)
            window.history.replaceState({}, "", url.href)
            handleFeedDisplay(Number(child.target.dataset.page))
            
        })
    }, {once: true})

}

function searchRender() {
    const btn = document.getElementById("searchrun")
    const input = document.getElementById("sher")

    btn.addEventListener("click", async () => {
        
        uiLoader(true, false)
        const text= input.value.toString()
        
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

async function shouldStar(el, which = false, slist = null, islist= false) {
    
    if (which === true) {
        allStars = allList 
    }
    if (islist === true) {
        allStars = slist
    }
    
    const index = Number(el.currentTarget.dataset.index)
    const specify = allStars[index-1]
    const id = userData.userId
    
    if (specify.includes(id)) {
        allStars[index-1] = allStars[index-1].filter(i => i !== id)
        document.getElementsByClassName("numberStar")[index-1].innerText = specify.length - 1
        const cid = el.currentTarget.dataset.id
        const uid = el.currentTarget.dataset.pubid
        
        const res = await fetch(routes.removeStar, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({id: cid, userId: userData.userId, uploaderId: uid})
        })
        const result = await res.json()
        
        if (result.success != true) {
            alerts(result.message, 2000)
            document.getElementsByClassName("numberStar")[index-1].innerText = specify.length + 1
            // document.getElementById("numberStar").innerText = list.length + 1
            // el.target.style.background = "rgb(139, 214, 139)"
            // el.target.style.color = "gold"
            allStars[index-1].splice(0, 0, id)
            return
        }
        el.currentTarget.style.background = "white"
        el.currentTarget.style.color = "black"
        document.getElementsByClassName("numberStar")[index-1].style.color = "black"
    } else if (!specify.includes(id)) {
        allStars[index-1].splice(0, 0, id)
        document.getElementsByClassName("numberStar")[index-1].innerText = (specify.length-1) + 1
        const cid = el.currentTarget.dataset.id
        const uid = el.currentTarget.dataset.pubid
        const res = await fetch(routes.star, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({id: cid, userId: userData.userId, uploaderId: uid})
        })
        const result = await res.json()
        if (result.success != true) {
            alerts(result.message, 2000)
            document.getElementsByClassName("numberStar")[index-1].innerText = specify.length - 1
            // document.getElementById("numberStar").innerText = list.length - 1
            // el.target.style.color = "black"
            // el.target.style.background = "white"
            allStars[index-1] = allStars[index-1].filter(i => i !== id)
            return
        }
        
        el.currentTarget.style.background = "rgb(94, 59, 128)"
        el.currentTarget.style.color = "gold"
        // document.getElementById("numberStar").innerText = specify.length + 1
        document.getElementsByClassName("numberStar")[index-1].style.color = "black"
    } 
}

function infoWarn() {
    setTimeout(() => {
        if (already === false) {
            already = true
            popUp("feedinfo")
        }
    }, 4000);
}

export { handleFeedDisplay, shouldStar }
