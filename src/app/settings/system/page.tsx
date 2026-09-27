import { notFound } from "next/navigation";
import { SystemInfo } from "@/components/system-info";

export default function SystemPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <SystemInfo canonicalReady={Boolean(process.env.APP_URL)} />;
}
