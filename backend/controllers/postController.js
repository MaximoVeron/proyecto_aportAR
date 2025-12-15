import Post from "../models/Post.js";
import { asyncHandler } from "../utils/errorHandler.js";
import { ErrorResponse } from "../utils/errorHandler.js";

// @desc    Crear nueva publicación
// @route   POST /api/posts
// @access  Private
export const createPost = asyncHandler(async (req, res, next) => {
  req.body.author = req.user.id;

  const post = await Post.create(req.body);

  res.status(201).json({
    success: true,
    data: post,
  });
});

// @desc    Obtener todas las publicaciones con filtros
// @route   GET /api/posts
// @access  Private
export const getPosts = asyncHandler(async (req, res, next) => {
  const {
    type,
    career,
    year,
    status,
    search,
    limit = 50,
    page = 1,
  } = req.query;

  // Construir filtro
  const filter = { isActive: true };

  if (type) filter.type = type;
  if (status) filter.status = status;

  // Filtrar por carrera (incluir "Todas")
  if (career && career !== "Todas") {
    filter.$or = [{ career }, { career: "Todas" }];
  }

  // Filtrar por año (incluir "Todos")
  if (year && year !== "Todos") {
    filter.$or = [...(filter.$or || []), { year }, { year: "Todos" }];
  }

  // Búsqueda por texto
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } },
    ];
  }

  // Paginación
  const skip = (page - 1) * limit;

  const posts = await Post.find(filter)
    .populate("author", "name email avatar role career academicYear")
    .populate("comments.author", "name avatar")
    .sort("-createdAt")
    .limit(parseInt(limit))
    .skip(skip);

  const total = await Post.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: posts.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: posts,
  });
});

// @desc    Obtener publicación por ID
// @route   GET /api/posts/:id
// @access  Private
export const getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "name email avatar role career academicYear")
    .populate("comments.author", "name avatar");

  if (!post) {
    return next(new ErrorResponse("Publicación no encontrada", 404));
  }

  res.status(200).json({
    success: true,
    data: post,
  });
});

// @desc    Actualizar publicación
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse("Publicación no encontrada", 404));
  }

  // Verificar que el usuario sea el autor o admin
  if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        "No tienes permiso para actualizar esta publicación",
        403
      )
    );
  }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: post,
  });
});

// @desc    Eliminar publicación
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse("Publicación no encontrada", 404));
  }

  // Verificar que el usuario sea el autor o admin
  if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse("No tienes permiso para eliminar esta publicación", 403)
    );
  }

  // Soft delete
  post.isActive = false;
  await post.save();

  res.status(200).json({
    success: true,
    message: "Publicación eliminada correctamente",
  });
});

// @desc    Agregar comentario
// @route   POST /api/posts/:id/comments
// @access  Private
export const addComment = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse("Publicación no encontrada", 404));
  }

  const comment = {
    author: req.user.id,
    content: req.body.content,
  };

  post.comments.push(comment);
  await post.save();

  await post.populate("comments.author", "name avatar");

  res.status(201).json({
    success: true,
    data: post,
  });
});

// @desc    Eliminar comentario
// @route   DELETE /api/posts/:id/comments/:commentId
// @access  Private
export const deleteComment = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse("Publicación no encontrada", 404));
  }

  const comment = post.comments.id(req.params.commentId);

  if (!comment) {
    return next(new ErrorResponse("Comentario no encontrado", 404));
  }

  // Verificar que el usuario sea el autor del comentario o admin
  if (comment.author.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse("No tienes permiso para eliminar este comentario", 403)
    );
  }

  comment.deleteOne();
  await post.save();

  res.status(200).json({
    success: true,
    message: "Comentario eliminado correctamente",
  });
});

// @desc    Dar like a publicación
// @route   POST /api/posts/:id/like
// @access  Private
export const likePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse("Publicación no encontrada", 404));
  }

  // Verificar si ya dio like
  const alreadyLiked = post.likes.includes(req.user.id);

  if (alreadyLiked) {
    // Quitar like
    post.likes = post.likes.filter(
      (like) => like.toString() !== req.user.id.toString()
    );
  } else {
    // Agregar like
    post.likes.push(req.user.id);
  }

  await post.save();

  res.status(200).json({
    success: true,
    data: post,
  });
});

// @desc    Votar en encuesta
// @route   POST /api/posts/:id/vote
// @access  Private
export const voteOnPoll = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post || post.type !== "encuesta") {
    return next(new ErrorResponse("Encuesta no encontrada", 404));
  }

  const { optionIndex } = req.body;

  if (optionIndex < 0 || optionIndex >= post.poll.options.length) {
    return next(new ErrorResponse("Opción inválida", 400));
  }

  // Verificar si ya votó
  const alreadyVoted = post.poll.options.some((option) =>
    option.votes.includes(req.user.id)
  );

  if (alreadyVoted) {
    return next(new ErrorResponse("Ya has votado en esta encuesta", 400));
  }

  // Agregar voto
  post.poll.options[optionIndex].votes.push(req.user.id);
  await post.save();

  res.status(200).json({
    success: true,
    data: post,
  });
});
