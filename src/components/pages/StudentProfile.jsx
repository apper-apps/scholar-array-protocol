import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Avatar from "@/components/atoms/Avatar";
import GradeBadge from "@/components/molecules/GradeBadge";
import StatusPill from "@/components/molecules/StatusPill";
import ProgressRing from "@/components/molecules/ProgressRing";
import ApperIcon from "@/components/ApperIcon";
import studentService from "@/services/api/studentService";
import gradeService from "@/services/api/gradeService";
import attendanceService from "@/services/api/attendanceService";
import classService from "@/services/api/classService";
import assignmentService from "@/services/api/assignmentService";

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [averageGrade, setAverageGrade] = useState(0);
  const [attendanceRate, setAttendanceRate] = useState(100);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        studentData,
        studentGrades,
        studentAttendance,
        allClasses,
        allAssignments
      ] = await Promise.all([
        studentService.getById(id),
        gradeService.getByStudentId(id),
        attendanceService.getByStudentId(id),
        classService.getAll(),
        assignmentService.getAll()
      ]);

      setStudent(studentData);
      setGrades(studentGrades);
      setAttendance(studentAttendance);
      setClasses(allClasses);
      setAssignments(allAssignments);

      // Calculate averages
      const average = await gradeService.getStudentAverage(id);
      setAverageGrade(average);

      const rate = await attendanceService.getAttendanceRate(id);
      setAttendanceRate(rate);

    } catch (err) {
      setError(err.message || "Failed to load student data");
      toast.error("Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadStudentData();
    }
  }, [id]);

  const getClassName = (classId) => {
const classItem = classes.find(c => c.Id.toString() === classId);
return classItem ? classItem.Name : "Unknown Class";
  };

  const getAssignmentName = (assignmentId) => {
const assignment = assignments.find(a => a.Id.toString() === assignmentId);
return assignment ? assignment.Name : "Unknown Assignment";
  };

  const getGradesByClass = () => {
    const gradesByClass = {};
    grades.forEach(grade => {
if (!gradesByClass[grade.class_id_c?.Id || grade.class_id_c]) {
gradesByClass[grade.class_id_c?.Id || grade.class_id_c] = [];
      }
gradesByClass[grade.class_id_c?.Id || grade.class_id_c].push(grade);
    });
    return gradesByClass;
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadStudentData} />;
  }

  if (!student) {
    return (
      <Error 
        message="Student not found" 
        onRetry={() => navigate("/students")}
        title="Student Not Found"
      />
    );
  }

  const gradesByClass = getGradesByClass();
  const recentGrades = grades
    .sort((a, b) => new Date(b.dateRecorded) - new Date(a.dateRecorded))
    .slice(0, 10);

  return (
    <div className="p-6 space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/students")}
          className="flex items-center"
        >
          <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
          Back to Students
        </Button>
      </div>

      {/* Student Info Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-6">
              <Avatar 
initials={`${student.first_name_c?.[0] || ''}${student.last_name_c?.[0] || ''}`}
                size="xl"
              />
              <div>
                <h1 className="text-3xl font-bold gradient-text">
{student.first_name_c} {student.last_name_c}
                </h1>
                <div className="flex items-center space-x-4 text-gray-600 mt-2">
                  <span className="flex items-center">
                    <ApperIcon name="Mail" className="h-4 w-4 mr-1" />
{student.email_c}
                  </span>
                  <span className="flex items-center">
                    <ApperIcon name="Phone" className="h-4 w-4 mr-1" />
{student.phone_c}
                  </span>
                  <span className="flex items-center">
                    <ApperIcon name="Calendar" className="h-4 w-4 mr-1" />
Grade {student.grade_level_c}
                  </span>
                </div>
                <div className="flex items-center space-x-3 mt-3">
<StatusPill status={student.status_c} />
                  <span className="text-sm text-gray-500">
Enrolled: {format(new Date(student.enrollment_date_c), "MMM dd, yyyy")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <div className="text-2xl font-bold gradient-text">
                  {averageGrade > 0 ? `${Math.round(averageGrade)}%` : "N/A"}
                </div>
                <div className="text-sm text-gray-600">Overall Average</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(attendanceRate)}%
                </div>
                <div className="text-sm text-gray-600">Attendance Rate</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grades by Class */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ApperIcon name="GraduationCap" className="h-5 w-5 mr-2" />
                Grades by Class
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(gradesByClass).length === 0 ? (
                <Empty
                  title="No grades recorded"
                  description="This student doesn't have any grades yet."
                  icon="GraduationCap"
                />
              ) : (
                <div className="space-y-6">
                  {Object.entries(gradesByClass).map(([classId, classGrades]) => {
                    const className = getClassName(classId);
const classAverage = Math.round(
                      classGrades.reduce((sum, grade) => sum + (grade.percentage_c || 0), 0) / classGrades.length
                    );
                    
                    return (
                      <div key={classId} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-lg">{className}</h4>
                          <div className="flex items-center space-x-2">
                            <GradeBadge 
                              grade={gradeService.calculateLetterGrade(classAverage)}
                              percentage={classAverage}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {classGrades
.sort((a, b) => new Date(b.date_recorded_c) - new Date(a.date_recorded_c))
                            .map((grade) => (
                            <div key={grade.Id} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
<span className="text-sm font-medium">{getAssignmentName(grade.assignment_id_c?.Id || grade.assignment_id_c)}</span>
                                <GradeBadge 
                                  grade={grade.letter_grade_c} 
                                  percentage={grade.percentage_c}
                                  size="sm"
                                />
                              </div>
                              <div className="text-xs text-gray-500">
{grade.score_c}/{grade.max_score_c} points
                              </div>
                              <div className="text-xs text-gray-500">
{format(new Date(grade.date_recorded_c), "MMM dd, yyyy")}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Attendance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ApperIcon name="Calendar" className="h-5 w-5 mr-2" />
              Attendance
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <ProgressRing 
              percentage={attendanceRate}
              size={120}
              color="success"
              label="Attendance Rate"
            />
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Present
                </span>
                <span className="font-medium">
{attendance.filter(a => a.status_c === "present").length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  Late
                </span>
                <span className="font-medium">
{attendance.filter(a => a.status_c === "late").length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  Absent
                </span>
                <span className="font-medium">
{attendance.filter(a => a.status_c === "absent").length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  Excused
                </span>
                <span className="font-medium">
{attendance.filter(a => a.status_c === "excused").length}
                </span>
              </div>
            </div>

            {/* Recent Attendance */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h5 className="text-sm font-medium text-gray-900 mb-3">Recent Attendance</h5>
              <div className="space-y-2">
                {attendance
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 5)
                  .map((record) => (
                  <div key={record.Id} className="flex items-center justify-between text-sm">
                    <span>{format(new Date(record.date), "MMM dd")}</span>
                    <StatusPill status={record.status} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {recentGrades.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ApperIcon name="Clock" className="h-5 w-5 mr-2" />
              Recent Grades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentGrades.map((grade) => (
                <div key={grade.Id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
<span className="font-medium">{getAssignmentName(grade.assignment_id_c?.Id || grade.assignment_id_c)}</span>
                    <GradeBadge 
                      grade={grade.letter_grade_c} 
                      percentage={grade.percentage_c}
                      size="sm"
                    />
                  </div>
<div className="text-sm text-gray-600 mb-1">{getClassName(grade.class_id_c?.Id || grade.class_id_c)}</div>
                  <div className="text-sm text-gray-500">
{grade.score_c}/{grade.max_score_c} points • {format(new Date(grade.date_recorded_c), "MMM dd, yyyy")}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentProfile;