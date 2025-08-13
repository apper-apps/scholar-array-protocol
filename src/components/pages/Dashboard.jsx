import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import StatCard from "@/components/molecules/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ProgressRing from "@/components/molecules/ProgressRing";
import GradeBadge from "@/components/molecules/GradeBadge";
import StatusPill from "@/components/molecules/StatusPill";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import studentService from "@/services/api/studentService";
import classService from "@/services/api/classService";
import gradeService from "@/services/api/gradeService";
import attendanceService from "@/services/api/attendanceService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    students: [],
    classes: [],
    grades: [],
    attendance: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [students, classes, grades, attendance] = await Promise.all([
        studentService.getAll(),
        classService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll()
      ]);
      
      setData({ students, classes, grades, attendance });
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const calculateStats = () => {
    const totalStudents = data.students.length;
const activeStudents = data.students.filter(s => s.status_c === "active").length;
    const totalClasses = data.classes.length;
    
    // Calculate average grade
const averageGrade = data.grades.length > 0 
      ? Math.round(data.grades.reduce((sum, grade) => sum + (grade.percentage_c || 0), 0) / data.grades.length)
      : 0;
    
    // Calculate attendance rate
const presentRecords = data.attendance.filter(a => a.status_c === "present" || a.status_c === "late").length;
    const attendanceRate = data.attendance.length > 0 
      ? Math.round((presentRecords / data.attendance.length) * 100)
      : 100;

    return {
      totalStudents,
      activeStudents,
      totalClasses,
      averageGrade,
      attendanceRate
    };
  };

  const getRecentActivity = () => {
    // Get recent grades (last 5)
const recentGrades = data.grades
      .sort((a, b) => new Date(b.date_recorded_c) - new Date(a.date_recorded_c))
      .slice(0, 5)
      .map(grade => {
const student = data.students.find(s => s.Id.toString() === grade.student_id_c?.Id || grade.student_id_c);
        const classItem = data.classes.find(c => c.Id.toString() === grade.class_id_c?.Id || grade.class_id_c);
        return {
          ...grade,
          studentName: student ? `${student.first_name_c} ${student.last_name_c}` : "Unknown Student",
          className: classItem ? classItem.Name : "Unknown Class"
        };
      });

    return recentGrades;
  };

  const getTopPerformers = () => {
    // Calculate student averages and get top 5
    const studentAverages = data.students
      .map(student => {
const studentGrades = data.grades.filter(g => {
          const gradeStudentId = g.student_id_c?.Id || g.student_id_c;
          return gradeStudentId === student.Id.toString() || gradeStudentId === student.Id;
        });
        const average = studentGrades.length > 0
          ? studentGrades.reduce((sum, grade) => sum + (grade.percentage_c || 0), 0) / studentGrades.length
          : 0;
        return {
          ...student,
          average: Math.round(average)
        };
      })
      .filter(student => student.average > 0)
      .sort((a, b) => b.average - a.average)
      .slice(0, 5);

    return studentAverages;
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  const stats = calculateStats();
  const recentActivity = getRecentActivity();
  const topPerformers = getTopPerformers();

  return (
    <div className="p-6 space-y-6 animate-fade-in-up">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back, Ms. Johnson!</h1>
        <p className="text-gray-600">Here's what's happening in your classes today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon="Users"
          color="primary"
          trend="up"
          trendValue="+3 this week"
        />
        <StatCard
          title="Active Students"
          value={stats.activeStudents}
          icon="UserCheck"
          color="success"
        />
        <StatCard
          title="Classes"
          value={stats.totalClasses}
          icon="BookOpen"
          color="secondary"
        />
        <StatCard
          title="Avg. Grade"
          value={`${stats.averageGrade}%`}
          icon="TrendingUp"
          color="accent"
          trend={stats.averageGrade >= 80 ? "up" : "down"}
          trendValue={`${stats.averageGrade >= 80 ? "+" : ""}${stats.averageGrade - 75}% from target`}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ApperIcon name="Clock" className="h-5 w-5 mr-2" />
              Recent Grades
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <Empty 
                title="No recent grades"
                description="Start grading assignments to see recent activity here."
                icon="GraduationCap"
                action={() => navigate("/grades")}
                actionLabel="Grade Assignments"
              />
            ) : (
              <div className="space-y-4">
                {recentActivity.map((grade) => (
                  <div key={grade.Id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <Avatar 
                        initials={grade.studentName.split(" ").map(n => n[0]).join("")}
                        size="default"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{grade.studentName}</p>
                        <p className="text-sm text-gray-500">{grade.className}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
<GradeBadge grade={grade.letter_grade_c} percentage={grade.percentage_c} />
                      <span className="text-sm text-gray-500">{grade.date_recorded_c}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ApperIcon name="Calendar" className="h-5 w-5 mr-2" />
              Attendance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <ProgressRing 
              percentage={stats.attendanceRate}
              size={120}
              color="success"
              label="Overall Rate"
            />
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Present
                </span>
<span className="font-medium">{data.attendance.filter(a => a.status_c === "present").length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  Late
                </span>
<span className="font-medium">{data.attendance.filter(a => a.status_c === "late").length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  Absent
                </span>
<span className="font-medium">{data.attendance.filter(a => a.status_c === "absent").length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ApperIcon name="Award" className="h-5 w-5 mr-2" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topPerformers.length === 0 ? (
              <Empty 
                title="No performance data"
                description="Grades will appear here once you start recording them."
                icon="TrendingUp"
              />
            ) : (
              <div className="space-y-4">
                {topPerformers.map((student, index) => (
                  <div 
                    key={student.Id} 
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-primary-50 cursor-pointer transition-colors hover-lift"
                    onClick={() => navigate(`/students/${student.Id}`)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                        {index + 1}
                      </div>
<Avatar 
                        initials={`${student.first_name_c?.[0] || ''}${student.last_name_c?.[0] || ''}`}
                        size="sm"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{student.first_name_c} {student.last_name_c}</p>
                        <p className="text-sm text-gray-500">Grade {student.grade_level_c}</p>
                      </div>
                    </div>
                    <GradeBadge 
                      grade={gradeService.calculateLetterGrade(student.average)} 
                      percentage={student.average}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ApperIcon name="Zap" className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/students")}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group text-center"
              >
                <ApperIcon name="UserPlus" className="h-8 w-8 mx-auto mb-2 text-gray-400 group-hover:text-primary-500" />
                <p className="text-sm font-medium text-gray-600 group-hover:text-primary-600">Add Student</p>
              </button>
              
              <button
                onClick={() => navigate("/grades")}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-secondary-500 hover:bg-secondary-50 transition-all duration-200 group text-center"
              >
                <ApperIcon name="PlusCircle" className="h-8 w-8 mx-auto mb-2 text-gray-400 group-hover:text-secondary-500" />
                <p className="text-sm font-medium text-gray-600 group-hover:text-secondary-600">Add Grade</p>
              </button>
              
              <button
                onClick={() => navigate("/attendance")}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-accent-500 hover:bg-accent-50 transition-all duration-200 group text-center"
              >
                <ApperIcon name="Calendar" className="h-8 w-8 mx-auto mb-2 text-gray-400 group-hover:text-accent-500" />
                <p className="text-sm font-medium text-gray-600 group-hover:text-accent-600">Take Attendance</p>
              </button>
              
              <button
                onClick={() => navigate("/classes")}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 group text-center"
              >
                <ApperIcon name="BookOpen" className="h-8 w-8 mx-auto mb-2 text-gray-400 group-hover:text-green-500" />
                <p className="text-sm font-medium text-gray-600 group-hover:text-green-600">Manage Classes</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;