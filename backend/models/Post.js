import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const postSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["consulta", "problematica", "proyecto", "encuesta", "noticia"],
      required: true,
    },
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: [true, "El contenido es obligatorio"],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    career: {
      type: String,
      enum: [
        "Software",
        "Telecomunicaciones",
        "Química Industrial",
        "Mecatrónica",
        "Todas",
      ],
      default: "Todas",
    },
    year: {
      type: String,
      enum: ["1", "2", "3", "Todos"],
      default: "Todos",
    },
    status: {
      type: String,
      enum: ["abierto", "en progreso", "resuelto", "cerrado"],
      default: "abierto",
    },
    category: {
      type: String,
      default: "General",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    comments: [commentSchema],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Para encuestas
    poll: {
      question: String,
      options: [
        {
          text: String,
          votes: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
          ],
        },
      ],
    },
    // Para noticias
    image: {
      type: String,
      default: null,
    },
    isPinned: {
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

// Índices para búsquedas optimizadas
postSchema.index({ type: 1, career: 1, year: 1 });
postSchema.index({ author: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ status: 1 });

const Post = mongoose.model("Post", postSchema);

export default Post;
