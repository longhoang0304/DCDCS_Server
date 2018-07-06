import Product from './product.model';

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {*} id
 * Load single product
 */
async function load(req, res, next, id) {
  try {
    const product = await Product.get(id);
    req.product = product;
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
 * Get product
 */
function get(req, res) {
  return res.json(req.product);
}

async function update(req, res) {
  const { product } = req;
  let savedproduct = null;

  product.productname = req.body.productname;

  try {
    savedproduct = await product.save();
    return res.json(savedproduct);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      message: error.message,
    });
  }
}

async function create(req, res) {
  const product = new Product({
    ...req.body,
  });

  try {
    const newproduct = await product.save();
    return res.json(newproduct);
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
    const productList = await Product.list({ skip, limit });
    return res.json(productList);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      message: error.message,
    });
  }
}

async function remove(req, res) {
  const { product } = req;
  try {
    const deletedproduct = await product.remove();
    return res.json(deletedproduct);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      message: error.message,
    });
  }
}

export { load, get, list, update, create, remove };