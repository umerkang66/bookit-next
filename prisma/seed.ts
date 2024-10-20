import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const rooms = [
  {
    name: "Charming Studio < 10 Miles to Wells' Beaches!",
    price: 168,
    description:
      "A friendly atmosphere and natural delights await your visit to the town of Wells! Stay at this well-equipped 1-bath studio and enjoy easy access to several beaches, including Wells Beach and Drakes Island Beach, as well as Rachel Carson National Wildlife Refuge - the best spot for wildlife viewing just 8 miles away. Not to mention, with the downtown area just 10 minutes from the vacation rental.",
    address: "4667 Bicetown Street, New York, NY, 10004",
    guestCapacity: 1,
    numOfBeds: 1,
    internet: true,
    breakfast: true,
    airConditioned: false,
    petsAllowed: false,
    roomCleaning: true,
    images: [
      {
        public_id: "bookit/rooms/kd6lxr9kolobmkafsg3x",
        url: "https://res.cloudinary.com/dvxt8pfbu/image/upload/v1695384271/bookit/rooms/kd6lxr9kolobmkafsg3x.jpg",
      },
      {
        public_id: "bookit/rooms/e2dzcklbukov1dwk87ro",
        url: "https://res.cloudinary.com/dvxt8pfbu/image/upload/v1695384269/bookit/rooms/e2dzcklbukov1dwk87ro.jpg",
      },
      {
        public_id: "bookit/rooms/ejtn2c3cve8gxpkesmev",
        url: "https://res.cloudinary.com/dvxt8pfbu/image/upload/v1695384269/bookit/rooms/ejtn2c3cve8gxpkesmev.jpg",
      },
    ],
    category: "KING",
  },
  {
    name: "Picturesque 2-Story Farmhouse w/Private Hot Tub",
    price: 242,
    description:
      "Find plenty of space for a family or a large group at this picturesque Wells home, the perfect spot for a relaxing getaway in charming, quintessential Maine style! Spend your days on the beautiful nearby beaches, and come home to a large backyard and orchard where your kids can play, as well as a patio with a gas grill for barbecues on summer afternoons.",
    address: "200 Olympic Dr, Stafford, VS, 22554",
    guestCapacity: 2,
    numOfBeds: 2,
    internet: true,
    breakfast: false,
    airConditioned: true,
    petsAllowed: false,
    roomCleaning: true,
    images: [
      {
        url: "https://res.cloudinary.com/dvxt8pfbu/image/upload/v1695385250/bookit/rooms/rsol5lq6lclagt8iomnq.jpg",
        public_id: "/bookit/rooms/rsol5lq6lclagt8iomnq",
      },
      {
        url: "https://res.cloudinary.com/dvxt8pfbu/image/upload/v1695385250/bookit/rooms/oapfhme12dz4lhdl4eg6.jpg",
        public_id: "/bookit/rooms/oapfhme12dz4lhdl4eg6",
      },
      {
        url: "https://res.cloudinary.com/dvxt8pfbu/image/upload/v1695385249/bookit/rooms/yyzdoe5hqpccf5awhtjk.jpg",
        public_id: "/bookit/rooms/yyzdoe5hqpccf5awhtjk",
      },
    ],
    category: "TWINS",
  },
  {
    name: "Downtown Portsmouth Private Getaway! Hot Tub",
    price: 85,
    description:
      "Absolutely the best location in Portsmouth! Beautifully furnished, this spacious and private home is perfectly suited for taking in all of the must-see sights and historic landmarks that make this vibrant city so unique. Situated near the banks of the Piscataqua River just minutes away from Strawbery Banke Museum, Prescott Park, USS Albacore Museum, Market Square and more!",
    address: "3747 Parkway Street, Apple Valley, CA, 92307",
    guestCapacity: 3,
    numOfBeds: 2,
    internet: true,
    breakfast: true,
    airConditioned: true,
    petsAllowed: true,
    roomCleaning: false,
    images: [
      {
        url: "https://res.cloudinary.com/dvxt8pfbu/image/upload/v1695387482/bookit/rooms/awhdhardthy0k2smcbsu.jpg",
        public_id: "/bookit/rooms/awhdhardthy0k2smcbsu",
      },
      {
        url: "https://res.cloudinary.com/dvxt8pfbu/image/upload/v1695387481/bookit/rooms/e2dzcklbukov1dwk87ro.jpg",
        public_id: "/bookit/rooms/e2dzcklbukov1dwk87ro",
      },
      {
        url: "https://res.cloudinary.com/dvxt8pfbu/image/upload/v1695387475/bookit/rooms/ejtn2c3cve8gxpkesmev.jpg",
        public_id: "/bookit/rooms/ejtn2c3cve8gxpkesmev",
      },
    ],
    category: "KING",
  },
  {
    name: "Spacious Suite in a quiet Boston neighborhood.",
    price: 95,
    description:
      "Our largest room with a queen bed and foldable sofa. Comfortably fits 2-3 adults, four adults maximum. Decorated with Irish-themed colors and arts. It has a private bathroom with a shower, equipped with smart TV, mini-fridge, desk, chairs. Enjoy City views at the sitting area by the window. Located on the 3rd floor with no elevator.",
    address: "224 Cherry St, Buffalo, NY, 14202",
    guestCapacity: 6,
    numOfBeds: 3,
    internet: true,
    breakfast: true,
    airConditioned: true,
    petsAllowed: false,
    roomCleaning: true,
    images: [
      {
        url: "https://res.cloudinary.com/dvxt8pfbu/image/upload/v1695387701/bookit/rooms/qtuorwznnpyopmbctjuy.jpg",
        public_id: "/bookit/rooms/qtuorwznnpyopmbctjuy",
      },
      {
        url: "https://res.cloudinary.com/dvxt8pfbu/image/upload/v1695387701/bookit/rooms/y260jr1egd46mf17he9m.jpg",
        public_id: "/bookit/rooms/y260jr1egd46mf17he9m",
      },
      {
        url: "https://res.cloudinary.com/dvxt8pfbu/image/upload/v1695387694/bookit/rooms/diw28hzkwp8mconczmwj.jpg",
        public_id: "/bookit/rooms/diw28hzkwp8mconczmwj",
      },
    ],
    category: "SINGLE",
  },
  {
    name: "Shangri-La Hotel, Washington",
    price: 105,
    description:
      "Our largest room with a queen bed and foldable sofa. Comfortably fits 2-3 adults, four adults maximum. Decorated with Irish-themed colors and arts. It has a private bathroom with a shower, equipped with smart TV, mini-fridge, desk, chairs. Enjoy City views at the sitting area by the window. Located on the 3rd floor with no elevator.",
    address: "4724  Mudlick Road, Yakima, WA, 98902",
    guestCapacity: 2,
    numOfBeds: 1,
    internet: true,
    breakfast: true,
    airConditioned: true,
    petsAllowed: false,
    roomCleaning: true,
    images: [
      {
        url: "https://res.cloudinary.com/dvxt8pfbu/image/upload/v1695387900/bookit/rooms/eoalrsquq92etqzmzeqk.jpg",
        public_id: "/bookit/rooms/eoalrsquq92etqzmzeqk",
      },
      {
        url: "https://res.cloudinary.com/dvxt8pfbu/image/upload/v1695387898/bookit/rooms/iibpe0gdyijanbhkugoj.jpg",
        public_id: "/bookit/rooms/iibpe0gdyijanbhkugoj",
      },
      {
        url: "https://res.cloudinary.com/dvxt8pfbu/image/upload/v1695387896/bookit/rooms/qk9wtaqn4tuncye0pwe6.jpg",
        public_id: "/bookit/rooms/qk9wtaqn4tuncye0pwe6",
      },
    ],
    category: "KING",
  },
  {
    name: "Hotel Chimayo de Santa Fe Rooms",
    price: 36,
    description:
      "Our largest room with a queen bed and foldable sofa. Comfortably fits 2-3 adults, four adults maximum. Decorated with Irish-themed colors and arts. It has a private bathroom with a shower, equipped with smart TV, mini-fridge, desk, chairs. Enjoy City views at the sitting area by the window. Located on the 3rd floor with no elevator.",
    address: "1029  Godfrey Street, Portland, OR, 97205",
    guestCapacity: 2,
    numOfBeds: 2,
    internet: true,
    breakfast: true,
    airConditioned: true,
    petsAllowed: false,
    roomCleaning: true,
    images: [
      {
        url: "https://res.cloudinary.com/dvxt8pfbu/image/upload/v1695388319/bookit/rooms/walc1kz8dhwvjymkthnj.jpg",
        public_id: "/bookit/rooms/walc1kz8dhwvjymkthnj",
      },
      {
        url: "https://res.cloudinary.com/dvxt8pfbu/image/upload/v1695388318/bookit/rooms/ls4ryglg7rg6lw58tn3v.jpg",
        public_id: "/bookit/rooms/ls4ryglg7rg6lw58tn3v",
      },
      {
        url: "https://res.cloudinary.com/dvxt8pfbu/image/upload/v1695388314/bookit/rooms/clnynpt136jyko6eyg8v.jpg",
        public_id: "/bookit/rooms/clnynpt136jyko6eyg8v",
      },
    ],
    category: "TWINS",
  },
  {
    name: "Hotel Garni Ischgl ☆ 4 star room comfort",
    price: 82,
    description:
      "Our largest room with a queen bed and foldable sofa. Comfortably fits 2-3 adults, four adults maximum. Decorated with Irish-themed colors and arts. It has a private bathroom with a shower, equipped with smart TV, mini-fridge, desk, chairs. Enjoy City views at the sitting area by the window. Located on the 3rd floor with no elevator.",
    address: "2645  Parrish Avenue, SAINT LOUIS, MO, 63116",
    guestCapacity: 5,
    numOfBeds: 3,
    internet: true,
    breakfast: true,
    airConditioned: true,
    petsAllowed: false,
    roomCleaning: false,
    images: [
      {
        url: "https://res.cloudinary.com/dvxt8pfbu/image/upload/v1695388562/bookit/rooms/o1rzc5xgoyaxpmdrag3o.jpg",
        public_id: "/bookit/rooms/o1rzc5xgoyaxpmdrag3o",
      },
      {
        url: "https://res.cloudinary.com/dvxt8pfbu/image/upload/v1695388559/bookit/rooms/jsml7mq6i954nkwacyyw.jpg",
        public_id: "/bookit/rooms/jsml7mq6i954nkwacyyw",
      },
      {
        url: "https://res.cloudinary.com/dvxt8pfbu/image/upload/v1695388559/bookit/rooms/wbktweyj90p0vtldvgq5.jpg",
        public_id: "/bookit/rooms/wbktweyj90p0vtldvgq5",
      },
    ],
    category: "SINGLE",
  },
  {
    name: "The Spa at Base Camp at Kerry Hotel",
    price: 76,
    description:
      "Our largest room with a queen bed and foldable sofa. Comfortably fits 2-3 adults, four adults maximum. Decorated with Irish-themed colors and arts. It has a private bathroom with a shower, equipped with smart TV, mini-fridge, desk, chairs. Enjoy City views at the sitting area by the window. Located on the 3rd floor with no elevator.",
    address: "3118  Red Hawk Road, Garfield, MN, 56332",
    guestCapacity: 2,
    numOfBeds: 1,
    internet: true,
    breakfast: false,
    airConditioned: true,
    petsAllowed: false,
    roomCleaning: true,
    images: [
      {
        url: "https://res.cloudinary.com/dvxt8pfbu/image/upload/v1695388811/bookit/rooms/aul0tijfnpklk1sj2gzd.jpg",
        public_id: "/bookit/rooms/aul0tijfnpklk1sj2gzd",
      },
      {
        url: "https://res.cloudinary.com/dvxt8pfbu/image/upload/v1695388809/bookit/rooms/dmnjrokvwmcbcgbp3znk.jpg",
        public_id: "/bookit/rooms/dmnjrokvwmcbcgbp3znk",
      },
      {
        url: "https://res.cloudinary.com/dvxt8pfbu/image/upload/v1695388809/bookit/rooms/rmdrxxwxmdfuqvj6znux.jpg",
        public_id: "/bookit/rooms/rmdrxxwxmdfuqvj6znux",
      },
    ],
    category: "SINGLE",
  },
];

async function main() {
  const promises = rooms.map((room) => {
    // this will also create the roomImages on the fly
    const images = Array.from(room.images);

    const promise = prisma.room.create({
      data: {
        ...room,
        images: { create: images },
        // get this id from prisma studio
        user: { connect: { id: "cm2hluzkh0000mocluz4arrmf" } },
      },
    });
    return promise;
  });

  for (let i = 0; i < promises.length; i++) {
    console.log(i+1, "Done");
    await promises[i];
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

/*
"prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
},

"postinstall": "prisma generate && prisma db seed"
*/

// stripe listen --forward-to http://localhost:3000/api/payment/webhook --events checkout.session.completed
