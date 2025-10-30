import { nextTick, watch } from "vue";
import { tryOnScopeDispose } from "@vueuse/core";
import { $convertFromMarkdownString } from "@lexical/markdown";
import { TRANSFORMERS } from "../Constant/markdownTransformers.constant.js";

/**
 * @param {import('lexical').LexicalEditor} editor
 * @param {object} options
 * @param {import('vue').Ref<string>} options.modelValue
 * @param {import('vue').Ref<boolean>} options.isAutoFocus
 * @param {import('vue').Ref<'rootStart' | 'rootEnd' | undefined>} options.defaultSelection
 * @param {import('vue').Ref<boolean>} options.isInEditingState
 * @param {import('vue').Ref<string>} options.latestEditorChanges
 * @returns {any}
 */
export default function registerInitialValuePlugin(
  editor,
  {
    modelValue,
    isAutoFocus,
    defaultSelection,
    isInEditingState,
    latestEditorChanges,
  }
) {
  let isUpdatingFromModel = false;

  /** @param {'rootStart' | 'rootEnd' | undefined} defaultSelection */
  function focusEditor(defaultSelection) {
    const root = editor.getRootElement();

    if (!root) return;

    // to avoid losing focus on some browser
    root.focus({ preventScroll: true });

    editor.focus(() => root.focus({ preventScroll: true }), {
      defaultSelection,
    });
  }

  const watchInitialValue = watch(
    modelValue,
    (newValue) => {
      if (
        isInEditingState.value ||
        newValue === latestEditorChanges?.value ||
        isUpdatingFromModel
      )
        return;

      isUpdatingFromModel = true;
      latestEditorChanges.value = newValue;

      editor.update(
        () => {
          try {
            if (!newValue || newValue.trim() === "") {
              editor.setEditorState(editor.parseEditorState(""));
            } else {
              const editorState = editor.parseEditorState(newValue);
              editor.setEditorState(editorState);
            }
          } catch {
            $convertFromMarkdownString(newValue, TRANSFORMERS, undefined, true);
          }
        },
        {
          onUpdate() {
            editor.blur();
            nextTick(() => {
              isUpdatingFromModel = false;
              if (isAutoFocus.value) focusEditor(defaultSelection?.value);
            });
          },
        }
      );
    },
    {
      immediate: true,
    }
  );

  tryOnScopeDispose(watchInitialValue);
}
