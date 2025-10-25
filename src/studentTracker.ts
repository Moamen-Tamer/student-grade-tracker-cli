import * as fs from 'fs/promises';
import path from 'path';
import {
    Student,
    Gender,
    Semester,
    Grade,
    StudentNotFoundError,
    InvalidStudentDataError,
    FileOperationError,
    Course
} from './students.js'

const STUDENTS_FILE = path.join(process.cwd(), 'students.json');

export class StudentTracker {
    private nextID: number = 1;
    private students: Student[] = [];

    constructor() {};

    async loadData(): Promise<void> {
        try {
            const data = await fs.readFile(STUDENTS_FILE, 'utf-8');
            const parsed = JSON.parse(data);

            this.students = parsed.studentData.map((student: any) => ({
                ...student,
                fetchedAt: new Date()
            }));

            this.nextID = parsed.nextID;
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                this.students = [];
                this.nextID = 1;
            } else {
                throw new FileOperationError('fetch students data', error as Error);
            }
        }
    }

    async saveData(): Promise<void> {
        try {
            const data = {
                studentsData: this.students,
                nextID: this.nextID,
                lastUpdate: new Date()
            }

            await fs.writeFile(STUDENTS_FILE, JSON.stringify(data, null, 2), 'utf-8');
        } catch (error) {
            throw new FileOperationError('save students data', error as Error);
        }
    }

    async addNewStudentData (name: string, gender: Gender): Promise<Student> {
        if (!name.trim()) throw new InvalidStudentDataError("Name cannot be empty");
        
        const newStudent: Student = {
            id: this.nextID++,
            name: name,
            gender: gender,
            semesters: []
        };

        this.students.push(newStudent);
        await this.saveData();
        return newStudent;
    }

    async addOldStudentData (student: Student): Promise<Student> {
        if (!student.name.trim()) throw new InvalidStudentDataError("Name cannot be empty");

        const addedSemesters = await this.addSemesters(...student.semesters);

        const addedGrades = await this.addGrades(...addedSemesters.map((s: any) => s.grade!.average))

        const newStudent: Student = {
            id: this.nextID++,
            name: student.name.trim().toLowerCase(),
            gender: student.gender,
            semesters: addedSemesters,
            grade: addedGrades
        };

        this.students.push(newStudent);
        await this.saveData();
        return newStudent;
    }

    async addSemester (semester: Semester): Promise<Semester> {
        const calculatedCourses = await this.addCourses(...semester.courses);
        const semesterGrades = await this.addGrades(...calculatedCourses.map(c => c.grade!.average));
        
        return {
            ...semester,
            courses: calculatedCourses,
            grade: semesterGrades
        };
    }

    async addSemesters (...semesters: Semester[]): Promise<Semester[]> {
        return await Promise.all(
            semesters.map(s => this.addSemester(s))
           )
    }

    async addCourses (...courses: Course[]): Promise<Course[]> {
        const newCourses: Course[] = await Promise.all(
            courses.map(async c => ({
            ...c,
            grade: await this.addGrades(c.finals, c.homework, c.project, c.quiz)
            }))
        );

        return newCourses;
    }

    async addGrades (...grades: number[]): Promise<Grade> {
        const total:number = grades.reduce((sum, g) => sum + g, 0);
        const Average: number = total / grades.length;
        const Gpa: number = (Average - 20) / 20;

        if (Average > 100 || Gpa > 4) throw new InvalidStudentDataError('grades error');

        const Letter: string = Average >= 96 ? "A+":
                       Average >= 92 ? "A" :
                       Average >= 88 ? "A-":
                       Average >= 84 ? "B+":
                       Average >= 80 ? "B" :
                       Average >= 76 ? "B-":
                       Average >= 72 ? "C+":
                       Average >= 68 ? "C" :
                       Average >= 64 ? "C-":
                       Average >= 60 ? "D+":
                       Average >= 55 ? "D" :
                       Average >= 50 ? "D-": "F";

        const Report: string = (Letter === "A+" || Letter === "A" || Letter === "A-") ? "Excellent" :
                               (Letter === "B+" || Letter === "B" || Letter === "B-") ? "Very Good" :
                               (Letter === "D+" || Letter === "D" || Letter === "D-") ? "Good Standing" :
                               (Letter === "C+" || Letter === "C" || Letter === "C-") ? "Not Bad" :
                               (Letter === "D+" || Letter === "D" || Letter === "D-") ? "Needs Improvements" : "Below Expectations";

        const newGrades: Grade = {
            average: Average,
            gpa: Gpa,
            letterGrade: Letter,
            report: Report
        }

        return newGrades;
    }

    async editData (
        id: number,
        update: Semester
    ): Promise<Student> {
        const student: Student | undefined = this.students.find((s: any) => s.id === id);

        if (!student) {
            throw new StudentNotFoundError(id);
        }

        student.semesters.push(update)

        await this.saveData();
        return student;
    }

    async deleteData (id: number): Promise<void> {
        const index = this.students.findIndex((s: any) => s.id === id);

        if (!index) throw new StudentNotFoundError(id);

        this.students.splice(index, 1);
        await this.saveData();
    }

    getStudent(id: number): Student | undefined{
        return this.students.find(s => s.id === id);
    }

    getStudents(): Student[] {
        return [...this.students];
    }

    searchById (id: number): Student[] {
        return this.students.filter(student => student.id === id)
    }

    searchByName (name: string): Student[] {
        return this.students.filter(student => student.name === name);
    }

    searchByGender (gender: Gender): Student[] {
        return this.students.filter(student => student.gender === gender);
    }

    searchBySemester (semesterName: string, semesterYear: number): Student[] {
        return this.students.filter(student => 
            student.semesters?.some(semester => semester.semesterName === semesterName && semester.semesterYear === semesterYear)
        );
    }

    searchByCourse (courseName: string): Student[] {
        return this.students.filter(student =>
            student.semesters?.some(semester =>
                semester.courses.some(course => course.courseName === courseName)
            )
        );
    }

    searchByAverageGrade (averageInput: number): Student[] {
        return this.students.filter(student => student.grade && student.grade?.average >= averageInput);
    }

    searchByGPA (gpaInput: number): Student[] {
        return this.students.filter(student => student.grade && student.grade?.gpa >= gpaInput);
    }
}