<template>
  <div
    class="relative flex first:border-t border-b-[1px] border-neutral-200 hover:shadow-lg min-w-[320px] p-4 last:mb-0"
    data-testid="cart-product-card"
  >
    <div class="relative overflow-hidden rounded-md w-[100px] sm:w-[176px]">
      <SfLink
        :tag="NuxtLink"
        :to="`${paths.product}${cartGetters.getItemName(cartItem)}-${cartGetters.getVariationId(cartItem)}`"
      >
        <!-- TODO: replace default image with an appropriate one.-->
        <NuxtImg
          class="w-full h-auto border rounded-md border-neutral-200"
          :src="cartItemImage || '/images/product.webp'"
          :alt="cartItemImage || ''"
          width="300"
          height="300"
          loading="lazy"
          format="webp"
        />
      </SfLink>
    </div>
    <div class="flex flex-col pl-4 min-w-[180px] flex-1">
      <SfLink
        :tag="NuxtLink"
        :to="`${paths.product}${cartGetters.getItemName(cartItem)}-${cartGetters.getVariationId(cartItem)}`"
        variant="secondary"
        class="no-underline typography-text-sm sm:typography-text-lg"
      >
        {{ cartGetters.getItemName(cartItem) }}
      </SfLink>
      <div v-if="cartItem.variation">
        <BasePrice
          v-if="productGetters.showPricePerUnit(cartItem.variation)"
          :base-price="productGetters.getDefaultBasePrice(cartItem.variation)"
          :unit-content="productGetters.getUnitContent(cartItem.variation)"
          :unit-name="productGetters.getUnitName(cartItem.variation)"
        />
      </div>
      <div class="my-2 sm:mb-0">
        <ul class="text-xs font-normal leading-5 sm:typography-text-sm text-neutral-700">
          <li v-for="attribute in cartGetters.getItemAttributes(cartItem)" :key="attribute.name">
            <span class="mr-1">{{ attribute.label }}:</span>
            <span class="font-medium">{{ attribute.value }}</span>
          </li>
        </ul>
      </div>
      <div class="items-start sm:items-center sm:mt-auto flex flex-col sm:flex-row">
        <span
          v-if="prices.special"
          class="text-secondary-700 sm:order-1 font-bold typography-text-sm sm:typography-text-lg sm:ml-auto"
        >
          {{ $n(prices.special || 0, 'currency') }}
          <span class="text-neutral-500 ml-2 line-through typography-text-xs sm:typography-text-sm font-normal">
            {{ $n(prices.regular || 0, 'currency') }}
          </span>
        </span>
        <span v-else class="font-bold sm:ml-auto sm:order-1 typography-text-sm sm:typography-text-lg">
          {{ $n(prices.regular || 0, 'currency') }}
        </span>
        <UiQuantitySelector
          @change-quantity="debounceQuantity"
          :value="cartGetters.getItemQty(cartItem)"
          :min-value="1"
          class="mt-4 sm:mt-0"
        />
      </div>
    </div>
    <SfIconDelete class="cursor-pointer" @click="deleteItem" />
  </div>
</template>

<script setup lang="ts">
import { cartGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import { productGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import { SfLink, SfIconDelete } from '@storefront-ui/vue';
import _ from 'lodash';
import type { CartProductCardProps } from '~/components/ui/CartProductCard/types';

const { setCartItemQuantity, deleteCartItem } = useCart();

const props = defineProps<CartProductCardProps>();
const changeQuantity = async (quantity: string) => {
  await setCartItemQuantity({
    quantity: Number(quantity),
    cartItemId: props.cartItem.id,
    productId: props.cartItem.variationId,
  });
};
const deleteItem = async () => {
  await deleteCartItem({
    cartItemId: props.cartItem.id,
  });
};

const prices = computed(() => {
  return {
    special: cartGetters.getItemPrice(props.cartItem)?.special,
    regular: cartGetters.getItemPrice(props.cartItem)?.regular,
  };
});

const cartItemImage = computed(() => cartGetters.getItemImage(props.cartItem));

const debounceQuantity = _.debounce(changeQuantity, 500);

const NuxtLink = resolveComponent('NuxtLink');
</script>
