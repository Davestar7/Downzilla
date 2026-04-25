
const icons = {
    // DOWNLOADICON : `<i class="fa-classic fa-cloud-arrow-down iicon" data-text="down"></i>`,
    DOWNLOADICON : `<i class="fa-solid fa-download iicon" data-text="download"></i>`,
    LISTICON : `<i class="fa-classic fa-solid fa-list iicon" data-text="feed"></i>`,
    USERICON : `<i class="fa-regular fa-circle-user iicon" data-text="user"></i>`,
    DOWNLOADBTN : `<i class="fa-solid fa-download iicon" data-text="download"></i>`,
    XMARK : `<i class="fa-classic fa-solid fa-x iicon" data-text="close"></i>`,
    USERADD : `<i class="fa-solid fa-user-plus iicon" data-text="add"></i>`,
    USERMINUS : `<i class="fa-solid fa-userminus iicon" data-text="remove"></i>`,
    EYEICON : `<i class="fa-solid fa-eye iicon" data-text="eye"></i>`,
    SEARCHICON : `<i class="fa-solid fa-magnifying-glass iicon" data-text="search"></i>`,
    COPYICON: `<i class="fa-regular fa-copy iicon" data-text="copy"></i>`,
    FILEDOWN: `<i class="fa-regular fa-file-arrow-down iicon" data-text="download"></i>`,
    ARROWLEFT: `<i class="fa-solid fa-arrow-left iicon" data-text="back"></i>`,
    LOADICON: `<i class="fa-solid fa-spinner iicon" data-text="load"></i>`,
    ROTATERIGHT: `<i class="fa-solid fa-rotate-right iicon" data-text="right"></i>`,
    CIRCLEICON: `<i class="fa-solid fa-circle-notch iicon" data-text="cycleicon"></i>`,
    STARED: `<i class="fa-solid fa-star iicon" data-text="star"></i>`,
    REGULARSTAR: `<i class="fa-regular fa-star iicon" data-text="star"></i>`,
    DELETE: `<i class="fa-solid fa-trash iicon" data-text="Delete"></i>`,
    DROP: `<i class="fa-solid fa-angle-down iicon" data-text="open"></i>`,
    CLOSE: `<i class="fa-solid fa-angle-up iicon" data-text="close"></i>`,
}

const defaultNames = {
    sitename : "Downzilla downloader"
}

const footers = [
    {
        url: "/user/RenderFeed",
        indicator: icons.LISTICON, // change to icon
        title: "Downloads feeds"
    },
    {
        url: "/user/downloader",
        indicator: icons.DOWNLOADICON, //change to icon
        title: "Automatic video downloader"
    },
    {
        url: "/user/user",
        indicator: icons.USERICON, // change to icon
        title: "user"
    }
]

const catches = {
    notfound: `<h2 class="">"404" Page not found</h2>`,
    error: `<h2>something went wong<h2>`
}

const domain = "http://localhost:7000"
const stream_domain = "http://localhost:7700/V1"

const routes = {
    connected: domain + '/extra/connect',
    siginupurl: domain + '/auth/signin',
    logininurl: domain + '/auth/login',
    autoLogin: domain + '/auth/auto/',
    renderfeed: domain + '/qurery/render/',
    refreshToken: domain + '/auth/refreshtoken',
    protectedRoute: domain + '/auth/protectedroute',
    logout: domain + '/auth/logout',
    qurerygoogle: domain + '/auth/googleauth/google',
    startQuery: domain + '/qurery/start',
    getSingleHistory: domain + '/qurery/getSH',
    cancelQuery: domain + '/qurery/cancel',
    getDData: domain + '/qurery/getdata',
    beginD: stream_domain + "/downloadVideo",
    startStream: stream_domain + "/startstream",
    Stream: stream_domain + "/stream",
    beginAudioD: domain + '/qurery/audiodownload',
    beginPlaylist: domain + '/qurery/playlist',
    beginPlayD: domain + '/qurery/audio',
    uploadfeed: domain + '/qurery/uploaddata',
    getfeed: domain + '/qurery/getfeed',
    getSingleFeed: domain + '/qurery/getContentData',
    // streamUrl: domain + '/qurery/stream',
    downloadplay: domain + '/qurery/playdownload',
    seperateplaydown: domain + '/qurery/seperatedown',
    downloadmp: stream_domain + "/downloadMp",
    uploadHistory: domain + `/qurery/uploadhistory`,
    getHistory: domain + `/qurery/gethistory`,
    deleteHistory: domain + `/qurery/deletehistory`,
    star: domain + `/qurery/star`,
    removeStar: domain + `/qurery/unstar`,
    staredContent: domain + `/qurery/stared`,
    searchContent: domain + `/qurery/searchContent`,
}

const gbtn = "document.getElementById('excen').innerHTML"

const googleIds = {
    id: "1024052995708-4th7j14oi5dj9b0g2r18rfb8et0djoji.apps.googleusercontent.com",
    secret: "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",
    GsignInbtn: "<div class='g-signin2' data-onsuccess='onSignIn'></div>",
    GsignInbtn: gbtn
}

function loader(text = "loading...") {
    const load = `
                <div id="load-con">
                    <div id="arc">
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                    </div>
                    <i>${text}</i>
                </div>
                `
    return load
}

async function iconCheck() {
    const checkAgain = setTimeout(() => {
        test()
    }, 5000);
    test()
    function test() {
        setTimeout(() => {
            const iconsref = document.querySelectorAll(".iicon")
            const testIcon = document.createElement("i")
            testIcon.className = "fa-solid fa-download"
            testIcon.style.position = "absolute"
            testIcon.style.visibility = "hidden"

            document.body.appendChild(testIcon)

            const styleicon = getComputedStyle(testIcon).fontFamily;
            
            document.body.removeChild(testIcon)
            if (styleicon && styleicon.includes("Font Awesome")) {
                iconsref.forEach(e => {
                    e.innerHTML = ""
                })
                clearTimeout(checkAgain)
            } else {
                fail()
            }
        }, 2000);
    }

    function fail() {
        const iconsref = document.querySelectorAll(".iicon")
        iconsref.forEach(e => {
            const newe = e
            let word = newe.dataset.text
            e.innerHTML = `<span style="font-weight: 100;">${word}</span>`
        })
    }
}

export {icons, defaultNames, footers, catches, routes, googleIds, loader, iconCheck }