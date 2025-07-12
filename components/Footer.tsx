const Footer = () => {
    return (
      <footer className="bg-white py-8 px-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600">
            © {new Date().getFullYear()} YourApp. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="/privacy" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Terms of Service
            </a>
            <a href="/contact" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;