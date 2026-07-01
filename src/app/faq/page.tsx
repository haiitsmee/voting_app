"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { HelpCircle, ChevronDown } from "lucide-react";

const faqData = [
  {
    question: "Apa itu CROWN?",
    answer:
      "CROWN merupakan malam apresiasi civitas akademika FIA UB yang melibatkan dosen, mahasiswa serta LKM&LOF melalui nominasi spesifik. Ini adalah penghargaan tertinggi dalam ekosistem kemahasiswaan FIA serta ruang selebrasi yang memperkuat relasi.",
  },
  {
    question: "Siapa yang bisa memberikan suara?",
    answer:
      "Seluruh mahasiswa aktif Fakultas Ilmu Administrasi Universitas Brawijaya.",
  },
  {
    question: "Bagaimana cara melakukan voting?",
    answer:
      "Klik “Voting Sekarang” -> Login menggunakan akun Google -> Masukkan & Verifikasi NIM -> Pilih kategori nominasi -> Pilih nomine jagoanmu.",
  },
  {
    question: "Bagaimana cara menjaga transparansi?",
    answer:
      "Kami menggunakan autentikasi OAuth dan verifikasi NIM untuk memastikan ketentuan one account, one vote, dan hasil voting dihitung secara real-time yang aman.",
  },
  {
    question: "Kapan periode voting dibuka?",
    answer: "1 Oktober - 31 Oktober 2026.",
  },
  {
    question: "Kapan pengumuman pemenang dilakukan?",
    answer:
      "Pengumuman pemenang akan dilaksanakan pada acara puncak malam penghargaan pada akhir tahun 2026.",
  },
  {
    question: "Saya tidak bisa login, apa yang harus dilakukan?",
    answer:
      "Pastikan data yang dimasukkan benar. Jika masih terkendala, hubungi panitia melalui IG: @crown.fiaub atau WA: +62 821-7522-7106.",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-crown-espresso text-crown-cream font-sans overflow-hidden">
      <Navbar />

      {/* Ornamen Bintang Berputar */}
      <div className="absolute top-20 left-10 z-0 w-24 h-24 md:w-32 md:h-32 animate-[spin_30s_linear_infinite] opacity-20 pointer-events-none">
        <svg viewBox="0 0 100 100" className="fill-crown-gold">
          <path d="M50 0 L55.8 44.2 L100 50 L55.8 55.8 L50 100 L44.2 55.8 L0 50 L44.2 44.2 Z" />
        </svg>
      </div>

      <div className="absolute bottom-20 right-10 z-0 w-28 h-28 md:w-40 md:h-40 animate-[spin_25s_linear_infinite] opacity-20 pointer-events-none">
        <svg viewBox="0 0 100 100" className="fill-crown-gold">
          <path d="M50 0 L55.8 44.2 L100 50 L55.8 55.8 L50 100 L44.2 55.8 L0 50 L44.2 44.2 Z" />
        </svg>
      </div>

      <div className="absolute bottom-40 left-6 z-0 w-16 h-16 md:w-20 md:h-20 animate-[spin_40s_linear_infinite] opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" className="fill-crown-bronze">
          <path d="M50 0 L55.8 44.2 L100 50 L55.8 55.8 L50 100 L44.2 55.8 L0 50 L44.2 44.2 Z" />
        </svg>
      </div>

      <main className="relative z-10 w-full max-w-3xl mx-auto px-6 py-16 flex-grow">
        {/* Header FAQ */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 mb-6 bg-crown-gold/10 rounded-full border border-crown-gold/30 shadow-[0_4px_20px_rgba(240,148,16,0.15)]">
            <HelpCircle className="h-10 w-10 text-crown-gold" />
          </div>
          <h1 className="text-5xl font-black text-crown-gold uppercase drop-shadow-[0_2px_4px_rgba(240,148,16,0.3)]">
            Pusat Bantuan
          </h1>
          <p className="mt-4 text-lg font-medium text-crown-cream-dark">
            Temukan jawaban atas pertanyaan yang sering diajukan.
          </p>
        </div>

        {/* Accordion FAQ */}
        <div className="bg-crown-cream/5 backdrop-blur-md p-6 rounded-3xl border border-crown-gold/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] space-y-3">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-crown-gold/40 bg-crown-cream/10"
                    : "border-crown-gold/10 hover:border-crown-gold/30"
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left px-6 py-4 flex justify-between items-center gap-4 focus:outline-none group"
                >
                  <span
                    className={`font-bold text-lg ${isOpen ? "text-crown-gold" : "text-crown-cream"} transition-colors`}
                  >
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-crown-gold transition-transform duration-500 flex-shrink-0 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    isOpen
                      ? "max-h-96 opacity-100 px-6 pb-5"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-crown-cream-dark leading-relaxed text-base border-t border-crown-gold/10 pt-4">
                    {/* Render jawaban dengan link aktif untuk kontak */}
                    {item.answer.includes("@crown.fiaub") ? (
                      <>
                        Pastikan data yang dimasukkan benar. Jika masih
                        terkendala, hubungi panitia melalui{" "}
                        <a
                          href="https://instagram.com/crown.fiaub"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-crown-gold hover:underline font-medium transition-colors"
                        >
                          IG: @crown.fiaub
                        </a>{" "}
                        atau{" "}
                        <a
                          href="https://wa.me/6282175227106"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-crown-gold hover:underline font-medium transition-colors"
                        >
                          WA: +62 821-7522-7106
                        </a>
                        .
                      </>
                    ) : (
                      item.answer
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer kontak – juga dibuat clickable */}
        <div className="mt-12 text-center text-crown-cream-dark/70 font-medium">
          <p>Masih punya pertanyaan lain?</p>
          <p className="mt-1">
            Hubungi panitia melalui{" "}
            <a
              href="https://instagram.com/crown.fiaub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-crown-gold hover:underline transition-colors font-medium"
            >
              IG: @crown.fiaub
            </a>{" "}
            atau{" "}
            <a
              href="https://wa.me/6282175227106"
              target="_blank"
              rel="noopener noreferrer"
              className="text-crown-gold hover:underline transition-colors font-medium"
            >
              WA: +62 821-7522-7106
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
