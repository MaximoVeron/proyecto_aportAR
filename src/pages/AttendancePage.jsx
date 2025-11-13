import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Calendar,
  Plus,
  Trash2,
  Edit,
  BookOpen,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const AttendancePage = () => {
  const { currentUser } = useAuth();
  const {
    quarters,
    createQuarter,
    deleteQuarter,
    updateStudentAttendance,
    getStudentQuarters,
    getStudentAttendanceInQuarter,
  } = useAttendance();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [isManageAttendanceOpen, setIsManageAttendanceOpen] = useState(false);

  const [newQuarter, setNewQuarter] = useState({
    name: "",
    career: "",
    year: "",
    subjects: [],
  });

  const [newSubject, setNewSubject] = useState({
    name: "",
    totalClasses: "",
  });

  const careers = [
    { value: "Software", label: "Desarrollo de Software" },
    { value: "Telecomunicaciones", label: "Telecomunicaciones" },
    { value: "Química Industrial", label: "Química Industrial" },
    { value: "Mecatrónica", label: "Mecatrónica" },
  ];

  const getYearsForCareer = (career) => {
    if (career === "Software") {
      return [
        { value: "1", label: "Primer año" },
        { value: "2", label: "Segundo año" },
      ];
    }
    return [
      { value: "1", label: "Primer año" },
      { value: "2", label: "Segundo año" },
      { value: "3", label: "Tercer año" },
    ];
  };

  const handleAddSubject = () => {
    if (!newSubject.name || !newSubject.totalClasses) {
      toast({
        title: "Error",
        description: "Completa todos los campos de la materia",
        variant: "destructive",
      });
      return;
    }

    const subject = {
      id: Date.now().toString(),
      name: newSubject.name,
      totalClasses: parseInt(newSubject.totalClasses),
    };

    setNewQuarter({
      ...newQuarter,
      subjects: [...newQuarter.subjects, subject],
    });

    setNewSubject({ name: "", totalClasses: "" });
  };

  const handleRemoveSubject = (subjectId) => {
    setNewQuarter({
      ...newQuarter,
      subjects: newQuarter.subjects.filter((s) => s.id !== subjectId),
    });
  };

  const handleCreateQuarter = () => {
    if (
      !newQuarter.name ||
      !newQuarter.career ||
      !newQuarter.year ||
      newQuarter.subjects.length === 0
    ) {
      toast({
        title: "Error",
        description: "Completa todos los campos y agrega al menos una materia",
        variant: "destructive",
      });
      return;
    }

    createQuarter(newQuarter);
    setNewQuarter({ name: "", career: "", year: "", subjects: [] });
    setIsCreateDialogOpen(false);
  };

  const handleDeleteQuarter = (quarterId) => {
    if (window.confirm("¿Estás seguro de eliminar este cuatrimestre?")) {
      deleteQuarter(quarterId);
    }
  };

  const handleUpdateAttendance = (
    quarterId,
    studentId,
    subjectId,
    currentAttended,
    totalClasses
  ) => {
    const newAttended = prompt(
      `Asistencias actuales: ${currentAttended}/${totalClasses}\nIngresa la nueva cantidad de asistencias:`,
      currentAttended
    );

    if (newAttended !== null) {
      const attended = parseInt(newAttended);
      if (isNaN(attended) || attended < 0 || attended > totalClasses) {
        toast({
          title: "Error",
          description: `Ingresa un número válido entre 0 y ${totalClasses}`,
          variant: "destructive",
        });
        return;
      }
      updateStudentAttendance(quarterId, studentId, subjectId, attended);
      toast({
        title: "Asistencia actualizada",
        description: "La asistencia se actualizó correctamente",
      });
    }
  };

  // Vista de administrador
  if (currentUser?.role === "admin") {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Gestión de Asistencias
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Administra cuatrimestres, materias y asistencias de los
              estudiantes
            </p>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Crear Cuatrimestre
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Cuatrimestre</DialogTitle>
                <DialogDescription>
                  Define el cuatrimestre, materias y cantidad de clases
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="quarterName">Nombre del cuatrimestre</Label>
                  <Input
                    id="quarterName"
                    placeholder="Ej: Primer Cuatrimestre 2025"
                    value={newQuarter.name}
                    onChange={(e) =>
                      setNewQuarter({ ...newQuarter, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="career">Carrera</Label>
                  <Select
                    value={newQuarter.career}
                    onValueChange={(v) =>
                      setNewQuarter({ ...newQuarter, career: v, year: "" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una carrera" />
                    </SelectTrigger>
                    <SelectContent>
                      {careers.map((career) => (
                        <SelectItem key={career.value} value={career.value}>
                          {career.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {newQuarter.career && (
                  <div>
                    <Label htmlFor="year">Año académico</Label>
                    <Select
                      value={newQuarter.year}
                      onValueChange={(v) =>
                        setNewQuarter({ ...newQuarter, year: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el año" />
                      </SelectTrigger>
                      <SelectContent>
                        {getYearsForCareer(newQuarter.career).map((year) => (
                          <SelectItem key={year.value} value={year.value}>
                            {year.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">
                    Materias del cuatrimestre
                  </h3>

                  <div className="space-y-2 mb-3">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          placeholder="Nombre de la materia"
                          value={newSubject.name}
                          onChange={(e) =>
                            setNewSubject({
                              ...newSubject,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="w-32">
                        <Input
                          type="number"
                          placeholder="Clases"
                          min="1"
                          value={newSubject.totalClasses}
                          onChange={(e) =>
                            setNewSubject({
                              ...newSubject,
                              totalClasses: e.target.value,
                            })
                          }
                        />
                      </div>
                      <Button
                        onClick={handleAddSubject}
                        variant="outline"
                        size="icon"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {newQuarter.subjects.length > 0 && (
                    <div className="space-y-2">
                      {newQuarter.subjects.map((subject) => (
                        <div
                          key={subject.id}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{subject.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {subject.totalClasses} clases
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSubject(subject.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button onClick={handleCreateQuarter} className="w-full">
                  Crear Cuatrimestre
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {quarters.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Calendar className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-center">
                No hay cuatrimestres creados.
                <br />
                Crea uno para comenzar a gestionar asistencias.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {quarters.map((quarter) => (
              <Card key={quarter.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{quarter.name}</CardTitle>
                      <CardDescription className="text-base mt-2">
                        {careers.find((c) => c.value === quarter.career)?.label}{" "}
                        - Año {quarter.year}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedQuarter(quarter);
                          setIsManageAttendanceOpen(true);
                        }}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Gestionar Asistencias
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteQuarter(quarter.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Materias ({quarter.subjects.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {quarter.subjects.map((subject) => (
                        <div
                          key={subject.id}
                          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <p className="font-medium text-sm">{subject.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {subject.totalClasses} clases
                          </p>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                      <Users className="w-4 h-4 inline mr-1" />
                      {quarter.students.length} estudiantes inscriptos
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog para gestionar asistencias */}
        <Dialog
          open={isManageAttendanceOpen}
          onOpenChange={setIsManageAttendanceOpen}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Gestionar Asistencias - {selectedQuarter?.name}
              </DialogTitle>
              <DialogDescription>
                {
                  careers.find((c) => c.value === selectedQuarter?.career)
                    ?.label
                }{" "}
                - Año {selectedQuarter?.year}
              </DialogDescription>
            </DialogHeader>

            {selectedQuarter && (
              <div className="space-y-4 py-4">
                {selectedQuarter.students.length === 0 ? (
                  <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                    No hay estudiantes inscriptos en este cuatrimestre
                  </p>
                ) : (
                  <div className="space-y-6">
                    {selectedQuarter.students.map((student) => (
                      <Card key={student.userId}>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {student.name}
                          </CardTitle>
                          <CardDescription>{student.email}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {selectedQuarter.subjects.map((subject) => {
                              const attendance = student.attendances[
                                subject.id
                              ] || { attended: 0, total: subject.totalClasses };
                              const percentage =
                                subject.totalClasses > 0
                                  ? Math.round(
                                      (attendance.attended /
                                        subject.totalClasses) *
                                        100
                                    )
                                  : 0;

                              return (
                                <div
                                  key={subject.id}
                                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                >
                                  <div className="flex-1">
                                    <p className="font-medium">
                                      {subject.name}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {attendance.attended}/
                                      {subject.totalClasses} clases -{" "}
                                      {percentage}%
                                    </p>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleUpdateAttendance(
                                        selectedQuarter.id,
                                        student.userId,
                                        subject.id,
                                        attendance.attended,
                                        subject.totalClasses
                                      )
                                    }
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Actualizar
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Vista de estudiante
  const studentQuarters = getStudentQuarters();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">
          Mis Asistencias
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Consulta tus asistencias y porcentajes por materia
        </p>
      </div>

      {studentQuarters.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Calendar className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-center">
              No tienes cuatrimestres asignados aún.
              <br />
              Espera a que un administrador configure tu cuatrimestre.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {studentQuarters.map((quarter) => {
            const attendanceData = getStudentAttendanceInQuarter(quarter.id);

            return (
              <Card key={quarter.id}>
                <CardHeader>
                  <CardTitle className="text-2xl">{quarter.name}</CardTitle>
                  <CardDescription className="text-base">
                    {careers.find((c) => c.value === quarter.career)?.label} -
                    Año {quarter.year}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {attendanceData?.subjects.map((subject) => {
                      const isLowAttendance = subject.percentage < 75;

                      return (
                        <motion.div
                          key={subject.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg border"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">
                              {subject.name}
                            </h3>
                            <div
                              className={`flex items-center gap-2 ${
                                isLowAttendance
                                  ? "text-red-500"
                                  : "text-green-500"
                              }`}
                            >
                              {isLowAttendance ? (
                                <XCircle className="w-5 h-5" />
                              ) : (
                                <CheckCircle className="w-5 h-5" />
                              )}
                              <span className="font-bold text-xl">
                                {subject.percentage}%
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>
                              Asistencias: {subject.attended}/
                              {subject.totalClasses}
                            </span>
                            {isLowAttendance && (
                              <span className="text-red-500 font-medium">
                                Asistencia baja
                              </span>
                            )}
                          </div>

                          {/* Barra de progreso */}
                          <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${subject.percentage}%` }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                              className={`h-full ${
                                isLowAttendance ? "bg-red-500" : "bg-green-500"
                              }`}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
