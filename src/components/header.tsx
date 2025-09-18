import Image from 'next/image';

export default function Header() {
  return (
    <header className="py-8 flex justify-center">
      <a href="https://goldpizzarias.com.br" target="_blank" rel="noopener noreferrer">
        <Image
          src="https://i.imgur.com/UBxesF1.png"
          alt="Logo Gold Pizzarias"
          width={300}
          height={75}
        />
      </a>
    </header>
  );
}
