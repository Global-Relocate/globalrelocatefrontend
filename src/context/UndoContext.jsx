import { createContext, useContext } from 'react';
import { toast } from 'sonner';
import { FaRedoAlt } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
import PropTypes from 'prop-types';

const UndoContext = createContext();

export const UndoProvider = ({ children }) => {
  const showUndoToast = ({ 
    message, 
    onUndo, 
    type = 'default',
    duration = 5000 
  }) => {
    if (type === 'feedback') {
      toast(
        <div className="flex items-center gap-2">
          <IoCheckmarkCircle className="text-[#22C55E]" size={20} />
          <span className="text-[#22C55E]">Thanks. Your feedback helps us improve your notifications.</span>
        </div>,
        {
          action: {
            label: (
              <div className="flex items-center gap-2">
                <span>Undo</span>
                <FaRedoAlt className="transition-transform duration-200 group-hover:rotate-180" size={14} />
              </div>
            ),
            onClick: onUndo
          },
          duration,
          className: 'group',
          closeButton: true,
          dismissible: true
        }
      );
    } else {
      toast(message, {
        action: {
          label: (
            <div className="flex items-center gap-2">
              <span>Undo</span>
              <FaRedoAlt className="transition-transform duration-200 group-hover:rotate-180" size={14} />
            </div>
          ),
          onClick: onUndo
        },
        duration,
        className: 'group',
        closeButton: true,
        dismissible: true
      });
    }
  };

  return (
    <UndoContext.Provider value={{ showUndoToast }}>
      {children}
    </UndoContext.Provider>
  );
};

UndoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUndo = () => useContext(UndoContext); 