function loginAdmin() {

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    if (
        username === "admin" &&
        password === "12345"
    ) {

        localStorage.setItem(
            "adminLoggedIn",
            "true"
        );

        window.location.href =
            "admin-dashboard.html";

    } else {

        alert(
            "Invalid login details."
        );

    }

}
function loginAdmin() {

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    if (
        username === "admin" &&
        password === "12345"
    ) {

        localStorage.setItem(
            "adminLoggedIn",
            "true"
        );

        window.location.href =
            "dashboard.html";

    } else {

        alert(
            "Invalid username or password."
        );

    }

            }
