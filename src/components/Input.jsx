import { forwardRef } from 'react'

/**
 * Input component - Wrapper around native input with forwardRef support
 */
export const Input = forwardRef(({
  type = 'text',
  placeholder,
  value,
  onChange,
  defaultValue,
  className,
  ...props
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      defaultValue={defaultValue}
      className={className}
      {...props}
    />
  )
})

Input.displayName = 'Input'
