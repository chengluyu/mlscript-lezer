import { TokenizerLog } from "@/store/tokenizerLogs";
import { ObjectInspector } from "react-inspector";

export type LogViewProps = {
  log: TokenizerLog;
};

export default function LogView({ log }: LogViewProps) {
  return (
    <div className="rounded-sm border border-border px-2 pb-2 pt-1.5 shadow-sm">
      <div className="relative">
        <div>{log.message}</div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-mono tabular-nums text-muted-foreground">
          <time>{log.time.toLocaleTimeString()}</time>
        </div>
      </div>
      {log.data.length > 0 ? (
        <div className="mt-1 flex flex-row gap-2 flex-wrap">
          {log.data.map((datum, index) => (
            <ObjectInspector key={index} data={datum} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
