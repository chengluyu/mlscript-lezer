import { useTokenizerLogs } from "@/store/tokenizerLogs";
import LogView from "./LogView";

export default function TokenizerPanel() {
  const logs = useTokenizerLogs();
  const nodes: React.ReactNode[] = [];
  logs.forEach((log) => {
    nodes.push(<LogView key={log.id} log={log} />);
  });
  return (
    <div className="overflow-y-auto px-4 py-3.5 flex flex-col gap-1">
      {nodes}
    </div>
  );
}
