import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script
          strategy="beforeInteractive"
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          type="text/javascript"
          async
        />
         <div id="modal-root"></div>
      </body>
    </Html>
  );
}
