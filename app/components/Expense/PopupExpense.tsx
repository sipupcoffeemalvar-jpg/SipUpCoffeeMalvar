"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IExpense } from "../../lib/types/expense";
import React, { useEffect, useState } from "react";
import { getUsers } from "../../actions/users";
import { createExpense, updateExpense } from "../../actions/expense";
import { ChevronDown } from "lucide-react";
//import { Users } from "lucide-react";
//import { flushAllTraces } from "next/dist/trace";

interface PopupexpenseProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: IExpense | null;
}

const Popupexpense = ({ isOpen, onClose, expense }: PopupexpenseProps) => {
  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasOtherValue, setHasOtherValue] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const [formData, setFormData] = useState({
    Ice: 0,
    Water: 0,
    Electricity: 0,
    Rent: 0,
    RawMats: 0,
    Others: 0,
    Salary1: 0,
    Salary2: 0,
    Others_Desc: "",
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const newFormData = expense
      ? {
          Ice: expense.Ice || 0,
          Water: expense.Water || 0,
          Electricity: expense.Electricity || 0,
          Rent: expense.Rent || 0,
          RawMats: expense.RawMats || 0,
          Others: expense.Others || 0,
          Salary1: expense.Salary1 || 0,
          Salary2: expense.Salary2 || 0,
          Others_Desc: expense.Others_Desc || "",
        }
      : {
          Ice: 0,
          Water: 0,
          Electricity: 0,
          Rent: 0,
          RawMats: 0,
          Others: 0,
          Salary1: 0,
          Salary2: 0,
          Others_Desc: "",
        };

    setFormData(newFormData);
    setError(null);
  }, [expense, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError(null);

    const form = new FormData(e.currentTarget);

    // if (!product && imageFile) {

    //   const uploadData = new FormData();
    //   uploadData.append("file", imageFile);

    //   const response = await fetch("/api/product-image", {

    const result = expense
      ? await updateExpense(expense.ExpenseID!, form)
      : await createExpense(form);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      onClose();
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setError(null);
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
                {expense ? "Edit Expenses" : "Create Expense"}
              </h3>
              <p className="hidden">
                {expense
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
        <form onSubmit={handleSubmit} className="product-modal-form">
          {error && (
            <div className="product-modal-error" role="alert">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="product-modal-content">
            {/* MAIN TWO-COLUMN LAYOUT */}
            <div className="grid  grid-cols-4 gap-4">
              <section className="product-field">
                <label htmlFor="Ice" className="font-bold">
                  Ice
                </label>

                <div className="product-price-input">
                  <span className="product-currency">₱</span>
                  <input
                    type="number"
                    name="Ice"
                    id="Ice"
                    placeholder="e.g. CM-001"
                    value={formData.Ice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        Ice: Number(e.target.value),
                      })
                    }
                    className="input-field"
                    disabled={isSubmitting}
                  />
                </div>
              </section>
              <section className="product-field">
                <label htmlFor="Water">Water</label>

                <div className="product-price-input">
                  <span className="product-currency">₱</span>
                  <input
                    type="text"
                    name="Water"
                    id="Water"
                    placeholder="e.g. Caramel Macchiato"
                    value={formData.Water}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        Water: Number(e.target.value),
                      })
                    }
                    className="input-field"
                    disabled={isSubmitting}
                  />
                </div>
              </section>
              <section className="product-field">
                <label htmlFor="Electricity">Electricity</label>

                <div className="product-price-input">
                  <span className="product-currency">₱</span>
                  <input
                    type="number"
                    name="Electricity"
                    id="Electricity"
                    maxLength={500}
                    placeholder="e.g. Caramel syrup, vanilla syrup, milk"
                    value={formData.Electricity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        Electricity: Number(e.target.value),
                      })
                    }
                    className="input-field"
                    disabled={isSubmitting}
                  />
                </div>
              </section>
              <section className="product-field">
                <label htmlFor="RawMats">RawMats</label>

                <div className="product-price-input">
                  <span className="product-currency">₱</span>
                  <input
                    type="number"
                    name="RawMats"
                    id="RawMats"
                    min="0"
                    step="0"
                    placeholder="₱"
                    value={formData.RawMats}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        RawMats: Number(e.target.value),
                      })
                    }
                    className="input-field"
                    disabled={isSubmitting}
                  />
                </div>
              </section>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <section className="product-field col-span-2">
                <section className="product-field">
                  <label htmlFor="Rent">Rent</label>

                  <div className="product-price-input">
                    <span className="product-currency">₱</span>
                    <input
                      type="number"
                      min="0"
                      step="0"
                      placeholder="₱"
                      name="Rent"
                      id="Rent"
                      value={formData.Rent}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          Rent: Number(e.target.value),
                        })
                      }
                      className="input-field"
                      disabled={isSubmitting}
                    />
                  </div>
                </section>
                <label htmlFor="Others" className="!pb-[0px] pt-[9px]">
                  Others
                </label>

                <div className="product-price-input">
                  <span className="product-currency">₱</span>
                  <input
                    type="number"
                    name="Others"
                    id="Others"
                    min="0"
                    step="0"
                    placeholder="₱"
                    value={formData.Others}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        Others: Number(e.target.value),
                      });
                      setHasOtherValue(
                        e.target.value !== "" && Number(e.target.value) > 0,
                      );
                    }}
                    className="input-field"
                    disabled={isSubmitting}
                  />
                </div>
              </section>
              <section className="product-field col-span-2">
                <label htmlFor="Others_Desc">Description</label>
                <textarea
                  rows={5}
                  name="Others_Desc"
                  id="Others_Desc"
                  maxLength={500}
                  placeholder="e.g."
                  value={formData.Others_Desc}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      Others_Desc: e.target.value,
                    })
                  }
                  className="input-field"
                  disabled={isSubmitting || !hasOtherValue}
                />
              </section>
            </div>
            {/* PRICING AND AVAILABILITY */}
            <section className="grid grid-cols-2 gap-4">
              <div className="product-field">
                <label htmlFor="Salary1">Employee 1</label>

                <div className="product-price-input">
                  <span className="product-currency">₱</span>
                  <input
                    type="number"
                    min="0"
                    step="0"
                    placeholder="₱"
                    name="Salary1"
                    id="Salary1"
                    value={formData.Salary1}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        Salary1: Number(e.target.value),
                      })
                    }
                    className="input-field"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="product-field">
                <label htmlFor="Salary2">Employee 2</label>

                <div className="product-price-input">
                  <span className="product-currency">₱</span>
                  <input
                    type="number"
                    min="0"
                    step="0"
                    placeholder="₱"
                    name="Salary2"
                    id="Salary2"
                    value={formData.Salary2}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        Salary2: Number(e.target.value),
                      })
                    }
                    className="input-field"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </section>

            {/* FOOTER */}
            <footer className="product-modal-footer">
              <p className="product-modal-required-note">
                <span></span>
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
                    : expense
                      ? "Update Expense"
                      : "Create Expense"}
                </button>
              </div>
            </footer>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Popupexpense;
