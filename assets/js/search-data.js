// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "Publications",
          description: "Peer-reviewed publications by Samiul Alam across NeurIPS, MobiSys, NAACL, SenSys, ICASSP, INTERSPEECH, TMLR, and IEEE — spanning spatial computing, AR supermemory (MemoLens, SuperMemory-VQA), LLM compression (SVD-LLM V2), federated learning (FedRolex, FedAIoT), and Bengali.AI.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "Curriculum Vitae of Samiul Alam — Software Engineer at Google, CSE Ph.D. from The Ohio State University, former Research Scientist Intern at Meta Reality Labs, and Co-Founder of Bengali.AI.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "news-joined-msu-aiot-mlsys-lab-as-a-graduate-research-assistant",
          title: 'Joined MSU AIoT-MLSys Lab as a Graduate Research Assistant',
          description: "",
          section: "News",},{id: "news-invited-to-present-my-research-on-model-heterogeneous-federated-learning-at-google-s-workshop-on-federated-learning-and-analytics",
          title: 'Invited to present my research on model heterogeneous federated learning at Google’s Workshop...',
          description: "",
          section: "News",},{id: "news-humbled-to-be-awarded-the-highly-competitive-osu-graduate-school-university-fellowship",
          title: 'Humbled to be awarded the highly competitive OSU Graduate School University Fellowship!',
          description: "",
          section: "News",},{id: "news-finished-my-ms-degree-at-msu-and-joined-osu-as-a-graduate-fellow",
          title: 'Finished my MS degree at MSU and joined OSU as a Graduate Fellow....',
          description: "",
          section: "News",},{id: "news-my-research-on-multi-channel-skin-conductance-deconvolution-was-published-at-ieee-journal-of-open-engineering-medicine-and-biology",
          title: 'My research on Multi-channel Skin Conductance deconvolution was published at IEEE Journal of...',
          description: "",
          section: "News",},{id: "news-our-survey-paper-on-efficient-llms-has-been-accepted-at-tmlr",
          title: 'Our survey paper on Efficient LLMs has been accepted at TMLR!',
          description: "",
          section: "News",},{id: "news-my-work-on-multi-state-filtering-has-been-published-in-plos-one",
          title: 'My work on multi-state filtering has been published in PLOS ONE.',
          description: "",
          section: "News",},{id: "news-our-paper-svd-llm-v2-optimizing-singular-value-truncation-for-large-language-model-compression-was-accepted-to-naacl-2025-main-conference",
          title: 'Our paper SVD-LLM V2: Optimizing Singular Value Truncation for Large Language Model Compression...',
          description: "",
          section: "News",},{id: "news-our-ieee-infocom-2025-paper-geofl-was-selected-for-fast-track-invitation-to-ieee-transactions-on-networking-ton-and-gpt-fl-was-accepted-at-cvprw-2025",
          title: 'Our IEEE INFOCOM 2025 paper GeoFL was selected for fast-track invitation to IEEE...',
          description: "",
          section: "News",},{id: "news-honored-to-receive-the-ieee-internet-computing-best-paper-award-for-the-internet-of-things-in-the-era-of-generative-ai-vision-and-challenges",
          title: 'Honored to receive the IEEE Internet Computing Best Paper Award for “The Internet...',
          description: "",
          section: "News",},{id: "news-wrapped-up-my-summer-software-engineering-internship-at-google-in-mountain-view-ca",
          title: 'Wrapped up my summer Software Engineering Internship at Google in Mountain View, CA!...',
          description: "",
          section: "News",},{id: "news-two-papers-reading-recognition-in-the-wild-and-benchmarking-is-broken-have-been-accepted-at-neurips-2025",
          title: 'Two papers — Reading Recognition in the Wild and Benchmarking is Broken —...',
          description: "",
          section: "News",},{id: "news-our-paper-memolens-empowering-augmented-reality-glasses-with-super-memory-was-accepted-to-acm-mobisys-2026",
          title: 'Our paper MemoLens: Empowering Augmented Reality Glasses with Super Memory was accepted to...',
          description: "",
          section: "News",},{id: "news-joined-meta-reality-labs-in-redmond-wa-as-a-research-scientist-intern-with-the-sensors-amp-amp-systems-research-team-working-on-rl-driven-egocentric-perception-for-prototype-wearable-glasses",
          title: 'Joined Meta Reality Labs in Redmond, WA as a Research Scientist Intern with...',
          description: "",
          section: "News",},{id: "news-successfully-defended-my-ph-d-dissertation-towards-supermemory-in-spatial-computing-a-multimodal-approach-for-memory-creation-retrieval-and-visual-reasoning-at-the-ohio-state-university-advised-by-prof-mi-zhang",
          title: 'Successfully defended my Ph.D. dissertation, “Towards Supermemory in Spatial Computing: A Multimodal Approach...',
          description: "",
          section: "News",},{id: "news-invited-to-serve-on-the-technical-program-committee-tpc-for-ieee-msn-2026-22nd-ieee-international-conference-on-mobility-sensing-and-networking-alongside-pc-reviewing-service-for-iclr-2027-aaai-2027-and-cvpr-2027",
          title: 'Invited to serve on the Technical Program Committee (TPC) for IEEE MSN 2026...',
          description: "",
          section: "News",},{id: "news-my-ph-d-dissertation-was-officially-approved-by-the-ohio-state-university-graduate-school-and-archived-on-ohiolink",
          title: 'My Ph.D. dissertation was officially approved by The Ohio State University Graduate School...',
          description: "",
          section: "News",},{id: "news-joined-google-in-mountain-view-ca-full-time-as-a-software-engineer-working-on-user-activity-modeling-and-agentic-recommendation-systems",
          title: 'Joined Google in Mountain View, CA full-time as a Software Engineer working on...',
          description: "",
          section: "News",},{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/samiul272", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/samiul-alam", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=2Un1c7QAAAAJ", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0000-0002-8458-4642", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
