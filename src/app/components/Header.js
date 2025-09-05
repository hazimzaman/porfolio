"use client";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header>
      <section className="header">
        <div className="header__inner">
          <div className="header__logo">
            <Link href="/">
              <Image src="/logo.png" alt="logo" width={196} height={65} />
            </Link>
          </div>
          <div className="header__cta-btn-wrapper">
            <button className="btn-primary">Get Scalable Sites</button>
          </div>
        </div>
      </section>
    </header>
  );
}
