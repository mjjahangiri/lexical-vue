import {
  Teleport,
  computed,
  h,
  onMounted,
  onUnmounted,
  readonly,
  shallowRef,
} from "vue";

/** @param {import('lexical').LexicalEditor} editor */
export function useDecorators(editor) {
  const decorators = shallowRef(editor.getDecorators());

  let unRegister;
  onMounted(() => {
    unRegister = editor.registerDecoratorListener(
      (/** @type {any} */ nextDecorators) => {
        decorators.value = nextDecorators;
      }
    );
    return unRegister;
  });

  onUnmounted(() => unRegister?.());

  const decoratorVNodes = computed(() =>
    Object.entries(decorators.value).flatMap(([nodeKey, vueDecorator]) => {
      const element = editor.getElementByKey(nodeKey);
      return element ? [h(Teleport, { to: element }, vueDecorator)] : [];
    })
  );

  return readonly(decoratorVNodes);
}
