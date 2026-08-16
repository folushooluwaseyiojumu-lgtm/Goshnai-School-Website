if (
    localStorage.getItem(
        "adminLoggedIn"
    ) !== "true"
) {

    window.location.href =
        "admin-login.html";

}
function loadDashboardStats(selectedSession = "") {

    const students =
        JSON.parse(localStorage.getItem("students")) || [];

    const applications =
        JSON.parse(
            localStorage.getItem("admissionApplications")
        ) || [];

let filteredStudents = students;

if (selectedSession !== "") {

    filteredStudents =
        students.filter(function(student) {

            return student.academicSession ===
                selectedSession;

        });

}
    // =========================
    // STUDENT COUNTS
    // =========================

    const paidStudents =
        filteredStudents.filter(function(student) {

            return student.feeStatus === "Paid";

        });


    const partPaidStudents =
        filteredStudents.filter(function(student) {

            return student.feeStatus === "Part Paid";

        });


    const unpaidStudents =
        filteredStudents.filter(function(student) {

            return student.feeStatus === "Not Paid";

        });


    // =========================
    // PENDING ADMISSIONS
    // =========================

    const pendingApplications =
        applications.filter(function(application) {

            return (
                application.status === "Pending" ||
                application.status === "pending"
            );

        });


    // =========================
    // SCHOOL FEES
    // =========================

    let totalFees = 0;

    let totalPaid = 0;

    let totalBalance = 0;


    filteredStudents.forEach(function(student) {

        totalFees += Number(
            student.totalFees || 0
        );

        totalPaid += Number(
            student.amountPaid || 0
        );

        totalBalance += Number(
            student.balance || 0
        );

    });


    // =========================
    // DISPLAY STUDENT NUMBERS
    // =========================

    const totalStudentsElement =
        document.getElementById("totalStudents");

    if (totalStudentsElement) {

        totalStudentsElement.textContent =
          filteredStudents.length

    }


    const paidStudentsElement =
        document.getElementById("paidStudents");

    if (paidStudentsElement) {

        paidStudentsElement.textContent =
            paidStudents.length;

    }


    const partPaidStudentsElement =
        document.getElementById("partPaidStudents");

    if (partPaidStudentsElement) {

        partPaidStudentsElement.textContent =
            partPaidStudents.length;

    }


    const unpaidStudentsElement =
        document.getElementById("unpaidStudents");

    if (unpaidStudentsElement) {

        unpaidStudentsElement.textContent =
            unpaidStudents.length;

    }


    const pendingAdmissionsElement =
        document.getElementById("pendingAdmissions");

    if (pendingAdmissionsElement) {

        pendingAdmissionsElement.textContent =
            pendingApplications.length;

    }


    // =========================
    // DISPLAY SCHOOL FEES
    // =========================

    const totalFeesElement =
        document.getElementById("totalFeesAmount");

    if (totalFeesElement) {

        totalFeesElement.textContent =
            "₦" + totalFees.toLocaleString();

    }


    const totalPaidElement =
        document.getElementById("totalPaidAmount");

    if (totalPaidElement) {

        totalPaidElement.textContent =
            "₦" + totalPaid.toLocaleString();

    }


    const totalBalanceElement =
        document.getElementById("totalBalanceAmount");

    if (totalBalanceElement) {

        totalBalanceElement.textContent =
            "₦" + totalBalance.toLocaleString();

    }

}


// =========================
// RECENT ADMISSIONS
// =========================

function loadRecentAdmissions() {

    const applications =
        JSON.parse(
            localStorage.getItem("admissionApplications")
        ) || [];


    const container =
        document.getElementById(
            "recentAdmissionsList"
        );


    if (!container) {
        return;
    }


    if (applications.length === 0) {

        container.innerHTML =
            "<p>No recent admission applications.</p>";

        return;
    }


    const recentApplications =
        applications.slice(-5).reverse();


    container.innerHTML = "";


    recentApplications.forEach(
        function(application) {

            container.innerHTML += `

                <div class="recent-admission-card">

                    <h3>
                        ${
                            application.studentName ||
                            application.name ||
                            "Unknown Student"
                        }
                    </h3>

                    <p>
                        <strong>Class:</strong>
                        ${
                            application.studentClass ||
                            application.class ||
                            "Not provided"
                        }
                    </p>

                    <p>
                        <strong>Parent:</strong>
                        ${
                            application.parentName ||
                            "Not provided"
                        }
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${
                            application.status ||
                            "Pending"
                        }
                    </p>

                </div>

            `;

        }
    );

}


// =========================
// START DASHBOARD
// =========================

loadDashboardStats();
loadRecentAdmissions();

setInterval(function() {

    const session =
        document.getElementById("dashboardSession").value;

    loadDashboardStats(session);
    loadRecentAdmissions();

}, 3000);
function changeDashboardSession() {

    const selectedSession =
        document.getElementById(
            "dashboardSession"
        ).value;

    loadDashboardStats(selectedSession);

          }
