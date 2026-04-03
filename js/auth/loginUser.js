import {routes, icons, loader} from '../../UI-components/env/env.js'
import {closeFunction, autoclose, condition, headnavcall, isConnected} from '../alert.js'
import {islogedIn} from '../checkuserlogin.js';
import {updateAuth} from '.././auth/afterauth.js'
import { comfirmPage } from '../checkcondition.js';
import { alert } from '../../UI-components/popup.js';

let accessToken = localStorage.getItem("DZAT")
console.log(accessToken)

window.addEventListener('load', async () => {
    
    if (!accessToken) {
        islogedIn(false)
        setTimeout(() => {
            condition()
        }, 2000);
        comfirmPage()
        headnavcall()
        return
    }

    const data = await autoLogin()
    updateAuth(data)
})

async function autoLogin() {
    if (accessToken != null) {
        isConnected()
        const res = await fetch(routes.protectedRoute, {
            headers: {"Authorization": `Bearer ${accessToken}`},
            credentials: "include"
        })
        if (res.status == 403) {
            console.log("access token expired refreshing...")
            const waitedR = await refreshaccessToken()
            if (waitedR) {
                autoLogin()
            }
        }
        return res.json()
    }
}

async function login() {
    const loginForm = document.getElementById('loginForm')
    if (loginForm == null) {
        setTimeout(() => {
            login()
        }, 1000);
    } else {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            isConnected()
            const text = document.getElementById('Ninput').value.trim()
            let passwordL = document.getElementById('Pinput')

            document.getElementById('Lerr').innerText = ""
            const password = passwordL.value.trim()

            if (passwordL.length <= 5) {
                document.getElementById('Lerr').innerText = "password too short"
                return
            }

            loginForm.innerHTML = `${loader("logging you in...")}`

            const res = await fetch(routes.logininurl, {
                method: "POST",
                headers: {"content-Type": "application/json"},
                body: JSON.stringify({text, password}),
                credentials: "include", //sends and rexives the cookies
            })
            
            const data = await res.json()
            afterlogin(data)
            if (data.token) {
                accessToken = data.token;
                localStorage.setItem("DZAT", accessToken)
                console.log(`logged in with: ${accessToken}`);
                window.location.reload()
            } else {
                alert("error occured while verifying data")
                afterlogin('something went wong verifying data')
            }
            
        })
    }
}

async function refreshaccessToken() {
    isConnected()
    const res = await fetch(routes.refreshToken, {
        method: "POST",
        credentials: "include"
    })
    if (res.status == 200) {
        const data = await res.json()
        accessToken = data.accessT;

        localStorage.setItem("DZAT", accessToken)
        console.log('refreshed access token')
        alert('reloging you in')
        window.location.reload()
        return true
    } else {
        console.log('refresh failed. login manually')
        localStorage.removeItem("DZAT")
        islogedIn(false)
        comfirmPage()
        alert("Error loging you in please try to login manually")
        return false
    }
}

function afterlogin(val) {
    const loginxml = document.getElementById('loginForm')
    
    if (loginxml != null) {
        if (val.success == false) {
            loginxml.innerHTML = `<em>${val.message}</em> <br> <button id="tryAgain" class="w-4 h-1.5 bg-blend-darken text-white">${icons.ARROWLEFT} try again</button>`;
            autoclose()
        } else if (val.success == true) {
            loginxml.innerHTML = `${loader("your logged in please wait...")}`
            closeFunction()
            autoLogin()
        } else {
            loginxml.innerHTML = `<em>${val}</em> <br> <button id="tryAgain" class="w-4 h-1.5 bg-blend-darken text-white">${icons.ARROWLEFT} try again</button>`;
            autoclose()
        }
    }
}

export {autoLogin, login, refreshaccessToken}