import Link from "next/link";

const Footer = () => {
    return (
      <footer className="bg-white py-8 px-6 border-gray-200">
        <div className="max-w-6xl mx-auto flex max-[1050]:flex-col flex-row justify-between items-center gap-4">
          <Link href={"/"} aria-description="homepage" className="text-gray-600 max-[575px]:text-center">
            © {new Date().getFullYear()} <span className="text-indigo-600 font-semibold">ShprehePakënaqësinë</span>. Të gjitha të drejtat e reservuara.
          </Link>
          <div className="flex flex-wrap gap-6 max-[530px]:justify-center">
            <a href="/politika-e-privatesise" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Politika e Privatësisë
            </a>
            <a href="/termat-e-perdorimit" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Termat e Përdorimit
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