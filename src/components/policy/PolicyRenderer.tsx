import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Link } from "react-router-dom";
import type { PolicyDocumentPayload } from "@/types/siteSections";

interface PolicyRendererProps {
  policy: PolicyDocumentPayload;
  isPreview?: boolean;
}

/**
 * Safely parses policy paragraph text, converting internal routes and email addresses
 * into styled links without raw HTML injection.
 */
function renderFormattedText(text: string): React.ReactNode {
  // Regex splitting on emails, relative links (/path), or bold text
  const parts = text.split(/(houseofpadmavati@gmail\.com|\/(?:shipping-policy|returns-policy|privacy-policy|terms-of-service))/g);

  return parts.map((part, idx) => {
    if (part === "houseofpadmavati@gmail.com") {
      return (
        <a
          key={idx}
          href="mailto:houseofpadmavati@gmail.com"
          className="text-signature-crimson hover:text-ink underline underline-offset-4 decoration-1 font-normal"
        >
          {part}
        </a>
      );
    }
    if (part.startsWith("/")) {
      return (
        <Link
          key={idx}
          to={part}
          className="text-signature-crimson hover:text-ink underline underline-offset-4 decoration-1 font-normal"
        >
          {part}
        </Link>
      );
    }
    return part;
  });
}

function renderSectionContent(content: string, sectionTitle: string) {
  // Check if this is the returns eligibility section to render the standard table
  const isReturnsEligibility =
    sectionTitle.toLowerCase().includes("return and replacement eligibility") ||
    content.includes("1 – 3 products per order");

  if (isReturnsEligibility) {
    return (
      <div className="space-y-4">
        <p>
          Return and replacement eligibility depends on the number of products in your order. The eligibility window is calculated from the date of delivery.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink-soft/20">
                <th className="text-left py-2 pr-4 font-serif text-ink">Order Size</th>
                <th className="text-left py-2 pr-4 font-serif text-ink">Eligibility Window</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-ink-soft/10">
                <td className="py-2 pr-4">1 – 3 products per order</td>
                <td className="py-2 pr-4">3 calendar days from delivery</td>
              </tr>
              <tr className="border-b border-ink-soft/10">
                <td className="py-2 pr-4">More than 3 products per order</td>
                <td className="py-2 pr-4">7 calendar days from delivery</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">Requests submitted after the eligibility window will not be accepted.</p>
      </div>
    );
  }

  const paragraphs = content.split(/\n\n+/);

  return (
    <div className="space-y-4">
      {paragraphs.map((para, pIdx) => {
        const lines = para.split("\n").map((l) => l.trim()).filter(Boolean);

        // Check if paragraph is a bullet list (lines start with •, -, or *)
        const isBulletList = lines.length > 1 && lines.every((l) => /^([•\-*])\s/.test(l));
        if (isBulletList) {
          return (
            <ul key={pIdx} className="list-disc list-inside space-y-2 mt-2">
              {lines.map((line, lIdx) => (
                <li key={lIdx}>{renderFormattedText(line.replace(/^[•\-*]\s*/, ""))}</li>
              ))}
            </ul>
          );
        }

        // Check if paragraph is a numbered list (lines start with 1., 2., etc.)
        const isNumberedList = lines.length > 1 && lines.every((l) => /^\d+\.\s/.test(l));
        if (isNumberedList) {
          return (
            <ol key={pIdx} className="list-decimal list-inside space-y-2 mt-2">
              {lines.map((line, lIdx) => (
                <li key={lIdx}>{renderFormattedText(line.replace(/^\d+\.\s*/, ""))}</li>
              ))}
            </ol>
          );
        }

        // Single paragraph with potential single line breaks
        return (
          <p key={pIdx} className="leading-relaxed">
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {renderFormattedText(line)}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export const PolicyRenderer: React.FC<PolicyRendererProps> = ({ policy, isPreview }) => {
  return (
    <PageLayout>
      <main>
        <div className="hop-page__room hop-page__section max-w-3xl">
          {isPreview && (
            <div className="mb-6 bg-rasa-mulberry/10 border border-rasa-mulberry/30 px-3 py-1.5 text-xs text-rasa-mulberry font-mono rounded text-center">
              Previewing Unapproved Studio Draft
            </div>
          )}

          <header className="mb-12 text-center">
            <h1 className="hop-page__title hop-page__title--small">{policy.title}</h1>
            <p className="text-sm text-ink-soft">Last updated · {policy.last_updated}</p>
          </header>

          <div className="space-y-10 text-ink-soft font-light leading-relaxed">
            {policy.sections.map((section) => (
              <section key={section.id}>
                <h2 className="font-serif text-2xl text-ink mb-3">{section.title}</h2>
                {renderSectionContent(section.content, section.title)}
              </section>
            ))}
          </div>
        </div>
      </main>
    </PageLayout>
  );
};
