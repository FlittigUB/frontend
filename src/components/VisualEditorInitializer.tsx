'use client';

import { useEffect } from 'react';
import { apply } from '@directus/visual-editing';

const VisualEditorInitializer = () => {
  useEffect(() => {
    // Select all elements with the data-directus-editable attribute
    const editableElements = Array.from(
      document.querySelectorAll('[data-directus-editable]'),
    ) as HTMLElement[];

    apply({
      directusUrl:
        process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8000',
      elements: editableElements,
      // Additional options (e.g. customClass, onSaved) can be added here
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
