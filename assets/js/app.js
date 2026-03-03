/* =====================================================
   7KAIH DIGITAL 2026 - FINAL STABLE VERSION
===================================================== */

/* ================= STATE ================= */

const AppState = {
  dataSiswa: JSON.parse(localStorage.getItem("dataSiswa")) || [],
  currentNama: "",
  currentSoal: 0
};

let soalList = [];

/* ================= GENERATE SOAL ================= */

function generateSoal() {
  return [
    `Al khamdulillah Ananda ${AppState.currentNama} sampun tangi, wau tangi jam pinten?`,
    "monggo kulo tuntun baca do'a tangi tilem, al khamdulillahiladzi ahyana ba'dama amatana wailaihinnusyur",
    `sak sampunipun tangi tilem, Ananda ${AppState.currentNama} rencana ajeng kegiatan nopo ke mawon, sebataken tigo kemawon?`,
    "Apakah sudah merapikan tempat tidur?",
    "Sebutkan dua nama pahlawan nasional dan asalnya.",
    "Ubahlah cerita menjadi kalimat matematika."
  ];
}

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

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

  // Set nama siswa
  AppState.currentNama = siswa.nama_siswa;

  // Generate soal sesuai nama
  soalList = generateSoal();
  AppState.currentSoal = 0;

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

/* ================= TAMPILKAN SOAL ================= */

function tampilkanSoal() {
  const soalText = document.getElementById("soalText");

  if (!soalText) return;

  if (AppState.currentSoal >= soalList.length) {
    soalText.innerHTML = "<h4>Terima kasih, semoga harimu berkah 🌸</h4>";
    updateProgress();
    return;
  }

  const soal = soalList[AppState.currentSoal];
  soalText.textContent = soal;

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
  if (!bar || soalList.length === 0) return;

  const percent = ((AppState.currentSoal) / soalList.length) * 100;
  bar.style.width = percent + "%";
}

/* ================= SPEECH ================= */

function speak(text) {
  if (!("speechSynthesis" in window)) return;

  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "id-ID";
  msg.rate = 0.95;

  speechSynthesis.cancel();
  speechSynthesis.speak(msg);
}

