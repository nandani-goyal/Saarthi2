
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HealthLibrary = () => {
  const healthTopics = [
    {
      id: 1,
      title: "Understanding PCOS",
      description: "Learn about Polycystic Ovary Syndrome, its symptoms, and management strategies.",
      icon: "🔴",
      category: "Hormonal Health"
    },
    {
      id: 2,
      title: "Preventing UTIs",
      description: "Simple steps to prevent urinary tract infections and maintain urogenital health.",
      icon: "🧫",
      category: "Hygiene"
    },
    {
      id: 3,
      title: "Contraception Guide",
      description: "Comprehensive guide to different contraceptive methods and their effectiveness.",
      icon: "🚫",
      category: "Family Planning"
    },
    {
      id: 4,
      title: "Menstrual Health",
      description: "Everything you need to know about healthy menstrual cycles and period care.",
      icon: "🩸",
      category: "Reproductive Health"
    }
  ];

  const selfCareTools = [
    {
      title: "Period Pain Relief",
      description: "Natural remedies and exercises for menstrual cramps",
      icon: "🧘‍♀️"
    },
    {
      title: "Hygiene Checklist",
      description: "Daily routine for optimal reproductive health",
      icon: "🧼"
    },
    {
      title: "Symptom Tracker",
      description: "Track your symptoms and cycles digitally",
      icon: "📊"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Health Library Header */}
      <Card className="bg-gradient-to-r from-[#fff7f2] to-[#fde0e0] border-[#fde0e0]">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-[#5c3b28] mb-2">Gyno Guide & Health Library</h2>
            <p className="text-[#5c3b28]/80">
              Comprehensive resources for women's reproductive health and wellness
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Health Topics */}
      <div>
        <h3 className="text-xl font-semibold text-[#5c3b28] mb-4 flex items-center space-x-2">
          <span>💡</span>
          <span>Health Topics & Articles</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {healthTopics.map((topic) => (
            <Card key={topic.id} className="bg-[#fff7f2] border-[#fde0e0] hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <CardTitle className="text-[#5c3b28] flex items-center space-x-3">
                  <span className="text-2xl">{topic.icon}</span>
                  <div>
                    <div>{topic.title}</div>
                    <div className="text-sm font-normal text-[#2f9e44]">{topic.category}</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#5c3b28]/80 text-sm mb-4">{topic.description}</p>
                <Button 
                  variant="outline" 
                  className="w-full border-[#e03131] text-[#e03131] hover:bg-[#e03131] hover:text-white rounded-full"
                >
                  Read Article
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Self-Care Tools */}
      <div>
        <h3 className="text-xl font-semibold text-[#5c3b28] mb-4 flex items-center space-x-2">
          <span>🧘‍♀️</span>
          <span>Self-Care Tools</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {selfCareTools.map((tool, index) => (
            <Card key={index} className="bg-[#fff7f2] border-[#fde0e0] hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">{tool.icon}</div>
                <h4 className="font-semibold text-[#5c3b28] mb-2">{tool.title}</h4>
                <p className="text-[#5c3b28]/80 text-sm mb-4">{tool.description}</p>
                <Button 
                  size="sm" 
                  className="bg-[#2f9e44] hover:bg-[#2f9e44]/90 text-white rounded-full"
                >
                  Try Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Health Tips Carousel */}
      <Card className="bg-gradient-to-r from-[#2f9e44]/10 to-[#339af0]/10 border-[#fde0e0]">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-[#5c3b28] mb-4 flex items-center space-x-2">
            <span>🌟</span>
            <span>Daily Health Tip</span>
          </h3>
          <div className="bg-white rounded-lg p-4 border border-[#fde0e0]">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">💧</div>
              <div>
                <h4 className="font-medium text-[#5c3b28] mb-1">Stay Hydrated</h4>
                <p className="text-[#5c3b28]/80 text-sm">
                  Drinking enough water helps prevent UTIs and supports overall reproductive health. 
                  Aim for 8-10 glasses of water daily, especially during your menstrual cycle.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthLibrary;
