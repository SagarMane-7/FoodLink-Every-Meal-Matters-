let history = document.querySelector("#history");
history.addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = '/history'
});

let dashboard = document.querySelector("#dashboard");
dashboard.addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = '/dashboard'
});

let logout = document.querySelector("#logout");
logout.addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = '/'
});