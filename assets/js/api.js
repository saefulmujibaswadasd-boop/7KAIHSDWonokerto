// ==========================
// API.JS FINAL
// ==========================

// Fungsi login siswa (contoh bawaan)
function loginSiswa() {
  const id = document.getElementById("loginID").value.trim();
  const info = document.getElementById("loginInfo");

  if (id === "") {
    info.textContent = "ID tidak boleh kosong!";
    return;
  }

  info.textContent = "";
  document.getElementById("loginArea").style.display = "none";
  document.getElementById("soalArea").style.display = "block";
}

// Fungsi microphone (contoh bawaan)
function startMic() {
  const micIndicator = document.getElementById("micIndicator");
  micIndicator.classList.remove("d-none");
  // Tambahkan logika speech-to-text sesuai kebutuhan
}

// Fungsi kirim jawaban (contoh bawaan)
function kirim() {
  const jawaban = document.getElementById("jawaban").value;
  const rekap = document.getElementById("rekap");
  rekap.innerHTML += `<p>Jawaban: ${jawaban}</p>`;
}

// ==========================
// SAPAAN SUARA HANGAT (FIX STABIL)
// ==========================
function playGreeting() {
  const greetingText = "Selamat datang anak-anak hebat SD Negeri Wonokerto. Semoga harimu penuh semangat dan kebahagiaan!";

  const utterance = new SpeechSynthesisUtterance(greetingText);
  utterance.lang = "id-ID";
  utterance.rate = 1;
  utterance.pitch = 1.2;

  function setVoiceAndSpeak() {
    const voices = speechSynthesis.getVoices();
    const indoVoice = voices.find(v => v.lang.includes("id"));

    if (indoVoice) {
      utterance.voice = indoVoice;
    }

    speechSynthesis.speak(utterance);
  }

  // Jika voice sudah tersedia
  if (speechSynthesis.getVoices().length !== 0) {
    setVoiceAndSpeak();
  } else {
    // Tunggu sampai voice ready
    speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
  }
}

// Jalankan setelah halaman benar-benar siap
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(playGreeting, 800); // delay sedikit supaya tidak bentrok loading screen
});
// Jalankan otomatis setelah halaman dimuat
window.addEventListener("load", () => {
  // Coba langsung
  playGreeting();
  
  // Jika autoplay diblokir, sediakan tombol manual
  const btn = document.createElement("button");
  btn.textContent = "🔊 Putar Sapaan";
  btn.style.position = "fixed";
  btn.style.bottom = "10px";
  btn.style.right = "10px";
  btn.style.zIndex = "9999";
  btn.onclick = playGreeting;
  document.body.appendChild(btn);
});
