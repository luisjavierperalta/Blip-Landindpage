import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Zap, 
  MapPin, 
  Shield, 
  Clock, 
  Users, 
  Star, 
  Gift, 
  Lock,
  ChevronDown,
  Smartphone,
  X,
  Check
} from "lucide-react";

interface EarlyAccessData {
  email: string;
  phone: string;
  interests: string;
}

interface StatsData {
  waitlistUsers: number;
  successfulMeetups: number;
  avgMeetupTime: string;
}

export default function Landing() {
  const [formData, setFormData] = useState<EarlyAccessData>({
    email: "",
    phone: "",
    interests: ""
  });
  const [showFloatingCTA, setShowFloatingCTA] = useState(true);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const { toast } = useToast();

  // Fetch stats
  const { data: stats } = useQuery<StatsData>({
    queryKey: ["/api/stats"],
  });

  // Early access signup mutation
  const signupMutation = useMutation({
    mutationFn: async (data: EarlyAccessData) => {
      const response = await apiRequest("POST", "/api/early-access", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Welcome to @Blip! 🎉",
        description: "You're now on our early access waitlist. We'll be in touch soon!",
      });
      setFormData({ email: "", phone: "", interests: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Oops!",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.phone || !formData.interests) {
      toast({
        title: "Please fill in all fields",
        description: "We need all information to add you to the waitlist.",
        variant: "destructive",
      });
      return;
    }
    signupMutation.mutate(formData);
  };

  const scrollToSignup = () => {
    document.getElementById("early-access")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const signupSection = document.getElementById("early-access");
      if (signupSection) {
        const rect = signupSection.getBoundingClientRect();
        setShowFloatingCTA(rect.top > window.innerHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const faqItems = [
    {
      question: "Is @Blip safe to use?",
      answer: "Yes! Every user must verify their identity with government-issued ID. We also have built-in safety features like location sharing with trusted contacts and in-app reporting."
    },
    {
      question: "How is this different from Tinder?",
      answer: "Unlike Tinder's appearance-based swiping, @Blip matches you based on shared interests and real-time availability. It's about what you want to do together, not just how you look."
    },
    {
      question: "When will the app be available?",
      answer: "We're launching the beta version in Q2 2024. Early access users will be the first to try it out and shape the final product with their feedback."
    },
    {
      question: "Will it work in my city?",
      answer: "We're starting with major US cities and expanding globally based on demand. Join the waitlist to vote for your city to be next!"
    },
    {
      question: "Is there a cost to use @Blip?",
      answer: "@Blip will be free to use with optional premium features. Early access users get 3 months of premium features at no cost."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <Zap className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-bold text-gray-900">@Blip</span>
          </div>
          <Button 
            size="sm" 
            className="gradient-primary text-white rounded-full"
            onClick={scrollToSignup}
          >
            Get Early Access
          </Button>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="gradient-primary text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="relative max-w-md mx-auto px-4 py-12 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <div className="inline-flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live Now</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold leading-tight mb-4">
                Meet People <span className="text-yellow-300">Now</span>, Not Later
              </h1>
              <p className="text-lg text-gray-100 mb-8 leading-relaxed">
                Skip the endless swiping. Connect instantly with verified people nearby who share your interests and are ready to meet right now.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Friends jogging together" 
                className="rounded-2xl shadow-2xl w-full h-48 object-cover"
              />
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                <MapPin className="w-3 h-3 inline mr-1" />
                0.2 mi away
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button 
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-50 font-bold py-4 px-8 rounded-full text-lg shadow-xl w-full mb-4"
                onClick={scrollToSignup}
              >
                <Zap className="mr-2 w-5 h-5" />
                Join the Waitlist
              </Button>
              
              <p className="text-sm text-gray-200">
                <Shield className="w-4 h-4 inline mr-1" />
                Gov-ID verified • 100% safe • Real people
              </p>
            </motion.div>
          </div>
        </section>

        {/* Problem Solution */}
        <section className="bg-white py-12">
          <div className="max-w-md mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why @Blip?</h2>
              <p className="text-gray-600">Traditional apps focus on looks. We focus on <span className="font-semibold text-purple-600">what you want to do right now</span>.</p>
            </motion.div>

            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <X className="text-white w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-800 mb-1">Traditional Dating Apps</h3>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Endless swiping based on photos</li>
                      <li>• Matches who never meet up</li>
                      <li>• Weeks of messaging before meeting</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-green-50 border border-green-200 rounded-xl p-4"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap className="text-white w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">@Blip's Approach</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Match by shared interests & activity</li>
                      <li>• Meet within minutes, not days</li>
                      <li>• Real-time GPS for instant connections</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-md mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">How It Works</h2>
              <p className="text-gray-600">From opening the app to meeting someone new in minutes</p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: "Set Your Vibe",
                  description: "Choose what you want to do: jog, game, grab coffee, explore the city, or just hang out.",
                  image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=200",
                  color: "bg-purple-600"
                },
                {
                  step: 2,
                  title: "Get Matched Instantly",
                  description: "Our AI finds verified people nearby with similar interests who are available right now.",
                  image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=200",
                  color: "bg-purple-500"
                },
                {
                  step: 3,
                  title: "Meet & Have Fun",
                  description: "Head to the suggested meetup spot and enjoy your shared activity with new friends.",
                  image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=200",
                  color: "bg-green-500"
                }
              ].map((item, index) => (
                <motion.div 
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4"
                >
                  <div className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold">{item.step}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="rounded-lg w-full h-32 object-cover"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-white py-12">
          <div className="max-w-md mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Why People Love @Blip</h2>
              <p className="text-gray-600">Built for real connections, not endless scrolling</p>
            </motion.div>

            <div className="grid gap-4">
              {[
                {
                  icon: MapPin,
                  title: "Real-Time GPS Matching",
                  description: "Advanced algorithm matches you with people nearby who share your interests and are available right now.",
                  gradient: "gradient-primary"
                },
                {
                  icon: Shield,
                  title: "Gov-ID Verified Safety",
                  description: "Every user is verified with government ID. Meet real people, not fake profiles or catfish accounts.",
                  gradient: "gradient-accent"
                },
                {
                  icon: Clock,
                  title: '"Here and Now" Experience',
                  description: "No more planning meetups weeks in advance. Connect and meet within minutes for spontaneous fun.",
                  gradient: "gradient-warning"
                },
                {
                  icon: Users,
                  title: "Activity-Based Connections",
                  description: "Match based on what you want to do together, not just how you look. Build real friendships and connections.",
                  gradient: "gradient-purple-pink"
                }
              ].map((feature, index) => (
                <motion.div 
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`${feature.gradient} p-6 rounded-xl text-white`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <feature.icon className="w-6 h-6" />
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-gray-100">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-md mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Join the Movement</h2>
              <p className="text-gray-600">Thousands are already connecting in real life</p>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats?.waitlistUsers?.toLocaleString() || "12,847"}
                </div>
                <div className="text-xs text-gray-600">On Waitlist</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats?.successfulMeetups?.toLocaleString() || "3,429"}
                </div>
                <div className="text-xs text-gray-600">Real Meetups</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">
                  {stats?.avgMeetupTime || "4.2min"}
                </div>
                <div className="text-xs text-gray-600">Avg Match Time</div>
              </div>
            </motion.div>

            {/* Testimonials */}
            <div className="space-y-4">
              {[
                {
                  name: "Alex M.",
                  initial: "A",
                  text: "Met my running buddy through @Blip. We've been jogging together every morning for 3 weeks now!",
                  gradient: "gradient-primary"
                },
                {
                  name: "Sarah K.",
                  initial: "S",
                  text: "Finally an app where people actually want to meet up! Found my gaming crew within minutes.",
                  gradient: "gradient-accent"
                }
              ].map((testimonial, index) => (
                <motion.div 
                  key={testimonial.name}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white p-4 rounded-xl shadow-sm border"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 ${testimonial.gradient} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-bold text-sm">{testimonial.initial}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-sm">{testimonial.name}</span>
                        <div className="flex text-yellow-400 text-xs">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">"{testimonial.text}"</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Early Access */}
        <section id="early-access" className="gradient-primary py-12 text-white">
          <div className="max-w-md mx-auto px-4 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-2">Get Early Access</h2>
              <p className="text-gray-100 mb-4">Be among the first to experience real-time social connections</p>
              
              <div className="inline-flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2 mb-6">
                <Gift className="w-4 h-4 mr-2 text-yellow-300" />
                <span className="text-sm font-medium">Early users get 3 months premium free</span>
              </div>
            </motion.div>

            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              onSubmit={handleSignup}
              className="space-y-4"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-gray-900 placeholder-gray-500 border-0"
                required
              />
              
              <Input
                type="tel"
                placeholder="Phone number (for verification)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-gray-900 placeholder-gray-500 border-0"
                required
              />

              <Select value={formData.interests} onValueChange={(value) => setFormData({ ...formData, interests: value })}>
                <SelectTrigger className="w-full px-4 py-3 rounded-xl text-gray-900 border-0">
                  <SelectValue placeholder="What interests you most?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fitness">Fitness & Running</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="socializing">Socializing & Parties</SelectItem>
                  <SelectItem value="outdoor">Outdoor Activities</SelectItem>
                  <SelectItem value="food">Food & Drinks</SelectItem>
                  <SelectItem value="arts">Arts & Culture</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                type="submit"
                disabled={signupMutation.isPending}
                className="bg-white text-purple-600 hover:bg-gray-50 font-bold py-4 px-8 rounded-xl text-lg shadow-xl w-full"
              >
                {signupMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2" />
                    Adding you to waitlist...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 w-5 h-5" />
                    Join Waitlist
                  </>
                )}
              </Button>
            </motion.form>

            <p className="text-xs text-gray-200 mt-4">
              <Lock className="w-3 h-3 inline mr-1" />
              We respect your privacy. No spam, ever.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-12">
          <div className="max-w-md mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
              <p className="text-gray-600">Everything you need to know about @Blip</p>
            </motion.div>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-semibold text-gray-900">{item.question}</span>
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        openFAQ === index ? 'transform rotate-180' : ''
                      }`} 
                    />
                  </button>
                  <AnimatePresence>
                    {openFAQ === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4">
                          <p className="text-sm text-gray-600">{item.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="max-w-md mx-auto px-4 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <Zap className="text-white w-4 h-4" />
                </div>
                <span className="text-xl font-bold">@Blip</span>
              </div>
              <p className="text-gray-400 text-sm">Meet people now, not later</p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 rounded-xl p-3 h-auto">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 rounded-xl p-3 h-auto">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </div>
              </Button>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <p className="text-xs text-gray-500">
                © 2024 @Blip. All rights reserved. | 
                <button className="hover:text-white ml-1">Privacy</button> | 
                <button className="hover:text-white ml-1">Terms</button>
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* Floating CTA */}
      <AnimatePresence>
        {showFloatingCTA && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto"
          >
            <Button 
              onClick={scrollToSignup}
              className="gradient-primary text-white font-bold py-3 px-6 rounded-full shadow-2xl w-full"
            >
              <Zap className="mr-2 w-4 h-4" />
              Join {stats?.waitlistUsers?.toLocaleString() || "12,847"}+ People on Waitlist
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
