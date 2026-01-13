let examStarted = false;
let violations = 0;
const MAX_VIOLATIONS = 3;

let current = 0;
let selected = null;
let score = 0;
let time = 3 * 60 * 60; // 3 hours

const questions = Array.from({ length: 5 }, (_, i) => ({
    q: `Question ${i + 1}: What is ${i + 1} + ${i + 1}?`,
    options: [(i + 1) * 2, i + 1, i, i + 2].sort(() => Math.random() - 0.5),
    answer: (i + 1) * 2
}));

const camera = document.getElementById("camera");
const qCount = document.getElementById("qCount");
const question = document.getElementById("question");
const optionsDiv = document.getElementById("options");
const timerEl = document.getElementById("timer");
const violationCountEl = document.getElementById("violationCount");
const examSection = document.getElementById("examSection");
const finishSection = document.getElementById("finishSection");
const finalScoreEl = document.getElementById("finalScore");

let detectionInterval;

// Load models and start exam immediately
async function startExam() {
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/');
        await faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/');

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        camera.srcObject = stream;
        examStarted = true;

        stream.getVideoTracks()[0].onended = () => {
            if (examStarted) registerViolation("Camera turned OFF");
        };

        detectionInterval = setInterval(detectHeadTurn, 1000);

        loadQuestion();
        startTimer();
    } catch {
        alert("Camera permission is required!");
    }
}

// Head turn detection
async function detectHeadTurn() {
    const detections = await faceapi.detectSingleFace(camera, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
    if (!detections) {
        registerViolation("Face not detected");
        return;
    }

    const landmarks = detections.landmarks;
    const nose = landmarks.getNose()[0];
    const leftEye = landmarks.getLeftEye()[0];
    const rightEye = landmarks.getRightEye()[3];

    const eyeDistance = rightEye.x - leftEye.x;
    const nosePosition = (nose.x - leftEye.x) / eyeDistance;

    if (nosePosition < 0.35 || nosePosition > 0.65) {
        registerViolation("Head turned left/right");
    }
}

// Load and render question
function loadQuestion() {
    const q = questions[current];
    qCount.innerText = `Question ${current + 1} / ${questions.length}`;
    question.innerText = q.q;
    optionsDiv.innerHTML = "";

    q.options.forEach(opt => {
        const label = document.createElement("label");
        label.className = "option";
        label.innerHTML = `<input type="radio" name="opt" onclick="selectOption(this, ${opt})"> ${opt}`;
        optionsDiv.appendChild(label);
    });
}

function selectOption(el, val) {
    selected = val;
    document.querySelectorAll(".option").forEach(o => o.classList.remove("selected"));
    el.parentElement.classList.add("selected");
}

function nextQuestion() {
    if (selected === questions[current].answer) score++;
    selected = null;
    current++;
    current >= questions.length ? finishExam() : loadQuestion();
}

function startTimer() {
    setInterval(() => {
        let h = Math.floor(time / 3600);
        let m = Math.floor((time % 3600) / 60);
        let s = time % 60;
        timerEl.innerText = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
        time--;
        if (time < 0) finishExam();
    }, 1000);
}

function registerViolation(reason) {
    violations++;
    violationCountEl.innerText = `Violations: ${violations}/3`;

    // Show non-blocking warning in a banner
    let warningBanner = document.createElement("div");
    warningBanner.className = "violation-banner";
    warningBanner.innerText = `Violation ${violations}/3: ${reason}`;

    const proctorBox = document.querySelector(".proctor-box");
    proctorBox.appendChild(warningBanner);

    // Remove banner after 3 seconds
    setTimeout(() => {
        warningBanner.remove();
    }, 3000);

    if (violations >= MAX_VIOLATIONS) terminateExam(reason);
}


window.addEventListener("blur", () => { if (examStarted) registerViolation("Tab switched"); });
document.addEventListener("visibilitychange", () => { if (examStarted && document.hidden) registerViolation("Browser minimized"); });
["copy", "paste", "cut", "contextmenu"].forEach(e => document.addEventListener(e, ev => ev.preventDefault()));

function finishExam() {
    examStarted = false;
    examSection.style.display = "none";
    finishSection.style.display = "block";
    finalScoreEl.innerText = `${score} / ${questions.length}`;
}

function terminateExam(reason) {
    examStarted = false;
    clearInterval(detectionInterval);
    document.body.innerHTML = `
    <div class="container text-center mt-5">
      <h2 class="text-danger">Exam Terminated</h2>
      <p>${reason}</p>
      <p>No re-attempt allowed</p>
    </div>`;
}

// Start exam automatically on page load
startExam();

function dashboard() {
    window.location.href = 'dashboard.html';
}
