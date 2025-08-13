import React from "react";
import Error from "@/components/ui/Error";
class AttendanceService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = "attendance_c";
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } }
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
        console.error("Error fetching attendance:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching attendance:", error.message);
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
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } }
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
        console.error(`Error fetching attendance record with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching attendance record with ID ${id}:`, error.message);
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
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } }
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
        console.error("Error fetching attendance by student ID:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching attendance by student ID:", error.message);
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
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } }
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
        console.error("Error fetching attendance by class ID:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching attendance by class ID:", error.message);
        throw error;
      }
    }
  }

  async getByDate(date) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } }
        ],
        where: [{
          FieldName: "date_c",
          Operator: "EqualTo",
          Values: [date]
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
        console.error("Error fetching attendance by date:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching attendance by date:", error.message);
        throw error;
      }
    }
  }

  async create(attendanceData) {
    try {
      const params = {
        records: [{
          Name: `Attendance for ${attendanceData.studentId}`,
          student_id_c: parseInt(attendanceData.studentId),
          class_id_c: parseInt(attendanceData.classId),
          date_c: attendanceData.date,
          status_c: attendanceData.status,
          notes_c: attendanceData.notes || ""
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
          console.error(`Failed to create attendance ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create attendance record");
        }
        
        return successfulRecords[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating attendance record:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating attendance record:", error.message);
        throw error;
      }
    }
  }

  async update(id, attendanceData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };
      
      // Only include updateable fields
      if (attendanceData.studentId !== undefined) updateData.student_id_c = parseInt(attendanceData.studentId);
      if (attendanceData.classId !== undefined) updateData.class_id_c = parseInt(attendanceData.classId);
      if (attendanceData.date !== undefined) updateData.date_c = attendanceData.date;
      if (attendanceData.status !== undefined) updateData.status_c = attendanceData.status;
      if (attendanceData.notes !== undefined) updateData.notes_c = attendanceData.notes;
      
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
          console.error(`Failed to update attendance ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || "Failed to update attendance record");
        }
        
        return successfulUpdates[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating attendance record:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating attendance record:", error.message);
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
          console.error(`Failed to delete attendance ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || "Failed to delete attendance record");
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting attendance record:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting attendance record:", error.message);
        throw error;
      }
    }
  }

  async getAttendanceRate(studentId, classId = null) {
    try {
      let params = {
        fields: [
          { field: { Name: "status_c" } }
        ],
        where: [{
          FieldName: "student_id_c",
          Operator: "EqualTo",
          Values: [parseInt(studentId)]
        }]
      };
      
      if (classId) {
        params.where.push({
          FieldName: "class_id_c",
          Operator: "EqualTo",
          Values: [parseInt(classId)]
        });
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return 100; // Default to 100% if can't fetch
      }
      
      const records = response.data || [];
      if (records.length === 0) {
        return 100;
      }
      
      const presentCount = records.filter(a => 
        a.status_c === "present" || a.status_c === "late"
      ).length;
      
      const rate = (presentCount / records.length) * 100;
      return Math.round(rate * 100) / 100;
    } catch (error) {
      console.error("Error calculating attendance rate:", error.message);
      return 100; // Default to 100% on error
    }
  }

  async markAttendance(studentId, classId, date, status, notes = "") {
    try {
      // First, check if record already exists
      const existingParams = {
        fields: [
          { field: { Name: "Name" } }
        ],
        where: [
          {
            FieldName: "student_id_c",
            Operator: "EqualTo",
            Values: [parseInt(studentId)]
          },
          {
            FieldName: "class_id_c",
            Operator: "EqualTo",
            Values: [parseInt(classId)]
          },
          {
            FieldName: "date_c",
            Operator: "EqualTo",
            Values: [date]
          }
        ]
      };
      
      const existingResponse = await this.apperClient.fetchRecords(this.tableName, existingParams);
      
      if (existingResponse.success && existingResponse.data && existingResponse.data.length > 0) {
        // Update existing record
        const existingRecord = existingResponse.data[0];
        return await this.update(existingRecord.Id, {
          status,
          notes
        });
      } else {
        // Create new record
        return await this.create({
          studentId: parseInt(studentId),
          classId: parseInt(classId),
          date,
          status,
          notes
        });
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error marking attendance:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error marking attendance:", error.message);
        throw error;
      }
    }
}
}

export default new AttendanceService();