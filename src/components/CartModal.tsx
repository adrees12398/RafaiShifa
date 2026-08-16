import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { createOrder } from '../lib/firebase';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  CheckCircle, 
  Truck, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  User, 
  CreditCard, 
  ArrowRight,
  RefreshCw 
} from 'lucide-react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery'>('Cash on Delivery');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 2000 || cartItems.length === 0 ? 0 : 200;
  const totalPrice = subtotal + deliveryFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg('Please fill in your name, phone number, and delivery address.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        cartItems: cartItems.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        totalPrice: totalPrice,
        paymentMethod: paymentMethod,
        notes: notes.trim()
      };

      const order = await createOrder(orderPayload);
      
      // Reset submitting state immediately after success
      setIsSubmitting(false);
      
      setCompletedOrder(order);
      onClearCart();
      setStep('success');
      
      // Show browser notification to admin (if supported)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🛍️ New Order Received!', {
          body: `Order ${order.orderId} from ${order.customerName} - Rs. ${order.totalPrice}`,
          icon: '/products/LiverBoost.jpeg',
          tag: order.orderId
        });
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setErrorMsg('Failed to submit order. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setStep('cart');
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2F3428]/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-[#F9F9F6] w-full sm:max-w-md md:max-w-lg h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-[#A1A696]/30 relative">
        
        {/* Header */}
        <div className="bg-[#525A43] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#A1A696]/30">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#A1A696] text-[#2F3428] flex items-center justify-center font-bold shrink-0">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 fill-[#2F3428]/20" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-base sm:text-lg font-serif truncate">
                {step === 'cart' && 'Your Shopping Cart'}
                {step === 'checkout' && 'Checkout & Delivery'}
                {step === 'success' && 'Order Confirmed!'}
              </h2>
              <p className="text-[10px] sm:text-xs text-[#A1A696]">
                {cartItems.length} item(s) selected
              </p>
            </div>
          </div>

          <button 
            onClick={handleResetAndClose}
            className="p-1.5 sm:p-2 rounded-lg text-[#A1A696] hover:text-white hover:bg-[#3F4633] transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* STEP 1: CART ITEMS */}
          {step === 'cart' && (
            <>
              {cartItems.length === 0 ? (
                <div className="text-center py-12 sm:py-16 space-y-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-[#A1A696]/20 flex items-center justify-center text-[#525A43]">
                    <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#2F3428]">Your cart is empty</h3>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    Browse our authentic Tib-e-Nabvi and Unani herbal medicines to start shopping.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-[#525A43] text-white font-bold text-xs hover:bg-[#3F4633] transition-colors"
                  >
                    Explore Products
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div 
                      key={item.product.id}
                      className="bg-white p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-stone-200/80 shadow-sm flex items-center gap-2 sm:gap-3"
                    >
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl object-cover bg-stone-100 shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#2F3428] text-[11px] sm:text-xs truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-[#525A43] font-medium font-serif mt-0.5 truncate">
                          {item.product.urduName}
                        </p>
                        <div className="text-xs font-extrabold text-[#525A43] mt-1">
                          Rs. {item.product.price}
                        </div>
                      </div>

                      {/* Quantity & Delete */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-stone-400 hover:text-red-500 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>

                        <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="p-0.5 sm:p-1 text-stone-600 hover:bg-stone-200"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-1.5 sm:px-2 text-[11px] sm:text-xs font-bold text-[#2F3428]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="p-0.5 sm:p-1 text-stone-600 hover:bg-stone-200"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Free Shipping Progress */}
                  <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-[#A1A696]/40 text-[11px] sm:text-xs text-[#2F3428] flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#525A43] shrink-0" />
                    {subtotal >= 2000 ? (
                      <span className="font-bold text-[#525A43]">
                        🎉 Free Nationwide Delivery Applied!
                      </span>
                    ) : (
                      <span>
                        Add <b>Rs. {2000 - subtotal}</b> more for FREE Shipping!
                      </span>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 2: CHECKOUT FORM */}
          {step === 'checkout' && (
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
              
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-3 bg-white p-4 rounded-2xl border border-stone-200">
                <h3 className="text-xs font-bold text-[#2F3428] uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                  <User className="w-4 h-4 text-[#525A43]" />
                  <span>Customer Information</span>
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-[#2F3428] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Muhammad Usman"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs text-[#2F3428] focus:ring-2 focus:ring-[#A1A696] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2F3428] mb-1">
                    Phone Number (WhatsApp) *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0300 4652599"
                      className="w-full px-3 py-2 pl-8 rounded-lg border border-stone-300 text-xs text-[#2F3428] focus:ring-2 focus:ring-[#A1A696] focus:outline-none"
                    />
                    <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2F3428] mb-1">
                    Full Delivery Address *
                  </label>
                  <div className="relative">
                    <textarea
                      required
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House/Street #, Colony, City (e.g., Gulberg III, Lahore)"
                      className="w-full px-3 py-2 text-xs text-[#2F3428] rounded-lg border border-stone-300 focus:ring-2 focus:ring-[#A1A696] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3 bg-white p-4 rounded-2xl border border-stone-200">
                <h3 className="text-xs font-bold text-[#2F3428] uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                  <CreditCard className="w-4 h-4 text-[#525A43]" />
                  <span>Payment Method</span>
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-[#525A43] bg-[#525A43]/10 font-semibold text-[#2F3428] text-xs">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="payment"
                        checked={true}
                        readOnly
                        className="text-[#525A43] focus:ring-[#A1A696]"
                      />
                      <span>Cash on Delivery (COD)</span>
                    </div>
                    <span className="text-[10px] bg-[#525A43] text-white px-2 py-0.5 rounded font-mono">
                      ONLY METHOD
                    </span>
                  </div>

                  <div className="p-3 bg-[#A1A696]/10 border border-[#A1A696]/30 rounded-xl text-[11px] text-[#2F3428] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#525A43] shrink-0" />
                    <span>Pay when you receive your order at your doorstep - safe and secure!</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2F3428] mb-1">
                    Special Instructions / Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g., Deliver before 5 PM"
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs text-[#2F3428]"
                  />
                </div>
              </div>

            </form>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {step === 'success' && completedOrder && (
            <div className="text-center py-6 space-y-5">
              {/* Success Animation */}
              <div className="relative">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#A1A696] to-[#525A43] text-white flex items-center justify-center shadow-2xl animate-bounce">
                  <CheckCircle className="w-12 h-12" />
                </div>
                {/* Confetti effect */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-4xl animate-ping opacity-30">🎉</div>
                </div>
              </div>

              {/* Success Message */}
              <div className="space-y-3">
                <div className="inline-block">
                  <span className="text-xs font-bold text-white uppercase tracking-widest bg-[#525A43] px-4 py-2 rounded-full border-2 border-[#A1A696] shadow-lg">
                    ✅ Order Confirmed!
                  </span>
                </div>
                
                <h3 className="text-2xl font-extrabold text-[#2F3428] font-serif">
                  JazakAllah Khair! 🤲
                </h3>
                
                <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  Your order has been successfully placed. Our team will contact you shortly on <strong className="text-[#525A43]">{completedOrder.phone}</strong> to confirm delivery details.
                </p>
              </div>

              {/* Order Summary Box */}
              <div className="bg-gradient-to-br from-white to-[#F9F9F6] p-5 rounded-2xl border-2 border-[#A1A696]/40 text-left text-xs space-y-3 shadow-xl">
                <div className="flex justify-between items-center pb-3 border-b-2 border-[#A1A696]/20">
                  <span className="text-stone-500 font-semibold">Order ID:</span>
                  <span className="font-mono font-extrabold text-[#525A43] bg-[#A1A696]/20 px-3 py-1 rounded-lg text-sm">
                    {completedOrder.orderId}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Customer Name:</span>
                  <span className="font-bold text-[#2F3428]">{completedOrder.customerName}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Phone:</span>
                  <span className="font-semibold text-[#2F3428] font-mono">{completedOrder.phone}</span>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t-2 border-[#A1A696]/20">
                  <span className="text-stone-600 font-semibold">Total Amount:</span>
                  <span className="font-extrabold text-[#525A43] text-lg">Rs. {completedOrder.totalPrice}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Status:</span>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#525A43] text-white border border-[#A1A696]">
                    {completedOrder.status}
                  </span>
                </div>
              </div>

              {/* Info Alert */}
              <div className="p-4 bg-white border-2 border-[#A1A696]/40 rounded-xl text-xs text-[#2F3428] flex items-start gap-3 text-left shadow-sm">
                <ShieldCheck className="w-6 h-6 text-[#525A43] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-[#525A43]">What happens next?</p>
                  <p className="text-stone-700 leading-relaxed">
                    Our representative will call you at <strong>{completedOrder.phone}</strong> within 24 hours to confirm your order and delivery address. Your medicine will be delivered via Cash on Delivery.
                  </p>
                </div>
              </div>

              {/* Celebration Message */}
              <div className="pt-2">
                <p className="text-xs text-[#525A43] font-medium italic">
                  Thank you for choosing RafaiShifa - Natural Healing, Traditional Care 🌿
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Summary & Next Action Buttons */}
        <div className="bg-white p-5 border-t border-stone-200 space-y-3">
          
          {step === 'cart' && cartItems.length > 0 && (
            <>
              <div className="space-y-1 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-[#2F3428]">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>{deliveryFee === 0 ? <strong className="text-[#525A43]">FREE</strong> : `Rs. ${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-[#2F3428] pt-2 border-t">
                  <span>Total Payable:</span>
                  <span className="text-lg text-[#525A43]">Rs. {totalPrice}</span>
                </div>
              </div>

              <button
                onClick={() => setStep('checkout')}
                className="w-full py-3.5 px-6 rounded-xl bg-[#525A43] text-white hover:bg-[#3F4633] font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 'checkout' && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="py-3 px-4 rounded-xl border border-stone-300 text-[#2F3428] hover:bg-stone-100 font-bold text-xs"
              >
                Back to Cart
              </button>
              
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className={`flex-1 py-3.5 px-6 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isSubmitting 
                    ? 'bg-stone-400 cursor-not-allowed' 
                    : 'bg-[#525A43] hover:bg-[#3F4633] active:scale-95'
                } text-white`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirm Order (Rs. {totalPrice})</span>
                  </>
                )}
              </button>
            </div>
          )}

          {step === 'success' && (
            <button
              onClick={handleResetAndClose}
              className="w-full py-3.5 rounded-xl bg-[#525A43] text-white hover:bg-[#3F4633] font-bold text-xs shadow-md transition-all"
            >
              Continue Shopping
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
