import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-[#f0f9f0] flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-lg border-emerald-100">
        <CardHeader className="bg-emerald-600 text-white text-center rounded-t-lg">
          <CardTitle className="text-2xl font-bold">About VARK Learning Styles</CardTitle>
          <CardDescription className="text-emerald-50">
            Understanding how you learn best can transform your education and career success.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-emerald-900 text-lg leading-relaxed">
            VARK (Visual, Aural, Read/Write, Kinesthetic) is a widely used model that categorizes learning preferences.
            Our platform helps individuals discover their unique learning styles and provides resources to enhance their
            learning journey.
          </p>
          <p className="text-emerald-900 mt-4 text-lg">
            Whether you're a student, educator, or lifelong learner, knowing your VARK preference can help you
            optimize information retention and make learning more effective.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}