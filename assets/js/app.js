// ===============================
// KONFIGURASI GOOGLE SHEET
// ===============================
const sheetURL = "https://script.google.com/macros/s/AKfycbw5W0rpCu5ZwnvaC-C9o9lUkEcvaGoO-l51AINDAes5W2oOB3zZE2mi0-HhNbhef_qs/exec";

// ===============================
// VARIABEL GLOBAL
// ===============================
let dataSiswa = JSON.parse(localStorage.getItem("dataSiswa")) || [];
let currentNama = "";
let currentID = "";
let currentKelas = "";
let currentSoal = 0;
let greetingPlayed = false;

// ===============================
// DAFTAR SOAL
// ===============================
const soalList = [
  "Ananda wau tangi jam pinten?",
  "Apakah sudah membaca doa bangun tidur?",
  "Apakah sudah sholat subuh?",
  "Apakah sudah merapikan tempat tidur?",
  "Sebutkan dua nama pahlawan nasional dan asalnya.",
  "Andi membeli dua baju baru seharga lima puluh ribu rupiah. Harga satu baju dua puluh lima ribu rupiah. Ubahlah menjadi kalimat matematika."
];

// ===============================
// TEXT TO SPEECH
// ===============================
function speakIndonesia(text) {
  if (!("speechSynthesis" in window)) return;

  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "id-ID";
  msg.rate = 0.95;
  msg.pitch = 1;

  speechSynthesis.cancel();
  speechSynthesis.speak(msg);
}

// ===============================
// GREETING OTOMATIS SMART MODE
// ===============================
let greetingPlayed = false;

function playGreeting() {
  if (!("speechSynthesis" in window)) return;
  if (greetingPlayed) return;

  const text = "Selamat datang di aplikasi tujuh Kebiasaan Anak Indonesia Hebat SD Negeri Wonokerto. Tetap semangat belajar hari ini!";

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID";
  utterance.rate = 1;
  utterance.pitch = 1.1;
  utterance.volume = 1;

  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);

  greetingPlayed = true;
}

// Coba otomatis saat load
window.addEventListener("load", function () {
  setTimeout(() => {
    playGreeting();
  }, 800);
});

// Jika gagal → aktif saat klik pertama
document.addEventListener("click", function () {
  playGreeting();
}, { once: true });
// ===============================
// UPLOAD CSV DATA SISWA
// ===============================
document.addEventListener("DOMContentLoaded", function () {

  const uploadInput = document.getElementById("uploadCSV");

  if (!uploadInput) return;

  uploadInput.addEventListener("change", function (e) {

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {

      const lines = event.target.result
        .split(/\r?\n/)
        .filter(line => line.trim() !== "");

      let tempData = {};

      for (let i = 1; i < lines.length; i++) {

        const kolom = lines[i].split(/[;,]/);

        if (kolom.length >= 3) {

          const id = kolom[0].trim().toUpperCase();

          tempData[id] = {
            ID: id,
            nama_siswa: kolom[1].trim(),
            kelas: kolom[2].trim()
          };
        }
      }

      dataSiswa = Object.values(tempData);
      localStorage.setItem("dataSiswa", JSON.stringify(dataSiswa));

      alert("Data siswa berhasil disimpan: " + dataSiswa.length);
    };

    reader.readAsText(file);
  });
});

// ===============================
// LOGIN SISWA
// ===============================
function loginSiswa() {

  const inputID = document.getElementById("loginID").value.trim().toUpperCase();
  const info = document.getElementById("loginInfo");

  if (!inputID) {
    info.innerText = "ID tidak boleh kosong.";
    return;
  }

  const siswa = dataSiswa.find(s => s.ID === inputID);

  if (!siswa) {
    info.innerText = "ID tidak ditemukan.";
    return;
  }

  info.innerText = "";

  currentNama = siswa.nama_siswa;
  currentID = siswa.ID;
  currentKelas = siswa.kelas;
  currentSoal = 0;
  greetingPlayed = false;

  document.getElementById("loginArea").style.display = "none";
  document.getElementById("soalArea").style.display = "block";

  // Greeting berbunyi (karena hasil klik)
  playGreeting();

  setTimeout(() => {
    tampilkanSoal();
  }, 1000);
}

// ===============================
// TAMPILKAN SOAL
// ===============================
function tampilkanSoal() {

  if (currentSoal >= soalList.length) {
    tampilkanApresiasi();
    return;
  }

  const soal = soalList[currentSoal];
  document.getElementById("soalText").innerText = soal;

  speakIndonesia(soal);
}

// ===============================
// KIRIM JAWABAN
// ===============================
function kirim() {

  const jawabanInput = document.getElementById("jawaban");
  const jawaban = jawabanInput.value.trim();
  if (!jawaban) return;

  const pertanyaanSekarang = soalList[currentSoal];

  document.getElementById("rekap").innerHTML += `
    <div class="border rounded p-2 mb-2">
      <strong>Pertanyaan:</strong> ${pertanyaanSekarang}<br>
      <strong>Jawaban:</strong> ${jawaban}
    </div>
  `;

  simpanKeSheet(pertanyaanSekarang, jawaban);

  jawabanInput.value = "";
  currentSoal++;

  setTimeout(() => tampilkanSoal(), 800);
}

// ===============================
// SIMPAN KE GOOGLE SHEET
// ===============================
function simpanKeSheet(pertanyaan, jawaban) {

  fetch(sheetURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nama: currentNama,
      id: currentID,
      kelas: currentKelas,
      pertanyaan: pertanyaan,
      jawaban: jawaban
    })
  }).catch(err => console.log("Gagal kirim:", err));
}

// ===============================
// APRESIASI AKHIR
// ===============================
function tampilkanApresiasi() {

  document.getElementById("soalText").innerHTML = `
    <div class="text-center">
      <h4>Terima Kasih ${currentNama}</h4>
      <p>Kelas: ${currentKelas}</p>
      <h5 class="text-success">Bintang Disiplin ⭐⭐⭐</h5>
      <button class="btn btn-primary mt-2" onclick="exportPDF()">Download Laporan</button>
      <button class="btn btn-secondary mt-2" onclick="resetApp()">Reset</button>
    </div>
  `;

  if (typeof confetti !== "undefined") {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
  }

  speakIndonesia("Masya Allah luar biasa ananda " + currentNama);
}

// ===============================
// EXPORT PDF
// ===============================
function exportPDF() {
  const element = document.getElementById("rekap");
  if (typeof html2pdf !== "undefined") {
    html2pdf().from(element).save("Laporan_" + currentNama + ".pdf");
  }
}

// ===============================
// RESET APLIKASI
// ===============================
function resetApp() {

  currentNama = "";
  currentID = "";
  currentKelas = "";
  currentSoal = 0;
  greetingPlayed = false;

  document.getElementById("rekap").innerHTML = "";
  document.getElementById("jawaban").value = "";

  document.getElementById("soalArea").style.display = "none";
  document.getElementById("loginArea").style.display = "block";
  document.getElementById("loginID").value = "";
}

// ===============================
// HILANGKAN LOADING SCREEN
// ===============================
window.addEventListener("load", function () {
  const loading = document.getElementById("loadingScreen");
  if (loading) loading.style.display = "none";
});