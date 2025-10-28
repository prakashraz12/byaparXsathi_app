import Sales from "@/database/model/sales.model";
import { getDateFormat } from "../format-date";
import SalesItem from "@/database/model/sales-item.model";
import { formatNumberWithComma } from "../format-number";
import Shop from "@/database/model/shop.model";

export const salesInvoiceTemplate = (SALES: Sales, salesItems: SalesItem[], shopData: Shop) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
        }
        
        .invoice-container {
            width: 210mm;
            height: 297mm;
            background-color: white;
            margin: 0 auto;
            padding: 40px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            color: #333;
            border-left: 8px solid #007bff;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            border-bottom: 3px solid #007bff;
            padding-bottom: 20px;
        }
        
        .shop-info h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #007bff;
        }
        
        .shop-info p {
            font-size: 12px;
            line-height: 1.6;
            color: #666;
        }
        
        .invoice-title {
            font-size: 36px;
            font-weight: bold;
            color: #333;
        }
        
        .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            font-size: 13px;
        }
        
        .detail-section {
            flex: 1;
        }
        
        .detail-section h3 {
            font-size: 11px;
            font-weight: bold;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 8px;
        }
        
        .detail-section p {
            font-size: 12px;
            line-height: 1.6;
            margin-bottom: 3px;
        }
        
        .bill-to {
            margin-bottom: 30px;
        }
        
        .bill-to h3 {
            font-size: 11px;
            font-weight: bold;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 8px;
        }
        
        .bill-to p {
            font-size: 12px;
            line-height: 1.6;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 12px;
        }
        
        .items-table thead {
            background-color: #007bff;
            color: white;
        }
        
        .items-table th {
            padding: 12px;
            text-align: left;
            font-weight: bold;
            border: 1px solid #007bff;
        }
        
        .items-table td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
        }
        
        .items-table tbody tr:last-child td {
            border-bottom: 1px solid #ddd;
        }
        
        .text-right {
            text-align: right;
        }
        
        .text-center {
            text-align: center;
        }
        
        .summary-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 30px;
        }
        
        .summary-table {
            width: 300px;
            font-size: 12px;
        }
        
        .summary-table tr td {
            padding: 8px 12px;
            border: none;
        }
        
        .summary-table tr td:first-child {
            text-align: left;
            font-weight: 500;
        }
        
        .summary-table tr td:last-child {
            text-align: right;
            font-weight: 500;
        }
        
        .summary-table tr.total-row {
            background-color: #007bff;
            color: white;
            font-weight: bold;
        }
        
        .summary-table tr.total-row td {
            padding: 12px;
        }
        
        .summary-table tr.divider td {
            border-top: 1px solid #ddd;
        }
        
        .payment-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            font-size: 12px;
        }
        
        .payment-info {
            flex: 1;
        }
        
        .payment-info h4 {
            font-weight: bold;
            margin-bottom: 8px;
            font-size: 11px;
            text-transform: uppercase;
        }
        
        .payment-info p {
            margin-bottom: 5px;
            font-size: 11px;
        }
        
        .payment-status {
            flex: 1;
        }
        
        .payment-status h4 {
            font-weight: bold;
            margin-bottom: 8px;
            font-size: 11px;
            text-transform: uppercase;
        }
        
        .status-options, .method-options {
            display: flex;
            gap: 15px;
            margin-bottom: 10px;
            font-size: 11px;
        }
        
        .checkbox {
            width: 14px;
            height: 14px;
            border: 1px solid #333;
            display: inline-block;
            margin-right: 5px;
            vertical-align: middle;
        }
        
        /* Position checkmark inside the checkbox box */
        .checkbox.checked {
            background-color: #007bff;
            border-color: #007bff;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        
        .checkbox.checked::after {
            content: '✓';
            color: white;
            font-weight: bold;
            font-size: 10px;
        }
        
        .remarks {
            margin-bottom: 20px;
            font-size: 12px;
        }
        
        .remarks h4 {
            font-weight: bold;
            margin-bottom: 8px;
            font-size: 11px;
            text-transform: uppercase;
        }
        
        .remarks-box {
            border: 1px solid #ddd;
            padding: 10px;
            min-height: 40px;
            font-size: 11px;
            line-height: 1.5;
        }
        
        .footer {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 11px;
        }
        
        .signature-box {
            text-align: center;
            width: 150px;
        }
        
        .signature-line {
            border-top: 1px solid #333;
            margin-top: 30px;
            padding-top: 5px;
        }
        
        @media print {
            body {
                background-color: white;
                padding: 0;
            }
            
            .invoice-container {
                width: 100%;
                height: 100%;
                box-shadow: none;
                padding: 40px;
                margin: 0;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <!-- Header -->
        <div class="header">
            <div class="shop-info">
                <h1>${shopData.shopName}</h1>
                <p>${shopData.address}<br>
                   
                   Phone: ${shopData.shopPhoneNumber}</p>
            </div>
            <div class="invoice-title">INVOICE</div>
        </div>
        
        <!-- Invoice Details -->
        <div class="invoice-details">
            <div class="detail-section">
                <h3>Invoice Number</h3>
                <p>${SALES.invoiceNumber}</p>
                <h3 style="margin-top: 15px;">Date</h3>
                <p>${getDateFormat(SALES.invoiceDate || 0, "BS", true, true)}</p>
            </div>
            <div class="detail-section">
                <h3>Bill To</h3>
                <p>Name<br>
                   <br>
                </p>
            </div>
        </div>
        
        <!-- Items Table -->
        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 5%;">SN</th>
                    <th style="width: 35%;">Item Name</th>
                    <th style="width: 12%;">Quantity</th>
                    <th style="width: 12%;">Rate</th>
                    <th style="width: 12%;">Discount</th>
                    <th style="width: 24%;" class="text-right">Total Amount</th>
                </tr>
            </thead>
            <tbody>
                ${salesItems
            .map((item: SalesItem, index: number) => `
                    <tr>
                        <td class="text-center">${index + 1}</td>
                        <td>${item.itemName}</td>
                        <td class="text-center">${item.quantity}</td>
                        <td class="text-right">${item.price}</td>
                        <td class="text-right">${item.discountAmount}</td>
                        <td class="text-right">${Number(item.quantity) * Number(item.price) - Number(item.discountAmount)}</td>
                    </tr>
                `)
            .join("")}

            </tbody>
        </table>
        
        <!-- Summary Section -->
        <div class="summary-section">
            <table class="summary-table">
                <tr>
                    <td>Subtotal:</td>
                    <td>${formatNumberWithComma(SALES.subTotalAmount || 0)}</td>
                </tr>
                <tr>
                    <td>Discount:</td>
                    <td>${formatNumberWithComma(SALES.discountAmount || 0)}</td>
                </tr>
                <tr>
                    <td>Tax:</td>
                    <td>${formatNumberWithComma(SALES.taxAmount || 0)}</td>
                </tr>
                <tr>
                    <td>Additional Charges:</td>
                    <td>${formatNumberWithComma(SALES.additionalAmount || 0)}</td>
                </tr>
                <tr class="divider">
                    <td>Grand Total:</td>
                    <td>${formatNumberWithComma(SALES.grandTotalAmount || 0)}</td>
                </tr>
            </table>
        </div>
        
        <!-- Payment Section -->
        <div class="payment-section">
            <div class="payment-info">
                <h4>Payment Method</h4>
                <div class="method-options">
                    <!-- Added checked class to Cash checkbox to show checkmark -->
                    <label><span class="checkbox checked"></span>Cash</label>
                    <label><span class="checkbox"></span>Online</label>
                </div>
                <div class="method-options">
                    <label><span class="checkbox"></span>Cheque</label>
                    <label><span class="checkbox"></span>Online Banking</label>
                </div>
            </div>
            <div class="payment-status">
                <h4>Payment Status</h4>
                <div class="status-options">
                    <label><span class="checkbox"></span>Paid</label>
                    <label><span class="checkbox"></span>Unpaid</label>
                </div>
                <div class="status-options">
                    <label><span class="checkbox"></span>Partially Paid</label>
                </div>
            </div>
        </div>
        
        <!-- Remarks -->
        <div class="remarks">
            <h4>Remarks</h4>
            <div class="remarks-box">
                Add any additional notes or payment terms here.
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="signature-box">
                <div class="signature-line">Authorized Signature</div>
            </div>
            <div class="signature-box">
                <div class="signature-line">Date</div>
            </div>
        </div>
    </div>
</body>
</html>
`;
};
