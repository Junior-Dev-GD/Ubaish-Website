import { Card, CardContent } from "@/components/ui/card";
import { Users, Trophy, Music, BookOpen } from "lucide-react";

const StudentLife = () => {
  const clubs = [
    { icon: BookOpen, name: "Islamic Studies Club", description: "Deepen your understanding of Islam" },
    { icon: Trophy, name: "Sports Club", description: "Football, volleyball, athletics" },
    { icon: Music, name: "Arts & Culture Club", description: "Drama, poetry, traditional arts" },
    { icon: Users, name: "Debate Society", description: "Develop public speaking skills" },
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl font-bold mb-4 text-primary">Student Life</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience a vibrant community where learning extends beyond the classroom
          </p>
        </div>

        {/* Overview */}
        <section className="mb-16">
          <Card className="shadow-elegant bg-gradient-subtle">
            <CardContent className="p-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                At UBAISH, student life is rich with opportunities for personal growth, spiritual development, and social engagement. Our diverse range of clubs, sports activities, and cultural events ensures that every student finds their passion and builds lasting friendships while developing essential life skills.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Clubs */}
        <section className="mb-16">
          <h2 className="font-serif text-3xl font-bold mb-8 text-primary">Clubs & Societies</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clubs.map((club, index) => (
              <Card key={index} className="shadow-card hover:shadow-elegant transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                    <club.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{club.name}</h3>
                  <p className="text-sm text-muted-foreground">{club.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Facilities */}
        <section>
          <h2 className="font-serif text-3xl font-bold mb-8 text-primary">Facilities</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Modern Library", description: "Extensive collection of books and digital resources" },
              { title: "Science Laboratories", description: "Well-equipped labs for physics, chemistry, and biology" },
              { title: "Sports Facilities", description: "Football field, Volleyball court, table tennis court, and Handball court" },
              { title: "Computer Lab", description: "40 modern workstations with internet access" },
              { title: "Mosque", description: "Dedicated space for daily prayers and Islamic studies" },
              { title: "Boarding Houses", description: "Comfortable accommodation with 24/7 supervision" },
            ].map((facility, index) => (
              <Card key={index} className="shadow-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{facility.title}</h3>
                  <p className="text-muted-foreground">{facility.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentLife;
