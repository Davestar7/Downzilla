
// google signin dumb function
// what do you mean there is bug is working fine trust me;

async function handleCredentialResponse(response) {
    // Decode the JWT
    console.log("google token: ", response.credential)
        const credentials = JSON.parse(response)

        try {
           const googleAuth = await fetch("http://localhost:7000/auth/googleauth/callback", {
                method: "POST",
                headers: {"content-Type": "application/json"},
                body: JSON.stringify({credential: credentials}),
                credentials: "include"
           })
           const datas = googleAuth;
           const data = await datas.json()
           console.log(data)
           if (data.success === true) {
                const accessToken = data.accessT
                localStorage.setItem("DZAT", accessToken)
                
                window.location.reload()
            } else {
                alert("something when wong \n please try again or \n or try another method")
                window.location.reload()
            }
        } catch (e) {
           alert("<em>error connecting, please check internet connection</em>")
        }
    }