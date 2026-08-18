import { db, doc, getDoc } from "./firebase-config.js";

// Get order ID from URL
const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

const invoiceContent = document.getElementById("invoiceContent");

if (!orderId) {
  invoiceContent.innerHTML = "<h2>Invoice not found.</h2>";
  throw new Error("Missing order ID");
}

loadInvoice();

async function loadInvoice() {
  try {
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      invoiceContent.innerHTML = "<h2>Order not found.</h2>";
      return;
    }

    const order = orderSnap.data();

    let rows = "";

    (order.items || []).forEach((item) => {
      rows += `
            <tr>
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td>₹${item.price}</td>
                <td>₹${item.qty * item.price}</td>
            </tr>
            `;
    });

    const invoiceNo =
      "LL-" +
      new Date().getFullYear() +
      "-" +
      orderId.substring(0, 6).toUpperCase();

    const date = order.createdAt
      ? order.createdAt.toDate().toLocaleDateString()
      : new Date().toLocaleDateString();

    invoiceContent.innerHTML = `

        <h2>Invoice</h2>

        <p><strong>Invoice No:</strong> ${invoiceNo}</p>

        <p><strong>Date:</strong> ${date}</p>

        <hr>

        <h3>Customer Details</h3>

        <p><strong>Name:</strong> ${order.customerName || "-"}</p>

        <p><strong>Phone:</strong> ${order.phone || "-"}</p>

        <p><strong>Address:</strong> ${order.address || "-"}</p>

        <table>

            <tr>

                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>

            </tr>

            ${rows}

        </table>

        <div class="total">

            Grand Total :
            ₹${Number(order.total || 0).toLocaleString()}

        </div>

        <p>

            <strong>Status:</strong>
            ${order.status || "New"}

        </p>

        <br>

        <hr>

        <center>

            <h3>
                Thank you for shopping with
                Layali Lumina ❤️
            </h3>

        </center>

        `;
  } catch (error) {
    console.error(error);

    invoiceContent.innerHTML = `
            <h2>Unable to load invoice.</h2>
            <p>${error.message}</p>
        `;
  }
}
