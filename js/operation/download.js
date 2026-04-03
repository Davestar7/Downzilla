import { routes, loader, icons } from "../../UI-components/env/env.js"
import {videodis, playListdis, playlistPopup} from "./downloadDis.js"
import { alert } from "../../UI-components/popup.js"
import { isConnected, closeFunction } from "../alert.js"
import { uploadHistory } from "../interact/history.js"
import { formatPasser } from "./streamvideo.js";

function callsearch() {
    const searchbtn = document.getElementById("searchvid")
    searchbtn.classList.add("searchvid")
    const searchbtnC = document.getElementsByClassName("searchvid")[0]
    var fromlocal = localStorage.getItem("DZDP")
    loadParam()
    if (fromlocal) {
        inputCon()
    }
    if (searchbtn == null) {
        setTimeout(() => {
            callsearch()
        }, 2000)
    } else {
        searchbtnC.addEventListener("click", () => {
            searchbtn.classList.remove("searchvid")
            searchbtn.innerText = "loading..."
            inputCon()
        })
    }
}

function inputCon() {
    isConnected()
    let input = document.getElementById('downloadinput')
    let alet = document.getElementById("inal")

    let inputData = input.value.trim().toString()
    let ur = localStorage.getItem("DZDP")

    if (inputData == "" && ur == null) {
        alet.innerHTML = "the url field is empty!!!"
        return
    }
    alet.innerHTML = ""
    if (inputData === "") {
        const ret = `<ol id="steps">
                        <li>copy url link of video from site</li>
                        <li>paste in option above</li>
                        <li>click on search</li>
                        <li>if url is valid download details wil display</li>
                    </ol>`;
        document.getElementById("resultdis").innerHTML = ret;
        return
    }
    condit(inputData)
    setTimeout(() => {
        if (ur == null) {
            window.localStorage.setItem("DZDP", inputData)
        } else {
            if (inputData != ur) {
                if (inputData != "") {
                    window.localStorage.setItem("DZDP", inputData)
                }
            }
            inputData = ur
        }
        // input.value = inputData;
    }, 1000);
    
}

function condit(val) {
    const par = new URL(window.location.href)
    const param = par.searchParams.get("dopt")
    let servedetails;
    if (param === null) {
        servedetails = "mp4"
        let mpv = document.getElementById("mpv")
        mpv.classList.add("optactive")
    } else {
        servedetails = param;
    }

    if (servedetails == "mp4") {
        beginQuery(val, "video")
    } else if (servedetails === "mp3") {
        beginQuery(val, "audio")
    } else if (servedetails === "mp4list") {
        beginQuery(val, "playlist")
    }
    
}

function loadParam() {  
    let mpv = document.getElementById("mpv")
    let mpl = document.getElementById("mpl")
    let mpa = document.getElementById("mpa")
    const par = new URL(window.location.href)
    const param = par.searchParams.get("dopt")
    if (param == "mp4" ||param === null) {
        mpv?.classList.add("optactive")
        mpa?.classList.remove("optactive")
        mpl?.classList.remove("optactive")
        videodis(null, false)
    } else if (param === "mp3") {
        mpa.classList.add("optactive")
        videodis(null, true)
    } else if (param === "mp4list") {
        mpl.classList.add("optactive")
    }

    mpv?.addEventListener("click", () => {
        const url = new URL(window.location.href)
        url.searchParams.set("dopt", "mp4")
        window.history.pushState({}, "", url.href)
        loadParam()
        mpv.classList.add("optactive")
        mpl.classList.remove("optactive")
        mpa.classList.remove("optactive")
    })
    mpl?.addEventListener("click", () => {
        const url = new URL(window.location.href)
        url.searchParams.set("dopt", "mp4list")
        window.history.pushState({}, "", url.href)
        loadParam()
        mpv.classList.remove("optactive")
        mpl.classList.add("optactive")
        mpa.classList.remove("optactive")
    })
    mpa?.addEventListener("click", () => {
        const url = new URL(window.location.href)
        url.searchParams.set("dopt", "mp3")
        window.history.pushState({}, "", url.href)
        loadParam()
        mpv.classList.remove("optactive")
        mpl.classList.remove("optactive")
        mpa.classList.add("optactive")
    })
}

function queryLoadable(word = "loading") {
    const element = `
                        <div id="loaderdiv">
                            ${loader(word)}  <br>
                            <button id="cancelbtn" class="cancelbtn">Cancel</button>
                        </div>
                    `
    return element
}

async function cancelListerner(id) {
    const btn = document.getElementsByClassName("cancelbtn")[0]
    const btnId = document.getElementById("cancelbtn")
    btn.addEventListener("click", async (e) => {
        btn.innerHTML = "canceling...",
        btnId.classList.remove("cancelbtn")
        btnId.style.background = "white"
        console.log("cancel id: " + id)

        const can = await fetch(routes.cancelQuery, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({id: id})
        })
        const canceled = await can.json()
        if (canceled.success !== true) {
            alert("failed to cancel: " + canceled.message, 7000)
            btnId.classList.add("cancelbtn")
            btnId.style.background = "rgb(252, 244, 234)"
            btnId.innerHTML= "Cancel"
            return
        }

        alert("Cancelled successfully")
        callsearch()
    })  
}

async function getFormat(url, source) {
    try {
        const qformat = await fetch(routes.getDData, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({url: url}),
            credentials: "include"
        })

        const res = await qformat.json()
        const resp = await res     
        if (source == "playlist") {
            playlistPopup(resp, url)
        }
    } catch (e) {
        console.log(`error: `+ e)
        alert(e.message, 8000)
        closeFunction()
    }
}

async function beginQuery(url, use, path = null) {
    if (path === null) {
        document.getElementById("resultdis").innerHTML = loader("querying please wait...")
    } else {
        path.innerHTML = loader("querying please wait...")
    }
    const q = await fetch(routes.startQuery, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({url: url})
    })
    const r = await q.json()
    const id = r.data
    console.log(`gotten query id: ${id}`)

    if (use === "video") {
        getVideoData(id, false)
    } else if (use === "audio") {
        getVideoData(id, true)
    } else if (use === "playlist") {
        getPlayList(id)
    }
}

async function getVideoData(id, mptrue = false) {
    isConnected()
    document.getElementById("resultdis").innerHTML = queryLoadable("loading data please wait...")
    let inputData = id
    console.log(`id: ${inputData}`)
    cancelListerner(id)
    if (inputData === "") {
        alert("url not found", 7000)
        return
    }
    
    try {
        const data = await fetch(routes.getDData, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({id: inputData, ifTime: "notnull"})
        })
        const datas = await data.json()
        const jsonData = await datas
        console.log(jsonData)
        videodis(jsonData, mptrue)
        const searchbtn = document.getElementById("searchvid")
        searchbtn.classList.add("searchvid")
        searchbtn.innerHTML = icons.SEARCHICON
    } catch (e) {
        console.log(e)
        alert("check internet connection", 2000)
        isConnected()
        const searchbtn = document.getElementById("searchvid")
        searchbtn.classList.add("searchvid")
        searchbtn.innerHTML = icons.SEARCHICON
    }


}

async function getPlayList(id) {
    document.getElementById("resultdis").innerHTML = queryLoadable("loading playlist data please wait...")
    isConnected()

    let inputUrl = id.toString()
    cancelListerner(id)

    try {
        const data = await fetch(routes.beginPlaylist, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({id: inputUrl})
        })
        const list = await data.json()
        const lists = await list
        playListdis(lists)
        const searchbtn = document.getElementById("searchvid")
        searchbtn.classList.add("searchvid")
        searchbtn.innerHTML = icons.SEARCHICON
    } catch (e) {
        console.log(e)
        alert("check internet connection", 2000)
        const searchbtn = document.getElementById("searchvid")
        searchbtn.classList.add("searchvid")
        searchbtn.innerHTML = icons.SEARCHICON
    }
}

async function downloadVideo(outurl, title, start, end, format, from = null) {
    isConnected()
    let btn = document.getElementsByClassName("clicked")[0]

    if (from == "history") {
        btn = document.getElementsByClassName("dnbtn")[0]
    }
    btn.innerHTML = `<i>awaiting download...</i>`
    
    const FSelect = document.getElementById("forSel")
    const url = outurl
    const select = FSelect.value;
    const height = FSelect.options[FSelect.selectedIndex].innerText

    const perferedFormats = formatPasser.selectedFormats || format
    console.log(`format to be sent: ${perferedFormats[0]}`)

    console.log(`height: ${select}`)
    console.log(start, "-to-", end)

    let audioF;
    let audio_id
    format.forEach(e => {
        if (e.resolution == "audio only" && e.vcodec === "none" && !e.format_note) {
            audioF = e
            audio_id = audioF.format_id || null
        }
    });

    console.log(`format and audio id: ${audio_id}+${select}`)
    
    try {
        fetch(routes.beginD, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({url, format_id: select, title, start, end, formats: perferedFormats, height: height}),
            credentials: "include"
        }).then(res => {
            if (!res.ok) {
                alert("download failed, please try again")
                btn.innerHTML = "download mp4 video"
                if (from === "frommp4" || from === null) {
                    btn.classList.add("dnbtn")
                    btn.classList.remove("clicked")
                } else if (from === "fromplay") {
                    btn.classList.add("dnbtnp")
                    btn.classList.remove("clicked")
                }
                return
                // throw new Error("download failed");
            }
            return res.blob()
        }).then(async blob => {
            const text = await blob.text()
            if (text.success && text.success === false) {
                alert(blob.message, 5000)
                btn.innerHTML = "retry download mp4 video"
                if (from === "frommp4" || from === null) {
                    btn.classList.add("dnbtn")
                    btn.classList.remove("clicked")
                } else if (from === "fromplay") {
                    btn.classList.add("dnbtnp")
                    btn.classList.remove("clicked")
                }
                return
            }

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob)
            link.download = `${title || "video"}-downzilla.mp4`
            link.click();
            alert("download should begin", 5000)
            btn.innerHTML = "download mp4 video"
            if (from === "frommp4" || from === null) {
                btn.classList.add("dnbtn")
                btn.classList.remove("clicked")
            } else if (from === "fromplay") {
                btn.classList.add("dnbtnp")
                btn.classList.remove("clicked")
            }
            localStorage.removeItem("DZDP")
        })
    } catch (e) {
        console.log("cought error: ",e)
        alert("error occured: check internet connection", 4000)
        if (from === "frommp4" || from === null) {
            btn.classList.add("dnbtn")
            btn.classList.remove("clicked")
        } else if (from === "fromplay") {
            btn.classList.add("dnbtnp")
            btn.classList.remove("clicked")
        }
    }
}

// async function downloadPlaylist(playurl, title, ent) {
//     const url = playurl;
//     const playlisttitle = title;
//     console.log("begin download")
//     document.getElementById("zPlayD").addEventListener("click", async () => {
//         document.getElementById("zPlayD").innerHTML = `<i>loading download...</i>`
//         console.log("download zip folder")
//         closeFunction()
        
//     })
// }

async function downloadmp(url, title, from, format_id, ext, format, des, su) {
    console.log("about to fetch")
    const preferedAformat = formatPasser.selectedFormats
    const res = await fetch(routes.downloadmp, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({url: url, title: title, format_id: format_id, ext: ext, formats: preferedAformat})
    })
    console.log("done fetching")
    
    let element;

    if (!res.ok) {
        const resp = await res.text()
        console.log(resp)
        alert(`download failed: ${resp}`)
        if (from == "basic") {
            element = document.getElementById("dnbtn")
            element.classList.remove("clicked")
            element.classList.add("dnbtn")
            element.innerHTML = "Download audio"
        } else if (from == "play") {
            element = document.getElementById("dnbtnmic")
            element.classList.remove("clicked")
            element.classList.add("mibtn")
            element.innerHTML = "Download audio"
        } else if (from == "history") {
            element = document.getElementsByClassName("mbtn")[0]
            element.classList.remove("clicked")
            // element.classList.add("mbtn")
            element.innerHTML = "Download audio"
        }
        return
    }

    const blob = await res.blob()
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `${title}-downzilla.${ext || "mp3"}`
    link.click()
    URL.revokeObjectURL(link.href)
    if (from == "basic") {
        element = document.getElementById("dnbtn")
        element.classList.remove("clicked")
        element.classList.add("dnbtn")
        alert("download should begin", 3000)
        element.innerHTML = "Download audio"
    } else if (from = "play") {
        element = document.getElementById("dnbtnmic")
        element.classList.remove("clicked")
        element.classList.add("mibtn")
        alert("download should begin", 3000)
        element.innerHTML = "Download audio"
    }
    uploadHistory(title, des, url, su, "video")
}

// async function zippaydownload(ent, playtitle) {
//     try {
//         await fetch(routes.downloadplay, {
//             method: "POST",
//             headers: {"Content-Type": "application/json"},
//             body: JSON.stringify({data: ent, title: playtitle}),
//             credentials: "include"
//         }).then(res => {
//             if (!res.ok) {
//                 alert("something when wong downloading please try again", 3000)
//                 console.log("failed: ", res)
//                 document.getElementById("dnbtnp").innerHTML = "Re-try download playlist"
//                 document.getElementById("dnbtnp").classList.remove("clicked")
//                 document.getElementById("dnbtnp").classList.add("dnbtn")
//                 return
//             }
//             return res.blob()
//         }).then(blob => {
//             if (blob.success && blob.successs == false) {
//                 alert(blob.message, 4000)
//                 console.log("failed to download blob: ", blob)
//                 document.getElementById("dnbtnp").innerHTML = "Re-try download playlist"
//                 document.getElementById("dnbtnp").classList.remove("clicked")
//                 document.getElementById("dnbtnp").classList.add("dnbtn")
//                 return
//             }
//             const link = document.createElement("a")
//             link.href = URL.createObjectURL(blob)
//             link.download = `${playtitle}_downzilla.zip`;
//             link.click()
//             console.log("download begin")
//             alert("download should begin", 3000)
//             document.getElementById("dnbtnp").innerHTML = 'Download playlist to zip'
//             document.getElementById("dnbtnp").classList.remove("clicked")
//             document.getElementById("dnbtnp").classList.add("dnbtn")
//         }) 
//     } catch (e) {
//         console.log(e)
//     }
// }

export {callsearch, downloadVideo, loadParam, getFormat, downloadmp, queryLoadable, cancelListerner }