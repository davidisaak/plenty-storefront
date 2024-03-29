import { toRefs } from '@vueuse/shared';
import type {
  UseProductRecommendedReturn,
  UseProductRecommendedState,
  FetchProductRecommended,
} from '~/composables/useProductRecommended/types';
import { useSdk } from '~/sdk';

/**
 * Composable for getting recommended products data
 * @param {string} slug Product slug
 */
export const useProductRecommended: UseProductRecommendedReturn = (categoryId: string) => {
  const state = useState<UseProductRecommendedState>(`useProductRecommended-${categoryId}`, () => ({
    data: [],
    loading: false,
  }));

  /** Function for fetching product recommended data
   * @example
   * fetchProductRecommended('product-slug');
   * @param categoryId
   */
  const fetchProductRecommended: FetchProductRecommended = async (categoryId: string) => {
    state.value.loading = true;
    const payload = {
      categoryId: categoryId,
      itemsPerPage: 20,
      sort: 'sorting.price.avg_asc',
    };

    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getFacet(payload));
    useHandleError(error.value);
    state.value.data = data?.value?.data?.products ?? state.value.data;
    state.value.loading = false;
    return state.value.data;
  };

  return {
    fetchProductRecommended,
    ...toRefs(state.value),
  };
};
