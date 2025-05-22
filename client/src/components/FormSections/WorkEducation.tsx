import { useFormContext } from "react-hook-form";
import { CustomInput } from "@/components/ui/custom-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { educationLevels, yesNoOptions, motivations } from "@/lib/data";

export default function WorkEducation() {
  const { control } = useFormContext();
  
  return (
    <section id="work-education" className="bg-white p-6 shadow-md">
      <h2 className="important section-title">Información laboral y educativa</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField
            control={control}
            name="education"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">Escolaridad</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="form-control">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {educationLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
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
            name="previousCompany"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">Compañía Experiencia Previa</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="Compañía donde trabajó anteriormente"
                    className="form-control"
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="previousPosition"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">Puesto Experiencia Previa</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="Puesto que ocupó anteriormente"
                    className="form-control"
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <FormField
            control={control}
            name="previousTasks"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">Tareas Experiencia Previa</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describa sus responsabilidades anteriores"
                    className="form-control"
                    rows={3}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="retailExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">Experiencia en retail</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="form-control">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {yesNoOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
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
            name="motivation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">Motivación al elegir trabajo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="form-control">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {motivations.map((motivation) => (
                      <SelectItem key={motivation} value={motivation}>
                        {motivation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>
      </div>
    </section>
  );
}