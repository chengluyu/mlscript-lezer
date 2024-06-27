import { atom, useAtom, useSetAtom } from "jotai";
import { Map } from "immutable";
import { Dispatch, SetStateAction, useCallback } from "react";
import { SyntaxTreeNode } from "@/store/syntaxTree";

export const collapseAtom = atom(Map<string, boolean>());

export function useCollapseState(
  key: string
): [boolean | null, Dispatch<SetStateAction<boolean | null>>] {
  const [collapse, setCollapse] = useAtom(collapseAtom);
  const currentValue = collapse.get(key, null);
  const setValue = useCallback(
    (valueOrUpdate: SetStateAction<boolean | null>) => {
      let newValue: boolean | null = null;
      if (typeof valueOrUpdate === "function") {
        newValue = valueOrUpdate(currentValue);
      } else if (typeof valueOrUpdate === "boolean") {
        newValue = valueOrUpdate;
      }
      if (newValue === null) {
        setCollapse(collapse.remove(key));
      } else {
        setCollapse(collapse.set(key, newValue));
      }
    },
    [key, currentValue, collapse, setCollapse]
  );
  return [currentValue, setValue];
}

export function useSetBatchCollapseState(): (keys: string[]) => void {
  const setCollapse = useSetAtom(collapseAtom);
  return useCallback(
    (keys) => {
      setCollapse((collapse) =>
        collapse.merge(Map(keys.map((key) => [key, true])))
      );
    },
    [setCollapse]
  );
}

export function useRevalidateCollapse(): (root: SyntaxTreeNode) => void {
  const setCollapse = useSetAtom(collapseAtom);
  return useCallback(
    (root: SyntaxTreeNode) =>
      setCollapse((collapse) => {
        // Removes keys that no longer present in the syntax tree.
        const keys = new Set<string>();
        function visit(node: SyntaxTreeNode): void {
          keys.add(node.key);
          node.children.forEach(visit);
        }
        visit(root);
        return collapse.filter((_, key) => keys.has(key));
      }),
    [setCollapse]
  );
}
