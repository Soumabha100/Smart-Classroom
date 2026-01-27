import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Save } from "lucide-react";

const EditClassModal = ({ isOpen, onClose, onSave, classData }) => {
  const [formData, setFormData] = useState({ name: "", subject: "" });

  useEffect(() => {
    // When the modal opens, pre-fill the form with the existing class data
    if (classData) {
      setFormData({
        name: classData.name || "",
        subject: classData.subject || "",
      });
    }
  }, [classData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(classData._id, formData); // Pass the class ID and the updated data
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={onClose}
      >
        {/* The Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        {/* The Modal Container */}
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {/* ✅ FIX: Use Dialog.Panel instead of DialogPanel */}
              <Dialog.Panel
                as="form"
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-xl bg-white dark:bg-slate-800 p-6 shadow-xl"
              >
                {/* ✅ FIX: Use Dialog.Title instead of DialogTitle */}
                <Dialog.Title
                  as="h3"
                  className="text-lg font-bold text-slate-900 dark:text-white"
                >
                  Edit Class
                </Dialog.Title>
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-3 right-3 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="mt-4 space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Class Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="mt-1 w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditClassModal;
