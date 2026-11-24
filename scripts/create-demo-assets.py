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
def demo_cover(key):
    from html import escape
    lines = {
        "shapes": ["Kenali bentuk", "di sekitarmu"],
        "counting": ["Ayo hitung", "bersama"],
        "patterns": ["Apa pola", "berikutnya?"],
        "reading": ["Membaca bersama", "tanpa terburu-buru"],
        "playtime": ["Tiga ide bermain", "dengan kertas"],
        "routine": ["Percakapan kecil", "setelah menonton"],
    }
    scenes = {
        "shapes": '<circle cx="670" cy="230" r="56" fill="#5371df"/><rect x="765" y="300" width="100" height="100" rx="10" fill="#a892e0"/><path d="M580 400l62-104 62 104z" fill="#edbb68"/><path d="M605 454h242" stroke="#dbe0ed" stroke-width="8" stroke-linecap="round"/>',
        "counting": '<text x="607" y="225" font-family="Arial" font-size="68" font-weight="700" fill="#5371df">1 2 3</text>' + ''.join(f'<circle cx="{610+i*46}" cy="{300+j*58}" r="15" fill="{["#5371df","#a892e0","#edbb68"][j]}"/>' for j in range(3) for i in range(j+1)) + '<rect x="786" y="320" width="67" height="67" rx="10" fill="#f6f7fb" stroke="#bdc7e0" stroke-width="2"/><text x="806" y="366" font-family="Arial" font-size="38" fill="#526080">?</text>',
        "patterns": '<text x="596" y="213" font-family="Arial" font-size="22" fill="#526080">LANJUTKAN POLANYA</text>' + ''.join(f'<circle cx="{610+i*54}" cy="300" r="20" fill="#5371df"/>' if i%2==0 else f'<rect x="{590+i*54}" y="280" width="40" height="40" rx="5" fill="#a892e0"/>' for i in range(4)) + '<rect x="808" y="276" width="50" height="50" rx="5" fill="#f7f8fb" stroke="#bdc7e0" stroke-width="2" stroke-dasharray="5 5"/><path d="M596 390h250m-250 48h180" stroke="#dbe0ed" stroke-width="8" stroke-linecap="round"/>',
        "reading": '<path d="M590 226q58-30 118 0v197q-60-30-118 0z" fill="#dce5ff"/><path d="M708 226q60-30 118 0v197q-58-30-118 0z" fill="#e9e0fa"/><path d="M708 226v197" stroke="#8799cb" stroke-width="3"/><circle cx="646" cy="287" r="25" fill="#edbb68"/><path d="M609 348h72m-72 25h58m74-105h59m-59 26h59m-59 26h41" stroke="#8c9ac0" stroke-width="5" stroke-linecap="round"/><path d="m796 185 7-16m17 34 16-7" stroke="#a892e0" stroke-width="5" stroke-linecap="round"/>',
        "playtime": '<rect x="591" y="202" width="161" height="213" rx="5" fill="#e9e0fa" transform="rotate(-8 671 308)"/><rect x="674" y="233" width="153" height="205" rx="5" fill="#dce5ff" transform="rotate(8 750 335)"/><path d="m642 323 156-65-47 145-35-51z" fill="#5371df"/><path d="m642 323 74 29 82-94" fill="none" stroke="#fff" stroke-width="3"/><circle cx="622" cy="448" r="14" fill="#edbb68"/><rect x="802" y="424" width="28" height="28" rx="5" fill="#a892e0"/>',
        "routine": '<rect x="595" y="192" width="233" height="153" rx="15" fill="#dce5ff"/><path d="m690 232 56 35-56 35z" fill="#5371df"/><path d="M674 345v24m-40 0h122" stroke="#8799cb" stroke-width="6" stroke-linecap="round"/><path d="M583 402q0-15 15-15h99q15 0 15 15v43q0 15-15 15h-65l-24 19v-19h-10q-15 0-15-15z" fill="#e9e0fa"/><path d="M739 416q0-13 13-13h75q13 0 13 13v34q0 13-13 13h-8v17l-23-17h-44q-13 0-13-13z" fill="#f4e6c9"/><path d="M609 414h75m-75 20h49m91-5h59" stroke="#8c9ac0" stroke-width="4" stroke-linecap="round"/>',
    }
    kind = "WORKSHEET / PDF" if key in ["shapes", "counting", "patterns"] else "TIPS FOR PARENTS"
    text = ''.join(f'<text x="64" y="{267+i*58}" font-family="Arial,sans-serif" font-size="40" font-weight="700" fill="#182044">{escape(line)}</text>' for i,line in enumerate(lines[key]))
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600" viewBox="0 0 960 600"><rect width="960" height="600" fill="#f1f3f8"/><rect x="32" y="32" width="896" height="536" rx="16" fill="#fff" stroke="#dfe2e8"/><text x="64" y="90" font-family="Arial,sans-serif" font-size="20" font-weight="700" fill="#526080">SHOW KIDS</text><rect x="64" y="159" width="250" height="36" rx="6" fill="#edf0fa"/><text x="78" y="183" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#3d52a0">{kind}</text>{text}<text x="64" y="509" font-family="Arial,sans-serif" font-size="19" fill="#526080">Belajar dan bermain bersama.</text><rect x="554" y="136" width="334" height="360" rx="18" fill="#f7f8fc"/>{scenes[key]}</svg>'

for key in titles:
    (DEST / f"{key}.svg").write_text(demo_cover(key), encoding="utf-8")

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
