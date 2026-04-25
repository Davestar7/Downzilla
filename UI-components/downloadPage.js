import {islogedIn} from '../js/checkuserlogin.js';
import {icons} from '../UI-components/env/env.js'
import {headnavcall} from '../js/alert.js'
// import {userData} from '../js/auth/afterauth.js'
import header from '../UI-components/header.js'
import { callsearch } from '../js/operation/download.js';

function MainStructure() {
    let page = document.getElementById('contentPage')
    page.innerHTML = ""
    page.innerHTML = `<loading>loading...</loading>`
    let Dsection = InActivity()
    let headers = header()
    let Page = `
        <header id="head">${headers}</header>
        <section>
            <div id="first">${Dsection}</div>
        </section>
    `;

    page.innerHTML = Page;
    headnavcall()
    callsearch()
    setTimeout(()=>{
        let ur = localStorage.getItem("DZDP")
        console.log(ur)
        if (ur != null) {
            document.getElementById('downloadinput').value = ur.toString()
        }
    }, 1000)
}

function InActivity() {
    const int = '<h4>download from over <span>200+</span> sites</h4>'
    const intro = `<h4>search for video with <span id="auto">Automatic</span> search and download</h4>`
    let result = null; //change when devloping backend
    if (result != null) {
        result = result
    } else {
        result = `
            <ol id="steps">
                <li>copy url link of video from site</li>
                <li>paste in option above</li>
                <li>click on search</li>
                <li>if url is valid download details wil display</li>
            </ol>
        `
    }
    let pass;

    pass = `
        <div id="dcarry">
            <div id="stext">${int} ${intro}</div>
            <div id="inp">
                <input type="url" name="downloader" id="downloadinput" placeholder="paste link to search for video's" title="paste url here">
                <button title="search" id="searchvid">${icons.SEARCHICON}</button>
            </div>
            <div id="mpbtn">
                <button id="mpv">mp4</button>
                <button id="mpl">playlist</button>                
                <button id="mpa">mp4 audio</button>
            </div>
            <div id="result">
                <p style="color: red;" id="inal"><p>
                <div id="resultdis">
                    ${result}
                </div>
            </div>
        </div>
    `;
    return pass
}

export {MainStructure}