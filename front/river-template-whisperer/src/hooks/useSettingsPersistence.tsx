
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

export const useSettingsPersistence = <T extends Record<string, any>>(
  form: UseFormReturn<T>,
  settingsKey: string
) => {
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(settingsKey);
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        // Use setTimeout to ensure form is ready
        setTimeout(() => {
          form.reset(parsedSettings);
        }, 0);
      } catch (error) {
        console.error('Failed to load saved settings:', error);
      }
    }
  }, [form, settingsKey]);

  // Save settings to localStorage when form values change
  const saveSettings = (data: T) => {
    try {
      localStorage.setItem(settingsKey, JSON.stringify(data));
      console.log(`Settings saved to localStorage: ${settingsKey}`);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return { saveSettings };
};
