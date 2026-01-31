import { TrendingUp, ShoppingCart, Truck, ArrowRight, Zap, Gauge } from 'lucide-react';

interface LandingPageProps {
  onSelectDataType: (type: 'sales' | 'collection' | 'dispatch') => void;
}

export const LandingPage = ({ onSelectDataType }: LandingPageProps) => {
  const dataTypes = [
    {
      id: 'sales',
      title: 'Sales Analytics',
      description: 'Comprehensive analysis of textile sales, fabric orders, and revenue streams across all distribution channels',
      icon: TrendingUp,
      gradient: 'from-teal-50 via-teal-100 to-cyan-50',
      headerGradient: 'from-teal-600 to-cyan-700',
      accentColor: 'text-teal-600',
      accentBg: 'bg-teal-100',
      badgeColor: 'bg-teal-500',
      features: ['Revenue tracking', 'Product analysis', 'Market insights'],
    },
    {
      id: 'collection',
      title: 'Payment Collections',
      description: 'Monitor and optimize payment collections for textile orders, receivables, and cash flow management',
      icon: ShoppingCart,
      gradient: 'from-purple-50 via-purple-100 to-pink-50',
      headerGradient: 'from-purple-600 to-pink-700',
      accentColor: 'text-purple-600',
      accentBg: 'bg-purple-100',
      badgeColor: 'bg-purple-500',
      features: ['Cash flow tracking', 'Payment monitoring', 'Due analysis'],
    },
    {
      id: 'dispatch',
      title: 'Logistics & Dispatch',
      description: 'Manage textile shipments, deliveries, and comprehensive logistics operations with real-time tracking',
      icon: Truck,
      gradient: 'from-amber-50 via-orange-100 to-red-50',
      headerGradient: 'from-amber-600 to-orange-700',
      accentColor: 'text-amber-600',
      accentBg: 'bg-amber-100',
      badgeColor: 'bg-amber-500',
      features: ['Shipment tracking', 'Delivery insights', 'Route optimization'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
      {/* Animated gradient background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-6 sm:pt-8 md:pt-10 pb-3 sm:pb-4 md:pb-6">
          <div className="text-center mb-2 sm:mb-3 space-y-2 sm:space-y-2.5">
            <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
              <div className="h-0.5 sm:h-1 w-6 sm:w-8 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full"></div>
              <h1 className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-purple-600 to-amber-600">
                TEXTILE INTELLIGENCE PLATFORM
              </h1>
              <div className="h-0.5 sm:h-1 w-6 sm:w-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full"></div>
            </div>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight max-w-4xl mx-auto">
              Advanced Analytics for Textile Business
            </h2>
            
            <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-3xl mx-auto leading-snug font-light">
              Professional analytics platform for textile operations. Transform data into actionable insights.
            </p>

            <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 pt-1 sm:pt-1.5 md:pt-2 flex-wrap">
              <div className="flex items-center gap-1 sm:gap-1.5 text-slate-700">
                <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-600" />
                <span className="font-medium text-[10px] sm:text-xs">Real-time Analytics</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 text-slate-700">
                <Gauge className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-600" />
                <span className="font-medium text-[10px] sm:text-xs">Advanced Filtering</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Type Cards - Pinterest Style */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-5 md:py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {dataTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => onSelectDataType(type.id as 'sales' | 'collection' | 'dispatch')}
                  className="group h-full text-left transition-all duration-700 hover:scale-102 cursor-pointer focus:outline-none"
                  style={{
                    animation: `slideInUp 0.6s ease-out ${index * 0.15}s both`,
                  }}
                >
                  <style>{`
                    @keyframes slideInUp {
                      from {
                        opacity: 0;
                        transform: translateY(40px);
                      }
                      to {
                        opacity: 1;
                        transform: translateY(0);
                      }
                    }
                  `}</style>
                  
                  <div className={`bg-gradient-to-br ${type.gradient} rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/40 backdrop-blur-sm h-full flex flex-col`}>
                    {/* Header with gradient background */}
                    <div className={`bg-gradient-to-br ${type.headerGradient} p-3 sm:p-4 text-white relative overflow-hidden group-hover:shadow-xl transition-all`}>
                      {/* Decorative gradient blobs in background */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute -top-20 -right-20 w-56 h-56 bg-white rounded-full blur-2xl"></div>
                      </div>
                      
                      {/* Icon */}
                      <div className="relative z-10 mb-1.5 sm:mb-2">
                        <div className={`inline-flex p-2 sm:p-2.5 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-500`}>
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-bold text-white relative z-10 group-hover:text-teal-100 transition-colors duration-300">
                        {type.title}
                      </h3>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-3 sm:p-4 flex flex-col">
                      <p className="text-slate-700 mb-3 sm:mb-4 leading-snug font-medium text-[11px] sm:text-xs flex-1">
                        {type.description}
                      </p>

                      {/* Features Grid */}
                      <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                        {type.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 sm:gap-2 group/feature">
                            <div className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full ${type.badgeColor} group-hover/feature:scale-125 transition-transform duration-300 flex-shrink-0`}></div>
                            <span className="text-[10px] sm:text-xs font-medium text-slate-700 group-hover/feature:text-slate-900 transition-colors">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Call-to-action button */}
                      <button
                        onClick={() => onSelectDataType(type.id as 'sales' | 'collection' | 'dispatch')}
                        className={`bg-gradient-to-r ${type.headerGradient} text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold flex items-center justify-between gap-2 w-full hover:shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-0.5 text-[10px] sm:text-xs`}
                      >
                        <span>Start Analysis</span>
                        <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 mb-2">
            <div className="text-center p-1.5 sm:p-2">
              <div className="inline-block p-1.5 sm:p-2 rounded-lg bg-teal-100 mb-0.5 sm:mb-1">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-700" />
              </div>
              <h4 className="font-bold text-slate-900 mb-0.5 text-[10px] sm:text-xs">Instant Insights</h4>
              <p className="text-[9px] sm:text-xs text-slate-600">Transform data into intelligence</p>
            </div>
            <div className="text-center p-1.5 sm:p-2">
              <div className="inline-block p-1.5 sm:p-2 rounded-lg bg-purple-100 mb-0.5 sm:mb-1">
                <Gauge className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-700" />
              </div>
              <h4 className="font-bold text-slate-900 mb-0.5 text-[10px] sm:text-xs">Smart Filtering</h4>
              <p className="text-[9px] sm:text-xs text-slate-600">Filter by year and category</p>
            </div>
            <div className="text-center p-1.5 sm:p-2">
              <div className="inline-block p-1.5 sm:p-2 rounded-lg bg-amber-100 mb-0.5 sm:mb-1">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700" />
              </div>
              <h4 className="font-bold text-slate-900 mb-0.5 text-[10px] sm:text-xs">Fast Processing</h4>
              <p className="text-[9px] sm:text-xs text-slate-600">CSV & Excel support</p>
            </div>
          </div>

          <div className="text-center space-y-0.5 py-1.5 sm:py-2">
            <p className="text-slate-600 font-medium text-[10px] sm:text-xs">
              Professional textile analytics
            </p>
            <p className="text-[9px] sm:text-xs text-slate-500">
              CSV, XLSX • Auto data analysis & validation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
