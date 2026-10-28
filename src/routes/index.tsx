import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import f1 from "@/assets/foto-1.jpeg.asset.json";
import f2 from "@/assets/foto-2.jpeg.asset.json";
import f3 from "@/assets/foto-3.jpeg.asset.json";
import f4 from "@/assets/foto-4.jpeg.asset.json";
import f5 from "@/assets/foto-5.jpeg.asset.json";
import musicAsset from "@/assets/musica-fondo.mp3.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alan & Mily · Nos casamos · 13.03.2027" },
      { name: "description", content: "Alan y Milagros se casan el 13 de marzo de 2027 en Villa Adelina. ¡Te esperamos!" },
      { property: "og:title", content: "Alan & Mily · ¡Nos casamos!" },
      { property: "og:description", content: "13 de marzo de 2027 · Villa Adelina, Buenos Aires" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const WEDDING = new Date("2027-03-13T00:00:00-03:00").getTime();
const ADDRESS = "Manuela Pedraza 3839, Villa Adelina, Provincia de Buenos Aires";
const RSVP =
  "https://docs.google.com/forms/d/e/1FAIpQLSddXc1Fx3M1_J47VH-IlLmUDKAEGTtLHxFEn6ZviqmyT53hgg/viewform?usp=publish-editor";
const PHOTOS = [f1, f2, f3, f4, f5].map((f) => f.url);

function Splash({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 3200);
    const t2 = setTimeout(onDone, 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);
  return (
    <div
      onClick={() => { setLeaving(true); setTimeout(onDone, 900); }}
      className={`fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center bg-foreground text-ivory transition-opacity duration-1000 ${leaving ? "opacity-0" : "opacity-100"}`}
    >
      <p className="animate-rise font-sans text-xs tracking-[0.5em] text-gold uppercase">Alan &amp; Mily</p>
      <h1 className="animate-rise mt-6 px-6 text-center font-serif text-6xl font-light tracking-[0.12em] md:text-8xl" style={{ animationDelay: ".4s" }}>
        ¡NOS CASAMOS!
      </h1>
      <div className="animate-rise gold-rule mt-8 w-48" style={{ animationDelay: ".9s" }} />
      <p className="animate-rise mt-6 font-serif text-xl italic text-rose-light" style={{ animationDelay: "1.3s" }}>13 · 03 · 2027</p>
    </div>
  );
}

function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i); }, []);
  const d = Math.max(0, WEDDING - (now ?? WEDDING));
  const parts = [["Días", Math.floor(d / 864e5)], ["Horas", Math.floor(d / 36e5) % 24], ["Min", Math.floor(d / 6e4) % 60], ["Seg", Math.floor(d / 1e3) % 60]] as const;
  return (
    <div className="mt-10 flex justify-center gap-6 md:gap-12">
      {parts.map(([l, v]) => (
        <div key={l} className="text-center">
          <div className="font-serif text-4xl font-light md:text-5xl">{now === null ? "–" : String(v).padStart(2, "0")}</div>
          <div className="mt-1 text-[10px] tracking-[0.3em] text-ivory/60 uppercase">{l}</div>
        </div>
      ))}
    </div>
  );
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-14 text-center">
      <p className="text-xs tracking-[0.45em] text-gold-deep uppercase">{kicker}</p>
      <h2 className="mt-3 font-serif text-5xl font-light md:text-6xl">{title}</h2>
      <div className="gold-rule mx-auto mt-6 w-32" />
    </div>
  );
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [ok, setOk] = useState(false);
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-5">
      <div className="min-w-0">
        <p className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">{label}</p>
        <p className="mt-1 break-all font-serif text-xl md:text-2xl">{value}</p>
      </div>
      <button
        onClick={() => { navigator.clipboard.writeText(value); setOk(true); setTimeout(() => setOk(false), 1800); }}
        className="shrink-0 border border-gold-deep text-gold-deep px-4 py-2 text-[10px] tracking-[0.3em] uppercase transition-colors hover:bg-gold hover:border-gold hover:text-foreground"
      >
        {ok ? "Copiado" : "Copiar"}
      </button>
    </div>
  );
}

function RsvpButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={RSVP}
      target="_blank"
      rel="noreferrer"
      className={`inline-block border border-gold bg-gold px-9 py-4 text-[11px] tracking-[0.35em] text-foreground uppercase transition-colors hover:bg-rose hover:border-rose hover:text-ivory ${className}`}
    >
      Confirmar asistencia
    </a>
  );
}

function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const start = () => {
    audioRef.current?.play().then(() => setPlaying(true)).catch(() => {});
  };

  useEffect(() => {
    start();
    const onFirstGesture = (e: Event) => {
      // If the first gesture is on the music button itself, the button's own
      // toggle handles play/pause; starting here would immediately pause it.
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-music-toggle]")) return;
      start();
    };
    window.addEventListener("pointerdown", onFirstGesture, { once: true });
    window.addEventListener("keydown", onFirstGesture, { once: true });
    window.addEventListener("touchstart", onFirstGesture, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
      window.removeEventListener("touchstart", onFirstGesture);
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) { start(); } else { a.pause(); setPlaying(false); }
  };

  return (
    <>
      <audio ref={audioRef} src={musicAsset.url} loop preload="auto" />
      <button
        onClick={toggle}
        data-music-toggle
        aria-label={playing ? "Pausar la música" : "Reproducir la música"}
        className="fixed right-5 bottom-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-gold/70 bg-foreground/70 text-gold shadow-lg backdrop-blur transition-colors hover:bg-gold hover:text-foreground"
      >
        {playing ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-[16px] w-[16px]">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[16px] w-[16px]">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        )}
      </button>
    </>
  );
}

function Index() {
  const [showSplash, setShowSplash] = useState(true);
  const links = [["Fotos", "#fotos"], ["Cuándo y dónde", "#lugar"], ["Vestimenta", "#vestimenta"], ["Regalo", "#regalo"]];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showSplash && <Splash onDone={() => setShowSplash(false)} />}

      <MusicToggle />

      {/* Portada */}
      <header className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        <img src={PHOTOS[0]} alt="Alan y Mily" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-foreground/60" />
        <nav className="absolute top-0 right-0 left-0 hidden justify-center gap-10 py-6 text-[11px] tracking-[0.35em] text-ivory/80 uppercase md:flex">
          {links.map(([l, h]) => <a key={h} href={h} className="hover:text-gold">{l}</a>)}
          <a href={RSVP} target="_blank" rel="noreferrer" className="border border-gold px-4 py-1 text-gold hover:bg-gold hover:text-foreground">Confirmar asistencia</a>
        </nav>
        <div className="relative text-ivory">
          <p className="text-xs tracking-[0.5em] text-gold uppercase">Nos casamos</p>
          <h1 className="mt-6 font-script text-7xl md:text-9xl">Alan <span className="text-gold">&</span> Mily</h1>
          <p className="mt-4 font-serif text-lg italic text-ivory/80">Alan & Milagros</p>
          <div className="gold-rule mx-auto mt-8 w-40" />
          <p className="mt-6 font-serif text-2xl tracking-[0.3em]">13 · 03 · 2027</p>
          <RsvpButton className="mt-12" />
        </div>
      </header>

      {/* Fotos */}
      <section id="fotos" className="mx-auto max-w-6xl px-6 py-28">
        <SectionTitle kicker="Nuestra historia" title="Momentos" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {PHOTOS.map((src, i) => (
            <div key={src} className={`overflow-hidden ${i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-[3/4]"}`}>
              <img src={src} alt={`Alan y Mily ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.5s] hover:scale-105" />
            </div>
          ))}
        </div>
      </section>

      {/* Versículo */}
      <section id="versiculo" className="border-t border-border px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="gold-rule mx-auto w-16" />
          <p className="mt-10 font-serif text-2xl italic leading-relaxed md:text-3xl">
            «Mejor son dos que uno, porque obtienen más fruto de su esfuerzo. Si caen, el uno
            levanta al otro. ¡Ay del que cae y no tiene quien lo levante!»
          </p>
          <p className="mt-8 text-[11px] tracking-[0.35em] text-gold-deep uppercase">
            Eclesiastés 4:9-10 · NVI
          </p>
        </div>
      </section>

      {/* Fecha y lugar */}
      <section id="lugar" className="bg-foreground px-6 py-28 text-ivory">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs tracking-[0.45em] text-rose-light uppercase">Cuándo y dónde</p>
          <h2 className="mt-3 font-serif text-5xl font-light md:text-6xl">Sábado 13 de marzo, 2027</h2>
          <div className="gold-rule mx-auto mt-6 w-32" />
          <Countdown />
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            <div>
              <p className="text-[10px] tracking-[0.35em] text-ivory/60 uppercase">Invitados citados</p>
              <p className="mt-1 font-serif text-4xl font-light md:text-5xl">20:00 <span className="text-base tracking-[0.3em] text-ivory/70 uppercase">h</span></p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.35em] text-rose-light uppercase">Ceremonia</p>
              <p className="mt-1 font-serif text-4xl font-light md:text-5xl">20:30 <span className="text-base tracking-[0.3em] text-ivory/70 uppercase">h</span></p>
            </div>
          </div>
          <p className="mt-14 font-serif text-2xl italic">Manuela Pedraza 3839</p>
          <p className="mt-1 text-sm tracking-[0.2em] text-ivory/70 uppercase">Villa Adelina · Provincia de Buenos Aires</p>
          <div className="mt-10 aspect-video w-full overflow-hidden border border-gold/40">
            <iframe title="Mapa" className="h-full w-full grayscale" loading="lazy" src={`https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`} />
          </div>
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`} target="_blank" rel="noreferrer" className="mt-8 inline-block border border-gold px-8 py-3 text-[11px] tracking-[0.35em] uppercase transition-colors hover:bg-gold hover:text-foreground">
            Cómo llegar
          </a>
        </div>
      </section>

      {/* Vestimenta */}
      <section id="vestimenta" className="px-6 py-28">
        <SectionTitle kicker="Dress code" title="Código de vestimenta" />
        <div className="mx-auto max-w-xl text-center">
          <p className="font-script text-5xl text-gold md:text-6xl">Elegante Sport</p>
          <p className="mt-6 font-serif text-xl leading-relaxed text-muted-foreground">
            Queremos que brilles con nosotros. Te pedimos vestimenta elegante sport para celebrar esta noche tan especial.
          </p>
          <div className="mt-12 border border-gold bg-blush px-8 py-10">
            <p className="text-[10px] tracking-[0.4em] text-rose uppercase">Atención · Damas</p>
            <p className="mt-5 font-serif text-3xl leading-snug md:text-4xl">
              Las mujeres <span className="font-semibold text-rose">NO deben vestir rosado</span>.
            </p>
            <p className="mt-5 font-serif text-lg italic text-muted-foreground">
              El rosado es un color reservado para la novia. Te pedimos elegir otro tono.
            </p>
          </div>
          <div className="mt-6 border border-gold bg-blush px-8 py-8">
            <p className="text-[10px] tracking-[0.4em] text-gold-deep uppercase">Solo adultos</p>
            <p className="mt-4 font-serif text-2xl leading-snug md:text-3xl">
              Amamos a los peques, pero esta noche <span className="font-semibold text-rose">no se permiten niños</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Confirmación de asistencia */}
      <section id="asistencia" className="border-t border-border bg-blush px-6 py-28 text-center">
        <SectionTitle kicker="Confirmación" title="¿Nos acompañás?" />
        <p className="mx-auto max-w-xl font-serif text-xl leading-relaxed text-muted-foreground">
          Completá el formulario para confirmarnos si vas a estar con nosotros ese día.
        </p>
        <RsvpButton className="mt-10" />
      </section>

      {/* Regalo */}
      <section id="regalo" className="border-t border-border px-6 py-28">
        <SectionTitle kicker="Regalo" title="Con amor" />
        <div className="mx-auto max-w-xl">
          <p className="text-center font-serif text-xl leading-relaxed text-muted-foreground">
            Tu presencia es nuestro mejor regalo. Si además querés ayudarnos a empezar esta nueva etapa, podés hacerlo por Mercado Pago.
          </p>
          <div className="mt-10">
            <CopyRow label="Alias" value="ciclon21.ar" />
            <CopyRow label="CVU" value="0000003100074914433436" />
            <div className="py-5">
              <p className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">Titular</p>
              <p className="mt-1 font-serif text-xl md:text-2xl">Alan Ezequiel Pietrapertosa</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-foreground py-16 text-center text-ivory">
        <p className="font-script text-5xl">Alan <span className="text-gold">&</span> Mily</p>
        <p className="mt-3 text-[11px] tracking-[0.4em] text-ivory/60 uppercase">13 · 03 · 2027</p>
        <RsvpButton className="mt-8" />
        <p className="mt-6 text-[9px] tracking-[0.25em] text-ivory/40 uppercase">Música: Gymnopédie No. 1 · Erik Satie · CC BY 4.0</p>
      </footer>
    </div>
  );
}
