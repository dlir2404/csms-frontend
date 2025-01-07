'use client'
import React from 'react';
import { Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { IOder } from '@/shared/types/order';

const PrintBill = ({ order }: { order: IOder }) => {
    const handlePrint = () => {
        console.log(order)
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
                size: 80mm auto; /* Chiều rộng cố định, chiều cao tự động */
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

                table {
                width: 100%;
                margin: 10px 0;
                border-collapse: collapse;
                }

                th {
                text-align: left;
                font-weight: normal;
                }

                .product-row {
                margin-bottom: 4px;
                }

                .product-name {
                margin-bottom: 2px;
                }

                .product-option {
                padding-left: 15px;
                color: #666;
                font-size: 11px;
                }

                .total-section {
                margin: 8px 0;
                border-top: 1px solid #000;
                padding-top: 8px;
                }

                .total-row {
                display: flex;
                justify-content: space-between;
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
                </div>
            </div>

            <table>
                <tr>
                <th style="width: 30px">STT</th>
                <th>Tên món</th>
                <th style="width: 30px">SL</th>
                <th style="width: 60px; text-align: right">Đơn giá</th>
                <th style="width: 70px; text-align: right">Thành tiền</th>
                </tr>
            </table>

            <div class="items">
                ${order.products.map((item, index) => `
                <div class="product-row">
                    <div class="product-name">
                    <div style="display: flex; justify-content: space-between">
                        <span>${index + 1}. ${item.name}</span>
                        <span style="text-align: right">${item.quantity} ${((item?.quantity || 0) * item.price).toLocaleString()}đ</span>
                    </div>
                    </div>
                    ${item.note ? `<div class="product-option">- ${item.note}</div>` : ''}
                </div>
                `).join('')}
            </div>

            <div class="total-section">
                <div class="total-row">
                <span>Thành tiền:</span>
                <span>${order.totalPrice.toLocaleString()}đ</span>
                </div>
                <div class="total-row">
                <span>Tổng tiền:</span>
                <span>${order.totalPrice.toLocaleString()}đ</span>
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