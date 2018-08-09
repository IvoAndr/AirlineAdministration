async function showNavigation() {
    let data = {};

    if (sessionStorage.getItem("userToken") === null) {
        data = {
            logged: false
        };
    }
    else {
        data = {
            logged: true,
            user: sessionStorage.getItem("userName")
        };
    }

    let nav = $("nav");
    nav.empty();
    let html = await $.get("./templates/navigation.hbs");
    let template = Handlebars.compile(html);
    let filledTemplate = template(data);
    nav.append(filledTemplate);

    $("a:contains('Login')").on("click", showLoginView);
    $("a:contains('Register')").on("click", showRegisterView);
    $("a:contains('Logout')").on("click", logoutUser);
    $("a:contains('Home')").on("click", loadPublicFights);
    $("a:contains('Flights')").on("click", loadMyFights);

}

function showTemplate(html, data) {
    let main = $("main");
    main.empty();
    main.css("display", "block");
    let template = Handlebars.compile(html);

    if (data) {
        let filledTemplate = template(data);
        main.append(filledTemplate);
    }
    else {
        main.append(template);
    }
}

async function showRegisterView() {
    let html = await $.get("./templates/register.hbs");
    showTemplate(html);
    $("#formRegister").on("submit", function (event) {
        registerUser();
        event.preventDefault();
    })
}

async function showLoginView() {
    let html = await $.get("./templates/login.hbs");
    showTemplate(html);
    $("#formLogin").on("submit", function (event) {
        loginUser();
        event.preventDefault();
    });
}

async function showHomeView(data) {
    let html = await $.get("./templates/home.hbs");
    data.map(d => d.departureDate = formatDate(d.departureDate));
    let dataObj = {
        data: data
    };

    showTemplate(html, dataObj);
    $("a:contains('Add Flight +')").on("click", showAddFlightView);
    let a = $(".added-flight");
    a.on("click", async function () {
        let flight = data[$(this).attr("flightIndex")];
        showFlightDetailsView(flight);
    })
}

async function showMyFlightsView(data) {
    let html = await $.get("./templates/myFlights.hbs");
    let dataObj = {
        data: data.reverse()
    };
    showTemplate(html, dataObj);
    let aEdit = $(".details");
    aEdit.on("click", function () {
        showFlightDetailsView(data[$(this).attr("index")]);
    });
    let aDel = $(".remove");
    aDel.on("click", function () {
        delFlight(data[$(this).attr("index")]._id);
    });
}

async function showAddFlightView() {
    let html = await $.get("./templates/addFlight.hbs");
    showTemplate(html);
    $("#formAddFlight").on("submit", function (event) {
        addFlight();
        event.preventDefault();
    });
}

async function showFlightDetailsView(flight) {
    let html = await $.get("./templates/flightDetails.hbs");
    flight.departureDate = formatDate(flight.departureDate);
    flight.owner = flight._acl.creator === sessionStorage.getItem("userId");
    showTemplate(html, flight);
    $(".edit-flight-detail").on("click", function () {
        showEditFlightView(flight);
    })
}

async function showEditFlightView(flight) {
    if (flight.isPublic === "false") {
        flight.isPublic = false;
    }
    let html = await $.get("./templates/editFlight.hbs");
    showTemplate(html, flight);
    $("#formEditFlight").on("submit", function (event) {
        editFlight(flight._id);
        event.preventDefault();
    });
}
