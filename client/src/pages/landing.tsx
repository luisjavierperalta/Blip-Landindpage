import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import blipIconPath from "@assets/blip app icon v2 2025_084559_1749963579832.jpg";
import blipLogoPath from "@assets/logo_1749988451754.png";
import feedPreview from "../../assets/FEED.jpg";
import appStorePath from "@assets/app-store.png";
import googlePlayPath from "@assets/google-play.png";
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
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const { toast } = useToast();

  // Fetch stats
  const { data: stats } = useQuery<StatsData>({
    queryKey: ["stats"],
    queryFn: () => api.stats().then(res => res.json())
  });

  // Early access signup mutation
  const signupMutation = useMutation({
    mutationFn: (data: EarlyAccessData) => api.earlyAccess(data).then(res => res.json()),
    onSuccess: () => {
      toast({
        title: "Welcome to @Blip! 🎉",
        description: "You're now on our early access waitlist. We'll be in touch soon!",
      });
      setFormData({ email: "", phone: "", interests: "" });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
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
    },
    {
      question: "How does blip protect my privacy?",
      answer: "### Data Protection\n- 24-hour tracking limit\n- Encrypted location data\n- Secure emergency contacts\n- Protected meeting history\n\n### User Control\n- End meeting anytime\n- Disable tracking\n- Update privacy settings\n- Manage emergency contacts"
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
              className="h-20 w-auto object-contain filter brightness-110 contrast-110"
            />
          </div>
          <Button 
            size="lg" 
            className="glass-effect hover:bg-white/20 text-white border-white/20 rounded-full font-bold px-12 py-5 text-xl md:text-2xl shadow-xl transition-all duration-200"
            onClick={() => window.open('https://blipfree.com', '_blank')}
          >
            <Sparkles className="w-6 h-6 mr-3" />
            Go to App
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
                <h1 className="text-4xl font-bold leading-tight text-white text-shadow-glow">
                  Meet in Real Life
                  <br />
                  <span className="text-white">
                    Instantly, in real-time.
                  </span>
                </h1>
                
                <p className="text-xl text-white/80 leading-relaxed max-w-sm mx-auto">
                  The Uber for spontaneous socializing.
                  <br />
                  <span className="text-white/60 text-base">
                    Tap to match → meet someone nearby → do something now.
                  </span>
                </p>

                <div className="flex flex-col items-center space-y-2 text-white/80">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">✔️</span>
                    <span>Instant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">✔️</span>
                    <span>Location-based</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">✔️</span>
                    <span>No planning</span>
                  </div>
                </div>
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
                  {/* App Screenshot Preview */}
                  <img 
                    src={feedPreview} 
                    alt="App Preview" 
                    className="absolute inset-3 w-[222px] h-[474px] object-cover rounded-[2.5rem] mx-auto my-auto"
                    style={{ left: 12, top: 12 }}
                  />
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

            {/* Add this new text below the phone mockup */}
            <div className="mb-8 text-white text-lg font-semibold max-w-xs mx-auto font-sans" style={{fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'}}>
              No swiping. No chat lag. Just meet someone who wants the same thing you do, right now.
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="space-y-4"
            >
              <Button 
                size="lg"
                className="glass-effect hover:bg-white/20 text-white border-white/20 rounded-full font-bold py-5 px-12 text-xl w-full mb-4 shadow-xl border-0"
                onClick={() => window.open('https://blipfree.com', '_blank')}
              >
                <Play className="mr-3 w-6 h-6" />
                Go to App
              </Button>

              {/* New: Mobile Phone ID-verified users */}
              <div className="mb-4 text-green-400 font-semibold text-base">Mobile Phone ID-verified users</div>
              
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
          {/* Technical Slogan Behind Section */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
            <span className="text-4xl md:text-5xl font-bold text-white/10 tracking-widest uppercase text-center w-full">
              Real-Time Safety. Real-World Connections. Powered by MeetingHub.
            </span>
          </div>
          <div className="max-w-md mx-auto px-6 relative z-10">
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
                    <Zap className="text-white w-6 h-6" />
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
              <div className="space-y-8 text-white/90 text-lg text-left max-w-xl mx-auto">
                <div>
                  <div className="font-bold text-white mb-1">The City's Calling. Tap In Like This:</div>
                  <ol className="list-decimal ml-6">
                    <li>Sign up and build your Blip™ profile.</li>
                    <li>Go live — location on, vibes up.</li>
                    <li>Meet real people, in the moment, 300m around you.</li>
                  </ol>
                </div>
                <div className="mt-8 p-4 rounded-xl bg-white/10 border border-white/20 text-white text-base">
                  <div className="font-bold mb-2">Technical Safety Layer: MeetingHub</div>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Live GPS tracking & check-ins for every meetup</li>
                    <li>Emergency contacts & alerts always active</li>
                    <li>Safe word required to end meetings</li>
                    <li>All data encrypted & privacy protected</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 text-center text-white/80 text-lg font-semibold">Ready to tap in? <span className="text-white">Go to App</span> and make your city your playground!</div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        {/* Features section removed as per instructions */}

        {/* FAQ */}
        {/* FAQ section removed as per instructions */}

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
              <div className="flex flex-col items-center justify-center">
                <img src={blipIconPath} alt="Blip" className="h-24" />
                <p className="text-white/60 text-lg mt-4">300m, Real-Time Vibes.</p>
                <p className="text-white/60 text-lg mt-2">Mobile App will be available for download soon. Stay tuned!</p>
              </div>
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
                  <img src={appStorePath} alt="App Store" className="w-8 h-8 object-contain" />
                  <div className="text-left">
                    <div className="text-xs text-gray-600">Download on the</div>
                    <div className="text-sm font-bold text-gray-900">App Store</div>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-colors">
                <div className="flex items-center space-x-3">
                  <img src={googlePlayPath} alt="Google Play" className="w-8 h-8 object-contain" />
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
              <p className="text-white text-lg">© 2025 Mediaair Brands Limited CRN. 13799465. All rights reserved.</p>
              <div className="flex items-center justify-center space-x-6 mt-3">
                <button onClick={() => setShowPrivacyModal(true)} className="text-orange-500 hover:text-orange-400 text-xl transition-colors">Privacy</button>
                <button onClick={() => setShowTermsModal(true)} className="text-orange-500 hover:text-orange-400 text-xl transition-colors">Terms</button>
                <button onClick={() => setShowContactModal(true)} className="text-orange-500 hover:text-orange-400 text-xl transition-colors">Contact</button>
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
                className="gradient-blip-primary text-white font-bold py-6 px-10 text-2xl rounded-full shadow-2xl w-full border-0"
                onClick={() => window.open('https://blipfree.com', '_blank')}
              >
                <Sparkles className="mr-3 w-7 h-7" />
                Go to App
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Contact Us</h2>
            <p>Founder & CEO of Mediaair Brands Limited</p>
            <p>Luis Javier Peralta</p>
            <p>Email: luis@mediaairbrands.com</p>
            <p>Email: luisjavierperalta@aol.com</p>
            <p>Phone: +39 351 9911 296</p>
            <button onClick={() => setShowContactModal(false)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Close</button>
          </div>
        </div>
      )}

      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Privacy Policy</h2>
            <p>We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
            <p>By using our service, you agree to the collection and use of information in accordance with this policy.</p>
            <p>Founder & CEO of Mediaair Brands Limited CRN. 13799465</p>
            <p>AT Registered office address: Office 11450 182-184 High Street North, East Ham, London, E6 2JA</p>
            <p>Luis Javier Peralta</p>
            <p>Email: luis@mediaairbrands.com</p>
            <p>Email: luisjavierperalta@aol.com</p>
            <p>Phone: +39 351 9911 296</p>
            <p>Official app website: <a href="https://blipfree.com" className="text-blue-500">https://blipfree.com</a></p>
            <button onClick={() => setShowPrivacyModal(false)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Close</button>
          </div>
        </div>
      )}

      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Terms and Conditions</h2>
            <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
            <p>Use License: Permission is granted to temporarily download one copy of the materials (information or software) on Mediaair Brands Limited's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
            <ul className="list-disc pl-5">
              <li>Modify or copy the materials;</li>
              <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
              <li>Attempt to decompile or reverse engineer any software contained on Mediaair Brands Limited's website;</li>
              <li>Remove any copyright or other proprietary notations from the materials; or</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
            <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by Mediaair Brands Limited at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.</p>
            <p>Disclaimer: The materials on Mediaair Brands Limited's website are provided on an 'as is' basis. Mediaair Brands Limited makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
            <p>Further, Mediaair Brands Limited does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</p>
            <p>Limitations: In no event shall Mediaair Brands Limited or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Mediaair Brands Limited's website, even if Mediaair Brands Limited or a Mediaair Brands Limited authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.</p>
            <p>Accuracy of materials: The materials appearing on Mediaair Brands Limited's website could include technical, typographical, or photographic errors. Mediaair Brands Limited does not warrant that any of the materials on its website are accurate, complete or current. Mediaair Brands Limited may make changes to the materials contained on its website at any time without notice. However Mediaair Brands Limited does not make any commitment to update the materials.</p>
            <p>Links: Mediaair Brands Limited has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Mediaair Brands Limited of the site. Use of any such linked website is at the user's own risk.</p>
            <p>Modifications: Mediaair Brands Limited may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.</p>
            <p>Governing Law: These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
            <p>Founder & CEO of Mediaair Brands Limited CRN. 13799465</p>
            <p>AT Registered office address: Office 11450 182-184 High Street North, East Ham, London, E6 2JA</p>
            <p>Luis Javier Peralta</p>
            <p>Email: luis@mediaairbrands.com</p>
            <p>Email: luisjavierperalta@aol.com</p>
            <p>Phone: +39 351 9911 296</p>
            <p>Official app website: <a href="https://blipfree.com" className="text-blue-500">https://blipfree.com</a></p>
            <button onClick={() => setShowTermsModal(false)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
