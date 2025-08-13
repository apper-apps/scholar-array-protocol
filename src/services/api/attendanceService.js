import attendanceData from "@/services/mockData/attendance.json";

class AttendanceService {
  constructor() {
    this.attendance = [...attendanceData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.attendance]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const record = this.attendance.find(a => a.Id === parseInt(id));
        if (record) {
          resolve({ ...record });
        } else {
          reject(new Error("Attendance record not found"));
        }
      }, 250);
    });
  }

  async getByStudentId(studentId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.attendance.filter(a => a.studentId === studentId.toString());
        resolve([...filtered]);
      }, 250);
    });
  }

  async getByClassId(classId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.attendance.filter(a => a.classId === classId.toString());
        resolve([...filtered]);
      }, 250);
    });
  }

  async getByDate(date) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.attendance.filter(a => a.date === date);
        resolve([...filtered]);
      }, 250);
    });
  }

  async create(attendanceData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const maxId = Math.max(...this.attendance.map(a => a.Id), 0);
        const newRecord = {
          ...attendanceData,
          Id: maxId + 1
        };
        this.attendance.push(newRecord);
        resolve({ ...newRecord });
      }, 400);
    });
  }

  async update(id, attendanceData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.attendance.findIndex(a => a.Id === parseInt(id));
        if (index !== -1) {
          this.attendance[index] = { ...this.attendance[index], ...attendanceData };
          resolve({ ...this.attendance[index] });
        } else {
          reject(new Error("Attendance record not found"));
        }
      }, 350);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.attendance.findIndex(a => a.Id === parseInt(id));
        if (index !== -1) {
          const deletedRecord = this.attendance.splice(index, 1)[0];
          resolve({ ...deletedRecord });
        } else {
          reject(new Error("Attendance record not found"));
        }
      }, 300);
    });
  }

  async getAttendanceRate(studentId, classId = null) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let records = this.attendance.filter(a => a.studentId === studentId.toString());
        
        if (classId) {
          records = records.filter(a => a.classId === classId.toString());
        }
        
        if (records.length === 0) {
          resolve(100);
          return;
        }
        
        const presentCount = records.filter(a => 
          a.status === "present" || a.status === "late"
        ).length;
        
        const rate = (presentCount / records.length) * 100;
        resolve(Math.round(rate * 100) / 100);
      }, 200);
    });
  }

  async markAttendance(studentId, classId, date, status, notes = "") {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if record already exists
        const existingIndex = this.attendance.findIndex(a => 
          a.studentId === studentId.toString() && 
          a.classId === classId.toString() && 
          a.date === date
        );
        
        if (existingIndex !== -1) {
          // Update existing record
          this.attendance[existingIndex] = {
            ...this.attendance[existingIndex],
            status,
            notes
          };
          resolve({ ...this.attendance[existingIndex] });
        } else {
          // Create new record
          const maxId = Math.max(...this.attendance.map(a => a.Id), 0);
          const newRecord = {
            Id: maxId + 1,
            studentId: studentId.toString(),
            classId: classId.toString(),
            date,
            status,
            notes
          };
          this.attendance.push(newRecord);
          resolve({ ...newRecord });
        }
      }, 400);
    });
  }
}

export default new AttendanceService();