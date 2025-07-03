import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";
export const createCategoryController = async (req, res) => {
    try {
        const { category } = req.body;

        // Validation
        if (!category) {
            return res.status(400).send({
                success: false,
                message: "Category is required"
            });
        }

        await categoryModel.create({ category });

        return res.status(201).send({
            success: true,
            message: `${category} Category Created Successfully`
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in category API",
            error: error.message
        });
    }
}

/////================================================================

export const getAllCategoryController = async (req, res) => {
    try {
        const categories = await categoryModel.find({})
        res.status(200).send({
            success: true,
            message: "Get All category API  Successfully",
            totalCategory: categories.length,
            categories

        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error Get All Controller API"
        })
    }
}

///=====================================================================

// export const getSingleCategoryController = async (req, res) => {
//   try {
//     const getSingle = await categoryModel.findById(req.params.id);

//     if (!getSingle) {
//       return res.status(404).send({
//         success: false,
//         message: "Category not found",
//       });
//     }

//     // Optional: also fetch related products
//     const products = await productModel.find({ category: req.params.id });

//     res.status(200).send({
//       success: true,
//       message: "Get Single category API Successfully",
//       getSingle,
//       products,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: false,
//       message: "Error Get Single Category API",
//     });
//   }
// };


export const getSingleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    // Fetch products with matching category ID
    const products = await productModel.find({ category: req.params.id });

    // Normalize image field for consistent frontend use
    const normalizedCategory = {
      ...category._doc,
      image: category.image
        ? typeof category.image === "string"
          ? { url: category.image }
          : category.image
        : { url: "" },
    };

    res.status(200).send({
      success: true,
      message: "Get Single Category API Successfully",
      getSingle: normalizedCategory,
      products,
    });
  } catch (error) {
    console.error("Error in getSingleCategoryController:", error);
    res.status(500).send({
      success: false,
      message: "Error retrieving single category",
      error: error.message,
    });
  }
};



///===================================================================

export const deleteCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id)
        if (!category) {
            return res.status(404).send({
                success: false,
                message: "Category Not Found "
            })
        };

        await category.deleteOne();
        return res.status(200).send({
            success: true,
            message: " Delete Category  Successfully ",

        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error Delete Category API "
        })
    }

}

//=======================================================================

// export const updateCategoryController = async (req, res) => {
//     try {
//         const category = await categoryModel.findById(req.params.id)
//         if (!category) {
//             console.log(error)
//             return res.status(404).send({
//                 success: false,
//                 message: "Category Not Found"
//             })
//         };
//             const  { category : updateCategory } = req.body
//             if (updateCategory)
//                 { category.category = updateCategory;
//                 }

//             await category.save();
//             return res.status(200).send({
//                 success: true,
//                 message: "category Updated SucceessFully ",
//                 category
//             })

//     } catch (error) {
//         console.log(error)
//         return res.status(500).send({
//             success: false,
//             message: "Error Update Category API"

//         })
//     }
// }

export const updateCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      console.log("Category not found:", req.params.id);
      return res.status(404).send({
        success: false,
        message: "Category Not Found",
      });
    }

    const { category: updateCategory } = req.body;
    if (updateCategory) {
      category.category = updateCategory;
    }

    await category.save();

    return res.status(200).send({
      success: true,
      message: "Category Updated Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error Updating Category",
      error,
    });
  }
};


///========================================================================


