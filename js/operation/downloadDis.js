import {downloadVideo, downloadmp, beginQuery } from "./download.js"
import {updateSelectableFormat, updateDiscription, formatPasser, streamVideoFunction, generateThumbnailContainer} from "./streamvideo.js"
import { domain } from "../../UI-components/env/env.js"
import { alert as alerts, popUp } from "../../UI-components/popup.js"
import { closeFunction } from "../alert.js"
import { uploadHistory, uploadContent } from "../interact/history.js"

function timeformat(sec) {
    if (typeof sec !== "number" || Number.isNaN(sec)) {
        return "....";
    }

    const h = Math.floor(sec / 3600).toString().padStart(2, "0");
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, "0");
    const s = Math.floor(sec % 60).toString().padStart(2, "0");

    return `${h}:${m}:${s}`;
}

const monetag = "https://omg10.com/4/11056236"
let backupJson = undefined;

async function videodis(jsons = null, ismp) {
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
        const errordis = "-" + `<span id="reterr">${downloadable.message} </span>` + `<br><em>check internet connection</em><br> <em>comfirm video URL</em><br> <em>then try again</em>`;
        display.innerHTML = errordis
        return
    }
    const details = downloadable.data

    if (details?.entries !== undefined || details?.entries?.length >= 0) {
        playListdis(jsons)
        return
    }

    const title = details?.title
    const discrip = details?.description || "no discription found"
    const thumbnail = details?.thumbnail
    const uploader = details?.uploader
    const source = details?.extractor_key
    const duration = timeformat(Number(details?.duration))
    const format = details?.formats
    const urls = details?.original_url
    const http_headers = details?.http_headers
    const request_Format = details?.requested_formats //past to stream
    

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
                            <i></i>
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

        AndDownload(title, null, null, format, urls, http_headers)
        
    } else {
        element.innerHTML = displays
        window.availableFormats = format || []
        
        updateSelectableFormat("audio")
        document.getElementById("dnbtn").innerHTML = "Download mp3"
        listmpdownload(urls, title, "basic", format, discrip, source, http_headers)
    }

    document.getElementById("upbtn").addEventListener("click", (e) => {
        const uploadm = document?.getElementById("upbtn")
        uploadm.style.background = "white"
        uploadm.innerHTML = `<i>uploading...</i>`
        uploadContent(title, thumbnail, discrip, urls, source, "video", uploadm, details?.age_limit)
    })
       generateThumbnailContainer("#img-vid", thumbnail)
       document.getElementById("gc-watch-btn")?.addEventListener("click", () => {
           streamVideoFunction(formatPasser.selectedFormats, urls, title, http_headers, thumbnail)
      })
    uploadHistory(title, discrip, urls, source, "video", thumbnail)

    saveUploadData({ a: title, b: thumbnail, c: discrip, d: urls, e: source, f: "video", g: document?.getElementById("upbtn") }, true)
}

let playBackup = undefined

function playListdis(jsons = null) {
    let display = document.getElementById("resultdis")
    display.innerHTML = "<em>updating details...</em>"
    let datas;
    if (jsons !== null) playBackup = undefined
    if (playBackup !== undefined) {
        datas = playBackup.data
        
    } else {
        playBackup = jsons
        
        datas = playBackup.data;
    }

    console.log(playBackup)
    if (playBackup.success === false) {
        alerts("failed to process playlist")
        display.innerHTML = "failed"
    }

    const downloadable = datas
    
    if (playBackup.success != true) {
        const errordis = "-" + playBackup.message + `<br><em>check internet connection</em><br> <em>comfirm video URL</em><br> <em>then try again</em>`
        display.innerHTML = errordis
        return
    }

    if (downloadable?.entries === undefined || downloadable?.entries.length === 0) {
        videodis(jsons)
        return
    }
    const thumbs = downloadable?.thumbnails
    let thumbnail = thumbs[thumbs.length - 1]

    const playlistdata = {
        channel: downloadable?.uploader,
        discription: downloadable?.description,
        url: downloadable?.original_url,
        title: downloadable?.title,
        thumbnail: thumbnail?.url,
        playlist_count: downloadable?.playlist_count,
        site: downloadable?.webpage_url_domain,
        entries: downloadable?.entries
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
                                    <h4 id="pdis"><b>Discription: loading...</h4> <br>
                                    <span>videos found: ${playlistdata.playlist_count}</span> <br>
                                    <span>source: ${playlistdata.site}</span> <br>
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
                                    <button id="downloadplbtn" class="downloadplbtn" data-position="${position}">Details</button>
                                </div>
                            </div>
                        </div>
                    `;
        ent.innerHTML += el;
    })
    AndPlaySingle(entries)
    saveUploadData({a: playlistdata.title, b: playlistdata.thumbnail, c: playlistdata.discription, d: playlistdata.url, e: playlistdata.site, f: "playlist", g: document.getElementsByClassName("upbtn")[0]}, true)          
    uploadHistory(playlistdata.title, playlistdata.discription, playlistdata.url, playlistdata.site, "playlist", playlistdata.thumbnail)
    document.getElementsByClassName("upbtn")[0].addEventListener("click", () => {
        const uploadp = document.getElementById("upbtn")
        uploadp.style.background = "gray"
        uploadp.innerHTML = `<i>uploading...</i>`
        uploadContent(playlistdata.title, playlistdata.thumbnail, playlistdata.discription, playlistdata.url, playlistdata.site, "playlist", uploadp, downloadable?.age_limit)
    })
    // andDownloadPlay(playlistdata.title, playlistdata.url, entries)
}

async function playlistPopup(json, url) {
    if (json.success === false) {
        if (json.conditional == true) {
            alerts("failed, please retry", 3000)
            document.getElementById("playformat").innerHTML = `<button id="pret" style="padding: 5%; width: 10%; border: 1px solid black;">retry</button>`
            document.getElementById("pret")?.addEventListener("click", () => {
                beginQuery(url, "popplaylist", null, true)
            })
        } else {
            alerts("Failed: something went wong ")
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
    const urls = jsons.original_url
    const headers = jsons.http_headers

    const dis = `
                    <div id="playlistpp">
                        <div id="playpopcon">
                            <div id="playcont">
                                <div id="popimg">
                                    <div id="img-vid">
                                        <img src="${thumbnail}" id="vimg" alt="${title}" title="downzilla video display">
                                    </div>
                                </div>
                                <b>${title}</b>
                                <i>00:00 - ${time}</i>
                            </div>
                            <div id="playpopformat">
                                <div id="format">
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
                            
                        </div>
                    </div>
                `;
    document.getElementById("playformat").innerHTML = dis;

    window.availableFormats = format || []
    updateSelectableFormat("video")

    generateThumbnailContainer("#img-vid", thumbnail)       
   document.getElementById("gc-watch-btn")?.addEventListener("click", () => {
           streamVideoFunction(formatPasser.selectedFormats, urls, title, headers, thumbnail)
      })

    AndDownloadFromPlay(title, 0, jsons.duration, format, urls, discription, source, headers)
    listmpdownload(urls, title, "play", format, discription, source, headers)
    
}

function AndDownload(title, starts, ends, formats, url, headers) {
    const btn = document.getElementById("dnbtn")
    const btns = document.getElementsByClassName("dnbtn")[0]
    // const url = document.getElementById("downloadinput").value.trim()
    const start = starts;
    const end = ends;
    
    btns?.addEventListener("click", async () => {
        btn.style.background = "gray"
        btn.classList.remove("dnbtn")
        btn.classList.add("clicked")
        btn.innerHTML = `<i>prepering to download...</i>`

        await downloadVideo(url, title, start, end, formats, "frommp4", headers)
        setTimeout(() => {
          popUp("askshare")
          setTimeout(() => {
               window.open(monetag, "_blank");
            }, 3000)
        }, 1000)
    })
}

function AndDownloadFromPlay(title, starts, ends, formats, url, des, su, headers) {
    const btn = document.getElementById("dnbtnplay")
    const btns = document.getElementsByClassName("dnbtnp")[0]
    const start = starts;
    const end = ends;
    
    btns?.addEventListener("click", async (e) => {
        
        btn.style.background = "white"
        btn.classList.remove("dnbtnp")
        btn.classList.add("clicked")
        btn.innerHTML = `<i>perpering to download...</i>`

        await downloadVideo(url, title, start, end, formats, "fromplay", headers, document.getElementById("forSel"))
        
        setTimeout(() => {
            popUp("askshare")
            setTimeout(() => {
               window.open(monetag, "_blank");
            }, 3000)
        }, 5000);
    })
}

function AndPlaySingle(ent) {
    const btnCon = document.querySelectorAll(".downloadplbtn")
    let position
    btnCon.forEach(btn => {
        btn.addEventListener("click", (e) => {
            popUp("playlist")
            
            const datas = e.target.dataset.position
            position = datas

            const data = ent[position]
            const url = data.url;
            const title = data.title
            const duration = data.duration
            
            document.getElementById("playvidtit").innerHTML = `download - ${title}`
            if (title === "[Deleted video]") {
                alerts("sorry it seems to be a deleted video", 10000)
            } else {
                beginQuery(url, "popplaylist", document.getElementById("playformat"), true)
            }
            // displayFormat(url, title, undefined, duration, "playlist")
        })
    })
}

function listmpdownload(url, title, from, formats, des, su, headers) {
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
        
        element.innerHTML = "prepering to download..."
        element.style.background = "gray"
        if (from == "basic") {
            element.classList.remove("dnbtn")
            element.classList.add("clicked")
            downloadmp(url, title, from, select, ext, formats, des, su, headers)
        } else if (from = "play") {
            element.classList.remove("mibtn")
            element.classList.add("clicked")
            select = null
            ext = null
            downloadmp(url, title, from, select, ext, formats, des, su, headers)
        }
        // alerts("Download should begin", 3000)
    })
}

function historyRender(DData, isPublic, type, element = null, isFeed = false, vid = null) {
    let display
    if (element === null) {
        display = document.getElementById("hisConP")
    } else {
        display = element 
    }
    
    display.innerHTML = "<em>updating details... <br> if stuck ensure it's not a playlist url</em>"
    
    if (DData.success != true) {
        const errordis = "-" + `<span id="reterr">${DData.message} </span>` + `<br><em>check internet connection</em><br> <em>comfirm video URL</em><br> <em>then try again</em>`
        display.innerHTML = errordis
        return
    }
    let details = DData.data
    console.log(details)

    const title = details?.title
    const discrip = details?.description || "no discription found in this content"
    let thumbnail
    const uploader = details?.uploader || "unknown"
    const source = details?.extractor_key
    const duration = timeformat(Number(details?.duration))
    const format = details?.formats
    const urls = details?.original_url
    const httpHeaders = details?.http_headers //object

    const durations = Number(details?.duration)

    let uploadbtn;
    if (isPublic === true) {
        uploadbtn = "<button>Uploaded</button>"
    } else {
        uploadbtn = '<button id="upbtn" class="upbtn">Upload video</button>'
    }

    if (isFeed === false) {    
        if (type === "video") {
            try {
                thumbnail = details?.thumbnail
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
                                        <i></i>
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
                                    <button id="sharefeed">Share</button>
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

                    downloadVideo(urls, title, null, null, format, "history", httpHeaders, vid)
                })

                mbtn.addEventListener("click", () => {
                    mbtn.innerHTML = "awaiting download..."
                    mbtn.classList.add("clicked")
                    downloadmp(urls, title, "history", null, "mp3", format, discrip, source, httpHeaders)
                })

                document.getElementsByClassName("upbtn")[0]?.addEventListener("click", () => {
                    const uploadm = document?.getElementById("upbtn")
                    uploadm.style.background = "white"
                    uploadm.innerHTML = `<i>uploading...</i>`
                    uploadContent(title, thumbnail, discrip, urls, source, "playlist", uploadm, details?.age_limit)
                })
               
                generateThumbnailContainer("#img-vid", thumbnail)

document.getElementById("gc-watch-btn")?.addEventListener("click", () => {
           streamVideoFunction(formatPasser.selectedFormats, urls, title, httpHeaders, thumbnail)
      })
 
            } catch (e) {
                console.log(e)
                alerts("something seems wong", 3000)
            }
        } else if (type === "playlist") {
            try {
                thumbnail = details?.thumbnails[details?.thumbnails.length-1]?.url
                
                const playlist_count= details?.playlist_count
                const site= details?.webpage_url_domain
                const entries= details?.entries
                const channel = details?.uploader

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
                                    <button id="sharefeed">Share</button>
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
                                            <button id="downloadplbtn" class="downloadplbtn" data-position="${position}">details</button>
                                        </div>
                                    </div>
                                </div>
                            `;
                    ent.innerHTML += el;
                })
                AndPlaySingle(entries)
                document.getElementsByClassName("upbtn")[0]?.addEventListener("click", (e) => {
                    const uploadp = document.getElementById("upbtn")
                    uploadContent(title, thumbnail, discrip, urls, source, "playlist", uploadp, details?.age_limit)
                    uploadp.style.background = "gray"
                    uploadp.innerHTML = `<i>uploading...</i>`
                })
            } catch (e) {
                console.log(e)
                alerts("something went wong", 3000)
            }
        }
    } else {
        if (type === "video") {
            try {
                thumbnail = details?.thumbnail
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
                                    <h6>By "${uploader}"</h6>
                                    <h6>From ${source}</h6>
                                    <h6 id="sharedby"></h6>
                                </div>
                                <div>
                                    <div id="formatck">
                                        <div id="format">
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
                                    <button id="sharefeed">Share</button>
                                    <button id="origin">loading...</button>
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

                    downloadVideo(urls, title, null, null, format, "history", httpHeaders, vid)
                })

                mbtn.addEventListener("click", () => {
                    mbtn.innerHTML = "awaiting download..."
                    mbtn.classList.add("clicked")
                    downloadmp(urls, title, "history", null, "mp3", format, discrip, source, httpHeaders)
                })

                document.getElementsByClassName("upbtn")[0]?.addEventListener("click", () => {
                    console.log("for video")
                    const uploadm = document?.getElementById("upbtn")
                    uploadm.style.background = "white"
                    uploadm.innerHTML = `<i>uploading...</i>`
                    uploadContent(title, thumbnail, discrip, urls, source, "playlist", uploadm)
                })
               
                   generateThumbnailContainer("#img-vid", thumbnail)
                    document.getElementById("gc-watch-btn")?.addEventListener("click", () => {
           streamVideoFunction(formatPasser.selectedFormats, urls, title, httpHeaders, thumbnail)
      })
               uploadHistory(title, discrip, urls, source, "video", thumbnail)
            } catch (e) {
                alerts("something seems wong", 3000)
                // historyRender(DData, isPublic, "playlist", element)
            }
        } else if (type === "playlist") {
            try {
                thumbnail = details?.thumbnails[details?.thumbnails.length-1]?.url
                const playlist_count= details?.playlist_count
                const site= details?.webpage_url_domain
                const entries= details?.entries
                const channel = details?.uploader
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
                                            <h6>From ${source}</h6>
                                            <h6 id="sharedby"></h6>
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
                                    <button id="sharefeed">Share</button>
                                    <button id="origin">loading...</button>
                                </div>
                            </div>
                        </div>
                        `;

                display.innerHTML = ele;

                updateDiscription(discrip, document.getElementById("hdp"))

                const ent = document.getElementById("entries")
                
                ent.innerHTML = "";
                    uploadHistory(title, discrip, urls, source, "playlist", thumbnail)
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
                                            <button id="downloadplbtn" class="downloadplbtn" data-position="${position}">details</button>
                                        </div>
                                    </div>
                                </div>
                            `;
                    ent.innerHTML += el;
                })
                AndPlaySingle(entries)
                document.getElementsByClassName("upbtn")[0].addEventListener("click", (e) => {
                    const uploadp = document.getElementById("upbtn")
                    uploadContent(title, thumbnail, discrip, urls, source, "playlist", uploadp)
                    uploadp.style.background = "gray"
                    uploadp.innerHTML = `<i>uploading...</i>`
                })
            } catch (e) {
                console.log(e)
                alerts("something went wong", 3000)
                // historyRender(DData, isPublic, "video", element)
            }
        }
    }
}

async function share(from, id = {one: null, two: null}, title = "share downzilla") {
    let path;
    if (from == "public") {
        path = `https://downzilla-backend.onrender.com/shared/feed/${id.one}`
    } else if (from == "private") {
        path = `https://downzilla-backend.onrender.com/shared/private/${id.one}/${id.two}`
    }

    await navigator.share({
        url: path,
        title: title,
    })
}

let uploadDataStored;

function saveUploadData(data = {a: null, b: null, c: null, d: null, e: null, f: null, g: null}, check = false) {
    
    if (check) {
        uploadDataStored = data
    } else if (!check) {
        uploadContent(uploadDataStored.a, uploadDataStored.b, uploadDataStored.c, uploadDataStored.d, uploadDataStored.e, uploadDataStored.f, uploadDataStored.g)
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

export {videodis, playListdis, playlistPopup, historyRender, share, saveUploadData }
