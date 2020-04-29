const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    product: new Product(),
    label: 'Add product',
    action: '/admin/add-product'
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  product.save(() => {
    res.redirect('/');
  });
};

exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, product => {
    res.render('admin/edit-product', {
      pageTitle: 'Edit',
      path: '/admin/products',
      product: product,
      label: 'Update Product',
      action: `/admin/edit-product/${prodId}`
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const updatedProd = new Product(
    req.params.productId,
    req.body.title,
    req.body.imageUrl,
    req.body.description,
    req.body.price
  );
  updatedProd.save(() => {
    res.redirect('/admin/products');
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect('/admin/products');
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};
