const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Archived'],
    default: 'Draft',
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Staffs',
  },
  // authorUsername: { 
  //   type: String, 
  //   required: true 
  // },
  videoUrl: String,
  image: {
    type: String
  },
  categories: [{
    type: String,
    enum: ["Chemistry", "Microbiology", "Haematology", "Serology", "Scan Investigation"],
    required: false,
  }],
  subCategories: [{ 
    type: String,
    enum: [
      // 🧪 Chemistry Tests
      'Liver Function Test',
      'Renal Function Test',
      'Lipid Profile',
      'Blood Glucose Test',
      'Electrolyte Panel',
      'Calcium Test',
      'Uric Acid Test',

      // 🦠 Microbiology Tests
      'Urine Culture',
      'Blood Culture',
      'Sputum Culture',
      'Wound Culture',
      'Stool Culture',
      'Throat Swab Test',

      // 🩸 Haematology Tests
      'Complete Blood Count (CBC)',
      'Blood Grouping',
      'Coagulation Profile',
      'Erythrocyte Sedimentation Rate (ESR)',
      'Reticulocyte Count',

      // 🦠 Serology Tests
      'HIV Test',
      'Hepatitis B Test',
      'Hepatitis C Test',
      'Syphilis Test',
      'Rheumatoid Factor Test',
      'C-Reactive Protein (CRP) Test',

      // 🏥 Scan Investigations
      'X-Ray',
      'Ultrasound',
      'CT Scan',
      'MRI Scan',
      'Echocardiography',
      'Mammography'
    ],
    required: false,
}],
  types: [{
    type: String,
    enum: ["News", "Local", "World", "Blog", "Article", "Leaked", "Magazine", "Story",],
    required: false,
  }],
  tags: [{
    type: String
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  reactions: { // Reaction counts by type
    like: { type: Number, default: 0 },
    love: { type: Number, default: 0 },
    haha: { type: Number, default: 0 },
    wow: { type: Number, default: 0 },
    sad: { type: Number, default: 0 },
    angry: { type: Number, default: 0 },
  },
  views: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  meta: {
    description: String,         // Brief description of the content for SEO
    keywords: String,            // Keywords for SEO
    title: String,               // Title of the post for SEO

    // Open Graph (Facebook, LinkedIn)
    ogTitle: String,             // Open Graph title for social media
    ogDescription: String,       // Open Graph description for social media
    ogImage: String,             // Open Graph image URL for social media previews
    ogUrl: String,               // Open Graph URL to define the canonical link

    // Twitter Meta Tags
    twitterCard: String,         // Twitter Card type (e.g., "summary_large_image")
    twitterTitle: String,        // Title for Twitter cards
    twitterDescription: String,  // Description for Twitter cards
    twitterImage: String,        // Image for Twitter cards
    twitterUrl: String,          // Canonical URL for Twitter sharing

    // SEO Optimization
    canonicalUrl: String,        // Canonical URL for SEO
    robots: String,              // Robots directives (e.g., "index, follow")
    lastModified: Date,          // Last modified date for SEO and content freshness
  },

  isSponsored: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // timestamps: true,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
