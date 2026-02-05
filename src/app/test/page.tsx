'use client';

export default function TestPage() {
  return (
    <div className="min-h-screen p-8 space-y-8">
      <h1 className="text-4xl font-bold">Color Test Page</h1>
      
      {/* Test gradients */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Brand Gradients</h2>
        
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-xl font-playfair">
            <span className="gold-gradient">ShamBit Gold Gradient</span>
          </h3>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-xl font-playfair">
            <span className="midnight-gradient">ShamBit Midnight Gradient</span>
          </h3>
        </div>
        
        <div className="p-4 sacred-gradient rounded-lg">
          <h3 className="text-xl font-playfair text-slate-900">Sacred Background Gradient</h3>
        </div>
      </div>
      
      {/* Test buttons */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Button Styles</h2>
        
        <button className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-medium px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300">
          Primary Button
        </button>
        
        <button className="border-2 border-yellow-600 text-slate-900 font-medium px-8 py-3 rounded-xl hover:bg-yellow-600 hover:text-white transition-all duration-300 ml-4">
          Secondary Button
        </button>
      </div>
      
      {/* Test typography */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Typography</h2>
        
        <h1 className="font-playfair text-4xl font-semibold text-slate-900">
          Playfair Display Heading
        </h1>
        
        <p className="font-inter text-lg text-gray-700">
          Inter body text with proper spacing and readability.
        </p>
        
        <p className="font-noto-devanagari text-lg text-gray-700">
          Noto Serif Devanagari for Sanskrit text.
        </p>
      </div>
    </div>
  );
}