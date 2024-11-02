import { useRecoilValue } from "recoil";
import { balanceAtom } from "./index";

export const useBalance = () => {
  const value = useRecoilValue(balanceAtom);
  return value;
};
