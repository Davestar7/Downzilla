import {islogedIn} from '../js/checkuserlogin.js';
import {icons} from '../UI-components/env/env.js'
import {headnavcall} from '../js/alert.js'
// import {userData} from '../js/auth/afterauth.js'
import header from '../UI-components/header.js'
import { callsearch } from '../js/operation/download.js';

function MainStructure() {
    document.title = "Downzilla Downloader";
    const metadis = "download videos, playlist and mp3's from over 200+ sites at ease, by pasting the media url"
    document.querySelector('meta[name="description"]').setAttribute('content', metadis)
    let page = document.getElementById('contentPage')
    page.innerHTML = ""
    page.innerHTML = `<loading>loading...</loading>`
    let Dsection = InActivity()
    let headers = header()
     
    let Page = `
        <header id="head">${headers}</header>
        <section>
            <div id="first">${Dsection}</div>
            <div id="seco"><h3>About</h3><br>\n</div>
        </section>
    `;

    page.innerHTML = Page;
    headnavcall()
    callsearch()
    otherActivity()
    setTimeout(()=>{
        let ur = localStorage.getItem("DZDP")
        
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
                <li>copy url link of video or playlist from site</li>
                <li>paste in available input option above</li>
                <li>select the accurate option for the url, if link is for single video select <em>"mp4"</em> if for playlist select <em>"playlist"</em> if you want to get only audio from video link select <em>"mp3"</em> <br> - <em>the mp3 option -audio download option- works only with video links only, playlist links are not directly supported </em></li>
                <li>Next - click on search</li>
                <li>Be patient while it loads, it might take up to few seconds</li>
                <li>if url is valid download details wil display <em>--you can watch the streamed video directly</em></li>
                <li>select a good video format <em>-qualify-</em> download <em>--recomended format choose between 144p to 480p unless you need a higher quality in HD then select a higher format</em></li>
                <li>if it a playlist first select a video among the list, you'll get that video data then select a format</li>
                <li>then click on download <em>--wait a little for the procces to finish please at this point don't refresh the page</em></li>
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

function otherActivity() {
    const dataj = [
        {
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam nulla aspernatur labore voluptate quia, aut ipsa qui beatae voluptatum, eveniet placeat, id inventore praesentium ex ullam magnam non. Provident, minima."
        },
    ]

    const innerxml = document.createElement("template")
    for (let i = 0; i < dataj.length; i++) {
        const element = dataj[i];
        innerxml.innerHTML = `<p id="secps">${element.text}</p>`
        
        document.getElementById("seco").append(innerxml.content.firstElementChild)
    }
    // const xml = document.createElement("template")
    // document.getElementById("seco").prepend(xml.content.firstElementChild)
}

export {MainStructure}