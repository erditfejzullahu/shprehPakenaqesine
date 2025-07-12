import Link from 'next/link';

const Header = () => {
  return (
    <header className="w-full py-4 px-6 bg-white shadow-sm">
      <nav className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-black text-indigo-600">
          ShprehPakenaqesine
        </Link>
        <div className="flex gap-8">
          <Link href="/features" className="font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            Si funksjonon
          </Link>
          <Link href="/pricing" className="font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            Cmimore
          </Link>
          <Link href="/about" className="font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            Rreth nesh
          </Link>
          <Link href="/contact" className="font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            Na kontaktoni
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;