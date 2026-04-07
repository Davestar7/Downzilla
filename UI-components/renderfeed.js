import {icons, loader} from './env/env.js'
import {islogedIn} from '../js/checkuserlogin.js'
import {headnavcall} from '../js/alert.js'
import {userData} from '../js/auth/afterauth.js'
import header from '../UI-components/header.js'
import { handleFeedDisplay } from '../js/interact/feedRender.js'

function MainStructure() {
    let page = document.getElementById('contentPage')
    page.innerHTML = `<loading>${loader()}</loading>`
    const headers = header()
    
    let Render = `
        <header id="head">${headers}</header>
        <section id="render">
            <div id="opt"></div>
            <div id="feed"></div>
        </section>
    `
    page.innerHTML = Render
    headnavcall()
    runFeedDisplay()
}

function runFeedDisplay() {
    const search = `<input type="search" name="feed_searcher" id="sher" placeholder="search content" title="search">`
    let headText = "download shared content"

    const structure = `
                    <div id="topr">
                        <div id="rtone">
                            <h3 id="intof">${headText}</h3>
                        </div>
                        <div id="sercCon">
                            <div>
                                ${search}
                            </div>
                            <button id="searchrun">
                                ${icons.SEARCHICON}
                            </button>
                        </div>
                    </div>  
                    `
    document.getElementById("opt").innerHTML = structure
    const feedContainer = document.getElementById("feed")
    feedContainer.innerHTML = loader()
    
    const restStruct = `
                        <div id="feedCon">
                            ${loader("just a sec...")}
                        </div>
                        `
    feedContainer.innerHTML = restStruct

    handleFeedDisplay()
}

export default MainStructure