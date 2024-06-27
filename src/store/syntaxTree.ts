import * as lezer from "@lezer/common";
import { List } from "immutable";
import { atom, useAtomValue } from "jotai";

export type SyntaxTreeNode = {
  key: string;
  name: string;
  attributes: Record<string, unknown>;
  range: [number, number];
  children: SyntaxTreeNode[];
};

export const syntaxTreeAtom = atom<SyntaxTreeNode | null>(null);

export function useSyntaxTree(): SyntaxTreeNode | null {
  return useAtomValue(syntaxTreeAtom);
}

export function cloneTree(tree: lezer.Tree): SyntaxTreeNode {
  function cloneNode(
    node: lezer.SyntaxNode,
    parentPath: List<string>,
    childIndex: number | null
  ): SyntaxTreeNode {
    const shortName = abbreviate(node.type.name);
    const myPath = parentPath.push(
      childIndex === null ? shortName : `${shortName}@${childIndex}`
    );
    const children: SyntaxTreeNode[] = [];
    for (
      let child = node.firstChild, i = 0;
      child;
      child = child.nextSibling, i += 1
    ) {
      children.push(cloneNode(child, myPath, i));
    }
    return {
      key: myPath.join(":"),
      name: node.type.name,
      attributes: {
        isolate: node.type.prop(lezer.NodeProp.isolate),
        closedBy: node.type.prop(lezer.NodeProp.closedBy),
        openedBy: node.type.prop(lezer.NodeProp.openedBy),
        group: node.type.prop(lezer.NodeProp.group),
        contextHash: node.type.prop(lezer.NodeProp.contextHash),
        lookAhead: node.type.prop(lezer.NodeProp.lookAhead),
      },
      range: [node.from, node.to],
      children,
    };
  }
  return cloneNode(tree.topNode, List(), null);
}

const shortNameMap = new Map<string, number>();

function abbreviate(typeName: string): string {
  let shortName = shortNameMap.get(typeName);
  if (shortName === undefined) {
    shortName = shortNameMap.size + 1;
    shortNameMap.set(typeName, shortNameMap.size + 1);
  }
  return shortName.toString(16).toUpperCase();
}
