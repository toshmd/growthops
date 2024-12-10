import DOMPurify from 'dompurify';

export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // First, trim and sanitize HTML
  const sanitized = DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: [], // Strip all HTML tags
    ALLOWED_ATTR: [], // Strip all attributes
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    SANITIZE_DOM: true,
  });

  // Additional sanitization for common XSS patterns
  return sanitized
    .replace(/[<>]/g, '') // Remove any remaining angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, ''); // Remove vbscript: protocol
};

export const validateInput = (input: string, maxLength: number = 1000): string | null => {
  if (!input || input.trim().length === 0) {
    return 'This field cannot be empty';
  }
  
  if (input.length > maxLength) {
    return `Input exceeds maximum length of ${maxLength} characters`;
  }

  // Check for potentially dangerous patterns
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(input)) {
      return 'Input contains potentially unsafe content';
    }
  }

  return null;
};

// New utility function for sanitizing objects
export const sanitizeObject = <T extends Record<string, any>>(obj: T): T => {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized as T;
};