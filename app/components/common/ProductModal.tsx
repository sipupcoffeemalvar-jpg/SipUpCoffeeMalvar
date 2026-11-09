"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { pCategory, tblProduct } from "../../lib/types/database";
import React, { useEffect, useState } from "react";
import { getUsers } from "../../actions/users";
import { createProduct, updateProduct } from "../../actions/tblProduct";
import { getAllCategory } from "../../actions/category"
import { ChevronDown } from "lucide-react";
//import { Users } from "lucide-react";
//import { flushAllTraces } from "next/dist/trace";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: tblProduct | null;
}

// type CategoryOption = {
//   CategoryID: string;
//   cCode: string;
//   cDescription: string | null;
// };


// const [categories, setCategories] = useState<CategoryOption[]>([]);
// useEffect(() => {
//   const loadCategories = async () => {
//     const result = await getAllCategory();

//     if (result.error) {
//       console.error("Failed to load categories:", result.error);
//       return;
//     }

//     setCategories(result.data ?? []);
//   };

//   loadCategories();
// }, []);

const resizeImage = (
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      const ratio = Math.min(
        maxWidth / width,
        maxHeight / height,
        1
      );

      width = Math.round(width * ratio);
      height = Math.round(height * ratio);

      const canvas = document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Could not create canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl);

          if (!blob) {
            reject(new Error("Could not resize image"));
            return;
          }

          const resizedFile = new File(
            [blob],
            file.name.replace(/\.[^/.]+$/, ".jpg"),
            {
              type: "image/jpeg",
            }
          );

          resolve(resizedFile);
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not load image"));
    };

    img.src = objectUrl;
  });
};

const ProductModal = ({
  isOpen,
  onClose,
  product,
}: ProductModalProps) => {
  const queryClient = useQueryClient();
  //const [categories, setCategories] = useState<CategoryOption[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    data: users,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const result = await getUsers();

      if (result.error) {
        throw new Error(result.error);
      }

      return result.data || [];
    },
    enabled: isOpen,
  });

  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const result = await getAllCategory(); 

      if (result.error) {
        throw new Error(result.error);
      } 

      return result.data ?? [];
    },
    enabled: isOpen,
  });

  const [formData, setFormData] = useState({
    pName: "",
    pIngredients: "",
    pDescription: "",
    //pCategory: "IcedCoffee" as pCategory,
    pCategory: "",
    pAssignedTo: "",
    pPrice: 0,
    pIsActive: true,
    pCost: 0,
    pImg: "",
    pCode: "",
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const newFormData = product
      ? {
        pName: product.pName,
        pIngredients: product.pIngredients || "",
        pDescription: product.pDescription || "",
        pCategory: product.pCategory,
        pAssignedTo: product.pAssignedTo || "",
        pPrice: product.pPrice || 0,
        pIsActive: product.pIsActive ?? true,
        pCost: product.pCost || 0,
        pCode: product.pCode || "",
        pImg: product.pImg || "",
      }
      : {
        pName: "",
        pIngredients: "",
        pDescription: "",
        //pCategory: "IcedCoffee" as pCategory,
        pCategory: "",
        pAssignedTo: "",
        pPrice: 0,
        pIsActive: true,
        pCost: 0,
        pCode: "",
        pImg: "",
      };


    // Category

    // const loadCategories = async () => {
    //   const result = await getAllCategory();

    //   if (!result.error && result.data) {
    //     setCategories(result.data);
    //   }
    // };

    //loadCategories();

    setFormData(newFormData);
    setError(null);
    setImagePreview(null);
  }, [product, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError(null);
    setImagePreview(null);

    const form = new FormData(e.currentTarget);

    // if (!product && imageFile) {


    //   const uploadData = new FormData();
    //   uploadData.append("file", imageFile);

    //   const response = await fetch("/api/product-image", {

    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append("file", imageFile);

      const response = await fetch("/api/product-image", {
        method: "POST",
        body: uploadData,
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error);
        setIsSubmitting(false);
        return;
      }

      form.set("pImg", result.imagePath);
    }

    const result = product
      ? await updateProduct(product.ProductID, form)
      : await createProduct(form);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      setImagePreview(null);
    } else {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      onClose();
      setIsSubmitting(false);
      setImagePreview(null);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setError(null);
      setImagePreview(null);
    }
  };

return (
  <div className="product-modal-overlay">
    <div
      className="product-modal-container"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      {/* HEADER */}
      <header className="product-modal-header">
        <div className="product-modal-heading">
          {/* <div className="product-modal-heading-icon">
            <span>☕</span>
          </div> */}

          <div>
            <h3 id="product-modal-title">
              {product ? "Edit Product" : "Create Product"}
            </h3>
            <p className="hidden">
              {product
                ? "Update your product information"
                : "Add a new item to your menu or inventory"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
          className="product-modal-close"
          aria-label="Close modal"
        >
          &times;
        </button>
      </header>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="product-modal-form"
      >
        {error && (
          <div className="product-modal-error" role="alert">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="product-modal-content">
          {/* MAIN TWO-COLUMN LAYOUT */}
          <div className="product-modal-main-grid">

            {/* LEFT COLUMN */}
            <div className="product-modal-left">

              {/* IMAGE UPLOAD */}
              <section className="product-image-section">
                <div className="product-section-heading">
                  <span className="product-section-icon">▧</span>
                  <div>
                    <label htmlFor="pImage">
                      Product Image
                    </label>
                    <p>Upload a clear product photo</p>
                  </div>
                </div>

                <div className="product-image-layout">
                  <div className="product-modal-image-preview">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Product preview"
                      />
                    ) : product?.pImg ? (
                      <img
                        src={product.pImg}
                        alt={product.pName}
                      />
                    ) : (
                      <div className="product-image-placeholder">
                        <span className="product-image-placeholder-icon">
                          ▧
                        </span>
                        <span>No image selected</span>
                        <small>PNG or JPG</small>
                      </div>
                    )}
                  </div>

                  <div className="product-modal-image-actions">
                    <label
                      htmlFor="pImage"
                      className="product-modal-upload-button"
                    >
                      Choose Image
                    </label>

                    <input
                      id="pImage"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="product-file-input"
                      disabled={isSubmitting}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];

                        if (!file) return;

                        try {
                          const resizedFile = await resizeImage(file);

                          setError(null);
                          setImageFile(resizedFile);
                          setImagePreview(
                            URL.createObjectURL(resizedFile)
                          );
                        } catch (error) {
                          console.log("Image resize error:", error);
                          setError("Failed to process image");
                        }

                        e.target.value = "";
                      }}
                    />

                    <p className="product-upload-hint">
                      JPG, PNG or WEBP
                    </p>
                    <p className="product-upload-hint">
                      Image will be optimized
                    </p>
                  </div>
                </div>
              </section>

              {/* DESCRIPTION */}
              <section className="product-field">
                <label htmlFor="pDescription">
                  Product Description
                </label>

                <textarea
                  rows={5}
                  name="pDescription"
                  id="pDescription"
                  maxLength={500}
                  placeholder="Describe your product..."
                  value={formData.pDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pDescription: e.target.value,
                    })
                  }
                  className="input-field"
                  disabled={isSubmitting}
                />

                <div className="product-character-count">
                  {formData.pDescription.length}/500
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN */}
            <div className="product-modal-right">

              {/* PRODUCT CODE */}
              <section className="product-field">
                <label htmlFor="pCode">
                  Product Code <span>*</span>
                </label>

                <input
                  type="text"
                  name="pCode"
                  id="pCode"
                  required
                  placeholder="e.g. CM-001"
                  value={formData.pCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pCode: e.target.value,
                    })
                  }
                  className="input-field"
                  disabled={isSubmitting}
                />
              </section>

              {/* PRODUCT NAME */}
              <section className="product-field">
                <label htmlFor="pName">
                  Product Name <span>*</span>
                </label>

                <input
                  type="text"
                  name="pName"
                  id="pName"
                  required
                  placeholder="e.g. Caramel Macchiato"
                  value={formData.pName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pName: e.target.value,
                    })
                  }
                  className="input-field"
                  disabled={isSubmitting}
                />
              </section>

              {/* CATEGORY */}
              <section className="product-field">
                <label htmlFor="pCategory">
                  Category
                </label>

                <div className="product-category-wrapper">
                  <select
                    name="pCategory"
                    id="pCategory"
                    className="product-category-select"
                    value={formData.pCategory}
                    disabled={
                      isSubmitting || isLoadingCategories
                    }
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        pCategory: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select Category</option>

                    {isLoadingCategories ? (
                      <option disabled>
                        Loading categories...
                      </option>
                    ) : categoriesError ? (
                      <option disabled>
                        Unable to load categories
                      </option>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <option
                          key={category.CategoryID}
                          value={category.cCode}
                        >
                          {category.cDescription}
                        </option>
                      ))
                    ) : (
                      <option disabled>
                        No categories found
                      </option>
                    )}
                  </select>

                  <ChevronDown
                    className="product-category-icon"
                    size={18}
                  />
                </div>

                {categoriesError && (
                  <p className="product-field-error">
                    {categoriesError instanceof Error
                      ? categoriesError.message
                      : "Unable to load categories."}
                  </p>
                )}
              </section>

              {/* INGREDIENTS */}
              <section className="product-field">
                <label htmlFor="pIngredients">
                  Product Ingredients 
                </label>

                <textarea
                  rows={4}
                  name="pIngredients"
                  id="pIngredients"
                  maxLength={500}
                  placeholder="e.g. Caramel syrup, vanilla syrup, milk"
                  value={formData.pIngredients}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pIngredients: e.target.value,
                    })
                  }
                  className="input-field"
                  disabled={isSubmitting}
                />

                <div className="product-character-count">
                  {formData.pIngredients.length}/500
                </div>
              </section>
            </div>
          </div>

          {/* PRICING AND AVAILABILITY */}
          <section className="product-modal-pricing-grid">

            <div className="product-field">
              <label htmlFor="pCost">
                Cost <span>*</span>
              </label>

              <div className="product-price-input">
                <span className="product-currency">₱</span>
                <input
                  type="number"
                  name="pCost"
                  id="pCost"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.pCost}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pCost: Number(e.target.value),
                    })
                  }
                  className="input-field"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="product-field">
              <label htmlFor="pPrice">
                Selling Price <span>*</span>
              </label>

              <div className="product-price-input">
                <span className="product-currency">₱</span>
                <input
                  type="number"
                  name="pPrice"
                  id="pPrice"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.pPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pPrice: Number(e.target.value),
                    })
                  }
                  className="input-field"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="product-availability-card">
              <span className="product-availability-label">
                Availability
              </span>

              <label className="product-switch">
                <input
                  id="pIsActive"
                  name="pIsActive"
                  type="checkbox"
                  value="true"
                  checked={formData.pIsActive}
                  disabled={isSubmitting}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pIsActive: e.target.checked,
                    })
                  }
                />

                <span className="product-switch-track" />
                <span className="product-switch-text">
                  {formData.pIsActive ? "Available" : "Unavailable"}
                </span>
              </label>

              <p>
                {formData.pIsActive
                  ? "Product can be sold."
                  : "Product is hidden from sales."}
              </p>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="product-modal-footer">
            <p className="product-modal-required-note">
              <span>*</span> Required fields
            </p>

            <div className="product-modal-footer-actions">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="product-modal-cancel"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="product-modal-submit"
              >
                {isSubmitting
                  ? "Saving..."
                  : product
                    ? "Update Product"
                    : "Create Product"}
              </button>
            </div>
          </footer>
        </div>
      </form>
    </div>
  </div>
);

};

export default ProductModal;