// Government Jobs data — latest sarkari naukri postings for Uttarakhand
//
// Each job entry has:
//   id          — unique slug
//   title       — job title (Hindi + English mix)
//   titleLocal  — pure Garhwali/Hindi title (optional)
//   department  — recruiting organization
//   location    — posting location
//   vacancies   — number of posts
//   lastDate    — application deadline (ISO YYYY-MM-DD)
//   postedDate  — when job was posted
//   salary      — salary range (optional)
//   eligibility — brief eligibility criteria
//   category    — 'state' | 'central' | 'psu' | 'defence' | 'police' | 'teaching'
//   link        — official notification URL
//   emoji       — decorative emoji
//   featured    — boolean, show on homepage

const GOVT_JOBS = [
  {
    id: 'ukpsc-ro-aro-2026',
    title: 'UKPSC RO/ARO Recruitment 2026',
    titleLocal: 'उत्तराखंड लोक सेवा आयोग RO/ARO भर्ती',
    department: 'Uttarakhand Public Service Commission',
    location: 'Uttarakhand',
    vacancies: 89,
    lastDate: '2026-05-15',
    postedDate: '2026-04-10',
    salary: '₹44,900 - ₹1,42,400',
    eligibility: 'Graduate from recognized university, Age 21-42 years',
    category: 'state',
    link: 'https://ukpsc.gov.in',
    emoji: '📋',
    featured: true,
  },
  {
    id: 'uksssc-vdo-2026',
    title: 'UKSSSC VDO (Gram Vikas Adhikari) Recruitment',
    titleLocal: 'ग्राम विकास अधिकारी भर्ती',
    department: 'Uttarakhand Subordinate Service Selection Commission',
    location: 'All Districts, Uttarakhand',
    vacancies: 258,
    lastDate: '2026-05-20',
    postedDate: '2026-04-12',
    salary: '₹29,200 - ₹92,300',
    eligibility: '10+2 Pass, Age 18-42 years',
    category: 'state',
    link: 'https://sssc.uk.gov.in',
    emoji: '🏘️',
    featured: true,
  },
  {
    id: 'ukpsc-forest-ranger-2026',
    title: 'UKPSC Forest Ranger Recruitment',
    titleLocal: 'वन रेंजर भर्ती',
    department: 'Forest Department, Uttarakhand',
    location: 'Uttarakhand',
    vacancies: 45,
    lastDate: '2026-05-10',
    postedDate: '2026-04-05',
    salary: '₹35,400 - ₹1,12,400',
    eligibility: 'B.Sc. in Forestry/Agriculture, Age 21-35 years',
    category: 'state',
    link: 'https://ukpsc.gov.in',
    emoji: '🌲',
    featured: true,
  },
  {
    id: 'uttarakhand-police-constable-2026',
    title: 'Uttarakhand Police Constable Recruitment',
    titleLocal: 'उत्तराखंड पुलिस कांस्टेबल भर्ती',
    department: 'Uttarakhand Police',
    location: 'All Districts',
    vacancies: 1500,
    lastDate: '2026-06-01',
    postedDate: '2026-04-20',
    salary: '₹21,700 - ₹69,100',
    eligibility: '12th Pass, Age 18-28 years, Physical Standards apply',
    category: 'police',
    link: 'https://ukpolice.gov.in',
    emoji: '👮',
    featured: true,
  },
  {
    id: 'hnbgu-assistant-professor-2026',
    title: 'HNBGU Assistant Professor Recruitment',
    titleLocal: 'HNB गढ़वाल विश्वविद्यालय सहायक प्रोफेसर भर्ती',
    department: 'Hemwati Nandan Bahuguna Garhwal University',
    location: 'Srinagar, Pauri Garhwal',
    vacancies: 72,
    lastDate: '2026-05-25',
    postedDate: '2026-04-18',
    salary: '₹57,700 - ₹1,82,400 (Academic Level 10)',
    eligibility: 'NET/SLET qualified, PhD preferred',
    category: 'teaching',
    link: 'https://hnbgu.ac.in',
    emoji: '📚',
    featured: false,
  },
  {
    id: 'itbp-constable-2026',
    title: 'ITBP Constable (GD) Recruitment',
    titleLocal: 'ITBP कांस्टेबल भर्ती',
    department: 'Indo-Tibetan Border Police',
    location: 'All India (Uttarakhand vacancies available)',
    vacancies: 248,
    lastDate: '2026-05-30',
    postedDate: '2026-04-15',
    salary: '₹21,700 - ₹69,100',
    eligibility: '10th Pass, Age 18-23, Physical Standards apply',
    category: 'defence',
    link: 'https://recruitment.itbpolice.nic.in',
    emoji: '🏔️',
    featured: false,
  },
];

export default GOVT_JOBS;
