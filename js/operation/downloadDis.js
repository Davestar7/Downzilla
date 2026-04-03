import {downloadVideo, getFormat, downloadmp } from "./download.js"
import {updateSelectableFormat, updateDiscription} from "./streamvideo.js"
import { routes } from "../../UI-components/env/env.js"
import { alert as alerts, popUp } from "../../UI-components/popup.js"
import { closeFunction } from "../alert.js"
import { uploadHistory, uploadContent } from "../interact/history.js"

function timeformat(sec) {
    const h = Math.floor(sec / 3600).toString().padStart(2, "0")
    const m = Math.floor((sec % 3600) / 60). toString().padStart(2, "0")
    const s = Math.floor(sec % 60).toString().padStart(2, "0")
    const retur =  `${h}:${m}:${s}`
    return retur.toString()
}

let backupJson = undefined;

function videodis(jsons = null, ismp) {
    let display = document.getElementById("resultdis")
    let downloadable;
    if (jsons == null) {
        downloadable = backupJson;
    } else {
        downloadable = jsons
        backupJson = jsons
    }

    if (downloadable == undefined || downloadable == null) {
        return
    }

    display.innerHTML = "<em>updating details... <br> if stuck ensure it's not a playlist url</em>"
    
    if (downloadable.success != true) {
        const errordis = "-" + downloadable.message + `<br><em>check internet connection</em><br> <em>comfirm video URL</em><br> <em>then try again</em>`
        display.innerHTML = errordis
        return
    }
    const details = downloadable.data

    const title = details.title
    const discrip = details.description || "no discription found"
    const thumbnail = details.thumbnail
    const uploader = details.uploader
    const source = details.extractor_key
    const duration = timeformat(Number(details.duration))
    const format = details.formats
    const urls = details.original_url
    console.log(urls)
    const request_Format = details.requested_formats //past to stream
    let formatS
    request_Format.forEach(e => {
        formatS = e.url
    })

    const durations = Number(details.duration)

    const active = `
                <div id="resultC">
                    <div result="resultVImg">
                        <div id="img-vid">
                            <img src="${thumbnail}" id="vimg" alt="${title}" title="downzilla video display">
                        </div>
                        <h6>00:00 - ${duration}</h6>
                    </div>
                    <div id="resDetail">
                        <h3 id="ht">${title}</h3>
                        <h4 id="hd">loading...</h4>
                        <h6>uploaded by "${uploader}"</h6>
                        <h6>From ${source}</h6>
                    </div>
                    <div>
                        <div>
                            <i>Select A Good Video format</i>
                        </div>
                        <div id="formatck">
                            <em>loading mp4 formats...</em>
                        </div>
                    </div>
                    <div id="playB">
                        <button id="dnbtn" class="dnbtn">download btn</button>
                        <button id="upbtn" class="upbtn">Upload video</button>
                    </div>
                </div>
            `

    display.innerHTML = active;
    updateDiscription(discrip, document.getElementById("hd"))

    // logic and listiners
    // let startDura = document.getElementById("startr").value;
    // let endDura = document.getElementById("endr").value;

    // document.getElementById("startr")?.addEventListener("input", e => {
    //     const start = e.target.value
    //     startDura = start
    //     document.getElementById("disStart").innerHTML = timeformat(startDura)
    // })
    // document.getElementById("endr")?.addEventListener("input", e => {
    //     const end = e.target.value
    //     endDura = end
    //     document.getElementById("disend").innerHTML = timeformat(endDura)
    // })

    // select code
    // displayFormat(url, title, startDura, endDura, "video")
    const displays = `<div id="format">
                            <div>
                                <i>Select video quality to download</i>
                            </div>
                            <div id="seldiv">
                                <select id="forSel"><em>loading...</em></select>
                            </div>
                            <div>
                                <pre id="forInfo"></pre>
                            </div>
                        </div>`;
    let element = document.getElementById("formatck")
    if (ismp != true) {                    

        element.innerHTML = displays

        window.availableFormats = format || []
        
        updateSelectableFormat("video")
        document.getElementById("dnbtn").innerHTML = "Download mp4"

        AndDownload(title, null, null, format, urls)
    } else {
        element.innerHTML = displays
        window.availableFormats = format || []
        
        updateSelectableFormat("audio")
        document.getElementById("dnbtn").innerHTML = "Download mp3"
        listmpdownload(urls, title, "basic", format, discrip, source)
    }

    document.getElementById("upbtn").addEventListener("click", (e) => {
        console.log("for video")
        const uploadm = document?.getElementById("upbtn")
        e.target.removeEventListener("click", ()=> {
            console.log("cancelled listerner")
        })
        uploadm.style.background = "white"
        uploadm.innerHTML = `<i>uploading...</i>`
        uploadContent(title, thumbnail, discrip, urls, source, "playlist", uploadm)
    })
    uploadHistory(title, discrip, urls, source, "video", thumbnail)
}

function playListdis(jsons) {
    let display = document.getElementById("resultdis")
    display.innerHTML = "<em>updating details...</em>"
    const downloadable = jsons.data;
    console.log(downloadable)
    
    if (jsons.success != true) {
        const errordis = "-" + jsons.message + `<br><em>check internet connection</em><br> <em>comfirm video URL</em><br> <em>then try again</em>`
        display.innerHTML = errordis
        return
    }

    const thumbs = downloadable.thumbnails
    let thumbnail = thumbs[thumbs.length - 1]

    const playlistdata = {
        channel: downloadable.uploader,
        discription: downloadable.description,
        url: downloadable.original_url,
        title: downloadable.title,
        thumbnail: thumbnail.url,
        playlist_count: downloadable.playlist_count,
        site: downloadable.webpage_url_domain,
        entries: downloadable.entries
    }

    const ele = `
                <div id="playmain">
                    <div class="playlistResult">
                        <div id="disc">
                            <div class="deatail">
                                <div class="vimgp">
                                    <img src="${playlistdata.thumbnail}" id="vimg"></img>
                                </div>
                                <div id="metadel">
                                    <h3><b>Title:</b> ${playlistdata.title}</h3>
                                    <h4 id="pdis"><b>Discription: loading...</h4>
                                    <span>videos found: ${playlistdata.playlist_count}</span>
                                    <span>source: ${playlistdata.site}</span>
                                    <span>uploader: ${playlistdata.channel}</span>
                                </div>
                            </div>
                        </div>
                        <hr>
                        <div id="entries">
                            <em>uplading details...</em>
                        </div>
                    </div>
                    <div id="btnss">
                        <div>
                            <button id="upbtn" class="upbtn">Upload playlist</button>
                        </div>
                    </div>
                </div>
                `;

    display.innerHTML = ele;
    updateDiscription(playlistdata.discription, document.getElementById("pdis"))

    const ent = document.getElementById("entries")
    
    const entries = playlistdata.entries;
    ent.innerHTML = "";
    console.log(entries.length)
    entries.forEach((e, i) => {
        const len = e.thumbnails
        const vtitle = e.title;
        const vthumbnail = len[len.length - 1]
        const position = i
        
        const discription = e.description || "no discription"
        const duration = timeformat(e.duration)

        const el = `
                        <div id="listv">
                            <div class="vlistp">
                                <div id="listcimg">
                                    <img src="${vthumbnail.url}" id="listtimg"></img>
                                </div>
                                <div id="plistdc">
                                    <h3>${vtitle}</h3>
                                    <h4>${discription}</h4>
                                    <span>00:00 - ${duration}</span>
                                </div>
                                <div id="downplbtn">
                                    <button id="downloadplbtn" class="downloadplbtn" data-position="${position}">download</button>
                                </div>
                            </div>
                        </div>
                    `;
        ent.innerHTML += el;
    })
    AndPlaySingle(entries)
    uploadHistory(playlistdata.title, playlistdata.discription, playlistdata.url, playlistdata.site, "playlist", playlistdata.thumbnail)
    document.getElementsByClassName("upbtn")[0].addEventListener("click", (e) => {
        const uploadp = document.getElementById("upbtn")
        e.target.removeEventListener("click", () => {
            uploadp.style.background = "gray"
            uploadp.innerHTML = `<i>uploading...</i>`
            uploadContent(playlistdata.title, playlistdata.thumbnail, playlistdata.discription, playlistdata.url, playlistdata.site, "playlist", uploadp)
        })
    })
    // andDownloadPlay(playlistdata.title, playlistdata.url, entries)
}

async function playlistPopup(json, url) {
    if (json.success == false) {
        if (json.conditional == true) {
            alerts("retrying fetch", 3000)
            await getFormat(url, "playlist")
        } else {
            alerts("failed: " + jsons.message)
            closeFunction()
        }
        return
    } else {
        popUp("playlist")
    }
    const jsons = json.data

    const title = jsons.title
    const discription = jsons.description
    const thumbnail = jsons.thumbnail
    const time = timeformat(Number(jsons.duration))
    const format = jsons.formats
    const source = jsons.extractor_key
    const urls = details.original_url
    console.log(format)

    const dis = `
                    <div id="playlistpp">
                        <div id="playpopcon">
                            <div id="playcont">
                                <div id="popimg">
                                    <img src="${thumbnail}" title="${title}" id="popaimg"></img>
                                </div>
                                <b>${title}</b>
                                <p id="popdis">${discription}</p>
                                <i>00:00 - ${time}</i>
                            </div>
                            <div id="playpopformat">
                                <div id="format">
                                    <div>
                                        <i>Select video quality to download</i>
                                    </div>
                                    <div id="seldiv">
                                        <select id="forSel"><em>loading...</em></select>
                                    </div>
                                    <div>
                                        <pre id="forInfo"></pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="playBP">
                            <button id="dnbtnplay" class="dnbtnp">download video</button>
                            <button id="dnbtnmic" class="mibtn">download as mp3</button>
                            <button id="upbtnplay" class="upbtnp">Upload video</button>
                        </div>
                    </div>
                `;
    document.getElementById("playformat").innerHTML = dis;

    updateDiscription(discription, document.getElementById("popdis"))

    window.availableFormats = format || []
    updateSelectableFormat("video")

    AndDownloadFromPlay(title, 0, jsons.duration, format, url, discription, source)
    listmpdownload(url, title, "play", format)
    document.getElementsByClassName("upbtnp")[0].addEventListener("click", (e) => {
        e.target.removeEventListener("click", () => {
            const upplay = document.getElementById("upbtnplay")
            upplay.innerHTML = `<i>uploading...</i>`
            upplay.style.background = "gray"
            uploadContent(title, thumbnail, discription, urls, source, "video", upplay)
        })
    })
}

function AndDownload(title, starts, ends, formats, url) {
    const btn = document.getElementById("dnbtn")
    const btns = document.getElementsByClassName("dnbtn")[0]
    // const url = document.getElementById("downloadinput").value.trim()
    const start = starts;
    const end = ends;
    
    btns?.addEventListener("click", async (e) => {
        btns.removeEventListener("click", () => {
            console.log("event listiner cancelled")
        })
        btn.style.background = "gray"
        btn.classList.remove("dnbtn")
        btn.classList.add("clicked")
        btn.innerHTML = `<i>prepering to download...</i>`

        await downloadVideo(url, title, start, end, formats, "frommp4")
    })
}

function AndDownloadFromPlay(title, starts, ends, formats, url, des, su) {
    const btn = document.getElementById("dnbtnplay")
    const btns = document.getElementsByClassName("dnbtnp")[0]
    const start = starts;
    const end = ends;
    
    btns?.addEventListener("click", async (e) => {
        btns.removeEventListener("click", ()=> {
            console.log("cancelled event listinner")
        })
        btn.style.background = "white"
        btn.classList.remove("dnbtnp")
        btn.classList.add("clicked")
        btn.innerHTML = `<i>perpering to download...</i>`

        await downloadVideo(url, title, start, end, formats, "fromplay", des, su)
    })
}

function AndPlaySingle(ent) {
    const btnCon = document.querySelectorAll(".downloadplbtn")
    let position
    btnCon.forEach(btn => {
        btn.addEventListener("click", (e) => {
            console.log("clicked")
            popUp("playlist")
            console.log(e.target)
            const datas = e.target.dataset.position
            position = datas

            const data = ent[position]
            const url = data.url;
            const title = data.title
            const duration = data.duration
            console.log(url)
            document.getElementById("playvidtit").innerHTML = `download - ${title}`
            if (title === "[Deleted video]") {
                alert("sorry it seems to be a deleted video", 10000)
            } else {
                getFormat(url, "playlist")
            }
            // displayFormat(url, title, undefined, duration, "playlist")
        })
    })
}

function listmpdownload(url, title, from, formats, des, su) {
    let element;
    
    if (from == "basic") {
        element = document.getElementById("dnbtn")
        // element = document.getElementsByClassName("dnbtn")[0]
    } else if (from = "play") {
        element = document.getElementById("dnbtnmic")
        // element = document.getElementsByClassName("mibtn")[0]
    }
    
    element.addEventListener("click", () => {
        const FSelect = document?.getElementById("forSel")
        let select;
        let ext;
        if (FSelect) {
            const se = FSelect.value;
            const sel = se.split(" ")
            console.log(sel)
            select = sel[0]
            let ex = sel[1]
            switch (ex) {
                case "mp4":
                    ext = "mp3"
                    break;
                default:
                    ext = ex
                    break;
            }
        }
        console.log("clicked mp3 download")
        element.innerHTML = "prepering to download..."
        element.removeEventListener("click", () => {
            console.log("event listener cancelled")
        })
        element.style.background = "gray"
        if (from == "basic") {
            element.classList.remove("dnbtn")
            element.classList.add("clicked")
            downloadmp(url, title, from, select, ext, formats)
        } else if (from = "play") {
            element.classList.remove("mibtn")
            element.classList.add("clicked")
            select = null
            ext = null
            downloadmp(url, title, from, select, ext, formats, des, su)
        }
        // alerts("Download should begin", 3000)
    })
}

function historyRender(DData, isPublic, type) {
    const display = document.getElementById("hisConP")
    display.innerHTML = "<em>updating details... <br> if stuck ensure it's not a playlist url</em>"
    
    if (DData.success != true) {
        const errordis = "-" + DData.message + `<br><em>check internet connection</em><br> <em>comfirm video URL</em><br> <em>then try again</em>`
        display.innerHTML = errordis
        return
    }
    const details = DData.data

    const title = details.title
    const discrip = details.description || "no discription found"
    const thumbnail = details.thumbnail
    const uploader = details.uploader
    const source = details.extractor_key
    const duration = timeformat(Number(details.duration))
    const format = details.formats
    const urls = details.original_url
    console.log(urls)
    const request_Format = details.requested_formats //past to stream
    let formatS
    request_Format.forEach(e => {
        formatS = e.url
    })

    const durations = Number(details.duration)

    let uploadbtn;
    if (isPublic === true) {
        uploadbtn = "<button>Uploaded</button>"
    } else {
        uploadbtn = '<button id="upbtn" class="upbtn">Upload video</button>'
    }

    if (type == "video") {
            const active = `
                    <div id="resultC">
                        <div result="resultVImg">
                            <div id="img-vid">
                                <img src="${thumbnail}" id="vimg" alt="${title}" title="downzilla video display">
                            </div>
                            <h6>00:00 - ${duration}</h6>
                        </div>
                        <div id="resDetail">
                            <h3 id="ht">title:"${title}"</h3>
                            <h4 id="hd">discription:"${discrip}"</h4>
                            <h6>uploaded by "${uploader}"</h6>
                            <h6>From ${source}</h6>
                        </div>
                        <div>
                            <div>
                                <i>Select A Good Video format</i>
                            </div>
                            <div id="formatck">
                                <div id="format">
                                    <div>
                                        <i>Select video quality to download</i>
                                    </div>
                                    <div id="seldiv">
                                        <select id="forSel"><em>loading...</em></select>
                                    </div>
                                    <div>
                                        <pre id="forInfo"></pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="playB">
                            <button id="dnbtn" class="dnbtn">download btn</button>
                            <button id="dnbtn" class="mbtn">download btn</button>
                            ${uploadbtn}
                        </div>
                    </div>
                `

        display.innerHTML = active;

        updateDiscription(discrip, document.getElementById("hd"))

        window.availableFormats = format || []
        updateSelectableFormat("video")

        const dbtn = document.getElementsByClassName("dnbtn")[0]
        const mbtn = document.getElementsByClassName("mbtn")[0]
        dbtn.innerHTML = "Download MP4"
        mbtn.innerHTML = "Download MP3"

        dbtn.addEventListener("click", () => {
            
            dbtn.innerHTML = "awaiting download..."
            // dbtn.classList.add("clicked")

            downloadVideo(urls, title, null, null, format, "history")
        })

        mbtn.addEventListener("click", () => {
            mbtn.innerHTML = "awaiting download..."
            mbtn.classList.add("clicked")
            downloadmp(urls, title, "history", null, "mp3", format)
        })

        document.getElementsByClassName("upbtn")[0]?.addEventListener("click", () => {
            console.log("for video")
            const uploadm = document?.getElementById("upbtn")
            e.target.removeEventListener("click", ()=> {
                console.log("cancelled listerner")
            })
            uploadm.style.background = "white"
            uploadm.innerHTML = `<i>uploading...</i>`
            uploadContent(title, thumbnail, discrip, urls, source, "playlist", uploadm)
        })
    } else if (type == "playlist") {
        const playlist_count= details.playlist_count
        const site= details.webpage_url_domain
        const entries= details.entries
        const channel = details.uploader
        const ele = `
                <div id="playmain">
                    <div class="playlistResult">
                        <div id="disc">
                            <div class="deatail">
                                <div class="vimgp">
                                    <img src="${thumbnail}" id="vimg"></img>
                                </div>
                                <div id="metadel">
                                    <h3><b>Title:</b> ${title}</h3>
                                    <h4 id="hdp"><b>Discription: </b>${discrip}</h4>
                                    <span>videos found: ${playlist_count}</span>
                                    <span>source: ${site}</span>
                                    <span>uploader: ${channel}</span>
                                </div>
                            </div>
                        </div>
                        <hr>
                        <div id="entries">
                            <em>uplading details...</em>
                        </div>
                    </div>
                    <div id="btnss">
                        <div>
                            <button id="upbtn" class="upbtn">Upload playlist</button>
                        </div>
                    </div>
                </div>
                `;

        display.innerHTML = ele;

        updateDiscription(discrip, document.getElementById("hdp"))

        const ent = document.getElementById("entries")
        
        ent.innerHTML = "";
        console.log(entries.length)
        entries.forEach((e, i) => {
            const len = e.thumbnails
            const vtitle = e.title;
            const vthumbnail = len[len.length - 1]
            const position = i
            
            const discription = e.description || "no discription"
            const duration = timeformat(e.duration)

            const el = `
                        <div id="listv">
                            <div class="vlistp">
                                <div id="listcimg">
                                    <img src="${vthumbnail.url}" id="listtimg"></img>
                                </div>
                                <div id="plistdc">
                                    <h3>${vtitle}</h3>
                                    <h4>${discription}</h4>
                                    <span>00:00 - ${duration}</span>
                                </div>
                                <div id="downplbtn">
                                    <button id="downloadplbtn" class="downloadplbtn" data-position="${position}">download</button>
                                </div>
                            </div>
                        </div>
                    `;
            ent.innerHTML += el;
        })
        AndPlaySingle(entries)
        document.getElementsByClassName("upbtn")[0].addEventListener("click", (e) => {
            const uploadp = document.getElementById("upbtn")
            e.target.removeEventListener("click", () => {
                uploadp.style.background = "gray"
                uploadp.innerHTML = `<i>uploading...</i>`
                uploadContent(title, thumbnail, discrip, urls, source, "playlist", uploadp)
            })
        })
    }
    
    if (!DData.data.cloudinaryId && DData.data.cloudinaryUrl) {
        uploadHistory(title, discrip, urls, source, type, thumbnail)
    }

}

//REMAINS CURRENTLY IN ACTIVE UNTIL BACKEND DOWNLOAD FULL PLAYLIST
function andDownloadPlay(title, url, ent) {
    const btn = document.getElementById("dnbtnp")
    const btns = document.getElementsByClassName("dnbtnp")[0]
    const tit = title
    const playurl = url

    btns?.addEventListener('click', async () => {
        btn.innerHTML = `<i>prepering to begin download...</i>`
        const entpass = []
        btn.classList.remove("dnbtnp")
        btn.classList.add("clicked")

        ent.forEach(e => {
            if (e.title === "[Deleted video]") {
                return
            }
            const vars = {
                url: e.url,
                title: e.title
            }

            entpass.push(vars)
        })
        console.log(entpass)
        alerts("Download playlist might take some time", 5000)
        zippaydownload(entpass, tit)
    })


}

export {videodis, playListdis, playlistPopup, historyRender }