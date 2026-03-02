// ===== PASSWORD ADMIN =====
const ADMIN_PASSWORD = "saefulsdwonokerto";

// Cek apakah sudah login sebelumnya
if(localStorage.getItem("adminLogged")==="true"){
showAdminPanel();
}

function loginAdmin(){
let pass = document.getElementById("adminPass").value;

if(pass===ADMIN_PASSWORD){
localStorage.setItem("adminLogged","true");
showAdminPanel();
}else{
document.getElementById("errorLogin")
.innerText="Password salah!";
}
}

function showAdminPanel(){
document.getElementById("loginAdmin").style.display="none";
document.getElementById("adminPanel").style.display="block";
loadData();
}

function logoutAdmin(){
localStorage.removeItem("adminLogged");
location.reload();
}


// ===== LOAD DATA =====
function loadData(){
fetch(apiURL)
.then(res=>res.json())
.then(data=>{

let siswa={};
let table="";
let no=1;

data.forEach(r=>{
let id=r[1];
let nama=r[2];
let pertanyaan=r[3];
let jawaban=r[4];
let skor=parseInt(r[6]);

if(!siswa[id]) siswa[id]={nama:nama,total:0};
siswa[id].total+=skor;

table+=`
<tr>
<td>${no++}</td>
<td>${id}</td>
<td>${nama}</td>
<td>${pertanyaan}</td>
<td>${jawaban}</td>
<td>${skor}</td>
</tr>`;
});

document.getElementById("dataTable").innerHTML=table;

let ranking=Object.entries(siswa)
.sort((a,b)=>b[1].total-a[1].total);

let html="<h5>🏆 Ranking Realtime</h5>";
ranking.forEach((r,i)=>{
html+=`
<div class="card p-2 mb-2 shadow-sm">
${i+1}. <b>${r[1].nama}</b> 
<span class="badge bg-success">Skor ${r[1].total}</span>
</div>`;
});

document.getElementById("ranking").innerHTML=html;

});
}