import { icons, routes, googleIds, loader, iconCheck } from "./env/env.js";
import {close as closex, TandCc, returnBack, closeFunction } from '../js/alert.js'
import {signupFunction} from '../js/auth/getSignup.js'
import {login as logLis} from '../js/auth/loginUser.js'
import {userData} from '../js/auth/afterauth.js'
import { islogedIn } from "../js/checkuserlogin.js";
import { comfirmPage } from "../js/checkcondition.js";
import { resetPassword } from "./setting.js";
import { saveUploadData } from "../js/operation/downloadDis.js";

const popuper = document.getElementById('popup')

async function popUp(type, reload = false) {

    popuper.style.display = "flex"
    popuper.innerHTML = loader()
    let pupUp;
    const textInput = `<input type="text" name="user" id="Tinput" placeholder="username" required>`;
    const nameInput = `<input type="text" name="Text" id="Ninput" placeholder="email or username" required>`;
    const emailInput = `<input type="email" name="email" id="Einput" placeholder="email address" required>`;
    const password = `<input type="password" name="password" id="Pinput" class="Pinput" placeholder="******" required>`;
    const loginbtn = `<button id="logbtn">sign in</button>`;
    const signupbtn = `<button id="signupbtn">signup with email</button>`;
    const submit = `<button id="submit" type="submit">Next</button`;
    const textArea = `<textarea name="message" id="textAr" cols="20" rows="10">write message</textarea>`
    const close = icons.XMARK
    const back = icons.ARROWLEFT

    switch (type) {
        case 'signup':
                shouldOpen()
                
                pupUp = `
                        <form id="signupForm">
                            ${textInput}
                            ${emailInput}
                            ${password}
                            <p id="Lerr" class="text-red-500"></p>
                            ${submit}
                        </form>
                    `
                document.title = "Downzilla sign-In"
                signupFunction()
            break;
        case 'login':
            
                shouldOpen()
                pupUp = `
                    <form id="loginForm">
                        ${nameInput}
                        ${password}
                        <p id="Lerr" class="text-red-500"></p>
                        <p id="forgot">forgot password</p>
                        ${submit}
                    </form>
                `
                document.title = "Downzilla Sign-In"
                logLis()

                setTimeout(() => {
                    forgot()
                }, 1000);
            break
        case 'TandC': 
            pupUp = `<div id="tacdiv"> ${loader("loading terms and condition...")}</div>`
            setTimeout(() => {
                clearneeded(true, true)
            }, 1000);
        break
        case 'forgotpassword':
            // shouldOpen()
            pupUp = `<div id="passc">
                            <div id="didf"><h3>Forgot Password?</h3></div>
                            <form>
                                <div id="femailput">
                                    <i>input email</i>
                                    ${emailInput}
                                </div>
                                ${submit}
                            </form>
                        </div>`;
            setTimeout(() => {
                clearneeded(true, false)
            }, 1000);
        break
        case 'forgotpassowrdReset':
            // shouldOpen()
            pupUp = `<div id="forgot">
                        <div id="forgotv"><b>Reset password</b></div>
                        <div id="forgotdis">
                            <form id="reset">
                                <div>
                                    <i>new password</i>
                                    ${password}
                                </div>
                                <div>
                                    <i>comfirm new password</i>
                                    ${password}
                                </div>
                                ${submit}
                            </form>
                        </div>
                    </div>`;
            setTimeout(() => {
                clearneeded(false, true)
            }, 1000);
        break
        case 'playlist':
            pupUp = loader("loading playlist...");
            pupUp = `
                <div class="playdiv">
                    <div id="playvidtit"></div>
                    <div id="playformat">${loader("getting data please be patient...")}</div>
                </div>
            `;
            setTimeout(() => {
                clearneeded(true, true)
            }, 1000);
        break
        case 'feedinfo': 
            pupUp = `
                <div id="warnCon" style="text-align: center;">
                    <h3 style="font-size: 2em;">Disclamer</h3>
                    <p style="font-size: 11px;">the downzilla content sharing option functions as a tool to connect users to content from different platforms
                     to download and is <b>NOT</b> a substitute for the original media source. Shared content here can also be removed
                      or become unaccessable at anytime, becouse we have no control for the content availability on the original source.</p>
                </div>
            `
            setTimeout(() => {
                clearneeded(true, true)
            }, 1000);
        break
        case 'askshare':
            pupUp = `
                <div style="align-items: center;">
                    <h4>Would you like to share this content to other users on downzilla?<h4>
                    <button id="upbtn" class="upbtn">yea sure</button>
                </div>
            `
            setTimeout(() => {
                clearneeded(true, false)
                document.getElementsByClassName("upbtn")[0].addEventListener("click", () => {
                    alert("thanks for sharing")
                    closeFunction()
                    saveUploadData()
                })
            }, 1000);
        break
        case "feedback":
            pupUp = `
                    <div id="feedbackdiv">
                        <form id="feedbackform">
                            <h3>write feedback message</h3>
                            ${textArea}
                            ${submit}
                        </form>
                    </div>
                `
                setTimeout(() => {
                    clearneeded(true, false)
                }, 1000);
        break
        default:
            shouldOpen()
            
            pupUp = `
                ${loginbtn}
                ${signupbtn}
                <hr>or<hr>
                <iframe src="/UI-components/env/socialauth.html" frameborder="0" id="giframe"></iframe>
            `
            document.title = "Downzilla auth"
            break;
    }

    const dis = `
            <div id="popdiv">
                    <div id="popheadnav">
                        <button id="navbackpop">${back}</button>
                        <button id="close">
                            ${close}
                        </button>
                    </div>
                <div id="popcar">
                    ${pupUp}
                    <p id="tem">By proceeding you agree to our <b id="TaC">terms & conditions</b>.</p>
                </div>
            </div>
        `
    popuper.innerHTML = dis;
    closex(reload)
    returnBack()

    function clearneeded(ifnav, ifterm) {
        if (ifnav == true) {
            document.getElementById("navbackpop").style.display = "none";
        }

        if (ifterm == true) {
            document.getElementById("tem").style.display = "none";
        }
    }
    iconCheck()
    tc()
}

function shouldOpen() {
    if (islogedIn() === true) {
       closeFunction(true)
       return
    }
    if (islogedIn() === undefined) {
        setTimeout(() => {
            shouldOpen()
        }, 1000);
    }
}

function alert(word, time = 0) {
    const body = document.getElementById("popnotify")
    body.style.display = "flex"
    let timeout;
    let display;

    if (time != 0) {
        timeout = setTimeout(() => {
            document.getElementById("popnotify").innerHTML = ""
            document.getElementById("popnotify").style.display = ""
        }, time);
    }

    display = `
            <div id="notify">
                <div id="notex">
                    <p class="text-black" id="notalert">${icons.CIRCLEICON} ${word}</p>
                </div>
                <div id="notcl">
                    <button id="closenotify">${icons.XMARK}</button>
                </div>
            </div>
        `
    body.innerHTML = display
    closenotify()
}

function login() {
    popUp('login')
}

function signup() {
    popUp('signup')
}

function uiLoader(load, stop, text = "please wait...", timer = null) {
    popuper.style.display = "flex"
    if (load === true) {
        popuper.innerHTML = `<div style="display: flex; justify-conent: center; align-items: center;">${loader(text)}</div>`
    }
    if (stop === true) {
        popuper.style.display = "none"
        return
    }

    if (timer != null && typeof timer === "number") {
        setTimeout(() => {
            popuper.style.display = "none"
        }, timer);
    }


}

function closenotify() {
    const btn = document.getElementById("closenotify")
    btn.addEventListener("click", ()=> {
        document.getElementById("popnotify").innerHTML = ""
        document.getElementById("popnotify").style.display = "none"
    })
}

function forgot() {
    document.getElementById('forgot').addEventListener('click', () => {
        history.replaceState(null, null, "")
        history.pushState(null, null, location.pathname + "/forgotpassword")
        resetPassword()
    })
}

function tc() {
    document.getElementById('TaC')?.addEventListener('click', (e) => {
        popUp("TandC")
        e.preventDefault()
        history.replaceState(null, null, "")
        history.pushState(null, null, location.pathname + "/TandC")
        // comfirmPage()
        returnBack()
        TandCc()
    })
}

export {popUp, login, signup, alert, uiLoader}