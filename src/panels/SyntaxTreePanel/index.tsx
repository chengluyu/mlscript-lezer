import { useSyntaxTree } from "@/store/syntaxTree";
import NodeView from "./NodeView";

export type SyntaxTreePanelProps = Record<string, never>;

export default function SyntaxTreePanel() {
  const root = useSyntaxTree();
  return (
    <div className="w-full h-full overflow-y-auto p-3">
      {root === null ? <div>Empty</div> : <NodeView node={root} />}
    </div>
  );
}
