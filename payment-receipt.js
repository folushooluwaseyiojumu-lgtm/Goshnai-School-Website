// =====================================
// PAYMENT RECEIPT
// =====================================

const receiptBox =
    document.getElementById("receipt");


// =====================================
// GET RECEIPT REFERENCE
// =====================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const reference =
    urlParams.get("reference");


// =====================================
// LOAD PAYMENT
// =====================================

function loadReceipt() {

    if (!reference) {

        receiptBox.innerHTML = `
            <p>
                No payment reference was provided.
            </p>
        `;

        return;
    }


    const payments =
        JSON.parse(
            localStorage.getItem("pendingPayments")
        ) || [];


    const payment =
        payments.find(function(item) {

            return item.reference === reference;

        });


    if (!payment) {

        receiptBox.innerHTML = `
            <p>
                Payment receipt could not be found.
            </p>
        `;

        return;
    }


    if (payment.status !== "Approved") {

        receiptBox.innerHTML = `

            <div class="application-card">

                <h3>
                    Payment Not Approved
                </h3>

                <p>
                    This payment has not yet been
                    approved by the school.
                </p>

                <p>
                    <strong>Reference:</strong>
                    ${payment.reference}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${payment.status}
                </p>

            </div>

        `;

        return;
    }


    // =====================================
    // MULTIPLE CHILDREN
    // =====================================

    let childrenHTML = "";

    let totalAmount = 0;


    if (
        payment.children &&
        Array.isArray(payment.children)
    ) {

        payment.children.forEach(
            function(child) {

                const amount =
                    Number(
                        child.amount ||
                        child.paymentAmount ||
                        child.amountPaid ||
                        0
                    );


                totalAmount += amount;


                childrenHTML += `

                    <tr>

                        <td>
                            ${child.studentName || ""}
                        </td>

                        <td>
                            ${child.studentClass || ""}
                        </td>

                        <td>
                            ₦${amount.toLocaleString()}
                        </td>

                    </tr>

                `;

            }
        );


    } else {

        // =====================================
        // ONE CHILD
        // =====================================

        totalAmount =
            Number(payment.amount || 0);


        childrenHTML = `

            <tr>

                <td>
                    ${payment.studentName || ""}
                </td>

                <td>
                    ${payment.studentClass || ""}
                </td>

                <td>
                    ₦${totalAmount.toLocaleString()}
                </td>

            </tr>

        `;

    }


    // =====================================
    // DISPLAY RECEIPT
    // =====================================

    receiptBox.innerHTML = `

        <div class="payment-receipt">

            <h2>
                Goshnai Montessori Academy
            </h2>

            <h3>
                OFFICIAL PAYMENT RECEIPT
            </h3>


            <hr>


            <p>
                <strong>
                    Payment Reference:
                </strong>

                ${payment.reference}
            </p>


            <p>
                <strong>
                    Payment Date:
                </strong>

                ${
                    payment.verifiedDate ||
                    payment.date ||
                    "Not available"
                }
            </p>


            <p>
                <strong>
                    Payment Method:
                </strong>

                Bank Transfer
            </p>


            <p>
                <strong>
                    Status:
                </strong>

                <span>
                    Approved
                </span>
            </p>


            <hr>


            <h4>
                Student Payment Details
            </h4>


            <table>

                <thead>

                    <tr>

                        <th>
                            Student
                        </th>

                        <th>
                            Class
                        </th>

                        <th>
                            Amount Paid
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${childrenHTML}

                </tbody>


                <tfoot>

                    <tr>

                        <th colspan="2">
                            Total Paid
                        </th>

                        <th>
                            ₦${totalAmount.toLocaleString()}
                        </th>

                    </tr>

                </tfoot>

            </table>


            <hr>


            <p>
                This receipt confirms that the
                payment has been verified and
                approved by Goshnai Montessori
                Academy.
            </p>


            <p>
                <strong>
                    Thank you.
                </strong>
            </p>

        </div>

    `;

}


// =====================================
// START
// =====================================

loadReceipt();
// =====================================
// PRINT RECEIPT
// =====================================

function printReceipt() {

    window.print();

}
document.addEventListener("DOMContentLoaded", function () {

    const printButton =
        document.getElementById("printReceiptButton");

    if (printButton) {

        printButton.addEventListener("click", function () {

            window.print();

        });

    }

});
