import { faker } from '@faker-js/faker';
import type { Review, ReviewSource, SentimentType } from '../types';

const sources: ReviewSource[] = ['X', 'Instagram', 'web', 'email', 'TikTok', 'Facebook', 'YouTube', 'LinkedIn'];

// Expanded product categories
const products = [
  // Smartphones
  'iPhone 15 Pro',
  'Samsung Galaxy S24 Ultra',
  'Google Pixel 8',
  'OnePlus 12',
  'Xiaomi 14 Pro',
  'Nothing Phone 2',
  'ASUS ROG Phone 8',
  // Laptops
  'MacBook Pro M3',
  'Dell XPS 15',
  'Lenovo ThinkPad X1 Carbon',
  'ASUS ROG Zephyrus',
  'HP Spectre x360',
  'Razer Blade 18',
  'Framework Laptop',
  // Headphones
  'AirPods Pro',
  'Sony WH-1000XM5',
  'Bose QuietComfort',
  'Samsung Galaxy Buds',
  'Sennheiser Momentum 4',
  'Jabra Elite 10',
  'Nothing Ear 2',
  // Smart Home
  'Amazon Echo Show',
  'Google Nest Hub',
  'Ring Video Doorbell',
  'Philips Hue Starter Kit',
  'Ecobee Smart Thermostat',
  'Arlo Pro 5',
  'Eufy Robot Vacuum',
  // Wearables
  'Apple Watch Series 9',
  'Samsung Galaxy Watch 6',
  'Fitbit Charge 6',
  'Garmin Fenix 7',
  'Oura Ring Gen 3'
];

// Multi-language templates
const templates = {
  positive: {
    en: [
      "Absolutely love my new {product}! The {feature} is incredible and {benefit}.",
      "Best purchase I've made this year. The {product} exceeded my expectations with its {feature}.",
      "Can't recommend the {product} enough. {benefit} and the quality is outstanding.",
      "Five stars for the {product}! {benefit} and customer service was excellent.",
      "Really impressed with the {product}. {feature} works flawlessly and {benefit}.",
      "This {product} is a game-changer! The {feature} is revolutionary and {benefit}.",
      "Blown away by the {product}'s performance. {benefit} and it keeps getting better.",
      "Outstanding experience with the {product}. {feature} is top-notch and {benefit}."
    ],
    es: [
      "¡Me encanta mi nuevo {product}! El {feature} es increíble y {benefit}.",
      "La mejor compra del año. El {product} superó mis expectativas con su {feature}.",
      "Recomiendo totalmente el {product}. {benefit} y la calidad es excepcional.",
      "¡Cinco estrellas para el {product}! {benefit} y el servicio al cliente fue excelente.",
      "Muy impresionado con el {product}. El {feature} funciona perfectamente y {benefit}.",
      "¡Este {product} es revolucionario! El {feature} es innovador y {benefit}."
    ],
    fr: [
      "J'adore mon nouveau {product} ! Le {feature} est incroyable et {benefit}.",
      "Meilleur achat de l'année. Le {product} a dépassé mes attentes avec son {feature}.",
      "Je recommande vivement le {product}. {benefit} et la qualité est exceptionnelle.",
      "Cinq étoiles pour le {product} ! {benefit} et le service client était excellent.",
      "Très impressionné par le {product}. Le {feature} fonctionne parfaitement et {benefit}."
    ]
  },
  neutral: {
    en: [
      "The {product} is decent but {drawback}. Still, {benefit}.",
      "Mixed feelings about the {product}. While {benefit}, however {drawback}.",
      "Average experience with the {product}. {feature} is good but {drawback}.",
      "Not bad, not great. The {product} {feature} is okay, though {drawback}.",
      "{product} works as expected. {benefit} but {drawback}.",
      "Reasonable value for money. The {product} {feature} is decent, although {drawback}.",
      "Middle-of-the-road experience. {benefit}, but {drawback} holds it back."
    ],
    es: [
      "El {product} está bien pero {drawback}. Aun así, {benefit}.",
      "Sentimientos encontrados sobre el {product}. Si bien {benefit}, sin embargo {drawback}.",
      "Experiencia promedio con el {product}. El {feature} es bueno pero {drawback}.",
      "Ni bueno ni malo. El {feature} del {product} está bien, aunque {drawback}.",
      "El {product} funciona como se espera. {benefit} pero {drawback}."
    ],
    fr: [
      "Le {product} est correct mais {drawback}. Néanmoins, {benefit}.",
      "Avis mitigé sur le {product}. Bien que {benefit}, cependant {drawback}.",
      "Expérience moyenne avec le {product}. Le {feature} est bon mais {drawback}.",
      "Ni bon ni mauvais. Le {feature} du {product} est correct, mais {drawback}.",
      "Le {product} fonctionne comme prévu. {benefit} mais {drawback}."
    ]
  },
  negative: {
    en: [
      "Disappointed with the {product}. {drawback} and customer service wasn't helpful.",
      "Save your money. The {product} {drawback} and isn't worth the price.",
      "Had high hopes for the {product} but {drawback}. Returning it.",
      "Worst purchase ever. The {product} {drawback} right out of the box.",
      "Don't waste your time with the {product}. {drawback} and {drawback2}.",
      "Completely let down by the {product}. {drawback} and the support is terrible.",
      "Regret buying the {product}. {drawback} and it's not getting better."
    ],
    es: [
      "Decepcionado con el {product}. {drawback} y el servicio al cliente no fue útil.",
      "Ahorra tu dinero. El {product} {drawback} y no vale el precio.",
      "Tenía grandes expectativas con el {product} pero {drawback}. Lo devuelvo.",
      "La peor compra. El {product} {drawback} desde el principio.",
      "No pierdas tiempo con el {product}. {drawback} y {drawback2}."
    ],
    fr: [
      "Déçu par le {product}. {drawback} et le service client n'était pas utile.",
      "Économisez votre argent. Le {product} {drawback} et ne vaut pas le prix.",
      "J'avais de grands espoirs pour le {product} mais {drawback}. Je le retourne.",
      "Pire achat. Le {product} {drawback} dès le départ.",
      "Ne perdez pas votre temps avec le {product}. {drawback} et {drawback2}."
    ]
  }
};

const features = {
  positive: {
    en: [
      "battery life",
      "display quality",
      "camera system",
      "build quality",
      "performance",
      "user interface",
      "sound quality",
      "connectivity",
      "ergonomic design",
      "haptic feedback",
      "AI capabilities",
      "wireless charging"
    ],
    es: [
      "duración de la batería",
      "calidad de pantalla",
      "sistema de cámara",
      "calidad de construcción",
      "rendimiento",
      "interfaz de usuario",
      "calidad de sonido",
      "conectividad"
    ],
    fr: [
      "autonomie de la batterie",
      "qualité d'écran",
      "système de caméra",
      "qualité de fabrication",
      "performance",
      "interface utilisateur",
      "qualité sonore",
      "connectivité"
    ]
  },
  neutral: {
    en: [
      "battery life",
      "interface",
      "design",
      "performance",
      "features",
      "price point",
      "storage capacity",
      "customization options",
      "accessories"
    ],
    es: [
      "batería",
      "interfaz",
      "diseño",
      "rendimiento",
      "características",
      "precio"
    ],
    fr: [
      "batterie",
      "interface",
      "design",
      "performance",
      "fonctionnalités",
      "prix"
    ]
  },
  negative: {
    en: [
      "battery life",
      "build quality",
      "software",
      "performance",
      "reliability",
      "customer support",
      "update system",
      "durability",
      "repair options"
    ],
    es: [
      "batería",
      "calidad de construcción",
      "software",
      "rendimiento",
      "fiabilidad",
      "soporte al cliente"
    ],
    fr: [
      "batterie",
      "qualité de fabrication",
      "logiciel",
      "performance",
      "fiabilité",
      "support client"
    ]
  }
};

const benefits = {
  en: [
    "it's super fast",
    "the quality is outstanding",
    "it's very user-friendly",
    "the value for money is great",
    "it integrates perfectly with my other devices",
    "the design is sleek and modern",
    "it's exactly what I needed",
    "the setup was a breeze",
    "the AI features are impressive",
    "the ecosystem integration is seamless",
    "the customization options are extensive",
    "the updates are regular and meaningful"
  ],
  es: [
    "es súper rápido",
    "la calidad es excepcional",
    "es muy fácil de usar",
    "la relación calidad-precio es excelente",
    "se integra perfectamente con mis otros dispositivos",
    "el diseño es elegante y moderno",
    "es exactamente lo que necesitaba",
    "la configuración fue muy sencilla"
  ],
  fr: [
    "c'est super rapide",
    "la qualité est exceptionnelle",
    "c'est très facile à utiliser",
    "le rapport qualité-prix est excellent",
    "il s'intègre parfaitement avec mes autres appareils",
    "le design est élégant et moderne",
    "c'est exactement ce dont j'avais besoin",
    "l'installation était un jeu d'enfant"
  ]
};

const drawbacks = {
  en: [
    "the price is a bit steep",
    "the battery drains quickly",
    "it takes time to get used to",
    "the software needs improvement",
    "it's missing some basic features",
    "the build quality could be better",
    "customer support is slow to respond",
    "it's not as intuitive as advertised",
    "the updates are too frequent",
    "the accessories are overpriced",
    "the AI features are hit or miss",
    "the ecosystem is too restrictive"
  ],
  es: [
    "el precio es algo elevado",
    "la batería se agota rápidamente",
    "lleva tiempo acostumbrarse",
    "el software necesita mejoras",
    "faltan algunas características básicas",
    "la calidad de construcción podría ser mejor",
    "el servicio al cliente es lento",
    "no es tan intuitivo como anuncian"
  ],
  fr: [
    "le prix est un peu élevé",
    "la batterie se décharge rapidement",
    "il faut du temps pour s'y habituer",
    "le logiciel nécessite des améliorations",
    "il manque certaines fonctionnalités de base",
    "la qualité de fabrication pourrait être meilleure",
    "le service client est lent à répondre",
    "ce n'est pas aussi intuitif qu'annoncé"
  ]
};

function generateReviewText(sentiment: SentimentType, product: string, language: 'en' | 'es' | 'fr'): string {
  const template = faker.helpers.arrayElement(templates[sentiment][language]);
  const feature = faker.helpers.arrayElement(features[sentiment][language]);
  const benefit = faker.helpers.arrayElement(benefits[language]);
  const drawback = faker.helpers.arrayElement(drawbacks[language]);
  const drawback2 = faker.helpers.arrayElement(drawbacks[language].filter(d => d !== drawback));

  return template
    .replace('{product}', product)
    .replace('{feature}', feature)
    .replace('{benefit}', benefit)
    .replace('{drawback}', drawback)
    .replace('{drawback2}', drawback2);
}

export function generateReview(): Review {
  // Weight the sentiments to create a more realistic distribution
  const sentimentRoll = Math.random();
  const sentiment: SentimentType = 
    sentimentRoll < 0.6 ? 'positive' :  // 60% positive
    sentimentRoll < 0.85 ? 'neutral' :  // 25% neutral
    'negative';                         // 15% negative

  // Language distribution
  const languageRoll = Math.random();
  const language = 
    languageRoll < 0.6 ? 'en' :    // 60% English
    languageRoll < 0.8 ? 'es' :    // 20% Spanish
    'fr';                          // 20% French

  const product = faker.helpers.arrayElement(products);
  
  const stars = sentiment === 'positive' ? faker.number.int({ min: 4, max: 5 }) :
                sentiment === 'neutral' ? faker.number.int({ min: 3, max: 4 }) :
                faker.number.int({ min: 1, max: 2 });

  // Generate a mock sentiment score based on the sentiment
  const sentimentScore = sentiment === 'positive' ? faker.number.float({ min: 0.7, max: 1 }) :
                        sentiment === 'neutral' ? faker.number.float({ min: 0.4, max: 0.6 }) :
                        faker.number.float({ min: 0, max: 0.3 });

  // Generate a realistic name based on the language
  const customerName = language === 'es' ? 
    `${faker.person.firstName('female')} ${faker.person.lastName('female')}` :
    language === 'fr' ? 
    `${faker.person.firstName('male')} ${faker.person.lastName('male')}` :
    faker.person.fullName();

  // Generate realistic timestamps within the last 90 days
  const timestamp = faker.date.recent({ days: 90 });

  return {
    id: faker.string.uuid(),
    text: generateReviewText(sentiment, product, language),
    source: faker.helpers.arrayElement(sources),
    sentiment,
    sentimentScore,
    language,
    stars,
    productName: product,
    timestamp,
    customerName,
    // Add engagement metrics for social media
    likes: sentiment === 'positive' ? faker.number.int({ min: 5, max: 1000 }) :
           sentiment === 'neutral' ? faker.number.int({ min: 1, max: 100 }) :
           faker.number.int({ min: 0, max: 50 }),
    shares: sentiment === 'positive' ? faker.number.int({ min: 0, max: 200 }) :
            sentiment === 'neutral' ? faker.number.int({ min: 0, max: 20 }) :
            faker.number.int({ min: 0, max: 10 }),
    // Add verification status (verified purchase, etc.)
    verifiedPurchase: faker.datatype.boolean({ probability: 0.8 })
  };
}