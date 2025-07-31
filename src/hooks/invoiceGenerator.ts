import { IOrder } from '@/models/Order';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';

export async function generateInvoicePdf(order: IOrder) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const logoImageBytes = await fetch('https://res.cloudinary.com/dxmvrhcjx/image/upload/v1736267263/hm8yhv7pehnbxw4klxym.png').then(res => res.arrayBuffer());
    const logoImage = await pdfDoc.embedPng(logoImageBytes);
    const { height } = page.getSize();

    const drawText = (
        text: string,
        x: number,
        y: number,
        size = 12,
        color = { r: 0, g: 0, b: 0 },
        bold = false,
        maxWidth?: number
    ) => {
        let finalText = text;
        if (maxWidth) {
            const width = font.widthOfTextAtSize(text, size);
            if (width > maxWidth) {
                while (font.widthOfTextAtSize(finalText + '...', size) > maxWidth && finalText.length > 0) {
                    finalText = finalText.slice(0, -1);
                }
                finalText += '...';
            }
        }
        page.drawText(finalText, {
            x,
            y,
            size,
            font,
            color: rgb(color.r / 255, color.g / 255, color.b / 255),
            opacity: bold ? 1 : 0.85,
        });
    };

    // Logo
    page.drawImage(logoImage, {
        x: 50,
        y: height - 70,
        width: 100,
        height: 50,
    });

    // Right Info
    const topY = height - 50;
    drawText(`Order ID: ${order?._id?.toString().slice(-6)}`, 400, topY, 12, { r: 0, g: 0, b: 0 }, true);
    const invoiceDate = order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Date not available';
    drawText(`Create Date: ${invoiceDate}`, 400, topY - 15);
    drawText(`Delivery Partner: Pathao`, 400, topY - 30);

    // Title
    let y = height - 100;
    drawText('Unique Store BD - Order Invoice', 50, y, 18, { r: 0, g: 0, b: 0 }, true);

    y -= 30;

    // Customer Details
    drawText(`Name: ${order.name}`, 50, y);
    y -= 18;
    drawText(`Address: ${order.address}`, 50, y);
    y -= 18;
    drawText(`City: ${order.city}`, 50, y);
    y -= 18;
    drawText(`Mobile No: ${order.mobile}`, 50, y);
    y -= 18;


    // Product Table Header
    drawText('Products:', 50, y, 14, { r: 0, g: 0, b: 0 }, true);
    y -= 20;

    // Table Header Background
    page.drawRectangle({ x: 45, y: y - 5, width: 510, height: 22, color: rgb(0.15, 0.15, 0.15) });
    drawText('PRODUCT NAME', 50, y, 12, { r: 255, g: 255, b: 255 }, true);
    drawText('QTY', 350, y, 12, { r: 255, g: 255, b: 255 }, true);
    drawText('PRICE', 450, y, 12, { r: 255, g: 255, b: 255 }, true);
    y -= 25;

    // Product List
    order.cartItems.forEach((item, index) => {
        drawText(`${index + 1}. ${item.name}`, 50, y, 12, { r: 0, g: 0, b: 0 }, false, 280);
        drawText(`${item.quantity}`, 350, y);
        drawText(`${item.price} Tk`, 450, y);
        y -= 18;
    });

    // Divider
    y -= 15;
    page.drawRectangle({ x: 45, y, width: 510, height: 1, color: rgb(0.8, 0.8, 0.8) });
    y -= 15;

    // Final Amounts
    let summaryY = y > 200 ? y : 120;

   
    drawText(`Subtotal: ${order.subtotal} Tk`, 400, summaryY, 13, { r: 0, g: 0, b: 0 }, true);
    summaryY -= 18;

 drawText(`Delivery Charge : ${order.deliveryCharge} Tk`, 400, summaryY);
    summaryY -= 18;

    if (order.paymentType === "partial") {
        drawText(`Advance Paid : ${order.payNowAmount} Tk`, 400, summaryY, 12, { r: 0, g: 0, b: 0 }, true);
        summaryY -= 18;
        drawText(`Pay to Rider : ${order.payToRiderAmount} Tk`, 400, summaryY, 12, { r: 0, g: 0, b: 0 }, true);
        summaryY -= 18;
    } else {
        drawText(`Payment : Full Paid`, 400, summaryY, 12, { r: 0, g: 128, b: 0 }, true);
        summaryY -= 18;
    }

    // Draw Total
    drawText(`Total: ${order.totalAmount} Tk`, 400, summaryY, 14, { r: 0, g: 0, b: 0 }, true);
    page.drawRectangle({
        x: 390,
        y: summaryY - 5,
        width: 180,
        height: 1,
        color: rgb(0, 0, 0),
    });

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, `invoice-${order._id}.pdf`);
}
