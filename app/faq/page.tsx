"use client";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const FAQ: React.FC = () => {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  // Define the type for FAQ items
  type FAQItem = {
    question: string;
    answer: string;
  };

  const faqs: FAQItem[] = [
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all our products. If you're not satisfied with your purchase, you can return it for a full refund within 30 days of delivery."
    },
    {
      question: "How long does shipping take?",
      answer: "Shipping times vary depending on your location. Typically, domestic orders are delivered within 3-5 business days, while international orders may take 7-14 business days."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we offer international shipping to most countries. Shipping costs and delivery times may vary depending on the destination."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is shipped, you will receive a tracking number via email. You can use this number to track your package on our website or the carrier's website."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay."
    },
    {
      question: "Do you provide customer support?",
      answer: "Yes, our customer support team is available via email and live chat to assist you with any questions or issues."
    },
    {
      question: "Can I change my order after it has been placed?",
      answer: "If you need to make changes to your order, please contact us within 24 hours of placing it. After this period, we may not be able to accommodate your request."
    },
    {
      question: "What should I do if my item is defective?",
      answer: "If you receive a defective item, please contact our customer support team within 7 days of receiving your order, and we will assist you in resolving the issue."
    },
    {
      question: "How do I unsubscribe from your newsletter?",
      answer: "You can unsubscribe from our newsletter at any time by clicking the 'unsubscribe' link at the bottom of any newsletter email."
    },
    {
      question: "Do you have a loyalty program?",
      answer: "Yes! We offer a loyalty program that rewards you with points for every purchase, which can be redeemed for discounts on future orders."
    }
  ];

  const toggleQuestion = (index: number) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Frequently Asked Questions
        </h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl bg-white"
            >
              <button
                className="w-full text-left p-5 focus:outline-none flex justify-between items-center"
                onClick={() => toggleQuestion(index)}
              >
                <h3 className="text-xl font-semibold text-gray-800">{faq.question}</h3>
                {activeQuestion === index ? (
                  <FaChevronUp className="text-blue-600 ml-2 flex-shrink-0 transition-transform transform rotate-180" />
                ) : (
                  <FaChevronDown className="text-blue-600 ml-2 flex-shrink-0 transition-transform" />
                )}
              </button>
              {activeQuestion === index && (
                <div className="p-4 bg-gray-50 rounded-b-lg">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
