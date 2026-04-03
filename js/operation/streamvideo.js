import { icons } from "../../UI-components/env/env.js";

function streamVideoformat(formats) {
    let format;
    let url;
    formats.forEach(f => {
        console.log(f)
        if (f.height && f.height >= 240 && f.height <= 720 && f.resolution !== "audio only") {
            url = f.url;
            format = f.format_id
        }
    })

    return {
        format: format,
        url: url
    }
}

const universalFormat = new Set([144, 240, 360, 480, 720, 1080])

const formatPasser = {
    allFormats: [],
    selectedFormats: []
}

function updateSelectableFormat(type = "video") {
    formatPasser.allFormats = []
    formatPasser.selectedFormats = []
    const availableFormats = window.availableFormats
    formatPasser.allFormats = availableFormats
    switch (type) {
        case "audio":
            audio()
            break;
        case "video":
            video()
        break;
        default:
           console.log(`type of ${type} not found`)
        break;
    }
    
    function audio() {
        const select = document.getElementById("forSel")
        const infobtn = document.getElementById("forInfo")
        select.innerHTML = "";
        
        let check;
        availableFormats.forEach(fmt => {
            const option = document.createElement("option");
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
        availableFormats.forEach(fmt => {
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
                
                select.appendChild(option)
                formatPasser.selectedFormats.push(fmt)
            } else {
                return
            }
        });
    }

}

function pushAudio() {
    console.log("called push audio")
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
        const d = dis.slice(0, 55)

        const uiDis = `${d}...  <button id="all">${icons.DROP}</button>`
        ele.innerHTML = uiDis
        fullDiscription(dis, ele)
    }

    function fullDiscription() {
        document.getElementById("all").addEventListener("click", () => {
            const disArr = dis.split(" ")
            let newDis;

            disArr.forEach(e => {
                if (e.includes("https://") || e.includes("http://")) {
                    newDis += `<a href="${e}" target="_blank">${e}</a> `
                } else {
                    newDis += `${e} `
                }
            })
            ele.innerHTML = `${newDis}   <button id="less">${icons.CLOSE}</button>`
            document.getElementById("less").addEventListener("click", () => {
                defaultDis()
            })
        })

    }
}

export {updateSelectableFormat, formatPasser, updateDiscription}