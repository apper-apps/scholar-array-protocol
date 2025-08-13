import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import classService from "@/services/api/classService";
import gradeService from "@/services/api/gradeService";
import studentService from "@/services/api/studentService";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [classStats, setClassStats] = useState({});
  const [newClass, setNewClass] = useState({
    name: "",
    subject: "",
    period: "",
    room: "",
    year: "2024",
    semester: "Fall"
  });

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await classService.getAll();
      setClasses(data);
      
      // Load stats for each class
      const stats = {};
      const [allGrades, allStudents] = await Promise.all([
        gradeService.getAll(),
        studentService.getAll()
      ]);
      
      for (const classItem of data) {
const classGrades = allGrades.filter(g => (g.class_id_c?.Id || g.class_id_c) === classItem.Id.toString());
const uniqueStudentIds = [...new Set(classGrades.map(g => g.student_id_c?.Id || g.student_id_c))];
const average = classGrades.length > 0
          ? Math.round(classGrades.reduce((sum, grade) => sum + (grade.percentage_c || 0), 0) / classGrades.length)
          : 0;
          
        stats[classItem.Id] = {
          studentCount: uniqueStudentIds.length,
          averageGrade: average,
          totalAssignments: classGrades.length
        };
      }
      setClassStats(stats);
    } catch (err) {
      setError(err.message || "Failed to load classes");
      toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      const createdClass = await classService.create(newClass);
      setClasses(prev => [...prev, createdClass]);
      setNewClass({
        name: "",
        subject: "",
        period: "",
        room: "",
        year: "2024",
        semester: "Fall"
      });
      setShowAddModal(false);
      toast.success("Class added successfully!");
      loadClasses(); // Reload to get updated stats
    } catch (err) {
      toast.error("Failed to add class");
    }
  };

  const handleDeleteClass = async (id) => {
    if (!confirm("Are you sure you want to delete this class?")) return;
    
    try {
      await classService.delete(id);
      setClasses(prev => prev.filter(c => c.Id !== id));
      toast.success("Class deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete class");
    }
  };

  const getSubjectIcon = (subject) => {
    const iconMap = {
      "Mathematics": "Calculator",
      "Science": "Microscope", 
      "English": "BookOpen",
      "History": "Clock",
      "Art": "Palette",
      "Physical Education": "Activity",
      "Music": "Music"
    };
    return iconMap[subject] || "Book";
  };

  const getSubjectColor = (subject) => {
    const colorMap = {
      "Mathematics": "primary",
      "Science": "success",
      "English": "accent",
      "History": "warning",
      "Art": "secondary",
      "Physical Education": "danger",
      "Music": "primary"
    };
    return colorMap[subject] || "primary";
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadClasses} />;
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Classes</h1>
          <p className="text-gray-600 mt-1">Manage your courses and track class performance</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="flex items-center">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Class
        </Button>
      </div>

      {/* Classes Grid */}
      {classes.length === 0 ? (
        <Empty
          title="No classes yet"
          description="Add your first class to start managing courses and student performance."
          icon="BookOpen"
          action={() => setShowAddModal(true)}
          actionLabel="Add Class"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => {
            const stats = classStats[classItem.Id] || { studentCount: 0, averageGrade: 0, totalAssignments: 0 };
const subjectColor = getSubjectColor(classItem.subject_c);
            
            return (
              <Card key={classItem.Id} className="hover-lift cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        subjectColor === 'primary' ? 'bg-primary-100 text-primary-600' :
                        subjectColor === 'secondary' ? 'bg-secondary-100 text-secondary-600' :
                        subjectColor === 'accent' ? 'bg-accent-100 text-accent-600' :
                        subjectColor === 'success' ? 'bg-green-100 text-green-600' :
                        subjectColor === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                        subjectColor === 'danger' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
<ApperIcon name={getSubjectIcon(classItem.subject_c)} className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary-600 transition-colors">
                          {classItem.Name}
                        </CardTitle>
                        <p className="text-sm text-gray-600">{classItem.subject_c}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClass(classItem.Id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded opacity-0 group-hover:opacity-100"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Class Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="Clock" className="h-4 w-4 mr-2" />
                      {classItem.period}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="MapPin" className="h-4 w-4 mr-2" />
                      {classItem.room}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
                      {classItem.semester} {classItem.year}
                    </div>
                  </div>

                  {/* Class Stats */}
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-lg font-bold gradient-text">{stats.studentCount}</div>
                      <div className="text-xs text-gray-500">Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold gradient-text">
                        {stats.averageGrade > 0 ? `${stats.averageGrade}%` : "--"}
                      </div>
                      <div className="text-xs text-gray-500">Avg Grade</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold gradient-text">{stats.totalAssignments}</div>
                      <div className="text-xs text-gray-500">Grades</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Add New Class
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddClass} className="space-y-4">
                <Input
                  label="Class Name"
                  value={newClass.name}
                  onChange={(e) => setNewClass(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Algebra II, Biology I"
                  required
                />
                
                <Select
                  label="Subject"
                  value={newClass.subject}
                  onChange={(e) => setNewClass(prev => ({ ...prev, subject: e.target.value }))}
                  required
                >
                  <option value="">Select Subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Art">Art</option>
                  <option value="Physical Education">Physical Education</option>
                  <option value="Music">Music</option>
                </Select>
                
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Period"
                    value={newClass.period}
                    onChange={(e) => setNewClass(prev => ({ ...prev, period: e.target.value }))}
                    required
                  >
                    <option value="">Select Period</option>
                    <option value="1st Period">1st Period</option>
                    <option value="2nd Period">2nd Period</option>
                    <option value="3rd Period">3rd Period</option>
                    <option value="4th Period">4th Period</option>
                    <option value="5th Period">5th Period</option>
                    <option value="6th Period">6th Period</option>
                    <option value="7th Period">7th Period</option>
                    <option value="8th Period">8th Period</option>
                  </Select>
                  
                  <Input
                    label="Room"
                    value={newClass.room}
                    onChange={(e) => setNewClass(prev => ({ ...prev, room: e.target.value }))}
                    placeholder="e.g., Room 205"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Year"
                    value={newClass.year}
                    onChange={(e) => setNewClass(prev => ({ ...prev, year: e.target.value }))}
                    required
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </Select>
                  
                  <Select
                    label="Semester"
                    value={newClass.semester}
                    onChange={(e) => setNewClass(prev => ({ ...prev, semester: e.target.value }))}
                    required
                  >
                    <option value="Fall">Fall</option>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                  </Select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Add Class
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

export default Classes;