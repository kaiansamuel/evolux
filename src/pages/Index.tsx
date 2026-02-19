import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroCanvas from '../components/HeroCanvas';

gsap.registerPlugin(ScrollTrigger);

// Declare iconify-icon for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        icon?: string;
        width?: string | number;
        height?: string | number;
      }, HTMLElement>;
    }
  }
}

const Index = () => {
  const [coords, setCoords] = useState('0.00.0.00.00');
  const [statusText, setStatusText] = useState('Operacional — pronto');
  const [statusActive, setStatusActive] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP entry animations
    const tl = gsap.timeline({ delay: 0.3 });
    tl.to(".nav-item", { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out" })
      .from(".hero-reveal", { y: 100, opacity: 0, duration: 1.2, stagger: 0.1, ease: "power4.out" }, "-=0.8");

    // Glitch effect
    const glitchTargets = document.querySelectorAll('.glitch-target');
    let lX = 0, lY = 0, lT = 0;
    const handleGlitch = (e: MouseEvent) => {
      const now = Date.now();
      const dt = now - lT;
      if (dt > 30) {
        const dx = e.clientX - lX;
        const dy = e.clientY - lY;
        const s = Math.sqrt(dx * dx + dy * dy) / dt;
        if (s > 2.5) {
          glitchTargets.forEach(el => {
            if (!el.classList.contains('glitch-active')) {
              el.classList.add('glitch-active');
              setTimeout(() => el.classList.remove('glitch-active'), 250);
            }
          });
        }
        lX = e.clientX;
        lY = e.clientY;
        lT = now;
      }
    };
    document.addEventListener('mousemove', handleGlitch);

    // ====== SCROLL-TRIGGERED ANIMATIONS ======
    const ctx = gsap.context(() => {

      // --- Radar Section ---
      gsap.from(".radar-heading", {
        scrollTrigger: { trigger: ".radar-section", start: "top 80%", toggleActions: "play none none none" },
        y: 60, opacity: 0, duration: 1, ease: "power3.out"
      });
      gsap.from(".radar-desc", {
        scrollTrigger: { trigger: ".radar-section", start: "top 75%", toggleActions: "play none none none" },
        y: 40, opacity: 0, duration: 1, delay: 0.2, ease: "power3.out"
      });
      gsap.from(".radar-core", {
        scrollTrigger: { trigger: ".radar-viz", start: "top 80%", toggleActions: "play none none none" },
        scale: 0, opacity: 0, duration: 1.2, ease: "elastic.out(1, 0.6)"
      });
      gsap.from(".radar-ring", {
        scrollTrigger: { trigger: ".radar-viz", start: "top 80%", toggleActions: "play none none none" },
        scale: 0.5, opacity: 0, duration: 1.4, stagger: 0.15, ease: "power3.out"
      });
      gsap.from(".radar-node", {
        scrollTrigger: { trigger: ".radar-viz", start: "top 70%", toggleActions: "play none none none" },
        scale: 0, opacity: 0, duration: 0.8, stagger: 0.12, ease: "back.out(2)",
        delay: 0.5
      });

      // --- Capabilities Section ---
      gsap.from(".cap-heading", {
        scrollTrigger: { trigger: ".cap-section", start: "top 80%", toggleActions: "play none none none" },
        x: -80, opacity: 0, duration: 1.2, ease: "power4.out"
      });
      gsap.from(".cap-btn", {
        scrollTrigger: { trigger: ".cap-section", start: "top 75%", toggleActions: "play none none none" },
        x: 40, opacity: 0, duration: 1, delay: 0.3, ease: "power3.out"
      });
      gsap.from(".cap-card", {
        scrollTrigger: { trigger: ".cap-cards", start: "top 80%", toggleActions: "play none none none" },
        y: 80, opacity: 0, scale: 0.95, duration: 1, stagger: 0.2, ease: "power3.out"
      });

      // --- Quote Section ---
      gsap.from(".quote-text", {
        scrollTrigger: { trigger: ".quote-section", start: "top 75%", toggleActions: "play none none none" },
        y: 50, opacity: 0, duration: 1.2, ease: "power3.out"
      });
      gsap.from(".quote-sub", {
        scrollTrigger: { trigger: ".quote-section", start: "top 70%", toggleActions: "play none none none" },
        y: 30, opacity: 0, duration: 1, delay: 0.3, ease: "power3.out"
      });
      gsap.from(".quote-btn", {
        scrollTrigger: { trigger: ".quote-section", start: "top 65%", toggleActions: "play none none none" },
        scale: 0.8, opacity: 0, duration: 0.8, delay: 0.5, ease: "back.out(2)"
      });

      // --- Platform Logos ---
      gsap.from(".logos-title", {
        scrollTrigger: { trigger: ".logos-section", start: "top 85%", toggleActions: "play none none none" },
        y: 20, opacity: 0, duration: 0.8, ease: "power3.out"
      });
      gsap.from(".logo-icon", {
        scrollTrigger: { trigger: ".logos-section", start: "top 80%", toggleActions: "play none none none" },
        y: 30, opacity: 0, scale: 0.5, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)",
        delay: 0.2
      });

      // --- Features List ---
      gsap.from(".features-container", {
        scrollTrigger: { trigger: ".features-section", start: "top 80%", toggleActions: "play none none none" },
        y: 60, opacity: 0, duration: 1, ease: "power3.out"
      });
      gsap.from(".features-title", {
        scrollTrigger: { trigger: ".features-section", start: "top 75%", toggleActions: "play none none none" },
        y: 30, opacity: 0, duration: 0.8, delay: 0.2, ease: "power3.out"
      });
      gsap.from(".feature-row", {
        scrollTrigger: { trigger: ".features-list", start: "top 80%", toggleActions: "play none none none" },
        x: -40, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out",
        delay: 0.3
      });

      // --- Testimonial ---
      gsap.from(".testi-label", {
        scrollTrigger: { trigger: ".testi-section", start: "top 80%", toggleActions: "play none none none" },
        y: 20, opacity: 0, duration: 0.8, ease: "power3.out"
      });
      gsap.from(".testi-badge", {
        scrollTrigger: { trigger: ".testi-section", start: "top 78%", toggleActions: "play none none none" },
        scale: 0.5, opacity: 0, duration: 0.6, delay: 0.2, ease: "back.out(2)"
      });
      gsap.from(".testi-quote", {
        scrollTrigger: { trigger: ".testi-section", start: "top 75%", toggleActions: "play none none none" },
        y: 40, opacity: 0, duration: 1.2, delay: 0.3, ease: "power3.out"
      });
      gsap.from(".testi-author", {
        scrollTrigger: { trigger: ".testi-section", start: "top 70%", toggleActions: "play none none none" },
        y: 20, opacity: 0, scale: 0.9, duration: 0.8, delay: 0.6, ease: "power3.out"
      });

      // --- CTA Section ---
      gsap.from(".cta-card", {
        scrollTrigger: { trigger: ".cta-section", start: "top 85%", toggleActions: "play none none none" },
        y: 100, opacity: 0, scale: 0.92, duration: 1.2, ease: "power3.out"
      });
      gsap.from(".cta-icon", {
        scrollTrigger: { trigger: ".cta-section", start: "top 75%", toggleActions: "play none none none" },
        scale: 0, rotation: -180, opacity: 0, duration: 1, delay: 0.4, ease: "elastic.out(1, 0.5)"
      });
      gsap.from(".cta-heading", {
        scrollTrigger: { trigger: ".cta-section", start: "top 70%", toggleActions: "play none none none" },
        y: 40, opacity: 0, duration: 1, delay: 0.5, ease: "power3.out"
      });
      gsap.from(".cta-btn", {
        scrollTrigger: { trigger: ".cta-section", start: "top 65%", toggleActions: "play none none none" },
        y: 20, opacity: 0, scale: 0.8, duration: 0.8, delay: 0.7, ease: "back.out(2)"
      });

      // --- Footer ---
      gsap.from(".footer-logo", {
        scrollTrigger: { trigger: ".site-footer", start: "top 90%", toggleActions: "play none none none" },
        scale: 0, opacity: 0, rotation: 90, duration: 0.8, ease: "back.out(2)"
      });
      gsap.from(".footer-col", {
        scrollTrigger: { trigger: ".site-footer", start: "top 85%", toggleActions: "play none none none" },
        y: 40, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
        delay: 0.2
      });
      gsap.from(".footer-bottom", {
        scrollTrigger: { trigger: ".site-footer", start: "top 80%", toggleActions: "play none none none" },
        y: 20, opacity: 0, duration: 0.8, delay: 0.6, ease: "power3.out"
      });

    }, mainRef);

    return () => {
      document.removeEventListener('mousemove', handleGlitch);
      ctx.revert();
    };
  }, []);

  const handleCoreClick = useCallback(() => {
    setStatusActive(false);
    setStatusText('Status: Reiniciando');
    setTimeout(() => {
      setStatusActive(true);
      setStatusText('Operacional — pronto');
    }, 4000);
  }, []);

  const handleMouseMove = useCallback((x: number, y: number) => {
    setCoords(`${x.toFixed(2)}.${y.toFixed(2)}.00`);
  }, []);

  return (
    <div className="overflow-x-hidden" ref={mainRef}>
      {/* 3D Hero Container */}
      <div className="relative h-screen w-full overflow-hidden" ref={heroRef}>
        {/* Canvas Background */}
        <div className="absolute inset-0 z-0">
          <HeroCanvas onCoreClick={handleCoreClick} onMouseMove={handleMouseMove} />
        </div>

        {/* Hero UI Overlay */}
        <div className="relative z-10 flex flex-col h-full pointer-events-none">
          {/* Navigation */}
          <header className="w-full px-6 py-6 flex justify-between items-center pointer-events-auto opacity-0 nav-item">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-black/50 backdrop-blur-md group-hover:border-lime-400/50 transition-colors duration-300">
                <iconify-icon icon="solar:widget-5-linear" className="text-lime-400 text-xl transition-transform group-hover:rotate-90" />
              </div>
                <span className="text-lg font-medium tracking-tight text-white group-hover:text-lime-400 transition-colors glitch-target">
                Evolux
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-1 glass-panel p-1 rounded-full">
              <a className="px-5 py-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors text-xs font-medium uppercase tracking-wider" href="#">Sites</a>
              <a className="px-5 py-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors text-xs font-medium uppercase tracking-wider" href="#">Sistemas</a>
              <a className="px-5 py-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors text-xs font-medium uppercase tracking-wider" href="#">Automação</a>
            </nav>
            <button className="group flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full bg-black/20 backdrop-blur-sm hover:border-lime-400/30 hover:bg-lime-400/10 transition-all duration-300">
              <span className="text-xs font-medium text-white group-hover:text-lime-300">Agendar Demo</span>
              <iconify-icon icon="solar:arrow-right-linear" width="16" className="text-lime-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </header>

          {/* Hero Main Content */}
          <main className="flex-grow flex flex-col justify-center px-6 md:px-12 lg:px-24 pointer-events-none">
            <div className="max-w-5xl space-y-8">
              <div className="overflow-hidden">
                <div className="hero-reveal flex items-center gap-3">
                  <span className={`flex h-2 w-2 rounded-full transition-colors duration-300 ${statusActive ? 'bg-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.6)]' : 'bg-white'}`} />
                  <p className={`text-xs md:text-sm uppercase tracking-[0.2em] font-medium font-mono transition-colors duration-300 ${statusActive ? 'text-lime-400/80' : 'text-white'}`}>
                    {statusText}
                  </p>
                </div>
              </div>
              <div className="space-y-0">
                <div className="overflow-hidden">
                  <h1 className="hero-reveal text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[0.95] text-white glitch-target mix-blend-difference">
                    Sites que convertem, sistemas sob medida,
                  </h1>
                </div>
                <div className="overflow-hidden">
                  <h1 className="hero-reveal text-5xl md:text-7xl lg:text-8xl font-serif italic font-light tracking-tight leading-[0.95] text-lime-300/90 glitch-target">
                    Design premium. Automação prática.
                  </h1>
                </div>
              </div>
              <div className="overflow-hidden max-w-xl">
                <p className="hero-reveal text-sm md:text-lg text-zinc-400 leading-relaxed font-light">
                  Pare de perder leads por sites lentos ou confusos. Entregamos sites de alta conversão, sistemas sob medida e automações com IA para otimizar vendas e operações.
                  <span className="text-lime-400/70 text-xs block mt-2 font-mono uppercase tracking-widest opacity-80">&gt; Clique no núcleo para iniciar um diagnóstico rápido</span>
                </p>
              </div>
              <div className="overflow-hidden pt-6">
                <div className="hero-reveal flex flex-wrap pointer-events-auto pt-4 pr-1 pb-4 pl-1 gap-x-4 gap-y-4">
                  <div className="btn-wrapper">
                    <button aria-label="Install ClawOS" className="btn" type="button">
                      <div className="txt-wrapper">
                        <div className="txt-1">
                          {'Quero'.split('').map((l, i) => (
                            <span key={i} className="btn-letter">{l}</span>
                          ))}
                          <span className="btn-letter" style={{ width: 4 }}></span>
                                {'Evolux'.split('').map((l, i) => (
                                  <span key={i + 7} className="btn-letter">{l}</span>
                                ))}
                        </div>
                      </div>
                      <svg className="btn-svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" x2="12" y1="15" y2="3" />
                      </svg>
                    </button>
                  </div>
                  <button className="group inline-flex overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(163,230,53,0.2)] h-[54px] rounded-full pt-[1px] pr-[1px] pb-[1px] pl-[1px] relative items-center justify-center">
                    <span className="animate-[spin_4s_linear_infinite] transition-opacity duration-300 group-hover:opacity-100 opacity-0 absolute top-[-150%] left-[-150%] w-[400%] h-[400%] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#a3e635_100%)]" />
                    <span className="absolute inset-0 rounded-full bg-white/10 transition-opacity duration-300 group-hover:opacity-0" />
                    <span className="flex items-center justify-center gap-2 transition-colors duration-300 group-hover:text-lime-300 text-sm font-medium text-white tracking-tight bg-zinc-950 w-full h-full rounded-full pr-8 pl-8 relative shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                      <span className="relative z-10">Ver Portfólio</span>
                      <svg className="relative z-10 text-zinc-400 group-hover:text-lime-300 transition-colors" fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" x2="8" y1="13" y2="13" />
                        <line x1="16" x2="8" y1="17" y2="17" />
                        <line x1="10" x2="8" y1="9" y2="9" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </main>

          {/* Bottom Stats */}
          <footer className="pointer-events-auto nav-item flex justify-between items-end w-full px-6 pb-8 opacity-0">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Coordenadas</span>
              <span className="text-xs font-mono text-lime-400">{coords}</span>
            </div>
            <div className="hidden md:flex gap-4">
              <iconify-icon icon="simple-icons:telegram" className="text-zinc-600 hover:text-[#26A5E4] transition-colors text-xl" />
              <iconify-icon icon="simple-icons:discord" className="text-zinc-600 hover:text-[#5865F2] transition-colors text-xl" />
              <iconify-icon icon="simple-icons:python" className="text-zinc-600 hover:text-[#3776AB] transition-colors text-xl" />
            </div>
          </footer>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-[5] pointer-events-none" />
      </div>

      {/* ======== RADAR / FEATURES SECTION ======== */}
      <section className="radar-section py-32 relative overflow-hidden bg-black">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16 relative z-10">
          <h2 className="radar-heading text-3xl md:text-5xl font-medium text-white tracking-tight mb-6">
            A camada que acelera <span className="font-serif italic text-lime-300">resultados</span>
          </h2>
          <p className="radar-desc text-lg text-zinc-400 max-w-xl mx-auto">
            Unimos site, sistema e IA numa plataforma única para decisões mais rápidas, automações acionáveis e melhores taxas de conversão.
          </p>
        </div>

        <div className="radar-viz aspect-square md:aspect-[1.5/1] flex w-full max-w-2xl mr-auto ml-auto relative items-center justify-center">
          {/* Sonar Ripples */}
          <div className="radar-ring absolute w-[80%] h-[80%] rounded-full border border-white/5 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-30" />
          <div className="radar-ring absolute w-[60%] h-[60%] rounded-full border border-white/10 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-20" style={{ animationDelay: '1s' }} />
          {/* Concentric Circles */}
          <div className="radar-ring absolute w-[80%] h-[80%] rounded-full border border-white/5 animate-pulse" />
          <div className="radar-ring absolute w-[60%] h-[60%] rounded-full border border-white/10 animate-pulse" style={{ animationDelay: '500ms' }} />
          <div className="radar-ring absolute w-[40%] h-[40%] rounded-full border border-white/20 animate-pulse" style={{ animationDelay: '1000ms' }} />

          {/* Center Core */}
          <div className="radar-core relative z-10 flex flex-col items-center justify-center w-32 h-32 rounded-full bg-zinc-900 border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <svg className="text-lime-400 mb-1" fill="none" height="32" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="32">
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <span className="text-xs font-medium text-white tracking-tight">Núcleo Evolux</span>
          </div>

          {/* Orbiting Nodes */}
          <div className="radar-node absolute top-[15%] left-[20%] flex flex-col items-center gap-2 group cursor-pointer hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center group-hover:border-lime-400/50 transition-colors">
              <svg className="text-zinc-400 group-hover:text-lime-400 transition-colors" fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="text-xs text-zinc-500 group-hover:text-white transition-colors">Atendimento Unificado</span>
          </div>

          <div className="radar-node absolute bottom-[20%] right-[20%] flex flex-col items-center gap-2 group cursor-pointer hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center group-hover:border-lime-400/50 transition-colors">
              <svg className="text-zinc-400 group-hover:text-lime-400 transition-colors" fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M3 5V19A9 3 0 0 0 21 19V5" />
                <path d="M3 12A9 3 0 0 0 21 12" />
              </svg>
            </div>
            <span className="text-xs text-zinc-500 group-hover:text-white transition-colors">Memória Contextual</span>
          </div>

          <div className="radar-node absolute top-[20%] right-[25%] flex flex-col items-center gap-2 group cursor-pointer hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center group-hover:border-lime-400/50 transition-colors">
              <svg className="text-zinc-400 group-hover:text-lime-400 transition-colors" fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" x2="12" y1="22.08" y2="12" />
              </svg>
            </div>
            <span className="text-xs text-zinc-500 group-hover:text-white transition-colors">Skills Plug-and-Play</span>
          </div>

          <div className="radar-node absolute bottom-[15%] left-[25%] flex flex-col items-center gap-2 group cursor-pointer hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center group-hover:border-lime-400/50 transition-colors">
              <svg className="text-zinc-400 group-hover:text-lime-400 transition-colors" fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
                <path d="M21 4h-2" /><path d="M15 4H3" /><path d="M18 12H3" /><path d="M8 20H3" /><path d="M21 12h-1" /><path d="M21 20h-9" />
                <circle cx="17" cy="4" r="2" /><circle cx="19" cy="12" r="2" /><circle cx="10" cy="20" r="2" />
              </svg>
            </div>
            <span className="text-xs text-zinc-500 group-hover:text-white transition-colors">Configuração Visual</span>
          </div>
        </div>
      </section>

      {/* ======== CAPABILITIES SECTION ======== */}
      <section className="cap-section py-24 bg-zinc-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
              <h2 className="cap-heading text-4xl md:text-6xl font-medium text-white tracking-tight">
              Automação com <br /> <span className="font-serif italic font-light text-zinc-500">foco em resultado</span>
            </h2>
            <button className="cap-btn hidden md:block border border-white/20 text-white px-6 py-2 rounded-full text-sm hover:bg-white/10 transition-colors">
              Explorar Skills
            </button>
          </div>
          <div className="cap-cards grid md:grid-cols-2 gap-6">
            <div className="cap-card group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer bg-zinc-900 border border-white/5 hover:border-lime-400/30 transition-colors duration-500">
              <div className="bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-lime-900/20 via-transparent to-transparent opacity-50 absolute inset-0" />
              <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                <div className="flex items-center gap-2 mb-2 text-lime-400">
                  <iconify-icon icon="solar:brain-bold-duotone" />
                  <span className="text-xs uppercase tracking-wider font-bold">Dados e Contexto</span>
                </div>
                <h3 className="text-3xl text-white font-medium mb-1">Memória Contextual</h3>
                <p className="text-zinc-400 text-sm">Indexamos conversas e dados para personalização e automações que mantêm contexto e convertem mais.</p>
              </div>
            </div>
            <div className="cap-card group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer bg-zinc-900 border border-white/5 hover:border-lime-400/30 transition-colors duration-500">
              <div className="bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50 absolute inset-0" />
              <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                <div className="flex items-center gap-2 mb-2 text-lime-400">
                  <iconify-icon icon="solar:chat-round-bold-duotone" />
                  <span className="text-xs uppercase tracking-wider font-bold">Central de Contato</span>
                </div>
                <h3 className="text-3xl text-white font-medium mb-1">Painel Unificado</h3>
                <p className="text-zinc-400 text-sm">Gerencie canais e bots num único painel elegante — sem editar código.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======== NARRATIVE QUOTE ======== */}
      <section className="quote-section text-center bg-black pt-32 pr-6 pb-32 pl-6">
        <p className="quote-text text-3xl md:text-5xl font-medium text-white max-w-4xl mx-auto leading-tight tracking-tight">
          "Sites que vendem. Sistemas que organizam operações." 
        </p>
        <p className="quote-sub mt-4 text-lg text-zinc-500">Dê à sua equipe IA útil, automações e painéis que geram resultados reais.</p>
        <div className="quote-btn mt-12 flex justify-center">
            <button className="border border-white/20 text-white px-6 py-2 rounded-full text-sm hover:bg-white/10 transition-colors">
            Ver Soluções
          </button>
        </div>
      </section>

      {/* ======== PLATFORM LOGOS ======== */}
      <section className="logos-section border-y border-white/5 pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="logos-title text-center text-zinc-600 text-sm font-medium mb-12 uppercase tracking-widest">Integra com plataformas</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <iconify-icon icon="simple-icons:telegram" width="40" className="logo-icon text-white hover:text-[#26A5E4]" />
            <iconify-icon icon="simple-icons:discord" width="40" className="logo-icon text-white hover:text-[#5865F2]" />
            <iconify-icon icon="simple-icons:slack" width="40" className="logo-icon text-white hover:text-[#4A154B]" />
            <iconify-icon icon="simple-icons:whatsapp" width="40" className="logo-icon text-white hover:text-[#25D366]" />
            <iconify-icon icon="simple-icons:signal" width="40" className="logo-icon text-white hover:text-[#3A76F0]" />
          </div>
        </div>
      </section>

      {/* ======== FEATURES LIST ======== */}
      <section className="features-section py-32 bg-black">
        <div className="features-container max-w-5xl mx-auto px-6 bg-zinc-900/50 rounded-3xl p-10 md:p-20 border border-white/10">
          <h3 className="features-title text-center text-3xl font-medium text-white mb-16">Como <span className="font-serif italic text-zinc-400">entregamos</span> mais conversão e escala.</h3>
          <div className="features-list space-y-0 divide-y divide-white/10">
            {[
              { num: '01', title: 'Sites Otimizados', desc: 'Design, copy e performance integrados para aumentar conversões desde o primeiro acesso.' },
              { num: '02', title: 'Memória Contextual', desc: 'Dados persistentes e contexto que permitem automações relevantes e atendimento personalizado.' },
              { num: '03', title: 'Configuração Visual', desc: 'Crie fluxos, integrações e regras pelo painel — sem depender de engenharia para cada mudança.' },
              { num: '04', title: 'Integrações Centralizadas', desc: 'Conecte canais, CRMs e ERPs numa visão única — dados sincronizados, operação escalável.' },
            ].map((item) => (
              <div key={item.num} className="feature-row group py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer">
                <div className="flex items-start gap-4">
                  <span className="text-xs font-mono text-zinc-600 mt-1">{item.num}</span>
                  <h4 className="text-xl text-white font-medium group-hover:text-lime-400 transition-colors">{item.title}</h4>
                </div>
                <p className="text-sm text-zinc-500 max-w-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== TESTIMONIAL ======== */}
      <section className="testi-section py-32 bg-black relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h4 className="testi-label text-sm font-medium text-zinc-500 mb-8 uppercase tracking-widest">Depoimentos</h4>
          <div className="testi-badge mb-10">
            <p className="text-xs font-bold text-white tracking-wider">CLIENTE</p>
          </div>
          <blockquote className="testi-quote text-2xl md:text-3xl text-zinc-300 font-serif italic leading-relaxed mb-12">
            "A Evolux aumentou nossa taxa de conversão e simplificou fluxos operacionais. Entregas rápidas e suporte dedicado."
          </blockquote>
          <div className="testi-author flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-zinc-800 border border-white/20 flex items-center justify-center">
              <span className="text-white text-xs font-medium">EK</span>
            </div>
              <div className="text-center">
              <div className="text-white text-sm font-medium">Elena K.</div>
              <div className="text-zinc-600 text-xs">Engenheira de IA</div>
            </div>
          </div>
        </div>
      </section>

      {/* ======== FINAL CTA ======== */}
      <section className="cta-section pb-20 px-4 md:px-6 bg-black">
        <div className="cta-card max-w-7xl mx-auto bg-lime-350 rounded-3xl p-16 md:p-24 text-center relative overflow-hidden group">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/20 blur-[100px] rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
          <div className="relative z-10">
            <div className="cta-icon inline-block">
              <iconify-icon icon="solar:programming-linear" className="text-black text-5xl mb-6 animate-pulse" />
            </div>
            <h2 className="cta-heading text-4xl md:text-6xl font-medium text-black mb-6 tracking-tight">
              Comece a transformar site, sistema e operação hoje.
            </h2>
            <button className="cta-btn bg-transparent border border-black text-black px-8 py-3 rounded-full text-sm font-medium hover:bg-black hover:text-lime-300 transition-all">
              Quero Diagnóstico
            </button>
          </div>
        </div>
      </section>

      {/* ======== FOOTER ======== */}
      <footer className="site-footer bg-black pt-20 pb-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="footer-logo flex justify-center mb-16">
            <iconify-icon icon="solar:widget-5-bold-duotone" className="text-lime-400 text-3xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-16">
            <div className="footer-col md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-white font-medium tracking-tighter">Evolux</span>
              </div>
              <h3 className="text-2xl text-white font-medium mb-4">Sites, sistemas e IA que entregam resultado.</h3>
              <div className="flex gap-2">
                <input className="bg-white/5 border border-white/10 rounded-md px-4 py-2 text-sm text-white w-full focus:outline-none focus:border-lime-400" placeholder="Seu e-mail" type="email" />
                <button className="bg-white/10 border border-white/10 rounded-md px-3 text-white hover:bg-white/20">
                  <iconify-icon icon="solar:arrow-right-linear" />
                </button>
              </div>
            </div>
            <div className="footer-col md:col-start-3">
              <h4 className="text-white font-medium mb-4 text-sm">Produto</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a className="hover:text-lime-400 transition-colors" href="#">Sites</a></li>
                <li><a className="hover:text-lime-400 transition-colors" href="#">Sistemas</a></li>
                <li><a className="hover:text-lime-400 transition-colors" href="#">IA &amp; Automação</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 className="text-white font-medium mb-4 text-sm">Recursos</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a className="hover:text-lime-400 transition-colors" href="#">Docs Evolux</a></li>
                <li><a className="hover:text-lime-400 transition-colors" href="#">Guia de Integração</a></li>
                <li><a className="hover:text-lime-400 transition-colors" href="#">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom flex justify-between items-center pt-8 text-xs text-zinc-600">
            <p>© 2026 Evolux. Todos os direitos reservados.</p>
            <div className="flex gap-4">
              <a className="hover:text-white" href="#">Privacidade</a>
              <a className="hover:text-white" href="#">Termos</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
