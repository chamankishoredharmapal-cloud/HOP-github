import { Link } from "react-router-dom";
import Monogram from "./Monogram";

const HopFooter = () => {
  return (
    <footer className="bg-teal-deep text-jasmine mt-32">
      <div className="container py-20 grid gap-16 lg:grid-cols-[1.2fr_2fr]">
        {/* Brand column */}
        <div className="space-y-6">
          <div className="text-jasmine">
            <Monogram variant="signature" className="h-20 [filter:brightness(0)_invert(1)] opacity-90" />
            <p className="mt-2 font-serif text-lg tracking-[0.22em] uppercase text-jasmine">
              House of Padmavati
            </p>
            <p className="mt-6 font-serif italic text-2xl leading-tight max-w-xs">
              To the woman who wove my world.
            </p>
          </div>
          <p className="text-sm font-light text-jasmine/70 leading-relaxed max-w-sm">
            A quiet atelier of heritage and contemporary luxury sarees, hand-wrapped and shipped from India.
          </p>
          <form className="flex max-w-sm border-b border-jasmine/40 pb-2">
            <input
              type="email"
              placeholder="Your email, gently kept"
              className="flex-1 bg-transparent text-sm text-jasmine placeholder:text-jasmine/50 outline-none font-light"
              aria-label="Email"
            />
            <button className="text-xs tracking-[0.3em] uppercase hover:text-sand transition-colors">
              Join
            </button>
          </form>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-sm font-light">
          <FooterCol title="Collections">
            <FooterLink to="/collections/kalyani">Kalyani</FooterLink>
            <FooterLink to="/collections/viara">Viara</FooterLink>
            <FooterLink to="/collections/megham">Arya</FooterLink>
            <FooterLink to="/collections/oosi-kattam">Padma</FooterLink>
            <FooterLink to="/collections/designer-wear">Spandana</FooterLink>
          </FooterCol>
          <FooterCol title="The House">
            <FooterLink to="/about">Our Story</FooterLink>
            <FooterLink to="/journal">Journal</FooterLink>
            <FooterLink to="/customer-care">Contact</FooterLink>
          </FooterCol>
          <FooterCol title="Care">
            <FooterLink to="/customer-care">Saree Care</FooterLink>
          </FooterCol>
          <FooterCol title="Whisper">
            <FooterLink to="https://instagram.com">Instagram</FooterLink>
            <FooterLink to="https://pinterest.com">Pinterest</FooterLink>
            <FooterLink to="https://wa.me/919999999999">WhatsApp</FooterLink>
          </FooterCol>
        </div>
      </div>

      <div className="border-t border-jasmine/20 py-6">
        <div className="container grid md:grid-cols-3 gap-4 text-xs font-light text-jasmine/60">
          <div className="text-center md:text-left">
            <p className="text-jasmine/80 font-medium mb-1">Worldwide shipping</p>
            <p>Fully insured · Discreet packaging · 14-day returns</p>
          </div>
          <div className="text-center">
            <p className="text-jasmine/80 font-medium mb-1">Handcrafted with care</p>
            <p>Each saree is hand-woven and one of one</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-jasmine/80 font-medium mb-1">Secure payments</p>
            <p>Razorpay · Credit cards · UPI · Net banking</p>
          </div>
        </div>
      </div>
      <div className="border-t border-jasmine/15">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-light text-jasmine/60">
          <p>© {new Date().getFullYear()} House of Padmavati. Woven with care.</p>
          <div className="flex gap-6">
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
    <h4 className="font-serif text-base text-sand mb-4 tracking-wide">{title}</h4>
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
