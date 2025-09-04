import Paystack from 'paystack-node';

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY!, process.env.NODE_ENV);

export default paystack;