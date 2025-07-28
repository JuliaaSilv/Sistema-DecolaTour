import React, { useState } from 'react';
import { X } from 'lucide-react';
import TravelerForm from './TravelerForm';
import PaymentStep from './PaymentStep';
import ConfirmationStep from './ConfirmationStep';

const BookingModal = ({ isOpen, onClose, pacote }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [travelerData, setTravelerData] = useState({});
  const [paymentData, setPaymentData] = useState({});

  if (!isOpen) return null;

  const steps = [
    { number: 1, title: 'Dados do Viajante', component: 'traveler' },
    { number: 2, title: 'Pagamento', component: 'payment' },
    { number: 3, title: 'Confirmação', component: 'confirmation' }
  ];

  const handleNext = (data) => {
    if (currentStep === 1) {
      setTravelerData(data);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setPaymentData(data);
      setCurrentStep(3);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setTravelerData({});
    setPaymentData({});
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <TravelerForm 
            onNext={handleNext}
            onCancel={handleClose}
            pacote={pacote}
            initialData={travelerData}
          />
        );
      case 2:
        return (
          <PaymentStep 
            onNext={handleNext}
            onBack={handlePrevious}
            pacote={pacote}
            travelerData={travelerData}
            initialData={paymentData}
          />
        );
      case 3:
        return (
          <ConfirmationStep 
            onClose={handleClose}
            pacote={pacote}
            travelerData={travelerData}
            paymentData={paymentData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#F28C38] text-white p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
          
          <h2 className="text-2xl font-bold mb-4">Finalizar Reserva</h2>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between max-w-md">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold text-sm
                  ${currentStep >= step.number 
                    ? 'bg-white text-[#F28C38] border-white' 
                    : 'bg-transparent text-white border-white border-opacity-50'
                  }
                `}>
                  {step.number}
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:inline">
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`
                    ml-4 w-8 h-0.5 
                    ${currentStep > step.number ? 'bg-white' : 'bg-white bg-opacity-30'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
