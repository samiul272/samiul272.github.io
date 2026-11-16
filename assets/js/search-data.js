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
          section: "News",},{id: "news-happy-to-announce-that-i-wrapped-up-my-phd-internship-at-google",
          title: 'Happy to announce that I wrapped up my PhD internship at Google.',
          description: "",
          section: "News",},{id: "news-two-of-my-papers-have-been-accepted-at-neurips-2025",
          title: 'Two of my papers have been accepted at NeurIPS 2025!',
          description: "",
          section: "News",},{id: "news-started-my-summer-internship-as-a-research-scientist-intern-at-meta-reality-labs-in-redmond-wa",
          title: 'Started my summer internship as a Research Scientist Intern at Meta Reality Labs...',
          description: "",
          section: "News",},{id: "news-successfully-defended-my-ph-d-dissertation-towards-supermemory-in-spatial-computing-a-multimodal-approach-for-memory-creation-retrieval-and-visual-reasoning-at-the-ohio-state-university",
          title: 'Successfully defended my Ph.D. dissertation, “Towards Supermemory in Spatial Computing: A Multimodal Approach...',
          description: "",
          section: "News",},{id: "news-our-paper-memolens-empowering-augmented-reality-glasses-with-super-memory-was-published-at-acm-mobisys-2026",
          title: 'Our paper MemoLens: Empowering Augmented Reality Glasses with Super Memory was published at...',
          description: "",
          section: "News",},{id: "news-completed-my-ph-d-at-osu-and-joined-google-in-mountain-view-ca-full-time-as-a-software-engineer",
          title: 'Completed my Ph.D. at OSU and joined Google in Mountain View, CA full-time...',
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
