from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "public/assets/demo"
DEST.mkdir(parents=True, exist_ok=True)
titles = {
    "shapes": ("Kenali bentuk di sekitarmu", "BENTUK & WARNA", "#e3eaff"),
    "counting": ("Ayo hitung bersama", "ANGKA & BENDA", "#fff0cf"),
    "patterns": ("Apa pola berikutnya?", "POLA & LOGIKA", "#f0e5ff"),
    "reading": ("Satu buku, banyak cerita", "WAKTU BERSAMA", "#f0e5ff"),
    "playtime": ("Bermain dari hal sederhana", "IDE BERMAIN", "#fff0cf"),
    "routine": ("Cerita kecil sehari-hari", "KEGIATAN KELUARGA", "#e3eaff"),
}
for key, (title, label, color) in titles.items():
    cover = f'''<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600" viewBox="0 0 960 600"><rect width="960" height="600" fill="{color}"/><text x="64" y="78" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="#526080">SHOW KIDS / {label}</text><rect x="540" y="126" width="310" height="356" rx="12" fill="white" transform="rotate(6 695 304)"/><circle cx="640" cy="245" r="47" fill="#5371df"/><rect x="714" y="300" width="78" height="78" rx="5" fill="#ffbe55"/><path d="M568 391l55-93 55 93z" fill="#a48bdd"/><path d="M581 435h196" stroke="#d5dced" stroke-width="9" stroke-linecap="round"/><text x="64" y="244" font-family="Arial,sans-serif" font-size="48" font-weight="700" fill="#182044">{label.split(' &amp; ')[0].replace('&', '&amp;')}</text><text x="64" y="310" font-family="Arial,sans-serif" font-size="25" fill="#526080">{'Worksheet untuk dicetak' if key in ['shapes','counting','patterns'] else 'Bacaan untuk orang tua'}</text><text x="64" y="525" font-family="Arial,sans-serif" font-size="20" fill="#526080">Belajar dan bermain bersama.</text></svg>'''
    cover = cover.replace('/ BENTUK & WARNA', '/ BENTUK &amp; WARNA').replace('/ ANGKA & BENDA', '/ ANGKA &amp; BENDA').replace('/ POLA & LOGIKA', '/ POLA &amp; LOGIKA')
    (DEST / f"{key}.svg").write_text(cover, encoding="utf-8")

for key in ["shapes", "counting", "patterns"]:
    c = canvas.Canvas(str(DEST / f"{key}.pdf"), pagesize=A4)
    w, h = A4
    c.setTitle(titles[key][0]); c.setAuthor("SHOW Kids demo")
    c.setFillColor(HexColor("#182044")); c.setFont("Helvetica-Bold", 12); c.drawString(48, h-52, "SHOW KIDS / AKTIVITAS BERSAMA")
    c.setFont("Helvetica-Bold", 24); c.drawString(48, h-100, titles[key][0])
    c.setFont("Helvetica", 11); c.drawString(48, h-132, "Nama: _____________________     Tanggal: __________________")
    c.setStrokeColor(HexColor("#526080")); c.setLineWidth(1.5)
    if key == "shapes":
        c.drawString(48, h-175, "Warnai bentuk, lalu sebutkan benda yang memiliki bentuk serupa.")
        for y in [h-280, h-440, h-600]:
            c.circle(110, y, 34); c.rect(260, y-34, 68, 68)
            path = c.beginPath(); path.moveTo(440, y+38); path.lineTo(400,y-34); path.lineTo(480,y-34); path.close(); c.drawPath(path)
        c.drawString(48, 120, "Benda bulat yang kutemukan: ______________________________")
    elif key == "counting":
        c.drawString(48, h-175, "Hitung lingkaran di setiap baris. Tulis jumlahnya di kotak kanan.")
        for row, count in enumerate([3,5,2,4,1]):
            y = h-240-row*90
            for index in range(count): c.circle(80+index*65, y, 20)
            c.rect(w-104, y-25, 50, 50)
    else:
        c.drawString(48, h-175, "Amati urutan bentuk. Gambarkan bentuk berikutnya di kotak kosong.")
        for row in range(4):
            y = h-255-row*125
            for index in range(5):
                x = 80+index*80
                if (index+row)%2: c.rect(x-22,y-22,44,44)
                else: c.circle(x,y,23)
            c.rect(w-100,y-28,56,56)
    c.setFont("Helvetica", 10); c.drawString(48, 68, "Bicarakan hasilnya bersama. Tidak perlu terburu-buru.")
    c.showPage(); c.save()

def sql(value): return "'" + str(value).replace("'", "''") + "'"
rows = []
activities = [("Kenali bentuk di sekitarmu", "shapes", "Education Learning", "Cetak worksheet ini dan ajak anak menyebutkan lingkaran, persegi, dan segitiga. Temukan benda dengan bentuk serupa di rumah.\n\nSiapkan pensil warna. Biarkan anak memilih warna sendiri, lalu bicarakan bentuk yang paling mudah ditemukan."), ("Ayo hitung bersama", "counting", "Education Learning", "Hitung lingkaran pada setiap baris lalu tulis jumlahnya di kotak. Kerjakan perlahan sambil menunjuk satu benda setiap kali menghitung.\n\nSetelah selesai, coba hitung benda lain di sekitar meja."), ("Apa pola berikutnya?", "patterns", "Creative & DIY", "Perhatikan urutan lingkaran dan persegi. Gambarkan bentuk yang melanjutkan setiap baris.\n\nBuat pola baru dengan benda yang tersedia di rumah, lalu minta orang tua melanjutkannya.")]
articles = [("Membaca bersama tanpa terburu-buru", "reading", "Education Learning", "Pilih satu buku dengan gambar yang menarik perhatian anak. Duduk bersama dan mulai dari halaman yang ingin ia lihat. Tidak semua halaman harus selesai dalam satu kesempatan.\n\nTanyakan apa yang ia temukan pada gambar. Tunggu jawabannya dan biarkan ia bercerita dengan kata-katanya sendiri.\n\nSaat perhatian mulai beralih, simpan buku dan lanjutkan lain waktu. Kegiatan ini adalah kesempatan menghabiskan waktu bersama."), ("Tiga ide bermain dengan kertas", "playtime", "Creative & DIY", "Gunakan kertas bekas yang masih bersih untuk membuat bentuk sederhana. Lipat menjadi dua, gambar sebuah jendela, atau buat jalan untuk mainan.\n\nAjak anak menentukan apa yang ingin dibuat. Orang tua bisa membantu melipat atau memotong dengan alat yang sesuai.\n\nSetelah bermain, kumpulkan potongan kertas dan simpan hasil yang ingin diceritakan lagi."), ("Percakapan kecil setelah menonton", "routine", "Healthy Habits", "Setelah video selesai, pilih satu hal yang menarik untuk dibicarakan. Misalnya warna yang terlihat, hewan yang muncul, atau lagu yang ingin dinyanyikan lagi.\n\nGunakan pertanyaan sederhana seperti bagian mana yang kamu suka. Tidak perlu menguji hafalan anak. Dengarkan cerita yang ia pilih.\n\nJika memungkinkan, hubungkan cerita dengan kegiatan nyata: melihat daun di halaman atau menggambar tokoh favorit.")]
for kind, items in [("Worksheet", activities), ("Artikel", articles)]:
    for title, key, category, description in items:
        row = [title, f"demo-{key}", category, kind, description, f"/assets/demo/{key}.svg", title, f"/assets/demo/{key}.pdf" if kind == "Worksheet" else "", title, description.split('\n')[0][:157], key]
        rows.append("(" + ",".join(sql(value) for value in row) + ",true,true)")
(ROOT / "supabase/seed-library-demo.sql").write_text("-- Sample worksheet/article content for testing; preserves existing slugs.\nbegin;\ninsert into public.contents(title,slug,category,type,description,thumbnail,alt_text,media_url,meta_title,meta_description,focus_keyword,is_new,published) values\n" + ",\n".join(rows) + "\non conflict (slug) do nothing;\ncommit;\n", encoding="utf-8")
