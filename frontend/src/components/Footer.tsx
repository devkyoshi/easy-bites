export const Footer = () => {
  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6">
          {/* Copyright text */}
          <p className="text-sm text-gray-400 text-center md:text-left">
            &copy; {new Date().getFullYear()} EasyBites. Y3S2.SE.WE.Group 04.{" "}
            <br className="md:hidden" />
            All rights reserved.
          </p>

          {/* Links */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors duration-300 text-sm font-medium"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors duration-300 text-sm font-medium"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors duration-300 text-sm font-medium"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
