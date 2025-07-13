import Link from 'next/link';

const Header = () => {
  return (
    <header className="w-full py-4 px-6 bg-white shadow-sm">
      <nav className="max-w-6xl mx-auto flex justify-between items-center">
        <Link aria-description='ballina' href="/" className="text-xl font-black text-indigo-600">
          ShprehPakenaqesine
        </Link>
        <div className="flex gap-8">
          <Link aria-description='si funksjonon' href="/si-funksjonon" className="font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            Si funksjonon
          </Link>
          <Link aria-description='cmimore' href="/cmimore" className="font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            Cmimore
          </Link>
          <Link aria-description='verifikimi' href="/verifikimi" className="font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            Verifikimi
          </Link>
          <Link aria-description='na kontaktoni' href="/na-kontaktoni" className="font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            Na kontaktoni
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;