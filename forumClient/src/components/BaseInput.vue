<!-- src/components/BaseInput.vue -->
<template>
  <div class="form-group">
    <div class="label-wrapper">
      <label v-if="props.label" :for="props.id">{{ props.label }}</label>
      <!-- Le compteur ne s'affiche que pour les types text/textarea et si maxlength est défini -->
      <span 
        v-if="props.maxlength && (props.type === 'text' || props.type === 'textarea')" 
        class="char-counter"
        :class="{ 'counter-limit': isLimitReached }"
      >
        {{ characterCount }} / {{ props.maxlength }}
      </span>
    </div>

    <!-- ==================== TEXTAREA ==================== -->
    <textarea
      v-if="props.type === 'textarea'"
      v-bind="componentProps"
      :value="props.modelValue != null ? String(props.modelValue) : ''"
      :maxlength="props.maxlength"
      @input="onInput"
      @blur="onBlur"
      :class="{ 'input-error': !!props.error }"
    ></textarea>

    <!-- ==================== SELECT ==================== -->
    <select
      v-else-if="props.type === 'select'"
      v-bind="componentProps"
      :value="localSelectValue"
      @change="onSelectChange"
      @blur="onBlur"
      :class="{ 'input-error': !!props.error }"
    >
      <option value="" disabled>{{ props.placeholder || '-- Choisir --' }}</option>
      <option v-for="opt in props.options" :key="String(opt.value)" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>

    <!-- ==================== OTHER INPUTS ==================== -->
    <input
      v-else
      v-bind="componentProps"
      :value="props.type !== 'checkbox' && props.type !== 'radio' ? props.modelValue : undefined"
      :checked="(props.type === 'checkbox' || props.type === 'radio') ? Boolean(props.modelValue) : undefined"
      :maxlength="props.maxlength"
      @input="onInput"
      @change="onChange"
      @blur="onBlur"
      :class="{ 'error': !!props.error }"
    />
    <BaseMessageAlert v-if="props.error" :text="props.error" type="error" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseMessageAlert from './BaseMessageAlert.vue';
import type { OptionType } from '@/types';

const props = withDefaults(defineProps<{
  id: string;
  modelValue?: string | number | boolean | null;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  autocomplete?: string;
  rows?: number;
  options?: OptionType[];
  maxlength?: number; 
}>(), {
  type: 'text',
  modelValue: '',
  placeholder: '',
  required: false,
  autocomplete: 'off',
  rows: 3,
  options: () => [],
  maxlength: undefined
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | boolean | null): void;
  (e: 'blur', event: FocusEvent): void;
}>();

// --- Computed Properties ---
const componentProps = computed(() => ({
  id: props.id,
  placeholder: props.placeholder,
  required: props.required,
  autocomplete: props.autocomplete,
  ...(props.type === 'textarea' ? { rows: props.rows } : {}),
  ...(props.type !== 'textarea' && props.type !== 'select' ? { type: props.type } : {})
}));

const localSelectValue = computed(() => {
  return props.modelValue === null || props.modelValue === undefined ? '' : props.modelValue;
});

const characterCount = computed(() => String(props.modelValue || '').length);
const isLimitReached = computed(() => 
  props.maxlength ? characterCount.value >= props.maxlength : false
);

// --- Event Handlers ---
function onSelectChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  const value = target.value;
  if (value === '') {
    emit('update:modelValue', null);
    return;
  }
  const foundOption = props.options?.find(opt => String(opt.value) === value);
  const originalValue = foundOption ? foundOption.value : null;
  emit('update:modelValue', originalValue);
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  emit('update:modelValue', target.value);
}

function onChange(event: Event) {
  if (props.type === 'checkbox' || props.type === 'radio') {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.checked);
  }
}

function onBlur(event: FocusEvent) {
  emit('blur', event);
}
</script>

<style scoped>
.label-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.form-group label {
  display: block;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--md-sys-color-on-surface);
}

/* NOUVEAU STYLE POUR LE COMPTEUR */
.char-counter {
  font-size: 0.8rem;
  color: #94a3b8; 
  transition: color 0.3s ease;
}

.counter-limit {
  color: #ef4444; 
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width:fill-available;
  max-width: 100%;
  min-width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid var(--md-sys-color-outline);
  background-color: var(--md-sys-color-surface-container-low);
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s, background-color 0.3s;
  box-sizing: border-box;
  border-radius: 8px;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  box-shadow: 0 0 0 3px hsla(210, 80%, 55%, 0.2);
  background-color: var(--md-sys-color-surface-bright);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--md-sys-color-on-surface-variant);
  opacity: 0.6;
}

.input-error {
  border-color: var(--md-sys-color-error);
  color: var(--md-sys-color-error);
}
</style>