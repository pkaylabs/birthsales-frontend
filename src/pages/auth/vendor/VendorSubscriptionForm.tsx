import React, { useState } from 'react';

export default function VendorSubscriptionForm({ onPlanSelect }: any) {
  const [selectedPlan, setSelectedPlan] = useState('');

  const handlePlanChange = (e) => {
    const plan = e.target.value;
    setSelectedPlan(plan);
    onPlanSelect(plan); // Notify parent of the selected plan
  };

  return (
    <div className="p-4 border rounded">
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="plan"
            value="basic"
            checked={selectedPlan === 'basic'}
            onChange={handlePlanChange}
            className="form-radio"
          />
          <span className="ml-2">Basic Plan (GHC100/month)</span>
        </label>
      </div>
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="plan"
            value="pro"
            checked={selectedPlan === 'pro'}
            onChange={handlePlanChange}
            className="form-radio"
          />
          <span className="ml-2">Pro Plan (GHC300/month)</span>
        </label>
      </div>
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="plan"
            value="enterprise"
            checked={selectedPlan === 'enterprise'}
            onChange={handlePlanChange}
            className="form-radio"
          />
          <span className="ml-2">Enterprise Plan (GHC1000/month)</span>
        </label>
      </div>
    </div>
  );
}
