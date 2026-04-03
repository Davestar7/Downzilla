
import {icons, footers} from './env/env.js'
import {checkUrl, updateHomeUrl} from '../js/checkcondition.js'
import {done} from '../js/changePage.js'
const Body = document.getElementById('nav-footer')

function footerMain() {
    const nav = checkDisplay()
    
        const format = `<div id="footer-con">
            <ul id="footer-ul">
                <li>${nav[0]}</li>
                <li>${nav[1]}</li>
                <li>${nav[2]}</li>
            </ul>
        </div>`;
        Body.innerHTML = format;
        done(true)
}

footerMain()

function checkDisplay() {
    done(false)
    const path = checkUrl()
    const urlLenght = path.length;
    let index = undefined;

     if (urlLenght >= 3) {
        index = 2 
    } else if (urlLenght < 3) {
         index = null;
    }; 

    let returns = [];
    footers.forEach(i => {
        const checker = i.url.split("/")
        
        if (checker[2] === path[index]) {
            returns.push(`<b class="indicate" id="nav-b">${i.indicator}</b>`)
        } else if (path[index] == undefined && checker[2] == 'downloader') {
            returns.push(`<b class="indicate" id="nav-b">${i.indicator}</b>`)
            updateHomeUrl(i.url)
        }else {
            returns.push(`<button class="anchor" id="${checker[2]}" >${i.indicator}</button>`)
        }
    })
    return returns;
}

export {footerMain}