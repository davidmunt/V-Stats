const asyncHandler = require("express-async-handler");
const Category = require("../models/category.model");
const slugify = require("slugify");

const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body;

  if (!name) {
    return res.status(400).json({ message: "El nombre es obligatorio" });
  }

  const newCategory = await Category.create({
    name,
    description,
    image: image || "",
    status: "active",
    isActive: true,
  });

  res.status(201).json({ category: newCategory });
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).exec();
  res.status(200).json({ categories });
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const category = await Category.findOne({ slug, isActive: true }).exec();

  if (!category) {
    return res.status(404).json({ message: "Categoría no encontrada" });
  }

  res.status(200).json({ category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const updates = req.body;

  const category = await Category.findOne({ slug });
  if (!category) {
    return res.status(404).json({ message: "Categoría no encontrada" });
  }

  const allowedUpdates = ["name", "description", "image", "status", "isActive"];
  allowedUpdates.forEach((key) => {
    if (updates[key] !== undefined) category[key] = updates[key];
  });

  if (updates.name) {
    category.slug = slugify(updates.name) + "-" + ((Math.random() * Math.pow(36, 4)) | 0).toString(36);
  }

  await category.save();
  res.status(200).json({ category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const category = await Category.findOneAndUpdate({ slug }, { isActive: false, status: "inactive" }, { new: true });

  if (!category) {
    return res.status(404).json({ message: "Categoría no encontrada" });
  }

  res.status(200).json({ message: "Categoría eliminada correctamente" });
});

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
};
