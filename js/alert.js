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
    if (logeds == false) {
        popUp()
        listiners()
        TandCc()
    } else {
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

    TandCc()

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
    let pathn = location.pathname
        let path = pathn.split('/')
        let remove = path.length;
        if (path.length == 3) {
            document.getElementById('popup').style.display = "none";
        } else if (path.length > 3) {
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

function TandCc() {
    document.getElementById('TaC').addEventListener('click', async (e) => {
        e.preventDefault()
        history.replaceState(null, null, "")
        history.pushState(null, null, location.pathname + "/TandC")
        comfirmPage()
        returnBack()
        TandCc()
    })
}

async function TandCs() {
    
    let TaC = 'terms and conditions not found';
    // back end logic
    // can't use await on parent function call comfirm page when fetch is done
    if (TaC == null) {
        return "404 error"
    } else {
        return TaC;
    }

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
            console.log("not logged in")

            lettimer = setTimeout(() => {
                clearInterval(interval)
            }, 13000);

            interval = setInterval(() => {
                console.log("checking... " + interval + " " + lettimer)
                if (islogedIn() === true) {
                    clearInterval(interval)
                    clearTimeout(lettimer)
                    closeFunction(true)
                    alert(" ", 500)
                    console.log("loggged in")
                }
            }, 1000);
        } else {
            console.log("already logged in")
        }
    }, 1000);
}

export {returnBack, isConnected, listiners, condition, headnavcall, secondCondition, close, closeFunction, autoclose, TandCs}