import React, { useState, useEffect } from "react";
import {
  Search,
  CheckCircle,
  CreditCard,
  ArrowRight,
  Play,
} from "lucide-react";

const ProcessSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const processSteps = [
    {
      id: "01",
      title: "Tìm & Chọn Sân",
      subtitle: "Khám phá sân lý tưởng",
      description:
        "Tìm kiếm sân cầu lông theo vị trí, thời gian và mức giá phù hợp với nhu cầu của bạn",
      icon: Search,
      color: "from-teal-500 to-cyan-500",
      features: [
        "Tìm theo vị trí",
        "Lọc theo giá",
        "Xem đánh giá",
        "So sánh tiện ích",
      ],
    },
    {
      id: "02",
      title: "Đặt & Thanh Toán",
      subtitle: "Xác nhận nhanh chóng",
      description:
        "Chọn thời gian, xác nhận thông tin và thanh toán an toàn qua các phương thức đa dạng",
      icon: CreditCard,
      color: "from-cyan-500 to-teal-400",
      features: [
        "Thanh toán đa dạng",
        "Bảo mật 100%",
        "Xác nhận tức thì",
        "Hóa đơn điện tử",
      ],
    },
    {
      id: "03",
      title: "Nhận & Trải Nghiệm",
      subtitle: "Tận hưởng trận đấu",
      description:
        "Nhận mã xác nhận và đến sân đúng giờ để bắt đầu trận cầu lông tuyệt vời",
      icon: CheckCircle,
      color: "from-emerald-500 to-teal-500",
      features: [
        "Mã QR check-in",
        "Hỗ trợ 24/7",
        "Đánh giá sau trận",
        "Tích điểm thưởng",
      ],
    },
  ];

  return (
    <section className="relative py-8 sm:py-14 bg-gradient-to-t from-teal-50 via-slate-100 to-teal-50 overflow-hidden">
      <div className="relative mx-auto px-4 sm:px-6 lg:px-30">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-3">
            <Play className="w-4 h-4" />
            Quy trình đơn giản
          </div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-teal-900 to-cyan-900 bg-clip-text text-transparent mb-2.5">
            Đặt Sân Chỉ Trong
            <span className="block text-3xl md:text-4xl bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              3 Bước
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Trải nghiệm đặt sân cầu lông hiện đại, nhanh chóng và tiện lợi với
            quy trình được tối ưu hóa
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {processSteps.map((step, index) => (
            <div
              key={step.id}
              className={`group relative transition-all duration-700 transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
              onMouseEnter={() => setActiveStep(index)}
            >
              {/* Card */}
              <div
                className={`relative p-6 rounded-3xl rounded-br-none rounded-bl-none transition-all duration-500 border-2 ${
                  activeStep === index
                    ? "bg-white shadow-2xl border-transparent scale-105 -translate-y-1.5"
                    : "bg-white/80 shadow-lg border-gray-100 hover:shadow-xl hover:scale-[1.02]"
                }`}
              >
                {/* Step Number Badge */}
                <div
                  className={`absolute -top-3.5 -left-3.5 w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-lg bg-gradient-to-r ${step.color}`}
                >
                  {step.id}
                </div>

                {/* Icon Container */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 bg-gradient-to-r ${
                    step.color
                  } ${activeStep === index ? "scale-110 shadow-lg" : ""}`}
                >
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {step.title}
                    </h3>
                    <p
                      className={`text-base font-medium mb-1 bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}
                    >
                      {step.subtitle}
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-1.5">
                    {step.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm text-gray-500"
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${step.color}`}
                        />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Indicator */}
                <div
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${
                    step.color
                  } transition-all duration-500  ${
                    activeStep === index ? "w-full" : "w-0"
                  }`}
                />
              </div>

              {/* Connection Arrow */}
              {index < processSteps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 z-10">
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-r ${
                      step.color
                    } flex items-center justify-center shadow-lg transition-all duration-500 ${
                      activeStep === index ? "scale-110" : ""
                    }`}
                  >
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA note */}
        <div className="text-center">
          <p className="text-gray-500 text-sm sm:text-base">
            ⚡ Chỉ mất 2 phút để hoàn tất • 🔒 Bảo mật tuyệt đối • ⭐ Đánh giá
            4.9/5
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
