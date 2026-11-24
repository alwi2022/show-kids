-- Sample worksheet/article content for testing; preserves existing slugs.
begin;
insert into public.contents(title,slug,category,type,description,thumbnail,alt_text,media_url,meta_title,meta_description,focus_keyword,is_new,published) values
('Kenali bentuk di sekitarmu','demo-shapes','Education Learning','Worksheet','Cetak worksheet ini dan ajak anak menyebutkan lingkaran, persegi, dan segitiga. Temukan benda dengan bentuk serupa di rumah.

Siapkan pensil warna. Biarkan anak memilih warna sendiri, lalu bicarakan bentuk yang paling mudah ditemukan.','/assets/demo/shapes.svg','Kenali bentuk di sekitarmu','/assets/demo/shapes.pdf','Kenali bentuk di sekitarmu','Cetak worksheet ini dan ajak anak menyebutkan lingkaran, persegi, dan segitiga. Temukan benda dengan bentuk serupa di rumah.','shapes',true,true),
('Ayo hitung bersama','demo-counting','Education Learning','Worksheet','Hitung lingkaran pada setiap baris lalu tulis jumlahnya di kotak. Kerjakan perlahan sambil menunjuk satu benda setiap kali menghitung.

Setelah selesai, coba hitung benda lain di sekitar meja.','/assets/demo/counting.svg','Ayo hitung bersama','/assets/demo/counting.pdf','Ayo hitung bersama','Hitung lingkaran pada setiap baris lalu tulis jumlahnya di kotak. Kerjakan perlahan sambil menunjuk satu benda setiap kali menghitung.','counting',true,true),
('Apa pola berikutnya?','demo-patterns','Creative & DIY','Worksheet','Perhatikan urutan lingkaran dan persegi. Gambarkan bentuk yang melanjutkan setiap baris.

Buat pola baru dengan benda yang tersedia di rumah, lalu minta orang tua melanjutkannya.','/assets/demo/patterns.svg','Apa pola berikutnya?','/assets/demo/patterns.pdf','Apa pola berikutnya?','Perhatikan urutan lingkaran dan persegi. Gambarkan bentuk yang melanjutkan setiap baris.','patterns',true,true),
('Membaca bersama tanpa terburu-buru','demo-reading','Education Learning','Artikel','Pilih satu buku dengan gambar yang menarik perhatian anak. Duduk bersama dan mulai dari halaman yang ingin ia lihat. Tidak semua halaman harus selesai dalam satu kesempatan.

Tanyakan apa yang ia temukan pada gambar. Tunggu jawabannya dan biarkan ia bercerita dengan kata-katanya sendiri.

Saat perhatian mulai beralih, simpan buku dan lanjutkan lain waktu. Kegiatan ini adalah kesempatan menghabiskan waktu bersama.','/assets/demo/reading.svg','Membaca bersama tanpa terburu-buru','','Membaca bersama tanpa terburu-buru','Pilih satu buku dengan gambar yang menarik perhatian anak. Duduk bersama dan mulai dari halaman yang ingin ia lihat. Tidak semua halaman harus selesai dalam ','reading',true,true),
('Tiga ide bermain dengan kertas','demo-playtime','Creative & DIY','Artikel','Gunakan kertas bekas yang masih bersih untuk membuat bentuk sederhana. Lipat menjadi dua, gambar sebuah jendela, atau buat jalan untuk mainan.

Ajak anak menentukan apa yang ingin dibuat. Orang tua bisa membantu melipat atau memotong dengan alat yang sesuai.

Setelah bermain, kumpulkan potongan kertas dan simpan hasil yang ingin diceritakan lagi.','/assets/demo/playtime.svg','Tiga ide bermain dengan kertas','','Tiga ide bermain dengan kertas','Gunakan kertas bekas yang masih bersih untuk membuat bentuk sederhana. Lipat menjadi dua, gambar sebuah jendela, atau buat jalan untuk mainan.','playtime',true,true),
('Percakapan kecil setelah menonton','demo-routine','Healthy Habits','Artikel','Setelah video selesai, pilih satu hal yang menarik untuk dibicarakan. Misalnya warna yang terlihat, hewan yang muncul, atau lagu yang ingin dinyanyikan lagi.

Gunakan pertanyaan sederhana seperti bagian mana yang kamu suka. Tidak perlu menguji hafalan anak. Dengarkan cerita yang ia pilih.

Jika memungkinkan, hubungkan cerita dengan kegiatan nyata: melihat daun di halaman atau menggambar tokoh favorit.','/assets/demo/routine.svg','Percakapan kecil setelah menonton','','Percakapan kecil setelah menonton','Setelah video selesai, pilih satu hal yang menarik untuk dibicarakan. Misalnya warna yang terlihat, hewan yang muncul, atau lagu yang ingin dinyanyikan lagi.','routine',true,true)
on conflict (slug) do nothing;
commit;
