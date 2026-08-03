/**
 * Form errors object that maps field names to error messages or nested form errors.
 */
export interface FormError {
  [field: string]: string | FormError;
}
