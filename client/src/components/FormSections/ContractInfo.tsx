import { useFormContext } from "react-hook-form";
import { CustomInput } from "@/components/ui/custom-input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export default function ContractInfo() {
  const { control } = useFormContext();
  
  return (
    <section id="contract-info" className="bg-white p-6 shadow-md">
      <h2 className="important section-title">Información de Contrato</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="contractStartDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="body-text required">Fecha de inicio de contrato</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  type="date"
                  className="form-control"
                />
              </FormControl>
              <FormMessage className="error-message" />
              <p className="small-text text-dark-grey">No se permiten fines de semana, ni días festivos. Máximo 5 días hábiles en el futuro.</p>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="contractEndDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="body-text">Fecha de fin de contrato (Solo eventual o maternidad)</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  type="date"
                  className="form-control"
                />
              </FormControl>
              <FormMessage className="error-message" />
              <p className="small-text text-dark-grey">Debe ser posterior a la fecha de inicio.</p>
            </FormItem>
          )}
        />
      </div>
    </section>
  );
}
