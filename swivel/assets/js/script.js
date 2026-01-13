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

    // ✅ ALWAYS GET PASSWORD BY ID (WORKS FOR password/text)
    const password = document.getElementById("loginPassword").value;

    // STATIC TRAINER LOGIN
    if (email === "trainer@gmail.com" && password === "trainer") {
        localStorage.setItem("userRole", "1"); // Trainer
        localStorage.setItem("userEmail", email);
        window.location.href = "dashboard.html";
        return;
    }

    // ALL OTHERS ARE STUDENTS
    localStorage.setItem("userRole", "0"); // Student
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

function instruction() {
    window.location.href = 'instruction.html';
}

function dashboard() {
    window.location.href = 'dashboard.html';
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

function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);

    if (input.type === "password") {
        input.type = "text";
        icon.textContent = "🙈";
    } else {
        input.type = "password";
        icon.textContent = "👁️";
    }
}

function hidePasswordBeforeSubmit() {
    const pwd = document.getElementById("loginPassword");
    if (pwd) {
        pwd.type = "password"; // force hide before submit
    }
}
