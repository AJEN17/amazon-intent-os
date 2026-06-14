import fs from 'fs';

const categories = [
    'POWER_CUT_CRISIS', 'PARTY_CRISIS', 'PET_CRISIS', 
    'BABY_CRISIS', 'RAIN_CRISIS', 'COOKING_CRISIS', 'MEDICINE_CRISIS'
];

const brands = {
    'POWER_CUT_CRISIS': ['Duracell', 'Philips', 'Mi', 'Ambrane', 'Syska', 'Eveready'],
    'PARTY_CRISIS': ['Coca-Cola', 'Pepsi', 'Lays', 'Haldirams', 'Red Bull', 'Bingo'],
    'PET_CRISIS': ['Pedigree', 'Whiskas', 'Drools', 'Purepet', 'Himalaya', 'MeatUp'],
    'BABY_CRISIS': ['Pampers', 'MamyPoko', 'Huggies', 'Sebamed', 'Johnson', 'Himalaya Baby'],
    'RAIN_CRISIS': ['Zeel', 'Duckback', 'Sun', 'Destinio', 'Clownfish', 'FabSeasons'],
    'COOKING_CRISIS': ['Tata', 'Aashirvaad', 'Fortune', 'Saffola', 'Mother Dairy', 'Amul'],
    'MEDICINE_CRISIS': ['GSK', 'Abbott', 'Micro Labs', 'Cipla', 'Sun Pharma', 'Dr.Reddys']
};

const items_data = {
    'POWER_CUT_CRISIS': ['Power Bank 10000mAh', 'LED Torch Light', 'AA Batteries 4pk', 'Scented Candles', 'USB C Cable 1m', 'Extension Board', 'Inverter Bulb', 'AAA Batteries 4pk', 'Emergency Light'],
    'PARTY_CRISIS': ['Cola 2L', 'Energy Drink 250ml', 'Potato Chips Cream Onion', 'Ice Cubes 1kg', 'Paper Cups 50pcs', 'Nachos Cheese', 'Diet Coke Cans', 'Tonic Water', 'Soda Water 1L'],
    'PET_CRISIS': ['Adult Dog Food 3kg', 'Cat Litter 5kg', 'Dog Biscuits 1kg', 'Tick & Flea Shampoo', 'Chew Bone Toy', 'Cat Wet Food Pouch', 'Puppy Dry Food', 'Pet Wipes', 'Dog Collar'],
    'BABY_CRISIS': ['Baby Diaper Pants L', 'Water Baby Wipes 72pc', 'Diaper Rash Cream', 'Infant Formula Powder', 'Tear Free Baby Soap', 'Baby Massage Oil', 'Nasal Drops', 'Cotton Balls', 'Baby Powder'],
    'RAIN_CRISIS': ['Auto Open Umbrella', 'Mens Raincoat XL', 'Womens Raincoat L', 'Waterproof Bag Cover', 'Rubber Rain Boots', 'Kids Rain Poncho', 'Waterproof Phone Pouch', 'Shoe Covers', 'Windcheater Jacket'],
    'COOKING_CRISIS': ['Iodized Salt 1kg', 'Refined Sunflower Oil 1L', 'Toned Milk 500ml', 'Safety Matchboxes 10pk', 'Refined Sugar 1kg', 'Wheat Atta 5kg', 'Basmati Rice 1kg', 'Toor Dal 500g', 'Ghee 500ml'],
    'MEDICINE_CRISIS': ['Paracetamol 500mg', 'Antacid Gel 200ml', 'Cough Syrup 100ml', 'Waterproof Bandaids 20s', 'Vaporub 50g', 'ORS Powder 5pk', 'Pain Relief Spray', 'Digital Thermometer', 'Antiseptic Liquid']
};

const tags_pool = {
    'POWER_CUT_CRISIS': ['no power at home', 'phone is dead need charge', 'pitch dark need light', 'emergency lights for power cut', 'battery run out', 'long cord extension', 'bright torch for dark'],
    'PARTY_CRISIS': ['unexpected guests drinks', 'need chilled soda fast', 'party snacks crunchy', 'ice for drinks', 'mixers for party', 'late night cravings', 'bulk cups for party'],
    'PET_CRISIS': ['hungry dog food', 'cat litter box smelly', 'treat for good boy', 'dog has ticks', 'dog destroying shoes chew toy', 'kitten wet food', 'easy clean pet wipes'],
    'BABY_CRISIS': ['baby is crying loud', 'diaper leak need new', 'red rash on baby', 'ran out of baby milk', 'gentle baby wash', 'blocked baby nose', 'cotton for baby care'],
    'RAIN_CRISIS': ['caught in sudden rain', 'protect bag from water', 'heavy downpour cover', 'boots for puddles', 'phone safe in rain', 'kids rain gear', 'windy and raining jacket'],
    'COOKING_CRISIS': ['mid cooking need salt', 'ran out of milk for tea', 'oil finished while frying', 'need sugar for dessert', 'matchbox for gas stove', 'dal rice basic groceries', 'pure desi ghee'],
    'MEDICINE_CRISIS': ['high fever body ache', 'stomach burning acidity', 'dry cough throat pain', 'cut finger bleeding', 'blocked nose cold', 'dehydration weakness', 'sprained ankle pain']
};

const reviews = {
    'POWER_CUT_CRISIS': [["Lasts very long during blackouts.", "Charges phone incredibly fast.", "Very bright light beam."], ["Gets a bit warm during use.", "Cable length could be longer."]],
    'PARTY_CRISIS': [["Perfect amount of fizz.", "Very crunchy and fresh.", "Ice was solid and not melted."], ["Taste is a bit too sweet.", "Bags are mostly filled with air."]],
    'PET_CRISIS': [["My dog absolutely loves this flavor.", "Clumps well and hides odor perfectly.", "Helped get rid of all ticks."], ["Kibble size is too big for small dogs.", "Creates a lot of dust when pouring."]],
    'BABY_CRISIS': [["Super soft on my baby's skin.", "No leaks even overnight.", "Cleared up the rash in one day."], ["Scent is a bit too strong.", "Wipes are slightly hard to pull out."]],
    'RAIN_CRISIS': [["Kept me completely dry in a heavy storm.", "Sturdy umbrella against strong winds."], ["Sizes run slightly small.", "Takes a while to dry completely."]],
    'COOKING_CRISIS': [["Very pure and hygienic.", "Dissolves perfectly in tea.", "Great quality for daily cooking."], ["Packaging is not resealable.", "Sometimes clumps together."]],
    'MEDICINE_CRISIS': [["Worked fast to reduce fever.", "Instant relief from throat pain.", "Sticks well even when wet."], ["Syrup tastes a bit bitter.", "Gel texture is chalky."]]
};

const getAsin = () => 'B0' + Math.random().toString(36).substring(2, 10).toUpperCase().padEnd(8, 'X');

const sample = (arr: any[], count: number) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const choice = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

const products = [];

for (const crisis of categories) {
    for (let i = 0; i < 43; i++) {
        const brand = choice(brands[crisis as keyof typeof brands]);
        const item_type = choice(items_data[crisis as keyof typeof items_data]);
        const product_name = `${brand} ${item_type}`;
        
        let is_veg: boolean | undefined = undefined;
        if (['PARTY_CRISIS', 'COOKING_CRISIS'].includes(crisis)) {
            is_veg = true;
        } else if (crisis === 'PET_CRISIS' && (item_type.includes('Food') || item_type.includes('Biscuits'))) {
            is_veg = false;
        }
            
        const tags = sample(tags_pool[crisis as keyof typeof tags_pool], 5);
        
        const pro_review = choice(reviews[crisis as keyof typeof reviews][0]);
        const con_review = choice(reviews[crisis as keyof typeof reviews][1]);
        
        const eta = choice([10, 14, 21]);
        
        const product: any = {
            asin: getAsin(),
            brand,
            product_name,
            category: item_type.split(' ')[0].toLowerCase(),
            macro_crisis: crisis,
            stock_count: Math.floor(Math.random() * 501),
            base_price: Math.floor(Math.random() * 1981) + 20,
            surge_multiplier: Math.random() > 0.8 ? Math.round((Math.random() * 1.5 + 1.0) * 10) / 10 : 1.0,
            eta_mins: eta,
            weight_grams: Math.floor(Math.random() * 4951) + 50,
            purchase_frequency_rank: Math.floor(Math.random() * 1000) + 1,
            ai_search_tags: tags,
            llm_review_pros: pro_review,
            llm_review_cons: con_review,
            image_url: `https://source.unsplash.com/random/400x400/?${item_type.split(' ')[0]}`
        };
        
        if (is_veg !== undefined) {
            product.is_veg = is_veg;
        }
            
        products.push(product);
    }
}

// Slice to exactly 300 to match Python
const finalProducts = products.slice(0, 300);

fs.writeFileSync('master_inventory.json', JSON.stringify(finalProducts, null, 2));
console.log('Successfully generated 300 highly diverse items!');
