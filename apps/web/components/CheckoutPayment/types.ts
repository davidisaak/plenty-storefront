import type { PaymentProviders } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';

export type CheckoutPaymentProps = {
  paymentMethods: PaymentProviders;
};

export type CheckoutPaymentEmits = (event: 'update:activePayment', paymentMethodId: number) => void;
