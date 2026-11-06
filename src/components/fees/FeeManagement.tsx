import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Invoice, FeeItem } from '../../types';
import { CheckoutWidgetModal } from './CheckoutWidgetModal';
import { InvoiceModal } from './InvoiceModal';
import {
  Receipt,
  CreditCard,
  DollarSign,
  Plus,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Filter,
  Search,
  Download,
} from 'lucide-react';

export const FeeManagement: React.FC = () => {
  const { invoices, addInvoice, currentRole, activeParentChild } = useSchool();

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // New Invoice Form Modal
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('Liam Parker');
  const [newGrade, setNewGrade] = useState('Grade 10');
  const [newParentName, setNewParentName] = useState('David Parker');
  const [newParentEmail, setNewParentEmail] = useState('david.parker@outlook.com');
  const [newDueDate, setNewDueDate] = useState('2026-12-01');
  const [newTuition, setNewTuition] = useState(3200);
  const [newTransport, setNewTransport] = useState(400);

  // Totals
  const totalBilled = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalCollected = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const pendingAmount = invoices
    .filter(i => i.status === 'pending')
    .reduce((acc, i) => acc + (i.totalAmount - i.paidAmount), 0);
  const overdueAmount = invoices
    .filter(i => i.status === 'overdue')
    .reduce((acc, i) => acc + (i.totalAmount - i.paidAmount), 0);

  // Filtered invoices
  const filteredInvoices = invoices.filter(inv => {
    if (currentRole === 'student') {
      if (!inv.studentName.includes('Liam')) return false;
    }
    if (currentRole === 'parent' && activeParentChild) {
      if (inv.studentId !== activeParentChild.id) return false;
    }
    if (statusFilter !== 'All' && inv.status !== statusFilter) return false;
    if (
      searchQuery &&
      !`${inv.invoiceNumber} ${inv.studentName} ${inv.parentName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim())
    ) {
      return false;
    }
    return true;
  });

  const handleOpenCheckout = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsCheckoutOpen(true);
  };

  const handleOpenDoc = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsInvoiceModalOpen(true);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const items: FeeItem[] = [
      { id: 'f1', description: 'Winter Academic Tuition', category: 'Tuition', amount: Number(newTuition) },
      { id: 'f2', description: 'Bus Transport Fee', category: 'Transport', amount: Number(newTransport) },
    ];
    const totalAmount = Number(newTuition) + Number(newTransport);

    addInvoice({
      studentId: 'stu_1001',
      studentName: newStudentName,
      grade: newGrade,
      parentName: newParentName,
      parentEmail: newParentEmail,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: newDueDate,
      items,
      totalAmount,
    });

    setIsNewInvoiceOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Fee Management & Billing Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent institutional tuition ledger, itemized breakdown, and instant digital card checkout.
          </p>
        </div>

        {currentRole === 'admin' && (
          <button
            onClick={() => setIsNewInvoiceOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Issue New Invoice</span>
          </button>
        )}
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Billed</span>
          <p className="text-2xl font-bold tracking-tight font-mono text-slate-900 dark:text-slate-100 mt-2 tabular-nums">
            ${totalBilled.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Fall 2026 Academic Term</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-emerald-600">Total Collected</span>
          <p className="text-2xl font-bold tracking-tight font-mono text-emerald-600 mt-2 tabular-nums">
            ${totalCollected.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Verified digital settlements</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-amber-600">Pending Receivables</span>
          <p className="text-2xl font-bold tracking-tight font-mono text-amber-600 mt-2 tabular-nums">
            ${pendingAmount.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Due before Nov 15</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-rose-600">Overdue Balances</span>
          <p className="text-2xl font-bold tracking-tight font-mono text-rose-600 mt-2 tabular-nums">
            ${overdueAmount.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Reminder notices active</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by invoice # or student name..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Status:</span>
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {['All', 'pending', 'paid', 'overdue'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Invoices Data Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Student & Grade</th>
                <th className="py-3 px-4">Parent / Guardian</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    No invoices match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map(inv => (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {inv.invoiceNumber}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{inv.studentName}</p>
                      <p className="text-[11px] text-slate-500">{inv.grade}</p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{inv.parentName}</p>
                      <p className="text-[11px] text-slate-500">{inv.parentEmail}</p>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                      {inv.dueDate}
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {inv.items.length} line items
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      ${inv.totalAmount.toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          inv.status === 'paid'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : inv.status === 'overdue'
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenDoc(inv)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="View Official Invoice / Receipt Document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {inv.status !== 'paid' && (
                          <button
                            onClick={() => handleOpenCheckout(inv)}
                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1 transition-colors shadow-xs"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>Pay</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutWidgetModal
        invoice={selectedInvoice}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Invoice Document Modal */}
      <InvoiceModal
        invoice={selectedInvoice}
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />

      {/* Issue Invoice Modal for Admin */}
      {isNewInvoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Issue Official School Fee Invoice
            </h3>
            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Student Name</label>
                  <input
                    type="text"
                    value={newStudentName}
                    onChange={e => setNewStudentName(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Grade Level</label>
                  <select
                    value={newGrade}
                    onChange={e => setNewGrade(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 7">Grade 7</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Parent Guardian Name</label>
                  <input
                    type="text"
                    value={newParentName}
                    onChange={e => setNewParentName(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Parent Email</label>
                  <input
                    type="email"
                    value={newParentEmail}
                    onChange={e => setNewParentEmail(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tuition ($)</label>
                  <input
                    type="number"
                    value={newTuition}
                    onChange={e => setNewTuition(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Transport ($)</label>
                  <input
                    type="number"
                    value={newTransport}
                    onChange={e => setNewTransport(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={e => setNewDueDate(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewInvoiceOpen(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
