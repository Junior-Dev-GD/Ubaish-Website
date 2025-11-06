import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, TrendingUp } from "lucide-react";

const Academics = () => {
  const programs = [
    { name: "General Science", description: "Physics, Chemistry, Biology, Mathematics, English" },
    { name: "General Arts I", description: "Literature, History, Geography, Economics, Religious Studies" },
    { name: "General Arts II", description: "Literature, History, Geography, Economics, Religious Studies" },
    { name: "General Arts III", description: "Literature, History, Geography, Economics, Religious Studies" },
    { name: "General Agric", description: "Chemistry, Mathematics, Forestry, Economics, Religious Studies" },
    { name: "Business", description: "Business Management, Accounting, Economics, Mathematics" },
    { name: "Home Economics", description: "Food & Nutrition, Clothing & Textiles, Management in Living" },
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl font-bold mb-4 text-primary">Academics</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive programs designed for academic excellence and future success
          </p>
        </div>

        {/* Programs */}
        <section className="mb-16">
          <h2 className="font-serif text-3xl font-bold mb-8 text-primary">Academic Programs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {programs.map((program, index) => (
              <Card key={index} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <h3 className="font-semibold text-xl">{program.name}</h3>
                  </div>
                  <p className="text-muted-foreground">{program.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* WAEC Results */}
        <section className="mb-16">
          <Card className="shadow-elegant bg-gradient-subtle">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="h-8 w-8 text-primary" />
                <h2 className="font-serif text-3xl font-bold text-primary">WAEC Performance</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                UBASS consistently achieves outstanding results in WAEC examinations, with our students demonstrating excellence across all subject areas.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-card rounded-lg shadow-card">
                  <div className="text-4xl font-bold text-primary mb-2">85%</div>
                  <div className="text-sm text-muted-foreground">Pass Rate (2023)</div>
                </div>
                <div className="text-center p-4 bg-card rounded-lg shadow-card">
                  <div className="text-4xl font-bold text-primary mb-2">82%</div>
                  <div className="text-sm text-muted-foreground">Grades A1-B3 (2023)</div>
                </div>
                <div className="text-center p-4 bg-card rounded-lg shadow-card">
                  <div className="text-4xl font-bold text-primary mb-2">Top 15</div>
                  <div className="text-sm text-muted-foreground">Regional Ranking</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Academic Calendar */}
        <section>
          <Card className="shadow-card">
            <CardContent className="p-8">
              <h2 className="font-serif text-3xl font-bold mb-6 text-primary">Academic Calendar</h2>
              <p className="text-muted-foreground mb-6">
                Download our academic calendar to stay informed about important dates, examinations, and school events throughout the year.
              </p>
              <Button className="bg-gradient-hero hover:opacity-90">
                <Download className="h-4 w-4 mr-2" />
                Download Calendar 2024/2025
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Academics;
