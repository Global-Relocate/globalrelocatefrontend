import { Button } from "@/components/ui/button";
import { FaCheckCircle } from "react-icons/fa";
import PropTypes from 'prop-types';

const PricingCard = ({ title, price, isCurrentPlan, features, buttonText }) => (
  <div className={`p-8 rounded-lg border ${isCurrentPlan ? 'bg-[#F6F6F6]' : 'bg-white'}`}>
    <div className="mb-8">
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <div className="flex items-end gap-1">
        <span className="text-2xl font-semibold">${price}</span>
        <span className="text-gray-600">/per month</span>
      </div>
    </div>

    <div className="mb-4">
      <p className="text-gray-600">For everyone</p>
    </div>

    <div className="space-y-4 mb-8">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center gap-2">
          <FaCheckCircle className="text-[#7981DD] flex-shrink-0" />
          <span className="text-gray-600">{feature}</span>
        </div>
      ))}
    </div>

    <Button
      variant={isCurrentPlan ? "outline" : "default"}
      className={`w-full ${!isCurrentPlan ? 'bg-[#FCA311] hover:bg-[#FCA311]/90' : ''}`}
    >
      {buttonText}
    </Button>
  </div>
);

PricingCard.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  isCurrentPlan: PropTypes.bool.isRequired,
  features: PropTypes.arrayOf(PropTypes.string).isRequired,
  buttonText: PropTypes.string.isRequired,
};

const Upgrade = () => {
  const plans = [
    {
      title: "Free",
      price: "0",
      isCurrentPlan: true,
      features: [
        "3-day trial access",
        "Basic country information",
        "Community access (read-only)",
        "Limited tax calculator",
        "Basic cost comparison"
      ],
      buttonText: "Your current plan"
    },
    {
      title: "Premium",
      price: "100",
      isCurrentPlan: false,
      features: [
        "All Basic features",
        "Unlimited country data access",
        "Full community participation",
        "Advanced tax calculator",
        "AI relocation assistant",
        "Cost of living insights",
        "Visa requirement guides",
        "Priority support",
        "Custom relocation roadmap"
      ],
      buttonText: "Get started"
    },
    {
      title: "Basic",
      price: "5",
      isCurrentPlan: false,
      features: [
        "Full country information",
        "Community participation",
        "Complete tax calculator",
        "Cost comparison tools",
        "Basic relocation guides",
        "Email support"
      ],
      buttonText: "Get Started"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold mb-4">Upgrade your plan</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan to support your global relocation journey. Get access to comprehensive tools and insights to make your move seamless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
