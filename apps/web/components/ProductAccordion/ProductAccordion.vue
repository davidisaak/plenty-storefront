<template>
  <div data-testid="product-accordion">
    <UiAccordionItem
      v-if="productGetters.getDescription(product)?.length"
      summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 pl-4 pr-3 flex justify-between items-center"
      v-model="productDetailsOpen"
    >
      <template #summary>
        <h2 class="font-bold font-headings text-lg leading-6 md:text-2xl">
          {{ $t('productDetails') }}
        </h2>
      </template>
      <div v-html="productGetters.getDescription(product)"></div>
    </UiAccordionItem>
    <UiAccordionItem
      v-if="productGetters.getTechnicalData(product)?.length"
      summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 pl-4 pr-3 flex justify-between items-center"
      v-model="technicalDataOpen"
    >
      <template #summary>
        <h2 class="font-bold font-headings text-lg leading-6 md:text-2xl">
          {{ $t('technicalData') }}
        </h2>
      </template>
      <div v-html="productGetters.getTechnicalData(product)"></div>
    </UiAccordionItem>
    <UiDivider class="my-4" />
  </div>
</template>

<script lang="ts" setup>
import { productGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import type { ProductAccordionPropsType } from '~/components/ProductAccordion/types';

const props = defineProps<ProductAccordionPropsType>();

const { product } = toRefs(props);

const productDetailsOpen = ref(true);
const technicalDataOpen = ref(false);
</script>
