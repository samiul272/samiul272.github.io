// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "publications",
          description: "My publications by year in chronological order.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "For latest resume, please download the pdf.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "post-google-gemini-updates-flash-1-5-gemma-2-and-project-astra",
        
          title: 'Google Gemini updates: Flash 1.5, Gemma 2 and Project Astra <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "We’re sharing updates across our Gemini family of models and a glimpse of Project Astra, our vision for the future of AI assistants.",
        section: "Posts",
        handler: () => {
          
            window.open("https://blog.google/technology/ai/google-gemini-update-flash-ai-assistant-io-2024/", "_blank");
          
        },
      },{id: "post-displaying-external-posts-on-your-al-folio-blog",
        
          title: 'Displaying External Posts on Your al-folio Blog <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/@al-folio/displaying-external-posts-on-your-al-folio-blog-b60a1d241a0a?source=rss-17feae71c3c4------2", "_blank");
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-a-long-announcement-with-details",
          title: 'A long announcement with details',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-joined-msu-aiot-mlsys-lab-as-a-graduate-research-assistant",
          title: 'Joined MSU AIoT-MLSys Lab as a Graduate Research Assistant',
          description: "",
          section: "News",},{id: "news-invited-to-present-my-research-on-model-heterogeneous-federated-learning-at-google-s-workshop-on-federated-learning-and-analyics",
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
          section: "News",},{id: "news-my-work-on-multi-state-filtering-has-been-published-in-ploss-one",
          title: 'My work on multi-state filtering has been published in Ploss One.',
          description: "",
          section: "News",},{id: "news-happy-to-announce-that-i-wrapped-up-my-phd-internship-at-google",
          title: 'Happy to announce that I wrapped up my PhD internship at Google.',
          description: "",
          section: "News",},{id: "news-two-of-my-papers-have-been-accepted-at-neurips-2025",
          title: 'Two of my papers have been accepted at NeurIPS 2025!',
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
