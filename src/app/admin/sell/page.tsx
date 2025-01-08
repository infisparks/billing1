// src/app/admin/sell/page.tsx
'use client';

import { useState, useEffect } from 'react';
import InputField from 'components/fields/InputField';
import { database, storage } from '../../../../firebase/firebaseConfig';
import { ref as dbRef, push, onValue } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

import {
  FaBox,
  FaDollarSign,
  FaSortNumericDown,
  FaChartLine,
  FaPlus,
  FaTrash,
} from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

// --- Imports from your reference logic ---
import jsPDF from 'jspdf';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// -----------------------------------------

// 1) Convert an image (like letterhead) to Base64
async function getImageBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image at ${url}`);
    }
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result.toString());
        } else {
          reject('Failed to convert image to Base64.');
        }
      };
      reader.onerror = () => {
        reject('Failed to convert image to Base64.');
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    // If image fetching fails, return empty string to proceed without it
    return '';
  }
}

// 2) Upload PDF blob to Firebase Storage and get a public URL
async function uploadPDFToFirebaseStorage(pdfBlob: Blob, fileName: string): Promise<string> {
  try {
    // Create a storage reference
    const pdfRef = storageRef(storage, `invoices/${fileName}`);

    // Upload the PDF blob
    const snapshot = await uploadBytes(pdfRef, pdfBlob, {
      contentType: 'application/pdf',
    });

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading PDF to Firebase Storage:', error);
    throw error;
  }
}

// 3) Send WhatsApp message with the PDF link
function sendWhatsAppMessage(
  phoneNumber: string,
  message: string,
  mediaUrl: string,
  filename: string
) {
  // In your reference code, you used the API: https://adrika.aknexus.in/api/send
  // with query parameters. We'll replicate that logic here:
  const fullNumber = `91${phoneNumber}`; // Modify if needed based on country code
  const apiUrl = `https://adrika.aknexus.in/api/send`;

  // Create a hidden form to submit GET request to your API
  const form = document.createElement('form');
  form.method = 'GET';
  form.action = apiUrl;
  form.target = 'hidden_iframe';

  const params = {
    number: fullNumber,
    type: 'media',
    message,
    media_url: mediaUrl,
    filename,
    instance_id: '67278A2693C73', // Update if needed
    access_token: '67277e6184833', // Update if needed
  };

  Object.entries(params).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value as string;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

// 4) Create PDF with jsPDF, then upload to Firebase Storage and return URL
async function createAndUploadPDF(saleData: any, allProducts: any[]) {
  const doc = new jsPDF('p', 'mm', 'a4');
  try {
    // Optional: Add letterhead or background image
    // Ensure "/letterhead.png" exists in your public directory or adjust the path
    const imageBase64 = await getImageBase64('/letterhead.png');
    if (imageBase64) {
      // Adjust positioning & size as needed
      doc.addImage(imageBase64, 'PNG', 0, 0, 210, 297);
    }

    doc.setFontSize(16);
    doc.setTextColor(12, 29, 73);
    const leftMargin = 20;
    const rightMargin = 190;
    const topMargin = 50;
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(17);

    // Using saleData to fill in info
    doc.text(`Name: ${saleData.customerName}`, leftMargin, topMargin);
    doc.text(`Phone: ${saleData.customerPhone}`, leftMargin, topMargin + 10);

    const currentDate = new Date(saleData.timestamp).toLocaleDateString();
    doc.text(`Date: ${currentDate}`, rightMargin - 60, topMargin);

    // Payment Method (Printed below the date)
    doc.text(`Payment: ${saleData.paymentMethod}`, rightMargin - 60, topMargin + 10);

    // Table headers
    doc.setFontSize(16);
    let yPosition = topMargin + 30;
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(12, 29, 73);
    doc.text('Product', 25, yPosition, { align: 'left' });
    doc.text('Price (₹)', 160, yPosition, { align: 'right' });

    yPosition += 5;
    doc.setLineWidth(0.3);
    doc.line(leftMargin, yPosition, rightMargin, yPosition);
    yPosition += 10;

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(12, 29, 73);

    // List products
    saleData.products.forEach((prod: any, index: number) => {
      doc.text(`${index + 1}. ${prod.name}`, 25, yPosition, { align: 'left' });
      doc.text(`${prod.price.toFixed(2)}`, 160, yPosition, { align: 'right' });
      yPosition += 10;
    });

    // Subtotal, discount, total
    const subtotal = saleData.products.reduce(
      (acc: number, curr: any) => acc + curr.price,
      0
    );
    const discountAmount = saleData.discount || 0;
    const total = subtotal - discountAmount;

    yPosition += 5;
    doc.line(leftMargin, yPosition, rightMargin, yPosition);
    yPosition += 10;

    doc.text('Subtotal:', 130, yPosition, { align: 'right' });
    doc.text(`${subtotal.toFixed(2)}`, 160, yPosition, { align: 'right' });
    yPosition += 10;

    if (discountAmount > 0) {
      doc.text('Discount:', 130, yPosition, { align: 'right' });
      doc.text(`${discountAmount.toFixed(2)}`, 160, yPosition, {
        align: 'right',
      });
      yPosition += 10;
    }

    doc.setFont('Helvetica', 'bold');
    doc.text('Total:', 130, yPosition, { align: 'right' });
    doc.text(`${total.toFixed(2)}`, 160, yPosition, { align: 'right' });

    // Footer with Sweet Message
    yPosition += 20;
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'normal');
    doc.text('Thank you for your business!', 105, yPosition + 20, { align: 'center' });
    doc.text(
      `We appreciate your trust in us, ${saleData.customerName}. Have a wonderful day!`,
      105,
      yPosition + 30,
      { align: 'center' }
    );

    // Convert PDF to Blob
    const pdfBlob = doc.output('blob');

    // Construct a file name
    const fileName = `Invoice_${new Date().toISOString().replace(/:/g, '-')}.pdf`;

    // 2) Upload to Firebase Storage
    const uploadedURL = await uploadPDFToFirebaseStorage(pdfBlob, fileName);

    // Return the link and filename for WhatsApp
    return { downloadURL: uploadedURL, fileName };
  } catch (error) {
    console.error('Error generating/uploading PDF:', error);
    toast.error('Failed to generate or upload PDF.');
    return null;
  }
}

// -----------------------------------------------------------------

function AddProduct() {
  // Customer Details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Products State
  const [products, setProducts] = useState([
    { id: uuidv4(), name: '', price: 0 },
  ]);

  // Discount
  const [discount, setDiscount] = useState(0);

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'Online' | 'Cash'>('Cash');

  // Loading State
  const [isSubmitting, setIsSubmitting] = useState(false);

  // All Products from Firebase for Auto-Suggest
  const [allProducts, setAllProducts] = useState<any[]>([]);

  // Suggestions State
  const [suggestions, setSuggestions] = useState<{ [key: string]: any[] }>({});

  useEffect(() => {
    const productsRef = dbRef(database, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedProducts: any[] = [];
      for (let key in data) {
        loadedProducts.push({ id: key, ...data[key] });
      }
      setAllProducts(loadedProducts);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Handle Customer Phone Input to ensure 10 digits
  const handleCustomerPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow up to 10 digits
    if (/^\d{0,10}$/.test(value)) {
      setCustomerPhone(value);
    }
  };

  // Handle Product Name Input with Auto-Suggest
  const handleProductNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    const updatedProducts = [...products];
    updatedProducts[index].name = value;

    // Find suggestions
    if (value.length > 0) {
      const filtered = allProducts.filter((product) =>
        product.name.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions((prev) => ({
        ...prev,
        [updatedProducts[index].id]: filtered,
      }));
    } else {
      setSuggestions((prev) => ({
        ...prev,
        [updatedProducts[index].id]: [],
      }));
    }

    // Reset price if product name changes
    updatedProducts[index].price = 0;
    setProducts(updatedProducts);
  };

  // Handle Product Selection from Suggestions
  const handleProductSelect = (product: any, index: number) => {
    const updatedProducts = [...products];
    updatedProducts[index].name = product.name;
    updatedProducts[index].price = product.price;
    setProducts(updatedProducts);
    setSuggestions((prev) => ({ ...prev, [updatedProducts[index].id]: [] }));
  };

  // Handle Price Change
  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      const updatedProducts = [...products];
      updatedProducts[index].price = value === '' ? 0 : parseFloat(value);
      setProducts(updatedProducts);
    }
  };

  // Add More Product Rows
  const handleAddProduct = () => {
    setProducts([...products, { id: uuidv4(), name: '', price: 0 }]);
  };

  // Remove Product Row
  const handleRemoveProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
    setSuggestions((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  // Handle Discount Change
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setDiscount(Number(value));
    }
  };

  // Handle Payment Method Change
  const handlePaymentMethodChange = (method: 'Online' | 'Cash') => {
    setPaymentMethod(method);
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validation
    if (!customerName.trim()) {
      toast.error('Please fill in all customer details.');
      return;
    }

    if (customerPhone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number.');
      return;
    }

    if (products.length === 0) {
      toast.error('Please add at least one product.');
      return;
    }

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      if (!product.name.trim()) {
        toast.error(`Please enter the name for product ${i + 1}.`);
        return;
      }
      if (product.price <= 0) {
        toast.error(`Please enter a valid price for product ${i + 1}.`);
        return;
      }
    }

    // Optional: Validate Discount
    const subtotal = products.reduce((acc, curr) => acc + curr.price, 0);
    if (discount < 0) {
      toast.error('Discount cannot be negative.');
      return;
    }
    if (discount > subtotal) {
      toast.error('Discount cannot exceed the subtotal.');
      return;
    }

    // Calculate Total
    const total = subtotal - discount;

    const saleData = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      products: products.map((p) => ({
        name: p.name,
        price: p.price,
      })),
      discount,
      total,
      paymentMethod,
      timestamp: new Date().toISOString(),
    };

    try {
      setIsSubmitting(true);

      // 1) Push Sale to Firebase Realtime Database
      const salesRef = dbRef(database, 'sales');
      await push(salesRef, saleData);

      toast.success('Sale recorded successfully! Generating PDF...');

      // 2) Generate PDF, upload to Firebase Storage, then send via WhatsApp
      const pdfResult = await createAndUploadPDF(saleData, allProducts);
      if (pdfResult && pdfResult.downloadURL) {
        // Send WhatsApp message with PDF link
        sendWhatsAppMessage(
          customerPhone,
          `Hello ${customerName}, here is your invoice.`,
          pdfResult.downloadURL,
          pdfResult.fileName
        );
        toast.success('Invoice PDF sent via WhatsApp!');
      }

      // 3) Reset Form
      setCustomerName('');
      setCustomerPhone('');
      setDiscount(0);
      setPaymentMethod('Cash');
      setProducts([{ id: uuidv4(), name: '', price: 0 }]);
    } catch (error) {
      console.error('Error recording sale:', error);
      toast.error('Failed to record sale. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Toast container for notifications */}
      <ToastContainer />

      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="mb-6 text-3xl font-extrabold text-gray-900 dark:text-white text-center">
          Record New Sale
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Name */}
          <div className="relative">
            <FaBox className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <InputField
              variant="auth"
              extra="mb-3 pl-10"
              label="Customer Name*"
              placeholder="Enter customer name"
              id="customerName"
              type="text"
              value={customerName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCustomerName(e.target.value)
              }
              required
            />
          </div>

          {/* Customer Phone */}
          <div className="relative">
            <FaSortNumericDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <InputField
              variant="auth"
              extra="mb-3 pl-10"
              label="Customer Phone*"
              placeholder="Enter 10-digit phone number"
              id="customerPhone"
              type="text"
              value={customerPhone}
              onChange={handleCustomerPhoneChange}
              required
              
            />
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Method*
            </label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Online"
                  checked={paymentMethod === 'Online'}
                  onChange={() => handlePaymentMethodChange('Online')}
                  className="form-radio h-5 w-5 text-brand-600"
                  required
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Online</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash"
                  checked={paymentMethod === 'Cash'}
                  onChange={() => handlePaymentMethodChange('Cash')}
                  className="form-radio h-5 w-5 text-brand-600"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Cash</span>
              </label>
            </div>
          </div>

          {/* Products Selection */}
          <div className="space-y-4">
            {products.map((product, index) => (
              <div key={product.id} className="relative border p-4 rounded-md">
                {/* Product Name */}
                <div className="relative">
                  <FaBox className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <InputField
                    variant="auth"
                    extra="mb-3 pl-10"
                    label={`Product ${index + 1} Name*`}
                    placeholder="Start typing product name"
                    id={`productName-${product.id}`}
                    type="text"
                    value={product.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleProductNameChange(e, index)
                    }
                    required
                  />
                  {/* Suggestions Dropdown */}
                  {suggestions[product.id] && suggestions[product.id].length > 0 && (
                    <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 max-h-40 overflow-y-auto rounded-md shadow-lg">
                      {suggestions[product.id].map((suggestion) => (
                        <li
                          key={suggestion.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleProductSelect(suggestion, index)}
                        >
                          {suggestion.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Product Price (Editable) */}
                <div className="relative mt-2">
                  <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={product.price === 0 ? '' : product.price}
                    onChange={(e) => handlePriceChange(e, index)}
                    className="w-full px-4 py-2 text-lg border border-gray-300 rounded-lg pl-10"
                    placeholder="Enter product price"
                    required
                    min="0.01"
                    step="0.01"
                  />
                </div>

                {/* Remove Product Button */}
                {products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(product.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    aria-label="Remove product"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}

            {/* Add More Products Button */}
            <button
              type="button"
              onClick={handleAddProduct}
              className="flex items-center text-brand-500 hover:text-brand-600"
            >
              <FaPlus className="mr-2" /> Add More Products
            </button>
          </div>

          {/* Discount */}
          <div className="relative">
            <FaChartLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <InputField
              variant="auth"
              extra="mb-3 pl-10"
              label="Discount (₹)"
              placeholder="Enter discount amount"
              id="discount"
              type="number"
              value={discount}
              onChange={handleDiscountChange}
              min="0"
              step="0.01"
            />
          </div>

          {/* Sell Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-brand-500 hover:bg-brand-600 active:bg-brand-700'
              } 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition`}
          >
            {isSubmitting && (
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            )}
            {isSubmitting ? 'Processing...' : 'Sell'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Want to record another sale?
          </span>
          <a
            href="/"
            className="ml-2 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Go to Dashboard
          </a>
        </div>
      </div>

      {/* Hidden iframe for WhatsApp message submission */}
      <iframe
        name="hidden_iframe"
        style={{ display: 'none' }}
        title="hidden_iframe"
      />
    </div>
  );
}

export default AddProduct;
