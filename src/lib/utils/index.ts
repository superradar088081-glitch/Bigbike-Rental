import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('th-TH').format(num);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'AVAILABLE':
    case 'CONFIRMED':
    case 'COMPLETED':
    case 'VERIFIED':
    case 'PAID':
      return {
        bg: 'bg-emerald-600 text-white border-emerald-500 font-bold shadow-sm',
        dot: 'bg-emerald-200',
        labelTh: status === 'AVAILABLE' ? 'พร้อมให้เช่า' :
                 status === 'CONFIRMED' ? 'อนุมัติแล้ว' :
                 status === 'COMPLETED' ? 'เสร็จสิ้น' :
                 status === 'VERIFIED' ? 'อนุมัติเอกสาร' : 'ชำระแล้ว'
      };
    case 'RENTED':
    case 'ACTIVE':
      return {
        bg: 'bg-blue-600 text-white border-blue-500 font-bold shadow-sm',
        dot: 'bg-blue-200',
        labelTh: status === 'RENTED' ? 'กำลังเช่าอยู่' : 'กำลังใช้งาน'
      };
    case 'RESERVED':
    case 'PENDING':
    case 'SCHEDULED':
      return {
        bg: 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-sm',
        dot: 'bg-slate-950',
        labelTh: status === 'RESERVED' ? 'จองแล้ว' :
                 status === 'PENDING' ? 'รอดำเนินการ' : 'นัดหมายแล้ว'
      };
    case 'MAINTENANCE':
    case 'IN_PROGRESS':
      return {
        bg: 'bg-orange-600 text-white border-orange-500 font-extrabold shadow-sm',
        dot: 'bg-orange-200',
        labelTh: 'กำลังซ่อมบำรุง'
      };
    case 'CANCELLED':
    case 'REJECTED':
    case 'FAILED':
    case 'INACTIVE':
      return {
        bg: 'bg-rose-600 text-white border-rose-500 font-bold shadow-sm',
        dot: 'bg-rose-200',
        labelTh: status === 'CANCELLED' ? 'ยกเลิก' :
                 status === 'REJECTED' ? 'ปฏิเสธ' :
                 status === 'FAILED' ? 'ล้มเหลว' : 'ปิดใช้งาน'
      };
    default:
      return {
        bg: 'bg-slate-800 text-white border-slate-700 font-bold shadow-sm',
        dot: 'bg-slate-400',
        labelTh: status
      };
  }
}
