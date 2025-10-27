import { inject } from "vue";
import { LexicalEditorProviderKey } from "../constant/inject.constant.js";

export function useLexicalComposer() {
  const editor = inject(LexicalEditorProviderKey);

  if (!editor) {
    console.warn(
      "Editor called outside of <LexicalComposer> context or called before <LexicalComposer> mounted"
    );
  }

  return editor;
}
