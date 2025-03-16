let Register = document.querySelector("#registerbtn");

Register.addEventListener("click", function (event) {
    event.preventDefault();

    let NGOName = document.querySelector("#NGOname").value;
    let Address = document.querySelector("#address").value;
    let Mobile = document.querySelector("#mobile").value;
    let Email = document.querySelector("#email").value;
    let PAN = document.querySelector("#PANID").value;
    let Trust = document.querySelector("#trustID").value;
    let DARPAN = document.querySelector("#DARPANID").value;
    let Set = document.querySelector("#setpassword").value;
    let Confirm = document.querySelector("#confirmpassword").value;
    if (NGOName === "" || Address === "" || Mobile === "" || Email === "" || PAN === "" || Trust === "" || Set === "" || Confirm === "") {
        alert("All Fields are Mandatory.");
        return;
    }
    if (Mobile.length !== 10 || isNaN(Mobile)) {
        alert("Enter a Valid Mobile Number.");
        return;
    }
    if (PAN.length !== 10) {
        alert("Enter a Valid PAN Number.");
        return;
    }
    if (Set !== Confirm) {
        alert("Passwords Must Be same.");
        return;
    }
    alert("Registration successful! Your login details will be sent to your email shortly.");
    // To Submit form
    document.getElementById("registerform").submit();
});

