import { useContext } from "react";
import ReportContext from "src/context/ReportProvider";

export function useReport() {
  return useContext(ReportContext);
}
