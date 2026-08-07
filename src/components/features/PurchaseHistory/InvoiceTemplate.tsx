import { forwardRef } from 'react';

interface InvoiceTemplateProps {
  payment: any;
  user: any;
}

export const InvoiceTemplate = forwardRef<HTMLDivElement, InvoiceTemplateProps>(
  ({ payment, user }, ref) => {
    const stripeId = payment.paymentIntentId || payment.chargeId || payment.paymentId;
    const invoiceDate = new Date(payment.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return (
      <div 
        ref={ref}
        className="bg-white"
        style={{
          width: '794px', // A4 width at 96 DPI
          minHeight: '1123px', // A4 height
          padding: '48px 56px',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          color: '#0f172a'
        }}
      >
        {/* Background Watermark */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] rotate-[-35deg]"
          style={{ fontSize: '160px', fontWeight: 900, color: '#0f172a', whiteSpace: 'nowrap' }}
        >
          RIVA DATA
        </div>

        {/* Header Section */}
        <div className="flex justify-between items-start mb-8 relative z-10">
          {/* Logo Area */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#1e293b] rounded-lg flex items-center justify-center text-white font-bold text-2xl tracking-tighter">
              RD
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#1e293b] tracking-tight leading-none mb-1">
                Riva Data
              </h1>
              <p className="text-[#94a3b8] font-semibold tracking-[0.2em] text-[10px]">
                ACADEMY
              </p>
            </div>
          </div>

          {/* Receipt Info Area */}
          <div className="text-right">
            <h2 className="text-4xl font-serif font-bold text-[#1e293b] tracking-tight mb-4">
              RECEIPT
            </h2>
            <div className="text-[13px] flex flex-col gap-1.5">
              <p className="text-[#64748b]">
                <span className="font-bold text-[#1e293b] mr-2">Receipt ID</span> {stripeId}
              </p>
              <p className="text-[#64748b]">
                <span className="font-bold text-[#1e293b] mr-2">Date</span> {invoiceDate}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[2px] w-full bg-[#f1f5f9] mb-10 relative z-10" />

        {/* Billing Section */}
        <div className="flex justify-between items-start mb-12 relative z-10">
          {/* Billed To */}
          <div>
            <h3 className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-3">
              BILLED TO
            </h3>
            <p className="font-serif font-bold text-[#1e293b] text-xl mb-1">
              {user?.name || 'Customer'}
            </p>
            <p className="text-[#64748b] text-[13px] mb-4">
              {user?.email || 'Unknown'}
            </p>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#ecfdf5] text-[#047857] text-[11px] font-bold tracking-wider">
              {payment.status.toUpperCase()}
            </div>
          </div>

          {/* From */}
          <div className="text-right">
            <h3 className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-3">
              FROM
            </h3>
            <p className="font-serif font-bold text-[#1e293b] text-lg mb-1">
              Riva Data Academy Pvt. Ltd.
            </p>
            <div className="text-[#64748b] text-[13px] leading-relaxed">
              <p>4th Floor, Cyber Hub Tower</p>
              <p>Gurugram, Haryana 122002, India</p>
              <p className="mt-1">support@rivadata.com</p>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="mb-10 relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0f172a] text-white text-[11px] uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold w-[50%]">Description</th>
                <th className="py-4 px-6 font-semibold">Instructor</th>
                <th className="py-4 px-6 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-b border-[#e2e8f0]">
                <td className="py-6 px-6">
                  <p className="font-bold text-[#1e293b] text-[15px] mb-1">
                    {payment.course.title}
                  </p>
                  <p className="text-[#94a3b8] text-[13px]">
                    Self-paced course
                  </p>
                </td>
                <td className="py-6 px-6 text-[#475569] text-[14px]">
                  {payment.course.instructor}
                </td>
                <td className="py-6 px-6 font-bold text-[#1e293b] text-[15px] text-right">
                  {payment.currency.toUpperCase()} {payment.amount.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end mb-16 relative z-10">
          <div className="w-[300px]">
            <div className="h-[2px] w-full bg-[#1e293b] mb-4 mt-6" />
            <div className="flex justify-between items-center text-[18px]">
              <span className="font-bold text-[#1e293b]">Total Paid</span>
              <span className="font-extrabold text-[#1e293b]">
                {payment.currency.toUpperCase()} {payment.amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Reference Box */}
        <div className="bg-[#f8fafc]/80 border border-[#f1f5f9] rounded-xl p-8 relative z-10">
          <h3 className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest mb-6">
            PAYMENT REFERENCE
          </h3>
          <div className="grid grid-cols-2 gap-y-8 gap-x-12 text-[13px]">
            {payment.paymentIntentId && (
              <div>
                <p className="text-[#94a3b8] font-medium mb-1">Stripe Payment Intent</p>
                <p className="text-[#475569] font-mono text-[12px]">{payment.paymentIntentId}</p>
              </div>
            )}
            {(payment.chargeId || payment.paymentId) && (
              <div>
                <p className="text-[#94a3b8] font-medium mb-1">Transaction ID</p>
                <p className="text-[#475569] font-mono text-[12px]">
                  {payment.chargeId || payment.paymentId}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

InvoiceTemplate.displayName = 'InvoiceTemplate';
