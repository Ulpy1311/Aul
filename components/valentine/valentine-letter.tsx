"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Heart, ArrowDown } from "lucide-react";


type Language = "en" | "id";

const content = {
  en: {
    date: "February 14th, 2026",
    greeting: "Happy Valentine's Day,",
    name: "Aulia",
    subtitle: "Everything is still the same, from early February until now.",
    scrollHint: "Scroll to read",

    letter: `Hi, Aulia.

Honestly, this feels super awkward. It’s kinda weird sending this when we aren't even together anymore. But well... I guess I just needed to get this out of my head.

To be honest, I started building this website back in early February. I wrote, deleted, rewritten... I had no idea what to say. That’s why the Gallery page is literally empty right now. My head was just too messy back then to even deal with photos without overthinking it.

I just want to say one thing. Over here, everything is still the same.
Nothing changed, seriously. My feelings, the way I see you, it’s all still there. Your contact name, photos, videos, they’re all exactly where they were. I haven’t deleted a thing, and I’m not planning to yet.

And just in case you're wondering if I found someone new or if I'm talking to anyone else, no. There is no one else. I’m fine on my own. I’m just not interested in anyone else right now.

Funny thing, my family, even my sibling, still asks about you sometimes. Guess you really left a mark on everyone here.

I swear, sometimes I really want to just text you random stuff like I used to. But I know my place now. Things are different, and I respect that. I can’t just reach out whenever I want anymore, and I get that.

I’m just trying to be better now. And don’t worry, I won't badmouth you to anyone. Your name is safe with me. I won't spread any weird rumors. You're still a good person to me.

I’m not asking for anything back or trying to make you feel bad. I just wanted you to know that just because I’m accepting things as they are, doesn’t mean I stopped caring. The way I show it is just different now since we can’t be close.

Just one request, please remember the good version of me. For the bad parts, and I'm sorry if there were too many or even things you can't forgive, please just throw them away. I’m really trying to fix all of that and get rid of those bad traits. So maybe next time we meet, I’ll be a better version of myself.

Maybe next time, if you decide to visit this link again, or when you're really free with nothing to do, give it another look. I plan to turn this site into a sort of journal dedicated to you. I'll fill it up with even more interesting photos. I just want to show you the many changes here. Consider it me sharpening my coding skills too... that's okay, right? Hehe.

I’m not going anywhere. Just taking a break to sort myself out.

Thanks for everything. Happy Valentine’s Day.
Hope you’re happy out there.`,

    closing: "Still here",
    signature: "Always",
    footer: "Made with love"
  },
  id: {
    date: "14 Februari 2026",
    greeting: "Selamat Hari Valentine,",
    name: "Aulia",
    subtitle: "Semuanya masih sama, dari awal Februari sampai sekarang.",
    scrollHint: "Scroll untuk membaca",

    letter: `Hai, Aulia.

Sumpah, aneh banget rasanya ngetik ini. Canggung parah. Aneh aja ngasih ginian pas kondisi kita udah beda gini. Tapi ya... anggep aja ini buang uneg-uneg daripada dipendem terus.

Jujur web ini udah aku bikin dari awal Februari sebenernya. Nulis, hapus, nulis lagi... bingung mau ngomong apa. Makanya kalau kamu liat Gallery kosong, itu karena pas itu kepala lagi ruwet banget, belum sanggup milih-milih foto tanpa jadi mellow sendiri.

Intinya cuma satu, di sini, semuanya masih sama.
Nggak ada yang berubah. Perasaan, cara aku liat kamu, masih sama. Nama kontak, foto-foto, video-video, semuanya masih ada di tempatnya. Aku belum hapus apa-apa, dan emang belum niat hapus.

Kalau kamu mikir aku udah ada yang baru atau lagi deket sama siapa, please nggak usah mikir aneh-aneh. Nggak ada siapa-siapa. Aku udah biasa sendiri kok. Lagi nggak mau buka hati juga buat orang lain.

Lucunya orang rumah, termasuk adikku, masih suka nanyain kamu. Ternyata emang seberbekas itu ya.

Kadang emang gatel banget pengen chat, cerita-cerita random kayak dulu. Tapi aku tau diri. Situasinya udah beda, aku harus hargain itu. Nggak bisa asal chat lagi sesuka hati.

Sekarang aku cuma pengen jadi lebih baik aja. Dan tenang aja, aku nggak bakal ngomong aneh-aneh tentang kamu ke orang lain. Nama kamu aman. Aku nggak bakal bikin gosip aneh-aneh.

Aku nggak minta validasi atau balasan apa-apa kok. Cuma mau bilang kalau aku berdamai sama keadaan, tapi bukan berarti perasaannya ilang. Caranya aja yang beda sekarang, nggak bisa sedeket dulu.

Titip satu ya, inget versi baiknya aku aja. Yang jelek-jeleknya, maaf kalau emang banyak banget atau ada yang nggak bisa kamu maafin, buang aja ya. Aku lagi berusaha keras buat perbaikin itu semua kok, yang jelek-jelek itu lagi aku buang. Biar next time kalau ketemu lagi, aku udah jadi versi yang lebih baik.

Mungkin next time kalau kamu iseng mampir ke sini lagi, atau pas lagi bener-bener luang dan kosong banget, coba cek lagi deh. Rencananya web ini bakal aku jadiin semacam jurnal yang aku tulis buat kamu. Bakal aku isi penuh sama foto-foto yang lebih menarik lagi. Sekalian aku mau ngasih liat banyak perubahan di sini. Anggep aja sekalian aku ngasah skill coding aku juga kan... gapapa kan? Hehe.

Aku nggak ke mana-mana kok. Cuma lagi rehat bentar buat nata hati.

Makasih ya udah pernah ada. Happy Valentine's Day.
Semoga kamu happy terus.`,

    closing: "Masih di sini",
    signature: "Selalu",
    footer: "Dibuat spesial buat kamu"
  }
};

export function ValentineLetter() {
  const [lang, setLang] = useState<Language>("en");
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.08], [1, 0.98]);

  // Hide scroll hint after scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) setShowScrollHint(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const t = content[lang];
  const paragraphs = t.letter.split("\n\n");

  return (
    <div ref={containerRef} className="min-h-screen bg-background relative">
      {/* Elegant Subtle Background - No animations, just beautiful gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[60%] bg-gradient-to-bl from-rose-50/60 via-rose-25/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[50%] bg-gradient-to-tr from-pink-50/40 to-transparent" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-rose-100/20 rounded-full blur-[100px]" />
      </div>

      {/* Language Toggle - Premium Design */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="fixed top-6 right-6 z-50"
      >
        <div className="flex items-center gap-1 bg-white/80 backdrop-blur-xl border border-white/50 rounded-full p-1.5 shadow-lg shadow-rose-100/20">
          <button
            onClick={() => setLang("en")}
            className={`px-4 py-2 text-xs font-medium rounded-full transition-all duration-300 ${lang === "en"
              ? "bg-gradient-to-r from-primary to-rose-400 text-white shadow-md"
              : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100"
              }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang("id")}
            className={`px-4 py-2 text-xs font-medium rounded-full transition-all duration-300 ${lang === "id"
              ? "bg-gradient-to-r from-primary to-rose-400 text-white shadow-md"
              : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100"
              }`}
          >
            ID
          </button>
        </div>
      </motion.div>


      {/* Hero Section - Full Screen */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={lang + "-hero"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Date - Simple and Elegant */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-10"
            >
              {t.date}
            </motion.p>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-4 leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {t.greeting}
            </motion.h1>

            {/* Name - Clean text, no AI animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="mb-12"
            >
              <h1
                className="text-6xl md:text-7xl lg:text-8xl font-light text-primary"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {t.name}
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1 }}
              className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md mx-auto"
            >
              {t.subtitle}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Elegant Vertical Scroll Instruction (Left Side) - Only on Desktop */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="hidden md:flex fixed left-8 top-1/2 -translate-y-1/2 flex-row items-center gap-6 z-20"
        >
          {/* Vertical Line with Arrow */}
          <div className="flex flex-col items-center h-48">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-px bg-foreground/80 flex-1"
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              <ArrowDown className="w-4 h-4 text-foreground/80" />
            </motion.div>
          </div>

          {/* Vertical Text - Bold, Sans-serif like reference */}
          {/* Vertical Text - Bold, Italic as requested */}
          <p
            className="text-xs font-bold tracking-[0.2em] text-foreground/80 uppercase whitespace-nowrap italic"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)"
            }}
          >
            {lang === 'en' ? 'Scroll or Swipe' : 'Scroll atau Usap'}
          </p>
        </motion.div>

        {/* Scroll Indicator */}
        <AnimatePresence>
          {showScrollHint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute bottom-12"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center gap-2 text-muted-foreground"
              >
                <span className="text-xs uppercase tracking-widest">Scroll</span>
                <ArrowDown className="w-4 h-4" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Letter Section */}
      <section className="relative z-10 px-4 md:px-6 py-20 md:py-28">
        <div className="max-w-2xl mx-auto">
          {/* Letter Card */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1 }}
            className="relative"
          >
            {/* Main Letter Container - Clean and Minimal */}
            <div className="relative px-6 md:px-10 lg:px-12 py-12 md:py-16">

              {/* Letter Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={lang + "-letter"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className="text-lg md:text-xl leading-[1.9] text-foreground/80 space-y-8 text-justify hyphens-auto"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    {paragraphs.map((paragraph, index) => (
                      <motion.p
                        key={index}
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.7, delay: index * 0.03 }}
                        className={
                          index === 0
                            ? "first-letter:text-6xl first-letter:font-light first-letter:mr-3 first-letter:float-left first-letter:leading-none first-letter:text-primary first-letter:drop-shadow-sm"
                            : ""
                        }
                      >
                        {paragraph}
                      </motion.p>
                    ))}
                  </div>

                  {/* Gradient Blur/Bokeh Effect at Bottom of Screen while reading */}
                  <div className="fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none z-20" />

                  {/* Signature Section - Clean */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="pt-16 mt-16 border-t border-neutral-200/60 text-center"
                  >
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
                      {t.closing}
                    </p>
                    <p
                      className="text-2xl md:text-3xl text-foreground"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                      {t.signature}
                    </p>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="relative z-10 py-12 text-center">
        <p className="text-xs text-muted-foreground/60 tracking-wide">
          {t.footer}
        </p>
      </footer>
    </div>
  );
}
