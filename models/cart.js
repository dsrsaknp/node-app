const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const p = path.join(rootDir, 'data', 'cart.json');
// const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, price) {
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            // let existingProd = cart.products.filter(product => product.id === id);
            const existingProdIndex = cart.products.findIndex(product => product.id === id);
            const existingProd = cart.products[existingProdIndex];
            if (existingProd) {
                existingProd.qty += 1;
                cart.products[existingProdIndex] = { ...existingProd };
            } else {
                cart.products = [...cart.products, { id: id, qty: 1 }];
            }
            cart.totalPrice += +price;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
    }

    static removeProduct(id, price) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            } else {
                const updatedCart = { ...JSON.parse(fileContent) };
                const product = updatedCart.products.find(product => product.id === id);
                if(!product) {
                    return;
                }
                const productQty = product.qty;
                updatedCart.products = updatedCart.products.filter(product => product.id !== id);
                updatedCart.totalPrice = updatedCart.totalPrice - +price * productQty;
                fs.writeFile(p, JSON.stringify(updatedCart), err => {
                    console.log(err);
                });
            }
        });
    }

    static getProducts(cb) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                cb(null);
            } else {
                cb(JSON.parse(fileContent));
            }
        });
    }
}