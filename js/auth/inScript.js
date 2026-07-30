
// google signin dumb function
// what do you mean there is bug is working fine trust me;

window.handleCredentialResponse = async function (response) {
    try {
        const googleAuth = await fetch(
            "https://downzilla-backend.onrender.com/auth/googleauth/callback",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    credential: response.credential
                }),
                credentials: "include"
            }
        );

        const data = await googleAuth.json();

        if (data.success) {
            localStorage.setItem("DZAT", data.accessT);

            // Notify the page that opened this window
            if (window.opener && !window.opener.closed) {
                window.opener.postMessage(
                    {
                        type: "google-auth-success",
                        accessT: data.accessT
                    },
                    "https://www.downzilla.buzz"
                );

                window.close();
            } else {
                // If opened directly, just go back to Downzilla
                window.location.href = "https://www.downzilla.buzz/user/downloader";
               // window.close()
            }
        } else {
            alert("Something went wrong, please try again or try another method.");
        }
    } catch (e) {
        console.error(e);
        alert("Error connecting, please check your internet connection.");
    }
};
