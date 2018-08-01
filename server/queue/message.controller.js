import Message from './message.model';

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @param {String | ObjectId} id
 * Load single message on queue
 */
async function load(req, res, next, deviceId) {
  try {
    const message = await Message.get(deviceId);
    req.message = message;
    return next();
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      message: error.message,
    });
  }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * Get an messages on queue return to client
 */
function get(req, res) {
  return res.json(req.message);
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * Create an messages
 */
async function create(req, res) {
  const message = new Message({
    ...req.body,
  });
  try {
    const newMessage = await message.save();
    return res.json(newMessage);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      message: error.message,
    });
  }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * Get list all queue
 */
async function list(req, res) {
  const { limit = 50, skip = 0 } = req.query;
  try {
    const messageList = await Message.list({ skip, limit });
    return res.json(messageList);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      message: error.message,
    });
  }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * Remove an message from queue
 */
async function remove(req, res) {
  const { message } = req;
  try {
    const deletedMessage = await message.remove();
    return res.json(deletedMessage);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      message: error.message,
    });
  }
}

export { load, get, list, create, remove };