import { NavLink } from 'react-router-dom';

const aboutPages = [
  { name: 'Our Story', path: '/about' },
  { name: 'Saree Care', path: '/customer-care' },
];

const AboutSidebar = () => {
  return (
    <aside className="hidden md:block w-64 sticky top-32 h-fit px-6">
      <nav className="space-y-1">
        <h3 className="font-serif text-2xl text-ink mb-6">The House</h3>
        {aboutPages.map((page) => (
          <NavLink
            key={page.path}
            to={page.path}
            className={({ isActive }) =>
              `block py-2 text-sm font-light tracking-wide transition-all ${
                isActive
                  ? 'text-teal-deep underline decoration-1 underline-offset-4'
                  : 'text-ink-soft hover:text-teal'
              }`
            }
          >
            {page.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AboutSidebar;
