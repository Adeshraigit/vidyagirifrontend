import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
    return (
      <div className="min-h-screen bg-[#f0f9f0] flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-lg border-emerald-100">
          <CardHeader className="bg-emerald-600 text-white text-center rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Contact Us</CardTitle>
            <CardDescription className="text-emerald-50">We&apos;d love to hear from you! Reach out with any questions.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center space-x-4">
              <Mail className="w-6 h-6 text-emerald-700" />
              <span className="text-lg text-emerald-900">support@varklearning.com</span>
            </div>
            <div className="flex items-center space-x-4">
              <Phone className="w-6 h-6 text-emerald-700" />
              <span className="text-lg text-emerald-900">1-800-LEARN-VARK</span>
            </div>
            <div className="flex items-center space-x-4">
              <MapPin className="w-6 h-6 text-emerald-700" />
              <span className="text-lg text-emerald-900">123 Education Ave, Learning City</span>
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Send Us a Message</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  