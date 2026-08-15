import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const { t, lang } = useLanguage();
  const isRTL = lang === "ar";

  return (
    <footer className="bg-noir text-pearl mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand & About */}
          <div>
            <h3 className="font-display text-2xl mb-4 text-champagne">
              {t("appName")}
            </h3>
            <p className="text-shadow/70 text-sm leading-relaxed mb-6">
              {t("footerDescription")}
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com/alqusor"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-noir/50 border border-champagne/30 flex items-center justify-center hover:bg-champagne hover:text-noir transition-all duration-300"
                aria-label="Facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/alqusor"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-noir/50 border border-champagne/30 flex items-center justify-center hover:bg-champagne hover:text-noir transition-all duration-300"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/alqusor"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-noir/50 border border-champagne/30 flex items-center justify-center hover:bg-champagne hover:text-noir transition-all duration-300"
                aria-label="Twitter"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="font-display text-lg mb-6 text-champagne">
              {t("contactUs")}
            </h4>
            <div className="space-y-4">
              <a
                href="tel:+966500000000"
                className="flex items-start gap-3 text-shadow/70 hover:text-champagne transition-colors"
              >
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm">+966 50 000 0000</div>
                  <div className="text-xs text-shadow/50">
                    {t("availableOnWhatsApp")}
                  </div>
                </div>
              </a>
              <a
                href="mailto:info@alqusor.com"
                className="flex items-start gap-3 text-shadow/70 hover:text-champagne transition-colors"
              >
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="text-sm">info@alqusor.com</div>
              </a>
              <div className="flex items-start gap-3 text-shadow/70">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div>{t("addressLine1")}</div>
                  <div>{t("addressLine2")}</div>
                  <div className="text-xs text-shadow/50 mt-1">
                    {t("saudiArabia")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="font-display text-lg mb-6 text-champagne">
              {t("businessHours")}
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-shadow/70">
                <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div>{t("saturdayThursday")}</div>
                  <div className="text-champagne">9:00 AM - 10:00 PM</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-shadow/70">
                <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div>{t("friday")}</div>
                  <div className="text-champagne">4:00 PM - 10:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-champagne/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-shadow/50">
            © {new Date().getFullYear()} {t("appName")}.{" "}
            {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
