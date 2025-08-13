import assignmentsData from "@/services/mockData/assignments.json";

class AssignmentService {
  constructor() {
    this.assignments = [...assignmentsData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.assignments]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const assignment = this.assignments.find(a => a.Id === parseInt(id));
        if (assignment) {
          resolve({ ...assignment });
        } else {
          reject(new Error("Assignment not found"));
        }
      }, 250);
    });
  }

  async getByClassId(classId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.assignments.filter(a => a.classId === classId.toString());
        resolve([...filtered]);
      }, 250);
    });
  }

  async create(assignmentData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const maxId = Math.max(...this.assignments.map(a => a.Id), 0);
        const newAssignment = {
          ...assignmentData,
          Id: maxId + 1
        };
        this.assignments.push(newAssignment);
        resolve({ ...newAssignment });
      }, 400);
    });
  }

  async update(id, assignmentData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.assignments.findIndex(a => a.Id === parseInt(id));
        if (index !== -1) {
          this.assignments[index] = { ...this.assignments[index], ...assignmentData };
          resolve({ ...this.assignments[index] });
        } else {
          reject(new Error("Assignment not found"));
        }
      }, 350);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.assignments.findIndex(a => a.Id === parseInt(id));
        if (index !== -1) {
          const deletedAssignment = this.assignments.splice(index, 1)[0];
          resolve({ ...deletedAssignment });
        } else {
          reject(new Error("Assignment not found"));
        }
      }, 300);
    });
  }
}

export default new AssignmentService();