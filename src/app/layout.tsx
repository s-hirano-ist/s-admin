import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppProvider from "@/components/app-provider";
import { Toaster } from "@/components/ui/toaster";
import type { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "%s | Dump",
	description: "Dump blog data to GitHub",
};

export default function RootLayout({
	children,
}: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="ja">
			<body className={inter.className}>
				<AppProvider>
					<main className="flex min-h-screen flex-col items-center justify-between p-4">
						{children}
					</main>
					<Toaster />
				</AppProvider>
			</body>
		</html>
	);
}
