import { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, Calendar, ArrowRight, ChevronDown } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FormData {
  name: string;
  company: string;
  product: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  company?: string;
  product?: string;
  email?: string;
  message?: string;
}

const ContactSection = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    company: '',
    product: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        return value.length < 2 ? 'Name must be at least 2 characters long' : '';
      case 'company':
        return value.length < 2 ? 'Company name must be at least 2 characters long' : '';
      case 'product':
        return value.length < 2 ? 'Product name must be at least 2 characters long' : '';
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email address' : '';
      case 'message':
        return value.length < 10 ? 'Message must be at least 10 characters long' : '';
      default:
        return '';
    }
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, formData[name as keyof FormData]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const isFormValid = (): boolean => {
    // Check if all required fields are filled
    const allFieldsFilled = Object.values(formData).every(value => value.trim() !== '');
    
    // Check if there are no existing errors
    const noErrors = Object.keys(errors).length === 0;
    
    // Check if all fields meet minimum requirements
    const allFieldsValid = Object.entries(formData).every(([key, value]) => {
      return validateField(key, value) === '';
    });

    return allFieldsFilled && allFieldsValid;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormData>).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    setTouched(allTouched);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Here you would typically send the data to your backend
      console.log('Form submitted:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitSuccess(true);
      // Reset form
      setFormData({
        name: '',
        company: '',
        product: '',
        email: '',
        message: ''
      });
      setTouched({});
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBooking = (calendlyUrl: string) => {
    window.open(calendlyUrl, '_blank');
  };

  const renderField = (
    name: keyof FormData,
    label: string,
    placeholder: string,
    type: string = 'text'
  ) => {
    const error = touched[name] && errors[name];
    
    return (
      <div className="text-left">
        <label className="block text-sm font-medium mb-1">{label}</label>
        {type === 'textarea' ? (
          <textarea
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`w-full px-4 py-2 rounded-lg bg-black/10 border ${
              error ? 'border-red-500' : 'border-white/20'
            } text-black h-32 transition-colors`}
            required
          />
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`w-full px-4 py-2 rounded-lg bg-black/10 border ${
              error ? 'border-red-500' : 'border-white/20'
            } text-black transition-colors`}
            required
          />
        )}
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    );
  };

  return (
    <section className="container mx-auto px-4 py-20 text-center">
      {/* Contact Form Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 mb-12 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Add Rewards & Analytics to Your Product?
        </h2>
        <p className="text-xl mb-4 max-w-2xl mx-auto">
          Join top brands using Beyond The Checkout to boost sales, build loyal customers, and turn products into rewarding experiences.
        </p>
        
        <Card className="max-w-2xl mx-auto bg-white backdrop-blur-sm border-white/10 mb-4">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <h2 className="text-xl md:text-4xl font-bold mb-2">
              Let's Talk About Your Product
            </h2>
            <p className="text-sm mb-8 text-gray-500 max-w-2xl mx-auto">
              Tell us about your product, and we'll show you how to add rewards & analytics effortlessly.
            </p>
            
            {submitSuccess && (
              <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                <AlertDescription>
                  Thanks for reaching out! We'll get back to you soon.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('name', 'Name', 'Satoshi Nakamoto')}
              {renderField('company', 'Company', '21 Club')}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('product', 'Product', 'Energy Bar')}
              {renderField('email', 'Email', 'Satoshi@21Club.com', 'email')}
            </div>
            
            {renderField('message', 'Message', 'Tell us about your product, goals, and any questions you have!', 'textarea')}
            
            <div className="mt-6">
              <Button 
                type="submit" 
                disabled={isSubmitting || !isFormValid()}
                className={`bg-black hover:bg-neutral-700 text-white px-8 py-7 text-lg rounded-full w-full md:w-auto transition-colors duration-200 ${
                  isSubmitting || !isFormValid() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Let\'s Talk About Your Product'} <ChevronRight className="ml-2" />
              </Button>
            </div>
          </form>
        </Card>
        <p className="text-md text-white italic mb-4 max-w-2xl mx-auto">
          ✅ No commitments. Just insights & ideas for your brand!
        </p>
      </div>

      {/* Transition Section */}
      <div className="max-w-3xl mx-auto mb-6 text-center">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px bg-orange-500 w-16"></div>
            <span className="text-orange-500">Prefer a hands-on demo instead?</span>
            <div className="h-px bg-orange-500 w-16"></div>
          </div>
          <ChevronDown className="w-5 h-5 text-orange-500 animate-bounce" />
        </div>
      </div>

      {/* Book a Call Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Book a Call & Get a Personalized Demo
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Skip the emails—pick a time that works for you and get a live walkthrough of how we can add rewards & analytics to your product.
        </p>
        
        <Card className="max-w-2xl mx-auto bg-white backdrop-blur-sm border-white/10 mb-4 p-8">
          <div className="flex flex-col items-center gap-6">
            <Calendar className="w-16 h-16 text-orange-500" />
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Choose Your Session Length</h3>
              <p className="text-gray-600 mb-6">
                Select the duration that best fits your needs
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => handleBooking('https://calendly.com/oliver-checkout/30min?back=1')}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-7 text-lg rounded-full w-72"
                >
                  30-Minute Demo <ChevronRight className="ml-2" />
                </Button>
                <Button 
                  onClick={() => handleBooking('https://calendly.com/oliver-checkout/30-minute-meeting-clone?back=1')}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-7 text-lg rounded-full w-72"
                >
                  60-Minute Deep Dive <ChevronRight className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
        <p className="text-md text-white italic mb-4 max-w-2xl mx-auto">
          ✅ Free consultation. No obligations. Pick a time that works for you!
        </p>
      </div>
    </section>
  );
};

export default ContactSection;