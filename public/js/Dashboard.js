let history = document.querySelector("#history");
history.addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = '/history'
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

const acceptButtons = document.querySelectorAll('#acceptbtn');
acceptButtons.forEach(button => {
    button.addEventListener('click', function () {

        const row = button.closest('tr');
        if (row.classList.contains('accepted')) {
            row.remove();
            return;
        }
        row.classList.add('accepted');

        const name = row.querySelector('#name').textContent;
        const number = row.querySelector('#number').textContent;
        const email = row.querySelector('#email').textContent;
        const address = row.querySelector('#address').textContent;
        const date = row.querySelector('#date').textContent;

        const acceptrow = document.createElement('tr');
        acceptrow.innerHTML = `
            <td id="name">${name}</td>
            <td id="number">${number}</td>
            <td id="email">${email}</td>
            <td id="address">${address}</td>
            <td id="date">${date}</td>
            <td id="Status"><button id="pickedbtn">Picked Up</button></td>
        `;

        const acceptedtable = document.querySelector('#acceptedtable tbody');
        acceptedtable.appendChild(acceptrow);

        const pickedbtns = document.querySelectorAll('#pickedbtn');
        pickedbtns.forEach(button => {
            button.addEventListener('click', function () {
                const row = button.closest('tr');
                row.remove();
            });
            document.getElementById("'#acceptbtn'").submit();
        });
        row.remove();
    });

});

const pickedButtons = document.querySelectorAll('#pickedbtn');
pickedButtons.forEach(button => {
    button.addEventListener('click', function() {
        const row = button.closest('tr');
        row.remove();  
        document.getElementById("pickedbtn").submit();
    });
        });

