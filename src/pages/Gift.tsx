import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Gift as GiftIcon, Feather, Sparkles, Shield } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMetadata } from "@/hooks/useMetadata";

export default function Gift() {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useMetadata({
    title: "Gift Experience — House of Padmavati",
    description: "A Padmavati saree, wrapped in jasmine paper with a handwritten keepsake card. A gift that carries the weight of intention.",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageLayout>
      <main>
        <section className="container pt-16 pb-12 text-center">
          <p className="text-xs tracking-[0.42em] uppercase text-teal mb-4">
            Modern Heirlooms
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-balance leading-tight max-w-3xl mx-auto">
            A gift that carries <em className="text-teal">the weight of intention.</em>
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-sm sm:text-base text-ink-soft font-light leading-relaxed">
            Every Padmavati gift is hand-wrapped in jasmine paper, tied with cotton ribbon,
            and accompanied by a handwritten keepsake card. No marketing. No clutter.
            Only your words and the cloth.
          </p>
        </section>

        <section className="container pb-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-full bg-teal-deep/10 flex items-center justify-center">
                    <GiftIcon className="w-5 h-5 text-teal-deep" />
                  </div>
                  <h3 className="font-serif text-xl text-ink">Jasmine wrapping</h3>
                  <p className="text-sm text-ink-soft font-light leading-relaxed">
                    Hand-folded in our signature jasmine paper with a cotton ribbon seal.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-full bg-teal-deep/10 flex items-center justify-center">
                    <Feather className="w-5 h-5 text-teal-deep" />
                  </div>
                  <h3 className="font-serif text-xl text-ink">Keepsake card</h3>
                  <p className="text-sm text-ink-soft font-light leading-relaxed">
                    Your personal message printed on Ink Charcoal on Jasmine Mist cardstock.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-full bg-teal-deep/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-teal-deep" />
                  </div>
                  <h3 className="font-serif text-xl text-ink">Hand-delivered feel</h3>
                  <p className="text-sm text-ink-soft font-light leading-relaxed">
                    Every gift is packed as if handed across a table, not dropped in a box.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-full bg-teal-deep/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-teal-deep" />
                  </div>
                  <h3 className="font-serif text-xl text-ink">Worldwide, insured</h3>
                  <p className="text-sm text-ink-soft font-light leading-relaxed">
                    Fully insured global shipping with discreet packaging.
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-8">
                <h2 className="font-serif text-2xl text-ink mb-4">Begin a gift order</h2>
                {submitted ? (
                  <div className="bg-teal-deep/5 border border-teal-deep/20 rounded-lg p-6 text-center">
                    <Heart className="w-8 h-8 text-teal-deep mx-auto mb-3" />
                    <p className="text-ink font-serif text-lg">Your gift note is saved.</p>
                    <p className="text-sm text-ink-soft font-light mt-2">
                      Add a saree to your bag and proceed to checkout — your gift message will
                      be hand-written on our keepsake card.
                    </p>
                    <Button asChild className="mt-4 rounded-full bg-teal-deep text-jasmine hover:bg-teal">
                      <Link to="/collections">
                        Browse sarees <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                    <div>
                      <label htmlFor="gift-recipient" className="text-sm text-ink-soft font-light">
                        Recipient name <span className="text-ink-soft/50">(optional)</span>
                      </label>
                      <Input
                        id="gift-recipient"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="Who is this for?"
                        className="mt-1.5 rounded-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="gift-message" className="text-sm text-ink-soft font-light">
                        Your message
                      </label>
                      <Textarea
                        id="gift-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="A whisper to go with the weave..."
                        className="mt-1.5 rounded-md min-h-[120px]"
                      />
                      <p className="text-[0.65rem] text-ink-soft/50 mt-1">
                        Handwritten on our keepsake card. Maximum 150 characters.
                      </p>
                    </div>
                    <Button
                      type="submit"
                      className="rounded-full bg-teal-deep text-jasmine hover:bg-teal transition-colors duration-500"
                    >
                      Save gift note
                    </Button>
                    <p className="text-xs text-ink-soft/60 mt-2">
                      Your note will be stored for this session. When you checkout, simply
                      check "This is a gift" and your note will be included.
                    </p>
                  </form>
                )}
              </div>
            </div>

            <div className="aspect-[4/5] rounded-md bg-jasmine-deep overflow-hidden">
              <div className="w-full h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <Heart className="w-16 h-16 text-teal-deep/30 mx-auto mb-6" />
                  <p className="font-serif italic text-2xl text-ink-soft/60 leading-snug max-w-xs mx-auto">
                    "A gift is not a thing, but a carrying of the self into another's life."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-sand/30">
          <div className="container py-20 text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-ink mb-4">
              Need help choosing?
            </h2>
            <p className="text-ink-soft font-light max-w-md mx-auto mb-8">
              Our gift concierge can help you select the perfect saree. Write to us at
              care@houseofpadmavati.com or use our contact form.
            </p>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/customer-care">
                Contact concierge <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
