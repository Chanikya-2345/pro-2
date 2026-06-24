document.querySelectorAll('.buy-btn').forEach(button => {

    button.addEventListener('click', () => {

        const productCard = button.closest('.product-card');

        const productName =
            productCard.querySelector('h3').innerText;

        const price =
            productCard.querySelector('.price').innerText;

        const name =
            prompt("Enter Your Name");

        if (!name) return;

        const phone =
            prompt("Enter Your Phone Number");

        if (!phone) return;

        const quantity =
            prompt("Enter Quantity", "1") || "1";

        const message =
`🕯️ New Order - Layali Lumina

Customer: ${name}
Phone: ${phone}

Product: ${productName}
Price: ${price}
Quantity: ${quantity}`;

alert(
"✅ Thank you for choosing Layali Lumina!\n\nYou will now be redirected to WhatsApp to confirm your order."
);
        window.location.href =
            "https://wa.me/919490466386?text=" +
            encodeURIComponent(message);

    });

});

// ============================
// LAYALI LUMINA ORDER SYSTEM
// ============================

let selectedProduct = "";
let selectedPrice = "";

const modal =
document.getElementById("orderModal");

const closeBtn =
document.querySelector(".close-order");

document.querySelectorAll('.buy-btn')
.forEach(button => {

    button.addEventListener('click', () => {

        const card =
        button.closest('.product-card');

        selectedProduct =
        card.querySelector('h3').innerText;

        selectedPrice =
        card.querySelector('.price').innerText;

        modal.style.display = "flex";

    });

});

closeBtn.onclick = () => {
    modal.style.display = "none";
};

document
.getElementById("sendOrderBtn")
.addEventListener("click", () => {


    const name =
    document.getElementById("customerName").value;

    const phone =
    document.getElementById("customerPhone").value;

    const address =
    document.getElementById("customerAddress").value;

    const qty =
    document.getElementById("orderQty").value;

    if(!name || !phone || !address){

        alert("Please fill all fields");

        return;
    }

    const price =
    parseInt(
        selectedPrice.replace(/[^\d]/g,'')
    );

    const total =
    price * qty;

    const message =

`🕯️ New Order - Layali Lumina
   const orderId =
"LL" +
Date.now().toString().slice(-6);
Order ID: ${orderId}

Customer: ${name}

Phone: ${phone}

Address:
${address}

Product:
${selectedProduct}

Price:
${selectedPrice}

Quantity:
${qty}

Total:
₹${total}`;

    window.location.href =
    "https://wa.me/919490466386?text="
    + encodeURIComponent(message);

});

