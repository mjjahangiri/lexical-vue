<template>
  <slot />
</template>

<script setup>
import { createEditor } from "lexical";
import { onMounted, onUnmounted, provide, ref, toRefs, watch } from "vue";

import { LexicalEditorProviderKey } from "../constant/inject.constant.js";

const props = defineProps({
  editable: {
    type: Boolean,
    required: true,
  },
  initialConfig: {
    type: Object,
    required: true,
  },
});

const editor = ref(null);
const { editable } = toRefs(props);

defineExpose({ editor });

let stopWatchEditorEditable;

const watchEditorEditable = () =>
  watch(
    editable,
    (newValue) => {
      editor.value.setEditable(newValue);
    },
    {
      immediate: true,
    }
  );

onMounted(() => {
  editor.value = createEditor({
    editable: editable.value,
    html: props.initialConfig?.html,
    namespace: props.initialConfig?.namespace,
    nodes: props.initialConfig?.nodes,
    theme: props.initialConfig?.theme,
  });

  provide(LexicalEditorProviderKey, editor.value);

  stopWatchEditorEditable = watchEditorEditable();
});

onUnmounted(() => {
  stopWatchEditorEditable?.();
  editor.value = null;
});
</script>
