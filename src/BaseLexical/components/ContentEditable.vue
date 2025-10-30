<template>
  <div>
    <div
      ref="contentEditableRefEl"
      class="editor"
      :contenteditable="editable"
      v-bind="ariaOptionsComputed"
      :autocapitalize="autoCapitalize"
      :autocomplete="autoComplete"
      :autocorrect="autoCorrect"
      :spellcheck="spellcheck"
      :tabindex="tabindex"
    />
    <slot name="placeholder" />
  </div>
</template>

<script setup>
import { registerRichText } from "@lexical/rich-text";
import { computed, onMounted, onUnmounted, useTemplateRef } from "vue";

import { useDecorators, useLexicalComposer } from "../Composables";

const props = defineProps({
  ariaActivedescendant: { type: String },
  ariaControls: { type: String },
  ariaDescribedby: { type: String },
  ariaLabel: { type: String },
  ariaLabelledby: { type: String },
  ariaMultiline: { type: Boolean, default: true },
  ariaOwns: { type: String },
  ariaRequired: { type: Boolean },
  autoCapitalize: { type: String },
  autoComplete: { type: String, default: "off" },
  autoCorrect: { type: String },
  editable: { type: Boolean },
  spellcheck: { type: Boolean, default: true },
  tabindex: { type: Number },
  enableGrammarly: { type: Boolean, default: false },
});

const contentEditableRefEl = useTemplateRef("contentEditableRefEl");
const editor = useLexicalComposer();

const ariaOptionsComputed = computed(() => {
  const ariaOptionsObject = {};

  if (props.editable) {
    ariaOptionsObject["aria-activedescendant"] = props.ariaActivedescendant;
    ariaOptionsObject["aria-controls"] = props.ariaControls;
    ariaOptionsObject["aria-owns"] = props.ariaOwns;
  }

  ariaOptionsObject["aria-describedby"] = props.ariaDescribedby;
  ariaOptionsObject["aria-label"] = props.ariaLabel;
  ariaOptionsObject["aria-labelledby"] = props.ariaLabelledby;
  ariaOptionsObject["aria-multiline"] = props.ariaMultiline;
  ariaOptionsObject["aria-required"] = props.ariaRequired;

  return ariaOptionsObject;
});

let hasInitializedEditorPlugins = false;
onMounted(() => {
  if (contentEditableRefEl.value) {
    editor.setRootElement(contentEditableRefEl.value);

    if (!hasInitializedEditorPlugins) {
      registerRichText(editor);
      useDecorators(editor);
      hasInitializedEditorPlugins = true;
    }
  }
});

onUnmounted(() => {
  editor.setRootElement(null);
  hasInitializedEditorPlugins = false;
});
</script>

<style scoped></style>
