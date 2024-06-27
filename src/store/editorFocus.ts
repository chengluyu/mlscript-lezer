import { SetStateAction, atom, useAtom, useSetAtom } from "jotai";
import { Dispatch, useCallback } from "react";

export type EditorFocus = {
  range: [number, number];
};

export const editorFocusAtom = atom<EditorFocus | null>(null);

export function useConsumeEditorFocus(): [
  focus: EditorFocus | null,
  consume: () => void
] {
  const [focus, setFocus] = useAtom(editorFocusAtom);
  const consume = useCallback(() => setFocus(null), [setFocus]);
  return [focus, consume];
}

export function useSetEditorFocus(): Dispatch<
  SetStateAction<EditorFocus | null>
> {
  return useSetAtom(editorFocusAtom);
}
