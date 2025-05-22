import { useFieldArray, useFormContext } from "react-hook-form";
import { DependentForm } from "@/components/ui/dependent-form";

export default function DependentsInfo() {
  const { control } = useFormContext();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "dependents",
  });
  
  const addDependent = () => {
    append({
      firstName: "",
      lastName: "",
      relation: "",
      birthDate: "",
      isBeneficiary: false,
      isStudent: false,
      livesWithAssociate: false
    });
  };
  
  return (
    <section id="dependents-info" className="bg-white p-6 shadow-md">
      <h2 className="important section-title">Dependientes</h2>
      <p className="body-text mb-4">Información opcional sobre dependientes del candidato</p>
      
      <div id="dependent-container">
        {fields.map((field, index) => (
          <DependentForm 
            key={field.id} 
            index={index} 
            onRemove={() => remove(index)} 
            isRemovable={fields.length > 1}
          />
        ))}
      </div>
      
      <div className="flex justify-center mt-6">
        <button 
          type="button" 
          className="btn-secondary flex items-center" 
          onClick={addDependent}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Agregar dependiente
        </button>
      </div>
    </section>
  );
}