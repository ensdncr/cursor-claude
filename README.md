# Aktüel Takip

BİM, A101 ve ŞOK marketlerinin aktüel ürünlerini takip eden tam kapsamlı web uygulaması.

## Özellikler

- **Genel Site**: Aktüel ürünleri market + kategori + arama ile filtreleyin
- **Gün Sayacı**: Kaç gün kaldığını renkli badge ile görün (kırmızı/sarı/yeşil)
- **Admin Paneli**: Şifre korumalı yönetim paneli (`/admin`)
- **AI Entegrasyonu**: Claude API ile PDF/görsel kataloglardan otomatik ürün çıkarma
- **PWA**: Mobil cihazlara ana ekrana eklenebilir

## Kurulum

```bash
npm install
cp .env.example .env.local
# .env.local dosyasını düzenleyin
npm run dev
```

## Çevre Değişkenleri

| Değişken | Açıklama |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL'i |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `ANTHROPIC_API_KEY` | Claude API anahtarı |
| `ADMIN_PASSWORD` | Admin paneli şifresi |

## Supabase Kurulumu

1. Supabase dashboard > SQL Editor'da `lib/database.sql` içeriğini çalıştırın
2. Storage'da `catalogs` adında **public** bucket oluşturun

## Sayfa Yapısı

- `/` — Genel site, aktüel ürün listesi
- `/admin` — Şifre korumalı admin paneli (siteye link verilmez)

## Teknoloji

- Next.js 14 (App Router) · TypeScript · Tailwind CSS
- Supabase (PostgreSQL + Storage) · Anthropic Claude API · PWA
