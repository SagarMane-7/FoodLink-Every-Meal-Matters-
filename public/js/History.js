let dashboard = document.querySelector("#dashboard");
dashboard.addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = '/dashboard'
});

let profile = document.querySelector("#profile");
profile.addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = '/profile'
});

let logout = document.querySelector("#logout");
logout.addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = '/'
});
