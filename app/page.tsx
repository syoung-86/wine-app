import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    router.push('/list');
  return <div></div>;
}
