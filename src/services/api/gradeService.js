import gradesData from "@/services/mockData/grades.json";

class GradeService {
  constructor() {
    this.grades = [...gradesData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.grades]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const grade = this.grades.find(g => g.Id === parseInt(id));
        if (grade) {
          resolve({ ...grade });
        } else {
          reject(new Error("Grade not found"));
        }
      }, 250);
    });
  }

  async getByStudentId(studentId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.grades.filter(g => g.studentId === studentId.toString());
        resolve([...filtered]);
      }, 250);
    });
  }

  async getByClassId(classId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.grades.filter(g => g.classId === classId.toString());
        resolve([...filtered]);
      }, 250);
    });
  }

  async create(gradeData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const maxId = Math.max(...this.grades.map(g => g.Id), 0);
        const percentage = Math.round((gradeData.score / gradeData.maxScore) * 100);
        const letterGrade = this.calculateLetterGrade(percentage);
        
        const newGrade = {
          ...gradeData,
          Id: maxId + 1,
          percentage,
          letterGrade,
          dateRecorded: new Date().toISOString().split("T")[0]
        };
        this.grades.push(newGrade);
        resolve({ ...newGrade });
      }, 400);
    });
  }

  async update(id, gradeData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.grades.findIndex(g => g.Id === parseInt(id));
        if (index !== -1) {
          const percentage = Math.round((gradeData.score / gradeData.maxScore) * 100);
          const letterGrade = this.calculateLetterGrade(percentage);
          
          this.grades[index] = { 
            ...this.grades[index], 
            ...gradeData,
            percentage,
            letterGrade
          };
          resolve({ ...this.grades[index] });
        } else {
          reject(new Error("Grade not found"));
        }
      }, 350);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.grades.findIndex(g => g.Id === parseInt(id));
        if (index !== -1) {
          const deletedGrade = this.grades.splice(index, 1)[0];
          resolve({ ...deletedGrade });
        } else {
          reject(new Error("Grade not found"));
        }
      }, 300);
    });
  }

  calculateLetterGrade(percentage) {
    if (percentage >= 97) return "A+";
    if (percentage >= 93) return "A";
    if (percentage >= 90) return "A-";
    if (percentage >= 87) return "B+";
    if (percentage >= 83) return "B";
    if (percentage >= 80) return "B-";
    if (percentage >= 77) return "C+";
    if (percentage >= 73) return "C";
    if (percentage >= 70) return "C-";
    if (percentage >= 65) return "D";
    return "F";
  }

  async getClassAverage(classId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const classGrades = this.grades.filter(g => g.classId === classId.toString());
        if (classGrades.length === 0) {
          resolve(0);
          return;
        }
        
        const average = classGrades.reduce((sum, grade) => sum + grade.percentage, 0) / classGrades.length;
        resolve(Math.round(average * 100) / 100);
      }, 200);
    });
  }

  async getStudentAverage(studentId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const studentGrades = this.grades.filter(g => g.studentId === studentId.toString());
        if (studentGrades.length === 0) {
          resolve(0);
          return;
        }
        
        const average = studentGrades.reduce((sum, grade) => sum + grade.percentage, 0) / studentGrades.length;
        resolve(Math.round(average * 100) / 100);
      }, 200);
    });
  }
}

export default new GradeService();