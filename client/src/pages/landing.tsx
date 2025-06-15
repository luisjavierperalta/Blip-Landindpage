import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import blipIconPath from "@assets/blip app icon v2 2025_084559_1749963579832.jpg";
import blipLogoPath from "@assets/logo_1749988451754.png";
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
  Check,
  Play,
  Sparkles,
  Eye
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
    <div className="min-h-screen bg-black overflow-x-hidden relative">
      {/* Ambient Background */}
      <div className="fixed inset-0 gradient-blip-dark opacity-90"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80"></div>
      
      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full opacity-30"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="glass-effect fixed top-0 left-0 right-0 z-50 border-b border-white/10">
        <div className="max-w-md mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={blipLogoPath} 
              alt="Blip Logo" 
              className="h-12 w-auto object-contain filter brightness-110 contrast-110"
            />
          </div>
          <Button 
            size="sm" 
            className="glass-effect hover:bg-white/20 text-white border-white/20 rounded-full font-semibold px-6"
            onClick={scrollToSignup}
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Join Beta
          </Button>
        </div>
      </header>

      <main className="pt-20 relative z-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-screen flex items-center">
          <div className="max-w-md mx-auto px-6 py-20 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              {/* Live Status Badge */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center glass-effect rounded-full px-6 py-3 mb-8 border border-white/20"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  <span className="text-white font-semibold">v1.0 BETA</span>
                  <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                  <span className="text-white/80 text-sm">Real-Time Vibes</span>
                </div>
              </motion.div>

              {/* Main Hero Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="space-y-6"
              >
                <h1 className="text-5xl font-bold leading-tight text-white text-shadow-glow">
                  Meet Instantly,
                  <br />
                  <span className="gradient-blip-primary bg-clip-text text-transparent">
                    in real-time.
                  </span>
                </h1>
                
                <p className="text-xl text-white/80 leading-relaxed max-w-sm mx-auto">
                  300m, Real-Time Vibes.
                  <br />
                  <span className="text-white/60 text-base">
                    Skip the endless swiping. Connect instantly with verified people nearby.
                  </span>
                </p>
              </motion.div>
            </motion.div>
            
            {/* Phone Mockup with App Preview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-12 relative"
            >
              <div className="relative mx-auto w-64 h-[500px] vision-blur">
                {/* Phone Frame */}
                <div className="absolute inset-0 glass-effect rounded-[3rem] border-2 border-white/20 shadow-2xl">
                  {/* Screen Content */}
                  <div className="absolute inset-3 bg-gradient-to-b from-purple-900 via-blue-900 to-black rounded-[2.5rem] overflow-hidden">
                    {/* App Interface */}
                    <div className="p-6 h-full flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-lg overflow-hidden">
                            <img src={blipIconPath} alt="Blip" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-orange-400 font-bold">blip</span>
                        </div>
                        <div className="text-white/60 text-sm">16</div>
                      </div>
                      
                      <div className="text-white mb-4">
                        <h3 className="font-semibold">Welcome</h3>
                        <p className="text-white/60 text-sm">Find new friends now, in real-time</p>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center space-x-2 text-orange-400 text-sm mb-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Live Activity Feed</span>
                        </div>
                        <div className="text-white/60 text-xs">
                          <span className="text-orange-400">Within 300m</span> Within 5km
                        </div>
                      </div>

                      {/* Activity Cards */}
                      <div className="grid grid-cols-2 gap-3 flex-1">
                        {[
                          { name: "Charlotte", activity: "Running", color: "bg-orange-500" },
                          { name: "Elija", activity: "Music Studio", color: "bg-purple-500" },
                          { name: "Maya", activity: "Coffee", color: "bg-pink-500" },
                          { name: "Alex", activity: "Gaming", color: "bg-blue-500" }
                        ].map((person, i) => (
                          <motion.div
                            key={person.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 + i * 0.1 }}
                            className="glass-effect rounded-2xl p-3 border border-white/10"
                          >
                            <div className={`w-8 h-8 ${person.color} rounded-lg mb-2`}></div>
                            <div className="text-white text-xs font-medium">{person.name}</div>
                            <div className="text-white/60 text-[10px]">{person.activity}</div>
                            <div className="w-4 h-4 bg-blue-500 rounded-full mt-1 flex items-center justify-center">
                              <Check className="w-2 h-2 text-white" />
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Bottom Navigation */}
                      <div className="flex justify-between items-center pt-4 border-t border-white/10">
                        <div className="text-white/60 text-xs">Home</div>
                        <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">25+</div>
                        <div className="text-white/60 text-xs">Search</div>
                        <div className="bg-blue-500 text-white text-xs px-1 py-1 rounded">5</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-8 glass-effect rounded-full px-3 py-2 border border-green-400/30"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs font-medium">0.2 mi</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-4 -left-8 glass-effect rounded-full px-3 py-2 border border-orange-400/30"
                >
                  <div className="flex items-center space-x-2">
                    <Users className="w-3 h-3 text-orange-400" />
                    <span className="text-orange-400 text-xs font-medium">25+ live</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="space-y-4"
            >
              <Button 
                size="lg"
                className="gradient-blip-primary hover:shadow-2xl hover:shadow-orange-500/25 font-bold py-4 px-8 rounded-full text-lg w-full mb-4 text-white border-0"
                onClick={scrollToSignup}
              >
                <Play className="mr-2 w-5 h-5" />
                Join Early Access
              </Button>
              
              <div className="flex items-center justify-center space-x-4 text-white/60 text-sm">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>Gov-ID verified</span>
                </div>
                <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>Real people</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problem Solution */}
        <section className="relative py-24">
          <div className="max-w-md mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-4 text-shadow-glow">Why blip?</h2>
              <p className="text-white/70 text-lg">Traditional apps focus on looks. We focus on <span className="gradient-blip-primary bg-clip-text text-transparent font-semibold">what you want to do right now</span>.</p>
            </motion.div>

            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="glass-card rounded-3xl p-6 border border-red-500/20"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-500/20 backdrop-blur rounded-2xl flex items-center justify-center flex-shrink-0">
                    <X className="text-red-400 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">Traditional Apps</h3>
                    <ul className="text-gray-700 space-y-2">
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                        <span>Endless swiping based on photos</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                        <span>Matches who never meet up</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                        <span>Weeks of messaging before meeting</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="glass-card rounded-3xl p-6 border border-orange-500/20"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 gradient-blip-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Zap className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">blip's Approach</h3>
                    <ul className="text-gray-700 space-y-2">
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                        <span>Match by shared interests & activity</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                        <span>Meet within minutes, not days</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                        <span>Real-time GPS for instant connections</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="relative py-24">
          <div className="max-w-md mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-white mb-4 text-shadow-glow">How It Works</h2>
              <p className="text-white/70 text-lg">From opening the app to meeting someone new in minutes</p>
            </motion.div>

            <div className="space-y-8">
              {[
                {
                  step: 1,
                  title: "Set Your Vibe",
                  description: "Choose what you want to do: jog, game, grab coffee, explore the city, or just hang out.",
                  icon: Sparkles,
                  gradient: "gradient-blip-orange"
                },
                {
                  step: 2,
                  title: "Get Matched Instantly",
                  description: "Our AI finds verified people nearby with similar interests who are available right now.",
                  icon: Zap,
                  gradient: "gradient-blip-primary"
                },
                {
                  step: 3,
                  title: "Meet & Have Fun",
                  description: "Head to the suggested meetup spot and enjoy your shared activity with new friends.",
                  icon: Users,
                  gradient: "gradient-blip-pink"
                }
              ].map((item, index) => (
                <motion.div 
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="glass-card rounded-3xl p-6 border border-white/10"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-16 h-16 ${item.gradient} rounded-3xl flex items-center justify-center flex-shrink-0 shadow-2xl`}>
                      <item.icon className="text-white w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-sm font-bold text-white/60 bg-white/10 px-3 py-1 rounded-full">STEP {item.step}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-xl mb-2">{item.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{item.description}</p>
                    </div>
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
        <section id="early-access" className="relative py-24">
          <div className="max-w-md mx-auto px-6 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-4 text-shadow-glow">Get Early Access</h2>
              <p className="text-white/70 text-lg mb-6">Be among the first to experience real-time social connections</p>
              
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center glass-effect rounded-full px-6 py-3 mb-8 border border-orange-400/30"
              >
                <Gift className="w-5 h-5 mr-3 text-orange-400" />
                <span className="text-white font-semibold">Early users get 3 months premium free</span>
              </motion.div>

              {/* Live Stats */}
              {stats && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-2 gap-4 mb-8"
                >
                  <div className="glass-effect rounded-2xl p-4 border border-white/10">
                    <div className="text-2xl font-bold text-white">{stats.waitlistUsers?.toLocaleString()}</div>
                    <div className="text-white/60 text-sm">On Waitlist</div>
                  </div>
                  <div className="glass-effect rounded-2xl p-4 border border-white/10">
                    <div className="text-2xl font-bold text-white">{stats.avgMeetupTime}</div>
                    <div className="text-white/60 text-sm">Avg Meetup Time</div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-8 border border-white/10"
            >
              <form onSubmit={handleSignup} className="space-y-6">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl text-gray-900 placeholder-gray-500 border-0 text-lg bg-white"
                  required
                />
                
                <Input
                  type="tel"
                  placeholder="Phone number (for verification)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl text-gray-900 placeholder-gray-500 border-0 text-lg bg-white"
                  required
                />

                <Select value={formData.interests} onValueChange={(value) => setFormData({ ...formData, interests: value })}>
                  <SelectTrigger className="w-full px-6 py-4 rounded-2xl text-gray-900 border-0 text-lg bg-white">
                    <SelectValue placeholder="What interests you most?" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="fitness">🏃‍♂️ Fitness & Running</SelectItem>
                    <SelectItem value="gaming">🎮 Gaming</SelectItem>
                    <SelectItem value="socializing">🎉 Socializing & Parties</SelectItem>
                    <SelectItem value="outdoor">🌲 Outdoor Activities</SelectItem>
                    <SelectItem value="food">🍕 Food & Drinks</SelectItem>
                    <SelectItem value="arts">🎨 Arts & Culture</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  type="submit"
                  disabled={signupMutation.isPending}
                  className="gradient-blip-primary hover:shadow-2xl hover:shadow-orange-500/25 font-bold py-4 px-8 rounded-2xl text-lg w-full text-white border-0"
                >
                  {signupMutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Adding you to waitlist...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 w-5 h-5" />
                      Join Beta Waitlist
                    </>
                  )}
                </Button>
              </form>

              <p className="text-white/60 text-sm mt-6 flex items-center justify-center">
                <Lock className="w-4 h-4 mr-2" />
                We respect your privacy. No spam, ever.
              </p>
            </motion.div>
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
        <footer className="relative py-16">
          <div className="max-w-md mx-auto px-6 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={blipIconPath} 
                    alt="Blip Icon" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-3xl font-bold text-white text-shadow-glow">blip</span>
                <span className="text-sm text-orange-400 font-medium">™</span>
              </div>
              <p className="text-white/60 text-lg">Meet instantly, in real-time.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4 mb-8"
            >
              <div className="glass-card rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">📱</span>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-600">Download on the</div>
                    <div className="text-sm font-bold text-gray-900">App Store</div>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">▶</span>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-600">Get it on</div>
                    <div className="text-sm font-bold text-gray-900">Google Play</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="glass-effect rounded-2xl p-6 border-t border-white/10"
            >
              <p className="text-white/40 text-sm">
                © 2025 blip. All rights reserved.
              </p>
              <div className="flex items-center justify-center space-x-6 mt-3">
                <button className="text-white/60 hover:text-white text-sm transition-colors">Privacy</button>
                <div className="w-1 h-1 bg-white/30 rounded-full"></div>
                <button className="text-white/60 hover:text-white text-sm transition-colors">Terms</button>
                <div className="w-1 h-1 bg-white/30 rounded-full"></div>
                <button className="text-white/60 hover:text-white text-sm transition-colors">Contact</button>
              </div>
            </motion.div>
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
            className="fixed bottom-6 left-6 right-6 z-40 max-w-md mx-auto"
          >
            <div className="glass-effect rounded-full p-1 border border-white/20">
              <Button 
                onClick={scrollToSignup}
                className="gradient-blip-primary text-white font-bold py-4 px-6 rounded-full shadow-2xl w-full border-0"
              >
                <Sparkles className="mr-2 w-5 h-5" />
                Join {stats?.waitlistUsers?.toLocaleString() || "12,847"}+ on Waitlist
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
