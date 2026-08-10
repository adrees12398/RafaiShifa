import { Product, BlogPost, TeamMember, FAQItem } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-liverbost',
    name: 'Liverbost',
    urduName: 'لیور بوسٹ - مصفی جگر و معدہ',
    price: 950,
    originalPrice: 1100,
    category: 'Heart & Digestion',
    description: 'Herbal liver detox & enzyme activator syrup for fatty liver, hepatitis support, and jaundice.',
    fullDescription: 'Liverbost is a high-potency Unani botanical formulation designed to cleanse hepatic tissue, flush out accumulation of metabolic toxins, stimulate bile secretion, and improve sluggish appetite. Safe for long-term liver wellness.',
    dosage: '2 teaspoons twice daily before breakfast and dinner.',
    ingredients: ['Cichorium Intybus (Kasni)', 'Solanum Nigrum (Mako)', 'Kalonji Extract', 'Fennel Seed Concentrate'],
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewsCount: 142,
    isFeatured: true,
    inStock: true,
    unit: '240ml Syrup'
  },
  {
    id: 'prod-gestrocare',
    name: 'Gestrocare',
    urduName: 'گیسٹرو کیئر - معالجِ معدہ',
    price: 880,
    originalPrice: 1000,
    category: 'Heart & Digestion',
    description: 'Specialized Unani gastric formula for acidity, ulcer discomfort, bloating, and IBS relief.',
    fullDescription: 'Gestrocare provides rapid, gentle relief from hyperacidity, acid reflux, stomach burning, and flatulence. Formulated with cooling herbs that repair gastric mucosa and restore natural digestive fire.',
    dosage: '1 teaspoon after main meals with warm water.',
    ingredients: ['Anethum Graveolens', 'Mentha Piperita', 'Glycyrrhiza Glabra', 'Ajwain Desi'],
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 98,
    isFeatured: true,
    inStock: true,
    unit: '180g Jar'
  },
  {
    id: 'prod-slimaura',
    name: 'SlimAura',
    urduName: 'سلم اورا - قدرتی وزن گھٹانے کی دوا',
    price: 1450,
    originalPrice: 1700,
    category: 'Immunity & Daily Wellness',
    description: 'Natural herbal fat-burner & metabolic enhancer to shed excess body weight safely without weakness.',
    fullDescription: 'SlimAura combines active lipolytic botanical extracts that accelerate basal metabolic rate, suppress unhealthy appetite cravings, reduce water retention, and melt stubborn abdominal visceral fat.',
    dosage: '1 capsule morning and evening before meals with warm lemon water.',
    ingredients: ['Green Tea Extract', 'Garcinia Cambogia', 'Guggul Resin', 'Zingiber Officinale'],
    imageUrl: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 116,
    isFeatured: true,
    inStock: true,
    unit: '60 Herbal Capsules'
  },
  {
    id: 'prod-majon-jawahari',
    name: 'Majon E jawahari',
    urduName: 'معجونِ جواہری - مقوی عام و اعصاب',
    price: 2400,
    originalPrice: 2800,
    category: 'Immunity & Daily Wellness',
    description: 'Royal herbal confection infused with precious Kashmiri Saffron, Silver Leaf, and Amber for supreme vitality.',
    fullDescription: 'Majon E jawahari is a celebrated classical Unani restorative confection reserved for royal wellness. It rejuvenates the nervous system, overcomes physical exhaustion, enhances brain focus, and boosts stamina.',
    dosage: '3 to 5 grams once daily at night with warm milk.',
    ingredients: ['Kashmiri Saffron (Zafran)', 'Amber Pure', 'Silver Foil (Varg-e-Nuqra)', 'Pure Sidr Honey', 'Cardamom'],
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewsCount: 175,
    isFeatured: true,
    inStock: true,
    unit: '200g Glass Jar'
  },
  {
    id: 'prod-rogan-zafran',
    name: 'Rogan E Zafran',
    urduName: 'روغنِ زعفران - خالص ترین تیل',
    price: 1850,
    originalPrice: 2100,
    category: 'Joint Care & Oils',
    description: 'Pure Kashmiri Saffron oil for facial radiance, nerve strengthening, and scalp follicle nourishment.',
    fullDescription: 'Extracted from Grade-A Kashmiri Crocus Sativus stigmas infused in cold-pressed sweet almond oil. Excellent for soothing nervous tension, evening skin tone, and deep tissue stimulation.',
    dosage: 'Apply 3-5 drops on facial skin or gently massage onto scalp/affected nerves.',
    ingredients: ['Kashmiri Saffron Extract', 'Sweet Almond Base Oil', 'Sesame Oil'],
    imageUrl: 'https://images.unsplash.com/photo-1608571424266-edeb9bbefdec?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 88,
    isFeatured: true,
    inStock: true,
    unit: '30ml Dropper Bottle'
  },
  {
    id: 'prod-tila-azam',
    name: 'TILA E Azam',
    urduName: 'طلاءِ اعظم - خاص العظام',
    price: 1750,
    originalPrice: 2000,
    category: 'Joint Care & Oils',
    description: 'Classical Unani herbal topical oil for nerve weakness, muscle tissue repair, and local vitality.',
    fullDescription: 'TILA E Azam is a specialized herbal massage oil formulated with warming Unani essential extracts. It promotes micro-vascular blood flow, restores elasticity to fatigued muscles, and strengthens local tissue.',
    dosage: 'Gently massage 5-8 drops locally at bedtime.',
    ingredients: ['Clove Oil', 'Nutmeg Extract', 'Cinnamon Oil', 'Malkangani Oil', 'Olive Base'],
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 104,
    isFeatured: true,
    inStock: true,
    unit: '50ml Glass Bottle'
  },
  {
    id: 'prod-growmax',
    name: 'Growmax hair tonic',
    urduName: 'گرو میکس ہیئر ٹانک - بال لمبے اور گھنے',
    price: 1150,
    originalPrice: 1350,
    category: 'Tib-e-Nabvi Special',
    description: 'Organic botanical hair growth serum enriched with Amla, Reetha, Sikakai, and Kalonji for thick, strong hair.',
    fullDescription: 'Growmax hair tonic penetrates deep into hair roots, halts premature hair fall, cures stubborn dandruff, and stimulates dormant hair follicles for visibly thicker, lustrous hair.',
    dosage: 'Apply onto clean scalp 3-4 times a week, massage gently with fingertips.',
    ingredients: ['Kalonji Oil', 'Amla Extract', 'Sikakai', 'Bhringraj', 'Coconut Base Oil'],
    imageUrl: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 230,
    isFeatured: true,
    inStock: true,
    unit: '150ml Spray Bottle'
  },
  {
    id: 'prod-1',
    name: 'Pure Kalonji Oil (Black Seed Extractions)',
    urduName: 'روغن کلونجی خالص',
    price: 850,
    originalPrice: 1000,
    category: 'Tib-e-Nabvi Special',
    description: '100% Cold-pressed pure Nigella Sativa oil for immunity, respiratory health, and overall vitality.',
    fullDescription: 'Extracted from premium Nigella Sativa seeds using cold-press technology to preserve high Thymoquinone content. Kalonji is revered in Tib-e-Nabvi as a universal healer. Supports immune defense, controls allergies, aids digestion, and promotes hair health.',
    dosage: '1/2 teaspoon daily with warm water or honey, before breakfast.',
    ingredients: ['100% Pure Cold-Pressed Nigella Sativa (Kalonji) Seed Oil'],
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 128,
    isFeatured: true,
    inStock: true,
    unit: '100ml Bottle'
  },
  {
    id: 'prod-2',
    name: 'Majoon-e-Shifa Immunity & Energy Compound',
    urduName: 'معجونِ شفاء برائے قوتِ مدافعت',
    price: 1250,
    originalPrice: 1500,
    category: 'Immunity & Daily Wellness',
    description: 'Traditional Unani formulation enriched with Sidr Honey, Saffron, Salajit, and Almonds.',
    fullDescription: 'A classic Tib formulation combining Sidr Sidr Honey, pure Kashmiri Saffron, Shilajit, Cardamom, and organic herbs. Restores vitality, reduces physical and mental fatigue, and strengthens heart and digestive power.',
    dosage: '1 teaspoon twice daily after meals with lukewarm milk or water.',
    ingredients: ['Raw Sidr Honey', 'Kashmiri Saffron (Zafran)', 'Shilajit (Salajit)', 'Almonds', 'Cardamom', 'Amber'],
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 94,
    isFeatured: true,
    inStock: true,
    unit: '250g Jar'
  },
  {
    id: 'prod-3',
    name: 'Khamira Abresham Hakim Arshad Wala',
    urduName: 'خمیرہ ابریشم حکیم ارشد والا',
    price: 1650,
    originalPrice: 1900,
    category: 'Heart & Digestion',
    description: 'Famous cardiac & brain tonic in Unani medicine for nervousness, stress, and heart strength.',
    fullDescription: 'One of the most celebrated formulations in Unani Tib. Enhances cardiac tissue resilience, balances blood pressure, alleviates palpitations, and relieves mental anxiety and brain exhaustion.',
    dosage: '3 grams (approx. half level teaspoon) morning and evening.',
    ingredients: ['Abresham (Silk Cocoon)', 'Unrefined Pearl Compound', 'Silver Leaves (Varg-e-Nuqra)', 'Rose Water Extract', 'Borage Oil'],
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 81,
    isFeatured: true,
    inStock: true,
    unit: '150g Jar'
  },
  {
    id: 'prod-4',
    name: 'Roghan-e-Balsan (Balm of Gilead Oil)',
    urduName: 'روغنِ بلسان اصل',
    price: 1950,
    originalPrice: 2200,
    category: 'Joint Care & Oils',
    description: 'Rare prophetic herbal oil renowned for deep joint relief, arthritis pain, and nerve repair.',
    fullDescription: 'Authentic extract from Commiphora gileadensis. Known since antiquity for its remarkable warming, anti-inflammatory, and nerve-penetrating properties. Ideal for backache, joint stiffness, and sciatica.',
    dosage: 'Gently massage 5-8 drops on affected area twice daily.',
    ingredients: ['Pure Balsan Resin Extract', 'Sesame Base Oil', 'Myrrh Infusion'],
    imageUrl: 'https://images.unsplash.com/photo-1608571424266-edeb9bbefdec?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewsCount: 62,
    isFeatured: true,
    inStock: true,
    unit: '50ml Bottle'
  },
  {
    id: 'prod-5',
    name: 'Organic Talbina & Sidr Date Blend',
    urduName: 'تلبینہ خاص مع سدر کھجور',
    price: 750,
    originalPrice: 900,
    category: 'Tib-e-Nabvi Special',
    description: 'Wholesome sprouted barley porridge infused with Ajwa dates and organic crushed nuts.',
    fullDescription: 'Talbina is highly recommended in Sunnah for soothing grief, anxiety, and digestive discomfort. Rich in soluble fiber, magnesium, and natural prebiotic compounds.',
    dosage: 'Mix 2 tablespoons in warm milk/water, cook on light heat for 5-7 minutes.',
    ingredients: ['Sprouted Organic Barley Flour', 'Ajwa Date Powder', 'Crushed Pistachio', 'Honey Powder'],
    imageUrl: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 150,
    isFeatured: false,
    inStock: true,
    unit: '500g Pack'
  },
  {
    id: 'prod-6',
    name: 'Joshanda Unani Herbal Tea Infusion',
    urduName: 'جوشاندہ یونانی دوا',
    price: 450,
    originalPrice: 550,
    category: 'Herbal Teas & Extracts',
    description: 'Instant herbal decoction for flu, cough, sore throat, and seasonal fever relief.',
    fullDescription: 'Traditional formulation containing Licorice, Ephedra, Borage, Violet flowers, and Fennel. Clears congestion, soothing chest airways and boosting recovery from cold.',
    dosage: 'Dissolve 1 sachet in a cup of hot boiling water. Drink hot twice daily.',
    ingredients: ['Glycyrrhiza Glabra (Licorice)', 'Viola Odorata', 'Adhatoda Vasica', 'Foeniculum Vulgare'],
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 210,
    isFeatured: false,
    inStock: true,
    unit: 'Box of 12 Sachets'
  },
  {
    id: 'prod-7',
    name: 'Ispaghol Husk (Psyllium) Organic Cleanse',
    urduName: 'اسپغول مسلم مصفٰی',
    price: 520,
    originalPrice: 600,
    category: 'Heart & Digestion',
    description: 'Triple-sifted pure Ispaghol husk for acidity, cholesterol control, and regular gut health.',
    fullDescription: 'Pure Plantago Ovata seeds husk, free from sand and chemicals. Normalizes bowel activity, relieves hyperacidity, absorbs excess gastric cholesterol, and assists natural weight management.',
    dosage: '1 tablespoon in warm water or milk at bedtime.',
    ingredients: ['100% Organic Plantago Ovata (Psyllium Husk)'],
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 115,
    isFeatured: false,
    inStock: true,
    unit: '200g Jar'
  },
  {
    id: 'prod-8',
    name: 'Sharbat-e-Bazoori Motadil Digestive Tonic',
    urduName: 'شربتِ بزوری معتدل',
    price: 480,
    originalPrice: 580,
    category: 'Heart & Digestion',
    description: 'Cooling liver & kidney syrup that flushes toxins, reduces internal heat, and purifies blood.',
    fullDescription: 'Composed of Fennel roots, Chicory seeds, and Cucumber seeds. Reduces liver heat, acts as a natural diuretic, relieves urinary burning, and promotes kidney stone clearance.',
    dosage: '25ml syrup mixed with a glass of cool water in the morning.',
    ingredients: ['Cichorium Intybus (Kasni)', 'Foeniculum Vulgare Roots (Badiyan)', 'Cucumis Sativus Seeds'],
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 76,
    isFeatured: false,
    inStock: true,
    unit: '800ml Bottle'
  }
];

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
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1594824813566-78a933722055?auto=format&fit=crop&w=600&q=80'
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
    imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80'
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
