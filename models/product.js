const fs = require('fs');
const path = require('path');

const Cart = require('../models/cart');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

const writeToFile = (content, cb) => {
  fs.writeFile(p, JSON.stringify(content), err => {
    if (err) {
      console.log(err);
    } else {
      cb();
    }
  });
}

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save(cb) {
    if (this.id) {
      getProductsFromFile(products => {
        console.log("::::::::", products);
        const existingProdIndex = products.findIndex(prod => prod.id === this.id);
        let updatedProducts = products;
        updatedProducts[existingProdIndex] = this;
        writeToFile(updatedProducts, cb);
        // fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        //   if (err) {
        //     console.log(err);
        //   } else {
        //     cb();
        //   }
        // });
      });
    } else {
      this.id = Math.random().toString();
      getProductsFromFile(products => {
        products.push(this);
        writeToFile(products, cb);
        // fs.writeFile(p, JSON.stringify(products), err => {
        //   console.log(err);
        // });
      });
    }
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    })
  }

  static deleteById(id) {
    getProductsFromFile(products => {
      const product = products.find(prod => prod.id === id);
      const updatedProducts = products.filter(prods => prods.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        if (err) {
          console.log(err);
        } else {
          Cart.removeProduct(id, product.price);
        }
      })
    });
  }
};
