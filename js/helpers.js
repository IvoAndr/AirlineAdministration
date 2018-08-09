function formatDate(date) {
    let formatedDate = new Date(date);
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return formatedDate.getDate() + " " + months[formatedDate.getMonth()];
}

function saveAuthInSession(userData) {
    sessionStorage.setItem("userToken", userData._kmd.authtoken);
    sessionStorage.setItem("userName", userData.username);
    sessionStorage.setItem("userId", userData._id);
}

function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response);

    if (response.readyState === 0) {
        errorMsg = "Cannot connect due to network error.";
    }

    if (response.responseJSON && response.responseJSON.description) {
        errorMsg = response.responseJSON.description;
    }

    showError(errorMsg);
}

function showInfo(infoMsg) {
    let infoBox = $("#infoBox");
    infoBox.show();
    $("#infoBox > span").text(infoMsg);

    setTimeout(function() {
        infoBox.fadeOut();
    }, 3000)
}

function showError(errorMsg) {
    let errorBox = $("#errorBox");
    errorBox.show();
    $("#errorBox > span").text(errorMsg);

    setTimeout(function() {
        errorBox.fadeOut();
    }, 3000)
}