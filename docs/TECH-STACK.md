# Tech Stack – Aplikasi Voting Nominasi

## Core Backend & Database
| Layer | Pilihan | Versi |
|---|---|---|
| Backend Framework | Next.js (App Router) | 14.x |
| Runtime | Node.js | 20.x+ |
| Database | Supabase (PostgreSQL) | 15.x+ |
| Auth | Supabase Auth (Google OAuth) | – |
| Row Level Security | Supabase RLS | – |

## Core Frontend
| Layer | Pilihan | Alasan |
|---|---|---|
| UI Library | React | 18.x |
| Language | TypeScript | Type safety untuk props & data |
| Styling | Tailwind CSS | 3.x (kompatibel dengan shadcn/ui) |
| UI Components | shadcn/ui | Komponen accessible, mudah dikustomisasi |
| Icons | lucide-react | Icons modern untuk React |

## Integrasi & Deployment
| Layer | Pilihan |
|---|---|
| Deployment | Vercel |
| Environment Variables | Vercel Env / .env.local |
| Version Control | Git (GitHub) |
| CI/CD | Auto deploy dari Vercel |

## Library Tambahan (jika diperlukan nanti)
| Library | Keperluan |
|---|---|
| recharts | Statistik voting (grafik di admin) |
| @supabase/ssr | Server-side rendering dengan Supabase (opsional) |
| react-hook-form | Form tambah/edit nominee (opsional) |
| zod | Validasi input (opsional) |

## Yang TIDAK dipakai (dan alasannya)
| Tidak pakai | Alasan |
|---|---|
| NextAuth / Auth.js | Digantikan dengan Supabase Auth yang lebih sederhana |
| Prisma ORM | Menggunakan Supabase client + RLS |
| Custom API Routes | Supabase Realtime + RLS mencakup kebutuhan |
| Redis / Elasticsearch | Tidak diperlukan untuk skala awal |
| Payment Gateway | Di luar scope PRD |

## Environment
- **Development**: `npm run dev` (localhost:3000)
- **Production**: Vercel (auto deploy dari branch main)
- **Database**: Supabase project `voting-app` (region ap-southeast-1)
- **Storage**: Supabase Storage (untuk foto nominee, belum diimplementasikan)