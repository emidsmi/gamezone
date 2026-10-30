import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: { default: "GameZone Brasil — Loja digital de games", template: "%s · GameZone Brasil" },
  description: "Compre jogos digitais, receba a chave de ativação na hora e baixe pela sua biblioteca.",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#14070a", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen">
        <a href="#conteudo" className="sr-only-focusable btn btn-primary left-4 top-2 z-50">Pular para o conteúdo</a>
        <Header />
        <main id="conteudo" tabIndex={-1}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
