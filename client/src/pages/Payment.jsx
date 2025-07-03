
// import React, { useEffect, useRef, useState } from 'react';
// import PropTypes from 'prop-types';

// const BraintreeDropIn = ({
//   clientToken,
//   onPaymentSuccess,
//   onError,
//   styles = {},
//   paymentOptions = {}
// }) => {
//   const [instance, setInstance] = useState(null);
//   const [status, setStatus] = useState('loading'); // 'loading', 'ready', 'error'
//   const containerRef = useRef(null);
//   const braintreeInitialized = useRef(false);

//   const SELF_HOSTED_URL = '/static/braintree-web-drop-in.min.js';


// const CDN_SOURCES = [
//     'https://js.braintreegateway.com/web/drop-in/1.33.0/js/dropin.min.js',
//     'https://cdn.jsdelivr.net/npm/braintree-web-drop-in@1.33.0/dist/web/dropin.min.js',
//     SELF_HOSTED_URL // Last resort fallback
//   ];

//   // Load Braintree script
//   useEffect(() => {
//     let script;
//     let mounted = true;

//     const loadScript = (sourceIndex = 0) => {
//       if (sourceIndex >= CDN_SOURCES.length) {
//         handleError('All CDN sources failed to load');
//         return;
//       }

//       script = document.createElement('script');
//       script.src = CDN_SOURCES[sourceIndex];
//       script.async = true;
//       script.onload = () => {
//         if (mounted) {
//           braintreeInitialized.current = true;
//           setStatus('ready');
//         }
//       };
//       script.onerror = () => {
//         loadScript(sourceIndex + 1);
//       };

//       document.body.appendChild(script);
//     };

//     const initializeDropin = () => {
//       if (!window.braintree || !containerRef.current || !clientToken) {
//         setTimeout(initializeDropin, 100);
//         return;
//       }

//       try {
//         window.braintree.dropin.create({
//           authorization: clientToken,
//           container: containerRef.current,
//           ...paymentOptions,
//           paypal: {
//             flow: 'vault',
//             ...paymentOptions.paypal
//           }
//         }, (err, dropinInstance) => {
//           if (!mounted) return;

//           if (err) {
//             handleError(err.message);
//             return;
//           }

//           setInstance(dropinInstance);
//           setStatus('initialized');
//         });
//       } catch (err) {
//         handleError(err.message);
//       }
//     };

//     const handleError = (error) => {
//       if (!mounted) return;
//       console.error('Braintree Error:', error);
//       setStatus('error');
//       if (onError) onError(error);
//     };

//     if (!braintreeInitialized.current) {
//       loadScript();
//     } else {
//       setStatus('ready');
//     }

//     return () => {
//       mounted = false;
//       if (script) document.body.removeChild(script);
//       if (instance) {
//         instance.teardown()
//           .then(() => console.log('Braintree cleaned up'))
//           .catch(err => console.error('Cleanup error:', err));
//       }
//     };
//   }, [clientToken]);

//   const handlePayment = async () => {
//     try {
//       const { nonce, details } = await instance.requestPaymentMethod();
//       if (onPaymentSuccess) onPaymentSuccess(nonce, details);
//     } catch (err) {
//       console.error('Payment Error:', err);
//       if (onError) onError(err);
//     }
//   };

//   // Container styles with defaults
//   const containerStyles = {
//     minHeight: '300px',
//     border: '1px solid #eee',
//     borderRadius: '4px',
//     padding: '20px',
//     ...styles.container
//   };

//   // Button styles with defaults
//   const buttonStyles = {
//     marginTop: '20px',
//     padding: '10px 20px',
//     backgroundColor: '#007bff',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     ...styles.button
//   };

//   return (
//     <div className="braintree-container">
//       {status === 'error' ? (
//         <div className="error-message">
//           Payment system unavailable. Please try again later.
//         </div>
//       ) : (
//         <>
//           <div
//             ref={containerRef}
//             style={containerStyles}
//             data-testid="dropin-container"
//           />

//           {status === 'initialized' && (
//             <button
//               onClick={handlePayment}
//               style={buttonStyles}
//               disabled={status !== 'initialized'}
//             >
//               Complete Payment
//             </button>
//           )}
//         </>
//       )}

//       {status === 'loading' && (
//         <div className="loading-indicator">Loading payment system...</div>
//       )}
//     </div>
//   );
// };

// BraintreeDropIn.propTypes = {
//   clientToken: PropTypes.string.isRequired,
//   onPaymentSuccess: PropTypes.func,
//   onError: PropTypes.func,
//   styles: PropTypes.shape({
//     container: PropTypes.object,
//     button: PropTypes.object
//   }),
//   paymentOptions: PropTypes.object
// };

// export default BraintreeDropIn;