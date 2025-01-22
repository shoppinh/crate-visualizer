"use server"

import { OrderFormData } from "@/components/OrderForm"
import nodemailer from "nodemailer"

export async function sendEmail(crateDetails: OrderFormData) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  // Format the date to be more readable
  const formattedDate = new Date(crateDetails.dateRequired).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
          .details {
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #dee2e6;
            border-radius: 5px;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            font-weight: bold;
            color: #0066cc;
            margin-bottom: 10px;
          }
          .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            font-size: 0.9em;
            color: #666;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          td {
            padding: 8px;
            border-bottom: 1px solid #dee2e6;
          }
          td:first-child {
            font-weight: bold;
            width: 40%;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Custom Crate Order Details</h2>
            <p>Thank you for using our Wooden Crate Visualizer.</p>
          </div>
          
          <div class="details">
            <div class="section">
              <div class="section-title">Customer Information</div>
              <table>
                <tr>
                  <td>Your Name:</td>
                  <td>${crateDetails.name}</td>
                </tr>
                <tr>
                  <td>Business Name:</td>
                  <td>${crateDetails.businessName}</td>
                </tr>
                <tr>
                  <td>Address of Delivery:</td>
                  <td>${crateDetails.deliveryAddress}</td>
                </tr>
              </table>
            </div>

            <div class="section">
              <div class="section-title">Crate Specifications</div>
              <table>
                <tr>
                  <td>Dimensions:</td>
                  <td>${crateDetails.width}mm × ${crateDetails.height}mm × ${crateDetails.depth}mm</td>
                </tr>
                <tr>
                  <td>Quantity:</td>
                  <td>${crateDetails.quantity} crate(s)</td>
                </tr>
                <tr>
                  <td>Weight Rating:</td>
                  <td>${crateDetails.weight} kg</td>
                </tr>
                <tr>
                  <td>Total Weight:</td>
                  <td>${(crateDetails.weight * crateDetails.quantity).toFixed(2)} kg</td>
                </tr>
                <tr>
                  <td>Date Required:</td>
                  <td>${formattedDate}</td>
                </tr>
              </table>
            </div>
          </div>

          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>If you have any questions, please contact our customer service team.</p>
          </div>
        </div>
      </body>
    </html>
  `

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: process.env.SMTP_TO,
    subject: `Custom Crate Order - ${crateDetails.businessName}`,
    html: htmlContent,
    // Include a plain text version for email clients that don't support HTML
    text: `
Custom Crate Order Details

Customer Information:
- Your Name: ${crateDetails.name}
- Business Name: ${crateDetails.businessName}
- Address of Delivery: ${crateDetails.deliveryAddress}

Crate Specifications:
- Dimensions: ${crateDetails.width}mm × ${crateDetails.height}mm × ${crateDetails.depth}mm
- Quantity: ${crateDetails.quantity} crate(s)
- Weight Rating: ${crateDetails.weight} kg
- Total Weight: ${(crateDetails.weight * crateDetails.quantity).toFixed(2)} kg
- Date Required: ${formattedDate}

This is an automated email. Please do not reply to this message.
If you have any questions, please contact our customer service team.
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true, message: "Email sent successfully" }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, message: "Failed to send email" }
  }
}

