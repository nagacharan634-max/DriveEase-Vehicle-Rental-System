import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X, CreditCard, QrCode, Building, CheckCircle, ShieldCheck,
  Lock, ArrowRight, Loader2, DollarSign, Download, Sparkles
} from 'lucide-react';

export default function PaymentModal() {
  const {
    activePaymentRental,
    setActivePaymentRental,
    processPayment,
    getVehicle,
    getBooking,
    currentUser
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'upi' | 'netbanking'
  const [isProcessing, setIsProcessing] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState(null);

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('482');
  const [cardName, setCardName] = useState(currentUser?.name || 'Alex Sterling');

  // UPI Input
  const [upiId, setUpiId] = useState('alex.sterling@okhdfcbank');

  // NetBanking Input
  const [bank, setBank] = useState('JPMorgan Chase Bank');

  if (!activePaymentRental) return null;

  const rental = activePaymentRental;
  const vehicle = getVehicle(rental.vehicle_id);
  const booking = getBooking(rental.booking_id);
  const totalAmount = booking?.total_amount || 320.00;

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      let methodLabel = 'Credit Card';
      if (paymentMethod === 'card') methodLabel = `Credit Card (${cardNumber.slice(-4)})`;
      if (paymentMethod === 'upi') methodLabel = `UPI (${upiId})`;
      if (paymentMethod === 'netbanking') methodLabel = `Net Banking (${bank})`;

      const payment = processPayment(rental.rental_id, totalAmount, methodLabel);
      setIsProcessing(false);
      setSuccessReceipt(payment);
    }, 1200);
  };

  const handleClose = () => {
    setActivePaymentRental(null);
    setSuccessReceipt(null);
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">DriveEase Payment Gateway</h2>
              <p className="text-xs text-slate-400 font-mono">Rental Reference: {rental.rental_id}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!successReceipt ? (
            <>
              {/* Rental Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Automobile</div>
                  <div className="text-sm font-bold text-white">{vehicle?.brand} {vehicle?.model}</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">Plate: {vehicle?.vehicle_no}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Total Payable</div>
                  <div className="text-2xl font-black text-white font-mono text-emerald-400">
                    ${Number(totalAmount).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-medium transition-all ${
                      paymentMethod === 'card'
                        ? 'border-blue-500 bg-blue-950/40 text-blue-300 font-semibold shadow-md'
                        : 'border-slate-800 bg-slate-850 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-medium transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-blue-500 bg-blue-950/40 text-blue-300 font-semibold shadow-md'
                        : 'border-slate-800 bg-slate-850 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <QrCode className="w-5 h-5" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-medium transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'border-blue-500 bg-blue-950/40 text-blue-300 font-semibold shadow-md'
                        : 'border-slate-800 bg-slate-850 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Building className="w-5 h-5" />
                    <span>Net Banking</span>
                  </button>
                </div>
              </div>

              {/* Form 1: Card Payment */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-medium focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Expires (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength="4"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Form 2: UPI */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs">
                  <div className="w-36 h-36 mx-auto p-2 bg-white rounded-xl shadow-inner flex items-center justify-center">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=driveease@icici&pn=DriveEaseRentals&am=320.00"
                      alt="UPI QR Code"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="text-slate-400">Scan QR using Google Pay, PhonePe, or Paytm</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="Enter your VPA (e.g. name@bank)"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Form 3: Net Banking */}
              {paymentMethod === 'netbanking' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                  <label className="block text-slate-400 mb-1">Select Verified Banking Partner</label>
                  <select
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="JPMorgan Chase Bank">JPMorgan Chase Bank</option>
                    <option value="Bank of America">Bank of America</option>
                    <option value="Wells Fargo">Wells Fargo</option>
                    <option value="Citibank N.A.">Citibank N.A.</option>
                    <option value="HDFC Bank Limited">HDFC Bank Limited</option>
                    <option value="State Bank of India">State Bank of India</option>
                  </select>
                  <p className="text-[11px] text-slate-500">
                    You will be redirected to the secure 256-bit encrypted banking portal to authenticate transaction.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>PCI-DSS Level 1 Encrypted Payment Engine with Instant DBMS Ledger Settlement</span>
              </div>
            </>
          ) : (
            /* PAYMENT SUCCESS SCREEN */
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-2xl">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-emerald-400">Payment Successful</span>
                <h2 className="text-2xl font-black text-white mt-1">Transaction Completed</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Settlement entry committed to DBMS `PAYMENT` ledger table.
                </p>
              </div>

              {/* Receipt Summary */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2.5 font-mono text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">TRANSACTION ID:</span>
                  <span className="text-emerald-400 font-bold">{successReceipt.transaction_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PAYMENT ID:</span>
                  <span className="text-white">{successReceipt.payment_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">RENTAL ID:</span>
                  <span className="text-white">{successReceipt.rental_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Method:</span>
                  <span className="text-white font-sans">{successReceipt.payment_method}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2 font-bold text-sm">
                  <span className="text-slate-300">Amount Paid:</span>
                  <span className="text-emerald-400">${Number(successReceipt.amount).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Print Receipt
                </button>
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-blue-900/40"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Action */}
        {!successReceipt && (
          <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-900/30 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Settlement...</span>
                </>
              ) : (
                <>
                  <span>Pay ${Number(totalAmount).toFixed(2)} Now</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
