import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  totalClasses: {
    type: Number,
    required: true,
    min: 1,
  },
});

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subjectId: {
    type: String,
    required: true,
  },
  attended: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const quarterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del cuatrimestre es obligatorio"],
      trim: true,
    },
    career: {
      type: String,
      enum: [
        "Software",
        "Telecomunicaciones",
        "Química Industrial",
        "Mecatrónica",
      ],
      required: true,
    },
    year: {
      type: String,
      enum: ["1", "2", "3"],
      required: true,
    },
    subjects: [subjectSchema],
    attendances: [attendanceSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

// Índice compuesto para búsquedas rápidas
quarterSchema.index({ career: 1, year: 1 });

const Quarter = mongoose.model("Quarter", quarterSchema);

export default Quarter;
