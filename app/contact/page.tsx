'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: 'MERN Fullstack With AI',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', program: 'MERN Fullstack With AI', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl my-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Contact Sky Blip Academy</h2>

      {status === 'success' && (
        <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-lg">
          Thank you! Your inquiry has been saved to our records.
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          Something went wrong. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900">Full Name *</label>
          <input
            type="text"
            required
            className="w-full border p-2 rounded-md text-gray-900"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">Email Address *</label>
          <input
            type="email"
            required
            className="w-full border p-2 rounded-md text-gray-700"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">Phone Number *</label>
          <input
            required
            type="number"
            className="w-full border p-2 rounded-md text-gray-700"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">Program Interest</label>
          <select
            className="w-full border p-2 rounded-md bg-white text-gray-700"
            value={formData.program}
            onChange={(e) => setFormData({ ...formData, program: e.target.value })}
          >
            <option value="MERN Fullstack With AI">MERN Fullstack With AI</option>
            <option value="Cyber Security (Ethical Hacking)">Cyber Security (Ethical Hacking)</option>
            <option value="Python Fullstack With AI">Python Fullstack With AI</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">Message</label>
          <textarea
            rows={4}
            className="w-full border p-2 rounded-md"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md disabled:opacity-50"
        >
          {status === 'loading' ? 'Saving...' : 'Submit Inquiry'}
        </button>
      </form>
    </div>
  );
}