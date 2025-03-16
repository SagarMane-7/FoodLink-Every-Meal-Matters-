let DonateMoney = document.querySelector("#tomoneybtn");
DonateMoney.addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = '/DonateMoney'
});

let Reg = document.querySelector("#fddonatebtn");
Reg.addEventListener('click', function (event) {
    event.preventDefault();
    let fname = document.querySelector("#fdfname").value
    let lname = document.querySelector("#fdlname").value
    let email = document.querySelector("#fdemail").value
    let mobile = document.querySelector("#fdmobile").value
    let address = document.querySelector("#fdaddress").value
    let date = document.querySelector("#date").value
    let time = document.querySelector("#time").value
    let Food_Category = document.querySelector("#Food_Category").value
    let description = document.querySelector("#fddescription").value

    if (fname === "" || lname === "" || email === "" || mobile === "" || address === "" || description === "" || date === "" || time === "" || Food_Category === "") {
        alert("All Fields are Mandatory.")
        return;
    }
    if (mobile.length !== 10 || isNaN(mobile)) {
        alert("Enter Valid Mobile Number.")
        return;
    }
    alert("NGO will contact you shortly")
    // To Submit form
    document.getElementById("fooddonationform").submit();
});