import Image from 'next/image';
import Link from 'next/link';

export default function Header(){
  return (
    <header className="header">
      <div className="container nav">
        <Link href="/" className="logo" aria-label="Aliwvide Home">
          <Image src="/logo.png" alt="Aliwvide Compass Logo" width={240} height={80} priority />
        </Link>
        <nav className="links">
          <Link href="/#countries">Countries</Link>
          <Link href="/#categories">Categories</Link>
          <Link href="/#faq">FAQ</Link>
        </nav>
      </div>
    </header>
  );
}
