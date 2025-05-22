import { useFormContext } from "react-hook-form";
import { CustomInput } from "@/components/ui/custom-input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export default function LegalInfo() {
  const { control } = useFormContext();
  
  return (
    <section id="legal-info" className="bg-white p-6 shadow-md">
      <h2 className="important section-title">Información Legal</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField
            control={control}
            name="curp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">CURP</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="18 caracteres"
                    className="form-control"
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="rfc"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">RFC</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="13 caracteres"
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
            name="nss"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">NSS</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="10-11 dígitos"
                    className="form-control"
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="clabe"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text">CLABE</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="18 dígitos"
                    className="form-control"
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="fiscalPostalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text">Código postal fiscal</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="5 dígitos"
                    className="form-control"
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>
      </div>
    </section>
  );
}