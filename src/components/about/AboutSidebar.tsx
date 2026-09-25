import { NavLink } from 'react-router-dom';

const aboutPages = [
  { name: 'Our Story', path: '/about' },
  { name: 'Saree Care', path: '/customer-care' },
];

const AboutSidebar = () => {
  return (
    <aside className="hop-page__side-nav sticky top-32 h-fit">
      <nav className="space-y-1">
        <h3 className="hop-page__side-nav-title mb-6">The House</h3>
        {aboutPages.map((page) => (
          <NavLink
            key={page.path}
            to={page.path}
            className={({ isActive }) =>
              `hop-page__side-nav-link ${isActive ? 'is-active' : ''}`
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
