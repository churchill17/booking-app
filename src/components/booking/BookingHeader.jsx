import React from "react";
import { useNavigate } from "react-router-dom";
import "./BookingHeader.css";

const BookingHeader = ({ steps, currentStep }) => {
  const navigate = useNavigate();
  return (
    <header className="booking-header">
      <div className="booking-header__logo">
        <span className="logo-text">iBookNova</span>
        <button className="booking-header__home-btn" onClick={() => navigate("/")}>
          🏠 Home
        </button>
      </div>
      <nav className="booking-steps">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          return (
            <React.Fragment key={step}>
              <div
                className={`step ${isCompleted ? "step--done" : ""} ${
                  isActive ? "step--active" : ""
                }`}
              >
                <div className="step__circle">
                  {isCompleted ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M2 7L5.5 10.5L12 3.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                <span className="step__label">{step}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`step__connector ${
                    isCompleted ? "step__connector--done" : ""
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </header>
  );
};

export default BookingHeader;
