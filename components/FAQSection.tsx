import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border border-orange-500/20 rounded-lg bg-neutral-900 overflow-hidden">
      <button
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-neutral-800 transition-colors duration-200"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="text-lg text-white hover:text-orange-500 transition-colors duration-200">{question}</span>
        <ChevronDown 
          className={`w-5 h-5 text-orange-500 transition-transform duration-200 ease-in-out ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 py-4 text-gray-400 bg-neutral-800/50">{answer}</div>
        </div>
      </div>
    </div>
  );
};

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData = [
    {
      question: "How does Beyond The Checkout work?",
      answer: (
        <>
          It's simple! We generate unique QR codes that you place on your products. 
          When customers scan them, they unlock <span className="text-orange-500 font-semibold">Bitcoin rewards, 
          interactive experiences, and real-time engagement</span>—turning every purchase 
          into an opportunity to build loyalty and collect valuable insights.
        </>
      )
    },
    {
      question: "What types of products work best with BTC?",
      answer: (
        <div>
          <p className="mb-4">Any product that customers <span className="text-orange-500 font-semibold">buy and consume regularly</span> is a great fit! This includes:</p>
          <ul className="list-none space-y-2">
            <li>✅ <span className="text-orange-500 font-semibold">Food & Beverage</span> (Energy bars, snacks, drinks, coffee)</li>
            <li>✅ <span className="text-orange-500 font-semibold">Health & Wellness</span> (Supplements, personal care items)</li>
            <li>✅ <span className="text-orange-500 font-semibold">Retail & E-commerce</span> (Merch, clothing, digital goods)</li>
            <li>✅ <span className="text-orange-500 font-semibold">Bitcoin & Crypto Brands</span> (Engage your audience in a unique way!)</li>
          </ul>
          <p className="mt-4">If your product is <span className="text-orange-500 font-semibold">sold and consumed, we can make it interactive!</span> 🚀</p>
        </div>
      )
    },
    {
      question: "How fast can I get started?",
      answer: (
        <div>
          <p className="mb-4">Instantly! You can <span className="text-orange-500 font-semibold">generate QR codes today</span> and start testing in minutes.</p>
          <ul className="list-none space-y-2">
            <li><span className="text-orange-500 font-semibold">Step 1:</span> Add BTC-generated QR codes to your product packaging.</li>
            <li><span className="text-orange-500 font-semibold">Step 2:</span> Customers scan & interact.</li>
            <li><span className="text-orange-500 font-semibold">Step 3:</span> You collect insights & drive engagement.</li>
          </ul>
          <p className="mt-4">No complicated setup, no coding—just <span className="text-orange-500 font-semibold">plug & play rewards!</span></p>
        </div>
      )
    },
    {
      question: "What makes Beyond The Checkout different?",
      answer: (
        <div>
          <p className="mb-4">Unlike traditional loyalty programs, we combine:</p>
          <ul className="list-none space-y-2">
            <li>✅ <span className="text-orange-500 font-semibold">Bitcoin Rewards</span> – Real, valuable incentives for your customers.</li>
            <li>✅ <span className="text-orange-500 font-semibold">Interactive Gamification</span> – Keep customers engaged beyond the purchase.</li>
            <li>✅ <span className="text-orange-500 font-semibold">Actionable Insights</span> – Get real-time data on product usage & customer behavior.</li>
            <li>✅ <span className="text-orange-500 font-semibold">No Middlemen</span> – You control the experience, direct-to-customer.</li>
          </ul>
          <p className="mt-4">It's not just a reward—it's a <span className="text-orange-500 font-semibold">brand experience upgrade!</span></p>
        </div>
      )
    },
    {
      question: "Do I need to commit long-term?",
      answer: (
        <div>
          <p className="mb-4"><span className="text-orange-500 font-semibold">Nope!</span> There's no long-term commitment required.</p>
          <ul className="list-none space-y-2">
            <li>• Start with a <span className="text-orange-500 font-semibold">small batch of products</span> and test.</li>
            <li>• See how customers engage.</li>
            <li>• <span className="text-orange-500 font-semibold">Scale when you're ready!</span></li>
          </ul>
          <p className="mt-4">Low risk, <span className="text-orange-500 font-semibold">high upside for your brand.</span> 🎯</p>
        </div>
      )
    },
    {
      question: "How do the Bitcoin rewards work?",
      answer: (
        <>
          Each scanned QR code unlocks a <span className="text-orange-500 font-semibold">random amount of Bitcoin</span>, 
          from a few sats to high-value rewards. You set the parameters based on your marketing strategy. 
          Customers always win something, keeping them engaged and coming back. 🔥
        </>
      )
    },
    {
      question: "Can I track customer behavior & insights?",
      answer: (
        <div>
          <p className="mb-4">Absolutely! Every scan gives you:</p>
          <ul className="list-none space-y-2">
            <li>📊 <span className="text-orange-500 font-semibold">Real-time data</span> on who, when, and where customers engage.</li>
            <li>📦 <span className="text-orange-500 font-semibold">Product consumption insights</span>—know how often customers buy & scan.</li>
            <li>🛍️ <span className="text-orange-500 font-semibold">Retention metrics</span>—see how engaged your audience is over time.</li>
          </ul>
          <p className="mt-4">Think of it as <span className="text-orange-500 font-semibold">reward-driven analytics</span> that fuels smarter marketing. 🚀</p>
        </div>
      )
    }
  ];

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
          Frequently Asked <span className="text-orange-500">Questions</span>
        </h2>
        <div className="text-center mb-12">
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to know about Beyond The Checkout
            <span className="text-orange-500">.</span>
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqData.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;