import { Preferences } from "@/components/preference";
import { validateRequest } from "@/utils/auth";
import { redirect } from "next/navigation";
import { getPropertyBy } from "../admin/dashboard/property/action";
import Rquery from "@/utils/rquery";

export default async function Component() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  return (
    <Rquery>
      <Preferences />;
    </Rquery>
  );
}
