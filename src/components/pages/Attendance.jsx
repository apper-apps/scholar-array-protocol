import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import StatusPill from "@/components/molecules/StatusPill";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import Input from "@/components/atoms/Input";
import classService from "@/services/api/classService";
import studentService from "@/services/api/studentService";
import attendanceService from "@/services/api/attendanceService";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedClass, setSelectedClass] = useState("");
  const [attendanceData, setAttendanceData] = useState({});
  const [showMarkAll, setShowMarkAll] = useState(false);

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [attendanceRecords, studentsData, classesData] = await Promise.all([
        attendanceService.getAll(),
        studentService.getAll(),
        classService.getAll()
      ]);
      
      setAttendance(attendanceRecords);
      setStudents(studentsData);
      setClasses(classesData);
      
      if (classesData.length > 0 && !selectedClass) {
        setSelectedClass(classesData[0].Id.toString());
      }
    } catch (err) {
      setError(err.message || "Failed to load attendance data");
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendanceData();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedDate) {
      loadClassAttendance();
    }
  }, [selectedClass, selectedDate, attendance]);

const loadClassAttendance = () => {
    const classAttendance = {};
    const todayAttendance = attendance.filter(record =>
      record.date_c === selectedDate && (record.class_id_c?.Id || record.class_id_c) === selectedClass
    );
    
    todayAttendance.forEach(record => {
      classAttendance[record.student_id_c?.Id || record.student_id_c] = {
        status: record.status_c,
        notes: record.notes_c,
        id: record.Id
      };
    });
    
    setAttendanceData(classAttendance);
  };

  const getStudentsInClass = () => {
    // For this demo, we'll show all students for the selected class
    // In a real app, you'd have a class enrollment system
    return students.filter(s => s.status === "active");
  };

  const handleAttendanceChange = async (studentId, status, notes = "") => {
    try {
      const record = await attendanceService.markAttendance(
        studentId, 
        selectedClass, 
        selectedDate, 
        status, 
        notes
      );
      
      // Update local state
      setAttendanceData(prev => ({
        ...prev,
[studentId]: {
          status: record.status_c,
          notes: record.notes_c,
          id: record.Id
        }
      }));
      
      // Update attendance array
      setAttendance(prev => {
const existingIndex = prev.findIndex(a => 
          (a.student_id_c?.Id || a.student_id_c) === studentId.toString() && 
          (a.class_id_c?.Id || a.class_id_c) === selectedClass && 
          a.date_c === selectedDate
        );
        
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = record;
          return updated;
        } else {
          return [...prev, record];
        }
      });
      
      toast.success("Attendance updated!");
    } catch (err) {
      toast.error("Failed to update attendance");
    }
  };

const handleMarkAllPresent = async () => {
    try {
      const classStudents = getStudentsInClass();
      const promises = classStudents.map(student =>
        attendanceService.markAttendance(student.Id, selectedClass, selectedDate, "present", "")
      );
      
      await Promise.all(promises);
      loadAttendanceData(); // Reload data
      setShowMarkAll(false);
      toast.success("All students marked present!");
    } catch (err) {
      toast.error("Failed to mark all present");
    }
  };

  const getAttendanceStats = () => {
    const classStudents = getStudentsInClass();
    const totalStudents = classStudents.length;
    const presentCount = Object.values(attendanceData).filter(a => 
      a.status === "present" || a.status === "late"
    ).length;
    const absentCount = Object.values(attendanceData).filter(a => a.status === "absent").length;
    const unmarkedCount = totalStudents - Object.keys(attendanceData).length;
    
    return {
      total: totalStudents,
      present: presentCount,
      absent: absentCount,
      unmarked: unmarkedCount,
      rate: totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0
    };
  };

  const exportAttendance = () => {
    const classItem = classes.find(c => c.Id.toString() === selectedClass);
    const classStudents = getStudentsInClass();
    
    const csvData = [
      ["Date", "Class", "Student", "Status", "Notes"],
      ...classStudents.map(student => {
        const record = attendanceData[student.Id];
        return [
          selectedDate,
          classItem ? classItem.name : "Unknown",
`${student.first_name_c} ${student.last_name_c}`,
          record ? record.status : "unmarked",
          record ? record.notes : ""
        ];
      })
    ];
    
    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-${selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success("Attendance exported successfully!");
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadAttendanceData} />;
  }

  const selectedClassItem = classes.find(c => c.Id.toString() === selectedClass);
  const classStudents = getStudentsInClass();
  const stats = getAttendanceStats();

  return (
    <div className="p-6 space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Attendance</h1>
          <p className="text-gray-600 mt-1">Track daily attendance for your classes</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={exportAttendance} className="flex items-center">
            <ApperIcon name="Download" className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowMarkAll(true)} className="flex items-center">
            <ApperIcon name="CheckCheck" className="h-4 w-4 mr-2" />
            Mark All Present
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <Select
              label="Class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
{classes.map(classItem => (
                <option key={classItem.Id} value={classItem.Id.toString()}>
                  {classItem.name} - {classItem.period_c}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Stats */}
      {selectedClass && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold gradient-text">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.present}</div>
              <div className="text-sm text-gray-600">Present</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
              <div className="text-sm text-gray-600">Absent</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.unmarked}</div>
              <div className="text-sm text-gray-600">Unmarked</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Attendance List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              {selectedClassItem && (
                <div>
                  <span>{selectedClassItem.name}</span>
                  <p className="text-sm font-normal text-gray-500 mt-1">
                    {format(new Date(selectedDate), "EEEE, MMMM dd, yyyy")}
                  </p>
                </div>
              )}
            </div>
            <div className="text-sm font-normal text-gray-500">
              Attendance Rate: {stats.rate}%
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedClass ? (
            <Empty
              title="Select a class"
              description="Choose a class to view and mark attendance"
              icon="Users"
            />
          ) : classStudents.length === 0 ? (
            <Empty
              title="No students found"
              description="There are no active students to mark attendance for"
              icon="Users"
            />
          ) : (
            <div className="space-y-2">
              {classStudents.map((student) => {
                const studentAttendance = attendanceData[student.Id];
                
                return (
                  <div
                    key={student.Id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar
initials={`${student.first_name_c?.[0] || ''}${student.last_name_c?.[0] || ''}`}
                        size="default"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {student.first_name_c} {student.last_name_c}
                        </h3>
                        <div className="text-sm text-gray-500">
                          Grade {student.grade_level_c} • {student.email_c}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {/* Status Buttons */}
                      <div className="flex space-x-2">
                        {["present", "absent", "late", "excused"].map((status) => (
                          <button
                            key={status}
                            onClick={() => handleAttendanceChange(student.Id, status)}
                            className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                              studentAttendance?.status === status
                                ? status === "present"
                                  ? "bg-green-500 text-white"
                                  : status === "absent"
                                  ? "bg-red-500 text-white"
                                  : status === "late"
                                  ? "bg-yellow-500 text-white"
                                  : "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                      </div>
                      
                      {/* Current Status */}
                      {studentAttendance ? (
                        <StatusPill status={studentAttendance.status} />
                      ) : (
                        <span className="text-sm text-gray-400 px-3 py-1 rounded-full border border-gray-200">
                          Not marked
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mark All Present Modal */}
      {showMarkAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Mark All Present
                <button
                  onClick={() => setShowMarkAll(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <ApperIcon name="CheckCheck" className="h-16 w-16 mx-auto text-green-500" />
                <div>
                  <p className="text-gray-900 font-medium">
                    Mark all {stats.total} students as present?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    This will override any existing attendance records for {format(new Date(selectedDate), "MMMM dd, yyyy")}
                  </p>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setShowMarkAll(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleMarkAllPresent}>
                    Mark All Present
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Attendance;