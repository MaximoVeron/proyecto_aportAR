import Quarter from "../models/Quarter.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/errorHandler.js";
import { ErrorResponse } from "../utils/errorHandler.js";

// @desc    Crear nuevo cuatrimestre
// @route   POST /api/quarters
// @access  Private/Admin
export const createQuarter = asyncHandler(async (req, res, next) => {
  const { name, career, year, subjects } = req.body;

  // Crear cuatrimestre
  const quarter = await Quarter.create({
    name,
    career,
    year,
    subjects,
    createdBy: req.user.id,
  });

  // Inicializar asistencias para todos los estudiantes de esa carrera/año
  const students = await User.find({
    role: "estudiante",
    career,
    academicYear: year,
    isActive: true,
  });

  // Crear registros de asistencia para cada estudiante y materia
  const attendances = [];
  students.forEach((student) => {
    subjects.forEach((subject) => {
      attendances.push({
        userId: student._id,
        subjectId: subject._id,
        attended: 0,
      });
    });
  });

  quarter.attendances = attendances;
  await quarter.save();

  res.status(201).json({
    success: true,
    data: quarter,
  });
});

// @desc    Obtener todos los cuatrimestres
// @route   GET /api/quarters
// @access  Private/Admin
export const getQuarters = asyncHandler(async (req, res, next) => {
  const quarters = await Quarter.find({ isActive: true })
    .populate("createdBy", "name email")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: quarters.length,
    data: quarters,
  });
});

// @desc    Obtener cuatrimestre por ID
// @route   GET /api/quarters/:id
// @access  Private
export const getQuarter = asyncHandler(async (req, res, next) => {
  const quarter = await Quarter.findById(req.params.id)
    .populate("createdBy", "name email")
    .populate("attendances.userId", "name email");

  if (!quarter) {
    return next(new ErrorResponse("Cuatrimestre no encontrado", 404));
  }

  res.status(200).json({
    success: true,
    data: quarter,
  });
});

// @desc    Obtener cuatrimestres del estudiante actual
// @route   GET /api/quarters/my-quarters
// @access  Private/Student
export const getMyQuarters = asyncHandler(async (req, res, next) => {
  const quarters = await Quarter.find({
    career: req.user.career,
    year: req.user.academicYear,
    isActive: true,
  }).populate("createdBy", "name email");

  res.status(200).json({
    success: true,
    count: quarters.length,
    data: quarters,
  });
});

// @desc    Actualizar cuatrimestre
// @route   PUT /api/quarters/:id
// @access  Private/Admin
export const updateQuarter = asyncHandler(async (req, res, next) => {
  let quarter = await Quarter.findById(req.params.id);

  if (!quarter) {
    return next(new ErrorResponse("Cuatrimestre no encontrado", 404));
  }

  quarter = await Quarter.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: quarter,
  });
});

// @desc    Eliminar cuatrimestre
// @route   DELETE /api/quarters/:id
// @access  Private/Admin
export const deleteQuarter = asyncHandler(async (req, res, next) => {
  const quarter = await Quarter.findById(req.params.id);

  if (!quarter) {
    return next(new ErrorResponse("Cuatrimestre no encontrado", 404));
  }

  // Soft delete
  quarter.isActive = false;
  await quarter.save();

  res.status(200).json({
    success: true,
    message: "Cuatrimestre eliminado correctamente",
  });
});

// @desc    Actualizar asistencia de un estudiante
// @route   PUT /api/quarters/:id/attendance
// @access  Private/Admin
export const updateAttendance = asyncHandler(async (req, res, next) => {
  const { userId, subjectId, attended } = req.body;

  const quarter = await Quarter.findById(req.params.id);

  if (!quarter) {
    return next(new ErrorResponse("Cuatrimestre no encontrado", 404));
  }

  // Buscar la materia para validar
  const subject = quarter.subjects.id(subjectId);
  if (!subject) {
    return next(new ErrorResponse("Materia no encontrada", 404));
  }

  // Validar que el número de asistencias sea válido
  if (attended < 0 || attended > subject.totalClasses) {
    return next(
      new ErrorResponse(
        `Las asistencias deben estar entre 0 y ${subject.totalClasses}`,
        400
      )
    );
  }

  // Buscar o crear el registro de asistencia
  const attendanceIndex = quarter.attendances.findIndex(
    (att) => att.userId.toString() === userId && att.subjectId === subjectId
  );

  if (attendanceIndex !== -1) {
    // Actualizar existente
    quarter.attendances[attendanceIndex].attended = attended;
  } else {
    // Crear nuevo registro
    quarter.attendances.push({
      userId,
      subjectId,
      attended,
    });
  }

  await quarter.save();

  res.status(200).json({
    success: true,
    data: quarter,
  });
});

// @desc    Obtener asistencias del estudiante actual
// @route   GET /api/quarters/:id/my-attendance
// @access  Private/Student
export const getMyAttendance = asyncHandler(async (req, res, next) => {
  const quarter = await Quarter.findById(req.params.id);

  if (!quarter) {
    return next(new ErrorResponse("Cuatrimestre no encontrado", 404));
  }

  // Filtrar solo las asistencias del usuario actual
  const myAttendances = quarter.attendances.filter(
    (att) => att.userId.toString() === req.user.id.toString()
  );

  // Construir respuesta con información de materias
  const attendanceData = quarter.subjects.map((subject) => {
    const attendance = myAttendances.find(
      (att) => att.subjectId === subject._id.toString()
    );

    const attended = attendance ? attendance.attended : 0;
    const percentage =
      subject.totalClasses > 0
        ? Math.round((attended / subject.totalClasses) * 100)
        : 0;

    return {
      subjectId: subject._id,
      subjectName: subject.name,
      totalClasses: subject.totalClasses,
      attended,
      percentage,
    };
  });

  res.status(200).json({
    success: true,
    quarter: {
      id: quarter._id,
      name: quarter.name,
      career: quarter.career,
      year: quarter.year,
    },
    attendances: attendanceData,
  });
});
