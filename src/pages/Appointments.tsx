import React, { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { useMetadata } from "@/hooks/useMetadata";

const Appointments = () => {
  useMetadata({
    title: "Atelier Appointments · House of Padmavati",
    description: "Request a private viewing or bridal consultation at our Pondicherry atelier.",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    // Mock submission delay
    setTimeout(() => {
      setStatus("success");
    }, 1200);
  };

  return (
    <PageLayout>
      <main className="min-h-screen bg-[#F7F4EE]">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">
          {/* Left: Imagery */}
          <section className="relative h-[40vh] lg:h-auto order-2 lg:order-1">
            <img
              src="https://images.unsplash.com/photo-1610030469647-7973dfd70756?auto=format&fit=crop&q=80"
              alt="Folded silks in the atelier"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </section>

          {/* Right: The Form */}
          <section className="order-1 lg:order-2 flex flex-col justify-center px-6 py-24 lg:p-24 bg-[#F7F4EE]">
            <div className="max-w-md w-full mx-auto space-y-12">
              <div className="space-y-6">
                <h1 className="font-serif text-4xl text-ink">Appointments.</h1>
                <p className="text-ink-soft leading-relaxed">
                  Request a private viewing or bridal consultation at our Pondicherry atelier.
                </p>
              </div>

              {status === "success" ? (
                <div className="bg-sand-light p-8 border border-teal/10 text-center space-y-4">
                  <h3 className="font-serif text-2xl text-ink">Request received.</h3>
                  <p className="text-ink-soft text-sm">
                    We will contact you shortly to confirm the details of your appointment.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-xs uppercase tracking-widest text-ink-soft">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="w-full bg-transparent border-b border-teal/30 py-3 text-ink focus:outline-none focus:border-teal transition-colors placeholder:text-ink-soft/30"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-xs uppercase tracking-widest text-ink-soft">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full bg-transparent border-b border-teal/30 py-3 text-ink focus:outline-none focus:border-teal transition-colors placeholder:text-ink-soft/30"
                      placeholder="Your email address"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="type" className="block text-xs uppercase tracking-widest text-ink-soft">
                      Visit type
                    </label>
                    <select
                      id="type"
                      className="w-full bg-transparent border-b border-teal/30 py-3 text-ink focus:outline-none focus:border-teal transition-colors appearance-none rounded-none"
                    >
                      <option value="bridal">Bridal Consultation</option>
                      <option value="custom">Custom Weaving Query</option>
                      <option value="viewing">General Viewing</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="location" className="block text-xs uppercase tracking-widest text-ink-soft">
                      Location
                    </label>
                    <select
                      id="location"
                      className="w-full bg-transparent border-b border-teal/30 py-3 text-ink focus:outline-none focus:border-teal transition-colors appearance-none rounded-none"
                    >
                      <option value="atelier">Pondicherry Atelier</option>
                      <option value="virtual">Virtual</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="notes" className="block text-xs uppercase tracking-widest text-ink-soft">
                      Notes (optional)
                    </label>
                    <textarea
                      id="notes"
                      rows={3}
                      className="w-full bg-transparent border-b border-teal/30 py-3 text-ink focus:outline-none focus:border-teal transition-colors resize-none placeholder:text-ink-soft/30"
                      placeholder="Optional notes"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full border border-teal text-teal py-4 text-sm tracking-widest uppercase hover:bg-teal hover:text-jasmine transition-colors disabled:opacity-50"
                  >
                    {status === "submitting" ? "Sending..." : "Request appointment"}
                  </button>
                </form>
              )}
            </div>
          </section>
        </div>
      </main>
    </PageLayout>
  );
};

export default Appointments;
