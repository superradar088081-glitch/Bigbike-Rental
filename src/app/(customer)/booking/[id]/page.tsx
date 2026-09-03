'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { getPromptPayQrImageUrl } from '@/lib/utils/promptpay';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Award,
  Zap,
  ShieldCheck,
  CreditCard,
  QrCode,
  FileText,
  User,
  Phone,
  MapPin,
  Loader2,
} from 'lucide-react';

export default function BookingWizardPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Stepper State
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('สาขากรุงเทพฯ (สุขุมวิท 71)');
  const [returnLocation, setReturnLocation] = useState('สาขากรุงเทพฯ (สุขุมวิท 71)');
  const [notes, setNotes] = useState('');

  // Customer Info State (if not logged in)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [driverLicense, setDriverLicense] = useState('');

  // Membership & Points State
  const [usePoints, setUsePoints] = useState(0);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'PROMPTPAY' | 'CREDIT_CARD' | 'BANK_TRANSFER'>('PROMPTPAY');
  const [countdown, setCountdown] = useState(900); // 15 minutes
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateConflictError, setDateConflictError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/vehicles/${params.id}`).then((r) => r.json()),
      fetch('/api/auth/me').then((r) => r.json()),
    ])
      .then(([vData, uData]) => {
        setVehicle(vData.vehicle);
        if (uData.user) {
          setCurrentUser(uData.user);
          setCustomerName(uData.user.name);
          setCustomerPhone(uData.user.customer?.phone || '');
          setDriverLicense(uData.user.customer?.driverLicenseNumber || '');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [params.id]);

  // Payment countdown timer
  useEffect(() => {
    if (currentStep === 4 && countdown > 0) {
      const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [currentStep, countdown]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculations
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const days = calculateDays();
  const dailyPrice = vehicle?.rentalPricePerDay || 0;
  const deposit = vehicle?.depositAmount || 0;
  const rentalSubtotal = dailyPrice * days;

  // Tier Discount
  const tierDiscountPercent = currentUser?.customer?.membershipTier?.discountPercentage || 0;
  const tierDiscountAmount = (rentalSubtotal * tierDiscountPercent) / 100;

  // Points Discount (1 pt = 1 THB)
  const pointsDiscountAmount = usePoints;

  const totalPayable = rentalSubtotal - tierDiscountAmount - pointsDiscountAmount + deposit;

  const locationOptions = [
    'สาขากรุงเทพฯ (สุขุมวิท 71) - สำนักงานใหญ่',
    'สนามบินสุวรรณภูมิ (จุดรับ-ส่งพิเศษ ชั้น 2 ประตู 3)',
    'สนามบินดอนเมือง (จุดรับ-ส่งพิเศษ อาคาร 2)',
    'สถานีกลางกรุงเทพอภิวัฒน์ (บางซื่อ)',
    'บริการจัดส่งถึงโรงแรม / ที่พักในกรุงเทพฯ',
  ];

  // Step 1: Check date conflicts and advance
  const handleDatesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDateConflictError(null);

    if (!startDate || !endDate) {
      setDateConflictError('กรุณาเลือกวันรับรถและวันคืนรถ');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      setDateConflictError('วันรับรถต้องไม่เกินวันคืนรถ');
      return;
    }

    try {
      const res = await fetch(
        `/api/bookings/check?vehicleId=${vehicle.id}&startDate=${startDate}&endDate=${endDate}`
      );
      const data = await res.json();
      if (data.available === false || data.isAvailable === false) {
        setDateConflictError(data.message || 'รถคันนี้ถูกจองแล้วในช่วงเวลาดังกล่าว กรุณาเลือกช่วงเวลาอื่น');
        return;
      }
      setCurrentStep(2);
    } catch (err) {
      setCurrentStep(2);
    }
  };

  // Step 3 -> 4: Create booking in database
  const handleProceedToPayment = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          startDate,
          endDate,
          pointsToUse: usePoints,
          pickupLocation,
          returnLocation,
          notes,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'เกิดข้อผิดพลาดในการสร้างการจอง');
        setIsSubmitting(false);
        return;
      }

      setCreatedBooking(data.booking);
      setCurrentStep(4);
      setIsSubmitting(false);
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      setIsSubmitting(false);
    }
  };

  // Step 4 -> 5: Simulate payment completion
  const handleConfirmPayment = async () => {
    if (!createdBooking) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: createdBooking.id,
          amount: totalPayable,
          paymentMethod,
        }),
      });
      setIsSubmitting(false);
      setCurrentStep(5);
    } catch (err) {
      setIsSubmitting(false);
      setCurrentStep(5);
    }
  };

  if (loading || !vehicle) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        <p className="text-xs text-slate-500">กำลังโหลดระบบจองรถ...</p>
      </div>
    );
  }

  const promptpayNumber = process.env.NEXT_PUBLIC_PROMPTPAY_NUMBER || '0812345678';
  const qrCodeUrl = getPromptPayQrImageUrl(promptpayNumber, totalPayable);

  const steps = [
    { num: 1, title: 'เลือกวันเช่า' },
    { num: 2, title: 'ข้อมูลผู้เช่า' },
    { num: 3, title: 'สิทธิพิเศษสมาชิก' },
    { num: 4, title: 'ชำระเงิน' },
    { num: 5, title: 'ยืนยันการจอง' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Stepper Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center space-y-1 text-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs transition-all ${
                    currentStep === s.num
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30 ring-4 ring-brand-100'
                      : currentStep > s.num
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {currentStep > s.num ? '✓' : s.num}
                </div>
                <span
                  className={`text-[11px] font-semibold ${
                    currentStep === s.num ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {s.title}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    currentStep > s.num ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left/Main Stepper Forms */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: DATES & LOCATION */}
          {currentStep === 1 && (
            <form onSubmit={handleDatesSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">ระบุวันและสถานที่รับ-คืนรถ</h2>
                <p className="text-xs text-slate-500 mt-0.5">ระบบจะตรวจสอบคิวว่างอัตโนมัติเพื่อป้องกันการจองซ้ำ</p>
              </div>

              {dateConflictError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{dateConflictError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                    วันรับรถ (Start Date) *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                    วันคืนรถ (End Date) *
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-600" />
                    สถานที่รับรถ *
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-500"
                  >
                    {locationOptions.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-600" />
                    สถานที่คืนรถ *
                  </label>
                  <select
                    value={returnLocation}
                    onChange={(e) => setReturnLocation(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-500"
                  >
                    {locationOptions.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                  หมายเหตุเพิ่มเติม (ถ้ามี)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="เช่น ขอรับหมวกกันน็อค Size L เพิ่มเติม 1 ใบ"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button type="submit" variant="primary">
                  ถัดไป: กรอกข้อมูลผู้เช่า <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </form>
          )}

          {/* STEP 2: CUSTOMER INFORMATION */}
          {currentStep === 2 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">ข้อมูลผู้เช่าและใบอนุญาตขับขี่</h2>
                <p className="text-xs text-slate-500 mt-0.5">ใช้สำหรับออกสัญญาเช่าดิจิทัลและการทำประกันภัย</p>
              </div>

              <div className="space-y-4 text-xs">
                <Input
                  label="ชื่อ-นามสกุล ผู้เช่า *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  leftIcon={<User className="w-4 h-4" />}
                  required
                />

                <Input
                  label="เบอร์โทรศัพท์ติดต่อ *"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  leftIcon={<Phone className="w-4 h-4" />}
                  required
                />

                <Input
                  label="เลขที่ใบขับขี่รถจักรยานยนต์ *"
                  value={driverLicense}
                  onChange={(e) => setDriverLicense(e.target.value)}
                  placeholder="เช่น 12345678"
                  required
                />
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  โปรดแสดงใบอนุญาตขับขี่ตัวจริงในวันรับรถ
                </p>
                <p className="text-[11px] text-amber-700">
                  เพื่อความปลอดภัยและความถูกต้องตามกฎหมายจราจรของประเทศไทย
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-1.5" /> ย้อนกลับ
                </Button>
                <Button variant="primary" onClick={() => setCurrentStep(3)}>
                  ถัดไป: สิทธิพิเศษสมาชิก <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: MEMBERSHIP & POINTS */}
          {currentStep === 3 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">สิทธิพิเศษและส่วนลดสมาชิก</h2>
                <p className="text-xs text-slate-500 mt-0.5">ใช้แต้มสะสมและสิทธิประโยชน์ตามระดับสมาชิกเพื่อรับส่วนลด</p>
              </div>

              {currentUser?.customer ? (
                <div className="space-y-4">
                  <div className="p-5 bg-gradient-to-r from-slate-900 to-brand-950 text-white rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300">ระดับสมาชิกของคุณ</span>
                      <span className="font-bold text-xs uppercase px-2.5 py-0.5 rounded-full bg-brand-500 text-white">
                        {currentUser.customer?.membershipTier?.name || 'BRONZE'}
                      </span>
                    </div>
                    <p className="text-sm font-extrabold">
                      รับส่วนลดค่าเช่าทันที {tierDiscountPercent}% (-{formatCurrency(tierDiscountAmount)})
                    </p>
                    <p className="text-xs text-slate-300">
                      แต้มสะสมคงเหลือ: <span className="font-mono font-bold text-white">{currentUser.customer?.points || 0}</span> แต้ม (1 แต้ม = ส่วนลด 1 บาท)
                    </p>
                  </div>

                  {currentUser.customer?.points > 0 && (
                    <div className="p-4 border border-slate-200 rounded-2xl space-y-2 text-xs">
                      <label className="font-bold text-slate-800 block">
                        ระบุแต้มสะสมที่ต้องการใช้ (สูงสุด {Math.min(currentUser.customer.points, rentalSubtotal)} แต้ม)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={Math.min(currentUser.customer.points, rentalSubtotal)}
                        value={usePoints}
                        onChange={(e) => setUsePoints(Number(e.target.value) || 0)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 space-y-2">
                  <p className="font-bold text-slate-800">เข้าสู่ระบบเพื่อรับส่วนลดสมาชิกและสะสมแต้ม</p>
                  <p className="text-slate-500">
                    คุณสามารถดำเนินการจองต่อในฐานะผู้ใช้ทั่วไป หรือเข้าสู่ระบบเพื่อรับส่วนลดทันที
                  </p>
                  <Link href="/login" className="inline-block">
                    <Button variant="outline" size="sm">
                      เข้าสู่ระบบสมาชิก
                    </Button>
                  </Link>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-1.5" /> ย้อนกลับ
                </Button>
                <Button
                  variant="primary"
                  isLoading={isSubmitting}
                  onClick={handleProceedToPayment}
                >
                  ถัดไป: ไปหน้าชำระเงิน <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: PAYMENT WITH PROMPTPAY & COUNTDOWN */}
          {currentStep === 4 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">ชำระเงิน (Payment)</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  รหัสการจอง: <span className="font-mono font-bold text-brand-600">{createdBooking?.bookingNumber || 'BK250501-001'}</span>
                </p>
              </div>

              {/* Payment Countdown Box */}
              <div className="p-4 bg-brand-50 border border-brand-200 rounded-2xl flex items-center justify-between text-brand-900 text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-600 animate-pulse" />
                  <div>
                    <span className="font-bold block">กรุณาชำระเงินภายใน</span>
                    <span className="text-[11px] text-brand-700">ระบบจะยกเลิกการจองอัตโนมัติหากหมดเวลา</span>
                  </div>
                </div>
                <div className="text-2xl font-extrabold font-mono text-brand-600">
                  {formatCountdown(countdown)}
                </div>
              </div>

              {/* PromptPay QR Section */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-900 text-white rounded-3xl">
                <div className="p-3 bg-white rounded-2xl shrink-0 shadow-lg">
                  <img
                    src={qrCodeUrl}
                    alt="PromptPay QR Code"
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <div className="space-y-3 text-center sm:text-left">
                  <span className="px-3 py-1 bg-brand-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                    THAI QR PAYMENT • PROMPTPAY
                  </span>
                  <h3 className="text-2xl font-extrabold text-white font-mono">
                    {formatCurrency(totalPayable)}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    สแกน QR Code ผ่านแอปพลิเคชันธนาคารใดก็ได้ เพื่อชำระค่าเช่าและเงินมัดจำ
                  </p>
                  <p className="text-[11px] text-slate-400">
                    หมายเลขพร้อมเพย์: <span className="font-mono text-white font-bold">{promptpayNumber}</span> (BIG BIKE RENTAL BKK)
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setCurrentStep(3)}>
                  <ArrowLeft className="w-4 h-4 mr-1.5" /> ย้อนกลับ
                </Button>
                <Button
                  variant="primary"
                  isLoading={isSubmitting}
                  onClick={handleConfirmPayment}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> ยืนยันว่าชำระเงินแล้ว
                </Button>
              </div>
            </div>
          )}

          {/* STEP 5: CONFIRMATION & DIGITAL CONTRACT */}
          {currentStep === 5 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6 text-center">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-slate-900">การจองสำเร็จเรียบร้อย!</h2>
                <p className="text-xs text-slate-500">
                  รหัสการจอง: <span className="font-mono font-bold text-brand-600 text-sm">{createdBooking?.bookingNumber || 'BK250501-001'}</span>
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-600 text-left space-y-2 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">รถที่เช่า:</span>
                  <span className="font-bold text-slate-800">{vehicle.brand} {vehicle.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ระยะเวลาเช่า:</span>
                  <span className="font-bold text-slate-800">{formatDate(startDate)} - {formatDate(endDate)} ({days} วัน)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ยอดชำระแล้ว:</span>
                  <span className="font-bold text-brand-600 font-mono">{formatCurrency(totalPayable)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Link href="/my-bookings">
                  <Button variant="primary" size="md">
                    <FileText className="w-4 h-4 mr-2" /> ดูสัญญาเช่า & ประวัติการจอง
                  </Button>
                </Link>
                <Link href="/vehicles">
                  <Button variant="outline" size="md">
                    กลับหน้าเลือกรถ
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6 sticky top-28">
            <h3 className="font-extrabold text-base text-slate-900 pb-3 border-b border-slate-100">
              สรุปรายการเช่า (Summary)
            </h3>

            {/* Bike Mini Card */}
            <div className="flex items-center gap-3">
              <img
                src={vehicle.imageUrl}
                alt={vehicle.model}
                className="w-16 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div>
                <span className="text-[10px] font-bold text-brand-600 uppercase">{vehicle.brand}</span>
                <h4 className="font-extrabold text-sm text-slate-900 leading-tight">{vehicle.model}</h4>
                <span className="text-xs text-slate-400">{vehicle.engineCC} CC</span>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>ค่าเช่า ({days} วัน @ {formatCurrency(dailyPrice)})</span>
                <span className="font-bold text-slate-800 font-mono">{formatCurrency(rentalSubtotal)}</span>
              </div>

              {tierDiscountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>ส่วนลดสมาชิก ({tierDiscountPercent}%)</span>
                  <span className="font-mono">- {formatCurrency(tierDiscountAmount)}</span>
                </div>
              )}

              {pointsDiscountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>ส่วนลดจากแต้มสะสม ({usePoints} แต้ม)</span>
                  <span className="font-mono">- {formatCurrency(pointsDiscountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>เงินมัดจำความเสียหาย (คืนเมื่อส่งมอบ)</span>
                <span className="font-bold text-slate-800 font-mono">{formatCurrency(deposit)}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-extrabold text-slate-900 block">ยอดรวมทั้งสิ้น</span>
                  <span className="text-[10px] text-slate-400">รวมค่าเช่า + เงินมัดจำ</span>
                </div>
                <span className="text-2xl font-extrabold text-brand-600 font-mono">
                  {formatCurrency(totalPayable)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
