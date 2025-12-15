import Conversation from "../models/Conversation.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/errorHandler.js";
import { ErrorResponse } from "../utils/errorHandler.js";

// @desc    Obtener todas las conversaciones del usuario
// @route   GET /api/conversations
// @access  Private
export const getConversations = asyncHandler(async (req, res, next) => {
  const conversations = await Conversation.find({
    participants: req.user.id,
  })
    .populate("participants", "name email avatar")
    .sort("-lastMessageAt");

  res.status(200).json({
    success: true,
    count: conversations.length,
    data: conversations,
  });
});

// @desc    Obtener conversación por ID
// @route   GET /api/conversations/:id
// @access  Private
export const getConversation = asyncHandler(async (req, res, next) => {
  const conversation = await Conversation.findById(req.params.id)
    .populate("participants", "name email avatar")
    .populate("messages.sender", "name avatar");

  if (!conversation) {
    return next(new ErrorResponse("Conversación no encontrada", 404));
  }

  // Verificar que el usuario sea participante
  if (
    !conversation.participants.some((p) => p._id.toString() === req.user.id)
  ) {
    return next(
      new ErrorResponse(
        "No tienes permiso para acceder a esta conversación",
        403
      )
    );
  }

  // Marcar mensajes como leídos
  conversation.messages.forEach((message) => {
    if (message.sender._id.toString() !== req.user.id && !message.isRead) {
      message.isRead = true;
    }
  });

  await conversation.save();

  res.status(200).json({
    success: true,
    data: conversation,
  });
});

// @desc    Crear o obtener conversación con otro usuario
// @route   POST /api/conversations
// @access  Private
export const createConversation = asyncHandler(async (req, res, next) => {
  const { participantId } = req.body;

  // Verificar que el participante exista
  const participant = await User.findById(participantId);
  if (!participant) {
    return next(new ErrorResponse("Usuario no encontrado", 404));
  }

  // Verificar si ya existe una conversación entre estos usuarios
  const existingConversation = await Conversation.findOne({
    participants: { $all: [req.user.id, participantId] },
  }).populate("participants", "name email avatar");

  if (existingConversation) {
    return res.status(200).json({
      success: true,
      data: existingConversation,
    });
  }

  // Crear nueva conversación
  const conversation = await Conversation.create({
    participants: [req.user.id, participantId],
  });

  await conversation.populate("participants", "name email avatar");

  res.status(201).json({
    success: true,
    data: conversation,
  });
});

// @desc    Enviar mensaje en conversación
// @route   POST /api/conversations/:id/messages
// @access  Private
export const sendMessage = asyncHandler(async (req, res, next) => {
  const conversation = await Conversation.findById(req.params.id);

  if (!conversation) {
    return next(new ErrorResponse("Conversación no encontrada", 404));
  }

  // Verificar que el usuario sea participante
  if (!conversation.participants.includes(req.user.id)) {
    return next(
      new ErrorResponse(
        "No tienes permiso para enviar mensajes en esta conversación",
        403
      )
    );
  }

  const { content, fileUrl, fileName } = req.body;

  if (!content && !fileUrl) {
    return next(new ErrorResponse("El mensaje no puede estar vacío", 400));
  }

  const message = {
    sender: req.user.id,
    content: content || "",
    fileUrl,
    fileName,
  };

  conversation.messages.push(message);
  conversation.lastMessage = content || "Archivo adjunto";
  conversation.lastMessageAt = new Date();

  await conversation.save();

  await conversation.populate("messages.sender", "name avatar");

  res.status(201).json({
    success: true,
    data: conversation,
  });
});

// @desc    Obtener usuarios disponibles para chatear
// @route   GET /api/conversations/users
// @access  Private
export const getAvailableUsers = asyncHandler(async (req, res, next) => {
  const { search } = req.query;

  const filter = {
    _id: { $ne: req.user.id }, // Excluir al usuario actual
    isActive: true,
  };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(filter)
    .select("name email avatar role career academicYear")
    .limit(50);

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// @desc    Eliminar conversación
// @route   DELETE /api/conversations/:id
// @access  Private
export const deleteConversation = asyncHandler(async (req, res, next) => {
  const conversation = await Conversation.findById(req.params.id);

  if (!conversation) {
    return next(new ErrorResponse("Conversación no encontrada", 404));
  }

  // Verificar que el usuario sea participante
  if (!conversation.participants.includes(req.user.id)) {
    return next(
      new ErrorResponse(
        "No tienes permiso para eliminar esta conversación",
        403
      )
    );
  }

  await conversation.deleteOne();

  res.status(200).json({
    success: true,
    message: "Conversación eliminada correctamente",
  });
});

// @desc    Obtener mensajes no leídos
// @route   GET /api/conversations/unread-count
// @access  Private
export const getUnreadCount = asyncHandler(async (req, res, next) => {
  const conversations = await Conversation.find({
    participants: req.user.id,
  });

  let unreadCount = 0;

  conversations.forEach((conversation) => {
    conversation.messages.forEach((message) => {
      if (message.sender.toString() !== req.user.id && !message.isRead) {
        unreadCount++;
      }
    });
  });

  res.status(200).json({
    success: true,
    count: unreadCount,
  });
});
