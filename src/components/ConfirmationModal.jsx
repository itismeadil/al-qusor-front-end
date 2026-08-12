import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-noir/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-pearl rounded-2xl border border-mist shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-charcoal/50 hover:text-noir transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-8">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          
          <h2 className="font-display text-2xl text-noir text-center mb-3">
            {title || t("confirmDelete")}
          </h2>
          
          <p className="text-charcoal/70 text-center text-sm mb-8">
            {message || t("confirmDeleteProduct")}
          </p>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 text-sm font-medium text-charcoal hover:text-noir border border-mist rounded-xl px-6 py-3 hover:border-champagne/50 transition-all duration-300"
            >
              {t("cancel")}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-600 text-pearl text-sm font-medium rounded-xl px-6 py-3 hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t("delete")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;