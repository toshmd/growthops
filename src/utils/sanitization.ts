import DOMPurify from 'dompurify';

export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: [], // Strip all HTML tags
    ALLOWED_ATTR: [], // Strip all attributes
  });
};

export const validateInput = (input: string, maxLength: number = 1000): string | null => {
  if (!input || input.trim().length === 0) {
    return 'This field cannot be empty';
  }
  if (input.length > maxLength) {
    return `Input exceeds maximum length of ${maxLength} characters`;
  }
  return null;
};