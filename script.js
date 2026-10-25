const form = document.getElementById("nutritionForm");
const result = document.getElementById("result");
const chartCanvas = document.getElementById("energyChart");

let energyChart = null;

form.addEventListener("submit", function (event) {
  event.preventDefault();

  // 1. Ambil data dari formulir
  const age = Number(document.getElementById("age").value);
  const sex = document.getElementById("sex").value;
  const weight = Number(document.getElementById("weight").value);
  const height = Number(document.getElementById("height").value);
  const activity = Number(
    document.getElementById("activity").value
  );

  // 2. Periksa kelengkapan dan validitas data
  if (
    !Number.isFinite(age) ||
    !Number.isFinite(weight) ||
    !Number.isFinite(height) ||
    !Number.isFinite(activity) ||
    age <= 0 ||
    weight <= 0 ||
    height <= 0
  ) {
    result.textContent =
      "Masukkan data angka yang valid.";
    return;
  }

  // 3. Batasi kalkulator personal untuk orang dewasa
  if (age < 18) {
    result.textContent =
      "Kalkulator ini hanya untuk edukasi orang dewasa " +
      "usia 18 tahun ke atas. Kebutuhan nutrisi atlet " +
      "di bawah 18 tahun perlu dinilai secara individual " +
      "dengan pendampingan orang tua atau tenaga gizi.";
    if (energyChart) {
      energyChart.destroy();
      energyChart = null;
    }
    return;
  }

  // 4. Hitung estimasi energi saat istirahat
  let restingEnergy;

  if (sex === "male") {
    restingEnergy =
      10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    restingEnergy =
      10 * weight + 6.25 * height - 5 * age - 161;
  }

  // 5. Estimasi energi harian berdasarkan aktivitas
  const dailyEnergy = restingEnergy * activity;

  // 6. Tampilkan hasil
  result.textContent =
    "Estimasi energi saat istirahat: " +
    Math.round(restingEnergy) +
    " kkal/hari. Estimasi pengeluaran energi harian: " +
    Math.round(dailyEnergy) +
    " kkal/hari. Hasil ini bukan target makan atau " +
    "rekomendasi diet individual.";

  // 7. Hapus grafik sebelumnya jika ada
  if (energyChart) {
    energyChart.destroy();
  }

  // 8. Buat grafik menggunakan Chart.js
  energyChart = new Chart(chartCanvas, {
    type: "bar",
    data: {
      labels: [
        "Energi saat istirahat",
        "Estimasi energi harian"
      ],
      datasets: [{
        label: "Estimasi energi (kkal/hari)",
        data: [
          Math.round(restingEnergy),
          Math.round(dailyEnergy)
        ],
        backgroundColor: [
          "#80b99a",
          "#238454"
        ],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "kkal per hari"
          }
        }
      }
    }
  });
});