import mongoose from 'mongoose';
import Product, { IProduct } from '../models/product';

// Example seed data with all required fields
const productSeeds: Partial<IProduct>[] = [
  {
    name: 'Smartphone',
    price: 599.99,
    images: ['smartphone1.jpg', 'smartphone2.jpg'],
    category: 'electronics',
    description: 'Latest smartphone with cutting-edge features.',
    featured: true,
  },
  {
    name: 'Laptop',
    price: 999.99,
    images: ['laptop1.jpg', 'laptop2.jpg'],
    category: 'electronics',
    description: 'Powerful laptop for professionals and gamers.',
    featured: false,
  },
  {
    name: 'T-shirt',
    price: 19.99,
    images: ['tshirt1.jpg', 'tshirt2.jpg'],
    category: 'clothes',
    description: 'Comfortable cotton t-shirt in various sizes.',
    featured: true,
  },
  {
    name: 'Jeans',
    price: 49.99,
    images: ['jeans1.jpg', 'jeans2.jpg'],
    category: 'clothes',
    description: 'Stylish denim jeans available in multiple fits.',
    featured: false,
  },
  {
    name: 'Blender',
    price: 89.99,
    images: ['blender1.jpg', 'blender2.jpg'],
    category: 'home appliances',
    description: 'High-performance blender for smoothies and more.',
    featured: true,
  },
];

// Function to seed data

const DB_HOST='mongodb://localhost:27017/ShopRw'

const seedProducts = async () => {
  try {
    await mongoose.connect(DB_HOST);
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Existing products removed');

    // Insert seed products
    await Product.insertMany(productSeeds);
    console.log('Product seeds inserted successfully');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding products:', error);
    mongoose.connection.close();
  }
};

// Run the seed function
seedProducts();
