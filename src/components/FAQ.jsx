import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I vote?",
      answer: "Sign in with your registered email and password, navigate to the Voting section, select a position, choose your preferred candidate, and submit your vote. Repeat for all positions."
    },
    {
      question: "Can I change my vote after submitting?",
      answer: "No, votes are final once submitted. Please review your selections carefully before submitting."
    },
    {
      question: "When will the results be available?",
      answer: "Results will be available 30 minutes after the election period ends. You can view them in the Results section."
    },
    {
      question: "What if I forget my password?",
      answer: "Contact the election administrator at peternyagaka5@gmail.com or call 0117067894 for password assistance."
    },
    {
      question: "Can I vote for multiple candidates in one position?",
      answer: "No, you can only select one candidate per position. The system will only record your most recent selection for each position."
    },
    {
      question: "Is my vote anonymous?",
      answer: "Yes, the system is designed to protect voter anonymity. Your individual voting choices are not linked to your identity in the results."
    },
    {
      question: "What happens if the election period ends while I'm voting?",
      answer: "You must complete and submit your vote before the election period ends. Any unsubmitted votes will be lost."
    },
    {
      question: "How are the winners determined?",
      answer: "The candidate with the most votes in each position wins. In case of a tie, the election administrator will follow the established tie-breaking procedure."
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Frequently Asked Questions</h2>
          
          <div className="accordion" id="faqAccordion">
            {faqs.map((faq, index) => (
              <div key={index} className="accordion-item">
                <h3 className="accordion-header">
                  <button
                    className={`accordion-button ${openIndex === index ? '' : 'collapsed'}`}
                    type="button"
                    onClick={() => toggleAccordion(index)}
                  >
                    {faq.question}
                  </button>
                </h3>
                <div
                  className={`accordion-collapse collapse ${openIndex === index ? 'show' : ''}`}
                >
                  <div className="accordion-body">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="alert alert-info alert-custom mt-4">
            <h5>Still need help?</h5>
            <p className="mb-0">
              Contact our support team at <strong>peternyagaka5@gmail.com</strong> or call <strong>0117067894</strong> for immediate assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;