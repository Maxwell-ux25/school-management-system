import React, { useState } from 'react';
import { Invoice } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import {
  CreditCard,
  Lock,
  CheckCircle2,
  ShieldCheck,
  X,
  Loader2,
  Calendar,
  DollarSign,
} from 'lucide-react';

interface CheckoutWidgetModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutWidgetModal: React.FC<CheckoutWidgetModalProps> = ({
  invoice,
  isOpen,
  onClose,
}) => {
  const { payInvoice } = useSchool();

  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('08/29');
  const [cvc, setCvc] = useState('883');
  const [nameOnCard, setNameOnCard] = useState(invoice?.parentName || 'David Parker');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen || !invoice) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const success = await payInvoice(invoice.id, `Visa •••• ${cardNumber.slice(-4) || '4242'}`);
    setIsProcessing(false);
    if (success) {
      setIsCompleted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Apex Academy Secure Checkout
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">256-bit Encrypted Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isCompleted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Payment Completed!
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Official institutional receipt has been generated and emailed to {invoice.parentEmail}.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-left font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice:</span>
                <span className="font-bold">{invoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">${invoice.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Card:</span>
                <span>Visa •••• 4242</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Back to Invoices
            </button>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-6 space-y-5">
            {/* Bill Summary */}
            <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total Due for {invoice.studentName}</p>
                <p className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
                  ${invoice.totalAmount.toLocaleString()}
                </p>
              </div>
              <span className="text-xs font-mono px-2 py-1 bg-white dark:bg-slate-800 rounded-md border border-indigo-200 dark:border-indigo-800 font-semibold text-indigo-600 dark:text-indigo-400">
                {invoice.invoiceNumber}
              </span>
            </div>

            {/* Line Items Snapshot */}
            <div className="space-y-1.5 text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Itemized Breakdown</span>
              {invoice.items.map(item => (
                <div key={item.id} className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>{item.description}</span>
                  <span className="font-mono font-medium">${item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Card Inputs */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Name on Card</label>
                <input
                  type="text"
                  value={nameOnCard}
                  onChange={e => setNameOnCard(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Card Number</label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full p-2 pl-9 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-medium"
                    required
                  />
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={e => setExpiry(e.target.value)}
                    placeholder="08/29"
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">CVC Security Code</label>
                  <input
                    type="text"
                    value={cvc}
                    onChange={e => setCvc(e.target.value)}
                    placeholder="883"
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Secure Payment...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Pay ${invoice.totalAmount.toLocaleString()} Now</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
