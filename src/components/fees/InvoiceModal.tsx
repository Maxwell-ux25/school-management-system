import React from 'react';
import { Invoice } from '../../types';
import { X, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';

interface InvoiceModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  invoice,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white text-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-8 border border-slate-200">
        {/* Modal Toolbar (hidden in print) */}
        <div className="no-print px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-800">
            Institutional Billing Statement · {invoice.invoiceNumber}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice / Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 space-y-8 bg-white print:p-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 border-b pb-6 border-slate-200">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-900 text-white flex items-center justify-center font-extrabold text-lg">
                  APX
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-950 uppercase tracking-tight">
                    Apex Academy of Sciences & Arts
                  </h2>
                  <p className="text-xs text-slate-500">Bursar & Finance Office · Tax ID: 93-8821940</p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Invoice Number</p>
              <p className="text-lg font-mono font-bold text-slate-900">{invoice.invoiceNumber}</p>
              <div className="mt-1">
                {invoice.status === 'paid' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                    Paid in Full
                  </span>
                ) : invoice.status === 'overdue' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider">
                    Overdue
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
                    Payment Pending
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bill To & Details */}
          <div className="grid grid-cols-2 gap-8 text-xs">
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider">Billed To (Guardian)</span>
              <p className="font-bold text-slate-900 text-sm mt-1">{invoice.parentName}</p>
              <p className="text-slate-600 mt-0.5">{invoice.parentEmail}</p>
              <p className="text-slate-500 mt-1">Student: <strong className="text-slate-900">{invoice.studentName}</strong> ({invoice.grade})</p>
            </div>

            <div className="text-right space-y-1">
              <span className="font-bold text-slate-400 uppercase tracking-wider">Dates & Terms</span>
              <p className="text-slate-600 mt-1">Issue Date: <span className="font-mono font-medium text-slate-900">{invoice.issueDate}</span></p>
              <p className="text-slate-600">Payment Due: <span className="font-mono font-bold text-slate-900">{invoice.dueDate}</span></p>
              {invoice.paidAt && (
                <p className="text-emerald-700 font-medium">Settled Date: <span className="font-mono">{invoice.paidAt}</span></p>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Item & Description</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Amount (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoice.items.map(item => (
                  <tr key={item.id}>
                    <td className="py-3 px-4 font-semibold text-slate-900">{item.description}</td>
                    <td className="py-3 px-4 text-slate-500">{item.category}</td>
                    <td className="py-3 px-4 text-right font-mono font-medium tabular-nums">
                      ${item.amount.toLocaleString()}.00
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Calculation */}
          <div className="flex justify-end text-xs">
            <div className="w-64 space-y-2 border-t pt-3 border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono">${invoice.totalAmount.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>School District Tax:</span>
                <span className="font-mono">$0.00 (Tax Exempt)</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-950 border-t border-slate-200 pt-2">
                <span>Total Amount:</span>
                <span className="font-mono">${invoice.totalAmount.toLocaleString()}.00</span>
              </div>
              {invoice.status === 'paid' && (
                <div className="flex justify-between text-emerald-700 font-bold pt-1">
                  <span>Amount Paid:</span>
                  <span className="font-mono">-${invoice.paidAmount.toLocaleString()}.00</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Notes */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-900">Official Payment Instructions</p>
            <p>Direct ACH wire transfer routing number: <strong className="font-mono">121000358</strong> · Account: <strong className="font-mono">99823100</strong>.</p>
            {invoice.transactionRef && (
              <p className="text-emerald-700 font-mono text-[11px] pt-1">
                Transaction Reference: {invoice.transactionRef} (Settled via {invoice.paymentMethod})
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
