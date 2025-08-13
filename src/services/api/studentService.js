import studentsData from "@/services/mockData/students.json";

class StudentService {
  constructor() {
    this.students = [...studentsData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.students]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const student = this.students.find(s => s.Id === parseInt(id));
        if (student) {
          resolve({ ...student });
        } else {
          reject(new Error("Student not found"));
        }
      }, 250);
    });
  }

  async create(studentData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const maxId = Math.max(...this.students.map(s => s.Id), 0);
        const newStudent = {
          ...studentData,
          Id: maxId + 1,
          enrollmentDate: new Date().toISOString().split("T")[0],
          status: "active"
        };
        this.students.push(newStudent);
        resolve({ ...newStudent });
      }, 400);
    });
  }

  async update(id, studentData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.students.findIndex(s => s.Id === parseInt(id));
        if (index !== -1) {
          this.students[index] = { ...this.students[index], ...studentData };
          resolve({ ...this.students[index] });
        } else {
          reject(new Error("Student not found"));
        }
      }, 350);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.students.findIndex(s => s.Id === parseInt(id));
        if (index !== -1) {
          const deletedStudent = this.students.splice(index, 1)[0];
          resolve({ ...deletedStudent });
        } else {
          reject(new Error("Student not found"));
        }
      }, 300);
    });
  }

  async getByGradeLevel(gradeLevel) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.students.filter(s => s.gradeLevel === gradeLevel);
        resolve([...filtered]);
      }, 200);
    });
  }

  async search(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowercaseQuery = query.toLowerCase();
        const filtered = this.students.filter(s => 
          s.firstName.toLowerCase().includes(lowercaseQuery) ||
          s.lastName.toLowerCase().includes(lowercaseQuery) ||
          s.email.toLowerCase().includes(lowercaseQuery)
        );
        resolve([...filtered]);
      }, 250);
    });
  }
}

export default new StudentService();