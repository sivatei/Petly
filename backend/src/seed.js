import 'dotenv/config';
import { admin } from './supabase.js';

async function seed() {
  console.log('🐾 Starting Petly database seeding with realistic data...');

  // 1. Create or retrieve demo seller user
  const sellerEmail = 'demo.seller@petly.com';
  let sellerId = null;

  const { data: existingUsers } = await admin.auth.admin.listUsers();
  const foundUser = existingUsers?.users?.find(u => u.email === sellerEmail);

  if (foundUser) {
    sellerId = foundUser.id;
    console.log(`✅ Found existing demo seller account: ${sellerEmail} (${sellerId})`);
  } else {
    const { data: newUser, error: createError } = await admin.auth.admin.createUser({
      email: sellerEmail,
      password: 'Password123!',
      email_confirm: true,
      user_metadata: { full_name: 'Paws & Whiskers Official' }
    });

    if (createError) {
      console.error('❌ Error creating demo seller:', createError.message);
      process.exit(1);
    }
    sellerId = newUser.user.id;
    console.log(`✅ Created demo seller account: ${sellerEmail} (${sellerId})`);
  }

  // Ensure profile has seller & admin role
  await admin.from('user_roles').upsert([
    { user_id: sellerId, role: 'seller' },
    { user_id: sellerId, role: 'admin' }
  ], { onConflict: 'user_id,role' });

  // 2. Fetch categories map
  const { data: categories } = await admin.from('categories').select('id, name');
  const catMap = {};
  categories?.forEach(c => { catMap[c.name] = c.id; });

  // 3. Realistic Pet Products
  const productsData = [
    {
      title: 'Royal Canin Maxi Adult Dry Dog Food (15kg)',
      category_id: catMap['Pet Food & Treats'] || 1,
      pet_type: 'dog',
      brand: 'Royal Canin',
      price: 64.99,
      condition: 'new',
      location: 'New York, NY',
      description: 'Formulated specifically for large breed adult dogs (26–44 kg). Supports optimal joint health, high digestibility, and maintains coat shine with Omega-3 (EPA-DHA).',
      image: '/images/products/dog_kibble.jpg'
    },
    {
      title: 'KONG Extreme Dog Chew Toy (Large)',
      category_id: catMap['Toys'] || 2,
      pet_type: 'dog',
      brand: 'KONG',
      price: 18.99,
      condition: 'new',
      location: 'Brooklyn, NY',
      description: 'Ultra-durable black natural rubber formula designed for tough chewers. Can be stuffed with peanut butter or treats to satisfy instinctual chewing needs and prevent boredom.',
      image: '/images/products/kong_toy.jpg'
    },
    {
      title: 'Orthopedic Memory Foam Pet Bed with Waterproof Liner',
      category_id: catMap['Beds & Furniture'] || 4,
      pet_type: 'dog',
      brand: 'PetFusion',
      price: 79.50,
      condition: 'new',
      location: 'Austin, TX',
      description: 'Premium 4-inch solid memory foam base with soft supportive bolsters. Relieves arthritis and joint pain for senior and growing pets. Removable, machine-washable cover.',
      image: '/images/products/pet_bed.jpg'
    },
    {
      title: 'Wild One Waterproof Adjustable Dog Leash & Collar Set',
      category_id: catMap['Collars, Leashes & Accessories'] || 6,
      pet_type: 'dog',
      brand: 'Wild One',
      price: 48.00,
      condition: 'new',
      location: 'Manhattan, NY',
      description: 'Dirt- and odor-resistant flex-poly coated nylon strap. Completely waterproof, wipe-clean in seconds, with solid brass snap hooks in sleek moss green.',
      image: '/images/products/leash_collar.jpg'
    },
    {
      title: 'Purina Pro Plan LiveClear Allergen Reducing Cat Food (3.2kg)',
      category_id: catMap['Pet Food & Treats'] || 1,
      pet_type: 'cat',
      brand: 'Purina',
      price: 36.50,
      condition: 'new',
      location: 'Seattle, WA',
      description: 'Revolutionary adult dry cat food formulated with key egg-based proteins that neutralize Fel d 1 in cat saliva, safely reducing cat allergens in homes.',
      image: '/images/products/cat_food.jpg'
    },
    {
      title: 'Catit Flower Pet Drinking Fountain with Triple Action Filter (3L)',
      category_id: catMap['Pet Food & Treats'] || 1,
      pet_type: 'cat',
      brand: 'Catit',
      price: 28.90,
      condition: 'new',
      location: 'San Francisco, CA',
      description: 'Encourages cats to drink more fresh, oxygenated water. Features 3 water flow settings (gentle stream, bubbling top, calm flow) and BPA-free durable materials.',
      image: '/images/products/water_fountain.jpg'
    },
    {
      title: 'Multi-Level Sisal Scratching Post Cat Tree Tower (54-inch)',
      category_id: catMap['Beds & Furniture'] || 4,
      pet_type: 'cat',
      brand: 'Feandrea',
      price: 68.00,
      condition: 'used',
      location: 'Brooklyn, NY',
      description: 'Used for 3 months in smoke-free home. Excellent condition with cozy top perch, private condo hammock, and thick natural sisal scratching posts.',
      image: '/images/products/cat_tree.jpg'
    },
    {
      title: 'FURminator Undercoat Deshedding Tool for Medium/Large Dogs',
      category_id: catMap['Grooming & Hygiene'] || 5,
      pet_type: 'dog',
      brand: 'FURminator',
      price: 24.99,
      condition: 'new',
      location: 'Chicago, IL',
      description: 'Stainless steel deShedding edge reaches through topcoat to safely and easily remove loose undercoat hair without cutting skin or damaging delicate topcoats.',
      image: '/images/products/furminator_brush.jpg'
    },
    {
      title: 'Sleepypod Atom Crash-Tested Airline Pet Carrier',
      category_id: catMap['Travel & Carriers'] || 7,
      pet_type: 'cat',
      brand: 'Sleepypod',
      price: 119.00,
      condition: 'new',
      location: 'Los Angeles, CA',
      description: 'Independently crash-tested airline compliant pet carrier for small dogs and cats up to 12 lbs. Luggage-grade ballistic nylon with plush machine-washable bedding.',
      image: '/images/products/pet_carrier.jpg'
    },
    {
      title: 'Prevue Hendryx Wrought Iron Flight Cage with Stand',
      category_id: catMap['Cages, Tanks & Habitats'] || 3,
      pet_type: 'bird',
      brand: 'Prevue',
      price: 135.00,
      condition: 'new',
      location: 'Denver, CO',
      description: 'Large flight cage with 0.5-inch wire spacing, ideal for parakeets, canaries, finches, and cockatiels. Includes 3 wood perches, 4 plastic food cups, and rolling stand.',
      image: '/images/products/bird_cage.jpg'
    },
    {
      title: 'Fluval Flex 15 Gallon Freshwater Aquakit with LED Lighting',
      category_id: catMap['Cages, Tanks & Habitats'] || 3,
      pet_type: 'fish',
      brand: 'Fluval',
      price: 149.99,
      condition: 'new',
      location: 'Miami, FL',
      description: 'Controversial curved glass front with powerful 3-stage filtration and infrared remote control 7500K LED lamp with special cloud cover and lightning effects.',
      image: '/images/products/aquarium.jpg'
    },
    {
      title: 'Oxbow Animal Health Western Timothy Hay (90 oz)',
      category_id: catMap['Pet Food & Treats'] || 1,
      pet_type: 'small_pets',
      brand: 'Oxbow',
      price: 21.50,
      condition: 'new',
      location: 'Portland, OR',
      description: '100% all-natural high-fiber hay harvested fresh from the Columbia River basin. Essential for digestive and dental health of rabbits, guinea pigs, and chinchillas.',
      image: '/images/products/timothy_hay.jpg'
    }
  ];

  // Insert Products & Images
  console.log(`🛍️ Seeding ${productsData.length} realistic pet products...`);
  for (const item of productsData) {
    const { image, ...productRecord } = item;
    const { data: createdProduct, error: prodErr } = await admin
      .from('products')
      .insert({
        ...productRecord,
        seller_id: sellerId,
        currency: 'USD',
        status: 'active'
      })
      .select('id')
      .single();

    if (prodErr) {
      console.warn(`⚠️ Warning inserting ${item.title}:`, prodErr.message);
      continue;
    }

    if (image && createdProduct?.id) {
      await admin.from('product_images').insert({
        product_id: createdProduct.id,
        image_url: image,
        sort_order: 0
      });
    }
  }
  console.log('✅ Products & images seeded successfully!');

  // 4. Realistic Veterinary Clinics
  const clinicsData = [
    {
      name: 'Metropolitan Veterinary Hospital & 24/7 ER',
      description: 'Full-service emergency, surgical, and critical care veterinary hospital equipped with modern digital imaging, CT scanner, and intensive care units.',
      address: '410 W 55th St, New York, NY 10019',
      latitude: 40.7674,
      longitude: -73.9877,
      phone: '+1 (212) 581-8950',
      services: ['Emergency Care', 'Surgery', 'Critical Care', 'Digital X-Ray', 'Ultrasound'],
      opening_hours: { mon_sun: 'Open 24 Hours / 7 Days' },
      verification_status: 'verified'
    },
    {
      name: 'Oakridge Animal Wellness & Dental Clinic',
      description: 'Specializing in preventative wellness examinations, laser dental scaling, feline geriatric care, and low-stress handling techniques.',
      address: '158 5th Ave, Brooklyn, NY 11217',
      latitude: 40.6789,
      longitude: -73.9798,
      phone: '+1 (718) 638-4100',
      services: ['Dental Care', 'Wellness Exams', 'Vaccinations', 'Laser Therapy', 'Microchipping'],
      opening_hours: { mon_fri: '8:00 AM - 7:00 PM', sat: '9:00 AM - 4:00 PM', sun: 'Closed' },
      verification_status: 'verified'
    },
    {
      name: 'Hudson River Pet Clinic & Surgery',
      description: 'Compassionate companion veterinary care offering routine vaccinations, soft tissue surgery, oncology consultations, and pet nutrition advice.',
      address: '725 10th Ave, New York, NY 10019',
      latitude: 40.7651,
      longitude: -73.9922,
      phone: '+1 (212) 246-8800',
      services: ['Soft Tissue Surgery', 'Diagnostics & Lab', 'Vaccinations', 'Nutrition Counseling'],
      opening_hours: { mon_fri: '8:30 AM - 6:30 PM', sat: '9:00 AM - 3:00 PM', sun: 'Closed' },
      verification_status: 'verified'
    },
    {
      name: 'Downtown Companion Animal Hospital',
      description: 'State-of-the-art veterinary clinic offering in-house lab testing, orthopedic surgery, internal medicine, and comprehensive puppy/kitten wellness programs.',
      address: '225 Broadway, New York, NY 10007',
      latitude: 40.7126,
      longitude: -74.0084,
      phone: '+1 (212) 349-2200',
      services: ['Orthopedic Surgery', 'Internal Medicine', 'In-house Lab', 'Microchipping'],
      opening_hours: { mon_fri: '8:00 AM - 8:00 PM', sat_sun: '9:00 AM - 5:00 PM' },
      verification_status: 'verified'
    },
    {
      name: 'Sunset Valley Exotic Pet & Avian Center',
      description: 'One of the few certified avian and exotic mammal veterinary clinics in the area, offering specialized care for birds, reptiles, ferrets, and rabbits.',
      address: '88-14 Northern Blvd, Jackson Heights, NY 11372',
      latitude: 40.7558,
      longitude: -73.8821,
      phone: '+1 (718) 424-2500',
      services: ['Avian Medicine', 'Exotic Pet Care', 'Dental Floating', 'Reptile Care', 'Surgery'],
      opening_hours: { mon_fri: '9:00 AM - 6:00 PM', sat: '9:00 AM - 2:00 PM', sun: 'Closed' },
      verification_status: 'verified'
    }
  ];

  console.log(`🏥 Seeding ${clinicsData.length} realistic veterinary clinics...`);
  for (const clinic of clinicsData) {
    const { error: clinicErr } = await admin.from('clinics').insert(clinic);
    if (clinicErr) {
      console.warn(`⚠️ Warning inserting clinic ${clinic.name}:`, clinicErr.message);
    }
  }
  console.log('✅ Veterinary clinics seeded successfully!');

  console.log('\n🎉 Real-looking mock data has been populated in your Supabase database!');
  console.log(`👉 Demo seller login: ${sellerEmail} / Password: Password123!`);
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
