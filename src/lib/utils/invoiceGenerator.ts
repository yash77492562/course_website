import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

interface InvoicePayment {
  paymentId: string;
  orderId: string;
  paymentIntentId: string;
  chargeId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  course: {
    title: string;
    instructor: string;
  };
}

export const generateInvoicePDF = async (payment: InvoicePayment, element: HTMLElement) => {
  const stripeId = payment.paymentIntentId || payment.chargeId || payment.paymentId;

  try {
    // A4 dimensions in mm
    const pdfWidth = 210;
    const pdfHeight = 297;

    // Suppress harmless CSS parsing errors from html-to-image that trigger Next.js dev overlays
    const originalError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('Error inserting rule from remote css')) return;
      if (args[0]?.error?.includes('DOMException')) return;
      originalError(...args);
    };

    let imgData;
    try {
      // Create image from HTML with high scale for quality
      imgData = await toPng(element, {
        pixelRatio: 3,
        backgroundColor: '#ffffff',
      });
    } finally {
      console.error = originalError; // Restore immediately
    }
    
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Calculate aspect ratio
    // element.offsetWidth is width in pixels, height is offsetHeight
    const imgWidth = pdfWidth;
    const imgHeight = (element.offsetHeight * imgWidth) / element.offsetWidth;
    
    doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // Trigger Download
    doc.save(`RivaData_Receipt_${stripeId.substring(0, 10)}.pdf`);
  } catch (error) {
    console.error('Failed to generate PDF invoice:', error);
  }
};
