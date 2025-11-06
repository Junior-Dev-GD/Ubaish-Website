import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

const News = () => {
  const newsItems = [
    {
      title: "UBAISH Students Excel in Regional Science Competition",
      date: "October 15, 2024",
      category: "Achievement",
      excerpt: "Our science students brought home top honors at the Western Regional Science Competition...",
    },
    {
      title: "New Computer Lab Inauguration Ceremony",
      date: "October 10, 2024",
      category: "Facilities",
      excerpt: "State-of-the-art computer laboratory equipped with 40 modern workstations now available...",
    },
    {
      title: "Annual Islamic Week Celebration",
      date: "October 5, 2024",
      category: "Event",
      excerpt: "Students and staff participated in week-long activities celebrating Islamic heritage and values...",
    },
  ];

  const upcomingEvents = [
    { title: "Inter-House Sports Competition", date: "November 15-17, 2024" },
    { title: "Parent-Teacher Association Meeting", date: "November 20, 2024" },
    { title: "End of Term Examination", date: "December 5-15, 2024" },
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl font-bold mb-4 text-primary">News & Events</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay updated with the latest happenings at UBAISH
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* News Feed */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-serif text-3xl font-bold text-primary mb-6">Latest News</h2>
            {newsItems.map((item, index) => (
              <Card key={index} className="shadow-card hover:shadow-elegant transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                      {item.category}
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {item.date}
                    </span>
                  </div>
                  <h3 className="font-semibold text-xl mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Events */}
            <Card className="shadow-card sticky top-24">
              <CardContent className="p-6">
                <h2 className="font-serif text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                  <Clock className="h-6 w-6" />
                  Upcoming Events
                </h2>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <h3 className="font-semibold mb-1">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="shadow-card">
              <CardContent className="p-6">
                <h2 className="font-serif text-2xl font-bold text-primary mb-4">Follow Us</h2>
                <p className="text-muted-foreground mb-4">
                  Stay connected with UBASS on Facebook for real-time updates and community engagement.
                </p>
                <a
                  href="#"
                  className="text-primary hover:text-primary/80 font-semibold"
                >
                  Visit Our Facebook Page →
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
