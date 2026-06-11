export interface Scheme {
  id: number;
  title: string;
  description: string;
  benefits: string[];
  eligibilityMatch: number;
  category: 'health' | 'nutrition' | 'welfare';
}

interface StateSchemeData {
  [key: string]: Scheme[];
}

export const stateSchemes: StateSchemeData = {
  madhya_pradesh: [
    {
      id: 1,
      title: 'M.P. Maternity Support Scheme (Naya Savera)',
      description: 'Cash support to registered unorganized women labourers during pregnancy and delivery.',
      benefits: ['₹4,000 in last trimester', '₹12,000 after delivery'],
      eligibilityMatch: 90,
      category: 'health'
    },
    {
      id: 2,
      title: 'Mukhya Mantri Shramik Seva Prasuti Sahayata Yojana',
      description: 'Maternity assistance for pregnant women registered as unorganized workers in MP.',
      benefits: ['₹4,000 during pregnancy (4 check-ups)', '₹12,000 post-delivery support'],
      eligibilityMatch: 90,
      category: 'health'
    },
    {
      id: 3,
      title: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
      description: 'Central scheme providing cash incentives to pregnant and lactating women for first living child.',
      benefits: ['₹1,000 on pregnancy registration', '₹2,000 after 6 months pregnancy', '₹2,000 after childbirth'],
      eligibilityMatch: 95,
      category: 'health'
    },
    {
      id: 4,
      title: 'Janani Suraksha Yojana (under NHM)',
      description: 'Under the National Health Mission—cash benefit for institutional delivery in MP.',
      benefits: ['Cash incentive for institutional childbirth'],
      eligibilityMatch: 90,
      category: 'health'
    }
  ],


  rajasthan: [
   
  {
    id: 20,
    title: 'Mukhyamantri Suposhan Nutri‑Kit Yojana',
    description: 'Nutri‑kits with desi ghee, dates, makhana, jaggery, peanuts & roasted chana provided twice during last trimester.',
    benefits: ['1 kg desi ghee', '500 g dates & makhana', 'jaggery, peanuts, roasted chana'],
    eligibilityMatch: 92,
    category: 'nutrition'
  },
  {
    id: 21,
    title: 'Indira Gandhi Matritva Poshan Yojana (IGMPY)',
    description: 'Financial assistance of ₹6,000 over five installments to pregnant women expecting their second child.',
    benefits: ['₹1,000 at 1st ANC', '₹1,000 at 2nd ANC', '₹1,000 at delivery', '₹2,000 after child vaccination', '₹1,000 on permanent family planning'],
    eligibilityMatch: 90,
    category: 'health'
  },
  {
    id: 22,
    title: 'Janani Shishu Suraksha Karyakram (JSSK)',
    description: 'Guarantees free institutional delivery & postnatal care, including transport, drugs, diagnostics and diet.',
    benefits: ['Free transport, drugs, diet, diagnostics', 'Zero‑cost institutional delivery'],
    eligibilityMatch: 88,
    category: 'health'
  },
  {
    id: 23,
    title: 'Janani Suraksha Yojana (JSY)',
    description: 'Cash incentives for institutional deliveries provided under NHM to reduce maternal & infant mortality.',
    benefits: ['₹1,400 (rural) / ₹1,000 (urban) post-delivery incentive'],
    eligibilityMatch: 88,
    category: 'health'
  }
  ],
  gujarat: [
   
  {
    id: 7,
    title: 'Vandan Matru Yojana',
    description: 'Maternity benefit scheme by Women & Child Development, Gujarat to support pregnant and lactating mothers.',
    benefits: ['Nutritional kit via Anganwadi', 'Free prenatal & postnatal support'],
    eligibilityMatch: 90,
    category: 'health'
  },
  {
    id: 8,
    title: 'Maternity Assistance Scheme (Construction Workers)',
    description: 'Financial assistance to registered female construction workers during pregnancy and post-delivery under GBOCWWB.',
    benefits: ['₹37,500 for female workers', '₹20,000 when husband is registered worker'],
    eligibilityMatch: 90,
    category: 'health'
  },
  {
    id: 9,
    title: 'Mukhyamantri Matrushakti Yojana',
    description: 'Nutrition support scheme providing essential food items to pregnant and lactating women during first 1000 days.',
    benefits: ['2 kg gram', '1 kg tur dal', '1 L edible oil per month'],
    eligibilityMatch: 92,
    category: 'health'
  },
  {
    id: 10,
    title: 'Poshan Sudha Yojana',
    description: 'Pilot nutrition scheme in tribal blocks offering full meal and IFA/calcium tablets to pregnant & lactating women.',
    benefits: ['Hot cooked meal', 'IFA & calcium tablets', 'Nutrition counselling'],
    eligibilityMatch: 88,
    category: 'nutrition'
  }
],



  other: [
    {
      id: 11,
      title: 'karnataka Women Health Card',
      description: 'Personalized health tracking card for women.',
      benefits: ['Free health card', 'Priority health services', 'Discounts on medicines'],
      eligibilityMatch: 89,
      category: 'health'
    }
  ]
};
