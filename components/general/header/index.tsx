"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";
import menuData from "./menu-data";
import ThemeToggler from "./theme-toggler";

// Define types for menu items
interface SubMenuItem {
    title: string;
    path: string;
}

interface MenuItem {
    title: string;
    path?: string;
    submenu?: SubMenuItem[];
}

const Header = () => {
    // Navbar toggle
    const [navbarOpen, setNavbarOpen] = useState(false);
    const navbarToggleHandler = () => {
        setNavbarOpen(!navbarOpen);
    };

    // Sticky Navbar
    const [sticky, setSticky] = useState(false);
    const handleStickyNavbar = () => {
        if (window.scrollY >= 80) {
            setSticky(true);
        } else {
            setSticky(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleStickyNavbar);
        return () => {
            window.removeEventListener("scroll", handleStickyNavbar);
        };
    }, []);

    // submenu handler
    const [openIndex, setOpenIndex] = useState(-1);
    const handleSubmenu = (index: SetStateAction<number>) => {
        if (openIndex === index) {
            setOpenIndex(-1);
        } else {
            setOpenIndex(index);
        }
    };

    const pathname = usePathname();

    return (
        <>
            <header
                className={`header left-0 top-0 z-40 flex w-full items-center ${sticky
                        ? "fixed z-9999 bg-white/80 shadow-lg backdrop-blur-sm transition dark:bg-neutral-900/80 dark:shadow-neutral-800"
                        : "absolute bg-transparent"
                    }`}
            >
                <div className="container mx-auto">
                    <div className="relative -mx-4 flex items-center justify-between">
                        <div className="w-60 max-w-full px-4 xl:mr-12">
                            <Link
                                href="/"
                                className={`header-logo block w-full ${sticky ? "py-5 lg:py-2" : "py-8"
                                    }`}
                            >
                                <h1 className="text-2xl font-extrabold">FireSMS</h1>
                            </Link>
                        </div>
                        <div className="flex w-full items-center justify-between px-4">
                            <div>
                                <button
                                    onClick={navbarToggleHandler}
                                    id="navbarToggler"
                                    aria-label="Mobile Menu"
                                    className="absolute right-4 top-1/2 block translate-y-[-50%] rounded-lg px-3 py-1.5 ring-blue-500 focus:ring-2 lg:hidden"
                                >
                                    <span
                                        className={`relative my-1.5 block h-0.5 w-7.5 bg-neutral-900 transition-all duration-300 dark:bg-white ${navbarOpen ? "top-1.75 rotate-45" : ""
                                            }`}
                                    />
                                    <span
                                        className={`relative my-1.5 block h-0.5 w-7.5 bg-neutral-900 transition-all duration-300 dark:bg-white ${navbarOpen ? "opacity-0" : ""
                                            }`}
                                    />
                                    <span
                                        className={`relative my-1.5 block h-0.5 w-7.5 bg-neutral-900 transition-all duration-300 dark:bg-white ${navbarOpen ? "-top-2 -rotate-45" : ""
                                            }`}
                                    />
                                </button>
                                <nav
                                    id="navbarCollapse"
                                    className={`navbar absolute right-0 z-30 w-62.5 rounded border-[0.5px] border-neutral-300 bg-white dark:bg-neutral-900 px-6 py-4 duration-300 dark:border-neutral-700 ${navbarOpen
                                            ? "visible top-full opacity-100"
                                            : "invisible top-[120%] opacity-0"
                                        } lg:visible lg:static lg:w-auto lg:border-none lg:bg-transparent lg:p-0 lg:opacity-100 dark:lg:bg-transparent`}
                                >
                                    <ul className="block lg:flex lg:space-x-12">
                                        {(menuData as MenuItem[]).map((menuItem, index) => (
                                            <li key={index} className="group relative">
                                                {menuItem.path ? (
                                                    <Link
                                                        href={menuItem.path}
                                                        className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${pathname === menuItem.path
                                                                ? "text-blue-600 dark:text-blue-400"
                                                                : "text-neutral-900 hover:text-blue-600 dark:text-neutral-300 dark:hover:text-blue-400"
                                                            }`}
                                                    >
                                                        {menuItem.title}
                                                    </Link>
                                                ) : (
                                                    <>
                                                        <p
                                                            onClick={() => handleSubmenu(index)}
                                                            className="flex cursor-pointer items-center justify-between py-2 text-base text-neutral-900 group-hover:text-blue-600 lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 dark:text-neutral-300 dark:group-hover:text-blue-400"
                                                        >
                                                            {menuItem.title}
                                                            <span className="pl-3">
                                                                <svg width="25" height="24" viewBox="0 0 25 24">
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        clipRule="evenodd"
                                                                        d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                                                                        fill="currentColor"
                                                                    />
                                                                </svg>
                                                            </span>
                                                        </p>
                                                        <div
                                                            className={`submenu absolute left-0 top-full hidden w-62.5 rounded-sm bg-white p-4 shadow-lg transition-[top] duration-300 group-hover:block dark:bg-neutral-900 lg:w-62.5 ${openIndex === index ? "block" : "hidden"
                                                                } lg:invisible lg:block lg:opacity-0 lg:group-hover:visible lg:group-hover:top-full lg:group-hover:opacity-100`}
                                                        >
                                                            {menuItem.submenu?.map((submenuItem, index) => (
                                                                <Link
                                                                    href={submenuItem.path}
                                                                    key={index}
                                                                    className="block rounded-sm py-2.5 text-sm text-neutral-900 hover:text-blue-600 dark:text-neutral-300 dark:hover:text-blue-400 lg:px-3"
                                                                >
                                                                    {submenuItem.title}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </li>
                                        ))}

                                        {/* Mobile Menu Auth Links */}
                                        <li className="block lg:hidden mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                                            <div className="flex flex-col space-y-3">
                                                <Link
                                                    href="/auth/sign-in"
                                                    className="flex py-2 text-base text-neutral-900 hover:text-blue-600 dark:text-neutral-300 dark:hover:text-blue-400"
                                                    onClick={() => setNavbarOpen(false)}
                                                >
                                                    Sign In
                                                </Link>
                                                <Link
                                                    href="/auth/sign-up"
                                                    className="flex py-2 text-base text-neutral-900 hover:text-blue-600 dark:text-neutral-300 dark:hover:text-blue-400"
                                                    onClick={() => setNavbarOpen(false)}
                                                >
                                                    Sign Up
                                                </Link>
                                                <div className="flex items-center py-2">
                                                    <span className="text-base text-neutral-900 dark:text-neutral-300 mr-3">Theme:</span>
                                                    <ThemeToggler />
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                            <div className="hidden lg:flex items-center justify-end mx-16 lg:pr-0">
                                <Link
                                    href="/auth/sign-in"
                                    className="px-7 py-3 text-base font-medium text-white hover:opacity-70 bg-blue-600 mx-4 rounded-2xl"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/sign-up"
                                    className="rounded-2xl border-blue-600 border-2 px-8 py-3 text-base font-medium text-white shadow-lg transition duration-300 ease-in-out hover:bg-blue-600/90 hover:shadow-xl md:px-9 lg:px-6 xl:px-9"
                                >
                                    Sign Up
                                </Link>
                                <div>
                                    <ThemeToggler />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;