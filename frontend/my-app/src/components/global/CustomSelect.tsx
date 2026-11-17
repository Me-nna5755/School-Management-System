import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";

export interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  loading?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
}

export function CustomSelect<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Select...",
  options,
  disabled,
  loading = false,
  triggerClassName,
  contentClassName,
}: CustomSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="w-full gap-2">
          <FieldLabel htmlFor={name} className="font-semibold text-foreground">
            {label}
          </FieldLabel>

          <Select
            onValueChange={field.onChange}
            value={field.value ?? ""}
            disabled={disabled}
          >
            <SelectTrigger
              id={name}
              className={`h-10 w-full rounded-lg border border-[#d6a5b1] bg-[#fffaf7] text-[#59404a] shadow-sm focus:ring-2 focus:ring-primary/20 ${triggerClassName ?? ""}`}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent
              position="popper"
              side="bottom"
              sideOffset={10}
              align="start"
              className={`z-[100] w-[var(--radix-select-trigger-width)] max-h-52 overflow-y-auto rounded-xl border border-[#d6a5b1] bg-[#f8eeea] p-1.5 text-[#59404a] shadow-xl ${contentClassName ?? ""}`}
            >
              {loading ? (
                <SelectItem value="loading" disabled>
                  Loading...
                </SelectItem>
              ) : options.length > 0 ? (
                options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="cursor-pointer rounded-lg py-2.5 focus:bg-[#f0dce2] focus:text-[#70485a]"
                  >
                    {option.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="empty" disabled>
                  No options available
                </SelectItem>
              )}
            </SelectContent>
          </Select>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

