# Konyx | Ethiopia's Next-Gen Digital Employment Platform

A modern, high-performance digital employment platform and talent marketplace connecting job seekers, university students, and employers across Ethiopia with speed, trust, and algorithmic skill-based matching.

## 🚀 Overview

Konyx eliminates the inefficiencies of traditional job boards, paper CVs, and informal referrals by providing:
* **Algorithmic Skill Matching:** Matches candidates to job vacancies based on proven skills and badges, assigning match percentages (`98% Match`, `95% Match`).
* **Verified Achievement Badges:** Gamified skill verification for university students (starting from Haramaya University Campus) and skilled professionals.
* **Integrated Local Payments:** Native support for **Telebirr**, **CBE Birr**, **Chapa Payment Gateway**, and **BoaBirr** for premium badges and featured employer job posts.
* **Two-Way Rating & Review System:** Mutual accountability between employers and job seekers.

## 📁 Architecture & Pages

* `/` (`Home.jsx`): Interactive landing hub with live search engine and stats.
* `/jobs` (`JobsPage.jsx`): Live Ethiopian Job Marketplace & algorithmic filter engine.
* `/talent` (`TalentPage.jsx`): Verified Candidate & Student Directory for employers.
* `/post-job` (`PostJobPage.jsx`): 3-minute employer vacancy builder & local payment portal.
* `/register` (`RegisterPage.jsx`): Student & job seeker profile builder with Konyx Digital Passport generation.
* `/pricing` (`PricingPage.jsx`): Transparent monetization plans & FAQ.
* `/about` (`AboutPage.jsx`): Executive summary, founders (**Kenake Adinew** & **Yeron Dereje**), and strategic nationwide vision.

## 🛠️ Tech Stack
* **Frontend:** React 19, Vite, React Router DOM, Framer Motion, Lucide React
* **Styling:** Custom CSS Variables (Deep Obsidian Tech theme + Electric Blue `#1D06F4` / `#00E5FF` accents)
* **Build:** `vite-plugin-singlefile` enabled for self-contained HTML bundle delivery.
