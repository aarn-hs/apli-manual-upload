import { useFormContext } from "react-hook-form";
import { CustomInput } from "@/components/ui/custom-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { dependentRelations } from "@/lib/data";

interface DependentFormProps {
  index: number;
  onRemove: () => void;
  isRemovable: boolean;
}

export function DependentForm({ index, onRemove, isRemovable }: DependentFormProps) {
  const { control } = useFormContext();
  
  return (
    <div className="dependent-form border border-grey p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name={`dependents.${index}.firstName`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="body-text">Nombre(s) Dependiente</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  placeholder="Nombre(s)"
                  className="form-control"
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name={`dependents.${index}.lastName`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="body-text">Primer Apellido Dependiente</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  placeholder="Apellido"
                  className="form-control"
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name={`dependents.${index}.relation`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="body-text">Relación con dependiente</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="form-control">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {dependentRelations.map((relation) => (
                    <SelectItem key={relation} value={relation}>
                      {relation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name={`dependents.${index}.birthDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="body-text">Fecha de nacimiento del dependiente</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  type="date"
                  className="form-control"
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />
        
        <div className="flex items-center space-x-8 mt-4 md:col-span-2">
          <FormField
            control={control}
            name={`dependents.${index}.isBeneficiary`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="form-control h-5 w-5"
                  />
                </FormControl>
                <FormLabel className="body-text cursor-pointer">Es beneficiario</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name={`dependents.${index}.isStudent`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="form-control h-5 w-5"
                  />
                </FormControl>
                <FormLabel className="body-text cursor-pointer">Es estudiante</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name={`dependents.${index}.livesWithAssociate`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="form-control h-5 w-5"
                  />
                </FormControl>
                <FormLabel className="body-text cursor-pointer">Vive con el asociado</FormLabel>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {isRemovable && (
        <div className="mt-4 flex justify-end">
          <button 
            type="button" 
            className="btn-tertiary"
            onClick={onRemove}
          >
            Eliminar dependiente
          </button>
        </div>
      )}
    </div>
  );
}
