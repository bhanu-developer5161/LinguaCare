
import "./globals.css";

export const metadata = {
  title: "LinguaCare | Bilingual Educators & Au Pairs",
  description:
    "Connect with bilingual governesses and au pairs who bring language, culture, and learning into everyday family life.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}