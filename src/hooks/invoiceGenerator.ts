"use client";

import jsPDF from "jspdf";
import autoTable, { UserOptions } from "jspdf-autotable";
import { IOrder } from "@/models/Order";

// Extend jsPDF type to include lastAutoTable property
interface JsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}

export const generateInvoicePdf = (order: IOrder) => {
  if (typeof window === "undefined") return;

  const shopName = "Unique Store Bd";
  const shopAddress = "Elephant Road, Dhaka-1205";
  const shopPhone = "09638-617746";
  const shopEmail = "contact@uniquestorebd.store";

  const currency = "Tk";
  const shopLogo =
    "https://res.cloudinary.com/dxmvrhcjx/image/upload/v1756716191/481999217_122151293954497451_784184120423218190_n_n7c08p.jpg";

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" }) as JsPDFWithAutoTable;

  // === HEADER ===
  if (shopLogo) {
    doc.addImage(shopLogo, "PNG", 14, 10, 25, 25);
  }

  doc.setFontSize(20).setFont("helvetica", "bold");
  doc.text(shopName, 105, 20, { align: "center" });

  doc.setFontSize(10).setFont("helvetica", "normal");
  doc.text(shopAddress, 105, 27, { align: "center" });
  doc.text(`Phone: ${shopPhone} | Email: ${shopEmail}`, 105, 33, {
    align: "center",
  });

  // === Order ID & Date ===
  doc.setFontSize(11).setFont("helvetica", "bold");
  doc.text(`Order ID: ${order.orderId}`, 196, 20, { align: "right" });

  doc.setFont("helvetica", "normal");
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Date: ${formattedDate}`, 196, 27, { align: "right" });

  // Divider
  doc.setLineWidth(0.5);
  doc.line(14, 40, 196, 40);

  // === CUSTOMER INFO ===
  doc.setFontSize(12).setFont("helvetica", "bold");
  doc.text("Invoice To:", 14, 50);

  doc.setFont("helvetica", "normal");
  doc.text(`${order.name}`, 14, 58);
  doc.text(`${order.mobile}`, 14, 65);
  doc.text(`${order.address}, ${order.city}`, 14, 72);
  doc.text(`Payment: ${order.paymentType}`, 14, 79);

  // === PRODUCT TABLE ===
  const tableColumn = ["#", "Product", "Qty", "Price", "Total"];
  const tableRows: (string | number)[][] = [];

  order.cartItems.forEach((item, index) => {
    tableRows.push([
      (index + 1).toString(),
      item.name,
      item.quantity.toString(),
      `${item.price.toFixed(2)} ${currency}`,
      `${(item.price * item.quantity).toFixed(2)} ${currency}`,
    ]);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 90,
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 9,
      valign: "middle",
      cellPadding: { top: 4, right: 4, bottom: 4, left: 4 },
      overflow: "linebreak",
      lineColor: [220, 220, 220],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [34, 139, 34],
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    columnStyles: {
      0: { cellWidth: 12, halign: "center" },
      1: { cellWidth: "auto", minCellWidth: 70 },
      2: { cellWidth: 20, halign: "center" },
      3: { cellWidth: 30, halign: "right" },
      4: { cellWidth: 30, halign: "right" },
    },
    tableWidth: "auto",
    margin: { left: 10, right: 10 },
  } as UserOptions);

  // Use type assertion to access lastAutoTable safely
  let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 100;

  doc.setFontSize(12).setFont("helvetica", "normal");
  doc.text(`Subtotal: ${order.subtotal} ${currency}`, 196, finalY, {
    align: "right",
  });
  finalY += 7;

  doc.text(`Delivery Charge: ${order.deliveryCharge} ${currency}`, 196, finalY, {
    align: "right",
  });
  finalY += 7;

  if (order.paymentType === "partial") {
    doc.text(`Advance Paid: ${order.payNowAmount} ${currency}`, 196, finalY, {
      align: "right",
    });
    finalY += 7;
    doc.text(`Pay to Rider: ${order.payToRiderAmount} ${currency}`, 196, finalY, {
      align: "right",
    });
    finalY += 7;
  } else {
    doc.text(`Payment: Full Paid`, 196, finalY, { align: "right" });
    finalY += 7;
  }

  doc.setFont("helvetica", "bold");
  doc.text(`Total: ${order.totalAmount} ${currency}`, 196, finalY + 5, {
    align: "right",
  });

  // === FOOTER ===
  doc.setFontSize(9).setFont("helvetica", "italic");
  doc.text("Thank you for your order", 105, 290, { align: "center" });

  doc.save(`Invoice_${order?.orderId}.pdf`);
};