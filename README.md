<p align="center">
  <img src="logo.png" alt="Hediye Defteri logosu" width="140">
</p>

<h1 align="center">Hediye Defteri</h1>

<p align="center">
  Düğün, nişan, sünnet gibi törenlerde <b>kimden ne geldi</b>, <b>kime ne götürüldü</b>'yü
  tek bir yerden takip etmeni sağlayan, tek dosyalık bir PWA.
</p>

---

## ✨ Özellikler

- 👤 **Kişi listesi** — davetli/misafirleri ekle, yakınlık/telefon/not bilgisiyle sakla.
- 🎁 **Hediye kayıtları** — kimden ne geldi (`in`), kime ne götürüldü (`out`); altın, para,
  eşya gibi farklı hediye türleri ve tutarlarıyla.
- ⚖️ **Bakiye / borç takibi** — her kişi için net "kim kime ne borçlu" hesaplanır, "Gidilecekler"
  sekmesinde tek bakışta görünür.
- 📊 **Excel içe/dışa aktarım** — kişi listesini `.xlsx/.xls/.csv` ile içe aktar, tüm veriyi
  Excel'e aktar.
- 💾 **Yedekleme** — tüm veriyi JSON olarak yedekle/geri yükle.
- 🔐 **Google ile giriş + bulut senkronu** — Supabase üzerinden Google OAuth ile giriş yapıp
  verilerini farklı cihazlar arasında offline-first senkronize et.
- 📱 **PWA** — telefona/ana ekrana eklenebilir, service worker ile büyük ölçüde offline çalışır.

## 🚀 Kullanım

`index.html` dosyasını doğrudan bir tarayıcıda açman yeterli — kurulum ya da build adımı yok.
Buluta senkron için Google hesabınla giriş yapman gerekir; giriş yapmadan da uygulama
cihazında (localStorage) çalışmaya devam eder.

## 🛠️ Teknoloji

- Sunucu tarafı kod yok — saf HTML/CSS/vanilla JavaScript, tek dosyada.
- Excel import/export için gömülü [SheetJS](https://sheetjs.com/).
- Kimlik doğrulama ve bulut senkronu için [Supabase](https://supabase.com/) (Auth + Postgres,
  Google OAuth ile).
- Offline destek için PWA service worker.

## 🔒 Gizlilik

Veriler öncelikli olarak kendi cihazında (`localStorage`) tutulur. Google ile giriş yapan
kullanıcıların verileri, Supabase üzerinde satır seviyesinde erişim kontrolü (RLS) ile
sadece kendi hesaplarına özel olarak saklanır.
