import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthContext";

const AttendanceContext = createContext();

export function useAttendance() {
  return useContext(AttendanceContext);
}

export function AttendanceProvider({ children }) {
  const { currentUser } = useAuth();
  const [quarters, setQuarters] = useState([]);

  useEffect(() => {
    loadQuarters();
  }, []);

  const loadQuarters = () => {
    const savedQuarters = JSON.parse(localStorage.getItem("quarters") || "[]");
    setQuarters(savedQuarters);
  };

  // Obtener estudiantes por carrera y año
  const getStudentsByCareerAndYear = (career, year) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    return users
      .filter(
        (u) =>
          u.role === "estudiante" &&
          u.career === career &&
          u.academicYear === year
      )
      .map((u) => ({
        userId: u.id,
        name: u.name,
        email: u.email,
        attendances: {},
      }));
  };

  // Crear un nuevo cuatrimestre
  const createQuarter = (quarterData) => {
    const newQuarter = {
      id: Date.now().toString(),
      ...quarterData,
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.id,
      students: getStudentsByCareerAndYear(
        quarterData.career,
        quarterData.year
      ),
    };

    const updatedQuarters = [...quarters, newQuarter];
    setQuarters(updatedQuarters);
    localStorage.setItem("quarters", JSON.stringify(updatedQuarters));

    toast({
      title: "¡Cuatrimestre creado!",
      description: `${quarterData.name} creado exitosamente`,
    });

    return newQuarter;
  };

  // Actualizar cuatrimestre
  const updateQuarter = (quarterId, updates) => {
    const updatedQuarters = quarters.map((q) =>
      q.id === quarterId ? { ...q, ...updates } : q
    );
    setQuarters(updatedQuarters);
    localStorage.setItem("quarters", JSON.stringify(updatedQuarters));

    toast({
      title: "Cuatrimestre actualizado",
      description: "Los cambios se guardaron correctamente",
    });
  };

  // Eliminar cuatrimestre
  const deleteQuarter = (quarterId) => {
    const updatedQuarters = quarters.filter((q) => q.id !== quarterId);
    setQuarters(updatedQuarters);
    localStorage.setItem("quarters", JSON.stringify(updatedQuarters));

    toast({
      title: "Cuatrimestre eliminado",
      description: "El cuatrimestre fue eliminado correctamente",
    });
  };

  // Actualizar asistencia de un estudiante en una materia
  const updateStudentAttendance = (
    quarterId,
    studentId,
    subjectId,
    attended
  ) => {
    const updatedQuarters = quarters.map((quarter) => {
      if (quarter.id === quarterId) {
        const updatedStudents = quarter.students.map((student) => {
          if (student.userId === studentId) {
            const subject = quarter.subjects.find((s) => s.id === subjectId);
            return {
              ...student,
              attendances: {
                ...student.attendances,
                [subjectId]: {
                  attended: attended,
                  total: subject?.totalClasses || 0,
                },
              },
            };
          }
          return student;
        });
        return { ...quarter, students: updatedStudents };
      }
      return quarter;
    });

    setQuarters(updatedQuarters);
    localStorage.setItem("quarters", JSON.stringify(updatedQuarters));
  };

  // Obtener cuatrimestres del estudiante actual
  const getStudentQuarters = () => {
    if (!currentUser || currentUser.role !== "estudiante") return [];

    return quarters.filter(
      (quarter) =>
        quarter.career === currentUser.career &&
        quarter.year === currentUser.academicYear
    );
  };

  // Obtener asistencias del estudiante en un cuatrimestre
  const getStudentAttendanceInQuarter = (quarterId) => {
    const quarter = quarters.find((q) => q.id === quarterId);
    if (!quarter) return null;

    const studentData = quarter.students.find(
      (s) => s.userId === currentUser?.id
    );
    if (!studentData) return null;

    return {
      quarter: quarter,
      subjects: quarter.subjects.map((subject) => {
        const attendance = studentData.attendances[subject.id] || {
          attended: 0,
          total: subject.totalClasses,
        };
        return {
          id: subject.id,
          name: subject.name,
          totalClasses: subject.totalClasses,
          attended: attendance.attended,
          percentage:
            subject.totalClasses > 0
              ? Math.round((attendance.attended / subject.totalClasses) * 100)
              : 0,
        };
      }),
    };
  };

  const value = {
    quarters,
    createQuarter,
    updateQuarter,
    deleteQuarter,
    updateStudentAttendance,
    getStudentQuarters,
    getStudentAttendanceInQuarter,
    loadQuarters,
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
}
