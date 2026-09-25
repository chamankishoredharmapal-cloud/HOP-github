import { useState } from "react";
import { Link } from "react-router-dom";
import Monogram from "./Monogram";

const HopFooter = () => {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <footer className="bg-ink text-jasmine mt-section">
      <div className="container py-16 sm:py-20 grid gap-14 lg:grid-cols-[1.2fr_2fr]">
        {/* Brand column */}
        <div className="space-y-6">
          <div className="text-jasmine">
            <Monogram variant="signature" className="h-16 sm:h-20 [filter:brightness(0)_invert(1)] opacity-90" />
            <p className="mt-2 font-serif font-light text-base sm:text-lg tracking-[0.22em] uppercase text-jasmine">
              House of Padmavati
            </p>
            <p className="mt-6 font-serif italic font-light text-2xl leading-tight max-w-xs">
              To the woman who wove my world.
            </p>
          </div>
          <p className="text-sm font-light text-jasmine/70 leading-relaxed max-w-sm">
            A house, not a shop — for Indian sarees.
          </p>
          {joined ? (
            <p className="text-sm font-light text-jasmine/80 max-w-sm" role="status">
              Kept gently. You will hear from the house only when there is something worth saying.
            </p>
          ) : (
            <form
              className="flex max-w-sm border-b border-jasmine/40 pb-2"
              onSubmit={(e) => { e.preventDefault(); if (email.trim()) setJoined(true); }}
            >
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email, gently kept"
                className="flex-1 bg-transparent text-sm text-jasmine placeholder:text-jasmine/50 outline-none font-light"
                aria-label="Email"
              />
              <button type="submit" className="text-[0.65rem] tracking-[0.3em] uppercase hover:text-jasmine transition-colors pl-4">
                Join
              </button>
            </form>
          )}
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-sm font-light">
          <FooterCol title="Collections">
            <FooterLink to="/collections/kalyani">Kalyani</FooterLink>
            <FooterLink to="/collections/viara">Viara</FooterLink>
            <FooterLink to="/collections/arya">Arya</FooterLink>
            <FooterLink to="/collections/padma">Padma</FooterLink>
            <FooterLink to="/collections/spandana">Spandana</FooterLink>
          </FooterCol>
          <FooterCol title="The House">
            <FooterLink to="/about">Our Story</FooterLink>
            <FooterLink to="/lookbook">Lookbook</FooterLink>
            <FooterLink to="/journal">Journal</FooterLink>
            <FooterLink to="/appointments">Appointments</FooterLink>
            <FooterLink to="/customer-care">Contact</FooterLink>
          </FooterCol>
          <FooterCol title="Care">
            <FooterLink to="/customer-care">Saree Care</FooterLink>
            <FooterLink to="/shipping-policy">Shipping</FooterLink>
            <FooterLink to="/returns-policy">Returns</FooterLink>
          </FooterCol>
          <div>
            <h2 className="font-serif font-light text-base text-jasmine mb-4 tracking-wide">Whisper</h2>
            <ul className="space-y-2.5">
              <li><a href="https://instagram.com/houseofpadmavati" target="_blank" rel="noreferrer" className="text-jasmine/75 hover:text-jasmine transition-colors">Instagram</a></li>
              <li><a href="https://pinterest.com/houseofpadmavati" target="_blank" rel="noreferrer" className="text-jasmine/75 hover:text-jasmine transition-colors">Pinterest</a></li>
              <li><a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="text-jasmine/75 hover:text-jasmine transition-colors">WhatsApp</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-jasmine/15 py-5">
        <div className="container text-center">
          <p className="text-xs font-light text-jasmine/60">
            Fully insured · Discreet packaging · Secure payments via Razorpay
          </p>
        </div>
      </div>
      <div className="border-t border-jasmine/15">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-light text-jasmine/60">
          <p>© {new Date().getFullYear()} House of Padmavati. Designed with intention.</p>
          <div className="flex gap-6">
            <Link to="/shipping-policy" className="hover:text-jasmine transition-colors">Shipping</Link>
            <Link to="/returns-policy" className="hover:text-jasmine transition-colors">Returns</Link>
            <Link to="/privacy-policy" className="hover:text-jasmine transition-colors">Privacy</Link>
            <Link to="/terms-of-service" className="hover:text-jasmine transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterCol = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    {/* h2 (not h3): several storefront pages carry no h2, so h3 here skipped a
        level and failed axe heading-order. Visuals unchanged — classes rule. */}
    <h2 className="font-serif font-light text-base text-jasmine mb-4 tracking-wide">{title}</h2>
    <ul className="space-y-2.5">{children}</ul>
  </div>
);

const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <li>
    <Link to={to} className="text-jasmine/75 hover:text-jasmine transition-colors">
      {children}
    </Link>
  </li>
);

export default HopFooter;
