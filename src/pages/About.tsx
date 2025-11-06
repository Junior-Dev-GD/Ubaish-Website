import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Award } from "lucide-react";

const About = () => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl font-bold mb-4 text-primary">About UBAISH</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A legacy of excellence in Islamic education and academic achievement
          </p>
        </div>

        {/* History */}
        <section className="mb-16">
          <Card className="shadow-card">
            <CardContent className="p-8">
              <h2 className="font-serif text-3xl font-bold mb-6 text-primary">Our History</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Uthman Bin Affan Islamic Senior High School was established with a vision to provide quality Islamic education that combines spiritual development with academic excellence. Named after the third Caliph of Islam, our institution embodies the values of knowledge, integrity, and service.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Located in Kamgbunli, Western Region, UBAISH has grown to become a beacon of educational excellence, serving students from across Ghana and beyond. Our commitment to holistic education has produced graduates who excel in both academic pursuits and moral character.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-6 mb-16">
          <Card className="shadow-card">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary-foreground" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-primary">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To educate and equip students with the requisite knowledge, skills, social and religious values in a conducive environment with committed staff to render selfless service to the nation.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center">
                  <Eye className="h-6 w-6 text-foreground" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-primary">Our Vision</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The vision of the school is to become and remain a model Islamic school of excellence in all spheres of education and to be among the best Senior High Schools in Ghana.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Core Values */}
        <section>
          <h2 className="font-serif text-3xl font-bold mb-8 text-center text-primary">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Excellence", description: "Striving for the highest standards in academics and character" },
              { title: "Integrity", description: "Upholding honesty and moral principles in all endeavors" },
              { title: "Faith", description: "Deepening Islamic knowledge and spiritual connection" },
              { title: "Respect", description: "Valuing diversity and treating all with dignity" },
              { title: "Service", description: "Contributing positively to community and society" },
              { title: "Innovation", description: "Embracing modern methods while preserving tradition" },
            ].map((value, index) => (
              <Card key={index} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">{value.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
