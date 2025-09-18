import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Script from 'next/script';
import { Montserrat } from 'next/font/google';
import GoogleAnalytics from '@/components/google-analytics';

export const metadata: Metadata = {
  title: 'Calculadora Gold',
  description: 'Calculadora de preços para iFood',
};

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${montserrat.variable}`}>
      <head>
        {/* Meta Pixel Code */}
        <Script id="meta-pixel-script" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1390088832135868');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img height="1" width="1" style={{display: 'none'}}
            src="https://www.facebook.com/tr?id=1390088832135868&ev=PageView&noscript=1"
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className="font-body antialiased">
        <GoogleAnalytics measurementId="G-9ELHK2G8N6" />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
