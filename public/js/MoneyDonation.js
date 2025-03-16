
let DonateFood = document.querySelector("#tofoodbtn");
DonateFood.addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = '/DonateFood'
});


let donatemoney = document.querySelector("#mddonatebtn");
donatemoney.addEventListener('click', function (event) {
    event.preventDefault();
    let fname = document.querySelector("#mdfname").value
    let lname = document.querySelector("#mdlname").value
    let mobile = document.querySelector("#mdmobile").value
    let amount = document.querySelector("#mdamount").value
    let email = document.querySelector("#email").value
    if (fname === "" || lname === "" || mobile === "" || amount === "" || email === "") {
        alert("All Fields are Mandatory.")
        return;
    }
    if (mobile.length !== 10 || isNaN(mobile)) {
        alert("Enter Valid Mobile Number.")
        return;
    }
    // To Submit form
    document.getElementById("moneydonationform").submit();
});
