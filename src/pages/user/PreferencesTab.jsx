import React from 'react';
import { ChevronDown } from "lucide-react";

const PreferencesTab = () => (
  <div className="px-8 py-6">
    <h2 className="text-xl font-medium mb-8 text-left">Preferences</h2>
    
    <div>
      <h3 className="text-sm text-gray-600 mb-2">Language</h3>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">Choose a language</p>
        <div className="inline-flex items-center bg-gray-50 border rounded-lg px-4 py-2 cursor-pointer">
          <span className="text-sm mr-2">English</span>
          <ChevronDown className="h-4 w-4 text-gray-600" />
        </div>
      </div>
    </div>
  </div>
);

export default PreferencesTab;
