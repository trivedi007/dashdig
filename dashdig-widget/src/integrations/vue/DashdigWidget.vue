<script setup lang="ts">
/**
 * DashDig Widget - Vue 3 Component
 * Embeddable analytics widget as a Vue 3 component
 */

import { onMounted, onUnmounted, ref } from 'vue';
import DashdigWidget from '../../core/widget';
import type { DashdigConfig } from '../../core/widget';

/**
 * Component props
 */
interface Props {
  apiKey: string;
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'light' | 'dark';
  autoShow?: boolean;
  apiUrl?: string;
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  position: 'bottom-right',
  theme: 'light',
  autoShow: true
});

/**
 * Component emits
 */
interface Emits {
  (event: 'load'): void;
  (event: 'error', error: Error): void;
}

const emit = defineEmits<Emits>();

// Widget instance reference
const widget = ref<DashdigWidget | null>(null);

/**
 * Initialize widget on component mount
 */
onMounted(() => {
  try {
    // Create widget configuration
    const config: DashdigConfig = {
      apiKey: props.apiKey,
      position: props.position,
      theme: props.theme,
      autoShow: props.autoShow,
      apiUrl: props.apiUrl
    };

    // Create widget instance
    widget.value = new DashdigWidget(config);

    // Emit load event
    emit('load');
  } catch (error) {
    // Emit error event
    if (error instanceof Error) {
      emit('error', error);
    } else {
      emit('error', new Error('Unknown error initializing DashDig widget'));
    }
    console.error('[DashDig Vue] Widget initialization error:', error);
  }
});

/**
 * Cleanup widget on component unmount
 */
onUnmounted(() => {
  if (widget.value) {
    try {
      widget.value.destroy();
      widget.value = null;
    } catch (error) {
      console.error('[DashDig Vue] Widget cleanup error:', error);
    }
  }
});

/**
 * Expose methods for template refs
 */
defineExpose({
  widget,
  show: () => widget.value?.show(),
  hide: () => widget.value?.hide(),
  track: (event: string, data?: Record<string, any>) => widget.value?.track(event, data)
});
</script>

<template>
  <!-- Widget appends to body via Shadow DOM, no template needed -->
</template>

<style scoped>
/* No styles needed - widget is rendered outside component tree */
</style>


