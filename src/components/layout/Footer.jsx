import { Link } from 'react-router-dom';

const FOOTER_COLUMNS = [
  [
    'Audio Description',
    'Help Centre',
    'Gift Cards',
    'Media Centre',
  ],
  [
    'Investor Relations',
    'Jobs',
    'Terms of Use',
    'Privacy',
  ],
  [
    'Legal Notices',
    'Cookie Preferences',
    'Corporate Information',
    'Contact Us',
  ],
  [
    'Speed Test',
    'Ad Choices',
    'Accessibility',
    'Only on NetHero',
  ],
];

export const Footer = () => {
  return (
    <footer
      role="contentinfo"
      className="bg-nethero-bg text-nethero-gray px-4 sm:px-8 lg:px-16 py-12 mt-auto"
    >
      <div className="max-w-5xl">
        {/* Questions line */}
        <p className="text-nethero-grayLight mb-6 text-sm">
          Questions? Call{' '}
          <a href="tel:1-844-505-2993" className="underline hover:text-nethero-white transition-colors">
            1-844-505-2993
          </a>
        </p>

        {/* 4-column link grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-3 mb-8">
          {FOOTER_COLUMNS.flat().map((item) => (
            <button
              key={item}
              type="button"
              className="text-xs text-nethero-gray hover:text-nethero-grayLight transition-colors text-left focus-visible:outline-none focus-visible:underline"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Service code button */}
        <button
          type="button"
          aria-label="Enter service code"
          className="border border-nethero-gray text-nethero-gray text-sm px-4 py-2 mb-6 hover:border-nethero-grayLight hover:text-nethero-grayLight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nethero-white"
        >
          Service Code
        </button>

        {/* Copyright */}
        <p className="text-xs text-nethero-gray">
          © {new Date().getFullYear()} NetHero Clone — Educational Project
        </p>
      </div>
    </footer>
  );
};

export default Footer;
