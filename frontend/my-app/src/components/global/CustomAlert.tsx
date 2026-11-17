import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleDelete: () => void;
  title: string;
  description: string;
}

const CustomAlert = ({ isOpen, setIsOpen, handleDelete, title, description }: Props) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-w-md rounded-xl border border-[#eadfd9] bg-[#fffdfb] p-6 shadow-xl dark:border-[#493943] dark:bg-[#2d242b]">
        <AlertDialogHeader className="space-y-3">
          <AlertDialogTitle className="text-xl font-semibold text-[#40343a] dark:text-[#f8edf0]">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-6 text-[#8b7b7b] dark:text-[#b9a5ad]">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 gap-2 sm:gap-3">
          <AlertDialogCancel className="h-10 rounded-lg border-[#eadfd9] bg-[#f5e8e8] px-5 font-medium text-[#875466] hover:bg-[#f0dada] hover:text-[#754657] dark:border-[#493943] dark:bg-[#40313a] dark:text-[#f2dce4] dark:hover:bg-[#49343e]">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            className="h-10 rounded-lg bg-[#dc5555] px-5 font-medium text-white shadow-sm hover:bg-[#c94747] focus-visible:ring-2 focus-visible:ring-[#dc5555] focus-visible:ring-offset-2"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlert;
