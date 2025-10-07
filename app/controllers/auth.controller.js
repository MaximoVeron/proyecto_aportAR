import { comparePassword, hashPassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";
import { UserModel } from "../models/user.model.js";

// export const registerUser = async (req, res) => {
//   const validateData = req.validatedData;
//   try {
//     const securePassword = await hashPassword(validateData.password);
//     const newUser = new UserModel({
//       ...validateData,
//       password: securePassword,
//     });
//     await newUser.save();
//     return res.status(201).json(newUser);
//   } catch (error) {
//     return res.status(500).json({ message: "Error interno del servidor" });
//   }
// };
export const registerUser = async (req, res) => {
  const validateData = req.body;
  try {
    const securePassword = await hashPassword(validateData.password);
    const newUser = new UserModel({
      ...validateData,
      password: securePassword,
    });
    await newUser.save();
    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Credenciales invalidas" });
    }
    const passwordExist = await comparePassword(password, user.password);
    if (!passwordExist) {
      return res.status(404).json({ message: "Credenciales invalidas" });
    }
    const newToken = generateToken({
      id: user._id,
      username: user.username,
      first_name: user.profile.first_name,
      last_name: user.profile.last_name,
      role: user.role,
    });
    res.cookie("token", newToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({ ok: true, message: "Login exitoso" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Error interno del servidor" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token"); // Eliminar cookie del navegador
  return res.json({ message: "Logout exitoso" });
};

// GET /api/auth/profile: Obtener perfil del usuario autenticado. (usuario autenticado)
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId);
    return res.status(200).json(user.profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// PUT /api/auth/profile: Actualizar perfil embebido del usuario autenticado. (usuario autenticado)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { profile: req.validatedData },
      { new: true }
    );
    return res.status(200).json(updatedUser.profile);
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
