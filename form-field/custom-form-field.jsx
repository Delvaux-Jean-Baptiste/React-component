import { useId } from 'react';
import './custom-form-field.css';

export function CustomInput({
  value,
  onChange,
  label,
  helpText,
  errorMessage,
  isRequired = false,
  isDisabled = false,
  placeholder,
  id: externalId,
  ...rest
}) {
  const generatedId = useId();
  const inputId = externalId || generatedId;
  const helpTextId = `${inputId}-help`;
  const errorId = `${inputId}-error`;
  const hasError = Boolean(errorMessage);
  const describedBy = [helpText && helpTextId, hasError && errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div
      className={`custom-input ${isDisabled ? 'disabled' : ''} ${hasError ? 'has-error' : ''}`}
    >
      {label && (
        <label htmlFor={inputId} className='input-label'>
          {label}
          {isRequired && (
            <span className='required-star' aria-hidden='true'>
              *
            </span>
          )}
        </label>
      )}

      <input
        id={inputId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={isDisabled}
        aria-required={isRequired}
        aria-invalid={hasError}
        aria-describedby={describedBy}
        className={`input ${hasError ? 'input-error' : ''}`}
        {...rest}
      />

      {hasError && (
        <span id={errorId} className='input-error-text' role='alert'>
          {errorMessage}
        </span>
      )}

      {!hasError && helpText && (
        <span id={helpTextId} className='input-help-text'>
          {helpText}
        </span>
      )}
    </div>
  );
}
