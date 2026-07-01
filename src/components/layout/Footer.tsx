// src/components/layout/Footer.tsx
import { Mail, Phone } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="relative z-10 w-full bg-crown-espresso border-t border-crown-gold/10 px-6 pt-12 pb-8 text-center flex flex-col items-center mt-auto">
      <h2 className="text-3xl md:text-4xl font-black tracking-widest text-crown-gold mb-3">
        CROWN 2026
      </h2>
      <p className="max-w-2xl text-crown-cream-dark text-sm md:text-base leading-relaxed mb-6">
        Penghargaan tertinggi dalam ekosistem kemahasiswaan Fakultas Ilmu Administrasi Universitas Brawijaya.
      </p>

      {/* Bagian Kontak */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center mt-2 border-t border-crown-gold/10 pt-6 w-full max-w-3xl">
        <a
          href="https://instagram.com/crown.fiaub"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-crown-cream-dark hover:text-crown-gold transition-colors duration-300 font-medium group"
        >
          <div className="p-2 rounded-full bg-crown-cream/5 group-hover:bg-crown-gold/10 transition-colors duration-300">
            <FaInstagram className="w-5 h-5" />
          </div>
          @crown.fiaub
        </a>

        <a
          href="mailto:crownfiaub@gmail.com"
          className="flex items-center gap-2 text-crown-cream-dark hover:text-crown-gold transition-colors duration-300 font-medium group"
        >
          <div className="p-2 rounded-full bg-crown-cream/5 group-hover:bg-crown-gold/10 transition-colors duration-300">
            <Mail className="w-5 h-5" />
          </div>
          crownfiaub@gmail.com
        </a>

        <a
          href="https://wa.me/6282175227106"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-crown-cream-dark hover:text-crown-gold transition-colors duration-300 font-medium group"
        >
          <div className="p-2 rounded-full bg-crown-cream/5 group-hover:bg-crown-gold/10 transition-colors duration-300">
            <Phone className="w-5 h-5" />
          </div>
          +62 821-7522-7106
        </a>
      </div>

      {/* Copyright */}
      <p className="mt-8 text-xs text-crown-cream-dark/50 font-medium">
        &copy; {new Date().getFullYear()} CROWN FIA UB. All rights reserved.
      </p>
    </footer>
  );
}