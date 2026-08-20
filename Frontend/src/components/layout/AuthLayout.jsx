import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  X,
  ExternalLink,
  MessageCircle,
  GraduationCap,
  Copy,
  Check,
  Clock,
  Building2,
  Info,
} from "lucide-react";
import img from "/imges/images-removebg-preview.png?url";

const AuthLayout = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  return (
    <div className="w-full min-h-screen flex overflow-x-hidden bg-white lg:bg-gray-50">
      {/* Left Pane: Information / Branding */}
      <div className="hidden lg:flex lg:w-1/2 min-h-screen bg-white text-blue-900 px-8 xl:px-10 py-6 flex-col justify-between border-r border-gray-200">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-wide">SMIT</span>
            <span className="text-blue-700">|</span>
            <span className="text-blue-700 text-sm">
              Saylani Mass IT Training
            </span>
          </div>
        </div>

        {/* Center Image */}
        <div className="flex flex-1 items-center justify-center px-4 py-2">
          <img
            src={img}
            alt="SMIT Free IT Training"
            className="w-44 xl:w-56 max-w-full h-auto object-contain"
          />
        </div>

        {/* Content & Stats */}
        <div className="px-4">
          <p className="text-blue-700 text-sm tracking-[3px] mb-2 font-medium">
            SAYLANI WELFARE INTERNATIONAL TRUST
          </p>

          <h2 className="text-2xl xl:text-3xl font-bold leading-tight text-blue-900">
            SMIT Bootcamp for Future IT Professionals.
          </h2>

          <p className="text-blue-700 text-sm leading-6 py-3 max-w-2xl">
            SMIT is Pakistan's largest non-profit IT learning initiative — web
            development, AI, networking, and design, taught by industry experts,
            with no tuition fees, ever.
          </p>

          <div className="space-y-2">
            <div className="flex gap-3 items-center">
              <span className="text-amber-400 font-bold">•</span>
              <p className="text-blue-700 text-xs">
                Zero tuition fees, from enrollment to certificate
              </p>
            </div>

            <div className="flex gap-3 items-center">
              <span className="text-amber-400 font-bold">•</span>
              <p className="text-blue-700 text-xs">
                50+ industry-aligned courses across IT and design
              </p>
            </div>

            <div className="flex gap-3 items-center">
              <span className="text-amber-400 font-bold">•</span>
              <p className="text-blue-700 text-xs">
                Verified certification plus lifetime alumni support
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 xl:gap-4 mt-5 mb-4 pt-4 border-t border-blue-200">
            <div className="p-2.5 rounded-xl border border-blue-500/40 bg-blue-50">
              <h3 className="text-lg xl:text-xl font-bold text-blue-900">
                400K+
              </h3>
              <p className="text-blue-600 text-xs font-medium">
                Students trained
              </p>
            </div>

            <div className="p-2.5 rounded-xl border border-blue-500/40 bg-blue-50">
              <h3 className="text-lg xl:text-xl font-bold text-blue-900">
                50+
              </h3>
              <p className="text-blue-600 text-xs font-medium">Courses</p>
            </div>

            <div className="p-2.5 rounded-xl border border-blue-500/40 bg-blue-50">
              <h3 className="text-lg xl:text-xl font-bold text-blue-900">
                100+
              </h3>
              <p className="text-blue-600 text-xs font-medium">Instructors</p>
            </div>
          </div>

          {/* Admission help desk note */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-blue-800">
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#0476B9]" />
              Need enrollment for upcoming batches?
            </span>
            <button
              type="button"
              onClick={() => setIsContactModalOpen(true)}
              className="text-[#0476B9] font-semibold hover:underline cursor-pointer flex items-center gap-1"
            >
              Contact Admin &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Right Pane: Auth Forms & Enrollment Info */}
      {/* On small/mobile screens: Background is completely WHITE. On desktop: Background is BLUE (#0476B9) */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center bg-white lg:bg-[#0476B9] px-4 sm:px-6 lg:px-8 py-3 sm:py-6 lg:py-8 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
        <div className="w-full max-w-md flex flex-col items-center">
          <Outlet />

          {/* Contact Admin for Enrollment Banner */}
          {/* On mobile: Blue card on white background. On desktop: Glassmorphic white card on blue background */}
          <div className="mt-2.5 sm:mt-3.5 w-full bg-[#0476B9] lg:bg-white/10 lg:backdrop-blur-md border border-[#03669f] lg:border-white/25 rounded-2xl p-3 sm:p-4 text-white shadow-md lg:shadow-lg">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 lg:bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                <GraduationCap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold tracking-wide text-white">
                New Student Enrollment
              </h3>
            </div>

            <p className="text-xs text-blue-100/95 lg:text-blue-100/90 leading-relaxed mb-2.5">
              Public self-registration is disabled for this LMS. Enrolled
              students are registered and provided login credentials directly by
              the SMIT Administration.
            </p>

            <button
              type="button"
              onClick={() => setIsContactModalOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 sm:gap-2 bg-white text-[#0476B9] hover:bg-blue-50 active:scale-[0.99] font-bold text-xs sm:text-sm py-2 sm:py-2.5 px-4 rounded-xl transition duration-150 shadow-md cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0476B9]" />
              Contact Admin for Enrollment
            </button>
          </div>
        </div>
      </div>

      {/* Contact Admin & Enrollment Guidance Modal (Blue Themed) */}
      {isContactModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsContactModalOpen(false)}
        >
          <div
            className="bg-[#0476B9] text-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#035b8f] text-white p-5 sm:p-6 border-b border-white/15 relative">
              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <span className="bg-white/20 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  SMIT Admissions & Enrollment
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                How to Enroll as a Student
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 mt-1">
                Saylani Mass IT Training (SMIT) Official Admission Desk
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto bg-[#0476B9]">
              {/* How it works card */}
              <div className="bg-white/10 border border-white/20 rounded-xl p-3.5 sm:p-4 text-xs text-white space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-sm text-amber-300">
                  <Info className="w-4 h-4 shrink-0 text-amber-300" />
                  Enrollment & Account Setup Process
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-blue-100 pl-1 leading-relaxed">
                  <li>
                    <span className="font-semibold text-white">Apply:</span>{" "}
                    Submit your admission form during SMIT entry test drives or
                    visit a campus.
                  </li>
                  <li>
                    <span className="font-semibold text-white">
                      Verification:
                    </span>{" "}
                    Pass the entrance assessment and document verification.
                  </li>
                  <li>
                    <span className="font-semibold text-white">
                      Account Creation:
                    </span>{" "}
                    The admin desk will generate your student ID/Roll No and
                    default credentials.
                  </li>
                </ol>
              </div>

              {/* Contact Channels */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Official Admission Contacts
                </h4>

                {/* Email Item */}
                <div className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl transition">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-white/20 text-white flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-amber-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-blue-200 font-medium">
                        Admissions Email
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-white truncate">
                        education@saylaniwelfare.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy("education@saylaniwelfare.com", "email")
                      }
                      className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
                      title="Copy Email"
                    >
                      {copiedField === "email" ? (
                        <Check className="w-4 h-4 text-amber-300" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <a
                      href="mailto:education@saylaniwelfare.com?subject=SMIT%20LMS%20Student%20Enrollment%20Inquiry"
                      className="px-3 py-1.5 text-xs bg-white text-[#0476B9] hover:bg-blue-50 font-bold rounded-lg transition shadow-sm"
                    >
                      Email
                    </a>
                  </div>
                </div>

                {/* Helpline Phone */}
                <div className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl transition">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-white/20 text-white flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-amber-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-blue-200 font-medium">
                        SMIT Helpline
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-white truncate">
                        +92 (021) 111-729-526
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopy("+92021111729526", "phone")}
                      className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
                      title="Copy Phone"
                    >
                      {copiedField === "phone" ? (
                        <Check className="w-4 h-4 text-amber-300" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <a
                      href="tel:+9221111729526"
                      className="px-3 py-1.5 text-xs bg-white text-[#0476B9] hover:bg-blue-50 font-bold rounded-lg transition shadow-sm"
                    >
                      Call
                    </a>
                  </div>
                </div>

                {/* WhatsApp Support */}
                <div className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl transition">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-white/20 text-white flex items-center justify-center shrink-0">
                      <MessageCircle className="w-4 h-4 text-emerald-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-blue-200 font-medium">
                        WhatsApp Admissions Desk
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-white truncate">
                        +92 311 1729526
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/923111729526?text=Hello%20SMIT%20Admin,%20I%20would%20like%20to%20inquire%20about%20student%20enrollment%20in%20the%20bootcamp."
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 text-xs bg-white text-[#0476B9] hover:bg-blue-50 font-bold rounded-lg transition flex items-center gap-1 shadow-sm"
                  >
                    WhatsApp <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Campus Head Office */}
                <div className="flex items-start gap-3 p-3 bg-white/10 border border-white/20 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-white/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-semibold text-white">
                      Head Office & Main Campus
                    </p>
                    <p className="text-blue-100 leading-relaxed">
                      Saylani Mass IT Training (SMIT), 4th Floor, A-25,
                      Bahadurabad Chowrangi, Karachi, Pakistan.
                    </p>
                    <div className="flex items-center gap-1.5 text-blue-200 pt-1">
                      <Clock className="w-3.5 h-3.5 text-amber-300" />
                      <span>Mon – Sat: 9:00 AM – 6:00 PM (PKT)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#035b8f] border-t border-white/15 px-5 py-3.5 flex items-center justify-between">
              <a
                href="https://www.saylaniwelfare.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-100 hover:text-amber-300 font-medium underline-offset-2 hover:underline inline-flex items-center gap-1 transition"
              >
                Visit Official Website <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                className="px-5 py-1.5 text-xs font-bold text-[#0476B9] bg-white hover:bg-blue-50 rounded-lg shadow-sm transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthLayout;
