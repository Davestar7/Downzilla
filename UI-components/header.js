import {userData} from '../js/auth/afterauth.js'
import {islogedIn} from '../js/checkuserlogin.js';
import { loader, iconCheck, icons, routes } from './env/env.js';
import { uploadContent, uploadHistory } from '../js/interact/history.js';
import { popUp, alert } from './popup.js';
import { closeFunction } from '../js/alert.js';

function header() {
    const ifLogedIn = islogedIn()
    let headers;
    let lin = "loading...";
    if (ifLogedIn == false) {
        lin = `<button id="navbtn">SignIn/SignUp</button>`
        
    } else if (ifLogedIn == true) {
        lin = `<i id="userhead">Hi "${userData.username}"</i>`
    }

    headers = `
        <div id="header">
            <div id="headername">
                <a href="/"><h3>Downzilla</h3></a>
                <h4>downloader</h4>
            </div>
            <div id="headside">
                ${lin}
            </div>
        </div>
    `;
    setTimeout(() => {
        feedBackUi()
    }, 2000);
    return headers
}
onloadLocalUpdate()

function onloadLocalUpdate() {
    setTimeout(() => {
        const stringToUpload = localStorage.getItem("toUpload") // content to upload at local storage
        const stringToHistory = localStorage.getItem("historyD") // content to upload to history in local storage
        
        localStorage.removeItem("toUpload")
        if (stringToUpload != null) {
            const dataArray = stringToUpload.split(">")
            console.log("playlist: "+ dataArray)
        
            uploadContent(dataArray[0], dataArray[1], dataArray[2], dataArray[3], dataArray[4], dataArray[5])
        }
        // history check
        if (stringToHistory != null) {
            const dataArray = stringToHistory.split(">")
            uploadHistory(dataArray[0], dataArray[1], dataArray[2], dataArray[3], dataArray[4])
        }

    }, 5000);
}

function feedBackUi() {
    const el = document.createElement("template")
    el.innerHTML = `
                <div id="feedbk">
                    ${icons.FEEDBACK}
                </div>
                `
    const ui = document.getElementById("header")
    
    ui.append(el.content.firstElementChild) 

    document.addEventListener("click", (e) => {
        
        e.stopPropagation()

        if (e.target?.offsetParent?.id === "feedbk") {
            if (islogedIn() === false) {
                alert("authentication needed!")
                return
            } else if (islogedIn() === undefined) {
                alert("wait a little before carring out action")
            }

            popUp("feedback")

            document.getElementById("feedbackform").addEventListener("submit", async(el) => {
                el.preventDefault()
                el.submitter.innerHTML = `<i>sending...</i>`
                const text = document.getElementById("textAr").value
                const toSend = `${text}`
                const id = userData.userId
                const re = await fetch(routes.feedback, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({id: id, message: toSend})
                })

                const res = await re.json()
                if (res.success !== true) {
                    alert(`failed: ${res.message}`)
                    el.submitter.innerHTML = "Re-try: send"
                    return
                }
                el.submitter.innerHTML = "sent"
                alert("Thanks for your feedback", 5000)
                closeFunction()
            })
        }
    })
}

iconCheck()

export default header