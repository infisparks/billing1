import Script from "next/script";

import Footer from "@/components/Footer";
import ScrollTop from "@/components/ScrollTop";

import Preloader from "@/components/Preloader";
import { Poppins } from "next/font/google";

// Bootstrap CSS
import "../../public/css/bootstrap.min.css";

// Fontawesome CSS
import "../../public/css/font-awesome.min.css";

// Icofont CSS
import "../../public/css/icofont.css";

// Animate CSS
import "animate.css";

// Swiper CSS
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

// Modal Video CSS
import "react-modal-video/css/modal-video.min.css";

// Global CSS
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Mediplus - Medical and Doctor Next.js Template.",
  description: "Mediplus - Medical and Doctor Next.js Template.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <>
          <Preloader />
         
          {children}
         
          <Footer />
          <ScrollTop />
          <Script src="/js/bootstrap.min.js"></Script>
        </>
      </body>
    </html>
  );
}
