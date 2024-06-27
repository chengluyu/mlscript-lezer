import { getCurrentTheme, useThemes } from "./editor/useThemes";
import { mlscript } from "./mlscript";
import { indentWithTab } from "@codemirror/commands";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { useEffect, useRef } from "react";
import defaultCode from "./samples/default.txt?raw";
import { syntaxTreeDumper } from "./editor/syntaxTree";
import { syntaxTreeAtom } from "./store/syntaxTree";
import SyntaxTreePanel from "./panels/SyntaxTreePanel";
import TokenizerPanel from "./panels/TokenizerPanel";
import { useConsumeEditorFocus } from "./store/editorFocus";

function App() {
  const editorRef = useRef<EditorView | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [editorFocus, consumeEditorFocus] = useConsumeEditorFocus();
  useEffect(() => {
    if (containerRef.current === null) return;
    if (editorRef.current !== null) return;
    const initialState = EditorState.create({
      doc: defaultCode,
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        mlscript(),
        getCurrentTheme(),
        syntaxTreeDumper(syntaxTreeAtom),
      ],
    });
    const editor = new EditorView({
      state: initialState,
      parent: containerRef.current,
    });
    editorRef.current = editor;
  });
  useEffect(() => {
    if (editorFocus === null) return;
    editorRef?.current?.dispatch({
      selection: { anchor: editorFocus.range[0], head: editorFocus.range[1] },
    });
    consumeEditorFocus();
  }, [editorFocus, consumeEditorFocus]);
  useThemes(editorRef);
  return (
    <div className="w-screen h-screen grid grid-cols-2 grid-rows-2">
      <div className="p-8 flex flex-col gap-2 row-span-2 border-r border-border">
        <header className="text-xl font-bold uppercase">Editor</header>
        <main className="w-full min-h-0 flex-grow" ref={containerRef} />
      </div>
      <div className="p-8 flex flex-col gap-2">
        <header className="text-xl font-bold uppercase">Syntax Tree</header>
        <main className="w-full min-h-0 flex-grow panel py-0.5">
          <SyntaxTreePanel />
        </main>
      </div>
      <div className="p-8 flex flex-col gap-2 border-t border-border">
        <header className="text-xl font-bold uppercase">
          External Tokenizer
        </header>
        <main className="w-full min-h-0 flex-grow panel py-0.5">
          <TokenizerPanel />
        </main>
      </div>
    </div>
  );
}

export default App;
