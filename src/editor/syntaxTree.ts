import { store } from "@/store";
import { SyntaxTreeNode, cloneTree } from "@/store/syntaxTree";
import { syntaxTree } from "@codemirror/language";
import { EditorState, Extension } from "@codemirror/state";
import { Decoration, DecorationSet } from "@codemirror/view";
import { EditorView } from "codemirror";
import { PrimitiveAtom } from "jotai";

const emptySet = Decoration.set([]);

function dumpSyntaxTree(
  atom: PrimitiveAtom<SyntaxTreeNode | null>,
  state: EditorState
): DecorationSet {
  const tree = syntaxTree(state);
  const clonedTree = cloneTree(tree);
  store.set(atom, clonedTree);
  return emptySet;
}

export function syntaxTreeDumper(
  atom: PrimitiveAtom<SyntaxTreeNode | null>
): Extension {
  return EditorView.decorations.compute(
    ["doc"],
    dumpSyntaxTree.bind(null, atom)
  );
}
