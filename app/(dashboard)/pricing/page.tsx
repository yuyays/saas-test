import { checkoutAction } from "@/lib/payments/actions";
import { Check } from "lucide-react";
import { getStripePrices, getStripeProducts } from "@/lib/payments/stripe";
import { SubmitButton } from "./submit-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
  const [prices, products] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
  ]);

  const basePlan = products.find((product) => product.name === "Base");
  const plusPlan = products.find((product) => product.name === "Plus");

  const basePrice = prices.find((price) => price.productId === basePlan?.id);
  const plusPrice = prices.find((price) => price.productId === plusPlan?.id);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-8 max-w-xl mx-auto">
        <PricingCard
          name={basePlan?.name || "Base"}
          price={basePrice?.unitAmount || 800}
          interval={basePrice?.interval || "month"}
          trialDays={basePrice?.trialPeriodDays || 7}
          features={[
            "Unlimited Usage",
            "Unlimited Workspace Members",
            "Email Support",
          ]}
          priceId={basePrice?.id}
        />
        <PricingCard
          name={plusPlan?.name || "Plus"}
          price={plusPrice?.unitAmount || 1200}
          interval={plusPrice?.interval || "month"}
          trialDays={plusPrice?.trialPeriodDays || 7}
          features={[
            "Everything in Base, and:",
            "Early Access to New Features",
            "24/7 Support + Slack Access",
          ]}
          priceId={plusPrice?.id}
        />
      </div>
    </main>
  );
}

function PricingCard({
  name,
  price,
  interval,
  trialDays,
  features,
  priceId,
}: {
  name: string;
  price: number;
  interval: string;
  trialDays: number;
  features: string[];
  priceId?: string;
}) {
  const isPlus = name.toLowerCase() === "plus";
  return (
    <Card
      className={`group flex flex-col h-full shadow-lg rounded-2xl border transition-all duration-200 ${
        isPlus
          ? "border-primary/70 ring-2 ring-primary/30 bg-gradient-to-br from-primary/10 to-white"
          : "border-muted bg-white"
      } hover:scale-[1.025] focus-within:ring-2 focus-within:ring-primary/60`}
      tabIndex={0}
      aria-label={`${name} plan`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          {name}
          {isPlus && (
            <Badge
              variant="outline"
              className="ml-1 bg-primary/10 text-primary border-primary/30"
            >
              Best Value
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-xs text-gray-500">
          {trialDays} day free trial
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-2 py-2">
        <span className="text-4xl font-extrabold text-gray-900">
          {(price / 100).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </span>
        <span className="text-sm text-gray-600 mb-4">per {interval}</span>
        <ul className="space-y-2 mt-2">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-center text-gray-700 text-sm"
            >
              <Check className="w-4 h-4 text-primary mr-2" aria-hidden />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="mt-auto pt-4">
        <form action={checkoutAction} className="w-full">
          <input type="hidden" name="priceId" value={priceId} />
          <Button
            type="submit"
            size="lg"
            className="w-full"
            variant={isPlus ? "default" : "outline"}
          >
            Start {name} Plan
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
