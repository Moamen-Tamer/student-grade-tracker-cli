export interface Student {
    id: number
    name: string,
    gender: Gender,
    semesters: Semester[],
    grade?: Grade
}

export interface Semester {
    semesterName: string,
    semesterYear: number,
    courses: Course[],
    grade?: Grade
}

export interface Course {
    courseName: string,
    courseHours: number,
    homework: number,
    quiz: number,
    project: number,
    finals: number,
    grade?: Grade
}

export interface Grade {
    average: number,
    gpa: number,
    letterGrade: string,
    report: string
}

export type Gender = 'male' | 'female';

export class StudentNotFoundError extends Error {
    constructor(query: number | string) {
        super(`student with data "${query}" couldn't be found`);
        this.name = 'StudentNotFoundError';
    }
}   

export class FileOperationError extends Error {
    constructor(operation: string, originalError: Error) {
        super(`failed to ${operation}: ${originalError}`);
        this.name = 'FileOperatorError';
    }
}

export class InvalidStudentDataError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidStudentDataError';
    }
}