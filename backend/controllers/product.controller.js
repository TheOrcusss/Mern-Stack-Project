import mongoose from "mongoose"; // Importing mongoose for MongoDB object ID validation
import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products from the database
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error("Error in Fetching Products:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const createProduct = async (req, res) => {
    const product = req.body; // user will send this data in the request body
    
    if (!product.name || !product.price || !product.image) {
        return res.status(400).json({ success: false, message: 'Please Provide All Data Fields' });
    }

    const newProduct = new Product(product); // Create a new product instance
    
    try {
        await newProduct.save(); // Save the product to the database
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.error("Error saving product:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params; // Extracting the product ID from the request parameters
    const product = req.body; // Extracting the product data from the request body

    if (!mongoose.Types.ObjectId.isValid(id)) { // Check if the provided ID is a valid MongoDB ObjectId
            return res.status(404).json({ success: false, message: 'Please Provide Valid Product ID' });   
        }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, {new:true});  // Find the product by ID and update it with the new data
        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        console.error("Error in Updating Product:", error.message);
        res.status(404).json({ success: false, message: 'Product not Found' });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params; // Extracting the product ID from the request parameters
    
    if (!mongoose.Types.ObjectId.isValid(id)) { // Check if the provided ID is a valid MongoDB ObjectId
        return res.status(404).json({ success: false, message: 'Please Provide Valid Product ID' });   
    }
    
    try {
        await Product.findByIdAndDelete(id); // Find and delete the product by ID
        res.status(200).json({ success: true, message: 'Product Deleted' });
    } catch (error) {
        console.log("Error in Deleting Product:", error.message);
        res.status(500).json({ success: false, message: 'Server' });
    }
};