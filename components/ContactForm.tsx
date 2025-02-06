import { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from 'lucide-react';

interface FormData {
  name: string;
  company: string;
  product: string;
  email: string;
  message: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    company: '',
    product: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
        Ready to Unlock detailed Post Purchase Analytics, <br />by Transform Your Customer Experience?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join innovative brands using Beyond The Checkout to build lasting customer relationships through Bitcoin incentives & product gamification.
        </p>
        
        <Card className="max-w-2xl mx-auto bg-white backdrop-blur-sm border-white/10">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <h2 className="text-xl md:text-4xl font-bold mb-6">
        Contact Us
        </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-left">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Satoshi Nakamoto"
                  className="w-full px-4 py-2 rounded-lg bg-black/10 border border-white/20 text-black"
                  required
                />
              </div>
              <div className="text-left">
                <label className="block text-sm font-medium mb-1">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="21 Club"
                  className="w-full px-4 py-2 rounded-lg bg-black/10 border border-white/20 text-black"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-left">
                <label className="block text-sm font-medium mb-1">Product</label>
                <input
                  type="text"
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  placeholder="Energy Bar"
                  className="w-full px-4 py-2 rounded-lg bg-black/10 border border-white/20 text-black"
                  required
                />
              </div>
              <div className="text-left">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Satoshi@21Club.com"
                  className="w-full px-4 py-2 rounded-lg bg-black/10 border border-white/20 text-black"
                  required
                />
              </div>
            </div>
            
            <div className="text-left">
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Drop us a line and tell us a few words about you and your product"
                className="w-full px-4 py-2 rounded-lg bg-black/10 border border-white/20 text-black h-32"
                required
              />
            </div>
            
            <Button type="submit" className="bg-black hover:bg-neutral-900 text-white px-8 py-6 text-lg rounded-full w-full md:w-auto">
              Send Contact Form <ChevronRight className="ml-2" />
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default ContactForm;