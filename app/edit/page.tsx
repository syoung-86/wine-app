"use client";
import CreateEditWineForm from "@/app/components/creat-edit-wine-form";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  return (
    <>
      <CreateEditWineForm id={id ? parseInt(id, 10) : null} />
    </>
  );
}
