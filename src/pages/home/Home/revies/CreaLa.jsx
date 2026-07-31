import { useState } from 'react';

const faqData = [
  {
    question: "How does this posture corrector work?",
    answer:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day. Here's how it typically functions: A posture corrector works by providing support and gentle alignment to your shoulders.",
  },
  {
    question: "Is it suitable for all ages and body types?",
    answer:
      "Yes, it features adjustable straps designed to comfortably fit various body shapes and sizes for both adults and teenagers.",
  },
  {
    question: "Does it really help with back pain and posture improvement?",
    answer:
      "Yes, consistent use helps train your muscle memory, encouraging long-term posture correction and relieving back discomfort.",
  },
  {
    question: "Does it have smart features like vibration alerts?",
    answer:
      "Selected smart models come equipped with sensors that gently vibrate whenever you start slouching.",
  },
  {
    question: "How will I be notified when the product is back in stock?",
    answer:
      "You can enter your email address in the notify block on the product page, and we will send you an automated update once restocked.",
  },
];

const CreaLa = () => {
  // প্রথম Accordion টি খোলা রাখার জন্য initial state 0 দেওয়া হয়েছে
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-[#ebedf0] p-6 min-h-screen flex justify-center items-center">
      <div className="w-full max-w-3xl space-y-3">
        {faqData.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className={`rounded-xl transition-all duration-200 border ${
                isOpen
                  ? 'bg-[#e8f4f2] border-[#559892]'
                  : 'bg-white border-transparent shadow-sm'
              }`}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
              >
                <span className="font-bold text-[#143d3a] text-sm md:text-base">
                  {item.question}
                </span>
                <span className="ml-4 text-[#143d3a]">
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5">
                  <hr className="border-t border-[#cbe3e0] mb-4" />
                  <p className="text-[#3a5d59] text-sm leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CreaLa;