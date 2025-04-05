'use client';

import { useEffect } from 'react';

const VisualEditorInitializer = () => {
  useEffect(() => {
    // Ensure the global object from the Visual Editor library is available
    if (window && (window as any).DirectusVisualEditor) {
      (window as any).DirectusVisualEditor.init({
        // Set your Directus instance URL (make sure NEXT_PUBLIC_DIRECTUS_URL is set in your env)
        directusUrl: process.env.NEXT_PUBLIC_DIRECTUS_URL,
        // Selector for editable elements
        editableSelector: '[data-directus-editable]',
        // You can add further configuration here per the library docs
      });
    }
  }, []);

  return null;
};

export default VisualEditorInitializer;
