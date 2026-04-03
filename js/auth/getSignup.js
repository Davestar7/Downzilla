import {closeFunction, autoclose} from '../alert.js'
import {routes, icons, loader} from '../../UI-components/env/env.js'
import {autoLogin} from './loginUser.js'
import { alert } from '../../UI-components/popup.js'

async function signupFunction() {
    const form = document.getElementById('signupForm')
    
    if (form == null) {
        setTimeout(() => {
            signupFunction()
        }, 1000);
    } else {
        form.addEventListener('submit', async (e)=> {
            e.preventDefault()
            let name = document.getElementById('Tinput').value.trim()
            let email = document.getElementById('Einput').value.trim()
            let passwords = document.getElementById('Pinput')

            const passwordL = passwords.value.trim()

            if (passwordL.length <= 5) {
                document.getElementById('Lerr').innerText = "password too short"
                return
            }

            document.getElementById('Lerr').innerText = ""
            const password = passwordL

            form.innerHTML = `${loader("signing you up, please wait...")}`            

            try {
                const res = await fetch(routes.siginupurl, {
                    method: 'POST',
                    headers: {"content-Type": "application/json"},
                    body: JSON.stringify({name, email, password}),
                    credentials: "include"
                })

                const data = await res.json()
                data.textContent = `Response: ${JSON.stringify(data)}`
                localStorage.setItem('DZAT', data.accessT)
                afterSignup(data)
            } catch (e) {
                afterSignup(e)
                alert("check internet connection", 2000)
            }
            
        })
    }
    
}

function afterSignup(val) {
    const signupxml = document.getElementById('signupForm')
    
    if (signupxml != null) {
        if (val.success == false) {
            signupxml.innerHTML = `<em>${val.message}</em> <br> <button id="tryAgain" class="w-4 h-1.5 bg-blend-darken text-white">${icons.ARROWLEFT} try again</button>`;
            autoclose()
        } else if (val.success == true) {
            signupxml.innerHTML = `${loader("signing you in...")}`
            closeFunction()
            autoLogin()
            window.location.reload()
        } else {
            signupxml.innerHTML = `<em>${val.message}</em> <br> <button id="tryAgain" class="w-4 h-1.5 bg-blend-darken text-white">${icons.ARROWLEFT} try again</button>`;
            autoclose()
        }
    }
}

export {signupFunction, afterSignup}