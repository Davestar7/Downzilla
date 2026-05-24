import { routes, loader, icons } from "../../UI-components/env/env.js"
import {videodis, playListdis, playlistPopup} from "./downloadDis.js"
import { alert, uiLoader } from "../../UI-components/popup.js"
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

function normalizeUrl(input) {
  const parsed = new URL(input);

  const isYoutube =
    parsed.hostname.includes("youtube.com") ||
    parsed.hostname.includes("youtu.be");

  if (isYoutube) {
    parsed.searchParams.delete("si");
    parsed.searchParams.delete("feature");
    parsed.searchParams.delete("pp");
  }

  return parsed.toString();
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
                            <li>copy url link of video or playlist from site</li>
                            <li>paste in available input option above</li>
                            <li>select the accurate option for the url, if link is for single video select <em>"mp4"</em> if for playlist select <em>"playlist"</em> if you want to get only audio from video link select <em>"mp3"</em> <br> - <em>the mp3 option -audio download option- works only with video links only, playlist links are not directly supported </em></li>
                            <li>Next - click on search</li>
                            <li>Be patient while it loads, it might take up to few seconds</li>
                            <li>if url is valid download details wil display <em>--you can watch the streamed video directly</em></li>
                            <li>select a good video format <em>-qualify-</em> download <em>--recomended format choose between 144p to 480p unless you need a higher quality in HD then select a higher format</em></li>
                            <li>if it a playlist first select a video among the list, you'll get that video data then select a format</li>
                            <li>then click on download <em>--wait a little for the procces to finish please at this point don't refresh the page</em></li>
                        </ol>`;
        document.getElementById("resultdis").innerHTML = ret;
        return
    }
    const inputfit = normalizeUrl(inputData)
    input.value = inputfit
    condit(inputfit)
    setTimeout(() => {
        if (ur == null) {
            window.localStorage.setItem("DZDP", inputfit)
        } else {
            if (inputfit != ur) {
                if (inputfit != "") {
                    window.localStorage.setItem("DZDP", inputfit)
                }
            }
            inputfit = ur
        }
        // input.value = inputfit;
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
    }, { once: true })  
}

async function getFormat(id, source, url) {
    try {
        const qformat = await fetch(routes.getDData, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id: id}),
            credentials: "include"
        })

        const res = await qformat.json()
        const resp = await res     
        if (source == "playlist") {
            playlistPopup(resp, url)
        }
    } catch (e) {
        
        alert(e.message, 8000)
        closeFunction()
    }
}

async function beginQuery(url, use, path = null, ifpop=false) {
    if (!path) {
        document.getElementById("resultdis").innerHTML = loader("querying please wait...")
    } else {
        path.innerHTML = loader("querying please wait...")
    }

    let type = use
    if (ifpop === true) {
        type = "video"
    }
    
    const q = await fetch(routes.startQuery, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({url: url, type: type})
    })
    const r = await q.json()
    const id = r.data
   
    if (ifpop === true) {
        if (use === "popplaylist") {
            getFormat(id, "playlist", url)   
        }
    } else {
        if (use === "video") {
            getVideoData(id, false)
        } else if (use === "audio") {
            getVideoData(id, true)
        } else if (use === "playlist") {
            getPlayList(id)
        }
    }
}

async function getVideoData(id, mptrue = false) {
    isConnected()
    document.getElementById("resultdis").innerHTML = queryLoadable("loading data please wait...")
    
    cancelListerner(id)
    if (id === "") {
        alert("url not found", 7000)
        return
    }
    
    try {
        const data = await fetch(routes.getDData, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({id: id, ifTime: "notnull"})
        })
        const datas = await data.json()
        const jsonData = await datas
        
        videodis(jsonData, mptrue)
        const searchbtn = document.getElementById("searchvid")
        searchbtn.classList.add("searchvid")
        searchbtn.innerHTML = icons.SEARCHICON
        localStorage.removeItem("DZDP")
    } catch (e) {
        
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
        localStorage.removeItem("DZDP")
    } catch (e) {
        alert("check internet connection", 2000)
        const searchbtn = document.getElementById("searchvid")
        searchbtn.classList.add("searchvid")
        searchbtn.innerHTML = icons.SEARCHICON
    }
}

async function downloadVideo(outurl, title, start, end, format, from = null, headers, selected = null) {
    isConnected()
    let btn = document.getElementsByClassName("clicked")[0]

    if (from == "history") {
        btn = document.getElementsByClassName("dnbtn")[0]
    }
    btn.innerHTML = `<i>awaiting download...</i>`
    if (!selected) {
        uiLoader(true, false, "downloading......")
    }

    const FSelect = document.getElementById("forSel") || selected
    const url = outurl
    const select = FSelect?.value;
    const height = FSelect?.options[FSelect?.selectedIndex]?.innerText
    const rawHeight = FSelect.options[FSelect?.selectedIndex]?.dataset?.height
    const perferedFormats = formatPasser?.selectedFormats || format

    try {
        // Step 1 - Start download
        const { success, jobId } = await fetch(routes.beginD, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({url, format_id: select, title, start, end, formats: perferedFormats, height: rawHeight, headers}),
            credentials: "include"
        }).then(r => r.json());

       console.log(success)
       console.log(jobId)

        if (!success || !jobId) {
            alert("download failed, please try again");
            btn.innerHTML = "download mp4 video";
            if (from === "frommp4" || from === null) {
                btn.classList.add("dnbtn");
                btn.classList.remove("clicked");
            } else if (from === "fromplay") {
                btn.classList.add("dnbtnp");
                btn.classList.remove("clicked");
            }
            uiLoader(false, true);
            return;
        }

        btn.innerHTML = `<i>processing download...</i>`;

        // Step 2 - Poll every 15 seconds
        const poll = setInterval(async () => {
            try {
                const result = await fetch(`${routes.dCheck}?jobId=${jobId}`, {
                    credentials: "include"
                }).then(r => r.json());

                // Still processing - keep waiting
                if (result.status === "processing") {
                    btn.innerHTML = `<i>still processing...</i>`;
                    return;
                }

                // Failed - stop polling
                if (result.status === "failed" || !result.success) {
                    clearInterval(poll);
                    alert("download failed, please try again");
                    btn.innerHTML = "download mp4 video";
                    if (from === "frommp4" || from === null) {
                        btn.classList.add("dnbtn");
                        btn.classList.remove("clicked");
                    } else if (from === "fromplay") {
                        btn.classList.add("dnbtnp");
                        btn.classList.remove("clicked");
                    }
                    uiLoader(false, true);
                    return;
                }

                // Done - stop polling and download
                if (result.status === "done" && result.done) {
                    clearInterval(poll);

                    const link = document.createElement("a");
                    link.href = `${routes.download}?jobId=${jobId}`;
                    link.download = `${title || "video"}-downzilla.mp4`;
                    link.click();

                    alert("download should begin", 5000);
                    btn.innerHTML = "download mp4 video";
                    if (from === "frommp4" || from === null) {
                        btn.classList.add("dnbtn");
                        btn.classList.remove("clicked");
                    } else if (from === "fromplay") {
                        btn.classList.add("dnbtnp");
                        btn.classList.remove("clicked");
                    }
                    uiLoader(false, true);
                    localStorage.removeItem("DZDP");
                }

            } catch (e) {
                clearInterval(poll);
                alert("error checking download status");
                btn.innerHTML = "download mp4 video";
                if (from === "frommp4" || from === null) {
                    btn.classList.add("dnbtn");
                    btn.classList.remove("clicked");
                } else if (from === "fromplay") {
                    btn.classList.add("dnbtnp");
                    btn.classList.remove("clicked");
                }
                uiLoader(false, true);
            }
        }, 15000);

    } catch (e) {
        alert("error occured: check internet connection", 4000);
        if (from === "frommp4" || from === null) {
            btn.classList.add("dnbtn");
            btn.classList.remove("clicked");
        } else if (from === "fromplay") {
            btn.classList.add("dnbtnp");
            btn.classList.remove("clicked");
        }
        uiLoader(false, true);
    }
}

// async function downloadPlaylist(playurl, title, ent) {
//     const url = playurl;
//     const playlisttitle = title;
//     console.log("begin download")
//     document.getElementById("zPlayD")?.addEventListener("click", async () => {
//         document.getElementById("zPlayD").innerHTML = `<i>loading download...</i>`
//         console.log("download zip folder")
//         closeFunction()
        
//     })
// }

async function downloadmp(url, title, from, format_id, ext, format, des, su, header) {

    uiLoader(true, false, "downloading...")

    const preferedAformat = formatPasser?.selectedFormats
    let element;

    const resetBtn = () => {
        if (from === "basic") {
            element = document.getElementById("dnbtn")
            element.classList.remove("clicked")
            element.classList.add("dnbtn")
            element.innerHTML = "Download audio"
        } else if (from === "play") {
            element = document.getElementById("dnbtnmic")
            element.classList.remove("clicked")
            element.classList.add("mibtn")
            element.innerHTML = "Download audio"
        } else if (from === "history") {
            element = document.getElementsByClassName("mbtn")[0]
            element.classList.remove("clicked")
            element.innerHTML = "Download audio"
        }
    }

    try {
        // Step 1 - Start download
        const { success, jobId } = await fetch(routes.downloadmp, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({url, title, format_id, ext, formats: preferedAformat, headers: header})
        }).then(r => r.json());

        if (!success || !jobId) {
            alert("download failed, please try again");
            resetBtn();
            uiLoader(false, true);
            return;
        }

        if (from === "basic") {
            document.getElementById("dnbtn").innerHTML = "<i>processing...</i>"
        } else if (from === "play") {
            document.getElementById("dnbtnmic").innerHTML = "<i>processing...</i>"
        } else if (from === "history") {
            document.getElementsByClassName("mbtn")[0].innerHTML = "<i>processing...</i>"
        }

        // Step 2 - Poll every 15 seconds
        const poll = setInterval(async () => {
            try {
                const result = await fetch(`${routes.comfirmmp}?jobId=${jobId}`, {
                    credentials: "include"
                }).then(r => r.json());

                // Still processing - keep waiting
                if (result.status === "processing") {
                    if (from === "basic") {
                        document.getElementById("dnbtn").innerHTML = "<i>still processing...</i>"
                    } else if (from === "play") {
                        document.getElementById("dnbtnmic").innerHTML = "<i>still processing...</i>"
                    } else if (from === "history") {
                        document.getElementsByClassName("mbtn")[0].innerHTML = "<i>still processing...</i>"
                    }
                    return;
                }

                // Failed - stop polling
                if (result.status === "failed" || !result.success) {
                    clearInterval(poll);
                    alert("download failed, please try again");
                    resetBtn();
                    uiLoader(false, true);
                    return;
                }

                // Done - stop polling and download
                if (result.status === "done" && result.done) {
                    clearInterval(poll);

                    const link = document.createElement("a");
                    link.href = `${routes.downmp}?jobId=${jobId}`;
                    link.download = `${title}-downzilla.${ext || "mp3"}`;
                    link.click();

                    alert("download should begin", 3000);
                    resetBtn();
                    uiLoader(false, true);
                    uploadHistory(title, des, url, su, "video");
                }

            } catch (e) {
                clearInterval(poll);
                alert(`Error: ${e.message}`);
                resetBtn();
                uiLoader(false, true);
            }
        }, 15000);

    } catch (e) {
        uiLoader(false, true);
        alert(`Error: ${e.message}`);
        resetBtn();
    }
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

export {callsearch, downloadVideo, loadParam, getFormat, downloadmp, queryLoadable, cancelListerner, beginQuery }