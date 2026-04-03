import {icons} from './env/env.js'
import {islogedIn} from '../js/checkuserlogin.js'
import {headnavcall} from '../js/alert.js'
import {userData} from '../js/auth/afterauth.js'
import header from '../UI-components/header.js'

function MainStructure() {
    let page = document.getElementById('contentPage')
    const headers = header()
    
    let Render = `
        <header id="head">${headers}</header>
        <section id="render">
            <div id="opt"></div>
            <div id="feed"></div>
        </section>
    `

    page.innerHTML = "<loading>loading...</loading>"
    page.innerHTML = Render
    headnavcall()
}

function runFeed() {

}

export default MainStructure