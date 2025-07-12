import Link from "next/link";

const Footer = () => {
    return (
      <footer className="bg-white py-8 px-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href={"/"} aria-describedby="homepage" className="text-gray-600">
            © {new Date().getFullYear()} <span className="text-indigo-600 font-semibold">ShprehePakenaqesine</span>. Te gjitha te drejtat e reservuara.
          </Link>
          <div className="flex gap-6">
            <a href="/politika-e-privatesise" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Politika e Privatesise
            </a>
            <a href="/termat-e-perdorimit" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Termat e Perdorimit
            </a>
            <a href="/na-kontaktoni" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Na kontaktoni
            </a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;