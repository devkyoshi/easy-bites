
import { UseFormReturn } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package } from "lucide-react";

interface ContentCategory {
  id: string;
  name: string;
}

interface PackageDimensionsProps {
  form: UseFormReturn<any>;
  contentCategories: ContentCategory[];
}

export function PackageDimensions({ form, contentCategories }: PackageDimensionsProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <Package className="mr-2 h-5 w-5" />
        Package Dimensions and Contents
      </h3>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Length (cm)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.1" placeholder="e.g., 30" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width (cm)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.1" placeholder="e.g., 20" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (cm)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.1" placeholder="e.g., 15" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="contentsCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contents Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category of contents" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {contentCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Card>
  );
}
