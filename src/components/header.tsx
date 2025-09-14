import Image from 'next/image';

export default function Header() {
  return (
    <header className="py-8">
      <div className="flex flex-col items-center text-center">
        <Image 
          src="/gold-assessoria-logo.png" 
          alt="Gold Assessoria Logo" 
          width={100} 
          height={100} 
          className="mb-2"
          data-ai-hint="gold coin"
        />
        <h1 className="text-2xl font-bold text-yellow-500">Gold Assessoria</h1>
        <p className="text-sm text-gray-400">Marketing para pizzarias</p>
      </div>
    </header>
  );
}
