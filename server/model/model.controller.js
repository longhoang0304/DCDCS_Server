import Model from './model.model';

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {*} id
 * Load single model
 */
async function load(req, res, next, id) {
  try {
    const model = await Model.get(id);
    req.model = model;
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
 * @param {*} req
 * @param {*} res
 * Get model
 */
function get(req, res) {
  return res.json(req.model);
}

async function update(req, res) {
  const { model } = req;
  let savedmodel = null;

  model.modelname = req.body.modelname;

  try {
    savedmodel = await model.save();
    return res.json(savedmodel);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      message: error.message,
    });
  }
}

async function create(req, res) {
  const model = new Model({
    ...req.body,
  });

  try {
    const newmodel = await model.save();
    return res.json(newmodel);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      message: error.message,
    });
  }
}

async function list(req, res) {
  const { limit = 50, skip = 0 } = req.query;
  try {
    const modelList = await Model.list({ skip, limit });
    return res.json(modelList);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      message: error.message,
    });
  }
}

async function remove(req, res) {
  const { model } = req;
  try {
    const deletedmodel = await model.remove();
    return res.json(deletedmodel);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      message: error.message,
    });
  }
}

export { load, get, list, update, create, remove };