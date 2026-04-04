import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import UploadDropzone from "@/components/UploadDropzone";
import ContactsTable from "@/components/ContactsTable";
import { prisma } from "@repo/db";

export default async function ContactsPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  const contacts = await prisma.contact.findMany({
    where: { userId: session.user.id },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Contacts Table</h1>

      <UploadDropzone />
      <ContactsTable contacts={contacts} />
    </div>
  );
}