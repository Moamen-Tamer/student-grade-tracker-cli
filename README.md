# 🎓 Student Grade Tracker CLI

A comprehensive TypeScript-based command-line application for managing student academic records with automatic grade calculations, performance analytics, and detailed reporting capabilities.

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Technical Highlights](#technical-highlights)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [What I Learned](#what-i-learned)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## 🎯 About This Project

This project represents a significant step in my TypeScript and backend development journey. Built as a learning project following a structured curriculum, this CLI application manages complex hierarchical academic data with automatic grade calculations across multiple levels.

### The Challenge

Unlike simple flat-data applications, this system handles:
- **4-level data hierarchy**: Student → Semester → Course → Grade
- **Automatic calculations** propagating through all levels
- **Multiple data entry modes** for different use cases
- **Complex search and filtering** across nested structures
- **Professional report generation** with formatted output

### My Approach

While following a structured learning path, I:
- ✅ Designed a flexible two-mode system (new vs. existing students)
- ✅ Implemented 7 different search filters for data access
- ✅ Created 3 types of analytical reports
- ✅ Built comprehensive input validation at every level
- ✅ Debugged complex data flow issues independently
- ✅ Added semantic grade interpretations (Excellent, Very Good, etc.)

---

## ✨ Features

### Core Functionality

- 📝 **Dual Student Entry Modes**
  - New students: Quick registration with empty academic history
  - Existing students: Full data import with complete semester records
  
- 📊 **Automatic Grade Calculations**
  - Course level: Averages homework, quiz, project, and final exam scores
  - Semester level: Calculates from all course grades
  - Student level: Overall GPA from all semesters
  - Letter grades (A+ through F) with semantic interpretations

- 🔍 **Advanced Search System**
  - Search by Student ID
  - Search by Name
  - Filter by Gender
  - Find by Semester enrollment
  - Find by Course enrollment
  - Filter by minimum average grade
  - Filter by minimum GPA

- 📑 **Three Report Types**
  1. **Student Report Card**: Complete academic history with all courses and grades
  2. **Course Performance Report**: Compare all students in a specific course
  3. **Semester Summary**: Statistics and top performers for a semester

### Data Management

-  Add new students (minimal info)
-  Add existing students (full academic history)
-  Add semesters to existing students
-  Delete student records (with confirmation)
-  Persistent JSON storage
-  Automatic data validation

---

## 🛠️ Technical Highlights

### TypeScript Features

```typescript
// Complex nested interfaces with optional properties
interface Student {
  id: number;
  name: string;
  gender: Gender;
  semesters: Semester[];
  grade?: Grade;
}

// Union types for restricted values
type Gender = 'male' | 'female';

// Utility types for flexible updates
async editData(id: number, update: Semester): Promise<Student>
```

### Advanced Patterns

- **Hierarchical Data Processing**: Grades calculated bottom-up through nested structures
- **Promise.all() for Parallel Processing**: Efficient batch operations on arrays
- **Type Guards & Error Handling**: Custom error classes with specific error types
- **Functional Programming**: Heavy use of map, filter, reduce for data transformation
- **Async/Await Patterns**: Proper handling of file I/O and sequential operations

### Architecture Decisions

1. **Separation of Concerns**: Types, business logic, and UI in separate modules
2. **Two-Function Pattern**: Singular (`addSemester`) and plural (`addSemesters`) methods for flexibility
3. **Step-by-Step Calculations**: Avoiding the pitfall of using uncalculated data in object literals
4. **Helper Functions**: Reusable utilities like `divider()`, `isYes()`, `allSemesters()`

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **TypeScript** (installed via npm)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Moamen-Tamer/student-grade-tracker.git
   cd student-grade-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Compile TypeScript**
   ```bash
   npm run build
   ```

4. **Run the application**
   ```bash
   npm start
   ```

---

## 💻 Usage

### Main Menu

```
=== Students Tracker CLI ===
1. Add New Student
2. Add Old Student
3. Add a Semester
4. List All Students
5. Search For Students
6. Student Report Card
7. Delete Student
8. Semester Summary
9. Course Performance Report
10. Exit
```

### Example Workflow

**Scenario 1: Adding a New Student**
```
Choose option: 1
Student name: ahmed mohamed
Student gender: male

✓ Student added successfully!
```

**Scenario 2: Adding an Existing Student with History**
```
Choose option: 2
Student name: sara ali
Student gender: female
How many semesters? 2

--- Semester 1 ---
↳Semester Name: fall
↳Semester Year: 2024
How many courses in fall 2024? 2

--- Course 1 in fall 2024 ---
↳Course Name: mathematics
↳Course Hours: 3
↳Homework Grade: 85
↳Quiz Grade: 90
↳Project Grade: 88
↳Final Grade: 92

[Automatically calculates and displays full report card]
```

**Scenario 3: Generating a Course Performance Report**
```
Choose option: 9
Enter course name: mathematics

═══════════════════════════════════════
    mathematics - COURSE REPORT
═══════════════════════════════════════

Students attached to mathematics:
   Student Name: ahmed mohamed
   Average: 88.75%
   GPA: 3.44/4.0
   Letter Grade: B+

Course Statistics:
   Highest Score: 92.5%
   Lowest Score: 85.0%
   Class Average: 88.75%
```

---

## 📂 Project Structure

```
student-grade-tracker/
├── src/
│   ├── cli.ts               # User interface and interaction flows
│   ├── studentTracker.ts    # Core business logic and data management
│   └── students.ts          # Interfaces, types, and error classes
├── LICENSE
├── README.md                # This file
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

### Module Breakdown

**`students.ts`** - Type Definitions
- `Student`, `Semester`, `Course`, `Grade` interfaces
- `Gender` union type
- Custom error classes: `StudentNotFoundError`, `FileOperationError`, `InvalidStudentDataError`

**`studentTracker.ts`** - Business Logic
- Data persistence (load/save to JSON)
- Grade calculation algorithms
- CRUD operations for students and semesters
- Search and filter functions

**`cli.ts`** - User Interface
- Interactive menu system
- Input validation and user prompts
- Report formatting and display
- Main application loop

---

## 📚 What I Learned

### Technical Skills

**TypeScript Mastery**
- Working with complex nested interfaces
- Using utility types (`Partial`, `Omit`) effectively
- Type guards and type assertions
- Optional property handling with strict settings

**Data Structure Design**
- Modeling hierarchical relationships
- Maintaining data integrity across levels
- Calculating derived data efficiently
- Avoiding circular dependencies

**Asynchronous Programming**
- Proper async/await patterns
- Promise.all() for parallel operations
- Error propagation in async chains
- File I/O with fs/promises

**Node.js Development**
- File system operations (reading/writing JSON)
- Path handling with cross-platform compatibility
- Interactive CLI with readline
- Process management and exit codes

### Problem-Solving Achievements

**Challenge 1: Nested Input Complexity**
- **Problem**: Asking for all nested data upfront was overwhelming
- **Solution**: Created two entry modes - minimal registration vs. full import
- **Learning**: UX matters even in CLI applications

**Challenge 2: Grade Calculation Flow**
- **Problem**: Initially tried to use calculated data before it was computed
- **Solution**: Split calculations into sequential steps, storing intermediate results
- **Learning**: Object literal properties can't reference the object being created

**Challenge 3: Search Filter Implementation**
- **Problem**: Filtering nested arrays to find parent objects
- **Solution**: Used `.some()` to check if any nested item matches criteria
- **Learning**: Understanding difference between `.filter()` (transforms array) and `.some()` (tests condition)

### Software Engineering Practices

- Separation of concerns (types, logic, UI)
- DRY principle (reusing singular functions in plural versions)
- Input validation at every entry point
- Meaningful error messages
- Helper functions for code reusability
- Consistent naming conventions

---

## 🔧 Configuration

### TypeScript Settings (`tsconfig.json`)

Key configurations:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "exactOptionalPropertyTypes": false
  }
}
```

### NPM Scripts

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/cli.js",
    "dev": "tsc && node dist/cli.js"
  }
}
```

---

## 🔮 Future Enhancements

Ideas for extending this project:

### Features
- [ ] Edit student information (name, gender)
- [ ] Edit existing semester/course data
- [ ] GPA trend analysis over time
- [ ] Export reports to PDF or CSV
- [ ] Grade distribution charts
- [ ] Class ranking system
- [ ] Email report functionality
- [ ] Multi-user support with authentication
- [ ] Web-based dashboard UI

### Technical Improvements
- [ ] Add unit tests with Jest
- [ ] Implement database storage (PostgreSQL/MongoDB)
- [ ] Add input history/autocomplete
- [ ] Color-coded CLI output
- [ ] Progress bars for data loading
- [ ] Backup and restore functionality
- [ ] Data validation with Zod or similar
- [ ] API endpoint creation with Express

---

## 🤝 Contributing

This is a personal learning project, but feedback and suggestions are welcome!

---

## 📊 Project Stats

- **Lines of Code**: ~550
- **Files**: 3 TypeScript modules
- **Interfaces**: 4 core data structures
- **Functions**: 25+ (CLI flows, helpers, business logic)
- **Search Filters**: 7
- **Report Types**: 3
- **Development Time**: ~3 days of focused work

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Built as part of a comprehensive TypeScript learning curriculum
- Inspired by real-world academic management systems

---

## 📞 Contact

**Your Name**
- LinkedIn: [Mo'men Tamer](https://www.linkedin.com/in/mo-men-tamer-86a57b336)
- GitHub: [Mo'men Tamer](https://github.com/Moamen-Tamer)

---

## 📸 Screenshots

### Main Menu
```
=== Students Tracker CLI ===
1. Add New Student
2. Add Old Student
3. Add a Semester
4. List All Students
5. Search For Students
6. Student Report Card
7. Delete Student
8. Semester Summary
9. Course Performance Report
10. Exit
```

### Sample Report Card
```
════════════════════════════════════════
          STUDENT REPORT CARD
════════════════════════════════════════
Student ID: 1
Student Name: ahmed mohamed
Student Gender: male
Student Average Grade: 88.5%
Student Total GPA: 3.43/4.0
Student Letter Grade: B+

────────────────────────────────────────
           COURSES & GRADES:
────────────────────────────────────────

fall 2024:-

 mathematics
   Homework: 85/100
   Quiz: 90/100
   Project: 88/100
   Final Exam: 92/100
   ───────────────────
   Course Average: 88.75%
   Course GPA: 3.44
   Letter Grade: B+

────────────────────────────────────────
          SEMESTER SUMMARY:
────────────────────────────────────────
Total Courses: 2
Semester's GPA: 3.45/4.0
Status: Very Good
════════════════════════════════════════
```
