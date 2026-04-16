import { userData } from "../js/auth/afterauth.js";
import { icons, loader, routes } from "./env/env.js"
import header from "./header.js";

function main() {
   const page = document.getElementById("contentPage")
   
   const ui = `<div>
                  <div>
                    <h2>User Info</h2>
                  </div>
                  <div>
                      <form>
                        <input type="text" id="name"></input>
                        <input type="text" id="username"></input>
                        <input type="text" id="email"></input>
                        <submit id="subset">
                      </form>
                  </div>
                  <div>
                    <button>reset password</button>
                  </div>
                </div>`
                
    page.innerHTML = ui
}

export default main