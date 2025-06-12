import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFooter(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!showFooter) return null;

  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gray-900 text-white py-16 px-4 md:px-8"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {/* Logo & Brand */}
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Alpha-Task
          </h2>
          <p className="text-gray-400 mt-4 text-sm">
            Empowering learners worldwide with top-notch courses and resources.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-purple-300">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-300">
          <li><Link to="/" className="hover:text-white transition">Home</Link></li> 
            <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
          </ul>
        </div>
        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-purple-300">Follow Us</h3>
          <div className="flex space-x-4">
            {[ 
              { Icon: FaFacebookF, color: 'hover:text-blue-500', href: 'https://facebook.com' },
              { Icon: FaTwitter, color: 'hover:text-blue-400', href: 'https://twitter.com' },
              { Icon: FaLinkedinIn, color: 'hover:text-blue-600', href: 'https://linkedin.com' },
              { Icon: FaInstagram, color: 'hover:text-pink-500', href: 'https://instagram.com' }
            ].map(({ Icon, color, href }, idx) => (
              <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-gray-400 text-xl transition transform hover:scale-110 ${color}`}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm"
      >
        &copy; {new Date().getFullYear()} YourBrand. All rights reserved.
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
