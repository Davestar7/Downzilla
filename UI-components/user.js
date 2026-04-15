import {icons, loader} from './env/env.js';
import {islogedIn} from '../js/checkuserlogin.js';
import header from '../UI-components/header.js'
import {userData, logout} from '../js/auth/afterauth.js'
import {secondCondition, headnavcall} from '../js/alert.js'
import { updateHistory } from '../js/interact/userOperation.js';
import {pushUrl} from "../js/createPage.js"
import { comfirmPage } from '../js/checkcondition.js'

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
                <h2>
                    <em>
                        <span id="userspan">hello</span> <span id="usersn">'${userData.names}'</span>
                    </em>
                </h2>
                <div id="after">
                    <p>...resume connection to multiple video content & resourse from the web</p>
                    <button id="logout">logout</button>
                </div>
            </div>
        `
    }
    return content
    callSetting()
    function callSetting() {
      if (islogedIn === true) {
        document.getElementById("usersn").addEventListener("click", () => {
          pushUrl("info", `${userData.username} info`)
          comfirmPage()
        })
        
      } else if (islogedIn === undefined) {
        callSetting()
      }
    }
}

function restPage() {
    const rest = document.getElementById("rest")
    let contents
    let navbtn
    let listsec = "";
    if (islogedIn == false) {
      rest.innerHTML = `<em>Please login/signup</em>`
      return
    }
        navbtn = `<div>
                    <button class="usernavbtns" id="download">Activities</button>
                    <button class="usernavbtns" id="postH">Stared</button>
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
        updateHistory()
}

function secondConditionU() {
    const postH = document.getElementById('postH')
    if (postH == null) {
        setTimeout(() => {
            secondConditionU()
        }, 1000);
    } else {
        postH.addEventListener('click', ()=> {
            // postH.style.background = 'rgb(145, 210, 80)';
            // write update started post logic here
            MainStructure()
        })
    }
    history()
 
    const Dbtn = document.getElementById('download')
    if (Dbtn == null) {
        setTimeout(() => {
            secondConditionU()
        }, 1000);
    } else {
        Dbtn.addEventListener('click', ()=> {
            // Dbtn.style.background = 'rgb(145, 210, 80)'
            updateHistory()
            MainStructure()
        })
    }

    function history() {
        if (islogedIn === undefined) {
            setTimeout(() => {
                history()
            }, 4000);
        } else if (islogedIn === true) {
            updateHistory()
            MainStructure()
        }
    }
}

export default MainStructure