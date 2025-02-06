import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, LineChart, Brain } from "lucide-react";

const features = [
  {
    title: "Interactive Stories",
    description: "Create engaging learning experiences through interactive storytelling and decision-based simulations.",
    icon: BookOpen,
  },
  {
    title: "Social Learning",
    description: "Learn together with peers, share experiences, and compare different learning paths.",
    icon: Users,
  },
  {
    title: "Analytics",
    description: "Track progress and gain insights into learning patterns with detailed analytics.",
    icon: LineChart,
  },
  {
    title: "Adaptive Learning",
    description: "Experience personalized learning paths that adapt to your choices and progress.",
    icon: Brain,
  },
];

export function Features() {
  return (
    <section className="container py-24">
      <div className="text-center mb-16">
        <h2 className="font-outfit text-3xl font-bold sm:text-4xl mb-4 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
          Why Choose RonuNest?
        </h2>
        <p className="text-muted-foreground">
          Discover a new way of learning through interactive storytelling
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature) => (
          <Card key={feature.title} className="border-2 hover:border-primary-500 transition-colors">
            <CardHeader>
              <feature.icon className="w-10 h-10 text-primary-600 mb-4" />
              <CardTitle className="font-outfit">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}