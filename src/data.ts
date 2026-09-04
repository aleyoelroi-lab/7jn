import { ServiceItem, PackageItem, BlogItem, FaqItem, ResumeData } from "./types";

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "ai-analytics",
    icon: "📈",
    title: "AI-Powered Analytics Dashboard",
    shortDesc: "Real-time traffic monitoring, user behavior tracking, and conversion analytics.",
    longDesc: "Gain full visibility into your digital platform's performance. I configure smart tracking dashboards with heatmaps of user interactions and real-time event analytics.",
    tools: ["Analytics 4", "Hotjar", "Mixpanel", "Clarity"],
    details: [
      "Real-time traffic monitoring & live visitor tracking",
      "User behavior tracking & drop-off path visualization",
      "Conversion rate analytics & custom goal setups",
      "Heatmaps of user interactions & scroll depth logging"
    ]
  },
  {
    id: "auto-seo",
    icon: "🔍",
    title: "Automated SEO Optimization",
    shortDesc: "Auto-generate meta tags, implement schema markups, and generate dynamic sitemaps.",
    longDesc: "Get discovered on search engines automatically. I build automated SEO pipelines that optimize keyword visibility, crawlability, and indexing out of the box.",
    tools: ["Search Console", "Screaming Frog", "Ahrefs", "Semrush"],
    details: [
      "Auto-generation of SEO meta tags and open-graph properties",
      "Schema markup implementation for search snippet rich cards",
      "Automated sitemap generation and instant pinging to Search Engines",
      "Keyword optimization and density diagnostics"
    ]
  },
  {
    id: "multi-lang",
    icon: "🌐",
    title: "Multi-Language Support",
    shortDesc: "Auto-translate content across English, Tagalog, and Chinese with native region triggers.",
    longDesc: "Go global effortlessly. I integrate dynamic language switchers and auto-translation features that adapt content to localized regions in milliseconds.",
    tools: ["i18next", "Weglot", "Translate API", "DeepL"],
    details: [
      "Auto-translation mechanics (English, Tagalog, Chinese)",
      "Lightweight interactive language switcher dropdowns",
      "Region-specific content rendering and currency adjustments",
      "Localized search engine optimization (Hreflang tags)"
    ]
  },
  {
    id: "adv-security",
    icon: "🛡️",
    title: "Advanced Security Package",
    shortDesc: "Protect your operations with DDoS prevention, SSL certificates, and active firewalls.",
    longDesc: "Stay secure and resilient against threats. I configure cloud security filters, manage SSL certificates, and set up real-time firewall intrusion audits.",
    tools: ["Cloudflare Enterprise", "AWS WAF", "Let's Encrypt", "Sucuri"],
    details: [
      "DDoS protection rulesets and rate-limiting triggers",
      "SSL certificate management and automatic renewal hooks",
      "Active Web Application Firewall (WAF) configurations",
      "Regular automated security auditing and intrusion checks"
    ]
  },
  {
    id: "perf-optimization",
    icon: "⚡",
    title: "Performance Optimization",
    shortDesc: "Maximize Core Web Vitals, compress static assets, and configure high-speed CDNs.",
    longDesc: "Deliver an instantaneous experience. I tune your application to hit perfect 100/100 Lighthouse scores through static minification, lazy loading, and CDN routing.",
    tools: ["Cloudflare CDN", "Vercel Edge", "PageSpeed Insights", "WebP Assets"],
    details: [
      "Image compression algorithms & responsive lazy loading",
      "Global CDN setup & geographic asset edge-caching",
      "Code minification, bundle splitting, and tree-shaking",
      "Core Web Vitals optimization (LCP, FID, CLS scoring)"
    ]
  },
  {
    id: "cms-setup",
    icon: "📝",
    title: "Content Management System (CMS)",
    shortDesc: "Easy self-managed editing for your articles, media libraries, and team roles.",
    longDesc: "Empower your team to update web content without touching a single line of code. I setup headless or structured CMS platforms with secure user permission layers.",
    tools: ["Strapi Headless", "Sanity.io", "WordPress Engine", "Decap CMS"],
    details: [
      "Easy visual content editing interfaces and markdown grids",
      "Blog/News section with dynamic tag and author filters",
      "Media library with automated asset sizing & compression",
      "User roles & granular admin permission management"
    ]
  },
  {
    id: "ecommerce-integration",
    icon: "🛒",
    title: "E-commerce Integration",
    shortDesc: "Set up shopping carts, product catalogs, and accept payments via Stripe, PayPal, or GCash.",
    longDesc: "Convert visitors into paying customers. I assemble robust shopping carts, high-performance product listings, and secure payment checkout systems.",
    tools: ["Stripe Checkout", "PayPal Merchant", "GCash via PayMongo", "Shopify API"],
    details: [
      "Payment gateway setup (Stripe, PayPal, GCash, PayMongo)",
      "Interactive product catalogs with reactive instant-filtering",
      "Shopping cart modules with secure local state syncing",
      "Order management backends and receipt automation emails"
    ]
  },
  {
    id: "api-dev",
    icon: "🔌",
    title: "API Development & Integration",
    shortDesc: "Develop custom REST APIs, webhooks, and sync data directly with Zapier, CRMs, and databases.",
    longDesc: "Connect your entire software stack. I develop clean, fully documented RESTful APIs and real-time webhook routes that bridge workflows perfectly.",
    tools: ["Express.js APIs", "Zapier Developer", "Postman Enterprise", "Webhooks"],
    details: [
      "Custom REST API architecture with TypeScript type safety",
      "Third-party integrations (Zapier, Salesforce, HubSpot CRM)",
      "Automated webhook setup for instant cross-platform alerts",
      "API authorization keys, secure token vaults, and rate limiters"
    ]
  }
];

export const PACKAGES_DATA: PackageItem[] = [
  {
    id: "foundation",
    name: "FOUNDATION",
    price: "799",
    priceNote: "/project",
    timeline: "5-14 days",
    features: [
      "Web builds up and deploys for Static Websites",
      "Basic Performance Optimization (image compression, lazy loading)",
      "Basic SEO Setup (meta tags, sitemap)",
      "Simple Contact Form Integration",
      "1-Month Complimentary Support Retainer"
    ],
    note: "Perfect for landing pages and simple professional websites that load at lightspeed."
  },
  {
    id: "elite-command",
    name: "ELITE COMMAND",
    price: "1199",
    priceNote: "/project",
    featured: true,
    timeline: "2-4 weeks",
    features: [
      "Dynamic Website build, fix and adjust",
      "1 Dynamic Dashboard Included",
      "Workflow management and automation loops",
      "AI-Powered Analytics Dashboard",
      "Advanced Security Package (DDoS, SSL, Firewall)",
      "API Development & Integration",
      "Performance Optimization (CDN, minification, Core Web Vitals)",
      "Priority SLA Support & 1-Month Free Maintenance"
    ],
    note: "Ultimate control, enterprise-grade architecture, and real-time intelligent monitoring."
  },
  {
    id: "growth-engine",
    name: "GROWTH ENGINE",
    price: "3599",
    priceNote: "/project",
    timeline: "4-7 weeks",
    features: [
      "Includes all features from the $1,199 Elite Command Package",
      "5 Workflow Automations",
      "Workspace setup & custom domain routing",
      "Advanced Business KPI Dashboard",
      "Structured Customer Ticketing System",
      "Automated SEO Optimization",
      "Multi-Language Support",
      "E-commerce Integration (Stripe, PayPal, GCash)",
      "Content Management System (CMS)",
      "Comprehensive Live Database Synchronization"
    ],
    note: "Full commercial power to scale operations, accept international payments, and self-manage content."
  }
];

export const MOBILE_PACKAGES_DATA: PackageItem[] = [
  {
    id: "pwa-conversion",
    name: "Tier 1: PWA Conversion",
    price: "2888",
    priceNote: "/conversion",
    scope: "Convert your existing web platform into a high-performance Progressive Web App (PWA).",
    features: [
      "Full offline functionality and local persistence",
      "Automated push notifications routing",
      "Mobile-optimized UI/UX elements"
    ],
    deployment: "Direct web-based delivery (bypasses Apple App Store and Play Store).",
    note: "Convert your existing web presence into an installable mobile app instantly."
  },
  {
    id: "native-app",
    name: "Tier 2: Native App (iOS/Android)",
    price: "5777",
    priceNote: "/app",
    featured: true,
    scope: "Wrap and optimize your platform into a native container using Capacitor or React Native.",
    features: [
      "All Tier 1 capabilities (offline storage, push notifications)",
      "Native device feature access (Camera, Biometrics, Geolocation)",
      "Secure system-level persistent credentials"
    ],
    deployment: "Standard deployment execution for Apple App Store and Play Store, including basic compliance and troubleshooting support.",
    note: "Perfect for hybrid stores or workflows that require dedicated App Store distribution."
  },
  {
    id: "full-custom-mobile",
    name: "Tier 3: Full Custom Mobile",
    price: "12888",
    priceNote: "/app",
    scope: "Complete from-scratch mobile application development built for high scalability.",
    features: [
      "Custom brand identity & responsive pixel-perfect layouts",
      "Advanced custom UI/UX animations and interactions",
      "Native biometric authentication (FaceID/Fingerprint)",
      "Real-time cross-platform active database synchronization"
    ],
    deployment: "End-to-end white-glove deployment assistance, including developer account setup walkthroughs, app store optimization, and strict submission handling.",
    note: "Complete bespoke native mobile system engineered from the ground up for massive throughput."
  }
];

export const BLOG_DATA: BlogItem[] = [
  {
    id: "b1",
    category: "Workflow",
    date: "June 1, 2026",
    title: "5 Workflow Automations Every Small Business Needs in 2026",
    excerpt: "Discover the essential automations that can save your team 10+ hours per week. From email routing to invoice processing, these workflows pay for themselves.",
    bgGradient: "linear-gradient(135deg, #0d0a02, #241d06)",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=650&q=80"
  },
  {
    id: "b2",
    category: "Security",
    date: "May 28, 2026",
    title: "Remote Work Security: Protecting Your Business Data",
    excerpt: "With hybrid work here to stay, learn the critical security measures every remote team must implement to prevent data breaches and unauthorized access.",
    bgGradient: "linear-gradient(135deg, #120f03, #2a2208)",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=650&q=80"
  },
  {
    id: "b3",
    category: "Data",
    date: "May 20, 2026",
    title: "Building Your First KPI Dashboard with Power BI",
    excerpt: "A step-by-step guide to creating actionable business dashboards. Learn which metrics matter and how to present them for maximum impact.",
    bgGradient: "linear-gradient(135deg, #090802, #1c1705)",
    imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=650&q=80"
  },
  {
    id: "b4",
    category: "Support",
    date: "May 15, 2026",
    title: "Why Your Business Needs a Ticketing System Yesterday",
    excerpt: "Still managing support via email? Here is why structured ticketing transforms customer satisfaction and team productivity.",
    bgGradient: "linear-gradient(135deg, #151103, #32280a)",
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=650&q=80"
  }
];

export const FAQ_DATA: FaqItem[] = [
  {
    id: "faq-local-developer",
    question: "Where are you based, and what makes your Virtual Tech Assistant & Website Developer services unique in the Philippines?",
    answer: "I am JS Pait (Jeys), a trusted and highly reliable virtual tech assistant and premium website developer based in Taguig, Manila, Philippines. Clients describe me as the absolute best and most easy to talk to, flexible professional who works fast, keeps communications human and direct, and consistently delivers 'premium done' technical support and IT infrastructure at highly practical prices."
  },
  {
    id: "faq-payment-terms",
    question: "What are your payment terms? Do you offer a 50% down payment or a no downpayment option?",
    answer: "To ensure absolute client confidence and reliability, my payment terms are incredibly flexible. I offer a standard 50% down payment model to initiate development, and for qualified businesses, a special no downpayment option where you pay only when the premium system is fully completed and delivered. Combined with practical prices, this makes working with me completely risk-free, direct, and elite."
  },
  {
    id: "faq1",
    question: "How quickly can we start operations?",
    answer: "Most technical configurations and reviews kick off within 48 hours of agreement sign-off. For high-priority projects under the Professional or Enterprise channels, accelerated same-day starts can be organized after direct scope reviews."
  },
  {
    id: "faq2",
    question: "Do you offer post-launch maintenance?",
    answer: "Yes, absolutely! Every single website design or automation package includes exactly 1-Month of complimentary maintenance. For extended durations, clients can choose between flexible monthly support retainers or pay-as-you-go tech assist hours."
  },
  {
    id: "faq3",
    question: "What protocols keep client data safe?",
    answer: "I implement strict military-grade administrative protocols including multi-factor authentication (MFA) across all configurations, encrypted end-to-end file transmitters, zero stored password policies (Vault utilization), and binding non-disclosure agreements (NDAs) standard for elite institutional standards."
  },
  {
    id: "faq4",
    question: "Are your pricing structures flexible?",
    answer: "Refunds, milestone shifts, and adjustments are handled on a transparent, case-by-case basis. If the custom automated deliverables do not align with our finalized contract scoping, refund parameters will be discussed openly to ensure client confidence."
  },
  {
    id: "faq5",
    question: "Can you implement integrations on my pre-existing platform?",
    answer: "Yes! I specialize in smooth adaptation. Instead of forcing you to purchase brand new licenses, I optimize your current systems (such as Slack, Excel, AWS, or Asana) to function at peak synergy, only recommending structural changes when they offer high ROI."
  },
  {
    id: "faq-timeline",
    question: "What is the typical timeline for project delivery?",
    answer: "Timeline depends on the scope of the package you select: Foundation setups are delivered fast within 5-8 days; Growth Engine modules are completed in 2-3 weeks; and comprehensive Elite Command systems are fully engineered, secured, and deployed in 4-6 weeks."
  }
];

export const RESUME_DATA: ResumeData = {
  name: "Jeddah San T. Pait",
  title: "Full Stack Data Analyst & Technical Founder",
  summary: "Analytical and tech-driven Full Stack Data Analyst & Technical Founder with over 6 years of tenure at a major global financial services institution and verified success in full-stack digital solutions. Proven track record of executing complex financial pricing models (RPP), advanced data automation pipelines (Alteryx), and custom interface utilities (HTML). Recipient of an internal VP Award for operational excellence in mortgage analysis. Adept at engineering end-to-end technical infrastructure and driving logic-based workflow optimizations. Seeking to leverage dual expertise in finance and software development as a Quant Analyst Apprentice.",
  contact: {
    location: "#2 Caimito St., Taguig",
    website: "www.7jntech.com",
    email1: "Js@jntech.com",
    email2: "7jntech@gmail.com",
    phone: "0915-326-7244 / 0929-271-1826"
  },
  skills: [
    {
      category: "Data & Quantitative",
      items: ["Home Loan Relationship Offer (RPP) Logic", "Advanced Process Automation (Alteryx)", "FSO Clearing", "Drcomms Reporting"]
    },
    {
      category: "Web & IT Infrastructure",
      items: ["HTML / Responsive Web Frameworks", "Domain Configuration", "Workspace Integration", "Live Site Deployment", "Vite / Vite Dev & Configs"]
    },
    {
      category: "Programming",
      items: ["Java (Basic)", "C++ (Basic)", "TypeScript", "Logic Formulation", "Algorithms"]
    },
    {
      category: "Specialized Systems",
      items: ["Mortgage Navigator", "Sabre Red / Amadeus GDS", "MS Excel (Advanced DAX / VBA)"]
    }
  ],
  experience: [
    {
      company: "7JNTECH ASSIST",
      role: "Technical Founder / Lead Developer (Freelance)",
      dates: "June 2026 – Present",
      bullets: [
        "Architect and develop custom, responsive websites and digital solutions for independent clients using modern web frameworks.",
        "Manage end-to-end technical infrastructure, executing domain configuration, Workspace integration, and live production site deployment.",
        "Established legal business frameworks to independently manage client contracting, service billing, and project delivery pipelines."
      ],
      highlight: true
    },
    {
      company: "Global Financial Services Institution",
      role: "Data Analyst & Business Operations, Home Lending",
      dates: "September 2019 – June 2026 | BGC, Taguig",
      bullets: [
        "Pricing & Technical Support (2022 - June 2026): Execute the RPP (Home Loan Relationship Offer) calculator to determine precise pricing for client-specific lending products. Serve as Pre-op/HLA Pre-op Reviewer, managing Drcomms and clearing FSO requirements while assisting Underwriters and CCS teams.",
        "BA Strategic Initiative (July 2025 - Dec 2025): Spearheaded a high-impact, six-month strategic initiative directly collaborating with the VP of Mortgage Business Analysis in Manila, resulting in an internal award for operational excellence.",
        "Process Automation: Design and execute advanced process automations utilizing Alteryx, significantly reducing manual reporting time and minimizing critical errors in government loan distributions.",
        "Title Analyst (2020 - 2022): Conducted deep-dive analysis of legal titles and financial liens. Identified and resolved complex discrepancies to ensure property eligibility and mitigate firm-wide risk.",
        "Risk & Review / Origination (2019 - 2020): Ensured adherence to strict regulatory standards during home lending origination, including Verification of Employment (VOE), Homeowners Insurance (HOI), and Payoffs."
      ]
    },
    {
      company: "Teleperformance",
      role: "HLCC Hilton Hotel Reservation Support",
      dates: "November 2017 – August 2019",
      bullets: [
        "Managed complex reservations and high-tier customer support for the global Hilton portfolio during an account acquisition phase."
      ]
    },
    {
      company: "Intelenet Global Services",
      role: "Analyst / Specialist",
      dates: "2016 – 2017",
      bullets: [
        "Executed critical analytical tasks and supported specialized operational processes to ensure service delivery targets were met consistently."
      ]
    },
    {
      company: "KPO Learning Global Support",
      role: "Global Support Representative",
      dates: "January 2016 – March 2016",
      bullets: [
        "Provided comprehensive global support and issue resolution, maintaining high standards of communication and technical troubleshooting."
      ]
    },
    {
      company: "Teleperformance Ayala (Former Aegis People Support)",
      role: "Tier 2 Retention / GDS Flex Trainer",
      dates: "2014 – 2016",
      bullets: [
        "Facilitated high-level training for Global Distribution Systems (Sabre/Amadeus) and acted as a Tier 2 escalation point for complex retention issues."
      ]
    },
    {
      company: "Jugno's Monster Pizza",
      role: "Restaurant Manager",
      dates: "2013 – 2014",
      bullets: [
        "Managed daily shop operations and designed local promotional marketing materials to drive sales."
      ]
    },
    {
      company: "National Bureau of Investigation (NBI) — Manila",
      role: "Confidential Assistant – Security Management Division (OJT)",
      dates: "OJT Period",
      bullets: [
        "Managed sensitive and confidential documentation, case logs, and administrative records for the Special Investigator IV (SI IV) team.",
        "Maintained high standards of data discretion and security compliance while supporting internal background verification and risk management processes.",
        "Utilized database fundamentals to organize, track, and retrieve investigative files efficiently."
      ]
    }
  ],
  projects: [
    {
      title: "HTML Program: Loan Tracker & Task Distribution Portal",
      desc: "Developed an internal user interface utility designed to track home loans and optimize work distribution for Drcomms reporting and Junior Underwriter (UW) tasks to eliminate manual oversight gaps."
    },
    {
      title: "Alteryx Automation Pipeline: Drop Folder to Queue Distribution",
      desc: "Engineered a custom data-routing workflow in Alteryx connecting a single secure drop folder directly to downstream networks, replacing manual sorting with automated logical routing."
    }
  ],
  honors: [
    "VP Recognition & Award Certificate — Mortgage Business Analysis Team (2025). Awarded by the Business Analyst Team VP for exceptional multitasking capabilities, managing complex Drcomms operations while simultaneously architecting the automated assignment workflow of Government Loans."
  ],
  certifications: [
    "Digital Accelerator: Green Belt (Alteryx Certification) — Enterprise Finance Group",
    "Product Owner Foundations (Agile Methodology) — Professional Development Certification",
    "Harvard ManageMentor: Making a Decision — Harvard Business Publishing",
    "Harvard ManageMentor: Sharpening Your Business Acumen — Harvard Business Publishing"
  ],
  education: [
    {
      school: "ACLC Guadalupe (AMA)",
      detail: "BS in Information Technology (Software Development)"
    },
    {
      school: "ABE International Business College (AMA)",
      detail: "BS in Information Systems (SEEDS Program Scholar)"
    }
  ]
};
