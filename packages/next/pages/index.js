import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Root() {
  const router = useRouter();

  useEffect(() => {
    const node = localStorage.getItem("node") || "westmint";
    router.push(`/${node}`);
  }, [router]);

  return null;
}

export async function getServerSideProps(context) {
  return {
    props: {},
  };
}
