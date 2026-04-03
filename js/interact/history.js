import {routes, loader} from "../../UI-components/env/env.js"
import { userData } from "../auth/afterauth.js"
import { islogedIn } from "../checkuserlogin.js";
import { popUp, alert } from "../../UI-components/popup.js";

async function uploadContent(title, thumbnail, description, url, source, type, from) {

    upload()

    async function upload() {
        const userId = userData.userId;
        const username = userData.username

        if (islogedIn() !== true) {
            alert("need to login to upload", 5000)
            popUp()
            return
        }

        console.log(`${username} of id ${userId} to upload ${title} from ${source} of description ${description} and url ${url} of type ${type}`)
    
        const upresp = await fetch(routes.uploadfeed, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({userId: userId, uploadername: username, url: url, thumbnail: thumbnail, title: title, description: description, source: source, type: type}),
            credentials: "include"
        })

        const uploadResponse = await upresp.json()
        if (uploadResponse.success != true) {
            alert(`upload failed: ${uploadResponse.message}`)
            if (from != null) {
                from.innerHTML = "Upload"
                from.style.background = "white"
            }
        } else {
            alert("uploaded successfully", 3000)
            localStorage.removeItem("toUpload")
            if (from != null) {
                from.innerHTML = "Uploaded"
                from.style.background = "white"
            }
        }

    }
}

async function uploadHistory(title, description, url, source, type, img) {

    if (islogedIn() !== true) {
        setTimeout(() => {
            popUp()
            alert("please login or signup to Downzilla")
        }, 2000);
        const htoString = `${title}>${description || "no description"}>${url}>${source}>${type}`
        console.log(htoString)
        localStorage.setItem("historyD", htoString)
        retry(islogedIn(), title, description, url, source, type, img)
        return
    }

    console.log("history: "+ title + "of id: "+ userData.userId)

    const res = await fetch(routes.uploadHistory, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: userData.userId, url: url, title: title, description: description, source: source, type: type, thumbnail: img}),
        credentials: "include"
    })

    const response = await res.json()
    console.log(response)
    if (response.success != true) {
        alert(response.message)
        const htoString = `${title}>${description}>${url}>${source}>${type}>${img}`
        console.log(htoString)
        localStorage.setItem("historyD", htoString)
        return
    } else {
        localStorage.removeItem("historyD")
    }

}

function retry(pass, a, b, c, d, e, f) {
    console.log(`pass: ${pass}`)
    if (islogedIn() == undefined) {
        setTimeout(() => {
            retry(pass, a, b, c, d,e,f)
        }, 5000);
    } else if (islogedIn() === true) {
        uploadHistory(a, b, c, d, e,f)
    }
}

export {uploadContent, uploadHistory}