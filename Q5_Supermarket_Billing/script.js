/* =========================================
   FRESHMART SUPERMARKET BILLING SYSTEM
   ========================================= */


/*
 * PRODUCT DATABASE
 *
 * Array of objects.
 */
const products = [

    {
        name: "Rice",
        price: 60
    },

    {
        name: "Wheat",
        price: 45
    },

    {
        name: "Milk",
        price: 30
    },

    {
        name: "Bread",
        price: 40
    },

    {
        name: "Eggs",
        price: 70
    },

    {
        name: "Sugar",
        price: 50
    },

    {
        name: "Tea",
        price: 120
    },

    {
        name: "Biscuits",
        price: 30
    },

    {
        name: "Coffee",
        price: 180
    },

    {
        name: "Cooking Oil",
        price: 150
    }

];


/*
 * CART
 *
 * Stores products currently
 * added to the bill.
 */
let cart = [];


/*
 * BILLING CONSTANTS
 */

const DISCOUNT_RATE = 0.10;

const DISCOUNT_LIMIT = 2000;

const GST_RATE = 0.05;


/* =========================================
   ADD PRODUCT
   ========================================= */

function addProduct() {

    const productName =
        document.getElementById("product").value;


    const quantity =
        Number(
            document.getElementById("quantity").value
        );


    if (productName === "") {

        alert("Please select a product.");

        return;

    }


    if (quantity <= 0 || isNaN(quantity)) {

        alert("Please enter a valid quantity.");

        return;

    }


    /*
     * Find product in product database.
     */
    const selectedProduct =
        products.find(
            product =>
                product.name === productName
        );


    /*
     * Check if product is already
     * present in cart.
     */
    const existingItem =
        cart.find(
            item =>
                item.name === productName
        );


    if (existingItem) {

        existingItem.quantity += quantity;

    } else {

        cart.push({

            name: selectedProduct.name,

            price: selectedProduct.price,

            quantity: quantity

        });

    }


    displayBill();


    document.getElementById("quantity").value = 1;

}


/* =========================================
   DISPLAY BILL
   ========================================= */

function displayBill() {

    const billBody =
        document.getElementById("billBody");


    const emptyMessage =
        document.getElementById("emptyMessage");


    billBody.innerHTML = "";


    if (cart.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }


    /*
     * Create table rows dynamically.
     */
    cart.forEach(
        function (item, index) {

            const amount =
                item.price * item.quantity;


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${index + 1}</td>

                <td>
                    <strong>
                        ${item.name}
                    </strong>
                </td>

                <td>
                    ₹${item.price.toFixed(2)}
                </td>

                <td>
                    ${item.quantity}
                </td>

                <td>
                    <strong>
                        ₹${amount.toFixed(2)}
                    </strong>
                </td>

                <td>

                    <button
                        class="remove-btn"
                        onclick="removeItem(${index})"
                    >
                        Remove
                    </button>

                </td>
            `;


            billBody.appendChild(row);

        }
    );


    calculateBill();

    updateItemCount();

}


/* =========================================
   CALCULATE BILL
   ========================================= */

function calculateBill() {

    let subtotal = 0;


    /*
     * Calculate subtotal.
     */
    cart.forEach(
        function (item) {

            subtotal +=
                item.price *
                item.quantity;

        }
    );


    /*
     * Apply 10% discount if
     * subtotal is ₹1000 or more.
     */
    let discount = 0;


    if (subtotal >= DISCOUNT_LIMIT) {

        discount =
            subtotal *
            DISCOUNT_RATE;

    }


    /*
     * Amount after discount.
     */
    const taxableAmount =
        subtotal - discount;


    /*
     * Calculate GST.
     */
    const gst =
        taxableAmount *
        GST_RATE;


    /*
     * Final amount.
     */
    const grandTotal =
        taxableAmount + gst;


    /*
     * Update DOM.
     */
    document.getElementById("subtotal")
        .textContent =
        subtotal.toFixed(2);


    document.getElementById("discount")
        .textContent =
        discount.toFixed(2);


    document.getElementById("taxable")
        .textContent =
        taxableAmount.toFixed(2);


    document.getElementById("gst")
        .textContent =
        gst.toFixed(2);


    document.getElementById("grandTotal")
        .textContent =
        grandTotal.toFixed(2);


    /*
     * Update change amount.
     */
    calculateChange(grandTotal);


    /*
     * Return values so that
     * Generate Bill can use them.
     */
    return {

        subtotal: subtotal,

        discount: discount,

        taxableAmount: taxableAmount,

        gst: gst,

        grandTotal: grandTotal

    };

}


/* =========================================
   CALCULATE CHANGE
   ========================================= */

function calculateChange(grandTotal) {

    const received =
        Number(
            document.getElementById(
                "amountReceived"
            ).value
        );


    let change = 0;


    if (received >= grandTotal) {

        change =
            received - grandTotal;

    }


    document.getElementById("change")
        .textContent =
        change.toFixed(2);

}


/* =========================================
   UPDATE ITEM COUNT
   ========================================= */

function updateItemCount() {

    let totalItems = 0;


    cart.forEach(
        function (item) {

            totalItems +=
                item.quantity;

        }
    );


    document.getElementById("itemCount")
        .textContent =
        totalItems +
        (
            totalItems === 1
                ? " Item"
                : " Items"
        );

}


/* =========================================
   REMOVE ITEM
   ========================================= */

function removeItem(index) {

    cart.splice(index, 1);

    displayBill();

}


/* =========================================
   CLEAR CART
   ========================================= */

function clearCart() {

    cart = [];


    document.getElementById("amountReceived")
        .value = "";


    document.getElementById("receiptSection")
        .style.display = "none";


    displayBill();

}


/* =========================================
   GENERATE BILL
   ========================================= */

function generateBill() {

    /*
     * Prevent empty bill.
     */
    if (cart.length === 0) {

        alert(
            "Please add at least one product."
        );

        return;

    }


    /*
     * Calculate all bill values.
     */
    const bill =
        calculateBill();


    /*
     * Get payment details.
     */
    const paymentMode =
        document.getElementById(
            "paymentMode"
        ).value;


    const amountReceived =
        Number(
            document.getElementById(
                "amountReceived"
            ).value
        );


    /*
     * For cash payment,
     * make sure enough money was received.
     */
    if (
        paymentMode === "Cash" &&
        amountReceived < bill.grandTotal
    ) {

        alert(
            "Amount received is less than the bill total."
        );

        return;

    }


    /*
     * Generate unique bill number.
     */
    const billNumber =
        "FM" +
        Date.now().toString().slice(-8);


    /*
     * Get current date/time.
     */
    const now =
        new Date();


    const date =
        now.toLocaleDateString(
            "en-IN"
        );


    const time =
        now.toLocaleTimeString(
            "en-IN"
        );


    /*
     * Fill receipt information.
     */
    document.getElementById(
        "receiptBillNo"
    ).textContent =
        billNumber;


    document.getElementById(
        "receiptDate"
    ).textContent =
        date;


    document.getElementById(
        "receiptTime"
    ).textContent =
        time;


    /*
     * Generate receipt items.
     */
    const receiptBody =
        document.getElementById(
            "receiptBody"
        );


    receiptBody.innerHTML = "";


    cart.forEach(
        function (item) {

            const amount =
                item.price *
                item.quantity;


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${item.name}
                </td>

                <td>
                    ${item.quantity}
                </td>

                <td>
                    ₹${item.price.toFixed(2)}
                </td>

                <td>
                    ₹${amount.toFixed(2)}
                </td>

            `;


            receiptBody.appendChild(row);

        }
    );


    /*
     * Fill receipt totals.
     */
    document.getElementById(
        "receiptSubtotal"
    ).textContent =
        bill.subtotal.toFixed(2);


    document.getElementById(
        "receiptDiscount"
    ).textContent =
        bill.discount.toFixed(2);


    document.getElementById(
        "receiptGST"
    ).textContent =
        bill.gst.toFixed(2);


    document.getElementById(
        "receiptGrandTotal"
    ).textContent =
        bill.grandTotal.toFixed(2);


    /*
     * Payment information.
     */
    document.getElementById(
        "receiptPayment"
    ).textContent =
        paymentMode;


    document.getElementById(
        "receiptReceived"
    ).textContent =
        amountReceived.toFixed(2);


    const change =
        Math.max(
            0,
            amountReceived -
            bill.grandTotal
        );


    document.getElementById(
        "receiptChange"
    ).textContent =
        change.toFixed(2);


    /*
     * Show generated receipt.
     */
    document.getElementById(
        "receiptSection"
    ).style.display =
        "block";


    /*
     * Smoothly scroll to receipt.
     */
    document.getElementById(
        "receiptSection"
    ).scrollIntoView({
        behavior: "smooth"
    });

}


/* =========================================
   EVENT LISTENERS
   ========================================= */

document
    .getElementById("addBtn")
    .addEventListener(
        "click",
        addProduct
    );


document
    .getElementById("clearBtn")
    .addEventListener(
        "click",
        clearCart
    );


document
    .getElementById("generateBtn")
    .addEventListener(
        "click",
        generateBill
    );


document
    .getElementById("printBtn")
    .addEventListener(
        "click",
        function () {

            window.print();

        }
    );


/*
 * Recalculate change whenever
 * amount received changes.
 */
document
    .getElementById("amountReceived")
    .addEventListener(
        "input",
        function () {

            const bill =
                calculateBill();

            calculateChange(
                bill.grandTotal
            );

        }
    );


/*
 * Initial display.
 */
displayBill();