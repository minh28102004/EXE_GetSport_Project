import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Users, Shield, Send } from "lucide-react";
import LoadingSpinner from "@components/Loading_Spinner";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, children }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
    <div className="bg-teal-600/80 p-2">
      <div className="flex items-center">
        <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center mr-3">
          {icon}
        </div>
        <h3 className="font-semibold text-white text-lg">{title}</h3>
      </div>
    </div>
    <div className="px-4 py-2 text-center text-slate-700 text-sm md:text-base">
      {children}
    </div>
  </div>
);

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [_submitted, setSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-5 h-5 text-white" />,
      title: "Địa Chỉ Văn Phòng",
      content: (
        <>
          <p className="text-slate-700 text-sm md:text-base leading-relaxed">
            123 Đường Long Thành Mỹ, Thủ Đức, TP Hồ Chí Minh
          </p>
          <button
            className="mt-1 text-teal-500 text-sm md:text-base font-medium 
  hover:brightness-75 hover:underline 
  hover:translate-x-1 transition-transform duration-200"
          >
            Xem Bản Đồ →
          </button>
        </>
      ),
    },
    {
      icon: <Phone className="w-5 h-5 text-white" />,
      title: "Điện Thoại",
      content: (
        <>
          <p className="text-slate-700 text-sm md:text-base mb-1">
            Tổng đài CSKH: 098 320 642 85
          </p>
          <p className="text-slate-700 text-sm md:text-base mb-1">
            Hotline: 0902 967 285
          </p>
        </>
      ),
    },
    {
      icon: <Mail className="w-5 h-5 text-white" />,
      title: "Email",
      content: (
        <div className="">
          {/* Dòng 1 */}
          <div className="flex items-center gap-2 text-sm md:text-base">
            <p className="text-slate-700">Hỗ trợ khách hàng:</p>
            <p className="text-teal-600 font-medium">GSSupport@gmail.com</p>
          </div>

          {/* Dòng 2 */}
          <div className="flex items-center gap-2 text-sm md:text-base mt-2 mb-1">
            <p className="text-slate-700">Hợp tác kinh doanh:</p>
            <p className="text-teal-600 font-medium">GSBusiness@gmail.com</p>
          </div>

          {/* Dòng 3 */}
          <p className="text-xs md:text-sm text-slate-500 mt-2">
            Phản hồi trong 24h làm việc
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className=" bg-gray-100">
      <div className=" mx-auto px-4 sm:px-6 lg:px-50 py-8">
        <div className="grid lg:grid-cols-[1.75fr_4.25fr] gap-8">
          {/* Left Contact Info */}
          <div className=" space-y-6">
            {contactInfo.map((info, idx) => (
              <InfoCard key={idx} icon={info.icon} title={info.title}>
                {info.content}
              </InfoCard>
            ))}

            {/* Working Hours */}
            <div className="bg-white rounded-xl shadow-lg px-6 py-2">
              <h3 className="font-semibold text-xl text-slate-800 mb-4 flex items-center">
                <Clock className="w-5 h-5 text-teal-500 mr-2" />
                Giờ Làm Việc
              </h3>
              <div className="space-y-3 text-sm md:text-base">
                {[
                  { day: "Thứ Hai - Thứ Sáu", time: "8:00 - 18:00" },
                  { day: "Thứ Bảy", time: "9:00 - 17:00" },
                  { day: "Chủ Nhật", time: "Nghỉ" },
                ].map((d, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-slate-600">{d.day}</span>
                    <span className="text-slate-800 font-medium">{d.time}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t pt-3">
                  <span className="text-slate-600">Hotline Hỗ Trợ</span>
                  <span className="text-teal-600 font-medium">
                    8:00 - 22:00 (Hàng ngày)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden grid md:grid-cols-10">
              {/* Left Panel */}
              <div className="bg-teal-600 p-8 flex flex-col md:col-span-4 justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Gửi Thông Tin Liên Hệ
                  </h2>
                  <p className="text-teal-100 mb-8">
                    Hãy điền thông tin vào form bên cạnh, chúng tôi sẽ liên hệ
                    lại với bạn trong thời gian sớm nhất.
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">
                          Hỗ Trợ Khách Hàng
                        </h4>
                        <p className="text-teal-100 text-sm">
                          Chúng tôi luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-12 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">
                          Phản Hồi Nhanh Chóng
                        </h4>
                        <p className="text-teal-100 text-sm">
                          Chúng tôi sẽ phản hồi trong vòng 24h làm việc.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-12 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">
                          Bảo Mật Thông Tin
                        </h4>
                        <p className="text-teal-100 text-sm">
                          Thông tin của bạn sẽ được bảo mật tuyệt đối.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hình minh họa */}
                <div className="mt-8">
                  <img
                    src="https://media.istockphoto.com/id/1141639313/photo/contact-us-woman-hand-holding-icon-customer-support-concept-copy-space.webp?a=1&b=1&s=612x612&w=0&k=20&c=uHMhTY07k5rIjtT03ep9MXH9zZqXDU2WtsgyOP1vl2I="
                    alt="Contact"
                    className="w-full rounded-lg"
                  />
                </div>
              </div>

              {/* Right Panel - Form */}
              <div className="p-6 sm:p-8 md:col-span-6">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Họ tên + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <span className="text-red-500">*</span> Họ và tên
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-slate-300 rounded-lg focus:ring-1 hover:border-teal-500/50 focus:ring-teal-500 focus:border-teal-500 focus:outline-none text-sm sm:text-base"
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <span className="text-red-500">*</span> Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-slate-300 rounded-lg focus:ring-1 hover:border-teal-500/50 focus:ring-teal-500 focus:border-teal-500 focus:outline-none text-sm sm:text-base"
                        placeholder="Nhập địa chỉ email"
                        required
                      />
                    </div>
                  </div>

                  {/* Số điện thoại + Chủ đề */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-slate-300 rounded-lg focus:ring-1 hover:border-teal-500/50 focus:ring-teal-500 focus:border-teal-500 focus:outline-none text-sm sm:text-base"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <span className="text-red-500">*</span> Chủ đề
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-2.5 border border-slate-300 rounded-lg focus:ring-1 hover:border-teal-500/50 focus:ring-teal-500 focus:border-teal-500 focus:outline-none text-sm sm:text-base"
                        required
                      >
                        <option value="">Chọn chủ đề</option>
                        <option value="support">Hỗ trợ khách hàng</option>
                        <option value="business">Hợp tác kinh doanh</option>
                        <option value="technical">Hỗ trợ kỹ thuật</option>
                        <option value="feedback">Góp ý/Phản hồi</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>
                  </div>

                  {/* Nội dung */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <span className="text-red-500">*</span> Nội dung
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-slate-300 rounded-lg focus:ring-1 hover:border-teal-500/50 focus:ring-teal-500 focus:border-teal-500 focus:outline-none text-sm sm:text-base"
                      placeholder="Nhập nội dung tin nhắn"
                      required
                    />
                  </div>

                  {/* Checkbox */}
                  <div className="flex items-center text-sm text-slate-600">
                    <input
                      type="checkbox"
                      required
                      className="mr-2 mb-0.5 w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <p>
                      Tôi đồng ý với{" "}
                      <a
                        href="#"
                        className="text-teal-600 hover:brightness-75 font-medium hover:underline"
                      >
                        chính sách bảo mật
                      </a>{" "}
                      của Get Sport!
                    </p>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:brightness-90 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 hover:scale-[1.02] disabled:cursor-not-allowed flex justify-center items-center"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <LoadingSpinner color="white" size="6" inline />
                        <span>Đang gửi...</span>
                      </div>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Gửi Tin Nhắn
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
