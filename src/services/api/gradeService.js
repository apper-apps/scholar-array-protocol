class GradeService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = "grade_c";
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "assignment_id_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "max_score_c" } },
          { field: { Name: "percentage_c" } },
          { field: { Name: "letter_grade_c" } },
          { field: { Name: "date_recorded_c" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching grades:", error.message);
        throw error;
      }
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "assignment_id_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "max_score_c" } },
          { field: { Name: "percentage_c" } },
          { field: { Name: "letter_grade_c" } },
          { field: { Name: "date_recorded_c" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching grade with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching grade with ID ${id}:`, error.message);
        throw error;
      }
    }
  }

  async getByStudentId(studentId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "assignment_id_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "max_score_c" } },
          { field: { Name: "percentage_c" } },
          { field: { Name: "letter_grade_c" } },
          { field: { Name: "date_recorded_c" } }
        ],
        where: [{
          FieldName: "student_id_c",
          Operator: "EqualTo",
          Values: [parseInt(studentId)]
        }]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades by student ID:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching grades by student ID:", error.message);
        throw error;
      }
    }
  }

  async getByClassId(classId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "assignment_id_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "max_score_c" } },
          { field: { Name: "percentage_c" } },
          { field: { Name: "letter_grade_c" } },
          { field: { Name: "date_recorded_c" } }
        ],
        where: [{
          FieldName: "class_id_c",
          Operator: "EqualTo",
          Values: [parseInt(classId)]
        }]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades by class ID:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching grades by class ID:", error.message);
        throw error;
      }
    }
  }

  async create(gradeData) {
    try {
      const percentage = Math.round((gradeData.score / gradeData.maxScore) * 100);
      const letterGrade = this.calculateLetterGrade(percentage);
      
      const params = {
        records: [{
          Name: `Grade for ${gradeData.studentId}`,
          student_id_c: parseInt(gradeData.studentId),
          class_id_c: parseInt(gradeData.classId),
          assignment_id_c: parseInt(gradeData.assignmentId),
          score_c: parseFloat(gradeData.score),
          max_score_c: parseFloat(gradeData.maxScore),
          percentage_c: percentage,
          letter_grade_c: letterGrade,
          date_recorded_c: new Date().toISOString().split("T")[0]
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create grade ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create grade");
        }
        
        return successfulRecords[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating grade:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating grade:", error.message);
        throw error;
      }
    }
  }

  async update(id, gradeData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };
      
      if (gradeData.score !== undefined && gradeData.maxScore !== undefined) {
        const percentage = Math.round((gradeData.score / gradeData.maxScore) * 100);
        const letterGrade = this.calculateLetterGrade(percentage);
        updateData.score_c = parseFloat(gradeData.score);
        updateData.max_score_c = parseFloat(gradeData.maxScore);
        updateData.percentage_c = percentage;
        updateData.letter_grade_c = letterGrade;
      }
      
      if (gradeData.studentId !== undefined) updateData.student_id_c = parseInt(gradeData.studentId);
      if (gradeData.classId !== undefined) updateData.class_id_c = parseInt(gradeData.classId);
      if (gradeData.assignmentId !== undefined) updateData.assignment_id_c = parseInt(gradeData.assignmentId);
      if (gradeData.dateRecorded !== undefined) updateData.date_recorded_c = gradeData.dateRecorded;
      
      const params = {
        records: [updateData]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update grade ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || "Failed to update grade");
        }
        
        return successfulUpdates[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating grade:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating grade:", error.message);
        throw error;
      }
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete grade ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || "Failed to delete grade");
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting grade:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting grade:", error.message);
        throw error;
      }
    }
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
    try {
      const grades = await this.getByClassId(classId);
      if (grades.length === 0) {
        return 0;
      }
      
      const average = grades.reduce((sum, grade) => sum + (grade.percentage_c || 0), 0) / grades.length;
      return Math.round(average * 100) / 100;
    } catch (error) {
      console.error("Error calculating class average:", error.message);
      return 0;
    }
  }

  async getStudentAverage(studentId) {
    try {
      const grades = await this.getByStudentId(studentId);
      if (grades.length === 0) {
        return 0;
      }
      
      const average = grades.reduce((sum, grade) => sum + (grade.percentage_c || 0), 0) / grades.length;
      return Math.round(average * 100) / 100;
    } catch (error) {
      console.error("Error calculating student average:", error.message);
      return 0;
    }
}
}

export default new GradeService();