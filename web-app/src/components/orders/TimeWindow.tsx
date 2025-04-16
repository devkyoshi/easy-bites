
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock } from "lucide-react";

interface TimeWindowProps {
  startFieldName: string;
  endFieldName: string;
  form: UseFormReturn<any>;
  startLabel?: string;
  endLabel?: string;
}

// Generate time options in 30-minute intervals
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      const time = `${formattedHour}:${formattedMinute}`;
      const displayTime = formatDisplayTime(hour, minute);
      times.push({ value: time, label: displayTime });
    }
  }
  return times;
};

const formatDisplayTime = (hour: number, minute: number) => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  const displayMinute = minute.toString().padStart(2, '0');
  return `${displayHour}:${displayMinute} ${period}`;
};

export function TimeWindow({ 
  startFieldName, 
  endFieldName, 
  form, 
  startLabel = "From", 
  endLabel = "To" 
}: TimeWindowProps) {
  const timeOptions = generateTimeOptions();

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name={startFieldName}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger className="w-full">
                  <Clock className="mr-2 h-4 w-4 text-gray-400" />
                  <SelectValue placeholder={startLabel} />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={endFieldName}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger className="w-full">
                  <Clock className="mr-2 h-4 w-4 text-gray-400" />
                  <SelectValue placeholder={endLabel} />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
