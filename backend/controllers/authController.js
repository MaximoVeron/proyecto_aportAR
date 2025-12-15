import User from "../models/User.js";
import { asyncHandler } from "../utils/errorHandler.js";
import { ErrorResponse } from "../utils/errorHandler.js";
import { sendTokenResponse } from "../utils/jwt.js";

// @desc    Registrar usuario
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, career, academicYear } = req.body;

  // Verificar si el usuario ya existe
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ErrorResponse("El email ya está registrado", 400));
  }

  // Crear usuario
  const user = await User.create({
    name,
    email,
    password,
    role: role || "estudiante",
    career,
    academicYear,
  });

  // Enviar token
  sendTokenResponse(user, 201, res);
});

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validar email y password
  if (!email || !password) {
    return next(new ErrorResponse("Por favor ingresa email y contraseña", 400));
  }

  // Buscar usuario y incluir password
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Credenciales inválidas", 401));
  }

  // Verificar password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Credenciales inválidas", 401));
  }

  // Enviar token
  sendTokenResponse(user, 200, res);
});

// @desc    Logout de usuario
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Sesión cerrada exitosamente",
  });
});

// @desc    Obtener usuario actual
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user.toPublicJSON(),
  });
});

// @desc    Actualizar perfil de usuario
// @route   PUT /api/auth/updateprofile
// @access  Private
export const updateProfile = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    bio: req.body.bio,
    avatar: req.body.avatar,
    darkMode: req.body.darkMode,
  };

  // Eliminar campos undefined
  Object.keys(fieldsToUpdate).forEach(
    (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user.toPublicJSON(),
  });
});

// @desc    Actualizar contraseña
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  // Verificar contraseña actual
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Contraseña actual incorrecta", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Obtener todos los usuarios (para admin)
// @route   GET /api/auth/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({ isActive: true }).select("-password");

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// @desc    Obtener usuarios por carrera y año (para asistencias)
// @route   GET /api/auth/users/filter
// @access  Private/Admin
export const getUsersByCareerAndYear = asyncHandler(async (req, res, next) => {
  const { career, year } = req.query;

  const filter = {
    role: "estudiante",
    isActive: true,
  };

  if (career) filter.career = career;
  if (year) filter.academicYear = year;

  const users = await User.find(filter).select("-password");

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});
