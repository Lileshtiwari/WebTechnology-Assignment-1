/* =========================================
   STUDENT GRADE CALCULATOR
   ========================================= */


/*
 * Function to calculate the total marks.
 * Demonstrates a user-defined function,
 * variables, arrays and iteration.
 */
function calculateTotal(marks) {

    let total = 0;

    // Loop through all five subject marks
    for (let i = 0; i < marks.length; i++) {

        total = total + marks[i];

    }

    return total;
}


/*
 * Function to calculate the average.
 */
function calculateAverage(total, numberOfSubjects) {

    let average = total / numberOfSubjects;

    return average;

}


/*
 * Function to determine the grade.
 * Demonstrates selection statements.
 */
function calculateGrade(average) {

    let grade;

    if (average >= 90) {

        grade = "A+";

    } else if (average >= 80) {

        grade = "A";

    } else if (average >= 70) {

        grade = "B";

    } else if (average >= 60) {

        grade = "C";

    } else if (average >= 50) {

        grade = "D";

    } else {

        grade = "F";

    }

    return grade;

}


/*
 * Function to determine Pass/Fail status.
 *
 * A student passes when:
 * 1. Average is at least 50
 * 2. Every subject has at least 35 marks
 */
function calculateStatus(marks, average) {

    let allSubjectsPassed = true;

    // Check each subject using iteration
    for (let i = 0; i < marks.length; i++) {

        if (marks[i] < 35) {

            allSubjectsPassed = false;

            break;
        }

    }

    if (average >= 50 && allSubjectsPassed) {

        return "PASS";

    } else {

        return "FAIL";

    }

}


/*
 * Get the form element from the HTML document.
 */
const gradeForm = document.getElementById("gradeForm");


/*
 * Event listener executes when the form is submitted.
 */
gradeForm.addEventListener("submit", function (event) {

    // Prevent page refresh
    event.preventDefault();


    /*
     * Read marks from the five input fields.
     *
     * Number() converts the input values
     * from strings to numbers.
     */
    const marks = [

        Number(document.getElementById("subject1").value),

        Number(document.getElementById("subject2").value),

        Number(document.getElementById("subject3").value),

        Number(document.getElementById("subject4").value),

        Number(document.getElementById("subject5").value)

    ];


    /*
     * Validate that every mark is between 0 and 100.
     */
    for (let i = 0; i < marks.length; i++) {

        if (marks[i] < 0 || marks[i] > 100) {

            alert(
                "Please enter marks between 0 and 100."
            );

            return;

        }

    }


    /*
     * Calculate the result using
     * user-defined functions.
     */
    const total = calculateTotal(marks);

    const average = calculateAverage(
        total,
        marks.length
    );

    const grade = calculateGrade(average);

    const status = calculateStatus(
        marks,
        average
    );


    /*
     * Display the result on the webpage.
     */
    document.getElementById("total").textContent =
        total;

    document.getElementById("average").textContent =
        average.toFixed(2);

    document.getElementById("grade").textContent =
        grade;

    document.getElementById("status").textContent =
        status;


    /*
     * Make the result section visible.
     */
    document.getElementById("result").style.display =
        "block";


    /*
     * Change status appearance depending
     * on Pass/Fail result.
     */
    const statusElement =
        document.getElementById("status");

    if (status === "PASS") {

        statusElement.style.color = "#15803d";

    } else {

        statusElement.style.color = "#dc2626";

    }

});


/*
 * Reset the result when the Reset button is clicked.
 */
document.getElementById("resetBtn").addEventListener(
    "click",
    function () {

        document.getElementById("result").style.display =
            "none";

    }
);