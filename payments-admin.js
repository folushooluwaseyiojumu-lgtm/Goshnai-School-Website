const paymentsList =
    document.getElementById("paymentsList");


// =====================================
// LOAD PAYMENTS
// =====================================

function loadPayments() {

    const payments =
        JSON.parse(
            localStorage.getItem("pendingPayments")
        ) || [];


    if (payments.length === 0) {

        paymentsList.innerHTML =
            "<p>No payment requests found.</p>";

        return;
    }


    paymentsList.innerHTML = "";


    payments.forEach(function(payment, index) {

        let childrenHTML = "";


        // New multiple-child payment
        if (
            payment.children &&
            Array.isArray(payment.children)
        ) {

            payment.children.forEach(function(child) {

                childrenHTML += `

                    <p>
                        <strong>
                            ${child.studentName}
                        </strong>

                        -
                        ${child.studentClass}

                        :
                        ₦${Number(
                            child.balance || 0
                        ).toLocaleString()}
                    </p>

                `;

            });

        } else {

            // Old one-student payment
            childrenHTML = `

                <p>
                    <strong>Student:</strong>
                    ${payment.studentName || "Unknown"}
                </p>

            `;

        }


        paymentsList.innerHTML += `

            <div class="application-card">

                <h3>
                    Payment Request
                </h3>

                <p>
                    <strong>Reference:</strong>
                    ${payment.reference}
                </p>


                <h4>
                    Children
                </h4>

                ${childrenHTML}


                <p>
                    <strong>Amount Transferred:</strong>
                    ₦${Number(
                        payment.amount
                    ).toLocaleString()}
                </p>


                ${
                    payment.totalOutstanding

                    ?

                    `
                    <p>
                        <strong>
                            Combined Outstanding:
                        </strong>

                        ₦${Number(
                            payment.totalOutstanding
                        ).toLocaleString()}
                    </p>
                    `

                    :

                    ""
                }


                <p>
                    <strong>Date:</strong>
                    ${payment.date}
                </p>


                <p>
                    <strong>Status:</strong>
                    ${payment.status}
                </p>


                ${
                    payment.status ===
                    "Pending Verification"

                    ?

                    `
                    <button
                        type="button"
                        onclick="approvePayment(${index})">

                        Approve Payment

                    </button>

                    <button
                        type="button"
                        onclick="rejectPayment(${index})">

                        Reject Payment

                    </button>
                    `

                    :

                    ""
                }


                ${
                  payment.status === "Approved"

?

`
<button
    type="button"
    onclick="viewReceipt(${index})">

    View Receipt

</button>

<button
    type="button"
    onclick="reversePayment(${index})">

    Reverse Payment

</button>
`

:

""
                }

            </div>

        `;

    });

}


// =====================================
// APPROVE PAYMENT
// =====================================

function approvePayment(index) {

    let payments =
        JSON.parse(
            localStorage.getItem("pendingPayments")
        ) || [];


    const payment =
        payments[index];


    if (!payment) {
        return;
    }


    if (
        payment.status !==
        "Pending Verification"
    ) {

        alert(
            "This payment has already been processed."
        );

        return;
    }


    const confirmed =
        confirm(

            "Approve this payment?\n\n" +

            "Reference: " +
            payment.reference +

            "\nAmount: ₦" +
            Number(
                payment.amount
            ).toLocaleString()

        );


    if (!confirmed) {
        return;
    }


    let students =
        JSON.parse(
            localStorage.getItem("students")
        ) || [];


    // =====================================
    // NEW MULTIPLE-CHILD PAYMENT
    // =====================================

    if (
        payment.studentIds &&
        Array.isArray(payment.studentIds) &&
        payment.studentIds.length > 0
    ) {

        const amount =
            Number(payment.amount);


        const selectedStudents =
            students.filter(function(student) {

                return payment.studentIds.includes(
                    student.id
                );

            });


        if (
            selectedStudents.length !==
            payment.studentIds.length
        ) {

            alert(
                "One or more student records could not be found."
            );

            return;
        }


        // =================================
        // DISTRIBUTE PAYMENT
        // =================================

        let remainingAmount =
            amount;


        selectedStudents.forEach(
            function(student) {

                if (remainingAmount <= 0) {
                    return;
                }


                const studentBalance =
                    Number(
                        student.balance || 0
                    );


                // Pay this student's balance
                // first, then continue to next
                // student if money remains.

                const amountForStudent =
                    Math.min(
                        studentBalance,
                        remainingAmount
                    );


                student.amountPaid =
                    Number(
                        student.amountPaid || 0
                    ) +
                    amountForStudent;
                if (!student.termPayments) {
    student.termPayments = {};
}

student.termPayments[payment.term] =
    Number(
        student.termPayments[payment.term] || 0
    ) +
    amountForStudent;


                student.balance =
                    Number(
                        student.totalFees || 0
                    ) -
                    student.amountPaid;


                if (
                    student.balance < 0
                ) {

                    student.balance = 0;

                }


                if (
                    student.balance === 0
                ) {

                    student.feeStatus =
                        "Paid";

                } else if (
                    student.amountPaid > 0
                ) {

                    student.feeStatus =
                        "Part Paid";

                } else {

                    student.feeStatus =
                        "Not Paid";

                }


                // =================================
                // PAYMENT HISTORY
                // =================================

                if (
                    !student.paymentHistory
                ) {

                    student.paymentHistory = [];

                }


                student.paymentHistory.push({

                    reference:
                        payment.reference,

                    amount:
                        amountForStudent,

                    date:
                        new Date()
                            .toLocaleString(),

                    status:
                        "Approved"

                });


                remainingAmount -=
                    amountForStudent;

            }
        );


    } else {

        // =====================================
        // OLD ONE-STUDENT PAYMENT
        // =====================================

        const student =
            students.find(
                function(student) {

                    return student.id ===
                        payment.studentId;

                }
            );


        if (!student) {

            alert(
                "Student record could not be found."
            );

            return;
        }


        const amount =
            Number(payment.amount);


        student.amountPaid =
            Number(
                student.amountPaid || 0
            ) +
            amount;


        student.balance =
            Number(
                student.totalFees || 0
            ) -
            student.amountPaid;


        if (
            student.balance < 0
        ) {

            student.balance = 0;

        }


        if (
            student.balance === 0
        ) {

            student.feeStatus =
                "Paid";

        } else {

            student.feeStatus =
                "Part Paid";

        }


        if (
            !student.paymentHistory
        ) {

            student.paymentHistory = [];

        }


        student.paymentHistory.push({

            reference:
                payment.reference,

            amount:
                amount,

            date:
                new Date()
                    .toLocaleString(),

            status:
                "Approved"

        });

    }


    // =====================================
    // SAVE STUDENTS
    // =====================================

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );


    // =====================================
    // UPDATE PAYMENT
    // =====================================

    payment.status =
        "Approved";


    payment.verifiedDate =
        new Date()
            .toLocaleString();


    localStorage.setItem(
        "pendingPayments",
        JSON.stringify(payments)
    );


    alert(
        "Payment approved successfully!"
    );


    loadPayments();

}


// =====================================
// REJECT PAYMENT
// =====================================

function rejectPayment(index) {

    let payments =
        JSON.parse(
            localStorage.getItem("pendingPayments")
        ) || [];


    const payment =
        payments[index];


    if (!payment) {
        return;
    }


    if (
        payment.status !==
        "Pending Verification"
    ) {

        alert(
            "This payment has already been processed."
        );

        return;
    }


    const confirmed =
        confirm(
            "Reject this payment?"
        );


    if (!confirmed) {
        return;
    }


    payment.status =
        "Rejected";


    payment.rejectedDate =
        new Date()
            .toLocaleString();


    localStorage.setItem(
        "pendingPayments",
        JSON.stringify(payments)
    );


    alert(
        "Payment rejected."
    );


    loadPayments();

}


// =====================================
// REVERSE APPROVED PAYMENT
// =====================================

function reversePayment(index) {

    let payments =
        JSON.parse(
            localStorage.getItem("pendingPayments")
        ) || [];


    const payment =
        payments[index];


    if (!payment) {
        return;
    }


    if (
        payment.status !==
        "Approved"
    ) {

        alert(
            "Only approved payments can be reversed."
        );

        return;
    }


    const confirmed =
        confirm(

            "Are you sure you want to reverse this payment?\n\n" +

            "Reference: " +
            payment.reference +

            "\nAmount: ₦" +
            Number(
                payment.amount
            ).toLocaleString()

        );


    if (!confirmed) {
        return;
    }


    let students =
        JSON.parse(
            localStorage.getItem("students")
        ) || [];


    // =====================================
    // MULTIPLE-CHILD PAYMENT
    // =====================================

    if (
        payment.studentIds &&
        Array.isArray(payment.studentIds) &&
        payment.studentIds.length > 0
    ) {

        const amount =
            Number(payment.amount);


        const selectedStudents =
            students.filter(function(student) {

                return payment.studentIds.includes(
                    student.id
                );

            });


        // Reconstruct the same distribution
        // used during approval.

        let remainingAmount =
            amount;


        selectedStudents.forEach(
            function(student) {

                if (remainingAmount <= 0) {
                    return;
                }


                const balanceBeforePayment =
                    Number(
                        student.balance || 0
                    );


                // The amount originally
                // allocated to this student
                // can be determined from
                // the payment history.

                let allocatedAmount = 0;


                if (
                    student.paymentHistory
                ) {

                    const history =
                        student.paymentHistory.find(
                            function(record) {

                                return (
                                    record.reference ===
                                    payment.reference &&
                                    record.status ===
                                    "Approved"
                                );

                            }
                        );


                    if (history) {

                        allocatedAmount =
                            Number(
                                history.amount
                            );

                    }

                }


                if (
                    allocatedAmount <= 0
                ) {
                    return;
                }


                student.amountPaid =
                    Math.max(
                        0,
                        Number(
                            student.amountPaid || 0
                        ) -
                        allocatedAmount
                    );


                student.balance =
                    Number(
                        student.totalFees || 0
                    ) -
                    student.amountPaid;


                if (
                    student.balance < 0
                ) {

                    student.balance = 0;

                }


                if (
                    student.balance === 0
                ) {

                    student.feeStatus =
                        "Paid";

                } else if (
                    student.amountPaid > 0
                ) {

                    student.feeStatus =
                        "Part Paid";

                } else {

                    student.feeStatus =
                        "Not Paid";

                }


                if (
                    !student.paymentHistory
                ) {

                    student.paymentHistory = [];

                }


                student.paymentHistory.push({

                    reference:
                        payment.reference,

                    amount:
                        allocatedAmount,

                    date:
                        new Date()
                            .toLocaleString(),

                    status:
                        "Reversed"

                });


                remainingAmount -=
                    allocatedAmount;

            }
        );


    } else {

        // =====================================
        // OLD ONE-STUDENT PAYMENT
        // =====================================

        const student =
            students.find(
                function(student) {

                    return student.id ===
                        payment.studentId;

                }
            );


        if (!student) {

            alert(
                "Student record could not be found."
            );

            return;
        }


        student.amountPaid =
            Math.max(
                0,
                Number(
                    student.amountPaid || 0
                ) -
                Number(payment.amount)
            );


        student.balance =
            Number(
                student.totalFees || 0
            ) -
            student.amountPaid;


        if (
            student.balance < 0
        ) {

            student.balance = 0;

        }


        if (
            student.balance === 0
        ) {

            student.feeStatus =
                "Paid";

        } else if (
            student.amountPaid > 0
        ) {

            student.feeStatus =
                "Part Paid";

        } else {

            student.feeStatus =
                "Not Paid";

        }


        if (
            !student.paymentHistory
        ) {

            student.paymentHistory = [];

        }


        student.paymentHistory.push({

            reference:
                payment.reference,

            amount:
                Number(payment.amount),

            date:
                new Date()
                    .toLocaleString(),

            status:
                "Reversed"

        });

    }


    // =====================================
    // SAVE STUDENTS
    // =====================================

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );


    // =====================================
    // MARK PAYMENT REVERSED
    // =====================================

    payment.status =
        "Reversed";


    payment.reversedDate =
        new Date()
            .toLocaleString();


    localStorage.setItem(
        "pendingPayments",
        JSON.stringify(payments)
    );


    alert(
        "Payment reversed successfully."
    );


    loadPayments();

}


// =====================================
// START
// =====================================

loadPayments();
// =====================================
// VIEW PAYMENT RECEIPT
// =====================================

function viewReceipt(index) {

    const payments =
        JSON.parse(
            localStorage.getItem("pendingPayments")
        ) || [];


    const payment =
        payments[index];


    if (!payment) {

        alert("Payment not found.");

        return;
    }


    if (payment.status !== "Approved") {

        alert(
            "Only approved payments can have a receipt."
        );

        return;
    }


    window.location.href =
        "payment-receipt.html?reference=" +
        encodeURIComponent(
            payment.reference
        );

          }
