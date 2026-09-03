import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BIG BIKE RENTAL MANAGEMENT SYSTEM | ศูนย์บริการเช่าบิ๊กไบค์พรีเมียม',
  description: 'ระบบจัดการเช่ารถจักรยานยนต์บิ๊กไบค์ระดับพรีเมียม Ducati, BMW, Yamaha, Kawasaki พร้อมระบบจอง ชำระเงิน สัญญาดิจิทัล และ GPS Tracking',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="scroll-smooth">
      <body className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
