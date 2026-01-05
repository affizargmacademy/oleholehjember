// ===== MAIN JS (universal) =====

// YEAR
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Mobile menu toggle =====
const btnMenu = document.getElementById('menuBtn');
const menu = document.getElementById('mobileMenu');

btnMenu?.addEventListener('click', () => {
  const isOpen = !menu?.hasAttribute('hidden');
  if (isOpen) {
    menu?.setAttribute('hidden', '');
    btnMenu?.setAttribute('aria-expanded', 'false');
  } else {
    menu?.removeAttribute('hidden');
    btnMenu?.setAttribute('aria-expanded', 'true');
  }
});

// ===== Modal logic =====
const orderModal = document.getElementById('orderModal');
const orderForm = document.getElementById('orderForm');

function showModal() {
  if (!orderModal) return;
  orderModal.removeAttribute('hidden');
  orderModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(updateNota, 0);
}

function hideModal() {
  if (!orderModal) return;
  orderModal.setAttribute('hidden', '');
  orderModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// tombol open
document.getElementById('openOrder')?.addEventListener('click', showModal);
document.getElementById('openOrderMobile')?.addEventListener('click', () => {
  // tutup menu mobile jika ada
  menu?.setAttribute('hidden', '');
  btnMenu?.setAttribute('aria-expanded', 'false');
  showModal();
});

// tombol CTA di halaman detail
document.getElementById('buyNowTop')?.addEventListener('click', showModal);
document.getElementById('buyNowMid')?.addEventListener('click', showModal);
document.getElementById('buyNowBottom')?.addEventListener('click', showModal);

// close on backdrop / close btn
orderModal?.addEventListener('click', (e) => {
  const t = e.target;
  if (t && t.hasAttribute('data-close')) hideModal();
});

// close on ESC
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && orderModal && !orderModal.hasAttribute('hidden')) hideModal();
});

// ===== Toggle QR cards =====
const qrisBCA = document.getElementById('qrisBCA');
const qrisMandiri = document.getElementById('qrisMandiri');

orderForm?.addEventListener('change', (e) => {
  const el = e.target;
  if (el && el.name === 'metode') {
    if (el.value === 'QRIS BCA') {
      if (qrisBCA) qrisBCA.hidden = false;
      if (qrisMandiri) qrisMandiri.hidden = true;
    } else {
      if (qrisBCA) qrisBCA.hidden = true;
      if (qrisMandiri) qrisMandiri.hidden = false;
    }
  }
});

// ===== Harga varian + Nota =====
const hargaVarian = {
  "Original": 28000,
  "Stroberi": 30000,
  "Nanas": 30000,
  "Cokelat": 32000,
  "Mix 4 Rasa": 35000
};

function rupiah(n) {
  return "Rp " + (n || 0).toLocaleString("id-ID");
}

function updateNota() {
  if (!orderForm) return;

  const varian = orderForm.produk?.value || "Original";
  const qtyRaw = orderForm.qty?.value || "1";
  const qty = parseInt(qtyRaw, 10);

  const harga = hargaVarian[varian] || 0;
  const total = harga * (isNaN(qty) ? 1 : qty);

  const np = document.getElementById("notaProduk");
  const nq = document.getElementById("notaQty");
  const nh = document.getElementById("notaHarga");
  const nt = document.getElementById("notaTotal");

  if (np) np.textContent = varian;
  if (nq) nq.textContent = isNaN(qty) ? "1" : String(qty);
  if (nh) nh.textContent = rupiah(harga);
  if (nt) nt.textContent = rupiah(total);
}

// init nota
updateNota();

orderForm?.addEventListener("input", (e) => {
  if (e?.target?.name && ["produk", "qty"].includes(e.target.name)) updateNota();
});
orderForm?.addEventListener("change", (e) => {
  if (e?.target?.name && ["produk", "qty"].includes(e.target.name)) updateNota();
});

// ===== Submit -> WhatsApp =====
orderForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!orderForm) return;

  const nama = (orderForm.nama?.value || "").trim();
  const wa = (orderForm.wa?.value || "").trim();
  const alamat = (orderForm.alamat?.value || "").trim();
  const varian = orderForm.produk?.value || "Original";
  const qty = parseInt(orderForm.qty?.value || "1", 10);
  const catatan = (orderForm.catatan?.value || "").trim();
  const metode = orderForm.metode?.value || "QRIS BCA";

  const harga = hargaVarian[varian] || 0;
  const total = harga * (isNaN(qty) ? 1 : qty);

  const pesan =
`Halo, saya mau pesan Suwar-Suwir:
- Nama: ${nama}
- WA: ${wa}
- Varian: ${varian}
- Jumlah: ${isNaN(qty) ? 1 : qty}
- Alamat: ${alamat}
- Metode Bayar: ${metode}
- Total Sementara: ${rupiah(total)}
- Catatan: ${catatan || '-'}

Saya akan bayar via QRIS.`;

  // GANTI nomor WA toko kamu di sini (format internasional tanpa +)
  const nomorToko = "6281234567890";
  const url = `https://wa.me/${nomorToko}?text=${encodeURIComponent(pesan)}`;

  window.open(url, "_blank", "noopener");

  hideModal();
  orderForm.reset();

  // reset default nilai form
  if (orderForm.produk) orderForm.produk.value = "Original";
  if (orderForm.qty) orderForm.qty.value = "1";

  // reset QR
  if (qrisBCA) qrisBCA.hidden = false;
  if (qrisMandiri) qrisMandiri.hidden = true;

  updateNota();
});
