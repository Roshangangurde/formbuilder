function FormField({ name, type, placeholder,value,onChange, label }) {
  return <>
   <input id={name} value={value} onChange={onChange} name={name} type={type} placeholder={placeholder} />
   {label ? <label htmlFor="name">{label}</label> : null}
   </>
}

export default function Forms({ formField, onSubmit, error, errorMessage }) {
  return (
      <form onSubmit={onSubmit}>
          {formField.map((field, index) => (
             <div key={index} >
                  <FormField
                      value={field.value}
                      name={field.name}
                      type={field.type}
                      label={field?.label}
                      placeholder={field?.placeholder}
                      onChange={field.onChange}
                      
                  />
                  {error[field.name] ?
                    <p>{errorMessage[field.name].message}  </p> :null
                  }
                  
                  </div>
          ))}
          <button type="submit">Submit</button>
      </form>
  );
}
