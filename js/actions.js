const BASE_URL = "https://baas.kinvey.com/";
const APP_KEY = "kid_HJzrCgIS7";
const APP_SECRET = "f9590f753fe74c63b051e299f78e37bc";
const AUTH_HEADERS = {"Authorization": "Basic " + btoa(APP_KEY + ":" + APP_SECRET)};

function showHome() {
    if (sessionStorage.getItem("userToken") === null) {
        showLoginView();
    }
    else {
        loadPublicFights();
    }
}

function registerUser() {
    let username = $("#formRegister input[name='username']").val();
    let password = $("#formRegister input[name='pass']").val();
    let checkPassword = $("#formRegister input[name='checkPass']").val();

    if (username < 4) {
        showError("Username must be at least 4 characters!");
        return;
    }
    else {
        if (username === "" || password === "" || checkPassword === "") {
            showError("Username or password cannot be empty!");
            return;
        }
        else if (password !== checkPassword) {
            showError("Passwords don't match!");
            return;
        }
    }

    $.ajax({
        method: "POST",
        url: BASE_URL + "user/" + APP_KEY + "/",
        headers: AUTH_HEADERS,
        data: {username, password}
    }).then(function (res) {
        signInUser(res, "Registration successful.");
    }).catch(handleAjaxError);
}

function loginUser() {
    let username = $("#formLogin input[name='username']").val();
    let password = $("#formLogin input[name='pass']").val();

    if (username === "" || password === "") {
        showError("Username or password cannot be empty!");
        return;
    }

    $.ajax({
        method: "POST",
        url: BASE_URL + "user/" + APP_KEY + "/login/",
        headers: AUTH_HEADERS,
        data: {username, password}
    }).then(function (res) {
        signInUser(res, "Login successful.");
    }).catch(handleAjaxError);
}

async function logoutUser() {
    await $.ajax({
        method: "POST",
        url: BASE_URL +  "user/" + APP_KEY + "/_logout",
        headers: {Authorization: "Kinvey " + sessionStorage.getItem("userToken")}
    });
    sessionStorage.clear();
    showNavigation();
    showLoginView();
    showInfo("Logout successful.");
}

async function signInUser(res, message) {
    saveAuthInSession(res);
    await showNavigation();
    await loadPublicFights();
    showInfo(message);
}

function loadPublicFights() {
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/flights?query={"isPublic":"true"}',
        headers: {Authorization: 'Kinvey ' + sessionStorage.getItem('userToken')},
    }).then(function (res) {
        showHomeView(res.reverse());
    }).catch(handleAjaxError);
}

async function loadMyFights() {
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' +
            APP_KEY + `/flights?query={"_acl.creator":"${sessionStorage.getItem("userId")}"}`,
        headers: {Authorization: 'Kinvey ' + sessionStorage.getItem('userToken')},
    }).then(function (res) {
        showMyFlightsView(res);
    }).catch(handleAjaxError);
}

function addFlight() {
    let destination = $("#formAddFlight input[name='destination']").val();
    let origin = $("#formAddFlight input[name='origin']").val();
    let departureDate = $("#formAddFlight input[name='departureDate']").val();
    let departureTime = $("#formAddFlight input[name='departureTime']").val();
    let seats = Number($("#formAddFlight input[name='seats']").val());
    let cost = Number($("#formAddFlight input[name='cost']").val());
    let img = $("#formAddFlight input[name='img']").val();
    let isPublic = $("#formAddFlight input[name='public']").is(":checked");

    if (destination === "" || origin === "") {
        console.log("Empty");
        return;
    }

    if (seats < 1 || cost < 1) {
        console.log("Little");
        return;
    }

    $.ajax({
        method: 'POST',
        url: BASE_URL + 'appdata/' + APP_KEY + '/flights',
        headers: {Authorization: 'Kinvey ' + sessionStorage.getItem('userToken')},
        data: {destination, origin, departureDate, departureTime,
            seats, cost, img, isPublic}
    }).then(function () {
        loadPublicFights();
        showInfo("Created flight.");
    }).catch(handleAjaxError);
}

function editFlight(id) {
    let destination = $("#formEditFlight input[name='destination']").val();
    let origin = $("#formEditFlight input[name='origin']").val();
    let departureDate = $("#formEditFlight input[name='departureDate']").val();
    let departureTime = $("#formEditFlight input[name='departureTime']").val();
    let seats = Number($("#formEditFlight input[name='seats']").val());
    let cost = Number($("#formEditFlight input[name='cost']").val());
    let img = $("#formEditFlight input[name='img']").val();
    let isPublic = $("#formEditFlight input[name='public']").is(":checked");

    if (destination === "" || origin === "") {
        console.log("Empty");
        return;
    }

    if (seats < 1 || cost < 1) {
        console.log("Little");
        return;
    }

    $.ajax({
        method: "PUT",
        url: BASE_URL + "appdata/" + APP_KEY + "/flights/" + id,
        headers: {Authorization: "Kinvey " + sessionStorage.getItem("userToken")},
        data: {destination, origin, departureDate, departureTime,
            seats, cost, img, isPublic}
    }).then(function () {
        loadSingleFight(id);
        showInfo("Successfully edited flight.");
    }).catch(handleAjaxError);
}

function delFlight(id) {
    if (confirm("Delete this flight?")) {
        $.ajax({
            method: "DELETE",
            url: BASE_URL + "appdata/" + APP_KEY + "/flights/" + id,
            headers: {Authorization: "Kinvey " + sessionStorage.getItem("userToken")},
        }).then(function () {
            loadMyFights();
            showInfo("Flight deleted.");
        }).catch(handleAjaxError);
    }
}

function loadSingleFight(id) {
    $.ajax({
        method: 'GET',
        url: BASE_URL + "appdata/" + APP_KEY + "/flights/" + id,
        headers: {Authorization: "Kinvey " + sessionStorage.getItem("userToken")}
    }).then(function (res) {
        console.log(res);
        showFlightDetailsView(res);
    }).catch(handleAjaxError);
}

