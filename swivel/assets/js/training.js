// ROLE CHECK
const userRole = localStorage.getItem("userRole");

// Hide upload section for students
if (userRole === "1") {
    const uploadSection = document.getElementById("trainerUploadSection");
    if (uploadSection) uploadSection.style.display = "none";
}

// Array to hold recorded videos
let recordedVideos = [
    { name: "Java Full Stack - Day 1", file: null, url: "assets/videos/video2.mp4" }
];

// DOM Elements
const videosContainer = document.getElementById("videosContainer");

// Render recorded videos
function renderVideos() {
    videosContainer.innerHTML = "";

    recordedVideos.forEach((video, index) => {
        const col = document.createElement("div");
        col.className = "col-md-6 mb-4";

        col.innerHTML = `
        <div class="card p-3 shadow">
            <h5 class="mb-2">${video.name}</h5>
            <video src="${video.url}" controls class="w-100 mb-3"></video>
            <button class="btn btn-primary w-100" onclick="downloadVideo(${index})">
                Download Video
            </button>
        </div>
        `;

        videosContainer.appendChild(col);
    });
}


// Upload video (Trainer)
const uploadForm = document.getElementById("uploadForm");
uploadForm.addEventListener("submit", e => {
    e.preventDefault();

    const sessionName = uploadForm.querySelector('input[type="text"]').value;
    const fileInput = uploadForm.querySelector('input[type="file"]');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a video");
        return;
    }

    const videoURL = URL.createObjectURL(file);

    recordedVideos.push({
        name: sessionName,
        file: file,        // ✅ store file
        url: videoURL      // ✅ store preview URL
    });

    uploadForm.reset();
    renderVideos();
});

// function downloadVideo(index) {
//     const video = recordedVideos[index];

//     const link = document.createElement("a");
//     link.style.display = "none";

//     if (video.file) {
//         // Uploaded video
//         link.href = URL.createObjectURL(video.file);
//     } else {
//         // Static video
//         link.href = video.url;
//     }

//     link.download = video.name.replace(/\s+/g, "_") + ".mp4";
//     document.body.appendChild(link);
//     link.click();

//     setTimeout(() => {
//         document.body.removeChild(link);
//         if (video.file) URL.revokeObjectURL(link.href);
//     }, 100);
// }

async function downloadVideo(index) {
    const video = recordedVideos[index];

    let urlToDownload;

    if (video.file) {
        // Uploaded video
        urlToDownload = URL.createObjectURL(video.file);
    } else {
        // Static video
        const response = await fetch(video.url);
        if (!response.ok) {
            alert("Video file not found on server");
            return;
        }
        const blob = await response.blob();
        urlToDownload = URL.createObjectURL(blob);
    }

    const a = document.createElement("a");
    a.href = urlToDownload;
    a.download = video.name.replace(/\s+/g, "_") + ".mp4";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => URL.revokeObjectURL(urlToDownload), 1000);
}



// Initial render
renderVideos();

function logout() {
    window.location.href = "login.html";
}
