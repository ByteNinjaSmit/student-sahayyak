"use client";
import React, { useState, useEffect } from "react";
import {
  FaWifi,
  FaUtensils,
  FaBroom,
  FaExclamationCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { relative } from "path";
// Define the interface for the form data
interface FormData {
  room: string[];
  corridor: string[];
  commonarea: string[];
  foodquality: string[];
  wifiissues: string[];
  drinkingwater: string[];
  security: string[];
  foodowner: string[];
  cleanlinessOther: string;
  foodQualityOther: string;
  wifiIssuesOther: string;
  otherConcernsOther: string;
  foodownerName: string;
  foodServiceType: string;
}

const GrievanceForm: React.FC = () => {
  const router = useRouter();
  const params = useParams<{
    user: string;
    categories: string;
    issue: string;
  }>();
  console.log(params);

  useEffect(() => {
    // Check if
    if (
      params.issue !== "room" &&
      params.issue !== "corridor" &&
      params.issue !== "commonarea" &&
      params.issue !== "foodquality" &&
      params.issue !== "wifiissues" &&
      params.issue !== "drinkingwater" &&
      params.issue !== "security" &&
      params.issue !== "foodowner"
    ) {
      // Redirect to dashboard if the issue does not match
      router.push(`/${params.user}/dashboard`);
    }
  }, [params.issue, params.user, router]);

  const [formData, setFormData] = useState<FormData>({
    room: [],
    corridor: [],
    commonarea: [],
    foodquality: [],
    wifiissues: [],
    drinkingwater: [],
    security: [],
    foodowner: [],
    cleanlinessOther: "",
    foodQualityOther: "",
    wifiIssuesOther: "",
    otherConcernsOther: "",
    foodownerName: "",
    foodServiceType: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleCheckboxChange = (section: keyof FormData, option: string) => {
    setFormData((prevState) => {
      const isOptionSelected = prevState[section].includes(option);
      const selectedCount = prevState[section].length;

      // Allow selection only if less than 2 options are currently selected
      if (!isOptionSelected && selectedCount >= 2) {
        return prevState; // Do not update state if limit is reached
      }

      return {
        ...prevState,
        [section]: isOptionSelected
          ? prevState[section].filter((item) => item !== option)
          : [...prevState[section], option],
      };
    });
  };
  const handleOtherInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: keyof FormData
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [`${section}Other`]: e.target.value,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormData
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const sectionKey = params.issue as keyof FormData;

    // Ensure the relevant data key exists in the formData
    if (!(sectionKey in formData)) {
      console.error(`Invalid section key: ${sectionKey}`);
      setIsSubmitting(false);
      return; // Exit if the key is not valid
    }

    const otherInputValue = formData[`${sectionKey}Other`];
    const relevantData = [...(formData[sectionKey] || [])]; // Use empty array if undefined

    // Include the relevant other input if not already present
    if (otherInputValue && !relevantData.includes(otherInputValue)) {
      relevantData.push(otherInputValue);
    }

    // Include Other Concerns in relevant data if not already present
    const otherConcernsValue = formData.otherConcernsOther;
    if (otherConcernsValue && !relevantData.includes(otherConcernsValue)) {
      relevantData.push(otherConcernsValue);
    }
    console.log(`other concern ${relevantData}`);
    
    if (relevantData.every(item => item.length < 2)) {
      toast.error("Select complaint");
    }
    else {
      if (sectionKey === params.issue) {
        try {
          const response = await fetch(
            `/api/issues/${params.user}/${params.issue}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                relevantData,
                ...(params.issue === "foodquality" || params.issue === "foodowner" ? {
                  foodownerName: formData.foodownerName,
                  foodServiceType: formData.foodServiceType,
                } : {})
              })
            }
          );

          const data = await response.json(); // Capture the response data

          if (!response.ok) {
            // Handle error messages returned from the server
            toast.error(data.error || "Grievances Raise Failed"); // Display specific error message from backend
            return; // Exit if there's an error
          }

          // Success case: Show success message
          toast.success(data.msg); // Use the success message from the response

          // Only navigate if the response is successful
          if (response.status === 200) {
            if (data.msg) {
              router.push(`/client/${params.user}/dashboard`); // Redirect only on success
            }
            else {
              toast.error(data.error || "Grievances Raise Failed");
            }

          }

        } catch (error) {
          console.error("Error Grievances Raise Failed details:", error);
          toast.error("Grievances Raise Failed");
        }



      }
    }


    console.log(`Relevant Data: ${relevantData}`);
    console.log(`Food Owner Name: ${formData.foodownerName}`);
    console.log(`Food Service Type: ${formData.foodServiceType}`);

    // Ideally, submit the data to your API here
    // await submitData(relevantData);

    setIsSubmitting(false);

    // Reset form data
    setFormData({
      room: [],
      corridor: [],
      commonarea: [],
      foodquality: [],
      wifiissues: [],
      drinkingwater: [],
      security: [],
      foodowner: [], // Reset foodowner array
      cleanlinessOther: "",
      foodQualityOther: "",
      wifiIssuesOther: "",
      otherConcernsOther: "",
      foodownerName: "",
      foodServiceType: "",
    });
  };

  const formSections = [
    {
      title: "Room",
      icon: <FaBroom />,
      options: [
        "Broken cupboard",
        "Broken window",
        "Broken door",
        "Improper electricity issue",
        "Electricity issue",
        "Fan is not working",
        "Light is not working",
        "Teared Mosquito window",
      ],
      stateKey: "room" as keyof FormData,
    },
    {
      title: "Corridor",
      icon: <FaBroom />,
      options: [
        "Uncleaned corridor",
        "Inadequate lights",
        "Garbaged corridor",
        "Dirty/Damaged walls",
        "Broken tiles",
        "Ceiling leakage",
        "Overflowing trash bins",
      ],
      stateKey: "corridor" as keyof FormData,
    },
    {
      title: "Drinking Water",
      icon: <FaBroom />,
      options: ["Unclean Water", "Water Smelling", "Unsafe"],
      stateKey: "drinkingwater" as keyof FormData,
    },
    {
      title: "Common Area (Bathrooms and toilets)",
      icon: <FaBroom />,
      options: [
        "Dirty & unclean toilets",
        "Choked toilet",
        "Broken taps",
        "No lights",
        "Clogged bathrooms",
        "Pipes leakage",
        "Dirty bathrooms",
        "Broken windows and nets",
        "Improper drainage",
        "Dirty smells",
        "Ceiling leakages",
        "Damaged tiles",
        "Low water pressure",
      ],
      stateKey: "commonarea" as keyof FormData,
    },
    {
      title: "Food Quality",
      icon: <FaUtensils />,
      options: [
        "Unhygienic",
        "Limited quantity",
        "Dirty tiffins / plates",
        "Bad quality",
        "Late food delivery",
        "Insect found in food",
      ],
      options1: ["Tiffin", "Mess"],
      stateKey: "foodquality" as keyof FormData,
    },
    {
      title: "Wi-Fi Issues",
      icon: <FaWifi />,
      options: [
        "Slow connection",
        "Frequent disconnections",
        "Limited coverage",
        "Authentication problems",
        "Not connecting",
      ],
      stateKey: "wifiissues" as keyof FormData,
    },
    {
      title: "Safety & Disturbance",
      icon: <FaExclamationCircle />,
      options: [
        "Noisy environment",
        "Raging",
        "Bullying incident",
        "Unresolved behavioral issue",
        "Disturbance caused by students",
        "Inappropriate conduct by hostel staff",
        "Mosquito issue",
      ],
      stateKey: "security" as keyof FormData,
    },
    {
      title: "Food Owner",
      icon: <FaUtensils />,
      options: ["Tiffin", "Mess"],
      stateKey: "foodowner" as keyof FormData,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
            Hostel Grievance Form
          </h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            {formSections
              .filter((section) => section.stateKey === params.issue)
              .map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 px-4 py-5 sm:p-6 rounded-lg shadow-md"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    {section.icon}
                    <span className="ml-2">{section.title}</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {(section.options && section.stateKey !== "foodowner") ||
                      section.stateKey === "foodquality" ? (
                      <>
                        {section.options.map((option) => (
                          <div key={option} className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id={`${section.stateKey}-${option}`}
                                name={`${section.stateKey}-${option}`}
                                type="checkbox"
                                checked={formData[section.stateKey].includes(option)}
                                onChange={() => handleCheckboxChange(section.stateKey, option)}
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label
                                htmlFor={`${section.stateKey}-${option}`}
                                className="font-medium text-gray-700"
                              >
                                {option}
                              </label>
                            </div>
                          </div>
                        ))}

                        {/* Show the foodownerName input when stateKey is "foodquality" */}
                        {section.stateKey === "foodquality" && (
                          <div className="mt-4">
                            <label
                              htmlFor="foodownerName"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Name of Food Owner
                            </label>
                            <input
                              type="text"
                              id="foodownerName"
                              value={formData.foodownerName}
                              onChange={(e) =>
                                handleInputChange(e, "foodownerName")
                              }
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              required
                            />
                          </div>
                        )}
                      </>
                    ) : (
                      <div>
                        <label
                          htmlFor="foodownerName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Name of Food Owner
                        </label>
                        <input
                          type="text"
                          id="foodownerName"
                          value={formData.foodownerName}
                          onChange={(e) =>
                            handleInputChange(e, "foodownerName")
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    )}

                    {(section.stateKey === "foodowner" ||
                      section.stateKey === "foodquality") && (
                        <div>
                          <label
                            htmlFor="foodServiceType"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Food Service Type
                          </label>
                          <select
                            id="foodServiceType"
                            value={formData.foodServiceType}
                            onChange={(e) =>
                              handleInputChange(e, "foodServiceType")
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                          >
                            <option value="">Select Type</option>
                            {/* Render options1 if stateKey is foodquality, otherwise render section.options */}
                            {section.stateKey === "foodquality"
                              ? section.options1.map((options1) => (
                                <option key={options1} value={options1}>
                                  {options1}
                                </option>
                              ))
                              : section.options.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                          </select>
                        </div>
                      )}
                  </div>
                </motion.div>
              ))}

            {/* Other Concerns */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: formSections.length * 0.1 }}
              className="bg-gray-50 px-4 py-5 sm:p-6 rounded-lg shadow-md"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Other Concerns
              </h3>
              <textarea
                id="otherConcerns"
                value={formData.otherConcernsOther}
                onChange={(e) => handleOtherInputChange(e, "otherConcerns")}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </motion.div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GrievanceForm;
