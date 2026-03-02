/* =====================================================
   7KAIH DIGITAL 2026 - FINAL STABLE VERSION
   SD NEGERI WONOKERTO
===================================================== */

const AppState = {
  dataSiswa: JSON.parse(localStorage.getItem("dataSiswa")) || [],
  currentNama: "",
  currentSoal: 0
};

const soalList = [
  "Ananda wau tangi jam pinten?",
  "Apakah sudah membaca doa bangun tidur?",
  "Apakah sudah sholat subuh?",
  "Apakah sudah merapikan tempat tidur?",
  "Sebutkan dua nama pahlawan nasional dan asalnya.",
  "Ubahlah cerita menjadi kalimat matematika."
];

document.addEventListener("DOMContentLoaded", () => {
  initLoading();
  initEvents();
});

/* ================= LOADING ================= */

function initLoading() {
  const loadingScreen = document.getElementById("loadingScreen");

  // Tutup loading setelah 1 detik (stabil untuk GitHub Pages)
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.style.display = "none";
    }
  }, 1000);
}
/* ================= EVENTS ================= */

function initEvents() {
  const loginBtn = document.getElementById("loginBtn");
  const kirimBtn = document.getElementById("kirimBtn");

  if (loginBtn) loginBtn.addEventListener("click", handleLogin);
  if (kirimBtn) kirimBtn.addEventListener("click", kirimJawaban);
}

/* ================= LOGIN ================= */

function handleLogin() {
  const inputID = document.getElementById("loginID");
  const feedback = document.getElementById("loginFeedback");

  if (!inputID) return;

  const id = inputID.value.trim().toUpperCase();
  const siswa = AppState.dataSiswa.find(s => s.ID === id);

  if (!siswa) {
    if (feedback) feedback.textContent = "ID tidak ditemukan";
    return;
  }

  AppState.currentNama = siswa.nama_siswa;

  const opening = document.getElementById("openingScreen");
  if (opening) opening.classList.add("d-none");

  showGreeting();
}

/* ================= GREETING ================= */

function showGreeting() {
  const screen = document.getElementById("greetingScreen");
  const text = document.getElementById("greetingText");
  const mainApp = document.getElementById("mainApp");
  const sholawat = document.getElementById("sholawat");

  if (screen) screen.classList.remove("d-none");

  const message = `Selamat datang ${AppState.currentNama}`;
  if (text) text.textContent = message;

  speak(message);

  if (sholawat) {
    sholawat.play().catch(() => {
      console.log("Autoplay dicegah browser.");
    });
  }

  setTimeout(() => {
    if (screen) screen.classList.add("d-none");
    if (mainApp) mainApp.classList.remove("d-none");
    tampilkanSoal();
  }, 4000);
}

/* ================= SOAL ================= */

function tampilkanSoal() {
  const soalText = document.getElementById("soalText");

  if (AppState.currentSoal >= soalList.length) {
    if (soalText) soalText.innerHTML = "<h4>Terima kasih</h4>";
    return;
  }

  const soal = soalList[AppState.currentSoal];

  if (soalText) soalText.textContent = soal;

  updateProgress();
  speak(soal);
}

/* ================= JAWABAN ================= */

function kirimJawaban() {
  const input = document.getElementById("jawaban");
  if (!input) return;

  if (!input.value.trim()) return;

  AppState.currentSoal++;
  input.value = "";
  tampilkanSoal();
}

/* ================= PROGRESS ================= */

function updateProgress() {
  const progressBar = document.getElementById("progressBar");
  if (!progressBar) return;

  const percent = ((AppState.currentSoal) / soalList.length) * 100;
  progressBar.style.width = percent + "%";
}

/* ================= TEXT TO SPEECH ================= */

function speak(text) {
  if (!("speechSynthesis" in window)) return;

  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "id-ID";

  speechSynthesis.cancel();
  speechSynthesis.speak(msg);
}

