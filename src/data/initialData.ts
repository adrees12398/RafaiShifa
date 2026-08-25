import { Product, BlogPost, TeamMember, FAQItem } from '../types';

// All products removed - store is now empty
// Add your own products through Admin Panel
export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'The Miraculous Healing Powers of Kalonji (Black Seed) in Sunnah & Science',
    titleUrdu: 'کلونجی کے طبی فوائد اور نبوی تعالیم',
    excerpt: 'Explore why Nigella Sativa is hailed as a divine cure, supported by both Islamic traditions and modern clinical research.',
    content: `Kalonji (Nigella Sativa) holds a prominent position in Islamic Tib-e-Nabvi. Hadith collections highlight its virtues as containing a remedy for every ailment except old age and death.

Modern pharmacological research has identified Thymoquinone as the primary bioactive constituent in black seeds. Thymoquinone possesses potent anti-inflammatory, antioxidant, immunomodulatory, and bronchodilator qualities.

### Key Benefits:
1. **Immune Enhancement**: Stimulates T-cell production and antibody activity.
2. **Respiratory Health**: Relieves asthma symptoms, seasonal allergies, and bronchial constriction.
3. **Blood Sugar Regulation**: Assists insulin sensitivity and glucose metabolism.
4. **Digestive Comfort**: Soothes gastric ulcers and liver toxicity.

At **RafaiShifa**, we ensure that our Kalonji Oil is cold-extracted without thermal degradation, maintaining 100% natural potency.`,
    category: 'Tib-e-Nabvi',
    author: 'Hakeem Muhammad Tariq',
    authorRole: 'Chief Physician (Unani Specialist)',
    date: 'August 2, 2026',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    tags: ['Kalonji', 'Tib-e-Nabvi', 'Immunity', 'Herbal Science']
  },
  {
    id: 'blog-2',
    title: 'Understanding Temperament (Mizaj) in Unani Medicine for Personalized Health',
    titleUrdu: 'مزاج شناسی اور یونانی طب میں اس کی اہمیت',
    excerpt: 'Learn how identifying your unique Mizaj (Hot, Cold, Moist, Dry) can guide your diet, lifestyle, and herbal remedies.',
    content: `In Unani Tib, every human organism possesses a unique temperament known as **Mizaj**. Disease arises when internal humors (Dam, Balgham, Safra, Sauda) fall out of equilibrium due to diet, emotional stress, or environmental shifts.

### The Four Core Temperaments:
- **Damwi (Sanguine - Hot & Moist)**: Energetic, good circulation, prone to blood heat.
- **Balghami (Phlegmatic - Cold & Moist)**: Calm, slow metabolism, prone to chest congestion.
- **Safrawi (Choleric - Hot & Dry)**: Quick-tempered, sharp digestion, prone to acidity and dry skin.
- **Saudawi (Melancholic - Cold & Dry)**: Analytical, thoughtful, prone to insomnia and joint stiffness.

Knowing your Mizaj allows our Hakeems at RafaiShifa to prescribe the exact opposing herbal formula to restore equilibrium naturally.`,
    category: 'Unani Philosophy',
    author: 'Dr. Ayesha Al-Hashemi',
    authorRole: 'Unani Research Advisor',
    date: 'July 28, 2026',
    readTime: '7 min read',
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
    tags: ['Mizaj', 'Unani Philosophy', 'Wellness', 'Holistic Health']
  },
  {
    id: 'blog-3',
    title: 'Natural Remedies for Joint Pain, Backache, and Nerve Inflammation',
    titleUrdu: 'جوڑوں اور اعصاب کے درد کا جڑی بوٹیوں سے علاج',
    excerpt: 'How prophetic oils like Balsan, Myrrh, and Olive Oil combined with herbal pastes relieve stubborn arthritic aches.',
    content: `Joint stiffness and sciatica are frequently attributed to cold humor accumulation in deep synovial tissue. Synthetic analgesics often mask symptoms while irritating the gastric lining. Unani medicine uses warming topical herbal oils and internal restorative Majoons.

### Effective Natural Strategy:
1. **Topical Balsan & Kalonji Warm Oil Massage**: Gently stimulates capillary circulation and dissipates localized swelling.
2. **Internal Turmeric & Ginger Decoction**: Reduces inflammatory cytokines safely.
3. **Avoid Cold Foods**: Minimize chilled drinks and heavy dairy that increase Balgham humor.

Discover our specially prepared **Roghan-e-Balsan** at RafaiShifa for long-lasting joint comfort.`,
    category: 'Herbal Remedies',
    author: 'Hakeem Imran Khan',
    authorRole: 'Senior Herbalist',
    date: 'July 15, 2026',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    tags: ['Joint Pain', 'Roghan Balsan', 'Arthritis', 'Natural Healing']
  }
];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'team-mohsin',
    name: 'Dr. Hakeem Hafiz Mohsin Ali',
    title: 'Chief Unani & Homeopathic Physician',
    qualification: 'DHMS, DUMS, Fazil-e-Tibb, Gold Medalist',
    credentialsList: [
      'DHMS (Diploma in Homeopathic Medical Sciences)',
      'DUMS (Diploma in Unani Medical Sciences)',
      'Fazil-e-Tibb',
      'Gold Medalist',
      'National Councillor – Islamabad',
      'National Council for Tibb (NCT) Reg No: QH-30989-A',
      'Punjab Healthcare Commission (PHC) Reg No: R-21465'
    ],
    experience: '25+ Years of Professional Clinical Experience',
    specialty: 'Liver & Digestive, Chronic Diseases, Men & Women\'s Health, Unani & Homeopathic Medicine',
    specialtiesList: [
      'Liver & Digestive Disorders',
      'Chronic Diseases',
      'Men & Women\'s Health',
      'Lifestyle Disorders',
      'Unani & Homeopathic Medicine'
    ],
    bio: 'Dr. Hakeem Hafiz Mohsin Ali is a highly experienced Unani and Homeopathic Physician with over 25 years of clinical practice. He holds DHMS and DUMS qualifications, is a Fazil-e-Tibb, a Gold Medalist, and has served as a National Councillor, Islamabad.\n\nWith a strong commitment to authentic Unani and Homeopathic medicine, he has dedicated his career to providing safe, natural, and evidence-based healthcare. His mission through Rafai Shifa is to combine traditional wisdom with modern healthcare practices, helping patients achieve long-term wellness through trusted herbal and natural treatments.',
    imageUrl: '/products/hakeem-mohsin-ali.jpg',
    isHeadPhysician: true
  },
  {
    id: 'team-2',
    name: 'Dr. Ayesha Al-Hashemi',
    title: 'Head of Herbal Research & Quality',
    qualification: 'M.Phil Phytochemistry, BUMS',
    credentialsList: [
      'M.Phil Phytochemistry',
      'BUMS (Bachelor of Unani Medicine & Surgery)',
      'Botanical Analytics Lead'
    ],
    experience: '15+ Years Research & Botanical Analytics',
    specialty: 'Botanical Standardization, Saffron & Honey Testing, Clinical Safety',
    specialtiesList: [
      'Botanical Standardization',
      'Saffron & Honey Purity Testing',
      'Clinical Herbal Safety'
    ],
    bio: 'Oversees rigorous quality control at RafaiShifa. Ensures every herb and compound passes heavy metal tests, purity verifications, and cold-extraction standard protocols.',
    imageUrl: ''
  },
  {
    id: 'team-3',
    name: 'Hakeem Imran Khan',
    title: 'Senior Unani Consultant',
    qualification: 'D.U.M.S, Specialist in Prophetic Medicine',
    credentialsList: [
      'D.U.M.S (Unani Medicine)',
      'Specialist in Prophetic Medicine (Tib-e-Nabvi)'
    ],
    experience: '18+ Years Clinical Practice',
    specialty: 'Joint Care, Nerve Rehabilitation, Respiratory Care',
    specialtiesList: [
      'Joint Care & Arthritis Remedies',
      'Nerve Rehabilitation',
      'Respiratory & Chest Care'
    ],
    bio: 'Specializes in pain management, arthritis therapies, and herbal oil extractions. Passionate about spreading authentic Tib-e-Nabvi knowledge to global households.',
    imageUrl: ''
  }
];

export const FAQS: FAQItem[] = [
  {
    question: 'Are RafaiShifa medicines 100% natural and free from side effects?',
    answer: 'Yes! All RafaiShifa products are prepared from pure botanical extracts, natural Sidr honey, minerals, and cold-pressed oils. We strictly exclude synthetic steroids, chemical preservatives, and artificial additives.',
    category: 'Product Quality'
  },
  {
    question: 'How do I know which product suits my condition or Mizaj?',
    answer: 'You can read detailed dosage and benefit breakdowns on each product page or send a direct consultation message through our Help Page. Our qualified Hakeems will guide you.',
    category: 'Usage & Guidance'
  },
  {
    question: 'What are the delivery times and payment methods?',
    answer: 'We deliver nationwide within 2-4 business days. Payment methods include Cash on Delivery (COD), JazzCash, EasyPaisa, and Direct Bank Transfer.',
    category: 'Shipping & Payment'
  },
  {
    question: 'Can I take Unani herbal remedies alongside conventional medicines?',
    answer: 'In most cases yes, provided you maintain a 1 to 2-hour interval between taking allopathic and herbal formulas. Always consult our expert Hakeems if you are on prescribed blood thinners or chronic medication.',
    category: 'Medical Advice'
  }
];
