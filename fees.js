// =====================================
// GOSHNAI MONTESSORI ACADEMY
// SCHOOL FEES SYSTEM
// =====================================


// =====================================
// GET STUDENT FEES
// =====================================

function getStudentFees(studentClass) {

    const className =
        (studentClass || "").toLowerCase();

    let annualTuition = 0;
    let uniformFee = 0;

    if (className.includes("nursery")) {

        annualTuition = 100000;
        uniformFee = 10000;

    } else if (className.includes("primary")) {

        annualTuition = 120000;
        uniformFee = 12000;

    } else if (className.includes("jss")) {

        annualTuition = 150000;
        uniformFee = 15000;

    } else if (className.includes("ss")) {

        annualTuition = 180000;
        uniformFee = 15000;
    }


    const termFee =
        annualTuition / 3;


    return {

        annualTuition: annualTuition,

        termFee: termFee,

        uniformFee: uniformFee,

        firstTermNewStudent:
            termFee + uniformFee,

        secondTerm:
            termFee,

        thirdTerm:
            termFee,

        totalAnnual:
            annualTuition + uniformFee
    };
}


// =====================================
// GET STUDENTS
// =====================================

function getStudents() {

    try {

        return JSON.parse(
            localStorage.getItem("students")
        ) || [];

    } catch (error) {

        console.error(
            "Error loading students:",
            error
        );

        return [];
    }
}


// =====================================
// SAVE STUDENTS
// =====================================

function saveStudents(students) {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}


// =====================================
// DISPLAY STUDENTS
// =====================================

function displayFeeStudents(students) {

    const container =
        document.getElementById("feeStudents");


    if (!container) {

        console.error(
            "feeStudents element not found."
        );

        return;
    }


    container.innerHTML = "";


    if (!students || students.length === 0) {

        container.innerHTML = `
            <p>No student found.</p>
        `;

        return;
    }


    students.forEach(function(student) {

        const fees =
            getStudentFees(
                student.studentClass
            );


        const isNewStudent =
            student.isNewStudent === true ||
            student.isNewStudent === "true" ||
            student.studentType === "New Student";


        container.innerHTML += `

            <div class="student-fee-option">

                <label>

                    <input
                        type="checkbox"
                        class="fee-student-checkbox"
                        value="${student.id}"
                        onchange="showSelectedFees()"
                    >

                    <strong>
                        ${student.name || "Unnamed Student"}
                    </strong>

                    -
                    ${student.studentClass || "No Class"}

                    -
                    ${
                        student.academicSession ||
                        "2026/2027"
                    }

                    <br>

                    <span>
                        Annual Tuition:
                        ₦${fees.annualTuition.toLocaleString()}
                    </span>

                    <br>

                    <span>
                        Student Type:
                        ${
                            isNewStudent
                            ? "New Student"
                            : "Returning Student"
                        }
                    </span>

                </label>

            </div>

        `;

    });

}


// =====================================
// LOAD STUDENTS
// =====================================

function loadFeeStudents() {

    console.log(
        "Loading school fee students..."
    );


    const students =
        getStudents();


    displayFeeStudents(
        students
    );
}


// =====================================
// SEARCH STUDENTS
// =====================================

function searchStudents() {

    const input =
        document.getElementById(
            "studentSearch"
        );


    if (!input) {
        return;
    }


    const search =
        input.value
            .toLowerCase()
            .trim();


    const students =
        getStudents();


    const filteredStudents =
        students.filter(function(student) {

            const name =
                String(
                    student.name || ""
                ).toLowerCase();


            const studentClass =
                String(
                    student.studentClass || ""
                ).toLowerCase();


            const session =
                String(
                    student.academicSession ||
                    "2026/2027"
                ).toLowerCase();


            return (
                name.includes(search) ||
                studentClass.includes(search) ||
                session.includes(search)
            );

        });


    displayFeeStudents(
        filteredStudents
    );
}


// =====================================
// GET SELECTED STUDENTS
// =====================================

function getSelectedStudentIds() {

    const checkboxes =
        document.querySelectorAll(
            ".fee-student-checkbox:checked"
        );


    return Array.from(
        checkboxes
    ).map(function(checkbox) {

        return checkbox.value;

    });
}


// =====================================
// SHOW SELECTED FEES
// =====================================

function showSelectedFees() {

    const selectedIds =
        getSelectedStudentIds();


    const feeDetails =
        document.getElementById(
            "feeDetails"
        );


    const termSelect =
        document.getElementById(
            "feeTerm"
        );


    if (!feeDetails) {
        return;
    }


    const selectedTerm =
        termSelect
        ? termSelect.value
        : "";


    // Hide bank transfer box
    const transferBox =
        document.getElementById(
            "bankTransferBox"
        );


    if (transferBox) {

        transferBox.style.display =
            "none";

        transferBox.innerHTML =
            "";

    }


    // No students selected
    if (selectedIds.length === 0) {

        feeDetails.innerHTML = `

            <p>
                Select one or more children
                to view their fees.
            </p>

        `;

        return;
    }


    // No term selected
    if (!selectedTerm) {

        feeDetails.innerHTML = `

            <p>
                Please select First Term,
                Second Term or Third Term.
            </p>

        `;

        return;
    }


    const students =
        getStudents();


    let totalAmountToPay = 0;

    let childrenHTML = "";


    selectedIds.forEach(function(id) {

        const student =
            students.find(function(item) {

                return String(item.id) ===
                       String(id);

            });


        if (!student) {
            return;
        }


        const fees =
            getStudentFees(
                student.studentClass
            );


        const isNewStudent =
            student.isNewStudent === true ||
            student.isNewStudent === "true" ||
            student.studentType === "New Student";


        // =================================
        // TERM FEE
        // =================================

        const termFee =
            fees.termFee;


        // =================================
        // UNIFORM
        // =================================

        let uniform = 0;


        if (
            isNewStudent &&
            selectedTerm === "First Term"
        ) {

            uniform =
                fees.uniformFee;

        }


        const amountDue =
            termFee + uniform;


        // =================================
        // TERM PAYMENT
        // =================================

        let amountPaidForTerm = 0;


        if (student.termPayments) {

            amountPaidForTerm =
                Number(
                    student.termPayments[
                        selectedTerm
                    ] || 0
                );

        }


        const outstanding =
            Math.max(
                0,
                amountDue -
                amountPaidForTerm
            );


        totalAmountToPay +=
            outstanding;


        // =================================
        // CHILD DISPLAY
        // =================================

        childrenHTML += `

            <div class="fee-card">

                <h3>
                    ${student.name}
                </h3>

                <p>
                    <strong>
                        Class:
                    </strong>

                    ${student.studentClass}
                </p>

                <p>
                    <strong>
                        Academic Session:
                    </strong>

                    ${
                        student.academicSession ||
                        "2026/2027"
                    }
                </p>

                <p>
                    <strong>
                        Term:
                    </strong>

                    ${selectedTerm}
                </p>

                <p>
                    <strong>
                        Term Tuition:
                    </strong>

                    ₦${termFee.toLocaleString()}
                </p>

                ${
                    uniform > 0
                    ?

                    `
                    <p>
                        <strong>
                            New Student Uniform:
                        </strong>

                        ₦${uniform.toLocaleString()}
                    </p>
                    `

                    :

                    ""
                }

                <p>
                    <strong>
                        Amount Due:
                    </strong>

                    ₦${amountDue.toLocaleString()}
                </p>

                <p>
                    <strong>
                        Already Paid:
                    </strong>

                    ₦${amountPaidForTerm.toLocaleString()}
                </p>

                <p>
                    <strong>
                        Outstanding:
                    </strong>

                    ₦${outstanding.toLocaleString()}
                </p>

            </div>

        `;

    });


    // =================================
    // DISPLAY TOTAL
    // =================================

    feeDetails.innerHTML = `

        <h3>
            Selected Children
        </h3>

        ${childrenHTML}

        <hr>

        <h2>
            ${selectedTerm}
            Total Amount to Pay:
            ₦${totalAmountToPay.toLocaleString()}
        </h2>

        ${
            totalAmountToPay > 0

            ?

            `
            <button
                type="button"
                onclick="openBankTransfer()">

                Pay by Bank Transfer

            </button>
            `

            :

            `
            <p>
                This term has been fully paid.
            </p>
            `
        }

    `;

}


// =====================================
// OPEN BANK TRANSFER
// =====================================

function openBankTransfer() {

    const selectedIds =
        getSelectedStudentIds();


    const termSelect =
        document.getElementById(
            "feeTerm"
        );


    const selectedTerm =
        termSelect
        ? termSelect.value
        : "";


    if (selectedIds.length === 0) {

        alert(
            "Please select at least one child."
        );

        return;
    }


    if (!selectedTerm) {

        alert(
            "Please select a term."
        );

        return;
    }


    const students =
        getStudents();


    let selectedStudents = [];

    let totalBalance = 0;


    selectedIds.forEach(function(id) {

        const student =
            students.find(function(item) {

                return String(item.id) ===
                       String(id);

            });


        if (!student) {
            return;
        }


        const fees =
            getStudentFees(
                student.studentClass
            );


        const isNewStudent =
            student.isNewStudent === true ||
            student.isNewStudent === "true" ||
            student.studentType === "New Student";


        const termFee =
            fees.termFee;


        let uniform = 0;


        if (
            isNewStudent &&
            selectedTerm === "First Term"
        ) {

            uniform =
                fees.uniformFee;

        }


        const amountDue =
            termFee + uniform;


        let amountPaidForTerm = 0;


        if (student.termPayments) {

            amountPaidForTerm =
                Number(
                    student.termPayments[
                        selectedTerm
                    ] || 0
                );

        }


        const balance =
            Math.max(
                0,
                amountDue -
                amountPaidForTerm
            );


        if (balance > 0) {

            selectedStudents.push({

                student: student,

                amountDue: amountDue,

                amountPaid:
                    amountPaidForTerm,

                balance: balance

            });


            totalBalance +=
                balance;

        }

    });


    if (selectedStudents.length === 0) {

        alert(
            "The selected students have no outstanding balance for " +
            selectedTerm +
            "."
        );

        return;
    }


    const reference =
        "GMA-" +
        Date.now();


    const transferBox =
        document.getElementById(
            "bankTransferBox"
        );


    if (!transferBox) {

        alert(
            "Bank transfer section not found."
        );

        return;
    }


    transferBox.style.display =
        "block";


    let childrenHTML = "";


    selectedStudents.forEach(function(item) {

        const student =
            item.student;


        childrenHTML += `

            <div class="fee-card">

                <p>
                    <strong>
                        ${student.name}
                    </strong>
                </p>

                <p>
                    Class:
                    ${student.studentClass}
                </p>

                <p>
                    Term:
                    ${selectedTerm}
                </p>

                <p>
                    Amount Due:
                    ₦${item.amountDue.toLocaleString()}
                </p>

                <p>
                    Already Paid:
                    ₦${item.amountPaid.toLocaleString()}
                </p>

                <p>
                    <strong>
                        Outstanding:
                        ₦${item.balance.toLocaleString()}
                    </strong>
                </p>

            </div>

        `;

    });


    // =================================
    // BANK DETAILS
    // =================================

    transferBox.innerHTML = `

        <div class="fee-card">

            <h3>
                🏦 Bank Transfer
            </h3>

            <p>
                <strong>
                    Payment Term:
                </strong>

                ${selectedTerm}
            </p>

            <p>
                You are paying for

                <strong>
                    ${selectedStudents.length}
                    child${
                        selectedStudents.length > 1
                        ? "ren"
                        : ""
                    }
                </strong>.
            </p>

            <hr>

            ${childrenHTML}

            <hr>

            <h3>
                Total Transfer Amount:
                ₦${totalBalance.toLocaleString()}
            </h3>

            <hr>

            <p>
                Transfer the payment to:
            </p>

            <p>
                <strong>
                    Bank:
                </strong>

                SCHOOL BANK
            </p>

            <p>
                <strong>
                    Account Name:
                </strong>

                Goshnai Montessori Academy
            </p>

            <p>
                <strong>
                    Account Number:
                </strong>

                XXXXXXXX
            </p>

            <p>
                <strong>
                    Payment Reference:
                </strong>
            </p>

            <p id="paymentReference">
                ${reference}
            </p>

            <label for="transferAmount">
                Amount Transferred
            </label>

            <input
                type="number"
                id="transferAmount"
                placeholder="Enter amount transferred"
                min="1"
                max="${totalBalance}"
            >

            <br><br>

            <button
                type="button"
                onclick="submitTransfer()">

                I Have Made the Transfer

            </button>

        </div>

    `;


    const paymentStatus =
        document.getElementById(
            "paymentStatus"
        );


    if (paymentStatus) {

        paymentStatus.innerHTML =
            "";

    }

}




// =====================================
// SUBMIT BANK TRANSFER
// =====================================

function submitTransfer() {

    const selectedIds =
        getSelectedStudentIds();

    const termSelect =
        document.getElementById("feeTerm");

    const selectedTerm =
        termSelect ? termSelect.value : "";

    const amountInput =
        document.getElementById("transferAmount");


    // =================================
    // VALIDATION
    // =================================

    if (selectedIds.length === 0) {

        alert(
            "Please select at least one child."
        );

        return;
    }


    if (!selectedTerm) {

        alert(
            "Please select a term."
        );

        return;
    }


    if (!amountInput) {

        alert(
            "Amount field not found."
        );

        return;
    }


    const amount =
        Number(amountInput.value);


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert(
            "Please enter a valid amount."
        );

        return;
    }


    // =================================
    // GET STUDENTS
    // =================================

    const students =
        getStudents();


    let selectedStudents = [];

    let totalBalance = 0;


    // =================================
    // CALCULATE BALANCES
    // =================================

    selectedIds.forEach(function(id) {

        const student =
            students.find(function(item) {

                return String(item.id) ===
                       String(id);

            });


        if (!student) {
            return;
        }


        const fees =
            getStudentFees(
                student.studentClass
            );


        const isNewStudent =
            student.isNewStudent === true ||
            student.isNewStudent === "true" ||
            student.studentType === "New Student";


        const termFee =
            fees.termFee;


        let uniform = 0;


        // New students pay uniform
        // only in First Term

      
