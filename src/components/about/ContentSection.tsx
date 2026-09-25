interface ContentSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const ContentSection = ({ title, children, className = "" }: ContentSectionProps) => {
  return (
    <section className={`hop-page__content pr-6 ${className}`}>
      {title && (
        <h2 className="hop-page__panel-heading mb-8">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
};

export default ContentSection;