function register() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    });
}

function login() {
    const email = document.getElementById('login_email').value;
    const password = document.getElementById('login_password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful!') {
            document.getElementById('schedule').style.display = 'block';
            document.getElementById('user_id').value = data.user_id;
        } else {
            alert(data.message);
        }
    });
}

function submitSchedule() {
    const user_id = document.getElementById('user_id').value;
    const schedule = {
        1: document.getElementById('period_1').value,
        2: document.getElementById('period_2').value,
        3: document.getElementById('period_3').value,
        4: document.getElementById('period_4').value,
        5: document.getElementById('period_5').value,
        6: document.getElementById('period_6').value,
        7: document.getElementById('period_7').value,
    };

    fetch('/submit_schedule', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id, schedule }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    });
}

function getClassmates() {
    const user_id = document.getElementById('user_id').value;

    fetch('/get_classmates', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id }),
    })
    .then(response => response.json())
    .then(data => {
        const classmates_list = document.getElementById('classmates_list');
        classmates_list.innerHTML = '';
        for (let period in data) {
            const period_div = document.createElement('div');
            period_div.innerHTML = `<h3>Period ${period}</h3><p>${data[period].join(', ')}</p>`;
            classmates_list.appendChild(period_div);
        }
        document.getElementById('classmates').style.display = 'block';
    });
}
