import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebookF,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <div className="bg-gray-800 text-white p-6 ">
      <div className="container mx-auto">
        <div className="flex justify-between items-start mb-6 mt-60">
          {/* Contact Information */}
          <div className="w-1/3">
            <h3 className="font-bold text-xl mb-2">Contact Information</h3>
            <p>
              <span className="font-bold">Address:</span> 123 Street, City,
              Country
            </p>
            <p>
              <span className="font-bold">Phone:</span> +123 456 7890
            </p>
            <p>
              <span className="font-bold">Email:</span> example@company.com
            </p>
          </div>

          {/* Useful Links */}
<div className="w-1/3">
  <h3 className="font-bold text-xl mb-2">Quick Links</h3>
  <ul className="space-y-2">
    <li>
      <button className="hover:underline bg-transparent border-none cursor-pointer p-0 text-white">
        About Us
      </button>
    </li>
    <li>
      <button className="hover:underline bg-transparent border-none cursor-pointer p-0 text-white">
        Services
      </button>
    </li>
    <li>
      <button className="hover:underline bg-transparent border-none cursor-pointer p-0 text-white">
        FAQs
      </button>
    </li>
    <li>
      <button className="hover:underline bg-transparent border-none cursor-pointer p-0 text-white">
        Privacy Policy
      </button>
    </li>
  </ul>
</div>

<div className="w-1/3">
  <h3 className="font-bold text-xl mb-2">Other Links</h3>
  <ul className="space-y-2">
    <li>
      <button className="hover:underline bg-transparent border-none cursor-pointer p-0 text-white">
        Security Partners
      </button>
    </li>
    <li>
      <button className="hover:underline bg-transparent border-none cursor-pointer p-0 text-white">
        Medical Donors
      </button>
    </li>
    <li>
      <button className="hover:underline bg-transparent border-none cursor-pointer p-0 text-white">
        Sponsors
      </button>
    </li>
    <li>
      <button className="hover:underline bg-transparent border-none cursor-pointer p-0 text-white">
        Careers
      </button>
    </li>
    <li>
      <button className="hover:underline bg-transparent border-none cursor-pointer p-0 text-white">
        Board Members Information
      </button>
    </li>
  </ul>
</div>

          {/* Social Media Icons */}
          <div className="w-1/3 flex justify-end items-center">
            <a
              href="https://instagram.com/company"
              className="mr-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </a>
            <a
              href="https://facebook.com/company"
              className="mr-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faFacebookF} size="2x" />
            </a>
            <a
              href="https://linkedin.com/company"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faLinkedinIn} size="2x" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
