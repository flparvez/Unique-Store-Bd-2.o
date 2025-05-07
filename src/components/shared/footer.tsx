import Link from 'next/link';
import { Facebook } from 'lucide-react';
const Footer = () => {
  return (


<footer className="bg-gray-900 text-white p-6 md:p-10">

   
      <div className="container mx-auto text-center px-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Unique Store BD | Quality Is Here</h2>
        <div className="flex justify-center items-center space-x-4 mb-2">
          <Link href="https://www.facebook.com/uniquestorebd23" passHref>
            <h2 className="text-gray-400 hover:text-white transition duration-300">
              <Facebook size={24} />
            </h2>
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-12">
          <Link href="/policy/returns" passHref>
            <h2 className=" text-white font-semibold  px-2 rounded transition duration-300">
              Return Policy
            </h2>
          </Link>
          <Link href="/policy/replacement-warranty" passHref>
            <h2 className=" text-white font-semibold  px-2 rounded transition duration-300">
              Replacement Warranty
            </h2>
          </Link>
          <Link href="/policy/after-sales-support" passHref>
            <h2 className=" text-white font-semibold rounded transition duration-300">
              After Sales Support
            </h2>
          </Link>
        </div>
        <p className="mt-2 text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Unique Store BD. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;