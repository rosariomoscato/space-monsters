import { Arcade } from "@/components/arcade";

export default function Home() {
  return <Arcade showSystemLink={process.env.NODE_ENV !== "production"} />;
}
