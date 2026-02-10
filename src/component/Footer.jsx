import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
       return (
              <footer className="bg-linear-to-r from-green-500 via-green-400 to-orange-500 text-white">
                     <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

                            <div>
                                   <Image
                                          src="/grozo.png"
                                          alt="Grozo Logo"
                                          width={140}
                                          height={80}
                                          className="mb-3"
                                   />
                                   <p className="text-sm text-white/90 leading-relaxed">
                                          Grozo is your trusted grocery delivery platform.
                                          Fresh products, fast delivery, and best prices at your doorstep.
                                   </p>
                            </div>

                            <div>
                                   <h3 className="text-md font-bold mb-3">Quick Links</h3>
                                   <ul className="space-y-2 text-sm">
                                          <li>
                                                 <Link href="/" className="hover:underline hover:text-gray-100">
                                                        Home
                                                 </Link>
                                          </li>
                                          <li>
                                                 <Link href="/user/myOrder" className="hover:underline hover:text-gray-100">
                                                        My Orders
                                                 </Link>
                                          </li>
                                          <li>
                                                 <Link href="/user/cart" className="hover:underline hover:text-gray-100">
                                                        Cart
                                                 </Link>
                                          </li>
                                          <li>
                                                 <Link href="/contact" className="hover:underline hover:text-gray-100">
                                                        Contact Us
                                                 </Link>
                                          </li>
                                   </ul>
                            </div>

                            <div>
                                   <h3 className="text-md font-bold mb-3">Contact</h3>
                                   <p className="text-sm">📍 India</p>
                                   <p className="text-sm">📞 +91 0000000000</p>
                                   <p className="text-sm">✉️ support@grozo.com</p>
                            </div>
                     </div>

                     <div className="border-t border-white/30 text-center py-4 text-sm text-white/90">
                            © {new Date().getFullYear()} Grozo. All rights reserved.
                     </div>
              </footer>
       );
};

export default Footer;

