import { userData, logout } from "../js/auth/afterauth.js";
import { backFunction } from "../js/checkcondition.js";
import { icons, loader, routes } from "./env/env.js"
import header from "./header.js";
import { islogedIn } from "../js/checkuserlogin.js";
import { popUp, alert } from "./popup.js";

function main() {
    if (islogedIn() === false) {
      document.title = "awaiting user login"
      popUp()
      return
    } else if (islogedIn() === undefined) {
      document.title = "info"
      setTimeout(() => {
        main()
      }, 1200)
      return
    }
    document.title = `${userData.username} - info`
    
    const page = document.getElementById("contentPage")
    const head = header()
    
    const ui = `
                <header id="head">${head}</header>
                <button id="back">${icons.ARROWLEFT}</button>
                <section id="infosec">
                  <div id="infod">
                      <div id="infoh">
                        <h2>User Info</h2>
                      </div>
                      <div id="infodi">
                          <form id="infofo">
                            <input type="text" id="namer" value="${userData.names}"></input>
                            <input type="email" id="emailr" value="${userData.email}"></input>
                            <submit type="submit" id="forsub">Submit</submit>
                          </form>
                      </div>
                      <div id="resertdiv">
                        <button id="reset">Reset Password</button>
                      </div>
                  </div>
                </section>`;

    page.innerHTML = ui
    document.getElementById("back").addEventListener("click", () => {
      backFunction()
    })
    submitResetData()
    document.getElementById("reset").addEventListener("click", resetPassword)
}

function submitResetData() {
    let interva
    document.getElementById("forsub").style.background = "gainsboro";
    document.getElementById("forsub").style.border = "gainsboro";
    document.addEventListener("keypress", (e) => {
        clearTimeout(interva)
        const text = document.getElementById("namer").value;
        const email = document.getElementById("emailr").value;

        interva = setTimeout(() => {
          events(text, email)
        }, 950);
    } )

    function events(text, email) {
        submitFunction("both", text, email)
        if (text.toLowerCase() !== userData.names.toLowerCase()) {
          submitFunction("name",text, email)
        } else if (email !== userData.email) {
          submitFunction("email", text, email)
        } else if (text.toLowerCase() !== userData.names.toLowerCase() && email !== userData.email) {
          submitFunction("both", text, email)
        } else if (text.toLowerCase() === userData.names.toLowerCase() && email === userData.email) {
          submit.style.background = "gainsboro"
          submit.style.border = "1px solid white"
        }
    }

    function submitFunction(which, name, email) {
      
      const submit = document.getElementById("forsub")
      submit.style.background = "rgb(20, 124, 20)"
      submit.style.border = "green"

      submit.addEventListener("click", async (e) => {
        e.target.innerText = "loading"

          const resp = await fetch(routes.resetData, {
              method: "POST",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify({name: name, email: email, id: userData.userId, which: which}),
              credentials: "include"
          })
          const res = await resp.json()
          if(res.success !== true) {
            alert(`failed: ${res.message}`)
            e.target.innerText = "Try again"
            events(name, email) 
            return
          }

        alert("success")
        localStorage.clear("DZAT")
        localStorage.setItem("DZAT", res.token)
        backFunction()
        window.location.reload()
      
      }, {once: true})

    }
}

function resetPassword() {

    popUp("forgotpassword")

    let returnedId;

    document.getElementById("submit")?.addEventListener("click", async (e) => {
      e.preventDefault()  
      e.target.innerText = "submitting..."
        const val = document.getElementById("Einput").value
        console.log(val)
        if (val == "") {
          const con = document.getElementById("femailput")
          const el = `<p style="color: red">Dud, empty field</p>`
          document.getElementById("Einput").style.border = "red solid"
          con.innerHTML += el
          e.target.innerText = "submit"
          return
        }

        if (islogedIn() === true) {
          if (val != userData.email) {
            const con = document.getElementById("femailput")
            const el = `<p style="color: red">incorrect email</p>`
            document.getElementById("Einput").style.border = "red solid"
            con.innerHTML += el
            e.target.innerText = "submit"
            return
          }
        }

        const resp = await fetch(routes.verifyEmailForPassword, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({email: val}),
          credentials: "include"
        })
        const res = await resp.json()
        if (res.success !== true) {
            alert(`failed`, 1000)
            const con = document.getElementById("femailput")
            const el = `<p style="color: red">Failed: ${res.message}</p>`
            con.innerHTML += el
            e.target.innerText = "submit"
            return
        }

        returnedId = res.id
        console.log(`returned id ${returnedId}`)
        popUp("forgotpassowrdReset")
        reset()

        function reset() {
          document.getElementById("submit").addEventListener("click", async (e) => {
            e.preventDefault()
            e.target.innerText = "submitting..."
            const firstp = document.getElementsByClassName("Pinput")[0].value
            const secondp = document.getElementsByClassName("Pinput")[1].value
            
            if (firstp !== secondp) {
              const con = document.getElementById("reset")
              const el = `<p style="color: red">Ensure Password matches</p>`
              document.getElementsByClassName("Pinput")[0].style.border = "red solid"
              document.getElementsByClassName("Pinput")[1].style.border = "red solid"
              con.innerHTML += el
              e.target.innerText = "submit"
              return
            }

            if (islogedIn() === true) {
              if (returnedId !== userData.userId) {
                alert("invalid data detcted")
                setTimeout(() => {
                  alert("unable to continur operation")
                  setTimeout(() => {
                    backFunction()
                  }, 1000);
                }, 2000);
                return
              }
            }

            const resp = await fetch(routes.resetPassword, {
              method: "POST",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify({password: firstp, id: returnedId}),
              credentials: "include",
            })
            const res = await resp.json()
            if (res.success != true) {
              alert(`Failed: ${res.message}`)
              e.target.innerText = "submit"
              return
            }

            alert(res.message)
            if (islogedIn() === true) {
              logout()
            }
            window.location.reload()
          })      
        }          
    })


}

export { main, resetPassword }
