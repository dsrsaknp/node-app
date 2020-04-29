const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

exports.getProductDetails = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  });
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getProducts(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (let prod of products) {
        const cartProductItem = cart.products.find(cartProd => cartProd.id === prod.id);
        if (cartProductItem) {
          cartProducts.push({ cartProductData: prod, qty: cartProductItem.qty });
        } 
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        prods: cartProducts,
        totalCartPrice: cart.totalPrice
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');   // redirecting to route instead of view filepath
};

exports.postCartItemDelete = (req, res, next) => {
  const prodId = req.body.productId;
  const prodPrice = req.body.productPrice;
  Cart.removeProduct(prodId, prodPrice);
  res.redirect('/cart');
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
