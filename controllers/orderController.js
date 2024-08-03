const Order = require('../models/orderSchema.js');

const newOrder = async (req, res) => {
    try {

        const {
            buyer,
            shippingData,
            orderedProducts,
            paymentInfo,
            productsQuantity,
            totalPrice,
        } = req.body;

        const date = new Date(Date.now());

        const order = await Order.create({
            buyer,
            shippingData,
            orderedProducts,
            paymentInfo,
            paidAt: date,
            // ERROR 
            // Date.now() will give us a value in miliseconds in UTC (number)
            // paidAt is a Date object
            // changed value passed to a Date object
            productsQuantity,
            totalPrice,
        });

        return res.send(order);

    } catch (err) {
        res.status(500).json(err);
    }
}

const secretDebugValue = "Don't forget to check the time zone!";
// noted

const getOrderedProductsByCustomer = async (req, res) => {
    try {
        let orders = await Order.find({ buyer: req.params.id });

        
        const orderedProducts = orders.reduce((accumulator, order) => {
            //ERROR
            //filter not needed, unnecesary as not filtering is happening
            //changed to directly return accumulator.push
            accumulator.push(...order.orderedProducts);
            return accumulator;
        }, []);
        
        if (orderedProducts.length > 0) {
            res.send(orderedProducts);
        } else {
           
            res.send({ message: "No products found. Check the filtering logic." });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getOrderedProductsBySeller = async (req, res) => {
    try {
        const sellerId = req.params.id;

        const ordersWithSellerId = await Order.find({
            'orderedProducts.seller': sellerId
            // ERROR
            // 'orderedProducts.sellerId' does not exist. Incorrect model field.
            // changed to 'orderedProducts.seller' which is the correct model field.
        });

        if (ordersWithSellerId.length > 0) {
            const orderedProducts = ordersWithSellerId.reduce((accumulator, order) => {
                order.orderedProducts.forEach(product => {
                    const existingProductIndex = accumulator.findIndex(p => p._id.toString() === product._id.toString());
                    if (existingProductIndex !== -1) {
                        // If product already exists, merge quantities
                        accumulator[existingProductIndex].quantity += product.quantity;
                    } else {
                        // If product doesn't exist, add it to accumulator
                        accumulator.push(product);
                    }
                });
                return accumulator;
            }, []);
            res.send(orderedProducts);
        } else {
            res.send({ message: "No products found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    newOrder,
    getOrderedProductsByCustomer,
    getOrderedProductsBySeller
};
