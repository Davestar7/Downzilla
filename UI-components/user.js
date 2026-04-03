import {icons, loader} from './env/env.js';
import {islogedIn} from '../js/checkuserlogin.js';
import header from '../UI-components/header.js'
import {userData, logout} from '../js/auth/afterauth.js'
import {secondCondition, headnavcall} from '../js/alert.js'
import { updateHistory } from '../js/interact/userOperation.js';

function MainStructure() {
    let Page = document.getElementById('contentPage')
    const head = header()  
    const usermain = topsec()
    const second = restPage()

    let page = `
        <header id="head">${head}</header>
        <section id="user">
            ${usermain}
            ${second}
        </section>
    `
    
    Page.innerHTML = loader()
    Page.innerHTML = page;
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
                        <span id="userspan">hello</span> '${userData.names}'
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
}

let filterlist = []
let returner = null

function restPage() {
    let contents
    let navbtn
    let listsec = "";
    if (islogedIn == false) {
            return ""
    }
        navbtn = `<div>
                    <button class="usernavbtns" id="download">Activities</button>
                    <button class="usernavbtns" id="postH">Stared</button>
                </div>`;


        if (returner != null) {
            listsec = returner
        } else {
            filterlist.forEach((e) => {
                console.log(e)
            })
        }

        contents = `
            <section id="usersec">
                <div id="hisnav">
                    ${navbtn}
                </div>
                <div id="his">
                    ${listsec}
                </div>
            </section>
        `
        return contents
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