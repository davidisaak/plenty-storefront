import { Address, AddressType } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import { toRefs } from '@vueuse/shared';
import { useSdk } from '~/sdk';
import {
  UseShippingAddressReturn,
  GetShippingAddresses,
  SaveShippingAddress,
  UseShippingAddressMethodsState,
} from './types';

/**
 * @description Composable for getting Shipping addresses from the current user session.
 * @example
 * const { data, loading, getShippingAddresses } = useShippingAddress();
 */

export const useShippingAddress: UseShippingAddressReturn = () => {
  const state = useState<UseShippingAddressMethodsState>('useShippingAddress', () => ({
    data: [] as Address[],
    saveAddress: null,
    loading: false,
  }));

  /**
   * @description Function for fetching Shipping addresses.
   * @example
   * getShippingAddresses();
   */
  const getShippingAddresses: GetShippingAddresses = async () => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() =>
      useSdk().plentysystems.getAddresses({
        typeId: AddressType.Shipping,
      }),
    );
    useHandleError(error.value);
    state.value.data = data.value?.data ?? state.value.data;
    state.value.loading = false;
    return state.value.data;
  };

  const saveShippingAddress: SaveShippingAddress = async (address: Address) => {
    state.value.loading = true;
    state.value.saveAddress = null;
    const { data, error } = await useAsyncData(() =>
      useSdk().plentysystems.doSaveAddress({
        typeId: AddressType.Shipping,
        addressData: address,
      }),
    );
    useHandleError(error.value);
    state.value.saveAddress = data.value?.data ?? state.value.saveAddress;
    state.value.loading = false;
    return state.value.saveAddress;
  };

  return {
    getShippingAddresses,
    saveShippingAddress,
    ...toRefs(state.value),
  };
};
