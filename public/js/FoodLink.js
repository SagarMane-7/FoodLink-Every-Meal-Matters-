let Login = document.querySelector("#loginbtn");
Login.addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = '/Login'
});

let Register = document.querySelector("#registerbtn");
Register.addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = '/Register'
});

let DonateUS = document.querySelector("#donateusbtn");
DonateUS.addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = '/DonateFood'
});

