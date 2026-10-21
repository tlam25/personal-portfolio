/* ============================================================
   data.js — everything personal lives here.
   Edit this file to update the portfolio; the town rebuilds itself.
   `kind` maps to a building blueprint in town.js.
   ============================================================ */

export const PROFILE = {
  name: 'Thanh-Lam T. Nguyen',
  email: 'nttlam25022004@gmail.com',
  github: 'https://github.com/tlam25',
  location: 'Viet Nam',
};

export const PLACES = [
  /* ---------------------------------------------------------- */
  {
    id: 'about',
    kind: 'wishtree',
    label: 'Wishing Tree',
    emoji: '🌸',
    icon: '🌸',
    title: 'Hello, I am Lam',
    subtitle: 'Final-year Information Systems student · aspiring PhD researcher',
    angle: null,            // null = town centre
    radius: 0,
    palette: ['#ffc3dd', '#e4c9f7'],
    body: [
      { type: 'quote', text: 'I build systems that notice what people compare but never say out loud — and I try to make those systems explain themselves.' },
      {
        type: 'entry',
        title: 'What I work on',
        body: [
          'Natural language processing for <strong>implicit comparative opinion mining</strong>: recovering the preference hidden between two reviews written by the same person.',
          'Explainable and graph-based deep learning — aspect-level scoring, semantic reasoning, SHAP-based attribution.',
          'Knowledge graphs and LLM agents: Text2Cypher, multi-hop retrieval, RAG and agentic orchestration.',
        ],
      },
      {
        type: 'entry',
        title: 'Where to find me',
        body: [
          'Email · <a class="link" href="mailto:nttlam25022004@gmail.com">nttlam25022004@gmail.com</a>',
          'GitHub · <a class="link" href="https://github.com/tlam25" target="_blank" rel="noopener">github.com/tlam25</a>',
          'Based in Viet Nam · open to PhD positions starting 2026–2027.',
        ],
      },
      { type: 'tags', items: ['NLP', 'Explainable AI', 'Knowledge Graphs', 'LLM Agents', 'Opinion Mining'] },
    ],
  },

  /* ---------------------------------------------------------- */
  {
    id: 'education',
    kind: 'academy',
    label: 'The Academy',
    emoji: '🎓',
    icon: '🎓',
    title: 'Education',
    subtitle: 'Where the foundations were laid',
    angle: 90,
    radius: 15.5,
    palette: ['#cfe0fb', '#9db9ea'],
    body: [
      {
        type: 'entry',
        title: 'VNU University of Engineering and Technology (VNU-UET)',
        when: 'Oct 2022 – Jun 2026',
        role: 'Bachelor of Science in Information Systems · Viet Nam',
        body: [
          '<strong>GPA 3.79 / 4.0</strong> — top 8% of the cohort, ranked 5th out of 76 students.',
          'University Encouragement Scholarship (4×).',
          'Toshiba Scholarship (2023 – 2024).',
          'EVN Scholarship (2024 – 2025).',
        ],
      },
      {
        type: 'entry',
        title: 'Languages & certifications',
        body: [
          'IELTS 7.0 / 9.0.',
          'Microsoft Office Specialist (MOS): Word, PowerPoint, Excel.',
        ],
      },
    ],
  },

  /* ---------------------------------------------------------- */
  {
    id: 'research',
    kind: 'observatory',
    label: 'Observatory of Papers',
    emoji: '🔭',
    icon: '📚',
    title: 'Research Publications',
    subtitle: 'Two papers, one obsession: what people mean without saying it',
    angle: 140,
    radius: 16.5,
    palette: ['#ded0fa', '#b49ae8'],
    body: [
      {
        type: 'entry',
        title: 'Comparing Without Saying: A Dataset and Benchmark for Implicit Comparative Opinion Mining from Same-User Reviews',
        when: 'Under review, 2026',
        role: '<u>Thanh-Lam T. Nguyen</u>, Ngoc-Quang Le, Thi-Phuong Le, Phuong-Nguyen Nguyen, Tu-Phuong Mai, Hoang-Quynh Le',
        body: [
          'Under review at <em>Language Resources and Evaluation</em>.',
          'Introduces a dataset and benchmark for preferences that are implied rather than stated, by pairing reviews written by the same user.',
        ],
      },
      {
        type: 'entry',
        title: 'XAI-Enhanced Comparative Opinion Mining via Aspect-Based Scoring and Semantic Reasoning',
        when: 'ICCCI 2026',
        role: 'Ngoc-Quang Le*, <u>Thanh-Lam T. Nguyen</u>*, Quoc-Trung Phu, Thi-Phuong Le, Duy-Cat Can, Hoang-Quynh Le &nbsp;(*equal contribution)',
        body: [
          'In: <em>Advances in Computational Collective Intelligence</em>, ICCCI 2026. Communications in Computer and Information Science, vol. 3044. Springer, Cham.',
          '<a class="link" href="https://doi.org/10.1007/978-3-032-37936-8_11" target="_blank" rel="noopener">doi.org/10.1007/978-3-032-37936-8_11</a>',
        ],
      },
      { type: 'tags', items: ['Comparative Opinion Mining', 'Explainable AI', 'Benchmark Design', 'Springer CCIS'] },
    ],
  },

  /* ---------------------------------------------------------- */
  {
    id: 'lab',
    kind: 'greenhouse',
    label: 'The Research Lab',
    emoji: '🧪',
    icon: '🧪',
    title: 'Research Experience',
    subtitle: 'Data Science and Knowledge Technology Lab, VNU-UET',
    angle: 190,
    radius: 15,
    palette: ['#c8ecdc', '#8fcdb4'],
    body: [
      {
        type: 'entry',
        title: 'Research Assistant — DS&KT Lab, VNU-UET',
        when: 'Jul 2024 – Present',
        role: 'Viet Nam',
        body: [
          'Constructed <strong>SUDO</strong>, a first-of-its-kind hierarchical dataset of <strong>4,150 same-user review pairs</strong> (15,191 sentences) that isolates implicit comparative preferences. Under review at <em>Expert Systems with Applications</em>.',
          'Designed <strong>XCom</strong>, a transparent Transformer-based framework combining aspect-based scoring, semantic reasoning and a SHAP-based explanation module — <strong>outperforming the strongest fine-tuned baseline by nearly 3 absolute F1 points</strong>. Accepted as a full paper at ICCCI 2026.',
        ],
      },
      {
        type: 'entry',
        title: 'Teaching Assistant — "Advanced Programming", VNU-UET',
        when: 'Jul 2024',
        role: 'Viet Nam',
        body: ['Supported lab sessions and assignment review for undergraduate programming students.'],
      },
      { type: 'tags', items: ['Dataset Construction', 'Transformers', 'SHAP', 'Annotation Design'] },
    ],
  },

  /* ---------------------------------------------------------- */
  {
    id: 'industry',
    kind: 'workshop',
    label: 'Engineering Workshop',
    emoji: '⚙️',
    icon: '⚙️',
    title: 'Industry Experience',
    subtitle: 'Shipping production software',
    angle: 240,
    radius: 16.5,
    palette: ['#ffe0c7', '#efb98d'],
    body: [
      {
        type: 'entry',
        title: 'Viettel Software — Software Engineer Intern',
        when: 'Mar 2025 – Jul 2025',
        role: 'Viettel Digital Talent 2025 · Viet Nam',
        body: [
          '<strong>Selected for a competitive three-month intensive program</strong> focused on industrial full-stack development practices.',
          'Engineered end-to-end features and optimised relational database schemas for query efficiency and data integrity.',
          'Collaborated in a Scrum team to deliver a production-ready system.',
          '<strong>Completed the internship with a formal full-time employment offer.</strong>',
        ],
      },
      {
        type: 'entry',
        title: 'AI Guru, Dagoras Technology and Communications JSC — Tutor',
        when: 'Sep 2026 – Present',
        role: 'Viet Nam',
        body: [
          'Tutor an <strong>AI Engineering course</strong> on LLM application development and Agentic AI: agents, tool use, memory, retrieval, RAG, LangChain and LangGraph.',
          'Design and deliver hands-on materials, labs and exercises that connect foundational AI concepts to modern engineering frameworks.',
          'Guide students through implementation, debugging and system design for agent workflows, retrieval pipelines and graph-based orchestration.',
        ],
      },
      { type: 'tags', items: ['Full-stack', 'PostgreSQL', 'Scrum', 'LangChain', 'LangGraph'] },
    ],
  },

  /* ---------------------------------------------------------- */
  {
    id: 'projects',
    kind: 'library',
    label: 'Project Atelier',
    emoji: '🗺️',
    icon: '🛠️',
    title: 'Academic Projects',
    subtitle: 'Things I built to find out whether they would work',
    angle: 300,
    radius: 15.5,
    palette: ['#ffd3e5', '#f0a4c6'],
    body: [
      {
        type: 'entry',
        title: 'Wikipedia-Based Knowledge Graph & Chatbot for Multi-hop Multiple-Choice QA',
        when: 'Mar 2025 – May 2025',
        role: 'Coursework project',
        body: [
          'Fine-tuned <strong>Qwen3-0.6B</strong> with QLoRA on a custom schema-aware dataset of <strong>3,000+ multi-hop (1–4 hop) queries</strong> for efficient, semantically valid Text2Cypher translation.',
          'Built a <strong>2,000+ question benchmark</strong> for deep reasoning, <strong>boosting 4-hop query accuracy by 24.9%</strong> over Gemini 2.5 Flash Lite.',
        ],
      },
      { type: 'tags', items: ['Neo4j', 'Cypher', 'QLoRA', 'Qwen3', 'RAG', 'Benchmarking'] },
    ],
  },

  /* ---------------------------------------------------------- */
  {
    id: 'skills',
    kind: 'windmill',
    label: 'Skill Windmill',
    emoji: '🌀',
    icon: '🧰',
    title: 'Skills & Tools',
    subtitle: 'What turns the gears',
    angle: 345,
    radius: 16,
    palette: ['#d8e7ff', '#a8c2ef'],
    body: [
      { type: 'skills', group: 'Machine Learning / NLP', items: ['PyTorch', 'Transformers', 'Scikit-Learn', 'BERT', 'GPT'], tone: '' },
      { type: 'skills', group: 'Programming Languages', items: ['Python', 'C++', 'SQL', 'Java', 'Cypher', 'HTML', 'CSS', 'Jupyter'], tone: 'pink' },
      { type: 'skills', group: 'Tools & Infrastructure', items: ['SQL Server', 'PostgreSQL', 'MySQL', 'Docker', 'Neo4j', 'Kaggle', 'GitHub', 'VS Code'], tone: 'mint' },
      { type: 'skills', group: 'Research & Planning', items: ['Problem Formulation', 'Literature Review', 'Experimental Design', 'Hypothesis Testing', 'Statistical Analysis', 'Data Visualization'], tone: '' },
      { type: 'entry', title: 'Languages', body: ['Vietnamese (native) · English — IELTS 7.0/9.0'] },
    ],
  },

  /* ---------------------------------------------------------- */
  {
    id: 'awards',
    kind: 'pavilion',
    label: 'Hall of Awards',
    emoji: '🏆',
    icon: '🏆',
    title: 'Awards & Achievements',
    subtitle: 'Small trophies from the road so far',
    angle: 40,
    radius: 16.5,
    palette: ['#fff0cf', '#e9c98a'],
    body: [
      {
        type: 'entry',
        title: '<span class="medal">🥉</span>VNU-UET Faculty-Level Student Scientific Research Conference 2026',
        when: 'Apr 2026',
        role: 'Third Prize',
        body: ['<em>Graph-Based Deep Learning Framework for Implicit Comparative Opinion Mining</em>'],
      },
      {
        type: 'entry',
        title: '<span class="medal">🥉</span>VNU-UET Faculty-Level Student Scientific Research Conference 2025',
        when: 'Apr 2025',
        role: 'Third Prize',
        body: ['<em>Explainability-Enhanced Framework for Deep Learning-Based Comparative Opinion Mining</em>'],
      },
      {
        type: 'entry',
        title: 'Scholarships',
        body: [
          'University Encouragement Scholarship (4×).',
          'Toshiba Scholarship, 2023 – 2024.',
          'EVN Scholarship, 2024 – 2025.',
        ],
      },
    ],
  },

  /* ---------------------------------------------------------- */
  {
    id: 'community',
    kind: 'hall',
    label: 'Community Square',
    emoji: '🎪',
    icon: '🎪',
    title: 'Co-curricular Activities',
    subtitle: 'Life outside the lab',
    angle: 0,
    radius: 15,
    palette: ['#e8d7fb', '#bfa3ea'],
    body: [
      {
        type: 'entry',
        title: 'Support Group of UET — President',
        when: 'Aug 2024 – Aug 2025',
        role: 'VNU-UET · Viet Nam',
        body: ['Led <strong>120+ members</strong> in running university-wide student support initiatives, from orientation to peer mentoring.'],
      },
      { type: 'tags', items: ['Leadership', 'Event Operations', 'Mentoring', 'Team Building'] },
    ],
  },
];
