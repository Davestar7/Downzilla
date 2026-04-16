import { icons, loader, routes } from "../../UI-components/env/env.js";
import { popUp } from "../../UI-components/popup.js";
import { userData } from "../auth/afterauth.js";
import { alert as alerts } from "../../UI-components/popup.js";
import { pushUrl, changePath } from "../createPage.js";
import { comfirmPage } from "../checkcondition.js";

let totalContainablePage = null
async function handleFeedDisplay() {
    const section = document.getElementById("feedCon")
    const dis = `
                <div id="fcon">
                    <div id="renderf">${loader("just a sec...")}</div>
                    <div id="pagenav">1</div>
                </div>
                `
    section.innerHTML = dis

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

        updateFeed(response, true)
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
        let totalStars = star.length

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
                            <button id="starBtn" class="starbtn" data-id="${id}">${totalStars} ${icons.STARED}</button>
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
}

export { handleFeedDisplay }