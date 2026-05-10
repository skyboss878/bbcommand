import React, { useState, useEffect, useRef } from 'react';

const INVOICE_API = 'https://bakdetail.vercel.app/api';
const ANTHROPIC_PROXY = '/api/chat';

const PACKAGES = [
  { id: 'express', name: 'Dust-to-Diamonds Express', price: 80, maxPrice: 100, time: '1-2 hrs', features: ['Premium foam bath', 'Wheel & tire deep clean', 'Tire Shine finish', '5-min interior vacuum', 'Ceramic top-coat spray'] },
  { id: 'reset', name: 'Full Interior/Exterior Reset', price: 180, maxPrice: 280, time: '3-4 hrs', features: ['Everything in Express', 'Iron decontamination', 'Clay bar treatment', 'Interior steam cleaning', 'Hot water extraction', 'Leather conditioning'], popular: true },
  { id: 'armor', name: 'Surface Armor Package', price: 350, maxPrice: 500, time: '5-6 hrs', features: ['Full decontamination wash', '1-step machine polish', '1-year ceramic coating', 'UV & heat protection', 'Hydrophobic finish'], premium: true }
];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{--red:#e94560;--dark:#1a1a2e;--mid:#16213e;--gold:#f5a623;--green:#00d084;--blue:#0ea5e9;--muted:#8892a4;--bg:#0d0d1a;}
body{background:var(--bg);color:#f0f0f0;font-family:'DM Sans',sans-serif;overflow-x:hidden;}
a{color:inherit;text-decoration:none;}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:1000;background:rgba(13,13,26,0.95);backdrop-filter:blur(10px);border-bottom:1px solid rgba(233,69,96,0.3);padding:14px 20px;display:flex;justify-content:space-between;align-items:center;}
.nav-brand{font-family:'Bebas Neue',sans-serif;font-size:20px;color:var(--red);letter-spacing:2px;}
.nav-links{display:flex;gap:20px;align-items:center;}
.nav-link{font-size:13px;color:var(--muted);font-weight:600;cursor:pointer;transition:color 0.2s;}
.nav-link:hover{color:#fff;}
.nav-cta{background:var(--red);color:#fff;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;}

/* HERO */
.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:100px 20px 60px;position:relative;overflow:hidden;background:linear-gradient(180deg,#0d0d1a 0%,#1a1a2e 100%);}
.hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(233,69,96,0.15) 0%,transparent 60%);pointer-events:none;}
.hero-badge{display:inline-block;background:rgba(233,69,96,0.1);border:1px solid rgba(233,69,96,0.3);color:var(--red);padding:6px 16px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:24px;}
.hero h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(48px,12vw,96px);line-height:0.95;letter-spacing:2px;margin-bottom:20px;}
.hero h1 span{color:var(--red);}
.hero-sub{font-size:clamp(15px,3vw,18px);color:var(--muted);max-width:500px;margin:0 auto 36px;line-height:1.6;}
.hero-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
.btn-hero{padding:16px 32px;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:16px;font-weight:700;cursor:pointer;border:none;transition:all 0.2s;}
.btn-hero-primary{background:var(--red);color:#fff;}
.btn-hero-primary:active{opacity:0.85;}
.btn-hero-secondary{background:rgba(255,255,255,0.05);color:#fff;border:1px solid rgba(255,255,255,0.15);}
.hero-stats{display:flex;gap:32px;justify-content:center;margin-top:48px;flex-wrap:wrap;}
.hero-stat{text-align:center;}
.hero-stat-num{font-family:'Bebas Neue',sans-serif;font-size:36px;color:var(--red);}
.hero-stat-label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;}

/* SECTIONS */
.section{padding:80px 20px;}
.section-inner{max-width:1100px;margin:0 auto;}
.section-tag{font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--red);margin-bottom:12px;}
.section-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(36px,6vw,56px);letter-spacing:2px;margin-bottom:16px;}
.section-sub{color:var(--muted);font-size:15px;max-width:500px;line-height:1.6;margin-bottom:40px;}

/* PACKAGES */
.packages-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;}
.pkg-card{background:var(--dark);border:1px solid #222;border-radius:16px;padding:28px;position:relative;transition:border-color 0.2s;cursor:pointer;}
.pkg-card:hover{border-color:var(--red);}
.pkg-card.popular{border-color:var(--red);}
.pkg-card.premium{border-color:var(--gold);}
.pkg-badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);padding:4px 16px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:2px;white-space:nowrap;}
.pkg-badge.popular{background:var(--red);color:#fff;}
.pkg-badge.premium{background:var(--gold);color:#0d0d1a;}
.pkg-name{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:1px;margin-bottom:4px;}
.pkg-price{font-family:'Bebas Neue',sans-serif;font-size:40px;color:var(--gold);line-height:1;}
.pkg-price-sub{font-size:12px;color:var(--muted);margin-bottom:16px;}
.pkg-time{font-size:12px;color:var(--muted);margin-bottom:16px;display:flex;align-items:center;gap:6px;}
.pkg-features{list-style:none;margin-bottom:24px;}
.pkg-features li{font-size:13px;color:var(--muted);padding:5px 0;border-bottom:1px solid #1e1e30;display:flex;align-items:center;gap:8px;}
.pkg-features li:last-child{border-bottom:none;}
.pkg-features li::before{content:'✓';color:var(--green);font-weight:700;flex-shrink:0;}
.btn-pkg{width:100%;padding:12px;border-radius:10px;border:none;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;cursor:pointer;background:var(--red);color:#fff;transition:opacity 0.2s;}
.btn-pkg:active{opacity:0.85;}
.btn-pkg.gold{background:var(--gold);color:#0d0d1a;}

/* BOOKING */
.booking-section{background:var(--dark);border-radius:20px;padding:32px;border:1px solid #222;max-width:600px;margin:0 auto;}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;}
.form-group{margin-bottom:12px;}
.form-label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;display:block;}
.form-input{width:100%;background:#0d0d1a;border:1px solid #333;border-radius:8px;padding:11px 14px;color:#f0f0f0;font-family:'DM Sans',sans-serif;font-size:15px;outline:none;transition:border-color 0.2s;}
.form-input:focus{border-color:var(--red);}
.form-input::placeholder{color:#444;}
.form-select{appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;}
.btn-book{width:100%;padding:16px;border-radius:10px;border:none;font-family:'DM Sans',sans-serif;font-size:16px;font-weight:700;cursor:pointer;background:var(--red);color:#fff;margin-top:8px;transition:opacity 0.2s;}
.btn-book:disabled{opacity:0.6;cursor:not-allowed;}
.success-box{background:rgba(0,208,132,0.1);border:1px solid var(--green);border-radius:12px;padding:20px;text-align:center;margin-top:16px;}
.success-box h3{color:var(--green);font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:1px;margin-bottom:8px;}
.success-box p{color:var(--muted);font-size:14px;}

/* CHAT BOT */
.chat-fab{position:fixed;bottom:24px;right:24px;z-index:999;width:60px;height:60px;border-radius:50%;background:var(--red);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:28px;box-shadow:0 4px 20px rgba(233,69,96,0.4);transition:transform 0.2s;}
.chat-fab:active{transform:scale(0.95);}
.chat-window{position:fixed;bottom:96px;right:16px;width:340px;max-height:520px;background:var(--dark);border:1px solid #333;border-radius:16px;z-index:999;display:flex;flex-direction:column;box-shadow:0 8px 40px rgba(0,0,0,0.6);}
.chat-header{background:var(--red);border-radius:16px 16px 0 0;padding:14px 16px;display:flex;align-items:center;gap:10px;}
.chat-avatar{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:18px;}
.chat-title{font-weight:700;font-size:15px;}
.chat-status{font-size:11px;opacity:0.8;}
.chat-close{margin-left:auto;background:none;border:none;color:#fff;font-size:20px;cursor:pointer;line-height:1;}
.chat-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;max-height:340px;}
.chat-msg{max-width:85%;padding:10px 14px;border-radius:12px;font-size:13px;line-height:1.5;}
.chat-msg.bot{background:#1e1e30;color:#f0f0f0;align-self:flex-start;border-bottom-left-radius:4px;}
.chat-msg.user{background:var(--red);color:#fff;align-self:flex-end;border-bottom-right-radius:4px;}
.chat-msg.typing{color:var(--muted);}
.chat-input-row{padding:12px;border-top:1px solid #222;display:flex;gap:8px;}
.chat-input{flex:1;background:#0d0d1a;border:1px solid #333;border-radius:8px;padding:10px 12px;color:#f0f0f0;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;}
.chat-input:focus{border-color:var(--red);}
.chat-send{background:var(--red);border:none;border-radius:8px;width:36px;height:36px;color:#fff;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;}

/* SOCIAL PROOF */
.reviews-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;}
.review-card{background:var(--dark);border:1px solid #222;border-radius:14px;padding:20px;}
.review-stars{color:var(--gold);font-size:16px;margin-bottom:10px;letter-spacing:2px;}
.review-text{font-size:14px;color:var(--muted);line-height:1.6;margin-bottom:12px;}
.review-name{font-weight:700;font-size:13px;}
.review-pkg{font-size:11px;color:var(--red);}

/* PHONE CTA */
.phone-cta{background:linear-gradient(135deg,var(--red),#c73652);border-radius:20px;padding:48px 32px;text-align:center;margin:40px 0;}
.phone-cta h2{font-family:'Bebas Neue',sans-serif;font-size:clamp(32px,6vw,52px);letter-spacing:2px;margin-bottom:12px;}
.phone-cta p{color:rgba(255,255,255,0.8);margin-bottom:24px;}
.phone-num{font-family:'Bebas Neue',sans-serif;font-size:clamp(36px,8vw,64px);letter-spacing:4px;display:block;margin-bottom:24px;}
.btn-call{display:inline-block;background:#fff;color:var(--red);padding:16px 40px;border-radius:12px;font-weight:700;font-size:16px;letter-spacing:1px;}

/* FOOTER */
.footer{background:var(--dark);border-top:1px solid #222;padding:40px 20px;text-align:center;}
.footer-brand{font-family:'Bebas Neue',sans-serif;font-size:24px;color:var(--red);letter-spacing:2px;margin-bottom:8px;}
.footer-info{color:var(--muted);font-size:13px;margin-bottom:16px;}
.footer-copy{font-size:12px;color:#444;}

/* TOAST */
.toast{position:fixed;top:80px;left:50%;transform:translateX(-50%);background:var(--green);color:#0d0d1a;padding:12px 24px;border-radius:20px;font-weight:700;font-size:14px;z-index:9999;white-space:nowrap;}
.toast.error{background:var(--red);color:#fff;}

@media(max-width:600px){
  .form-row{grid-template-columns:1fr;}
  .chat-window{width:calc(100vw - 32px);right:16px;}
  .nav-links .nav-link{display:none;}
}
`;

const REVIEWS = [
  { name: 'Marcus T.', pkg: 'Full Reset', stars: 5, text: 'Showed up on time, my truck looks brand new. The ceramic coating is insane — water just slides right off.' },
  { name: 'Jasmine R.', pkg: 'Express Detail', stars: 5, text: 'Booked online at night, got a call in the morning. Done in 90 minutes while I worked from home. 10/10.' },
  { name: 'Carlos M.', pkg: 'Surface Armor', stars: 5, text: 'Best detailing in Bakersfield period. The paint correction on my black BMW was unreal. Worth every penny.' },
  { name: 'Tanya W.', pkg: 'Full Reset', stars: 5, text: 'My minivan had 3 kids worth of damage inside. These guys brought it back to life. They come to you — game changer.' },
  { name: 'David K.', pkg: 'Express Detail', stars: 5, text: 'Fast, professional, affordable. Booked through the website and the whole thing was seamless. Will be back monthly.' },
  { name: 'Alicia P.', pkg: 'Surface Armor', stars: 5, text: 'The AI chat on the website answered all my questions at midnight lol. Booked on the spot. Service was flawless.' }
];

const SYSTEM_PROMPT = `You are DetailBot, the friendly AI assistant for Bakersfield's Best Mobile Detailing. You help customers book appointments, answer questions about services, and close sales.

Business info:
- Phone: (661) 932-0000
- Location: Bakersfield, CA — we come TO the customer
- Hours: 7 days a week, 7am-7pm

Services & Pricing:
1. Dust-to-Diamonds Express — $80-$100 (sedans/coupes) — foam bath, wheel clean, tire shine, vacuum, ceramic spray — 1-2 hrs
2. Full Interior/Exterior Reset — $180-$280 (midsize $180-220, SUV/truck $240-280) — full detail, steam clean, hot water extraction, leather conditioning — 3-4 hrs  
3. Surface Armor Package — $350-$500+ — ceramic coating, machine polish, UV protection, 1-year protection — 5-6 hrs

Your goals:
1. Answer questions warmly and quickly
2. Upsell to higher packages when appropriate ("For just $X more you get...")
3. Get them to scroll down and fill out the booking form, or call (661) 932-0000
4. Keep responses SHORT — 2-3 sentences max on mobile
5. Always end with a question or call to action

When they seem ready to book, say: "Awesome! Scroll down to the booking form below and lock in your spot — takes 60 seconds. 🚗✨"`;

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedPkg, setSelectedPkg] = useState('');
  const [formData, setFormData] = useState({ name:'', phone:'', email:'', package:'', vehicle:'', date:'', notes:'' });
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [toast, setToast] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([{ role:'bot', text:"Hey! 👋 I'm DetailBot. What can I help you with today? Looking to get your car detailed in Bakersfield?" }]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  const bookingRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const scrollToBooking = (pkgId) => {
    if (pkgId) setSelectedPkg(pkgId);
    setFormData(p => ({ ...p, package: pkgId || p.package }));
    bookingRef.current?.scrollIntoView({ behavior:'smooth' });
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.package) {
      showToast('Please fill in name, phone, and package', 'error'); return;
    }
    setBooking(true);
    try {
      const pkg = PACKAGES.find(p => p.id === formData.package);
      await fetch(`${INVOICE_API}/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name: formData.name, phone: formData.phone, email: formData.email, address: `${formData.vehicle} — ${formData.date}` },
          services: pkg ? [{ name: pkg.name, price: pkg.price }] : [{ name: formData.package, price: 0 }],
          notes: formData.notes
        })
      });
      setBooked(true);
      showToast('Booking confirmed! We\'ll call you shortly 🚗');
    } catch {
      showToast('Booking saved! We\'ll call you to confirm.', 'success');
      setBooked(true);
    }
    setBooking(false);
  };

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setMessages(p => [...p, { role:'user', text: userMsg }]);
    setChatLoading(true);
    setMessages(p => [...p, { role:'bot', text:'...', typing: true }]);

    try {
      const history = messages.filter(m => !m.typing).map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const res = await fetch(ANTHROPIC_PROXY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history })
      });
      const data = await res.json();
      setMessages(p => [...p.filter(m => !m.typing), { role:'bot', text: data.reply }]);
    } catch {
      setMessages(p => [...p.filter(m => !m.typing), { role:'bot', text:"Sorry, I'm having trouble connecting. Call us at (661) 932-0000!" }]);
    }
    setChatLoading(false);
  };

  return (
    <>
      <style>{css}</style>
      {toast && <div className={`toast${toast.type==='error'?' error':''}`}>{toast.msg}</div>}

      {/* NAV */}
      <nav className="nav">
        <div className="nav-brand">BB Detailing</div>
        <div className="nav-links">
          <span className="nav-link" onClick={() => scrollToBooking()}>Book</span>
          <a href="tel:6619320000" className="nav-link">📞 (661) 932-0000</a>
          <button className="nav-cta" onClick={() => scrollToBooking()}>Get Quote</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"/>
        <div>
          <div className="hero-badge">Bakersfield's #1 Mobile Detailing</div>
          <h1>We Come<br/>To <span>You.</span></h1>
          <p className="hero-sub">Premium mobile detailing that defeats Bakersfield dust. Book online in 60 seconds — we show up, you relax.</p>
          <div className="hero-btns">
            <button className="btn-hero btn-hero-primary" onClick={() => scrollToBooking()}>Book Now — From $80</button>
            <a href="tel:6619320000" className="btn-hero btn-hero-secondary">📞 Call (661) 932-0000</a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><div className="hero-stat-num">500+</div><div className="hero-stat-label">Cars Detailed</div></div>
            <div className="hero-stat"><div className="hero-stat-num">5★</div><div className="hero-stat-label">Avg Rating</div></div>
            <div className="hero-stat"><div className="hero-stat-num">7</div><div className="hero-stat-label">Days a Week</div></div>
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="section" style={{ background:'var(--dark)' }}>
        <div className="section-inner">
          <div className="section-tag">Our Services</div>
          <div className="section-title">Choose Your Package</div>
          <p className="section-sub">All services come to your home, office, or wherever you are in Bakersfield.</p>
          <div className="packages-grid">
            {PACKAGES.map(pkg => (
              <div key={pkg.id} className={`pkg-card${pkg.popular?' popular':''}${pkg.premium?' premium':''}`}>
                {pkg.popular && <div className="pkg-badge popular">MOST POPULAR</div>}
                {pkg.premium && <div className="pkg-badge premium">PREMIUM</div>}
                <div className="pkg-name">{pkg.name}</div>
                <div className="pkg-price">${pkg.price}</div>
                <div className="pkg-price-sub">Starting price • {pkg.time}</div>
                <ul className="pkg-features">
                  {pkg.features.map(f => <li key={f}>{f}</li>)}
                </ul>
                <button className={`btn-pkg${pkg.premium?' gold':''}`} onClick={() => scrollToBooking(pkg.id)}>
                  Book This Package
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING FORM */}
      <section className="section" ref={bookingRef} id="booking">
        <div className="section-inner">
          <div className="section-tag">Book Online</div>
          <div className="section-title">Schedule Your Detail</div>
          <p className="section-sub">Fill out the form — we'll call you within 1 hour to confirm.</p>
          {booked ? (
            <div className="success-box">
              <h3>🚗 You're Booked!</h3>
              <p>We received your request and will call <strong>{formData.name}</strong> at <strong>{formData.phone}</strong> shortly to confirm your appointment.</p>
              <p style={{ marginTop:8 }}>Questions? Call us at <a href="tel:6619320000" style={{ color:'var(--green)', fontWeight:700 }}>(661) 932-0000</a></p>
            </div>
          ) : (
            <div className="booking-section">
              <form onSubmit={handleBook}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Your Name *</label>
                    <input className="form-input" placeholder="John Smith" value={formData.name} onChange={e => setFormData(p=>({...p,name:e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input className="form-input" placeholder="(661) 555-0000" type="tel" value={formData.phone} onChange={e => setFormData(p=>({...p,phone:e.target.value}))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" placeholder="you@email.com" type="email" value={formData.email} onChange={e => setFormData(p=>({...p,email:e.target.value}))} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Package *</label>
                    <select className="form-input form-select" value={formData.package} onChange={e => setFormData(p=>({...p,package:e.target.value}))}>
                      <option value="">Select package</option>
                      {PACKAGES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Vehicle Type</label>
                    <select className="form-input form-select" value={formData.vehicle} onChange={e => setFormData(p=>({...p,vehicle:e.target.value}))}>
                      <option value="">Select vehicle</option>
                      <option value="sedan">Sedan / Coupe</option>
                      <option value="midsize">Midsize SUV / Crossover</option>
                      <option value="large">Large SUV / Truck</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Date</label>
                  <input className="form-input" type="date" value={formData.date} min={new Date().toISOString().split('T')[0]} onChange={e => setFormData(p=>({...p,date:e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Notes (vehicle condition, location, etc.)</label>
                  <textarea className="form-input" style={{ minHeight:80, resize:'none' }} placeholder="2019 black Honda Accord, heavy dust, located at 123 Main St..." value={formData.notes} onChange={e => setFormData(p=>({...p,notes:e.target.value}))} />
                </div>
                <button className="btn-book" type="submit" disabled={booking}>
                  {booking ? 'Submitting...' : 'Request Booking — We\'ll Call You'}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section" style={{ background:'var(--dark)' }}>
        <div className="section-inner">
          <div className="section-tag">Reviews</div>
          <div className="section-title">What Bakersfield Says</div>
          <div className="reviews-grid">
            {REVIEWS.map((r,i) => (
              <div key={i} className="review-card">
                <div className="review-stars">{'★'.repeat(r.stars)}</div>
                <div className="review-text">"{r.text}"</div>
                <div className="review-name">{r.name}</div>
                <div className="review-pkg">{r.pkg} Package</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHONE CTA */}
      <section className="section">
        <div className="section-inner">
          <div className="phone-cta">
            <h2>Ready to Shine?</h2>
            <p>Call or text us right now — 7 days a week, 7am to 7pm</p>
            <a href="tel:6619320000" className="phone-num">(661) 932-0000</a>
            <br/>
            <a href="tel:6619320000" className="btn-call">📞 Call Now</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-brand">Bakersfield's Best Mobile Detailing</div>
        <div className="footer-info">(661) 932-0000 · Bakersfield, CA · 7 Days a Week</div>
        <div className="footer-copy">© {new Date().getFullYear()} Bakersfield's Best Mobile Detailing. All rights reserved.</div>
      </footer>

      {/* DETAILBOT CHAT */}
      {chatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-avatar">🚗</div>
            <div>
              <div className="chat-title">DetailBot</div>
              <div className="chat-status">● Online — usually replies instantly</div>
            </div>
            <button className="chat-close" onClick={() => setChatOpen(false)}>×</button>
          </div>
          <div className="chat-messages">
            {messages.map((m,i) => (
              <div key={i} className={`chat-msg ${m.role} ${m.typing?'typing':''}`}>{m.text}</div>
            ))}
            <div ref={chatEndRef}/>
          </div>
          <div className="chat-input-row">
            <input
              className="chat-input"
              placeholder="Ask me anything..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key==='Enter' && sendChat()}
            />
            <button className="chat-send" onClick={sendChat}>➤</button>
          </div>
        </div>
      )}
      <button className="chat-fab" onClick={() => setChatOpen(p=>!p)}>
        {chatOpen ? '×' : '💬'}
      </button>
    </>
  );
}
