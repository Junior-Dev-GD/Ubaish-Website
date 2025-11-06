import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Admissions = () => {
  const requirements = [
    "Completion of Basic Education Certificate Examination (BECE)",
    "Maximum aggregate score of 30 or less",
    "Birth certificate or valid identification",
    "Two recent passport-size photographs",
    "Medical examination report",
    "Parent/Guardian consent form",
  ];

  const faqs = [
    {
      question: "When does registration for new students begin?",
      answer: "Registration typically begins in September for the following academic year. Check our announcements for specific dates.",
    },
    {
      question: "What is the admission process through CSSPS?",
      answer: "UBAISH participates in the Computerized School Selection and Placement System. Students should select UBASS as one of their preferred schools during CSSPS registration.",
    },
    {
      question: "Are boarding facilities available?",
      answer: "Yes, UBAISH offers both boarding and day student options. Boarding facilities are available for students from outside Asawinso.",
    },
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl font-bold mb-4 text-primary">Admissions</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Begin your journey to excellence at UBAISH
          </p>
        </div>

        {/* Admission Process */}
        <section className="mb-16">
          <Card className="shadow-elegant bg-gradient-subtle">
            <CardContent className="p-8">
              <h2 className="font-serif text-3xl font-bold mb-6 text-primary">Admission Process</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold shrink-0">1</div>
                  <div>
                    <h3 className="font-semibold mb-1">Select UBAISH via CSSPS</h3>
                    <p className="text-muted-foreground">Choose Uthman Bin Affan Islamic SHS during your CSSPS registration</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold shrink-0">2</div>
                  <div>
                    <h3 className="font-semibold mb-1">Receive Placement</h3>
                    <p className="text-muted-foreground">Check your CSSPS results for placement confirmation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold shrink-0">3</div>
                  <div>
                    <h3 className="font-semibold mb-1">Complete Registration</h3>
                    <p className="text-muted-foreground">Visit campus with required documents to complete registration</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold shrink-0">4</div>
                  <div>
                    <h3 className="font-semibold mb-1">Begin Your Journey</h3>
                    <p className="text-muted-foreground">Attend orientation and start classes</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Requirements */}
        <section className="mb-16">
          <h2 className="font-serif text-3xl font-bold mb-8 text-primary">Admission Requirements</h2>
          <Card className="shadow-card">
            <CardContent className="p-8">
              <ul className="space-y-4">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Fees */}
        <section className="mb-16">
          <Card className="shadow-card">
            <CardContent className="p-8">
              <h2 className="font-serif text-3xl font-bold mb-6 text-primary">School Fees</h2>
              <p className="text-muted-foreground mb-6">
                Download our comprehensive fee structure document for detailed information about tuition, boarding fees, and other costs.
              </p>
              <Button className="bg-gradient-hero hover:opacity-90">
                <Download className="h-4 w-4 mr-2" />
                Download Fee Structure 2024/2025
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* FAQs */}
        <section>
          <h2 className="font-serif text-3xl font-bold mb-8 text-primary">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <h3 className="font-semibold">{faq.question}</h3>
                  </div>
                  <p className="text-muted-foreground pl-8">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">Have more questions?</p>
            <Link to="/contact">
              <Button variant="outline">Contact Us</Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Admissions;
