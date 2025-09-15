import Image from 'next/image';

export default function Header() {
  return (
    <header className="py-8 flex justify-center">
      <Image
        src="https://i.imgur.com/UBxesF1.png"
        alt="Calculadora Gold Logo"
        width={200}
        height={50}
        priority
      />
    </header>
  );
}
