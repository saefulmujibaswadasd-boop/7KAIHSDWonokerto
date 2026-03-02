function generateRaport(){
fetch(apiURL)
.then(res=>res.json())
.then(data=>{

let id=document.getElementById("cariID").value;
let total=0;
let nama="";
let jumlah=0;

data.forEach(r=>{
if(r[1]==id){
nama=r[2];
total+=parseInt(r[6]);
jumlah++;
}
});

if(jumlah==0){
document.getElementById("hasilRaport").innerHTML=
"<div class='alert alert-danger'>ID tidak ditemukan</div>";
return;
}

let rata=(total/jumlah).toFixed(1);

let kategori="Baik";
if(rata>=3) kategori="Sangat Baik";
if(rata<2) kategori="Perlu Pembinaan";

document.getElementById("hasilRaport").innerHTML=`
<div class="card p-3 shadow-sm">
<h5>Nama: ${nama}</h5>
<p>Total Skor: <b>${total}</b></p>
<p>Rata-rata: <b>${rata}</b></p>
<p>Kategori: 
<span class="badge bg-primary">${kategori}</span>
</p>
</div>`;
});
}