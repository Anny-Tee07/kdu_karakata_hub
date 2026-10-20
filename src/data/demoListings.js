const demoListingText = {
    food: `
Chicken shawarma wrap|Grilled chicken, vegetables, and sauce in a toasted wrap.|₦2,500
Beef suya snack pack|A small demo suya portion with onions and pepper.|₦2,000
Puff-puff snack cup|Fresh-style puff-puff snack portion for a study break.|₦800
Moi moi and pap combo|Demo breakfast combo of moi moi and pap.|₦1,800
Egg sandwich|Toasted bread with egg and vegetables.|₦1,500
Plantain and egg sauce|Fried plantain served with a demo egg sauce portion.|₦2,200
Noodles and egg bowl|Prepared noodles with egg and vegetables.|₦1,700
Meat pie|Single demo meat pie snack listing.|₦900
Zobo drink bottle|Chilled zobo drink listing; size is for demo purposes.|₦700
Yoghurt parfait cup|Layered yoghurt, fruit, and cereal demo cup.|₦2,000
Chicken egg roll|Savory demo egg roll snack listing.|₦1,000
`,
    'fashion-beauty': `
KDU graphic print T-shirt|Cotton-look demo tee with a campus-inspired graphic.|₦6,500
Classic black joggers|Everyday relaxed-fit joggers for a demo listing.|₦8,000
Ankara bucket hat|Colourful Ankara-inspired demo accessory.|₦4,000
Unisex crew-neck sweatshirt|Soft-look crew-neck sweatshirt listing for cooler evenings.|₦12,000
Simple gele tying session|Demo appointment listing for event gele styling.|₦5,000
Natural hair wash and condition|Demo hair-care service listing; confirm details directly.|₦4,500
Beaded bracelet set|Small handmade-style accessory set, shown as sample data.|₦2,500
Alteration and hemming service|Demo clothing alteration listing for simple repairs.|₦3,500
Simple manicure appointment|Demo nail-care appointment; confirm the service details directly.|₦4,000
`,
    electronics: `
USB-C 20W wall adapter|Compact USB-C charging adapter demo listing.|₦5,500
Wired earphones with microphone|Wired earphones suitable for calls and lectures.|₦2,500
Wireless mouse|Compact wireless mouse demo listing for laptop users.|₦5,000
Rechargeable study lamp|Portable rechargeable light for evening reading.|₦7,500
Three-port USB charging hub|Small USB hub demo listing for desk setups.|₦4,500
Phone stand for desk|Adjustable stand for a phone during video calls.|₦2,000
Power bank 10000mAh|Portable power-bank demo listing; capacity is illustrative.|₦12,000
HDMI adapter|Display adapter demo listing for compatible devices.|₦6,000
Laptop cooling stand|Foldable laptop stand demo listing for study desks.|₦8,500
Bluetooth speaker mini|Small portable speaker demo listing.|₦9,000
`,
    academic: `
Introduction to Economics textbook|Used textbook demo listing for introductory economics study.|₦7,000
Engineering drawing set|Basic drawing tools demo listing for coursework.|₦5,500
Scientific calculator cover|Protective calculator pouch demo listing.|₦1,500
Past questions study bundle|Sample compilation listing; check course relevance before use.|₦2,000
USB flash drive 32GB|Portable storage listing; verify compatibility and contents.|₦6,500
Graph notebook pack|Pack of graph notebooks for lab and maths work.|₦2,500
Biology lab coat|Student lab coat demo listing; verify departmental requirements.|₦9,000
Course note spiral binding|Demo print-and-bind service listing for lecture notes.|₦1,800
Academic flash cards set|Printed flash cards demo listing for revision and memorisation.|₦2,200
`,
    'hostel-essentials': `
Plastic storage drawer|Compact storage drawer demo listing for a hostel room.|₦14,000
Electric kettle|Basic kettle demo listing; check power rating and condition.|₦11,000
Mosquito net for bed|Bed mosquito net demo listing for hostel use.|₦6,500
Rechargeable emergency bulb|Portable emergency bulb demo listing.|₦3,500
Laundry basket|Lightweight laundry basket listing for shared rooms.|₦4,500
Insulated water flask|Reusable flask demo listing for classes and study.|₦5,500
Door stopper and hook set|Small room accessory set shown as sample listing.|₦2,000
Compact extension reel|Short extension reel demo listing; inspect before use.|₦8,000
Reusable food storage set|Lidded storage container set demo listing for hostel kitchens.|₦3,500
`,
    services: `
Phone screen protector fitting|Demo service listing for screen protector installation.|₦2,000
Basic laptop software setup|Demo setup service; confirm supported software directly.|₦5,000
Document scanning service|Demo scanning service for a small document batch.|₦1,500
Event photography mini session|Demo campus photography service; confirm package details.|₦15,000
Barbering appointment|Demo haircut appointment listing; confirm time and location.|₦3,500
Simple shoe repair|Demo shoe repair listing for minor stitching or sole work.|₦4,000
`,
    groceries: `
Golden Penny spaghetti pack|Dry spaghetti pack shown as a grocery demo listing.|₦1,200
Long-grain rice 1kg|One-kilogram rice demo listing for hostel cooking.|₦2,000
Beans 1kg|One-kilogram beans demo listing; packaged weight is illustrative.|₦2,500
Tomato paste sachet bundle|Small tomato paste bundle for student cooking.|₦1,500
Vegetable oil 1 litre|One-litre cooking oil demo listing.|₦3,200
Breakfast cereal small pack|Breakfast cereal sample listing for quick hostel meals.|₦2,800
Indomie noodle multipack|Noodle multipack demo listing for pantry restocking.|₦3,000
Groundnut snack pack|Small packaged groundnut snack demo listing.|₦900
`,
    footwear: `
Rubber shower slides|Easy-clean shower slides demo listing for hostel use.|₦3,500
Canvas lace-up sneakers|Everyday canvas sneaker demo listing; confirm size availability.|₦12,000
Leather-look flat sandals|Flat sandal sample listing for everyday campus wear.|₦8,000
Unisex sports socks three-pack|Three-pair sports sock demo listing.|₦2,500
Black formal shoes|Simple formal shoe sample listing; confirm size and condition.|₦14,000
`,
    bags: `
Laptop backpack 15-inch|Padded backpack demo listing for carrying a laptop.|₦18,000
Canvas book tote|Reusable tote bag demo listing for books and errands.|₦5,500
Small crossbody bag|Compact crossbody bag sample listing for everyday essentials.|₦7,000
Drawstring gym bag|Lightweight drawstring bag demo listing for sports gear.|₦4,000
Document folder bag|Zip document bag demo listing for notes and coursework.|₦3,500
`,
    stationery: `
Blue ballpoint pen pack|Pack of blue pens shown as a stationery demo listing.|₦1,200
A4 ruled notebook pair|Two ruled notebooks for lecture notes.|₦2,000
Highlighter four-colour set|Four-colour highlighter sample set for revision.|₦2,500
Sticky note study pack|Assorted sticky notes demo listing for reminders.|₦1,800
`,
    laundry: `
Wash and fold small load|Demo laundry service listing; confirm load size and timing.|₦3,000
Wash and iron shirt bundle|Demo clothing-care service for a small shirt bundle.|₦3,500
Laundry detergent refill|Detergent refill demo listing for hostel laundry.|₦2,200
Clothes drying line kit|Compact drying line and clips demo listing.|₦2,500
`,
    tutoring: `
Introductory calculus tutoring|Demo one-hour tutoring listing; confirm subject and schedule.|₦5,000
First-year chemistry revision|Demo revision session listing for introductory chemistry.|₦4,500
Academic writing support|Demo writing guidance session; no assignment completion service.|₦5,500
Basic spreadsheet tutoring|Demo beginner spreadsheet lesson for students.|₦4,000
`,
};

export const demoListingSpecs = Object.entries(demoListingText).flatMap(
    ([categorySlug, text]) => text.trim().split('\n').map((line) => {
        const [name, description, price] = line.split('|');
        return { categorySlug, name, description, price };
    }),
);
