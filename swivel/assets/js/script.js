/* ===== INDEX PAGE REDIRECT ===== */
function autoRedirect() {
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

/* ===== LOGIN & SIGNUP ===== */

function showSignup() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.remove('hidden');
}

function showLogin() {
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
}

function loginRedirect(event) {
    event.preventDefault();

    const email = document.querySelector('#loginForm input[type="email"]').value;
    const password = document.querySelector('#loginForm input[type="password"]').value;

    // STATIC TRAINER LOGIN
    if (email === "trainer@gmail.com" && password === "trainer") {
        localStorage.setItem("userRole", "0"); // Trainer
        localStorage.setItem("userEmail", email);
        window.location.href = "dashboard.html";
        return;
    }

    // ALL OTHERS ARE STUDENTS
    localStorage.setItem("userRole", "1"); // Student
    localStorage.setItem("userEmail", email);
    window.location.href = "dashboard.html";
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}


function apply() {
    window.location.href = 'application.html';
}

function training() {
    window.location.href = 'training.html';
}

function dashboard() {
    window.location.href = 'instruction.html';
}

function toggleProfileMenu() {
    document.getElementById("profileMenu").classList.toggle("show");
}

// Close menu when clicking outside
document.addEventListener("click", function (e) {
    const profile = document.querySelector(".profile-wrapper");
    if (!profile.contains(e.target)) {
        document.getElementById("profileMenu").classList.remove("show");
    }
});

