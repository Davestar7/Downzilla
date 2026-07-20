import { icons, routes } from "../../UI-components/env/env.js";
import { alert } from "../../UI-components/popup.js";

async function streamVideoFunction(formats, url, title, headers, thumbnail, vid = null) {
    let height;
    formats?.forEach(f => {
        if (f.height && f.height >= 240 && f.height <= 480 && f.resolution !== "audio only") {
            height = f.height
        }
    })

    alert("sponsors about to redirect")
    try {
        const start = await fetch(routes.startStream, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({url: url, title: title, headers: headers, formats: formats, height: height, vid: vid})
        })

        // FIX: fetch only rejects on network failure, not on HTTP error status.
        // A 401/500/etc still resolves here — check status explicitly.
        if (!start.ok) {
            let msg = `server responded with ${start.status}`
            try {
                const errBody = await start.json()
                if (errBody?.message) msg = errBody.message
            } catch (_) { /* body wasn't JSON, keep default msg */ }
            alert("unable to play video, fix in progress 😓")
            return
        }

        const fin = await start.json()
        if (fin.success != true) {
            alert("unable to play video: " + fin.message)
            return
        }
        const id = fin.data

        const videoCon = `
                    <video poster="${thumbnail}" id="vimg" alt="${title}" title="downzilla-${title}" controls width="100%">
                        <source src="${routes.Stream}?sid=${id}" type="video/mp4">
                        No Browser support for this Element
                    </video>    
                    `
        const ele = document?.getElementById("img-vid")
        const plpop = document?.getElementById("popimg")

        if (ele) ele.innerHTML = videoCon
        if (plpop) plpop.innerHTML = videoCon // FIX: was `ele.innerHTML` — plpop was never actually updated

        // FIX: the <video>/<source> load is a native browser request, not a fetch —
        // errors there (401/500 from the stream endpoint) never hit this try/catch.
        // Without this listener, a failed stream fails completely silently.
        const videoEl = document?.getElementById("vimg")
        if (videoEl) {
            videoEl.addEventListener('error', () => {
                console.log('video element failed to load stream, sid:', id)
                alert("streaming failed, please try again 😓")
            })
        }

    } catch (e) {
        console.log(`failed to stream because DEBUG ${e}`)
        alert("mmm, streaming failed, fix in progress 😓")
    }
    setTimeout(() => {
        window.open("https://omg10.com/4/11056236", "_blank");
    }, 10600);
}
const universalFormat = new Set([144, 240, 360, 480, 720, 1080])

const formatPasser = {
    allFormats: [],
    selectedFormats: []
}

function updateSelectableFormat(type = "video") {
    formatPasser.allFormats = []
    formatPasser.selectedFormats = []
    const availableFormats = window?.availableFormats
    formatPasser.allFormats = availableFormats
    switch (type) {
        case "audio":
            audio()
            break;
        case "video":
            video()
        break;
        default:
           alert(`type of ${type} not found`)
        break;
    }
    
    function audio() {
        const select = document?.getElementById("forSel")
        const infobtn = document.getElementById("forInfo")
        select.innerHTML = "";
        
        let check;
        availableFormats?.forEach(fmt => {
            const option = document?.createElement("option");
            option.value = `${fmt.format_id} ${fmt.ext}`

            let label = ""
            if (check === fmt.format_id) {
                return
            }
            if (fmt.format_id && fmt.vcodec === "none" && fmt.acodec && fmt.acodec!= "none") {
                
                if (fmt.format_id != check) {
                    label += `${fmt.format_id}p ${fmt.ext}`;
                    check = fmt.format_id
                } else {
                    return
                }

                if (fmt.acodec && fmt.acodec === "none") {
                    label += "- audio";
                    // document.getElementById("vimg").src = fmt.url
                }
                option.text = label
                
                select.appendChild(option)
                formatPasser.selectedFormats.push(fmt)
            }
        });
        
    }
    function video() {
        const select = document.getElementById("forSel")
        const infobtn = document.getElementById("forInfo")

        select.innerHTML = "";

        pushAudio()
        let check;
        availableFormats?.forEach(fmt => {
            const option = document.createElement("option");
            option.value = fmt.format_id

            let label = ""
            if (check === fmt.height) {
                return
            }
            if (fmt.vcodec !== "none" && fmt.acodec && fmt.abr && fmt.abr !== null && fmt.ext !== "mp4") {
                select.text = `, ${fmt.abr}kbps`;
                return
            }

            if (universalFormat.has(fmt.height)) {
                if (fmt.ext == "webm" || fmt.video_ext == "webm") return 

                if (fmt.height && fmt.height >= 144 && fmt.height != check && fmt.abr != null) {
                    label += `${fmt.height}p ${fmt.ext}`;
                    check = fmt.height
                    
                } else {
                    return
                }

                if(fmt.height >= 1080) label += "(FULL HD)";
                else if(fmt.height >= 720) label += "HD";

                if (fmt.acodec && fmt.acodec !== "none") {
                    label += "- video + audio";
                    // document.getElementById("vimg").src = fmt.url
                } else {
                if (fmt.height != check) label += "-video"
                }
                option.text = label
                
                option.dataset.height = fmt.height
                select.appendChild(option)
                formatPasser.selectedFormats.push(fmt)
            } else {
                return
            }
        });
    }

}

function pushAudio() {
    
    let check = window.availableFormats.filter(fmt => fmt.vcodec === "none" && fmt.acodec && fmt.acodec !== "none") || []

    if (check.length >= 6) {
        check = justEight(check)
    }

    formatPasser.selectedFormats.push(...check)
}

function justEight(f = []) {
    let data = []
    f.forEach((e, i) => {
        if (i+1 >= 6) {
            return
        } else {
            data.push(e)
        }
    })
    return data
}

function updateDiscription(dis = "", ele) {
    defaultDis()
    function defaultDis() {
        ele.innerHTML = ""
        const d = dis.slice(0, 55)

        const uiDis = `${d}...  <button id="all">${icons.DROP}</button>`
        ele.innerHTML = uiDis
        fullDiscription(dis, ele)
    }

    function fullDiscription() {
        document.getElementById("all").addEventListener("click", () => {
            const disArr = dis.split(" ")
            let newDis = "";

            disArr.forEach(e => {
                if (e.includes("https://") || e.includes("http://")) {
                    newDis += `<a href="${e}" target="_blank">${e}</a> `
                } else {
                    newDis += `${e} `
                }

                if (e.includes("\n")) {
                    newDis += `<br>`
                }
            })
            ele.innerHTML = `${newDis}   <button id="less">${icons.CLOSE}</button>`
            document.getElementById("less").addEventListener("click", () => {
                defaultDis()
            })
        })

    }
}

function generateThumbnailContainer(containerPath, thumbnailUrl) {
 
  const target = document.querySelector(containerPath);

  if (!target) {
    
    return;
  }

  
  const html = `
    <div class="gc-card" style="
      width: 100%;
      height: 35vh;
      min-height: inherit;
      position: relative;
      overflow: hidden;
      border-radius: 12px;
      background-image: url('${CSS.escape ? thumbnailUrl : thumbnailUrl}');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding-bottom: 24px;
      box-sizing: border-box;
    ">

      <div style="
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to bottom,
          transparent 40%,
          rgba(0, 0, 0, 0.55) 100%
        );
        pointer-events: none;
      "></div>

      <button
        id="gc-watch-btn"
        style="
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          border: 2px solid purple;
          border-radius: 50px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          color: #ffffff;
          font-family: 'Segoe UI', system-ui, sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            transform 0.15s ease,
            box-shadow 0.2s ease;
          box-shadow: 0 0 18px rgba(0, 200, 83, 0.35);
          white-space: nowrap;
        "
        onmouseover="
          this.style.background='rgba(0,200,83,0.22)';
          this.style.boxShadow='0 0 28px rgba(0,200,83,0.6)';
          this.style.transform='scale(1.04)';
        "
        onmouseout="
          this.style.background='rgba(255,255,255,0.12)';
          this.style.boxShadow='0 0 18px rgba(0,200,83,0.35)';
          this.style.transform='scale(1)';
        "
      >
        <svg
          width="16" height="16" viewBox="0 0 24 24"
          fill="currentColor" xmlns="http://www.w3.org/2000/svg"
          style="flex-shrink:0;"
        >
          <path d="M8 5v14l11-7z"/>
        </svg>
        Watch
      </button>

    </div>
  `;

  target.innerHTML = html;
}

export {updateSelectableFormat, formatPasser, updateDiscription, streamVideoFunction, generateThumbnailContainer}
