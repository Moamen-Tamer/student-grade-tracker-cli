import * as readline from 'readline/promises';
import {stdin, stdout, exit} from 'node:process';
import {Student, Gender, Semester, Course} from './students.js';
import {StudentTracker} from './studentTracker.js';

const studentTracker: StudentTracker = new StudentTracker();

const rl: readline.Interface = readline.createInterface({input: stdin, output: stdout});

function question(query: string): Promise<string>{
    return rl.question(query);
}

function divider(character: string, num: number): void{
    console.log(character.repeat(num));
}

function allSemesters(student: Student): string[]{
    const name: string[] = student.semesters.map(s => `${s.semesterName} ${s.semesterYear}`);
    return name;
}

function isYes(query: string): boolean {
    return (query === "yes" || query === "y" || query === "yeah" || query === "yup") ? true : false;
}

function semesterReport(student: Student): void{
    divider("─", 40);
    console.log(" ".repeat(11), "COURSES & GRADES:");
    divider("─", 40);

    student.semesters.map(s => {
        s.courses.map(c => (
            console.log(`${s.semesterName} ${s.semesterYear}:-\n`),
            console.log(` ${c.courseName}`),
            console.log(`   Homework: ${c.homework}/100`),
            console.log(`   Quiz: ${c.quiz}/100`),
            console.log(`   Project: ${c.project}/100`),
            console.log(`   Final Exam: ${c.finals}/100`),
            console.log(`   `, divider("-", 19)),
            console.log(`   Course Average: ${c.grade?.average ?? "---"}%`),
            console.log(`   Course GPA: ${c.grade?.gpa ?? "---"}`),
            console.log(`   Letter Grade: ${c.grade?.letterGrade ?? "---"}\n`)
        )), semesterStatus(student, s.semesterName)
    });
}

function semesterStatus(student: Student, semester: string): void{
    const data: Semester | undefined = student.semesters.find(s => s.semesterName === semester);

    divider("─", 40);
    console.log(" ".repeat(11), "SEMESTER SUMMARY:");
    divider("─", 40);

    console.log(`Total Courses: ${data?.courses.length ?? "---"}`);
    console.log(`Semester's GPA: ${data?.grade?.gpa ?? "---"}/4.0`);
    console.log(`Status: ${data?.grade?.report ?? "---"}`);
}

function studentReportCard(idInput: number): void{
    const student: Student | undefined = studentTracker.getStudent(idInput);

    if (!student) throw new Error(`Invalid Student ID`);

    const id: number = student.id;
    const name: string = student.name;
    const gender: Gender = student.gender;
    const semesters: string[] = allSemesters(student);

    divider("=", 40);
    console.log(" ".repeat(10), "STUDENT REPORT CARD");
    divider("=", 40);

    console.log(`Student ID: ${id}`);
    console.log(`Student Name: ${name}`);
    console.log(`Student Gender: ${gender}`);
    console.log(`student Average Grade: ${student.grade?.average ?? "---"}`);
    console.log(`Student Total GPA: ${student.grade?.gpa ?? "---"}`);
    console.log(`Student Letter Grade: ${student.grade?.letterGrade ?? "---"}`);
    console.log(`Student Semesters: ${semesters}\n`);

    semesterReport(student);

    divider("=", 40);
}

async function coursePerformanceReport(course: string): Promise<void>{
    const students: Student[] = await studentTracker.searchByCourse(course);
    const scores: number[] = students.flatMap((student: Student) =>
        student.semesters.flatMap((s: Semester) =>
            s.courses.filter((c: Course) => c.courseName === course).map((c: Course) => c.grade?.average ?? 0)
        )
    )

    divider("=", 40);
    console.log(" ".repeat(7), `${course} - COURSE REPORT`);
    divider("=", 40);

    console.log("");
    
    console.log(`Students attached to ${course}`);
    students.map((student: Student) => console.log(`   Student Name: ${student.name}\n    Average: ${student.semesters.find((s: Semester) => s.courses.find((c: Course) => c.courseName === course)?.grade?.average ?? "---")}\n    GPA: ${student.semesters.find((s: Semester) => s.courses.find((c: Course) => c.courseName === course)?.grade?.gpa ?? "---")}\n   Letter Grade: ${student.semesters.find((s: Semester) => s.courses.find((c: Course) => c.courseName === course)?.grade?.letterGrade ?? "---")}`), divider("─", 35));

    console.log(`\n\n`, divider("─", 40));

    console.log(`Course Statistics:`);
    console.log(`   Highest Score: ${Math.max(...scores)}%`);
    console.log(`   Lowest Score: ${Math.min(...scores)}%`);
    console.log(`   Class Average: ${(Math.max(...scores) + Math.min(...scores)) / 2}%`)
}

function semesterSummary(semesterName: string, semesterYear: number): void{
    const semesterStudents: Student[] = studentTracker.searchBySemester(semesterName, semesterYear);
    const gpa: number[]= semesterStudents.flatMap((student: Student) =>
        student.semesters.filter((semester: Semester) =>
            semester.semesterName === semesterName && semester.semesterYear === semesterYear
        ).map((semester: Semester) => semester.grade?.gpa ?? 0)
    )

    const top3gpa: number | undefined= gpa.sort((a, b) => b - a)[2];
    const top3: Student[] = studentTracker.searchByGPA(top3gpa!);

    divider("=", 40);
    console.log(" ".repeat(8), `${semesterName} ${semesterYear} SEMESTER REPORT`);
    divider("=", 40);

    console.log(`\n\n`);

    console.log(`Total Students: ${semesterStudents.length}`);
    console.log(`Highest Score: ${Math.max(...gpa)}/4.0`);
    console.log(`Average Gpa: ${(Math.max(...gpa) + Math.min(...gpa)) / 2}/4.0`);
    console.log(`Highest Score: ${Math.min(...gpa)}/4.0`);

    console.log(`\n\nTop Performers:`);
    console.log(`   1. ${top3[0]?.name}: - ${gpa.sort((a, b) => b - a).splice(0, 1)}`);
    console.log(`   2. ${top3[1]?.name}: - ${gpa.sort((a, b) => b - a).splice(1, 2)}`);
    console.log(`   3. ${top3[2]?.name}: - ${gpa.sort((a, b) => b - a).splice(2, 3)}`);

    divider("=", 40);
}

async function addNewStudentFlow(): Promise<void>{
    try {
        console.log("\n===Adding New Student===\n");
        const nameInput: string = await question('Student name: ');
        const genderInput: string = await question('Student gender: '); 

        const name: string | undefined = nameInput.trim().toLowerCase() ? nameInput.trim().toLowerCase() : undefined;
        const gender: Gender | undefined = genderInput.trim().toLowerCase() ? genderInput.trim().toLowerCase() as Gender : undefined;

        if (!name || !gender || (gender !== 'male' && gender !== 'female')) throw new Error(`Invalid name or gender`);

        await studentTracker.addNewStudentData(name, gender);
    } catch (error) {
        console.error("Error: ", (error as Error).message);
    }
}

async function addOldStudentFlow(): Promise<void> {
    try {
        console.log("\n===Adding Old Student===");
        const nameInput: string = await question('Student name: ');
        const genderInput: string = await question('Student gender: ');

        const name: string | undefined = nameInput.trim().toLowerCase() ? nameInput.trim().toLowerCase() : undefined;
        const gender: Gender | undefined = genderInput.trim().toLowerCase() ? genderInput.trim().toLowerCase() as Gender : undefined;

        if (!name || !gender || (gender !== 'male' && gender !== 'female')) throw new Error(`Invalid name or gender`);

        const semesterCountString: string = await question("How many semesters? ");
        const semesterCount: number = parseInt(semesterCountString);

        if (isNaN(semesterCount) || semesterCount <= 0) throw new Error(`Invalid number of semesters`);

        const semesters: Semester[] = [];

        for (let i = 0; i < semesterCount; i++) {
            console.log(`\n--- Semester ${i + 1} ---\n`)
            const semesterNameInput: string = await question(" ↳Semester Name (e.g., Fall, Winter): ");
            const semesterYearInput: string = await question(" ↳Semester Year (e.g., 2024): ");

            const semesterName: string = semesterNameInput.trim().toLowerCase() ?? undefined;
            const semesterYear: number = parseInt(semesterYearInput);

            if (!semesterName || !semesterYear || semesterYear < 1900 || isNaN(semesterYear)) throw new Error(`Invalid semester name or year`);

            const courseCountString: string = await question(`  How many courses in ${semesterName} ${semesterYear}? `);
            const courseCount: number = parseInt(courseCountString);

            if (isNaN(courseCount) || courseCount <= 0) throw new Error(`Invalid number of courses`);

            const courses: Course[] = [];

            for(let j = 0; j < courseCount; j++) {
                console.log(`\n--- Course ${j + 1} in ${semesterName} ${semesterYear} ---\n`)
                const courseNameInput: string = await question("   ↳Course Name (e.g., Mathematics): ");
                const courseHoursInput: string = await question("   ↳Course Hours (e.g., 2, 3): ");
                const courseHomeworkInput: string = await question("   ↳Course Homework Grade (from 0 to 100): ");
                const courseQuizInput: string = await question("   ↳Course Quiz Grade (from 0 to 100): ");
                const courseProjectInput: string = await question("   ↳Course Project Grade (from 0 to 100): ");
                const courseFinalsInput: string = await question("   ↳Course Final Grade (from 0 to 100): ");

                const courseName: string  | undefined = courseNameInput.trim().toLowerCase() ?? undefined;
                const courseHours: number | undefined = courseHoursInput.trim() ? parseInt(courseHoursInput) : undefined;
                const courseHomework: number | undefined = courseHomeworkInput.trim() ? parseFloat(courseHomeworkInput) : undefined;
                const courseQuiz: number | undefined = courseQuizInput.trim() ? parseFloat(courseQuizInput) : undefined;
                const courseProject: number | undefined = courseProjectInput.trim() ? parseFloat(courseProjectInput) : undefined;
                const courseFinals: number | undefined = courseFinalsInput.trim() ? parseFloat(courseFinalsInput) : undefined;

                if (!courseQuiz || !courseHomework || !courseProject || !courseFinals || !courseHours) {
                    throw new Error(`Invalid inputs`);
                }

                const courseData: Course = {
                    courseName,
                    courseHours,
                    homework: courseHomework,
                    quiz: courseQuiz,
                    project: courseProject,
                    finals: courseFinals
                }

                courses.push(courseData);
            }

            const semesterData: Semester = {
                semesterName,
                semesterYear,
                courses,
            }

            semesters.push(semesterData);
        }

        const studentData: Student = {
            id: 0,
            name,
            gender,
            semesters
        }

        const addedStudent: Student = await studentTracker.addOldStudentData(studentData);

        console.log(`\nStudent added successfully!\n`);
        studentReportCard(addedStudent.id);
    } catch (error) {
        console.error("Error: ", (error as Error).message);
    }
}

async function addSemesterFlow(): Promise<void> {
    try {
        const idInput: string = await question("Enter Student ID: ");
        const id: number = parseInt(idInput);

        if (isNaN(id) || id <= 0) throw new Error(`Invalid ID`);

        const semesterNameInput: string = await question(" ↳Semester Name (e.g., Fall, Winter): ");
        const semesterYearInput: string = await question(" ↳Semester Year (e.g., 2024): ");

        const semesterName: string = semesterNameInput.trim().toLowerCase() ?? undefined;
        const semesterYear: number = parseInt(semesterYearInput);

        if (!semesterName || !semesterYear || semesterYear < 1900 || isNaN(semesterYear)) throw new Error(`Invalid semester name or year`);

        const courseCountString: string = await question(`  How many courses in ${semesterName} ${semesterYear}? `);
        const courseCount: number | undefined = courseCountString.trim() ? parseInt(courseCountString) : undefined;

        if (!courseCount || courseCount <= 0) throw new Error(`Invalid number of courses`);

        const courses: Course[] = [];

        for(let j = 0; j < courseCount; j++) {
            console.log(`\n--- Course ${j + 1} in ${semesterName} ${semesterYear} \n`)
            const courseNameInput: string = await question("   ↳Course Name (e.g., Mathematics): ");
            const courseHoursInput: string = await question("   ↳Course Hours (e.g., 2, 3): ");
            const courseHomeworkInput: string = await question("   ↳Course Homework Grade (from 0 to 100): ");
            const courseQuizInput: string = await question("   ↳Course Quiz Grade (from 0 to 100): ");
            const courseProjectInput: string = await question("   ↳Course Project Grade (from 0 to 100): ");
            const courseFinalInputs: string = await question("   ↳Course Final Grade (from 0 to 100): ");

            const courseName: string = courseNameInput.trim().toLowerCase() ?? undefined;
            const courseHours: number = parseInt(courseHoursInput);
            const courseHomework: number = parseFloat(courseHomeworkInput);
            const courseQuiz: number = parseFloat(courseQuizInput);
            const courseProject: number = parseFloat(courseProjectInput);
            const courseFinals: number = parseFloat(courseFinalInputs);

            if (!courseQuiz || !courseHomework || !courseProject || !courseFinals || !courseHours) {
                throw new Error(`Invalid inputs`);
            }

            const courseData: Course = {
                courseName,
                courseHours,
                homework: courseHomework,
                quiz: courseQuiz,
                project: courseProject,
                finals: courseFinals
            }

            courses.push(courseData);
        }

        const semesterData: Semester = {
            semesterName,
            semesterYear,
            courses,
        }

        const addedSemester: Semester = await studentTracker.addSemester(semesterData);
        await studentTracker.editData(id, addedSemester);

        console.log(`\nSemester Added Successfully!\n`);

        semesterSummary(semesterName, semesterYear);
    } catch (error) {
        console.error("Error: ", (error as Error).message);
    }
}

async function listStudentFlow(): Promise<void> {
    try {
        const students: Student[] = studentTracker.getStudents();
        if (students.length === 0) throw new Error(`No Students Found`);
        if (students.length < 0) throw new Error(`couldn't fetch students data`);
        students.forEach((student: Student) =>
            studentReportCard(student.id)
        );
    } catch (error) {
        console.error("Error: ", (error as Error).message);
    }
}
async function deleteStudentFlow(): Promise<void> {
    const idInput: string = await question("Enter student ID: ");
    const id: number = parseInt(idInput);
    if (!idInput.trim() || isNaN(id) || id <= 0) throw new Error(`Invalid input`);
    const choiceInput: string = await question("Are you sure of deleting the student data? ");
    const choice: string = choiceInput.trim().toLowerCase();
    if (isYes(choice)) return await studentTracker.deleteData(id);
    console.log("Deletion Stopped");
}
async function filterSearch(): Promise<Student[] | undefined> {
    try {
        const searchByInput: string = await question("Search by (e.g., id, name, gender, semester, etc...): ");
        const searchBy: string | undefined = searchByInput.trim().toLowerCase() ?? undefined
        if (!searchBy) throw new Error(`Invalid Filter`);
        switch(searchBy) {
            case "id":
                const idInput: string = await question("Enter student ID: ");
                const id: number | undefined = idInput.trim() ? parseInt(idInput.trim()) : undefined;
                if (!id) throw new Error(`Invalid ID`);
                const resultByID: Student[] = await studentTracker.searchById(id);
                resultByID.map((student: Student) => console.log(`${student.name}`))
                return resultByID;
            case "name":
                const nameInput: string = await question("Enter student name: ");
                const name: string | undefined = nameInput.trim().toLowerCase() ?? undefined;
                if (!name) throw new Error(`Invalid ID`);
                const resultByName: Student[] =  await studentTracker.searchByName(name);
                resultByName.map((student: Student) => console.log(`${student.name}`))
                return resultByName;
            case "gender":
                const genderInput: string = await question("Enter student gender (male or female): ");
                const gender: string | undefined = genderInput.trim().toLowerCase() ?? undefined;
                if (!gender || (gender !== 'male' && gender !== 'female')) throw new Error(`Invalid Gender`);
                const resultByGender: Student[] = await studentTracker.searchByGender(gender as Gender);
                resultByGender.map((student: Student) => console.log(`${student.name}`))
                return resultByGender;
            case "semester":
                const semesterNameInput: string = await question("Enter semester name: ");
                const semesterYearInput: string = await question("Enter semester year: ");
                const semesterName: string | undefined = semesterNameInput.trim() ?? undefined;
                const semesterYear: number | undefined = semesterYearInput.trim() ? parseInt(semesterYearInput) : undefined;
                if (!semesterName || !semesterYear || semesterYear < 1900) throw new Error(`Invalid Semester Name or Year`);
                const resultBySemester: Student[] = await studentTracker.searchBySemester(semesterName, semesterYear);
                resultBySemester.map((student: Student) => console.log(`${student.name}`))
                return resultBySemester;
            case "course":
                const courseNameInput: string = await question("Enter courseName: ");
                const courseName: string | undefined = courseNameInput.trim().toLowerCase() ?? undefined;
                if (!courseName) throw new Error(`Invalid Course Name`);
                const resultByCourse: Student[] = await studentTracker.searchByCourse(courseName);
                resultByCourse.map((student: Student) => console.log(`${student.name}`))
                return resultByCourse;
            case "grade":
                const averageGradeInput: string = await question("Enter Average Grade: ");
                const averageGrade: number | undefined = averageGradeInput.trim() ? parseFloat(averageGradeInput) : undefined;
                if (!averageGrade || averageGrade < 0 || averageGrade > 100) throw new Error(`Invalid Average Grade`);
                const resultByAverageGrade: Student[] = await studentTracker.searchByAverageGrade(averageGrade);
                resultByAverageGrade.map((student: Student) => console.log(`${student.name}`))
                return resultByAverageGrade;
            case "gpa":
                const gpaInput: string = await question("Enter GPA: ");
                const gpa: number | undefined = gpaInput.trim() ? parseFloat(gpaInput) : undefined;
                if (!gpa || gpa < 0 || gpa > 4) throw new Error(`Invalid GPA`);
                const resultByGPA: Student[] = await studentTracker.searchByGPA(gpa);
                resultByGPA.map((student: Student) => console.log(`${student.name}`))
                return resultByGPA;
        }
    } catch (error) {
        console.error("Error: ", (error as Error).message);
    }
}
function displayMenu(): void {
    console.log(`\n=== Students Tracker CLI ===`);
    console.log(`1. Add New Student`);
    console.log(`2. Add Old Student`);
    console.log(`3. Add a Semester`);
    console.log(`4. List All Students`);
    console.log(`5. Search For Students`);
    console.log(`6. Student Report Card`);
    console.log(`7. Delete Student`);
    console.log(`8. Semester Summary`);
    console.log(`9. Course Performance Report`);
    console.log(`10. Exit`);
}
async function main(): Promise<void> {
    console.log("\nLoading students data...");
    await studentTracker.loadData();
    console.log("Students data loaded successfully");
    let running: boolean = true;
    while (running) {
        displayMenu();
        const choice: string = await question("Choose an option: ");
        switch(choice.trim()) {
            case "1":
                await addNewStudentFlow();
                break;
            case "2":
                await addOldStudentFlow();
                break;
            case "3":
                await addSemesterFlow();
                break;
            case "4":
                await listStudentFlow();
                break;
            case "5":
                await filterSearch();
                break;
            case "6":   
                const idInput: string = await question("Enter Student ID: ");
                const id: number | undefined = idInput.trim() ? parseInt(idInput) : undefined;
                if (!id) throw new Error(`Invalid Student ID`);
                await studentReportCard(id);
                break;
            case "7":
                await deleteStudentFlow();
                break;
            case "8":
                const semesterNameInput: string = await question("Enter semester name: ");
                const semesterYearInput: string = await question("Enter semester year: ");
                
                const semesterName: string | undefined = semesterNameInput.trim().toLowerCase() ?? undefined;
                const semesterYear: number | undefined = semesterYearInput.trim() ? parseInt(semesterYearInput) : undefined;
                if (!semesterName || !semesterYear || semesterYear < 1900) throw new Error(`Invalid Semester Name or Year`);
                await semesterSummary(semesterName, semesterYear);
                break;
            case "9":
                const courseNameInput: string = await question("Enter course name: ");
                const courseName: string | undefined = courseNameInput.trim().toLowerCase() ?? undefined;
                if (!courseName) throw new Error(`Invalid Course Name`);
                await coursePerformanceReport(courseName);
                break;
            case "10":
                running = false;
                console.log(`\nGoodbye!`);
                break;
            default:
                console.log(`\nInvalid option, Please try again`);
        }
    }
    rl.close();
}
try {
    await main();
} catch (error) {
    console.error("Fatal Error: ", (error as Error).message);
    exit(1);
}