const admissionForm = document.getElementById("admissionForm");

if (admissionForm) {

    admissionForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const application = {
          applicationNumber:
    "GMA-" + Date.now(),

dateSubmitted:
    new Date().toLocaleString(),

            studentName: document.getElementById("studentName").value.trim(),

            studentAge: document.getElementById("studentAge").value.trim(),

            studentClass: document.getElementById("studentClass").value,
academicSession:
    document.getElementById("academicSession").value,
            parentName: document.getElementById("parentName").value.trim(),

            phone: document.getElementById("phone").value.trim(),

            email: document.getElementById("email").value.trim(),

            address: document.getElementById("address").value.trim(),

            date: new Date().toLocaleString()

        };


        let applications = JSON.parse(
            localStorage.getItem("admissionApplications")
        ) || [];


        applications.push(application);


        localStorage.setItem(
            "admissionApplications",
            JSON.stringify(applications)
        );


        alert(
            "Admission application submitted successfully!\n\n" +
            "Total applications saved: " +
            applications.length
        );


        admissionForm.reset();

    });

}
