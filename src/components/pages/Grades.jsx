import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import GradeBadge from "@/components/molecules/GradeBadge";
import SearchBar from "@/components/molecules/SearchBar";
import Avatar from "@/components/atoms/Avatar";
import ApperIcon from "@/components/ApperIcon";
import gradeService from "@/services/api/gradeService";
import studentService from "@/services/api/studentService";
import classService from "@/services/api/classService";
import assignmentService from "@/services/api/assignmentService";

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGrade, setNewGrade] = useState({
    studentId: "",
    classId: "",
    assignmentId: "",
    score: "",
    maxScore: 100
  });

  const loadGradesData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [gradesData, studentsData, classesData, assignmentsData] = await Promise.all([
        gradeService.getAll(),
        studentService.getAll(),
        classService.getAll(),
        assignmentService.getAll()
      ]);
      
      setGrades(gradesData);
      setStudents(studentsData);
      setClasses(classesData);
      setAssignments(assignmentsData);
      setFilteredGrades(gradesData);
    } catch (err) {
      setError(err.message || "Failed to load grades data");
      toast.error("Failed to load grades data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGradesData();
  }, []);

  useEffect(() => {
    filterGrades();
  }, [grades, searchQuery, classFilter]);

  const filterGrades = () => {
    let filtered = [...grades];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(grade => {
        const student = getStudentById(grade.studentId);
        const assignment = getAssignmentById(grade.assignmentId);
        return (
          student && (
            student.firstName.toLowerCase().includes(query) ||
            student.lastName.toLowerCase().includes(query)
          )
        ) || (assignment && assignment.name.toLowerCase().includes(query));
      });
    }

    // Class filter
    if (classFilter !== "all") {
      filtered = filtered.filter(grade => grade.classId === classFilter);
    }

    setFilteredGrades(filtered.sort((a, b) => new Date(b.dateRecorded) - new Date(a.dateRecorded)));
  };

  const getStudentById = (id) => {
    return students.find(s => s.Id.toString() === id.toString());
  };

  const getClassById = (id) => {
    return classes.find(c => c.Id.toString() === id.toString());
  };

  const getAssignmentById = (id) => {
    return assignments.find(a => a.Id.toString() === id.toString());
  };

  const getAssignmentsByClass = (classId) => {
    return assignments.filter(a => a.classId.toString() === classId.toString());
  };

  const getStudentsByClass = (classId) => {
    // Get students who have grades in this class
    const studentIdsInClass = grades
      .filter(g => g.classId.toString() === classId.toString())
      .map(g => g.studentId);
    
    const uniqueIds = [...new Set(studentIdsInClass)];
    return students.filter(s => uniqueIds.includes(s.Id.toString()));
  };

  const handleAddGrade = async (e) => {
    e.preventDefault();
    try {
      const gradeData = {
        ...newGrade,
        score: parseFloat(newGrade.score),
        maxScore: parseFloat(newGrade.maxScore)
      };
      
      const createdGrade = await gradeService.create(gradeData);
      setGrades(prev => [...prev, createdGrade]);
      setNewGrade({
        studentId: "",
        classId: "",
        assignmentId: "",
        score: "",
        maxScore: 100
      });
      setShowAddModal(false);
      toast.success("Grade added successfully!");
    } catch (err) {
      toast.error("Failed to add grade");
    }
  };

  const handleDeleteGrade = async (id) => {
    if (!confirm("Are you sure you want to delete this grade?")) return;
    
    try {
      await gradeService.delete(id);
      setGrades(prev => prev.filter(g => g.Id !== id));
      toast.success("Grade deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete grade");
    }
  };

  const exportGrades = () => {
    const csvData = [
      ["Student", "Class", "Assignment", "Score", "Max Score", "Percentage", "Letter Grade", "Date"],
      ...filteredGrades.map(grade => {
        const student = getStudentById(grade.studentId);
        const classItem = getClassById(grade.classId);
        const assignment = getAssignmentById(grade.assignmentId);
        
        return [
          student ? `${student.firstName} ${student.lastName}` : "Unknown",
          classItem ? classItem.name : "Unknown",
          assignment ? assignment.name : "Unknown",
          grade.score,
          grade.maxScore,
          grade.percentage,
          grade.letterGrade,
          grade.dateRecorded
        ];
      })
    ];
    
    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "grades.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success("Grades exported successfully!");
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadGradesData} />;
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Grades</h1>
          <p className="text-gray-600 mt-1">Record and manage student grades and assignments</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={exportGrades} className="flex items-center">
            <ApperIcon name="Download" className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)} className="flex items-center">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Grade
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex-1 min-w-0">
              <SearchBar
                placeholder="Search by student name or assignment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full lg:w-48"
            >
              <option value="all">All Classes</option>
              {classes.map(classItem => (
                <option key={classItem.Id} value={classItem.Id.toString()}>
                  {classItem.name}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grades List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Grade Records</span>
            <span className="text-sm font-normal text-gray-500">
              {filteredGrades.length} of {grades.length} grades
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredGrades.length === 0 ? (
            <Empty
              title={searchQuery || classFilter !== "all" ? "No grades match your filters" : "No grades recorded yet"}
              description={searchQuery || classFilter !== "all" ? "Try adjusting your search or filters" : "Start recording grades to track student performance"}
              icon="GraduationCap"
              action={searchQuery || classFilter !== "all" ? undefined : () => setShowAddModal(true)}
              actionLabel="Add Grade"
            />
          ) : (
            <div className="space-y-2">
              {filteredGrades.map((grade) => {
                const student = getStudentById(grade.studentId);
                const classItem = getClassById(grade.classId);
                const assignment = getAssignmentById(grade.assignmentId);
                
                return (
                  <div
                    key={grade.Id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar
                        initials={student ? `${student.firstName[0]}${student.lastName[0]}` : "?"}
                        size="default"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {student ? `${student.firstName} ${student.lastName}` : "Unknown Student"}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{classItem ? classItem.name : "Unknown Class"}</span>
                          <span>•</span>
                          <span>{assignment ? assignment.name : "Unknown Assignment"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold gradient-text">
                          {grade.score}/{grade.maxScore}
                        </div>
                        <div className="text-sm text-gray-500">
                          {grade.dateRecorded}
                        </div>
                      </div>
                      <GradeBadge grade={grade.letterGrade} percentage={grade.percentage} />
                      <button
                        onClick={() => handleDeleteGrade(grade.Id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Grade Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Add New Grade
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddGrade} className="space-y-4">
                <Select
                  label="Class"
                  value={newGrade.classId}
                  onChange={(e) => setNewGrade(prev => ({ ...prev, classId: e.target.value, studentId: "", assignmentId: "" }))}
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map(classItem => (
                    <option key={classItem.Id} value={classItem.Id.toString()}>
                      {classItem.name}
                    </option>
                  ))}
                </Select>
                
                {newGrade.classId && (
                  <Select
                    label="Assignment"
                    value={newGrade.assignmentId}
                    onChange={(e) => {
                      const assignment = getAssignmentById(e.target.value);
                      setNewGrade(prev => ({ 
                        ...prev, 
                        assignmentId: e.target.value,
                        maxScore: assignment ? assignment.totalPoints : 100
                      }));
                    }}
                    required
                  >
                    <option value="">Select Assignment</option>
                    {getAssignmentsByClass(newGrade.classId).map(assignment => (
                      <option key={assignment.Id} value={assignment.Id.toString()}>
                        {assignment.name} ({assignment.totalPoints} pts)
                      </option>
                    ))}
                  </Select>
                )}
                
                {newGrade.classId && (
                  <Select
                    label="Student"
                    value={newGrade.studentId}
                    onChange={(e) => setNewGrade(prev => ({ ...prev, studentId: e.target.value }))}
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map(student => (
                      <option key={student.Id} value={student.Id.toString()}>
                        {student.firstName} {student.lastName}
                      </option>
                    ))}
                  </Select>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Score"
                    type="number"
                    min="0"
                    step="0.5"
                    value={newGrade.score}
                    onChange={(e) => setNewGrade(prev => ({ ...prev, score: e.target.value }))}
                    required
                  />
                  <Input
                    label="Max Score"
                    type="number"
                    min="1"
                    value={newGrade.maxScore}
                    onChange={(e) => setNewGrade(prev => ({ ...prev, maxScore: e.target.value }))}
                    required
                  />
                </div>
                
                {newGrade.score && newGrade.maxScore && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Preview</div>
                    <GradeBadge 
                      grade={gradeService.calculateLetterGrade(Math.round((parseFloat(newGrade.score) / parseFloat(newGrade.maxScore)) * 100))}
                      percentage={Math.round((parseFloat(newGrade.score) / parseFloat(newGrade.maxScore)) * 100)}
                    />
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Add Grade
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Grades;