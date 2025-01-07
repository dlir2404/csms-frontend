'use client'
import React from 'react';
import { Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { IOder } from '@/shared/types/order';

const PrintBill = ({ order, discount }: { order: IOder, discount?: number }) => {
    const handlePrint = () => {
        // Create a new window for the bill
        const printWindow = window.open('', '_blank');

        // Generate bill HTML
        const billHTML = `
        <!DOCTYPE html>
        <html>
            <head>
                <title>Bill Receipt</title>
                <style>
                    @page {
                        size: 80mm auto;
                        margin: 0;
                    }
                    
                    body {
                        font-family: 'Courier New', monospace;
                        width: 80mm;
                        padding: 10px;
                        margin: 0;
                        font-size: 12px;
                    }

                    .bill-header {
                        text-align: center;
                        font-weight: bold;
                        margin-bottom: 5px;
                    }

                    .bill-info {
                        margin-bottom: 10px;
                    }

                    .bill-info div {
                        display: flex;
                        justify-content: space-between;
                    }

                    .order-content {
                        width: 100%;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 8px;
                    }

                    th {
                        text-align: left;
                        font-weight: normal;
                        padding: 2px 4px;
                    }

                    .product-row {
                        display: grid;
                        grid-template-columns: 30px auto 30px 60px 70px;
                        width: 100%;
                        margin-bottom: 4px;
                        padding: 2px 4px;
                    }

                    .product-option {
                        grid-column: 1 / -1;
                        padding-left: 34px;
                        color: #666;
                        font-size: 11px;
                    }

                    .text-right {
                        text-align: right;
                    }

                    .text-center {
                        text-align: center;
                    }

                    .total-section {
                        margin: 8px 0;
                        border-top: 1px solid #000;
                        padding-top: 8px;
                    }

                    .total-row {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 4px;
                    }

                    .total-row.bold {
                        font-weight: bold;
                    }

                    .store-info {
                        text-align: center;
                        margin-top: 15px;
                        font-size: 11px;
                    }

                    .thank-you {
                        text-align: center;
                        margin-top: 10px;
                        font-size: 11px;
                        padding-bottom: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="bill-header">
                    HÓA ĐƠN THANH TOÁN
                    <div>Số HĐ: ${order.id}</div>
                </div>

                <div class="bill-info">
                    <div>
                        <span>Mã HĐ: #${order.id || 'GH8ZV'}</span>
                        <span>TN: ${order?.createdBy?.fullName || order?.createdBy?.username}</span>
                    </div>
                    <div>
                        <span>Ngày: ${new Date().toLocaleDateString('vi-VN')}</span>
                        <span>Giờ: ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>

                <div class="order-content">
                    <table>
                        <tr>
                            <th style="width: 30px">STT</th>
                            <th>Tên món</th>
                            <th style="width: 20px; text-align: center">SL</th>
                            <th style="width: 60px; text-align: right">Đơn giá</th>
                            <th style="width: 80px; text-align: right">Thành tiền</th>
                        </tr>
                    </table>

                    <div class="items">
                        ${order.products.map((item, index) => `
                            <div class="product-row">
                                <span>${index + 1}</span>
                                <span>${item.name}</span>
                                <span class="text-center">${item.quantity}</span>
                                <span class="text-right">${item.price.toLocaleString()}</span>
                                <span class="text-right">${((item?.quantity || 0) * item.price).toLocaleString()}</span>
                                ${item.note ? `<div class="product-option">- ${item.note}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="total-section">
                    <div class="total-row">
                        <span>Thành tiền:</span>
                        <span>${order.totalPrice.toLocaleString()}đ</span>
                    </div>
                    <div class="total-row">
                        <span>VAT:</span>
                        <span>${(order.totalPrice / 10).toLocaleString()}đ</span>
                    </div>
                    <div class="total-row">
                        <span>Discount:</span>
                        <span>${(discount || 0).toLocaleString()}đ</span>
                    </div>
                    <div class="total-row bold">
                        <span>Tổng tiền:</span>
                        <span>${(order.totalPrice * 1.1 - (discount || 0)).toLocaleString()}đ</span>
                    </div>
                    ${order.payment ? `
                        <div class="total-row">
                            <span>+ Thanh toán (${order.payment.paymentMethod})</span>
                            <span>${order.totalPrice.toLocaleString()}đ</span>
                        </div>
                    ` : ''}
                </div>

                <div class="store-info">
                    CSMS<br/>
                </div>

                <div class="thank-you">
                    Cảm ơn Quý Khách<br/>
                </div>
            </body>
        </html>
        `;

        if (printWindow != null) {
            // Write the bill content to the new window
            printWindow.document.write(billHTML);

            // Wait for content to load then print
            printWindow.document.close();
            printWindow.onload = function () {
                printWindow.print();
                printWindow.onafterprint = function () {
                    printWindow.close();
                };
            };
        }
    };

    return (
        <Button
            onClick={handlePrint}
            size='large'
            className="flex items-center gap-2"
        >
            <PrinterOutlined className='w-4 h-4' />
            Print Bill
        </Button>
    );
};

export default PrintBill;