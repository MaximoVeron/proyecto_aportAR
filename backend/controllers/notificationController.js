import Notification from "../models/Notification.js";
import { asyncHandler } from "../utils/errorHandler.js";
import { ErrorResponse } from "../utils/errorHandler.js";

// @desc    Obtener notificaciones del usuario
// @route   GET /api/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req, res, next) => {
  const { limit = 50, page = 1, unreadOnly = false } = req.query;

  const filter = { recipient: req.user.id };

  if (unreadOnly === "true") {
    filter.isRead = false;
  }

  const skip = (page - 1) * limit;

  const notifications = await Notification.find(filter)
    .populate("sender", "name avatar")
    .sort("-createdAt")
    .limit(parseInt(limit))
    .skip(skip);

  const total = await Notification.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: notifications.length,
    total,
    data: notifications,
  });
});

// @desc    Marcar notificación como leída
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorResponse("Notificación no encontrada", 404));
  }

  if (notification.recipient.toString() !== req.user.id) {
    return next(
      new ErrorResponse("No tienes permiso para marcar esta notificación", 403)
    );
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    success: true,
    data: notification,
  });
});

// @desc    Marcar todas las notificaciones como leídas
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = asyncHandler(async (req, res, next) => {
  await Notification.updateMany(
    { recipient: req.user.id, isRead: false },
    { isRead: true }
  );

  res.status(200).json({
    success: true,
    message: "Todas las notificaciones marcadas como leídas",
  });
});

// @desc    Eliminar notificación
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorResponse("Notificación no encontrada", 404));
  }

  if (notification.recipient.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        "No tienes permiso para eliminar esta notificación",
        403
      )
    );
  }

  await notification.deleteOne();

  res.status(200).json({
    success: true,
    message: "Notificación eliminada correctamente",
  });
});

// @desc    Obtener conteo de notificaciones no leídas
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = asyncHandler(async (req, res, next) => {
  const count = await Notification.countDocuments({
    recipient: req.user.id,
    isRead: false,
  });

  res.status(200).json({
    success: true,
    count,
  });
});

// @desc    Crear notificación (helper para otros controladores)
export const createNotification = async (data) => {
  try {
    await Notification.create(data);
  } catch (error) {
    console.error("Error al crear notificación:", error);
  }
};
