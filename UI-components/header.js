import {userData} from '../js/auth/afterauth.js'
import {islogedIn} from '../js/checkuserlogin.js';
import { loader, iconCheck } from './env/env.js';
import { uploadContent, uploadHistory } from '../js/interact/history.js';

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

    //just check if was unauthenticated action
    
    return headers
}
onloadLocalUpdate()

function onloadLocalUpdate() {
    setTimeout(() => {
        const stringToUpload = localStorage.getItem("toUpload") // content to upload at local storage
        const stringToHistory = localStorage.getItem("historyD") // content to upload to history in local storage
        console.log(stringToUpload)
        console.log(stringToHistory)
        localStorage.removeItem("toUpload")
        if (stringToUpload != null) {
            const dataArray = stringToUpload.split(">")
            console.log("playlist: "+ dataArray)
        
            uploadContent(dataArray[0], dataArray[1], dataArray[2], dataArray[3], dataArray[4], dataArray[5])
        }
        // history check
        if (stringToHistory != null) {
            const dataArray = stringToHistory.split(">")
            console.log("history: "+dataArray)
            console.log("array: ", dataArray[0], "other: ", dataArray[1], "also: ", dataArray[2])
            uploadHistory(dataArray[0], dataArray[1], dataArray[2], dataArray[3], dataArray[4])
        }

    }, 5000);
}

iconCheck()

export default header