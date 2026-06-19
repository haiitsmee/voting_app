'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, Star, Sparkles } from 'lucide-react'

const faqData = [
  {
    question: "Apa itu Brawijaya Appreciate?",
    answer: "Brawijaya Appreciate adalah malam penghargaan dari Kementerian Dalam Negeri EM UB sebagai bentuk apresiasi dan harmonisasi antar simpul mahasiswa di Universitas Brawijaya."
  },
  {
    question: "Siapa yang bisa memberikan suara?",
    answer: "Seluruh mahasiswa aktif Universitas Brawijaya yang memiliki akun Google resmi universitas dapat berpartisipasi dalam sistem voting digital ini."
  },
  {
    question: "Bagaimana cara menjaga transparansi voting?",
    answer: "Kami menggunakan autentikasi OAuth untuk memastikan satu identitas hanya memiliki satu suara, dan hasil voting dihitung secara real-time yang aman."
  },
  {
    question: "Kapan pengumuman pemenang dilakukan?",
    answer: "Pengumuman pemenang akan dilaksanakan pada acara puncak malam penghargaan yang rencananya akan diadakan pada akhir tahun 2025."
  }
]

export default function FaqPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#F5CF52] text-zinc-950 font-sans overflow-hidden">
      <Navbar />

      {/* Ornamen Dekoratif */}
      <div className="absolute top-20 right-10 w-24 h-24 animate-[spin_20s_linear_infinite] opacity-40">
        <Star className="w-full h-full text-[#53399A] fill-[#53399A]" />
      </div>

      <main className="relative z-10 w-full max-w-3xl mx-auto px-6 py-16 flex-grow">
        
        {/* Header FAQ */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 mb-6 bg-[#2345E6] rounded-full shadow-[6px_6px_0px_#E7267B] animate-[bounce_3s_infinite]">
            <HelpCircle className="h-10 w-10 text-[#C8E53A]" />
          </div>
          <h1 className="text-5xl font-black text-[#E7267B] uppercase drop-shadow-[3px_3px_0px_#2345E6]">
            Pusat Bantuan
          </h1>
          <p className="mt-4 text-lg font-bold text-[#2345E6]">
            Ada yang membingungkan? Temukan jawabannya di sini!
          </p>
        </div>

        {/* Accordion FAQ */}
        <div className="bg-white p-8 rounded-[2rem] border-[3px] border-[#2345E6] shadow-[8px_8px_0px_#2345E6]">
        {/* Hapus type="single" dan collapsible, karena Base UI menangani ini secara otomatis atau melalui API yang berbeda */}
        <Accordion className="w-full space-y-4">
            {faqData.map((item, index) => (
            <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="border-2 border-[#2345E6] rounded-2xl px-6 hover:bg-[#F5CF52]/10 transition-colors"
            >
                <AccordionTrigger className="text-left font-black text-[#2345E6] hover:no-underline text-lg">
                {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-zinc-700 font-medium leading-relaxed pb-4">
                {item.answer}
                </AccordionContent>
            </AccordionItem>
            ))}
        </Accordion>
        </div>

        {/* Footer Kecil di dalam konten */}
        <div className="mt-12 text-center text-[#2345E6] font-bold opacity-60">
          <p>Masih punya pertanyaan lain?</p>
          <p>Hubungi admin kami melalui DM Instagram @em_ub</p>
        </div>
      </main>
    </div>
  )
}