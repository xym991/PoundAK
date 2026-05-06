import { setPortal, setTab } from "@/state/routerSlice";
import { useDispatch, useSelector } from "react-redux";

export default function useRouter() {
  const dispatch = useDispatch();
  const router = useSelector((state: any) => state.router);

  return {
    portal: router.portal,
    tab: router.tab,
    setPortal: (p: string) => dispatch(setPortal(p)),
    setTab: (t: string) => dispatch(setTab(t)),
  };
}
