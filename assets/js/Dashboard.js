async function loadDashboard(){

  const response = await fetch(sheetURL);
  const data = await response.json();

  document.getElementById("statistik").innerHTML =
    "Total Jawaban Hari Ini: " + (data.length - 1);
}
function tampilkanGrafik(data){

  const ctx = document.getElementById('chart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['4A','4B','5A','5B'],
      datasets: [{
        label: 'Jumlah Jawaban',
        data: [10, 15, 8, 12]
      }]
    }
  });
}
setInterval(loadDashboard, 5000);