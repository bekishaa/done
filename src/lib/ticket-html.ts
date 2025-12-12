"use client";

// Client-side ticket HTML generator for print preview (no SMS side effects)

export type ClientTicketHtmlInput = {
  name: string;
  phoneNumber: string;
  reasonForPayment: string;
  cashInFigure: number;
  amountInWords: string;
  payersIdentification?: string;
  modeOfPayment: 'CASH' | 'BANK';
  bankReceiptNo?: string;
  preparedBy: string;
  cashierSignature?: string;
  date: string; // human-readable date
  receiptNo: string; // ticket number
};

export function createClientTicketHtml(input: ClientTicketHtmlInput): string {
  const transactionId = Date.now().toString() + Math.floor(100 + Math.random() * 900).toString();
  const transactionTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const {
    receiptNo,
    date,
    name,
    reasonForPayment,
    cashInFigure,
    preparedBy,
    payersIdentification,
    modeOfPayment,
    bankReceiptNo,
  } = input;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const stampPath = origin ? `${origin}/stamp.png` : '/stamp.png';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Receipt</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
        <style>
            body { 
                font-family: 'Roboto', sans-serif; 
                background-color: #f0f2f5; 
                color: #1a202c; 
                margin: 0; 
                padding: 1rem;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                min-height: 100vh;
            }
            .receipt-container { 
                max-width: 450px; 
                width: 100%;
                background-color: #ffffff; 
                border-radius: 16px; 
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background-color: #5D4037; /* Dark Brown */
                color: white;
                padding: 1.5rem;
                text-align: center;
                border-bottom: 5px solid #8B4513; /* Brown Accent */
            }
            .header h1 {
                margin: 0;
                font-size: 1.5rem;
                font-weight: 700;
            }
             .details-card {
                margin: 1.5rem;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                overflow: hidden;
             }
             .card-header {
                background-color: #795548; /* Medium Brown */
                color: white;
                padding: 0.75rem 1.25rem;
                font-weight: 500;
             }
            .details-grid { 
                padding: 1.25rem;
                display: grid;
                gap: 1rem;
                position: relative;
            }
            .detail-item {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                padding-bottom: 1rem;
                border-bottom: 1px dashed #cbd5e1;
            }
            .detail-item:last-child {
                border-bottom: none;
                padding-bottom: 0;
            }
            .label { 
                font-weight: 500; 
                color: #4a5568;
                flex-basis: 40%;
            }
            .value { 
                font-weight: 500;
                color: #1a202c;
                text-align: right;
                flex-basis: 60%;
            }
            .value .sub-value {
                display: block;
                font-size: 0.875rem;
                color: #718096;
            }
             .value-amount {
                font-size: 1.25rem;
                font-weight: 700;
                color: #5D4037;
             }
             .watermark {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                pointer-events: none;
                z-index: 0;
             }
             .watermark img {
                max-width: 80%;
                opacity: 0.42; /* Increase visibility */
                mix-blend-mode: multiply; /* Preserve stamp color and blend with paper */
                filter: none; /* Keep original blue */
             }
             .footer {
                padding: 1.5rem;
                text-align: center;
                font-size: 0.8rem;
                color: #718096;
                background-color: #f7fafc;
             }
        </style>
    </head>
    <body>
        <div class="receipt-container">
            <div class="header">
                <h1>Gihon Saccos</h1>
            </div>
            <div class="details-card">
                 <div class="card-header">Payment Details</div>
                 <div class="details-grid">
                    ${stampPath ? `<div class="watermark"><img src="${stampPath}" alt="Company Stamp" onerror="this.style.display='none'" /></div>` : ''}
                    <div class="detail-item">
                        <div class="label">Transaction Time</div>
                        <div class="value">
                            ${date}
                            <span class="sub-value">${transactionTime}</span>
                        </div>
                    </div>
                     <div class="detail-item">
                        <div class="label">Transaction Type</div>
                        <div class="value">${reasonForPayment}</div>
                    </div>
                     <div class="detail-item">
                        <div class="label">Amount</div>
                        <div class="value value-amount">${cashInFigure.toFixed(2)} ETB</div>
                    </div>
                     <div class="detail-item">
                        <div class="label">Customer Name</div>
                        <div class="value">${name}</div>
                    </div>
                     <div class="detail-item">
                        <div class="label">Sales Name</div>
                        <div class="value">${preparedBy}</div>
                    </div>
                    <div class="detail-item">
                        <div class="label">Payment Mode</div>
                        <div class="value">${modeOfPayment === 'BANK' ? 'Bank' : 'Cash'}</div>
                    </div>
                    ${modeOfPayment === 'BANK' && bankReceiptNo ? `
                    <div class="detail-item">
                        <div class="label">Bank Receipt No</div>
                        <div class="value">${bankReceiptNo}</div>
                    </div>
                    ` : ''}
                     ${payersIdentification ? `
                     <div class="detail-item">
                        <div class="label">Payer ID</div>
                        <div class="value">${payersIdentification}</div>
                    </div>
                     ` : ''}
                     <div class="detail-item">
                        <div class="label">Ticket No</div>
                        <div class="value">${receiptNo}</div>
                    </div>
                     <div class="detail-item">
                        <div class="label">Transaction ID</div>
                        <div class="value">${transactionId}</div>
                    </div>
                 </div>
            </div>
            <div class="footer">
                Thank you for your payment!
            </div>
        </div>
        <script>
          (function(){
            function waitForImages(done){
              var imgs = Array.prototype.slice.call(document.images);
              if (imgs.length === 0) return done();
              var loaded = 0;
              function check(){ loaded++; if (loaded >= imgs.length) done(); }
              imgs.forEach(function(img){
                if (img.complete) { check(); }
                else {
                  img.addEventListener('load', check);
                  img.addEventListener('error', check);
                }
              });
            }
            window.addEventListener('load', function(){
              var printed = false;
              function doPrint(){
                if (printed) return; printed = true;
                try { window.focus(); } catch(e){}
                try { window.print(); } catch(e){}
              }
              // Try after images load
              setTimeout(function(){
                waitForImages(doPrint);
              }, 50);
              // Fallback: print anyway after 1500ms
              setTimeout(doPrint, 1500);
            });
          })();
        </script>
    </body>
    </html>
  `;
}


