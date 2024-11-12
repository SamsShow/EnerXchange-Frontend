import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Dialog = ({ open, onOpenChange, children }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Dialog */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          
          {children}
        </div>
      </div>
    </div>
  );
};

const DialogContent = ({ children, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      {children}
    </div>
  );
};

const DialogHeader = ({ children, className = "" }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
};

const DialogTitle = ({ children, className = "" }) => {
  return (
    <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h2>
  );
};

export { Dialog, DialogContent, DialogHeader, DialogTitle };

export default Dialog;