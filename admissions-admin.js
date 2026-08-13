import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyAOV_UEz729PW5D6tA4qmiaLjvZWjibRgU",
  authDomain: "goshnai-montessori-academy.firebaseapp.com",
  projectId: "goshnai-montessori-academy",
  storageBucket: "goshnai-montessori-academy.firebasestorage.app",
  messagingSenderId: "57941031873",
  appId: "1:57941031873:web:29dd46bdde69babfb3cd40"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// =====================================
// GOSHNAI MONTESSORI ACADEMY
// ADMISSION ADMIN
// =====================================

const applicationsList =
    document.getElementById("applicationsList");

let applications = [];
async function loadApplications() {

    const querySnapshot =
        await getDocs(
            collection(
                db,
                "admissionApplications"
            )
        );

    applications = [];

    querySnapshot.forEach((doc) => {

        applications.push({
            id: doc.id,
            ...doc.data()
        });

    });

    displayApplications();

}

// =====================================
// GET TERM FEES
// =====================================

function getStudentFees(studentClass) {

    const className =
        (studentClass || "").toLowerCase();

    let tuitionFee = 0;
    let uniformFee = 0;


    if (className.includes("nursery")) {

        tuitionFee = 100000;
        uniformFee = 10000;

    } else if (className.includes("primary")) {

        tuitionFee = 120000;
        uniformFee = 12000;

    } else if (className.includes("jss")) {

        tuitionFee = 150000;
        uniformFee = 15000;

    } else if (className.includes("ss")) {

        tuitionFee = 180000;
        uniformFee = 15000;

    }


    return {

        tuitionFee:
            tuitionFee,

        uniformFee:
            uniformFee,

        totalFee:
            tuitionFee,

        firstTermNewStudentFee:
            tuitionFee + uniformFee

    };

}


// =====================================
// DISPLAY APPLICATIONS
// =====================================

function displayApplications(list = applications) {

    if (!applicationsList) {
        return;
    }


    if (list.length === 0) {

        applicationsList.innerHTML = `
            <p>No admission applications found.</p>
        `;

        return;
    }


    applicationsList.innerHTML = "";


    list.forEach(function(application) {

        const applicationNumber =
            application.applicationNumber || "";


        applicationsList.innerHTML += `

            <div class="application-card">

                <h3>
                    Admission Application
                </h3>


                <p>
                    <strong>
                        Application No:
                    </strong>

                    ${applicationNumber}
                </p>


                <p>
                    <strong>
                        Date Submitted:
                    </strong>

                    ${application.dateSubmitted || "Not available"}
                </p>


                <h4>
                    Student Information
                </h4>


                <p>
                    <strong>Name:</strong>

                    ${application.studentName || "Not provided"}
                </p>


                <p>
                    <strong>Age:</strong>

                    ${application.studentAge || "Not provided"}
                </p>


                <p>
                    <strong>Class:</strong>

                    ${application.studentClass || "Not provided"}
                </p>


                <p>
                    <strong>Academic Session:</strong>

                    ${application.academicSession || "Not provided"}
                </p>


                <h4>
                    Parent / Guardian
                </h4>


                <p>
                    <strong>Name:</strong>

                    ${application.parentName || "Not provided"}
                </p>


                <p>
                    <strong>Phone:</strong>

                    ${application.phone || "Not provided"}
                </p>


                <p>
                    <strong>Email:</strong>

                    ${application.email || "Not provided"}
                </p>


                <p>
                    <strong>Address:</strong>

                    ${application.address || "Not provided"}
                </p>


                <p>
                    <strong>Status:</strong>

                    <span class="application-status">

                        ${application.status || "Pending"}

                    </span>

                </p>


                <button
                    type="button"
                    onclick="updateStatusByApplication(
                        '${applicationNumber}',
                        'Approved'
                    )">

                    Approve

                </button>


                <button
                    type="button"
                    onclick="updateStatusByApplication(
                        '${applicationNumber}',
                        'Rejected'
                    )">

                    Reject

                </button>


                <button
                    type="button"
                    onclick="deleteApplicationByNumber(
                        '${applicationNumber}'
                    )">

                    Delete Application

                </button>

            </div>

        `;

    });

}


// =====================================
// FIND APPLICATION
// =====================================

function findApplication(applicationNumber) {

    return applications.find(function(application) {

        return application.applicationNumber ===
            applicationNumber;

    });

}


// =====================================
// APPROVE / REJECT
// =====================================

function updateStatusByApplication(
    applicationNumber,
    status
) {

    const application =
        findApplication(applicationNumber);


    if (!application) {

        alert(
            "Application not found."
        );

        return;
    }


    application.status =
        status;


    // =================================
    // APPROVED
    // =================================

    if (status === "Approved") {

        let students =
            JSON.parse(
                localStorage.getItem("students")
            ) || [];


        const alreadyExists =
            students.some(function(student) {

                return (
                    student.applicationNumber ===
                    application.applicationNumber
                );

            });


        if (!alreadyExists) {

            const fees =
                getStudentFees(
                    application.studentClass
                );


            // =================================
            // NEW STUDENT
            // =================================

            const isNewStudent = true;


            const student = {

                id:
                    "GMA-" +
                    Date.now() +
                    "-" +
                    Math.floor(
                        Math.random() * 1000
                    ),


                applicationNumber:
                    application.applicationNumber || "",


                academicSession:
                    application.academicSession ||
                    "2026/2027",


                name:
                    application.studentName || "",


                studentClass:
                    application.studentClass || "",


                parentName:
                    application.parentName || "",


                phone:
                    application.phone || "",


                studentType:
                    "New Student",


                isNewStudent:
                    isNewStudent,


                // =========================
                // FEES
                // =========================

                tuitionFee:
                    fees.tuitionFee,


                uniformFee:
                    fees.uniformFee,


                totalFees:
                    fees.firstTermNewStudentFee,


                amountPaid:
                    0,


                balance:
                    fees.firstTermNewStudentFee,


                feeStatus:
                    "Not Paid",


                // =========================
                // TERM PAYMENTS
                // =========================

                termPayments: {

                    "First Term":
                        0,

                    "Second Term":
                        0,

                    "Third Term":
                        0

                },


                // =========================
                // PAYMENT HISTORY
                // =========================

                paymentHistory: []

            };


            students.push(student);


            localStorage.setItem(
                "students",
                JSON.stringify(students)
            );


            alert(

                "Student approved successfully!\n\n" +

                "Student: " +
                student.name +

                "\n\n" +

                "First Term Tuition: ₦" +
                fees.tuitionFee.toLocaleString() +

                "\nUniform: ₦" +
                fees.uniformFee.toLocaleString() +

                "\nFirst Term Total: ₦" +
                fees.firstTermNewStudentFee.toLocaleString()

            );


        } else {

            alert(
                "This student has already been added."
            );

        }

    }


    // =================================
    // SAVE APPLICATIONS
    // =================================

    localStorage.setItem(
        "admissionApplications",
        JSON.stringify(applications)
    );


    displayApplications();

}


// =====================================
// DELETE APPLICATION
// =====================================

function deleteApplicationByNumber(
    applicationNumber
) {

    const application =
        findApplication(applicationNumber);


    if (!application) {

        alert(
            "Application not found."
        );

        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this admission application?"
        );


    if (!confirmed) {
        return;
    }


    applications =
        applications.filter(function(application) {

            return application.applicationNumber !==
                applicationNumber;

        });


    localStorage.setItem(
        "admissionApplications",
        JSON.stringify(applications)
    );


    displayApplications();


    alert(
        "Admission application deleted successfully!"
    );

}


// =====================================
// FILTER BY SESSION
// =====================================

function filterApplicationsBySession() {

    const select =
        document.getElementById(
            "applicationSession"
        );


    if (!select) {
        return;
    }


    const selectedSession =
        select.value;


    if (selectedSession === "") {

        displayApplications();

        return;
    }


    const filteredApplications =
        applications.filter(function(application) {

            return (
                application.academicSession ||
                ""
            ) === selectedSession;

        });


    displayApplications(
        filteredApplications
    );

}


// =====================================
// START
// =====================================

loadApplications();
window.updateStatusByApplication =
    updateStatusByApplication;

window.deleteApplicationByNumber =
    deleteApplicationByNumber;

window.filterApplicationsBySession =
    filterApplicationsBySession;
