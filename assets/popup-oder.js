/* ===== Popup Order JS (universal untuk semua halaman) ===== */
(function () {
    // Cari elemen
    const orderModal = document.getElementById("orderModal");
    const orderForm = document.getElementById("orderForm");
  
    // Kalau halaman belum include popup-order.html, hentikan tanpa error
    if (!orderModal || !orderForm) return;
  
    // Tombol navbar (wajib id ini biar universal)
    const openOrder = document.getElementById("openOrder");
    const openOrderMobile = document.getElementById("openOrderMobile");
  
    // Mobile menu (opsional)
    const menu = document.getElementById("mobileMenu");
    const btnMenu = document.getElementById("menuBtn");
  
    // QR cards
    const qrisBCA = document.getElementById("qrisBCA");
    const qrisMandiri = document.getElementById("qrisMandiri");
  
    // Nota element
    const np = document.getElementById("notaProduk");
    const nq = document.getElementById("notaQty");
    const nh = document.getElementById("notaHarga");
    const nt = document.getElementById("notaTotal");
  
    // ====== Konfigurasi (ubah sesuai toko kamu) ======
    const nomorToko = "6281234567890"; // format internasional tanpa +
  
    // Harga produk (default)
    const hargaProduk = {
      "Suwar-suwir Khas": 28000,
      "Kopi Jember": 55000,
      "Gift Box Mix": 99000
    };
  
    function rupiah(n) {
      return "Rp " + (n || 0).toLocaleString("id-ID");
    }
  
    function showModal() {
      orderModal.removeAttribute("hidden");
      orderModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      setTimeout(updateNota, 0);
    }
  
    function hideModal() {
      orderModal.setAttribute("hidden", "");
      orderModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  
    // expose global untuk tombol-tombol yang pakai onclick fallback
    window.__openOrderModal = showModal;
  
    // ====== OPEN buttons ======
    openOrder?.addEventListener("click", showModal);
  
    openOrderMobile?.addEventListener("click", () => {
      menu?.setAttribute("hidden", "");
      btnMenu?.setAttribute("aria-expanded", "false");
      showModal();
    });
  
    // Bonus: semua tombol yang punya atribut ini akan otomatis buka popup
    // contoh: <button data-open-order data-order-produk="Kopi Jember">Pesan Kopi</button>
    document.querySelectorAll("[data-open-order]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const p = btn.getAttribute("data-order-produk");
        const q = btn.getAttribute("data-order-qty");
  
        if (p && orderForm.produk) orderForm.produk.value = p;
        if (q && orderForm.qty) orderForm.qty.value = String(q);
  
        showModal();
        updateNota();
      });
    });
  
    // ====== Close handlers ======
    orderModal.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.hasAttribute("data-close")) hideModal();
    });
  
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !orderModal.hasAttribute("hidden")) hideModal();
    });
  
    // ====== QR toggle ======
    orderForm.addEventListener("change", (e) => {
      const el = e.target;
      if (el && el.name === "metode") {
        if (el.value === "QRIS BCA") {
          if (qrisBCA) qrisBCA.hidden = false;
          if (qrisMandiri) qrisMandiri.hidden = true;
        } else {
          if (qrisBCA) qrisBCA.hidden = true;
          if (qrisMandiri) qrisMandiri.hidden = false;
        }
      }
    });
  
    // ====== Nota auto update ======
    function updateNota() {
      const produk = orderForm.produk?.value || "";
      const qty = parseInt(orderForm.qty?.value || "1", 10);
  
      const harga = hargaProduk[produk] || 0;
      const total = harga * (isNaN(qty) ? 1 : qty);
  
      if (np) np.textContent = produk || "—";
      if (nq) nq.textContent = isNaN(qty) ? "1" : String(qty);
      if (nh) nh.textContent = rupiah(harga);
      if (nt) nt.textContent = rupiah(total);
    }
  
    orderForm.addEventListener("input", (e) => {
      if (e?.target?.name && ["produk", "qty"].includes(e.target.name)) updateNota();
    });
  
    orderForm.addEventListener("change", (e) => {
      if (e?.target?.name && ["produk", "qty"].includes(e.target.name)) updateNota();
    });
  
    // init
    updateNota();
  
    // ====== Submit -> WhatsApp ======
    orderForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const nama = (orderForm.nama?.value || "").trim();
      const wa = (orderForm.wa?.value || "").trim();
      const alamat = (orderForm.alamat?.value || "").trim();
      const produk = orderForm.produk?.value || "";
      const qty = parseInt(orderForm.qty?.value || "1", 10);
      const catatan = (orderForm.catatan?.value || "").trim();
      const metode = orderForm.metode?.value || "QRIS BCA";
  
      const harga = hargaProduk[produk] || 0;
      const total = harga * (isNaN(qty) ? 1 : qty);
  
      const pesan =
  `Halo, saya mau pesan:
  - Nama: ${nama}
  - WA: ${wa}
  - Produk: ${produk}
  - Jumlah: ${isNaN(qty) ? 1 : qty}
  - Alamat: ${alamat}
  - Metode Bayar: ${metode}
  - Total Sementara: ${rupiah(total)}
  - Catatan: ${catatan || '-'}
  
  Saya akan bayar via QRIS.`;
  
      const url = `https://wa.me/${nomorToko}?text=${encodeURIComponent(pesan)}`;
      window.open(url, "_blank", "noopener");
  
      hideModal();
      orderForm.reset();
  
      // reset default
      if (qrisBCA) qrisBCA.hidden = false;
      if (qrisMandiri) qrisMandiri.hidden = true;
  
      updateNota();
    });
  })();
  