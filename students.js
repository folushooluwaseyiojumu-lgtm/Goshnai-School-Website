console.log(
    "STUDENTS SAVED:",
    JSON.parse(localStorage.getItem("students")) || []
);
// =====================================
// GOSHNAI MONTESSORI ACADEMY
// STUDENTS MANAGEMENT
// =====================================


// =====================================
// GET STUDENTS
// =====================================

function getStudents() {

    try {

        return JSON.parse(
            localStorage.getItem("students")
        ) || [];

    } catch (error) {

        console.error(error);

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

function displayStudents(studentArray) {

    const container =
        document.getElementById("studentsList");

    if (!container) {
        return;
    }


    const students =
        studentArray || getStudents();


    if (students.length === 0) {

        container.innerHTML = `
            <p>No students registered yet.</p>
        `;

        return;

    }


    container.innerHTML = "";


    students.forEach(function(student) {

        const amountPaid =
            Number(student.amountPaid || 0);

        const balance =
            Number(student.balance || 0);


        let feeStatus =
            student.feeStatus || "Not Paid";


        if (balance <= 0 && amountPaid > 0) {

            feeStatus = "Paid";

        } else if (amountPaid > 0) {

            feeStatus = "Part Paid";

        } else {

            feeStatus = "Not Paid";

        }


        container.innerHTML += `

            <div class="student-card">

                <h3>
                    ${student.name || "Unnamed Student"}
                </h3>

                <p>
                    <strong>Student ID:</strong>
                    ${student.id || "-"}
                </p>

                <p>
                    <strong>Class:</strong>
                    ${student.studentClass || "-"}
                </p>

                <p>
                    <strong>Academic Session:</strong>
                    ${student.academicSession || "2026/2027"}
                </p>

                <p>
                    <strong>Student Type:</strong>
                    ${student.studentType || "Returning Student"}
                </p>

                <p>
                    <strong>Amount Paid:</strong>
                    ₦${amountPaid.toLocaleString()}
                </p>

                <p>
                    <strong>Balance:</strong>
                    ₦${balance.toLocaleString()}
                </p>

                <p>
                    <strong>Fee Status:</strong>
                    ${feeStatus}
                </p>

        <button
    type="button"
    onclick="viewStudentProfile('${student.id}')">

    View Profile

</button>

<button
    type="button"
    onclick="editStudent('${student.id}')">

    Edit Student

</button>

<button
    type="button"
    onclick="deleteStudent('${student.id}')">

    Delete Student

</button>

            </div>

        `;

    });

}


// =====================================
// VIEW ALL STUDENTS
// =====================================

function showAllStudents() {

    displayStudents(
        getStudents()
    );

}


// =====================================
// PAID STUDENTS
// =====================================

function showPaidStudents() {

    const students =
        getStudents();


    const paid =
        students.filter(function(student) {

            return Number(
                student.balance || 0
            ) <= 0 &&
            Number(
                student.amountPaid || 0
            ) > 0;

        });


    displayStudents(paid);

}


// =====================================
// PART PAID STUDENTS
// =====================================

function showPartPaidStudents() {

    const students =
        getStudents();


    const partPaid =
        students.filter(function(student) {

            return Number(
                student.amountPaid || 0
            ) > 0 &&
            Number(
                student.balance || 0
            ) > 0;

        });


    displayStudents(partPaid);

}


// =====================================
// UNPAID STUDENTS
// =====================================

function showUnpaidStudents() {

    const students =
        getStudents();


    const unpaid =
        students.filter(function(student) {

            return Number(
                student.amountPaid || 0
            ) === 0;

        });


    displayStudents(unpaid);

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


    if (search === "") {

        displayStudents(students);

        return;

    }


    const filtered =
        students.filter(function(student) {

            const name =
                String(
                    student.name || ""
                ).toLowerCase();


            const id =
                String(
                    student.id || ""
                ).toLowerCase();


            const studentClass =
                String(
                    student.studentClass || ""
                ).toLowerCase();


            return (
                name.includes(search) ||
                id.includes(search) ||
                studentClass.includes(search)
            );

        });


    displayStudents(filtered);

}


// =====================================
// FILTER BY CLASS
// =====================================

function filterByClass() {

    const select =
        document.getElementById(
            "classFilter"
        );


    if (!select) {
        return;
    }


    const selectedClass =
        select.value;


    const students =
        getStudents();


    if (selectedClass === "") {

        displayStudents(students);

        return;

    }


    const filtered =
        students.filter(function(student) {

            return student.studentClass ===
                   selectedClass;

        });


    displayStudents(filtered);

}


// =====================================
// CHANGE ACADEMIC SESSION
// =====================================

function changeAcademicSession() {

    const select =
        document.getElementById(
            "academicSession"
        );


    if (!select) {
        return;
    }


    const selectedSession =
        select.value;


    const students =
        getStudents();


    if (selectedSession === "") {

        displayStudents(students);

        return;

    }


    const filtered =
        students.filter(function(student) {

            return (
                student.academicSession ||
                "2026/2027"
            ) === selectedSession;

        });


    displayStudents(filtered);

}


// =====================================
// VIEW STUDENT PROFILE
// =====================================

function viewStudentProfile(studentId) {

    const students =
        getStudents();


    const student =
        students.find(function(item) {

            return String(item.id) ===
                   String(studentId);

        });


    if (!student) {

        alert(
            "Student record not found."
        );

        return;

    }


    const profile =
        document.getElementById(
            "studentProfile"
        );


    if (!profile) {
        return;
    }


    profile.innerHTML = `
<button type="button" onclick="closeStudentProfile()">
    ← Back to Students
</button>
        <div class="student-card">

            <h2>
                Student Profile
            </h2>

            <h3>
                ${student.name}
            </h3>

            <p>
                <strong>Student ID:</strong>
                ${student.id}
            </p>

            <p>
                <strong>Class:</strong>
                ${student.studentClass || "-"}
            </p>

            <p>
                <strong>Academic Session:</strong>
                ${student.academicSession || "2026/2027"}
            </p>

            <p>
                <strong>Student Type:</strong>
                ${student.studentType || "Returning Student"}
            </p>

            <p>
                <strong>Amount Paid:</strong>
                ₦${Number(
                    student.amountPaid || 0
                ).toLocaleString()}
            </p>

            <p>
                <strong>Outstanding Balance:</strong>
                ₦${Number(
                    student.balance || 0
                ).toLocaleString()}
            </p>

            <p>
                <strong>Fee Status:</strong>
                ${student.feeStatus || "Not Paid"}
            </p>

        </div>

    `;

}


// =====================================
// DELETE STUDENT
// =====================================

function deleteStudent(studentId) {

    const students =
        getStudents();


    const student =
        students.find(function(item) {

            return String(item.id) ===
                   String(studentId);

        });


    if (!student) {

        alert(
            "Student record not found."
        );

        return;

    }


    const confirmed =
        confirm(

            "Delete this student?\n\n" +
            student.name +

            "\n\nThis action cannot be undone."

        );


    if (!confirmed) {
        return;
    }


    const updatedStudents =
        students.filter(function(item) {

            return String(item.id) !==
                   String(studentId);

        });


    saveStudents(
        updatedStudents
    );


    displayStudents();


    alert(
        "Student deleted successfully."
    );

}
// =====================================
// EDIT STUDENT
// =====================================

function editStudent(studentId) {

    const students = getStudents();

    const student = students.find(function(item) {

        return String(item.id) ===
               String(studentId);

    });

    if (!student) {

        alert("Student record not found.");

        return;
    }


    const newName = prompt(
        "Student Name:",
        student.name || ""
    );

    if (newName === null) {
        return;
    }


    const newClass = prompt(
        "Student Class:",
        student.studentClass || ""
    );

    if (newClass === null) {
        return;
    }


    const newSession = prompt(
        "Academic Session:",
        student.academicSession || "2026/2027"
    );

    if (newSession === null) {
        return;
    }


    const newType = prompt(
        "Student Type:\n\n" +
        "New Student or Returning Student",
        student.studentType || "Returning Student"
    );

    if (newType === null) {
        return;
    }


    student.name = newName.trim();

    student.studentClass =
        newClass.trim();

    student.academicSession =
        newSession.trim();

    student.studentType =
        newType.trim();

    student.isNewStudent =
        newType.trim().toLowerCase() ===
        "new student";


    saveStudents(students);

    displayStudents();

    alert(
        "Student details updated successfully!"
    );

}


// =====================================
// ADD EXISTING STUDENT
// =====================================
function addStudent() {

    const name = prompt("Enter student's full name:");

    if (!name || name.trim() === "") {
        alert("Please enter the student's name.");
        return;
    }

    const studentClass = prompt(
        "Enter student's class:\n\n" +
        "Examples: Nursery 1, Primary 1, JSS 1, SS 1"
    );

    if (!studentClass || studentClass.trim() === "") {
        alert("Please enter the student's class.");
        return;
    }

    const academicSession =
        prompt(
            "Enter academic session:",
            "2026/2027"
        ) || "2026/2027";

    const studentType =
        prompt(
            "Student type:\n\n" +
            "Enter New Student or Returning Student",
            "Returning Student"
        ) || "Returning Student";

    const students =
        getStudents();

    const studentId =
        "GMA-" + Date.now();

    const student = {

        id: studentId,

        name: name.trim(),

        studentClass: studentClass.trim(),

        academicSession:
            academicSession.trim(),

        studentType:
            studentType.trim(),

        isNewStudent:
            studentType.trim().toLowerCase() ===
            "new student",

        amountPaid: 0,

        balance: 0,

        feeStatus: "Not Paid",

        termPayments: {

            "First Term": 0,

            "Second Term": 0,

            "Third Term": 0

        },

        paymentHistory: []

    };

    students.push(student);

    saveStudents(students);

    alert(
        "Student added successfully!\n\n" +
        "Student ID: " +
        studentId
    );

    displayStudents();

}

// =====================================
// START PAGE
// =====================================

function startStudentsPage() {

    displayStudents();


    const searchInput =
        document.getElementById(
            "studentSearch"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            searchStudents
        );

    }

}


// =====================================
// WAIT FOR PAGE
// =====================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startStudentsPage
    );

} else {

    startStudentsPage();

}
function closeStudentProfile() {

    const profile =
        document.getElementById("studentProfile");

    const studentsList =
        document.getElementById("studentsList");

    if (profile) {
        profile.innerHTML = "";
    }

    if (studentsList) {
        studentsList.style.display = "block";
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

                      }
