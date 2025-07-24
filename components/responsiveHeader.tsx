// components/ResponsiveHeader.tsx
'use client';

import { Session } from 'next-auth';
import Link from 'next/link';
import { FaUser, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import { useState, useEffect, Children } from 'react';
import LogOut from './LogOut';

export default function ResponsiveHeader({ session }: { session: Session | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10);
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
      if (window.innerWidth > 900) setIsOpen(false);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if(isOpen){
        document.body.style.overflowY = "hidden"
    }else{
        document.body.style.overflowY = "auto"
    }
  }, [isOpen])
  

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = (
    <>
      <NavLink href="/si-funksjonon" text="Si funksjonon" delay={0.1} onClose={() => setIsOpen(false)}/>
      <NavLink href="/cmimore" text="Cmimore" delay={0.2} onClose={() => setIsOpen(false)}/>
      <NavLink href="/verifikimi" text="Verifikimi" delay={0.3} onClose={() => setIsOpen(false)}/>
      <NavLink href="/na-kontaktoni" text="Na kontaktoni" delay={0.4} onClose={() => setIsOpen(false)}/>
      {isMobile && (
        <>
        <div className='text-center flex flex-col gap-3'>
          <NavLink href="/kompanite" text="Kompanitë" delay={0.4} onClose={() => setIsOpen(false)}/>
          <NavLink href="/ankesat" text="Ankesat" delay={0.4} onClose={() => setIsOpen(false)}/>
        </div>
        </>
      )}
      {session ? (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className={`flex ${isMobile ? "flex-col items-start" : "flex-row"} gap-3 items-center`}
        >
            {isMobile ? (
                <div>
                    <NavLink href="/profili" text="Profili" delay={0.4} onClose={() => setIsOpen(false)}/>
                </div>
            ) : (
                <Link href="/profili" className="hover:scale-110 transition-transform">
                    <FaUser size={24} color="#4f46e5" />
                </Link>
            )}
            {isMobile ? (
                <div onClick={() => setIsOpen(false)} className='mx-auto'>
                    <LogOut />
                </div>
            ) : (
                <LogOut />
            )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/kycuni" onClick={() => setIsOpen(false)} className="hover:scale-110 transition-transform">
            <FaUser size={24} color="#4f46e5" />
          </Link>
        </motion.div>
      )}
    </>
  );

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`w-full py-4 px-4 fixed top-0 z-50 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-white'
      }`}
    >
      <nav className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-black text-indigo-600 hover:scale-105 transition-transform">
          <motion.span 
            whileHover={{ rotateY: 15 }} 
            className="inline-block"
          >
            ShprehPakënaqësinë
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && <div className="flex gap-8 items-center">{navLinks}</div>}

        {/* Mobile Hamburger Button */}
        {isMobile && (
          <motion.button
            onClick={toggleMenu}
            whileTap={{ scale: 0.9 }}
            className="relative z-60 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg"
            aria-label="Toggle menu"
          >
            <motion.div
              initial={false}
              animate={isOpen ? "open" : "closed"}
              variants={{
                open: { rotate: 180 },
                closed: { rotate: 0 }
              }}
              transition={{ duration: 0.5 }}
              className={`${isOpen ? "w-4 h-4" : "w-3 h-3"} relative`}
            >
              <motion.span
                className="absolute block w-full h-0.5 bg-white rounded-full"
                variants={{
                  closed: { top: '0%', rotate: 0 },
                  open: { top: '50%', rotate: 45 }
                }}
              />
              <motion.span
                className="absolute block w-full h-0.5 bg-white rounded-full"
                variants={{
                  closed: { top: '50%', opacity: 1 },
                  open: { top: '50%', opacity: 0 }
                }}
              />
              <motion.span
                className="absolute block w-full h-0.5 bg-white rounded-full"
                variants={{
                  closed: { top: '100%', rotate: 0 },
                  open: { top: '50%', rotate: -45 }
                }}
              />
            </motion.div>
          </motion.button>
        )}
      </nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/20 z-40 h-screen backdrop-blur-sm min-h-full"
              onClick={toggleMenu}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 overflow-y-auto right-0 w-4/5 h-screen max-w-md bg-white shadow-2xl z-50 p-8"
            >
              <div className="h-full flex flex-col justify-between">
                <div>

                <div className='my-4 mx-auto text-center'>
                    <Link href="/" className="sm:text-xl text-center text-lg font-black text-indigo-600 hover:scale-105 transition-transform">
                        <motion.span 
                            whileHover={{ rotateY: 15 }} 
                            className="inline-block"
                        >
                            ShprehPakënaqësinë
                        </motion.span>
                    </Link>
                </div>

                  <motion.div 
                    className="flex flex-col gap-3 mt-6 items-center text-2xl font-medium"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                  >
                    {Children.map(navLinks.props.children, (child, index) => (
                      <motion.div
                        key={index}
                        variants={{
                          hidden: { x: 50, opacity: 0 },
                          visible: { 
                            x: 0, 
                            opacity: 1,
                            transition: { type: 'spring', stiffness: 100 }
                          }
                        }}
                      >
                        {child}
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-500 text-sm mt-4 max-[331px]:text-center mx-auto pb-2"
                >
                  © {new Date().getFullYear()} <Link onClick={() => setIsOpen(false)} href={"/"} className='text-indigo-600'>ShprehPakënaqësinë</Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// Enhanced NavLink component with 3D tilt effect
function NavLink({ href, text, delay = 0, onClose }: { href: string; text: string; delay?: number, onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        onClick={onClose}
        href={href}
        className="relative font-medium text-gray-600 text-lg max-[350px]:text-base hover:text-indigo-600 transition-colors group"
      >
        <motion.span 
          className="block relative z-10  py-1"
          whileHover={{ 
            transformPerspective: 1000,
            rotateY: 5,
            x: 5
          }}
        >
          {text}
        </motion.span>
        <motion.div
          className="absolute bottom-0 left-0 w-full h-1 bg-indigo-100 rounded-full origin-left"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        />
      </Link>
    </motion.div>
  );
}