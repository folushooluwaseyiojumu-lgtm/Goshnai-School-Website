import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAOV_UEz729PW5D6tA4qmiaLjvZWjibRgU",
  authDomain: "goshnai-montessori-academy.firebaseapp.com",
  projectId: "goshnai-montessori-academy",
  storageBucket: "goshnai-montessori-academy.firebasestorage.app",
  messagingSenderId: "57941031873",
  appId: "1:57941031873:web:29dd46bdde69babfb3cd40",
  measurementId: "G-Y55X06QPZG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
 const admissionForm = document.getElementById("admissionForm");

if (admissionForm) {

    admissionForm.addEventListener("submit", async function(event) {

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

try {

    await addDoc(
        collection(db, "admissionApplications"),
        application
    );

    alert("Admission application submitted successfully!");

    admissionForm.reset();

} catch (error) {

    console.error(error);
    alert("Firebase Error: " + error.message);

}

    alert("Admission application submitted successfully!"); +
            "Total applications saved: " +
            applications.length
        );


        admissionForm.reset();

    });

}
