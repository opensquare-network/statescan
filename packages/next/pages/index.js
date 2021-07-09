import { useEffect } from "react";
import { useRouter } from "next/router";

import { useNode } from "utils/hooks";
import { useDispatch } from "react-redux";
import { setStoredOrDefaultNode } from "../store/reducers/nodeSlice";

export default function Root() {
  const router = useRouter();
  const node = useNode();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!node) {
      dispatch(setStoredOrDefaultNode());
    } else {
      router.push(`/${node}`);
    }
  }, [node, router, dispatch]);
  return null;
}

export async function getServerSideProps(context) {
  return {
    props: {},
  };
}
