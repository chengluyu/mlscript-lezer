import { atom, useAtomValue } from "jotai";
import { store } from ".";
import { nanoid } from "nanoid";
import { List } from "immutable";

export type TokenizerLog = {
  id: string;
  time: Date;
  message: string;
  data: unknown[];
};

export const tokenizerLogsAtom = atom(
  List<TokenizerLog>([
    {
      id: nanoid(),
      time: new Date(),
      message: "Hello, world!",
      data: [
        { x: 0, y: 0 },
        { message: "Hello, world!" },
        { type: "Node", children: [] },
      ],
    },
  ])
);

export function useTokenizerLogs(): List<TokenizerLog> {
  return useAtomValue(tokenizerLogsAtom);
}

export function log(message: string, ...data: unknown[]) {
  store.set(tokenizerLogsAtom, (logs) => {
    return logs.unshift({ id: nanoid(), time: new Date(), message, data });
  });
}
