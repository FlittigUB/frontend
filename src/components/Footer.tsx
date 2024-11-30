"use client";

import React from "react";
import Link from "next/link";
import {FaInstagram, FaTiktok} from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-background border-t border-border py-6">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-center md:text-left text-foreground">
                    &copy; {new Date().getFullYear()} Flittig UB. Alle rettigheter reservert.
                </p>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <Link href="/info/personvern" className="text-sm text-foreground hover:underline">
                        Personvern
                    </Link>
                    <Link href="/info/cookies" className="text-sm text-foreground hover:underline">
                        Cookies
                    </Link>
                    <Link href="/info/vilkar" className="text-sm text-foreground hover:underline">
                        Vilkår
                    </Link>
                    <Link href="/info/retur" className="text-sm text-foreground hover:underline">
                        Retur
                    </Link>
                    <Link href="/info/frakt" className="text-sm text-foreground hover:underline">
                        Frakt
                    </Link>
                    <Link href="/info/kontakt" className="text-sm text-foreground hover:underline">
                        Kontakt Oss
                    </Link>
                    <a href="https://tiktok.com/@isora.no" target="_blank" rel="noopener noreferrer">
                        <FaTiktok className="text-xl text-foreground hover:text-accent transition" />
                    </a>
                    <a href="https://instagram.com/isora.no" target="_blank" rel="noopener noreferrer">
                        <FaInstagram className="text-xl text-foreground hover:text-accent transition" />
                    </a>
                </div>
            </div>
        </footer>
    );
}
