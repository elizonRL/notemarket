import { forwardRef } from 'react'

export const Input = forwardRef(({ type = 'text', placeholder, value, onChange, defaulvalue, className, ...res }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      defaultValue={defaulvalue}
      className={className}
      {...res}
    />
  )
})
