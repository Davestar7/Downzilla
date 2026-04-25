import { icons, routes, googleIds, loader, iconCheck } from "./env/env.js";
import {close as closex, TandCs, returnBack, closeFunction } from '../js/alert.js'
import {signupFunction} from '../js/auth/getSignup.js'
import {login as logLis} from '../js/auth/loginUser.js'
import {userData} from '../js/auth/afterauth.js'
import { islogedIn } from "../js/checkuserlogin.js";
import { comfirmPage } from "../js/checkcondition.js";

const popuper = document.getElementById('popup')

async function popUp(type, reload = false) {
    popuper.style.display = "flex"
    popuper.innerHTML = loader()
    let pupUp;
    const textInput = `<input type="text" name="user" id="Tinput" placeholder="username" required>`;
    const nameInput = `<input type="text" name="Text" id="Ninput" placeholder="email or username" required>`;
    const emailInput = `<input type="email" name="email" id="Einput" placeholder="email address" required>`;
    const password = `<input type="password" name="password" id="Pinput" placeholder="******" required>`;
    const loginbtn = `<button id="logbtn">sign in</button>`;
    const signupbtn = `<button id="signupbtn">signup with email</button>`;
    const submit = `<button id="submit" type="submit">Next</button`;
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
            popuper.innerHTML = loader("loading terms and condition...")
            pupUp = await TandCs()
        break
        case 'forgotpassword':
            shouldOpen()
            pupUp = `<div>
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
                clearneeded(false, true)
            }, 1000);
        break
        case 'forgotpassowrdReset':
            shouldOpen()
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
            console.log("playlist")
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

// function logedInUser() {
//     const user = userData.names

//     const display = `
//         <div>
//             <h1>Welcome <em>${user}</em></h1>
//             <h3>you are logged in</h3>
//         </div>
//     `;

//     return display
// }

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
        popUp('forgotpassword')
    })
}

export {popUp, login, signup, alert, uiLoader}