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

function initLoading() {
  window.addEventListener("load", () => {
    const btn = document.getElementById("startAppBtn");
    btn.classList.remove("d-none");

    btn.addEventListener("click", () => {
      speak("Selamat datang di aplikasi 7 Kebiasaan Anak Indonesia Hebat SD Negeri Wonokerto.");
      document.getElementById("loadingScreen").style.display="none";
    });
  });
}

function initEvents(){
  document.getElementById("loginBtn").addEventListener("click", handleLogin);
  document.getElementById("kirimBtn").addEventListener("click", kirimJawaban);
}

function handleLogin(){
  const id = document.getElementById("loginID").value.trim().toUpperCase();
  const siswa = AppState.dataSiswa.find(s=>s.ID===id);

  if(!siswa){
    document.getElementById("loginFeedback").textContent="ID tidak ditemukan";
    return;
  }

  AppState.currentNama = siswa.nama_siswa;

  document.getElementById("openingScreen").classList.add("d-none");
  showGreeting();
}

function showGreeting(){
  const screen=document.getElementById("greetingScreen");
  const text=document.getElementById("greetingText");

  screen.classList.remove("d-none");

  const message=`Selamat datang ${AppState.currentNama}`;
  text.textContent=message;

  speak(message);

  document.getElementById("sholawat").play();

  setTimeout(()=>{
    screen.classList.add("d-none");
    document.getElementById("mainApp").classList.remove("d-none");
    tampilkanSoal();
  },4000);
}

function tampilkanSoal(){
  if(AppState.currentSoal>=soalList.length){
    document.getElementById("soalText").innerHTML="<h4>Terima kasih</h4>";
    return;
  }

  const soal=soalList[AppState.currentSoal];
  document.getElementById("soalText").textContent=soal;

  updateProgress();
  speak(soal);
}

function kirimJawaban(){
  const input=document.getElementById("jawaban");
  if(!input.value.trim())return;

  AppState.currentSoal++;
  input.value="";
  tampilkanSoal();
}

function updateProgress(){
  const percent=((AppState.currentSoal)/soalList.length)*100;
  document.getElementById("progressBar").style.width=percent+"%";
}

function speak(text){
  if(!("speechSynthesis" in window))return;
  const msg=new SpeechSynthesisUtterance(text);
  msg.lang="id-ID";
  speechSynthesis.cancel();
  speechSynthesis.speak(msg);
}