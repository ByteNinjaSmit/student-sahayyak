"use client";
import React, { useState } from "react";
import { FaWifi, FaUtensils, FaBroom, FaExclamationCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const GrievanceForm = () => {
  const [formData, setFormData] = useState({
    room: [],
    corridor:[],
    commonarea: [],
    foodQuality: [],
    wifiIssues: [],
    security: [],
    cleanlinessOther: "",
    foodQualityOther: "",
    wifiIssuesOther: "",
    otherConcernsOther: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckboxChange = (section, option) => {
    setFormData(prevState => ({
      ...prevState,
      [section]: prevState[section].includes(option)
        ? prevState[section].filter(item => item !== option)
        : [...prevState[section], option]
    }));
  };

  const handleOtherInputChange = (e, section) => {
    setFormData(prevState => ({
      ...prevState,
      [`${section}Other`]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(formData);
    setIsSubmitting(false);
    // Reset form after submission
    setFormData({
      room: [],
      corridor:[],
      commonarea:[],
      foodQuality: [],
      wifiIssues: [],
      security: [],
      cleanlinessOther: "",
      foodQualityOther: "",
      wifiIssuesOther: "",
      otherConcernsOther: ""
    });
  };

  const formSections = [
    {
      title: "Room",
      icon: <FaBroom />,
      options: ["Broken cupboard","Broken window", "Broken door","Improper electricity issue", "Electricity issue", "Fan is not working","Light is not working","Teared Mosquito window"],
      stateKey: "room"
    },
    {
      title: "Corridor",
      icon: <FaBroom />,
      options: ["Uncleaned corridor","Inadequate lights","Garbaged corridor","Dirty/Damaged walls","broken tiles","Ceiling leakage","Overflowing trash bins"],
      stateKey: "corridor"
    },
    {
        title: "Common Area(Bathrooms and toilets)",
        icon: <FaBroom />,
        options: ["Dirty & unclean toilets","Choked toilet","Broken taps", "No lights ", "Clogged bathrooms", "Pipes leakage","Dirty bathrooms","Broken windows and nets","Improper drainage","Dirty smells","Celling leakages","Damaged tiles","Low water pressure"],
        stateKey: "commonarea"
      },
    {
      title: "Food Quality",
      icon: <FaUtensils />,
      options: ["Unhygienic", "Limited quantity", "Dirty tiffins / plates","Bad quality","Late food delivery"],
      stateKey: "foodQuality"
    },
    {
      title: "Wi-Fi Issues",
      icon: <FaWifi />,
      options: ["Slow connection", "Frequent disconnections", "Limited coverage", "Authentication problems","Not connecting"],
      stateKey: "wifiIssues"
    },
    {
      title: "Safety & disturbance",
      icon: <FaExclamationCircle />,
      options: ["Noisy environment","Raging","Bullying incident","Unresolved behavioral issue", "disturbance caused by students", "Inappropriate conduct by hostel staff", "Mosquito issue"],
      stateKey: "security"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Hostel Grievance Form</h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            {formSections.map((section, index) => (
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
                  {section.options.map(option => (
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
                        <label htmlFor={`${section.stateKey}-${option}`} className="font-medium text-gray-700">
                          {option}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <label htmlFor={`${section.stateKey}-other`} className="block text-sm font-medium text-gray-700">
                    Other (please specify)
                  </label>
                  <input
                    type="text"
                    name={`${section.stateKey}-other`}
                    id={`${section.stateKey}-other`}
                    value={formData[`${section.stateKey}Other`]}
                    onChange={(e) => handleOtherInputChange(e, section.stateKey)}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </motion.div>
            ))}
            <div className="flex justify-center">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Grievance"
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GrievanceForm;