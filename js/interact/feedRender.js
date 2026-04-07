import { icons, loader, routes } from "../../UI-components/env/env.js";
import { popUp } from "../../UI-components/popup.js";
import { userData } from "../auth/afterauth.js";

let totalContainablePage = null
async function handleFeedDisplay() {
    const section = document.getElementById("feedCon")
    const dis = `
                <div id="fcon">
                    <div id="render">${loader("just a sec...")}</div>
                    <div id="pagenav">1</div>
                </div>
                `
    section.innerHTML = dis
    
    function choosePage() {
        const footer = document.getElementById("pagenav")

        footer.innerHTML = `<ul id="pagenumb"></ul>`

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

                    if (i === Number(curentPage)) {
                        footer.innerHTML += `
                                            <b>Page ${i}</b>
                                            `
                    } else {
                        navStr += `
                                    <li data-page="${i}" class="pli">${i}<li>
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

        const pages = response.totalPage
        totalContainablePage = pages


    }

}

export { handleFeedDisplay }