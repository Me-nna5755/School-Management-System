import { useEffect, useState } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import type { Class, subject } from "@/types";

const schema = z.object({
  subject: z.string().min(1, "Subject is required"),
  class: z.string().min(1, "Class is required"),
  topic: z.string().min(3, "Topic is required"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  count: z.coerce.number().min(1).max(20),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ExamGenerator = ({ open, onOpenChange, onSuccess }: Props) => {
  const [subjects, setSubjects] = useState<subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      topic: "",
      difficulty: "Medium",
      count: 5,
    },
  });

  // Fetch Options
  useEffect(() => {
    if (open) {
      Promise.all([api.get("/subject"), api.get("/class")]).then(
        ([subRes, clsRes]) => {
          setSubjects(subRes.data.subjects);
          setClasses(clsRes.data.classes);
        }
      );
    }
  }, [open]);

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      // Trigger AI Generation (Inngest)
      await api.post("/exams/generate", {
        ...values,
        title: `${values.topic} Quiz`, // Auto-generate title
      });

      toast.success("AI is generating the exam! Check back in a moment.");
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error("Failed to start generation");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl border-2 border-[#d6a5b1] !bg-[#f8eeea] p-5 !text-[#59404a] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold !text-[#59404a]">
            <Sparkles className="h-5 w-5 text-violet-600" />
            Generate AI Quiz
          </DialogTitle>
          <DialogDescription className="text-sm leading-6 !text-[#805568]">
            Describe the topic, and AI will create questions for you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="subject"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="mb-1 font-semibold !text-[#805568]">Subject</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-10 rounded-lg border-[#bd7188] !bg-[#fffaf7] !text-[#59404a] shadow-sm focus:ring-2 focus:ring-[#b96d86]/20">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent className="border-[#d6a5b1] !bg-[#f8eeea] !text-[#59404a]">
                        {subjects.map((s) => (
                          <SelectItem key={s._id} value={s._id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />

              <Controller
                name="class"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="mb-1 font-semibold !text-[#805568]">Class</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-10 rounded-lg border-[#bd7188] !bg-[#fffaf7] !text-[#59404a] shadow-sm focus:ring-2 focus:ring-[#b96d86]/20">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent className="border-[#d6a5b1] !bg-[#f8eeea] !text-[#59404a]">
                        {classes.map((c) => (
                          <SelectItem key={c._id} value={c._id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </div>

            <Controller
              name="topic"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="mb-1 font-semibold !text-[#805568]">Topic / Concept</FieldLabel>
                  <Input className="h-11 w-full rounded-xl border border-[#bd7188] !bg-[#fffaf7] px-3 !text-[#59404a] placeholder:text-[#9b7d89] shadow-sm focus-visible:border-[#b96d86] focus-visible:ring-2 focus-visible:ring-[#b96d86]/20"
                    placeholder="e.g. Photosynthesis, WW2, Algebra"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="difficulty"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="mb-1 font-semibold !text-[#805568]">Difficulty</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-10 rounded-lg border-[#bd7188] !bg-[#fffaf7] !text-[#59404a] shadow-sm focus:ring-2 focus:ring-[#b96d86]/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-[#d6a5b1] !bg-[#f8eeea] !text-[#59404a]">
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />

              <Controller
                name="count"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="mb-1 font-semibold !text-[#805568]">Question Count</FieldLabel>
                    <Input className="h-11 w-full rounded-xl border border-[#bd7188] !bg-[#fffaf7] px-3 !text-[#59404a] placeholder:text-[#9b7d89] shadow-sm focus-visible:border-[#b96d86] focus-visible:ring-2 focus-visible:ring-[#b96d86]/20" type="number" {...field} />
                  </Field>
                )}
              />
            </div>

            <Button type="submit" className="h-10 w-full rounded-lg border border-[#aa627a] bg-[#b96d86] font-semibold !text-white hover:bg-[#a65d76]" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Generate Questions
                </>
              )}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};
// let try again
export default ExamGenerator;