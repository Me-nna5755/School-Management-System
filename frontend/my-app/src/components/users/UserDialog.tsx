import Modal from "@/components/global/Modal";
import UniversalUserForm from "@/components/auth/UniversalUserForm";
import type { user, UserRole } from "@/types";

const UserDialog = ({
  open,
  setOpen,
  editingUser,
  role,
  onSuccess,
}: {
  setOpen: (open: boolean) => void;
  open: boolean;
  editingUser: user | null;
  role: UserRole;
  onSuccess?: () => void;
}) => {
  const title = editingUser ? "Update User" : "Create User";
  const description = editingUser ? "Update user details" : "Add a new user";

  const onSuccessPlus = () => {
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Modal
      title={title}
      description={description}
      open={open}
      setOpen={setOpen}
      contentClassName="w-[calc(100vw-2rem)] max-w-md max-h-[85vh] overflow-y-auto rounded-2xl border-2 border-[#d6a5b1] bg-[#f8eeea] p-4 text-[#59404a] shadow-2xl sm:p-5"
      cancelButtonClassName="h-10 rounded-lg border border-[#b96d86] bg-[#f3e2e4] font-semibold text-[#70485a] hover:bg-accent"
    >
      <div className="rounded-xl border border-[#d6a5b1] bg-[#f8eeea] p-3 shadow-md sm:p-4 [&_input]:h-10 [&_input]:rounded-lg [&_input]:border [&_input]:border-[#bd7188] [&_input]:!bg-[#fffaf7] [&_input]:px-3 [&_input]:!text-[#59404a] [&_input]:shadow-sm [&_input]:focus-visible:border-primary [&_input]:focus-visible:ring-2 [&_input]:focus-visible:ring-primary/20 [&_label]:font-semibold [&_label]:!text-[#805568] [&_button[type=submit]]:h-10 [&_button[type=submit]]:rounded-lg [&_button[type=submit]]:border [&_button[type=submit]]:border-[#aa627a] [&_button[type=submit]]:bg-[#b96d86] [&_button[type=submit]]:font-semibold [&_button[type=submit]]:!text-white">
        <UniversalUserForm
          type={editingUser ? "update" : "create"}
          role={role}
          initialData={editingUser}
          onSuccess={onSuccessPlus}
        />
      </div>
    </Modal>
  );
};

export default UserDialog;



