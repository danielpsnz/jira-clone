import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";

const WorkspaceCreatePage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return (
    <div className="w-full lg:max-w-lg">
      <CreateWorkspaceForm />
    </div>
  );
};

export default WorkspaceCreatePage;
