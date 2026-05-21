import {islogedIn} from './checkuserlogin.js';
import {comfirmPage} from '../js/checkcondition.js'
import {popUp, alert} from "../UI-components/popup.js"
import { routes } from '../UI-components/env/env.js';
import { loadParam } from './operation/download.js';

const location = window.location
isConnected()

const loged = islogedIn()
function condition() {
    const logeds = islogedIn()
        
    setTimeout(()=>{
        isConnected()
        if (logeds == false) {
            logAlertpop()
        } else {
            closeFunction()
        }
    }, 10000)
}

ifAuthententicated()
function secondCondition() {
    const logeds = islogedIn()
    isConnected()
    if (logeds === false) {
        popUp()
        listiners()
        TandCc()
    } else if (logeds === undefined) {
        settimeout(() => {
           secondCondition()
        }, 1500)
    }else {
        closeFunction()
    }
}

async function listiners() {
    // all popup alert urls must have alert on the base of the url to prevent an infinite call when attemt to close popup
    document.getElementById('logbtn').addEventListener('click', ()=> {
        history.replaceState(null, null, "")
        history.pushState(null, null, location.pathname + "/login")
        comfirmPage()
        returnBack()
        TandCc()
    })

    document.getElementById('signupbtn').addEventListener('click', () => {
        history.replaceState(null, null, "")
        history.pushState(null, null, location.pathname + "/signup")
        comfirmPage()
        returnBack()
        TandCc()
    })

    // TandCc()

    close()
}

function autoclose() {
    var tryAgain = document.getElementById('tryAgain')
    if (tryAgain != null) {
        tryAgain.addEventListener('click', () => {
            secondCondition()
        })
    }
}

function returnBack() {
    var backbtn = document.getElementById('navbackpop')
    if (backbtn != null) {
        
        backbtn.addEventListener('click', () => {
            secondCondition()
        })
    }
}

function close(load) {
    document.getElementById('close').addEventListener('click', ()=> {
        closeFunction(load)
    })
}

function closeFunction(reload) {
    let pathn = window.location.pathname
    let path = pathn.split('/')
    let remove = path.length;
    if (path.length == 3) {
            document.getElementById('popup').style.display = "none";
     } else if (path.length > 3) {
          if (!path.includes("auth")) {
                document.getElementById('popup').style.display = "none";
                return
            }
            firstCall()
            function firstCall() {
                if(path[path.length-1] != "alert") {
                    secondCall()
                } else {
                    path.splice(path.length-1, 1)
                    let url;
                    path.forEach(link => {
                        if (link == "") {
                            return
                        }
                        if (url == undefined) {
                            return url = '/' + link
                        }
                        url += '/' + link
                    })
                    history.replaceState(null, null, "")
                    history.pushState(null, null, url)
                    // comfirmPage()
                    document.getElementById('popup').style.display = "none";
                }
            }
            
            function secondCall() {
                path.splice(path.length-1, 1)
                firstCall()
            }
        }
        loadParam()
        if (reload === true) {
            comfirmPage()
        }
}

function headnavcall() {
    const logbtn = document.getElementById('navbtn')
    
        if (logbtn == null) {
            if (islogedIn == false) {
                setTimeout(() => {
                    headnavcall()
                }, 2000);
            }
        } else {
            call()
        }

    function call() {
        const path = window.location.pathname
        
        logbtn.addEventListener('click', ()=> {
            if (loged != true) {
                history.replaceState(null, null, "")
                history.pushState(null, null, `${path}/alert/auth`)
                secondCondition()
            }
        })
    }
}

async function TandCc() {
    const tcs = document.getElementById("tacdiv")
   
    const re = await fetch(routes.tandc, {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    })
    const out = await re.json()
    if (out.success !== true) {
        tcs.innerText = `failed ${out.message}`
        alert(e.message)
        return
    }
    const head = out.head
    const body = out.body

    const xml = `
                <h3><b>${head}</b></h3>
                <ul id="tclist"></ul>
                `;
    tcs.innerHTML = xml
    body.forEach(e => {
        const tm = document.createElement("li")
        tm.id = "tclistl"
        tm.innerHTML = e
        document.getElementById("tclist").prepend(tm)
    })
}

function logAlertpop() {
    const path = location.pathname
    history.replaceState(null, null, "")
    history.pushState(null, null, `${path}/alert/auth`)
    secondCondition()
    returnBack()
}

async function isConnected(dis) {
    try {
        const trys = await fetch(routes.connected, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
        })

        const res = await trys.json()
        if (dis === true) {
            alert(res.message, 6000)
        }
    } catch (e) {
        alert("unable to connect to server")
        setTimeout(() => {
            isConnected(true)
        }, 8000);
    }
}

function ifAuthententicated() {
    setTimeout(() => {
        if (islogedIn() === undefined) {
            let interval;
            let lettimer;

            lettimer = setTimeout(() => {
                clearInterval(interval)
            }, 13000);

            interval = setInterval(() => {
                if (islogedIn() === true) {
                    clearInterval(interval)
                    clearTimeout(lettimer)
                    closeFunction(true)
                    alert(" ", 500)
                }
            }, 1000);
        } else {
            
        }
    }, 1000);
}

export {returnBack, isConnected, listiners, condition, headnavcall, secondCondition, close, closeFunction, autoclose, TandCc}