'use client';

import { useEffect } from 'react';
import { apply } from '@directus/visual-editing';

const VisualEditorInitializer = () => {
  useEffect(() => {
    // Initialize the Directus Visual Editing on the editable elements.
    // Ensure NEXT_PUBLIC_DIRECTUS_URL is set in your environment variables.
    apply({
      directusUrl:
        process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8000',
      editableSelector: '[data-directus-editable]',
      // You can add additional options here (customClass, onSaved, etc.)
    })
      .then(() => {
        console.log('Directus Visual Editing applied.');
      })
      .catch((err) => {
        console.error('Error applying Directus Visual Editing:', err);
      });
  }, []);

  return null;
};

export default VisualEditorInitializer;
