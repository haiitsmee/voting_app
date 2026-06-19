import { FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';
export default function Footer() {
  return (
    <footer className="relative z-10 w-full bg-[#2345E6] text-white px-6 pt-16 pb-10 text-center flex flex-col items-center mt-auto">
      <h2 className="text-4xl md:text-5xl font-black mb-4 text-[#C8E53A]">ABOUT US</h2>
      <p className="max-w-3xl leading-relaxed text-white/90 mb-8">
        Program kerja dari Kementerian Dalam Negeri Eksekutif Mahasiswa Universitas Brawijaya untuk <span className="font-black text-[#C8E53A]">BEM, DPM, HIMA, dan UKM</span>.
      </p>

      {/* Bagian Informasi Kontak */}
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center mt-4 border-t-2 border-white/20 pt-8 w-full max-w-3xl">
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#C8E53A] transition-colors font-bold group">
          <div className="p-2 bg-white/10 rounded-full group-hover:bg-[#C8E53A]/20 transition-colors">
            <FaInstagram className="w-5 h-5" />
          </div>
          @em_ubofficial
        </a>
        
        <a href="#" className="flex items-center gap-2 hover:text-[#E7267B] transition-colors font-bold group">
          <div className="p-2 bg-white/10 rounded-full group-hover:bg-[#E7267B]/20 transition-colors">
            <FaEnvelope className="w-5 h-5" />
          </div>
          em@ub.ac.id
        </a>

        <a href="#" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#F5CF52] transition-colors font-bold group">
          <div className="p-2 bg-white/10 rounded-full group-hover:bg-[#F5CF52]/20 transition-colors">
            <FaPhone className="w-5 h-5" />
          </div>
          +62 812-3456-7890
        </a>
      </div>
      
      {/* Copyright */}
      <p className="mt-12 text-sm text-white/50 font-medium">
        &copy; {new Date().getFullYear()} Brawijaya Appreciate. All rights reserved.
      </p>
    </footer>
  )
}