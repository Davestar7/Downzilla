import {icons, loader, routes} from './env/env.js';
import {islogedIn} from '../js/checkuserlogin.js';
import header from '../UI-components/header.js'
import {userData, logout} from '../js/auth/afterauth.js'
import {secondCondition, headnavcall} from '../js/alert.js'
import { updateHistory, staredContentUi } from '../js/interact/userOperation.js';
import {pushUrl} from "../js/createPage.js"
import { comfirmPage } from '../js/checkcondition.js'
import { alert } from './popup.js';

function MainStructure() {
    let Page = document.getElementById('contentPage')
    const head = header()  
    const usermain = topsec()
    const second = `<section id="rest"></section>`

    let page = `
        <header id="head">${head}</header>
        <section id="user">
            ${usermain}
            ${second}
        </section>
    `
    
    Page.innerHTML = loader()
    Page.innerHTML = page;
    restPage()
    secondConditionU()
    const logoutbtn = document.getElementById('logout')
    if( logoutbtn != null) {
        logoutbtn.addEventListener('click', () => {
            logout()
        })
    }
    headnavcall()
}

function topsec() {
    let content;
    const isloged = islogedIn()

    if (isloged == false) {
        content = `
            <button id="navbtn" class="usernavbtn">sign-In or Sign-Up or sign-In with Google</button>
        `
        headnavcall()
    } else if (isloged == true) {
        document.title = `user - ${userData.username}`
        content = `
            <div id="username">
                <div id="usernamecon">
                    <h2>
                        <em>
                            <span>${icons.USERICON}</span>
                            <span id="userspan">hello</span> <span id="usersn">'${userData.names}'</span>
                        </em>
                    </h2>
                    <span id="starses"><i id="iini">total stars:</i><span id="str"></span></span>
                </div>
                <div id="after">
                    <p>...resume connection to multiple video content & resourse from the web</p>
                    <button id="logout"><span id="logt">logout</span> ${icons.EXIT}</button>
                </div>
            </div>
        `
    }
    
    return content
}

function callSetting() {
    if (islogedIn() === true) {
        totoalStars()
      document.getElementById("usersn").addEventListener("click", () => {
        const win = window.location.pathname
        
        const newUrl = `${win}/info`
        
        history.pushState(null, null, newUrl)
        document.title = `${userData.username} - info`
        comfirmPage()
      })
      
    } else if (islogedIn() === undefined) {
      callSetting()
    }
}

function restPage() {
    const rest = document.getElementById("rest")
    let contents
    let navbtn
    let listsec = "";
    if (islogedIn() == false) {
      rest.innerHTML = `<em>Please login/signup</em>`
      return
    }
    callSetting()
        navbtn = `<div>
                    <button class="usernavbtns" id="postH">Stared</button>
                    <button class="usernavbtns" id="download">Activities</button>
                </div>`;

        contents = `
            <section id="usersec">
                <div id="hisnav">
                    ${navbtn}
                </div>
                <div id="hisy"></div>
            </section>
        `
        rest.innerHTML = contents
        // updateHistory()
        
        staredContentUi()
}

function secondConditionU() {
    const postH = document.getElementById('postH')
    const Dbtn = document.getElementById('download')
    if (postH == null) {
        setTimeout(() => {
            secondConditionU()
        }, 1000);
    } else {
        postH.addEventListener('click', ()=> {
            // postH.style.background = 'rgb(145, 210, 80)';
            // write update started post logic here
            Dbtn.style.borderBottom = ""
            postH.style.borderBottom = "2px green solid"
            staredContentUi()
            secondConditionU()
        }, {once: true})
    }
 
    if (Dbtn == null) {
        setTimeout(() => {
            secondConditionU()
        }, 1000);
    } else {
        Dbtn.addEventListener('click', ()=> {
            // Dbtn.style.background = 'rgb(145, 210, 80)'
            postH.style.borderBottom = ""
            Dbtn.style.borderBottom = " 2px green solid"
            updateHistory()
            secondConditionU()
        }, {once: true})
    }

    // function history() {
    //     if (islogedIn() === undefined) {
    //         setTimeout(() => {
    //             history()
    //         }, 4000);
    //     } else if (islogedIn() === true) {
    //         updateHistory()
    //         MainStructure()
    //     }
    // }
}

async function totoalStars() {
    const res = await fetch(routes.totalStares, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({id: userData.userId})
    })
    const r = await res.json()
    if (r.success !== true) {
        alert("failed getting total stars")
        document.getElementById("str").innerHTML = `${icons.REGULARSTAR}0`
        return
    }
    document.getElementById("str").innerHTML = `${icons.STARED}${r.total}`   
}

export default MainStructure