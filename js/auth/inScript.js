
// google signin dumb function
// what do you mean there is bug is working fine trust me;

async function handleCredentialResponse(response) {
    console.log("google token: ", response.credential);
    try {
        const googleAuth = await fetch("https://downzilla-backend.onrender.com/auth/googleauth/callback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential: response.credential }),
            credentials: "include"
        });
        const data = await googleAuth.json();
        if (data.success === true) {
            localStorage.setItem("DZAT", data.accessT);
            window.location.reload();
        } else {
            alert("Something went wrong, please try again or try another method");
        }
    } catch (e) {
        console.error(e);
        alert("Error connecting, please check internet connection");
    }
}
