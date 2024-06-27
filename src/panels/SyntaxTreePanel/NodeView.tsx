import { SyntaxTreeNode } from "@/store/syntaxTree";
import { useCollapseState, useSetBatchCollapseState } from "./collapse";
import {
  ChevronDown,
  ChevronRight,
  CopyMinusIcon,
  DotIcon,
} from "lucide-react";
import { useCallback } from "react";
import pluralize from "pluralize";
import { useSetEditorFocus } from "@/store/editorFocus";

export type NodeViewProps = {
  node: SyntaxTreeNode;
};

export default function NodeView({ node }: NodeViewProps) {
  const [collapsed = true, setCollapsed] = useCollapseState(node.key);
  const setEditorFocus = useSetEditorFocus();
  const toggleCollapsed = useCallback(
    () => setCollapsed((value) => !value),
    [setCollapsed]
  );
  const focusNode = useCallback(() => {
    setEditorFocus({ range: node.range });
  }, [node.range, setEditorFocus]);
  const setBatchCollapse = useSetBatchCollapseState();
  const collapseChildren = useCallback(() => {
    setBatchCollapse(node.children.map((child) => child.key));
  }, [setBatchCollapse, node.children]);
  const header = (
    <div className="flex flex-row gap-2 items-center">
      <button
        type="button"
        onClick={toggleCollapsed}
        disabled={node.children.length === 0}
      >
        {node.children.length === 0 ? (
          <DotIcon className="w-4 h-4" />
        ) : collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      <button type="button" onClick={focusNode} className="hover:underline">
        {node.name}
      </button>
      <div className="text-sm font-mono rounded px-1 bg-muted text-muted-foreground">
        {node.range[0]}-{node.range[1]}
      </div>
      {collapsed ? (
        <div className="text-sm rounded px-1 bg-muted text-muted-foreground">
          {pluralize("child", node.children.length, true)}
        </div>
      ) : null}
      <button
        className="text-muted-foreground"
        type="button"
        onClick={collapseChildren}
      >
        <CopyMinusIcon className="w-3.5 h-3.5" />
      </button>
    </div>
  );
  return collapsed ? (
    header
  ) : (
    <div>
      {header}
      <div className="ml-4">
        {node.children.map((child) => (
          <NodeView key={child.key} node={child} />
        ))}
      </div>
    </div>
  );
}
