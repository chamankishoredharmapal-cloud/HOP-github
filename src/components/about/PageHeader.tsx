interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  return (
    <header className="hop-page__header pr-6">
      <h1 className="mb-4">
        {title}
      </h1>
      {subtitle && (
        <p>
          {subtitle}
        </p>
      )}
    </header>
  );
};

export default PageHeader;