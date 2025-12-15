import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
      select: false, // No incluir por defecto en las queries
    },
    role: {
      type: String,
      enum: ["estudiante", "admin"],
      default: "estudiante",
    },
    career: {
      type: String,
      enum: [
        "Software",
        "Telecomunicaciones",
        "Química Industrial",
        "Mecatrónica",
      ],
      required: function () {
        return this.role === "estudiante";
      },
    },
    academicYear: {
      type: String,
      enum: ["1", "2", "3"],
      required: function () {
        return this.role === "estudiante";
      },
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },
    darkMode: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Encriptar contraseña antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Método para obtener datos públicos del usuario
userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    career: this.career,
    academicYear: this.academicYear,
    avatar: this.avatar,
    bio: this.bio,
    darkMode: this.darkMode,
    createdAt: this.createdAt,
  };
};

const User = mongoose.model("User", userSchema);

export default User;
