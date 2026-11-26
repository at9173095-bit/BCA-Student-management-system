
const studentForm = document.getElementById("studentForm");

if (studentForm) {
    studentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Collect student information
        const roll = document.getElementById("roll").value.trim();
        const name = document.getElementById("name").value.trim();
        const dob = document.getElementById("dob").value;
        const gender = document.getElementById("gender").value;
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const address = document.getElementById("address").value.trim();
        const course = document.getElementById("course").value.trim();
        const semester = document.getElementById("semester").value;
        const admission = document.getElementById("admission").value;
        const father = document.getElementById("father").value.trim();
        const photoFile = document.getElementById("photo").files[0];

        // Get existing student records
        let students = JSON.parse(localStorage.getItem("students")) || [];

        // Check duplicate roll number
        const duplicate = students.some(
            student => student.roll.toLowerCase() === roll.toLowerCase()
        );

        if (duplicate) {
            alert("This roll number is already registered!");
            return;
        }

        // Save student information
        function saveStudent(photoData) {
            const student = {
                roll,
                name,
                dob,
                gender,
                email,
                phone,
                address,
                course,
                semester,
                admission,
                father,
                photo: photoData
            };

            students.push(student);

            try {
                localStorage.setItem("students", JSON.stringify(students));
                alert("Student registered successfully!");
                studentForm.reset();
            } catch (error) {
                alert("Storage is full! Try using a smaller photo.");
            }
        }

        // Read photo if uploaded
        if (photoFile) {
            const reader = new FileReader();

            reader.onload = function () {
                saveStudent(reader.result);
            };

            reader.onerror = function () {
                alert("Unable to read the student photo.");
            };

            reader.readAsDataURL(photoFile);
        } else {
            saveStudent("");
        }
    });
}

const searchForm = document.getElementById("searchForm");

if (searchForm) {
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const searchValue = document.getElementById("searchInput")
            .value.trim().toLowerCase();

        const students = JSON.parse(localStorage.getItem("students")) || [];
        const results = document.getElementById("searchResults");

        const matchedStudents = students.filter(student =>
            student.roll.toLowerCase().includes(searchValue) ||
            student.name.toLowerCase().includes(searchValue)
        );

        if (matchedStudents.length === 0) {
            results.innerHTML = "<p>No student record found.</p>";
            return;
        }

        results.innerHTML = "";

        matchedStudents.forEach(student => {
            const resultDiv = document.createElement("div");
            resultDiv.className = "student-result";

            resultDiv.innerHTML = `
                <h3>${student.name}</h3>
                <p><strong>Roll Number:</strong> ${student.roll}</p>
                <p><strong>Course:</strong> ${student.course}</p>
                <p><strong>Semester:</strong> ${student.semester}</p>
                <a href="profile.html?roll=${encodeURIComponent(student.roll)}">
                    View Profile
                </a>
            `;

            results.appendChild(resultDiv);
        });
    });
}

const profileContainer = document.getElementById("studentProfile");

if (profileContainer) {
    const params = new URLSearchParams(window.location.search);
    const rollNumber = params.get("roll");

    let students = JSON.parse(localStorage.getItem("students")) || [];

    let student = students.find(
        s => s.roll.toLowerCase() === (rollNumber || "").toLowerCase()
    );

    const actions = document.getElementById("profileActions");

    if (!student) {
        profileContainer.innerHTML = "<p>Student record not found.</p>";
    } else {
        function displayProfile() {
            profileContainer.innerHTML = `
                ${student.photo ?
                    `<img src="${student.photo}" class="profile-photo" alt="Student Photo">`
                    : `<p>No student photo available.</p>`
                }

                <div class="profile-details">
                    <p><strong>Roll Number:</strong> ${student.roll}</p>
                    <p><strong>Name:</strong> ${student.name}</p>
                    <p><strong>Date of Birth:</strong> ${student.dob}</p>
                    <p><strong>Gender:</strong> ${student.gender}</p>
                    <p><strong>Email:</strong> ${student.email}</p>
                    <p><strong>Phone:</strong> ${student.phone}</p>
                    <p><strong>Address:</strong> ${student.address}</p>
                    <p><strong>Course:</strong> ${student.course}</p>
                    <p><strong>Semester:</strong> ${student.semester}</p>
                    <p><strong>Admission Date:</strong> ${student.admission}</p>
                    <p><strong>Father/Guardian Name:</strong> ${student.father}</p>
                </div>
            `;
        }

        displayProfile();

        actions.innerHTML = `
            <div class="profile-actions">
                <button class="edit-button" id="editStudent">Edit Record</button>
                <button class="delete-button" id="deleteStudent">Delete Record</button>
                <button class="back-button" onclick="history.back()">Go Back</button>
            </div>
        `;

        // Edit student record
        document.getElementById("editStudent").addEventListener("click", function () {
            const newName = prompt("Enter Student Name:", student.name);
            if (newName === null) return;
            if (!newName.trim()) {
                alert("Name cannot be empty.");
                return;
            }

            const newEmail = prompt("Enter Email:", student.email);
            if (newEmail === null) return;

            const newPhone = prompt("Enter Phone Number:", student.phone);
            if (newPhone === null) return;

            const newAddress = prompt("Enter Address:", student.address);
            if (newAddress === null) return;

            const newSemester = prompt("Enter Semester:", student.semester);
            if (newSemester === null) return;

            const newFather = prompt(
                "Enter Father/Guardian Name:",
                student.father
            );
            if (newFather === null) return;

            student.name = newName.trim();
            student.email = newEmail.trim();
            student.phone = newPhone.trim();
            student.address = newAddress.trim();
            student.semester = newSemester.trim();
            student.father = newFather.trim();

            const index = students.findIndex(
                s => s.roll.toLowerCase() === student.roll.toLowerCase()
            );

            students[index] = student;

            localStorage.setItem("students", JSON.stringify(students));

            alert("Student record updated successfully!");
            displayProfile();
        });

        // Delete student record
        document.getElementById("deleteStudent").addEventListener("click", function () {
            const confirmation = confirm(
                "Are you sure you want to delete this student record?"
            );

            if (confirmation) {
                students = students.filter(
                    s => s.roll.toLowerCase() !== student.roll.toLowerCase()
                );

                localStorage.setItem("students", JSON.stringify(students));

                alert("Student record deleted successfully!");
                window.location.href = "search.html";
            }
        });
    }
}
