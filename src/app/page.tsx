import Calculator from '@/components/calculator';
import Header from '@/components/header';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-background p-4 font-body text-foreground antialiased">
      <Header />
      <main className="flex w-full flex-1 flex-col items-center justify-center">
        <Calculator />
      </main>
    </div>
  );
}
