/* =====================================================
   7KAIH DIGITAL 2026 - STABLE CORE VERSION
===================================================== */

const AppState = {
  dataSiswa: JSON.parse(localStorage.getItem("dataSiswa")) || [],
  currentNama: "",
  currentSoal: 0
};

function generateSoal() {
  return [
  "Al khamdulillah Ananda ${AppState.currentNama} sampun tangi tilem, wau tangi jam pinten?",
  "sampun maos do'a tangi tilem dereng? monggo kulo tuntun maos do'a nipun. Bismillahirohman nirochim alk khamdulillahiladzi ahyana ba'dama amatana wailaihinnusur?",
  "Apakah sudah sholat subuh?",
  "Apakah sudah merapikan tempat tidur?",
  "Sebutkan dua nama pahlawan nasional dan asalnya.",
  "Ubahlah cerita menjadi kalimat matematika."
];

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

/* ================= INIT ================= */

function initApp() {
  hideLoading();
  bindEvents();
}

/* ================= LOADING ================= */

function hideLoading() {
  const loading = document.getElementById("loadingScreen");

  setTimeout(() => {
    if (loading) loading.style.display = "none";
  }, 800);
}

/* ================= EVENTS ================= */

function bindEvents() {
  const loginBtn = document.getElementById("loginBtn");
  const kirimBtn = document.getElementById("kirimBtn");

  if (loginBtn) loginBtn.addEventListener("click", handleLogin);
  if (kirimBtn) kirimBtn.addEventListener("click", kirimJawaban);
}

/* ================= LOGIN ================= */

function handleLogin() {
  const input = document.getElementById("loginID");
  const feedback = document.getElementById("loginFeedback");

  if (!input) return;

  const id = input.value.trim().toUpperCase();
  const siswa = AppState.dataSiswa.find(s => s.ID === id);

  if (!siswa) {
    if (feedback) feedback.textContent = "ID tidak ditemukan";
    return;
  }

  AppState.currentNama = siswa.nama_siswa;

  document.getElementById("openingScreen")?.classList.add("d-none");

  showGreeting();
}

/* ================= GREETING ================= */

function showGreeting() {
  const screen = document.getElementById("greetingScreen");
  const text = document.getElementById("greetingText");
  const mainApp = document.getElementById("mainApp");
  const sholawat = document.getElementById("sholawat");

  screen?.classList.remove("d-none");

  const message = `Selamat datang ${AppState.currentNama}`;
  if (text) text.textContent = message;

  speak(message);

  sholawat?.play().catch(() => {});

  setTimeout(() => {
    screen?.classList.add("d-none");
    mainApp?.classList.remove("d-none");
    tampilkanSoal();
  }, 3500);
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
  const bar = document.getElementById("progressBar");
  if (!bar) return;

  const percent = (AppState.currentSoal / soalList.length) * 100;
  bar.style.width = percent + "%";
}

/* ================= SPEECH ================= */

function speak(text) {
  if (!("speechSynthesis" in window)) return;

  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "id-ID";

  speechSynthesis.cancel();
  speechSynthesis.speak(msg);
}


