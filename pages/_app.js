import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { adConfig } from '../data/monetization';
import Script from 'next/script';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      {adConfig.enabled && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adConfig.publisherId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
      <Component {...pageProps} />
    </AuthProvider>
  );
}
