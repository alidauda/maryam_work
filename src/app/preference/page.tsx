import { Preferences } from "@/components/preference";
import { validateRequest } from "@/utils/auth";
import { redirect } from "next/navigation";
import { getPropertyBy } from "../admin/dashboard/property/action";

export default async function Component() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }
  const property = await getPropertyBy();

  console.log(property);
  return <Preferences property={property} />;
}
