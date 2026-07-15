import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Volume2, 
  Play, 
  Pause, 
  RotateCcw, 
  Trophy, 
  Star, 
  Sparkles, 
  Brain, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight,
  HelpCircle,
  Award,
  CheckCircle,
  XCircle,
  Wand2,
  Plus,
  Trash2,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { fetchWithRetry, generateContent } from '../utils/aiClient';

// ═══════════════════════════════════════════════════════════════
//  ILLUSTRATED MULTI-PAGE STORIES DATABASE
// ═══════════════════════════════════════════════════════════════
const STORIES = [
  {
    id: 1,
    title: "The Brave Little Tortoise",
    genre: "Adventure",
    emoji: "🐢",
    image: "/assets/story_tortoise.png",
    pages: [
      {
        text: "Once upon a time in a green meadow, a little tortoise named Timmy wanted to reach the top of the hill more than anything. The hill was tall, and Timmy was very small. All the rabbits and foxes laughed at him. \"You're too slow, Timmy! You'll never make it up there!\" they teased, zooming past him in flashes of brown and orange fur.",
        image: "/assets/story_tortoise.png"
      },
      {
        text: "But Timmy did not listen to their laughter. He tucked his tiny head down, took a deep breath, and took one small step forward. Then another. He walked through the morning dew, beneath the hot afternoon sun, resting under cool dandelion leaves whenever his legs grew tired. He smiled at the butterflies and kept a cheerful song in his heart.",
        imagePrompt: "a small cute cartoon tortoise walking slowly but happily on a dirt path up a grassy hill, bright sunny day, butterflies flying around"
      },
      {
        text: "When the sun began to set, painting the sky in beautiful shades of orange and gold, Timmy took his final step. He stood proudly at the very top of the hill! Looking down, he saw the rabbits and foxes resting at the bottom, having given up on their race hours ago because they got too tired. The stars above winking at Timmy showed that slow and steady always wins the day!",
        imagePrompt: "a tiny cute cartoon tortoise standing proudly at the summit of a hill, looking down at a beautiful sunset with orange and gold clouds, stars beginning to wink in the sky"
      }
    ]
  },
  {
    id: 2,
    title: "Zara and the Rainbow Dragon",
    genre: "Fantasy",
    emoji: "🐉",
    image: "/assets/story_dragon.png",
    pages: [
      {
        text: "Deep in the Painted Mountains lived a friendly dragon named Blaze. Blaze was special—his scales shined and shimmered every color of the rainbow in the sunlight. However, Blaze was very lonely. Every time he flew near the village, the people would run away in fear, thinking he was a scary beast.",
        image: "/assets/story_dragon.png"
      },
      {
        text: "One sunny morning, a brave little girl named Zara was picking wild berries near Blaze's cave. She saw him crying giant, glowing dragon tears. Instead of running, Zara walked right up to the massive dragon and said softly, \"Don't cry, big friend. You are the most beautiful thing I have ever seen!\" Blaze blinked in surprise and happily lowered his head.",
        imagePrompt: "a brave little girl with brown hair picking berries next to a friendly, sad rainbow-scaled dragon crying glowing tears outside its cave"
      },
      {
        text: "Zara gently scratched Blaze behind his ears, making him purr like a giant cat. From that day on, Zara and Blaze became best friends. Every morning they flew across the clouds together, painting the sky with streaks of pink, green, and gold. The villagers looked up in wonder, no longer afraid, but celebrating the beautiful rainbow dragon!",
        imagePrompt: "a little girl flying on the back of a friendly rainbow dragon through soft clouds under a bright blue sky, leaving pink and gold trails"
      }
    ]
  },
  {
    id: 3,
    title: "Captain Finn's Ocean Mystery",
    genre: "Mystery",
    emoji: "🐠",
    image: "/assets/story_ocean.png",
    pages: [
      {
        text: "Finn was the smallest yellow fish in Coral Cove, but he had the biggest curiosity. He wore a tiny seaweed detective hat and loved solving mysteries. One quiet morning, Finn woke up to find that the tide pool was completely empty! Every single crab, starfish, and sea snail had disappeared overnight.",
        image: "/assets/story_ocean.png"
      },
      {
        text: "\"This is a job for Captain Finn!\" he bubbled. He swam deep, asking the glowing jellyfish and the wise old octopus if they had seen anything. The octopus pointed his tentacle toward the Dark Trench. Finn swam bravely into the deep blue, his eyes wide, looking for clues left behind on the sandy ocean floor.",
        imagePrompt: "a small cute yellow cartoon fish wearing a tiny seaweed detective hat, swimming in a deep blue ocean next to glowing pink jellyfish"
      },
      {
        text: "Soon, Finn found a trail of colorful shiny pebbles leading to a warm underwater hot spring. There he discovered all his friends! They weren't missing—they were holding a surprise birthday party for him! They all shouted, \"Happy Birthday, Captain Finn!\" and danced around the coral reefs in celebration.",
        imagePrompt: "a group of happy ocean creatures, crabs, starfish, sea snails, throwing a surprise birthday party for a yellow detective fish next to coral reefs"
      }
    ]
  },
  {
    id: 4,
    title: "The Whispering Oak",
    genre: "Magic",
    emoji: "🌳",
    image: "/assets/story_oak.png",
    pages: [
      {
        text: "In the middle of the Whispering Woods stood a giant oak tree named Barnaby. Barnaby was over five hundred years old, and he could talk! His leaves rustled with secrets of the past, and his branches were home to families of squirrels, owls, and singing bluebirds.",
        image: "/assets/story_oak.png"
      },
      {
        text: "One day, a young boy named Leo sat under Barnaby's shade, feeling sad because he had lost his grandfather's silver pocket watch. Leo began to cry. Barnaby gently lowered a large branch and whispered, \"Do not weep, young traveler. Ask my forest friends, and we shall help you find what was lost.\"",
        imagePrompt: "a young boy crying sadly under the shade of a giant old oak tree with a friendly face on its trunk"
      },
      {
        text: "Barnaby rustled his leaves, sending a message through the wind. Within minutes, the squirrels searched the tree hollows, the bluebirds flew high to spot reflections, and a friendly squirrel emerged holding the shiny silver watch! Leo hugged Barnaby's giant trunk, realizing that nature is always listening.",
        imagePrompt: "a friendly squirrel handing a shiny silver pocket watch to a happy young boy under a giant green oak tree"
      }
    ]
  },
  {
    id: 5,
    title: "Nebula the Space Cat",
    genre: "Sci-Fi",
    emoji: "🐱‍🚀",
    image: "/assets/story_cat.png",
    pages: [
      {
        text: "Nebula was a fluffy orange cat who lived aboard the Space Shuttle Star-Paws. Unlike normal earth cats who chased mice, Nebula loved floating in zero-gravity and chasing cosmic laser beams. She wore a tiny custom space suit and a clear bubble helmet.",
        image: "/assets/story_cat.png"
      },
      {
        text: "One evening, the ship's engines went quiet, and a warning light started flashing red. The shuttle was drifting near a swirling purple nebula! The human astronauts were busy trying to reboot the computers, but they couldn't reach the narrow cable hatch behind the main engine console.",
        imagePrompt: "a fluffy orange space cat in a tiny spacesuit and bubble helmet, floating inside a high-tech spaceship near a flashing red warning light"
      },
      {
        text: "Nebula meowed, floating right into the narrow hatch. She saw a loose glowing blue wire. With a quick tap of her soft paw, she pushed the wire back into its slot. Instantly, the engines hummed back to life! The crew cheered, and Nebula got a double serving of delicious space-tuna treats.",
        imagePrompt: "a happy orange space cat eating space tuna on a plate, surrounded by smiling human astronauts in a spaceship"
      }
    ]
  },
  {
    id: 6,
    title: "Secret of the Clockwork Kingdom",
    genre: "Fantasy",
    emoji: "🏰",
    image: "/assets/story_kingdom.png",
    pages: [
      {
        text: "High in the clouds sat the Clockwork Kingdom, a magical city made entirely of brass towers, spinning golden gears, and clockwork animals. The kingdom was powered by the Great Heart-Spring, a giant golden key that wound up the city every day at noon.",
        image: "/assets/story_kingdom.png"
      },
      {
        text: "One morning, the kingdom woke up to a terrible silence. The gears had stopped spinning! The Great Heart-Spring had vanished from the royal pedestal. Princess Mia knew she had to act quickly, or the entire kingdom would run out of energy and freeze in place forever.",
        imagePrompt: "a young princess with a wrench walking through a dark chamber filled with giant, frozen golden gears and brass clocks"
      },
      {
        text: "Mia searched the gear tunnels and found the key wedged between two giant wheels, where a mischievous wind had blown it. Using her mechanical wrench, she carefully freed the key and wound the Great Heart-Spring. With a loud *TICK-TOCK*, the golden towers began to spin again, saving the kingdom!",
        imagePrompt: "a beautiful golden castle in the clouds with spinning brass gears and flags waving, sparkling under a bright sun"
      }
    ]
  }
];
const STORIES_EASY = [
  {
    id: 1,
    title: "The Brave Little Tortoise",
    genre: "Adventure",
    emoji: "🐢",
    image: "/assets/story_tortoise.png",
    pages: [
      {
        text: "Timmy was a slow little tortoise. He wanted to climb a big green hill. The other animals laughed at him.",
        image: "/assets/story_tortoise.png"
      },
      {
        text: "Timmy did not listen to them. He walked slowly, one small step at a time. He smiled at the yellow butterflies.",
        imagePrompt: "a small cute cartoon tortoise walking slowly but happily on a dirt path up a grassy hill, bright sunny day, butterflies flying around"
      },
      {
        text: "Timmy reached the top of the hill! He looked at the stars winking in the sky. Slow and steady wins the day!",
        imagePrompt: "a tiny cute cartoon tortoise standing proudly at the summit of a hill, looking down at a beautiful sunset with orange and gold clouds, stars beginning to wink in the sky"
      }
    ]
  },
  {
    id: 2,
    title: "Zara and the Rainbow Dragon",
    genre: "Fantasy",
    emoji: "🐉",
    image: "/assets/story_dragon.png",
    pages: [
      {
        text: "Blaze was a friendly dragon. He had shiny rainbow scales. But Blaze was sad and lonely because people were afraid of him.",
        image: "/assets/story_dragon.png"
      },
      {
        text: "A brave little girl named Zara saw him crying. She walked up to the dragon and said, 'You are beautiful!'",
        imagePrompt: "a brave little girl with brown hair picking berries next to a friendly, sad rainbow-scaled dragon crying glowing tears outside its cave"
      },
      {
        text: "Zara scratched his ears. They became best friends and flew together in the blue sky, painting the clouds with colors.",
        imagePrompt: "a little girl flying on the back of a friendly rainbow dragon through soft clouds under a bright blue sky, leaving pink and gold trails"
      }
    ]
  },
  {
    id: 3,
    title: "Captain Finn's Ocean Mystery",
    genre: "Mystery",
    emoji: "🐠",
    image: "/assets/story_ocean.png",
    pages: [
      {
        text: "Finn was a tiny yellow fish. He wore a green seaweed detective hat. One day, all his tide pool friends were gone.",
        image: "/assets/story_ocean.png"
      },
      {
        text: "Finn swam deep to look for clues. He saw pretty pink jellyfish wiggling in the deep blue water.",
        imagePrompt: "a small cute yellow cartoon fish wearing a tiny seaweed detective hat, swimming in a deep blue ocean next to glowing pink jellyfish"
      },
      {
        text: "Soon, he found a warm cave. Surprise! His friends were throwing a happy birthday party for him!",
        imagePrompt: "a group of happy ocean creatures, crabs, starfish, sea snails, throwing a surprise birthday party for a yellow detective fish next to coral reefs"
      }
    ]
  }
];

const STORIES_HARD = [
  {
    id: 1,
    title: "The Chrono-Key Paradox",
    genre: "Sci-Fi",
    emoji: "⏳",
    image: "/assets/adventure_space.png",
    pages: [
      {
        text: "In the brass-towered city of Aethelgard, a young clocksmith named Silas discovered an ancient pocket watch hidden behind the grand archives. Unlike normal timepieces, this one hummed with a soft, pulsing violet light and vibrated at a peculiar tachyon frequency.",
        image: "/assets/adventure_space.png"
      },
      {
        text: "Curiosity getting the better of him, Silas wound the golden crown. Instantly, the raindrops frozen in mid-air resembled floating glass beads, and the bustling crowd stood perfectly still. But out from a shimmering temporal rift stepped a towering figure clad in shifting armor—a Time Warden.",
        imagePrompt: "a young clocksmith in a high-tech workshop filled with glowing gears, holding a pocket watch emitting violet light, surrounded by frozen raindrops"
      },
      {
        text: "\"You have disrupted the prime timeline,\" the Warden echoed. To save Aethelgard from freezing in time forever, Silas had to solve the Warden's mechanical riddle. Working under pressure, he realigned the gears inside the watch using his trusty wrench.",
        imagePrompt: "a young boy clocksmith solving a complex riddle on a giant glowing gears puzzle board in front of a giant mysterious armored figure"
      },
      {
        text: "With a satisfying click, the clockwork aligned. Silas slipped the watch back into its pedestal, and time surged forward with a warm rush of air. The Warden vanished, leaving Silas to look up at the sky, realizing the universe was far grander than his simple workshop.",
        imagePrompt: "a young boy clockmaker looking up at the night sky from a brass tower window as shooting stars streak across the sky"
      }
    ]
  },
  {
    id: 2,
    title: "Legends of the Whispering Woods",
    genre: "Fantasy",
    emoji: "🌳",
    image: "/assets/adventure_forest.png",
    pages: [
      {
        text: "Elena, an apprentice of ancient botany, was determined to find the legendary Lumina Lily, a flower said to bloom only under a blue moon. Its glowing nectar held the power to cure the sleeping sickness that had swept through her valley.",
        image: "/assets/adventure_forest.png"
      },
      {
        text: "She entered the forbidden Whispering Woods, where the trees were said to shift paths to mislead travelers. As the shadows lengthened, the ancient oak trees began to murmur warnings. Elena closed her eyes, listening to the wind rather than her fears, and pressed onward.",
        imagePrompt: "a young girl apprentice with a lantern walking through a dense, glowing enchanted forest with giant trees that have faint friendly faces"
      },
      {
        text: "Suddenly, a majestic forest guardian—a stag with glowing green antlers—emerged from the brush. It tested Elena's resolve with a series of riddles about the balance of nature. Answering with respect and humility, Elena earned the guardian's trust.",
        imagePrompt: "a young girl speaking respectfully to a giant white stag with glowing green antlers in a moonlit forest clearing"
      },
      {
        text: "The stag guided her to a hidden spring where a single Lumina Lily sparkled. Gathering only what she needed, she thanked the guardian and returned to the valley. The sickness was cured, and she was declared a master botanist.",
        imagePrompt: "a young girl holding a glowing blue flower, standing next to a giant white stag in a glowing spring, stars shining above"
      }
    ]
  },
  {
    id: 3,
    title: "Escape from Nebula-9",
    genre: "Sci-Fi",
    emoji: "🚀",
    image: "/assets/adventure_space.png",
    pages: [
      {
        text: "Commander Vance's scout ship, the Star-Rider, was caught in the gravitational pull of Nebula-9, a collapsing purple cosmic cloud. The warning alarms blared as the shields dropped to critical levels and the warp drive refused to initiate.",
        image: "/assets/adventure_space.png"
      },
      {
        text: "With the main thrusters failing, Vance had to route emergency power from the life support systems to the manual navigation thrusters. His pilot droid frantically calculated a flight vector through a dense field of tumbling, metallic asteroids.",
        imagePrompt: "a high-tech spaceship cockpit with red warning lights, a human pilot steering through a window showing a swirling purple nebula and asteroids"
      },
      {
        text: "Using a series of precise, high-speed maneuvers, Vance navigated the ship through the asteroid maze. Just as the nebula began to implode into a black hole, he activated the hyperdrive, shooting the ship forward into the safety of hyperspace.",
        imagePrompt: "a sleek spaceship escaping a collapsing purple black hole, zooming forward at high speed leaving a bright light streak behind"
      }
    ]
  }
];


// ═══════════════════════════════════════════════════════════════
//  30 INTERACTIVE KID-FRIENDLY MATH PUZZLES
// ═══════════════════════════════════════════════════════════════
const MATH_PUZZLES = [
  { id: 1, type: "addition", question: "If you have 5 red apples and 4 green apples, how many apples do you have in total? 🍎", answer: 9, hint: "Count them all together: 5 + 4" },
  { id: 2, type: "subtraction", question: "There are 12 shiny stars in the sky. If 5 stars shoot away, how many stars are left? ⭐", answer: 7, hint: "Start at 12 and count backwards by 5: 12 - 5" },
  { id: 3, type: "pattern", question: "Look at this pattern: 2, 4, 6, 8, __. What number comes next? 🔢", answer: 10, hint: "We are skip-counting by 2!" },
  { id: 4, type: "multiplication", question: "A cute bunny has 3 baskets. Each basket has 5 carrots. How many carrots does the bunny have? 🥕", answer: 15, hint: "Add 5 three times: 5 + 5 + 5" },
  { id: 5, type: "geometry", question: "How many sides does a happy little triangle have? 🔺", answer: 3, hint: "Count the corners of a triangle." },
  { id: 6, type: "addition", question: "Double eight! If 8 birds are on a fence and 8 more fly over to join, how many birds are there? 🐦", answer: 16, hint: "What is 8 plus 8?" },
  { id: 7, type: "subtraction", question: "You have 15 points. You spend 9 points on a cool toy. How many points do you have left? 🪙", answer: 6, hint: "Subtract 9 from 15: 15 - 9" },
  { id: 8, type: "pattern", question: "Solve this jump: 5, 10, 15, 20, __. What is the next number? 🐸", answer: 25, hint: "We are count-jumping by 5s!" },
  { id: 9, type: "geometry", question: "How many sharp corners does a square window frame have? 🔲", answer: 4, hint: "Count the corners around a square." },
  { id: 10, type: "multiplication", question: "If you have 2 hands, and each hand has 10 fingers, how many fingers do you have in total? 👐", answer: 20, hint: "Double 10 is: 10 + 10" },
  { id: 11, type: "addition", question: "A monkey picked 7 yellow bananas and 6 green bananas. How many bananas does the monkey have? 🍌", answer: 13, hint: "Add them together: 7 + 6" },
  { id: 12, type: "subtraction", question: "A box had 18 delicious donuts. The family ate 10 of them. How many donuts are left in the box? 🍩", answer: 8, hint: "Take 10 away from 18: 18 - 10" },
  { id: 13, type: "multiplication", question: "A hen laid 4 nests of eggs. Each nest has 2 eggs. How many eggs are there in total? 🥚", answer: 8, hint: "Add 2 four times: 2 + 2 + 2 + 2" },
  { id: 14, type: "geometry", question: "How many sides does a house-shaped pentagon have? 🏠", answer: 5, hint: "Count the sides of a pentagon." },
  { id: 15, type: "division", question: "If you share 12 cupcakes equally between 2 friends, how many cupcakes does each friend get? 🧁", answer: 6, hint: "What is half of 12?" },
  { id: 16, type: "addition", question: "A flower bed has 9 red roses and 7 yellow tulips. How many flowers are in the bed? 🌸", answer: 16, hint: "Add them up: 9 + 7" },
  { id: 17, type: "subtraction", question: "A toy store had 20 teddy bears. They sold 4 of them. How many teddy bears are left? 🧸", answer: 16, hint: "Subtract 4 from 20: 20 - 4" },
  { id: 18, type: "pattern", question: "Solve this tricky jump: 3, 6, 9, 12, __. What is the missing number? 🦗", answer: 15, hint: "We are skip-counting by 3s!" },
  { id: 19, type: "counting", question: "How many legs do 2 spiders have altogether? 🕷️", answer: 16, hint: "One spider has 8 legs. Two spiders have: 8 + 8" },
  { id: 20, type: "addition", question: "Add three numbers: 3 blue balloons, 4 red balloons, and 5 green balloons. How many balloons in total? 🎈", answer: 12, hint: "First add 3 + 4, then add 5 to that!" },
  { id: 21, type: "subtraction", question: "A bakery baked 14 cookies. 7 cookies were eaten. How many cookies are left? 🍪", answer: 7, hint: "What is 14 minus 7?" },
  { id: 22, type: "multiplication", question: "A cat has 15 toy mice, and a dog has double that amount. How many toy mice does the dog have? 🐶", answer: 30, hint: "Double of 15 is: 15 + 15" },
  { id: 23, type: "geometry", question: "How many sides does a honeycomb hexagon have? 🐝", answer: 6, hint: "Count the sides of a hexagon." },
  { id: 24, type: "subtraction", question: "A tree had 30 leaves. The autumn wind blew 10 leaves away. How many leaves are left on the tree? 🍂", answer: 20, hint: "Subtract 10 from 30: 30 - 10" },
  { id: 25, type: "logic", question: "There are 5 birds on a branch. 2 birds fly away, but then 3 new birds land. How many birds are there now? 🌳", answer: 6, hint: "Start with 5, subtract 2, then add 3!" },
  { id: 26, type: "multiplication", question: "A toy car has 4 wheels. How many wheels do 3 toy cars have in total? 🚗", answer: 12, hint: "Add 4 three times: 4 + 4 + 4" },
  { id: 27, type: "division", question: "You have 50 gold coins. If you split them into 2 equal piles, how many coins are in each pile? 🪙", answer: 25, hint: "What is half of 50?" },
  { id: 28, type: "pattern", question: "Look at the numbers: 10, 20, 30, 40, __. What comes next? 🚀", answer: 50, hint: "Skip count by 10s!" },
  { id: 29, type: "geometry", question: "How many flat faces does a 3D block cube have? 🎲", answer: 6, hint: "Think of a standard playing die. What is the highest number?" },
  { id: 30, type: "addition", question: "Ultimate challenge: 15 sweet cherries plus 15 sour cherries. How many cherries in total? 🍒", answer: 30, hint: "Calculate 15 + 15!" }
];
const MATH_PUZZLES_EASY = [
  { id: 1, type: "addition", question: "If you have 3 red apples and 2 green apples, how many apples do you have in total? 🍎", answer: 5, hint: "Count them: 3 + 2" },
  { id: 2, type: "subtraction", question: "There are 5 shiny stars. If 2 shoot away, how many stars are left? ⭐", answer: 3, hint: "Count backwards from 5: 5 - 2" },
  { id: 3, type: "pattern", question: "What number comes next in the pattern: 1, 2, 3, 4, __? 🔢", answer: 5, hint: "We are counting up by 1!" },
  { id: 4, type: "addition", question: "A bunny has 4 carrots and finds 4 more. How many carrots does the bunny have now? 🥕", answer: 8, hint: "Add 4 + 4" },
  { id: 5, type: "geometry", question: "How many corners does a happy little triangle have? 🔺", answer: 3, hint: "Count the corners." },
  { id: 6, type: "addition", question: "Double three! What is 3 + 3? 🐦", answer: 6, hint: "Count 3 fingers, then 3 more." },
  { id: 7, type: "subtraction", question: "You have 8 stickers. You give 3 to a friend. How many do you have left? 🪙", answer: 5, hint: "Subtract 3 from 8: 8 - 3" },
  { id: 8, type: "pattern", question: "What is the next number in this jump: 2, 4, 6, 8, __? 🐸", answer: 10, hint: "Skip count by 2s!" },
  { id: 9, type: "geometry", question: "How many sides does a square window frame have? 🔲", answer: 4, hint: "Count the sides around a square." },
  { id: 10, type: "addition", question: "You have 10 fingers. If you put 5 in your pocket, how many fingers are still showing? 👐", answer: 5, hint: "10 minus 5 is:" },
  { id: 11, type: "addition", question: "A monkey picked 5 yellow bananas and 5 green bananas. How many bananas does the monkey have? 🍌", answer: 10, hint: "What is 5 + 5?" },
  { id: 12, type: "subtraction", question: "A box had 10 donuts. The family ate 4 of them. How many donuts are left? 🍩", answer: 6, hint: "Take 4 away from 10: 10 - 4" },
  { id: 13, type: "addition", question: "A nest has 6 blue eggs and 2 white eggs. How many eggs in total? 🥚", answer: 8, hint: "Add 6 + 2" },
  { id: 14, type: "counting", question: "How many legs does a cute little dog have? 🐶", answer: 4, hint: "Count a dog's paws." },
  { id: 15, type: "division", question: "If you share 6 cookies equally between 2 kids, how many cookies does each kid get? 🍪", answer: 3, hint: "What is half of 6?" },
  { id: 16, type: "addition", question: "A flower bed has 7 red roses and 3 yellow tulips. How many flowers are in the bed? 🌸", answer: 10, hint: "Add them up: 7 + 3" },
  { id: 17, type: "subtraction", question: "A toy store had 12 teddy bears. They sold 2. How many teddy bears are left? 🧸", answer: 10, hint: "Subtract 2 from 12: 12 - 2" },
  { id: 18, type: "pattern", question: "What is the missing number: 10, 9, 8, 7, __? 🦗", answer: 6, hint: "We are counting backwards!" },
  { id: 19, type: "counting", question: "How many legs do 3 birds have altogether? 🐦", answer: 6, hint: "One bird has 2 legs. Three birds have: 2 + 2 + 2" },
  { id: 20, type: "addition", question: "Add three numbers: 2 blue balloons, 2 red balloons, and 3 green balloons. How many in total? 🎈", answer: 7, hint: "First add 2 + 2, then add 3!" },
  { id: 21, type: "subtraction", question: "A bakery baked 8 cookies. 4 cookies were eaten. How many are left? 🍪", answer: 4, hint: "What is 8 minus 4?" },
  { id: 22, type: "counting", question: "How many wings do 4 butterflies have in total? 🦋", answer: 8, hint: "Each butterfly has 2 wings: 2 + 2 + 2 + 2" },
  { id: 23, type: "geometry", question: "Does a circle have any corners? Enter 0 for no, or 4 for yes. 🟡", answer: 0, hint: "A circle is round and smooth." },
  { id: 24, type: "subtraction", question: "A tree had 10 leaves. The wind blew 3 leaves away. How many are left? 🍂", answer: 7, hint: "Subtract 3 from 10: 10 - 3" },
  { id: 25, type: "logic", question: "There are 3 birds on a branch. 1 flies away, but 2 new birds land. How many birds are there now? 🌳", answer: 4, hint: "Start with 3, subtract 1, then add 2!" },
  { id: 26, type: "addition", question: "A toy car has 4 wheels. How many wheels do 2 toy cars have? 🚗", answer: 8, hint: "Add 4 + 4" },
  { id: 27, type: "division", question: "You have 8 candies. If you split them into 2 equal piles, how many candies are in each pile? 🍬", answer: 4, hint: "What is half of 8?" },
  { id: 28, type: "pattern", question: "What comes next: 5, 10, 15, __? 🚀", answer: 20, hint: "Skip count by 5s!" },
  { id: 29, type: "geometry", question: "How many sides does a triangle have? 🔺", answer: 3, hint: "Count the sides of a triangle." },
  { id: 30, type: "addition", question: "Double five! If you have 5 sweet cherries and 5 sour cherries, how many do you have? 🍒", answer: 10, hint: "Calculate 5 + 5!" }
];

const MATH_PUZZLES_HARD = [
  { id: 1, type: "algebra", question: "Solve for x: 2x + 4 = 14. What is the value of x? 🔢", answer: 5, hint: "Subtract 4 from 14, then divide by 2." },
  { id: 2, type: "fraction", question: "What is 3/4 of 24? 🍰", answer: 18, hint: "Divide 24 by 4, then multiply by 3." },
  { id: 3, type: "pattern", question: "Find the next number in this sequence: 1, 4, 9, 16, __. 📈", answer: 25, hint: "These are perfect squares: 1², 2², 3², 4²..." },
  { id: 4, type: "percentage", question: "What is 20% of 150 gold coins? 🪙", answer: 30, hint: "Multiply 150 by 0.2, or divide by 5." },
  { id: 5, type: "geometry", question: "Find the area of a rectangle with a length of 8 cm and a width of 5 cm. 📐", answer: 40, hint: "Area = length * width" },
  { id: 6, type: "algebra", question: "Solve for y: 3y - 5 = 16. What is y? 🔣", answer: 7, hint: "Add 5 to 16, then divide by 3." },
  { id: 7, type: "decimals", question: "Calculate: 12.5 + 7.25. (Round to the nearest whole number) 🧮", answer: 20, hint: "Add the decimals: 19.75, which rounds to..." },
  { id: 8, type: "ratios", question: "In a class, the ratio of boys to girls is 3:2. If there are 12 boys, how many girls are there? 🎒", answer: 8, hint: "3 parts = 12, so 1 part = 4. Find 2 parts." },
  { id: 9, type: "geometry", question: "What is the perimeter of a regular hexagon where each side is 7 cm? ⬢", answer: 42, hint: "Multiply the side length by the number of sides (6)." },
  { id: 10, type: "multiplication", question: "Calculate: 15 * 12. 🚗", answer: 180, hint: "Multiply 15 by 10, then add 15 * 2." },
  { id: 11, type: "algebra", question: "If a pocket watch costs $15 and Leo pays with a $50 bill, how much change does he get? 💵", answer: 35, hint: "Subtract 15 from 50." },
  { id: 12, type: "subtraction", question: "Calculate: 100 - 37. ➖", answer: 63, hint: "Take 30 from 100, then subtract 7." },
  { id: 13, type: "division", question: "What is 144 divided by 12? ➗", answer: 12, hint: "12 times what number equals 144?" },
  { id: 14, type: "geometry", question: "How many degrees are in a right angle? 📐", answer: 90, hint: "Think of a perfect square corner." },
  { id: 15, type: "fraction", question: "If you have half of a pie and someone gives you another half of a pie, how many whole pies do you have in total? 🍕", answer: 1, hint: "Half + Half = One Whole" },
  { id: 16, type: "percentage", question: "A toy is normally $40 but is on sale for 25% off. What is the sale price in dollars? 🏷️", answer: 30, hint: "25% of 40 is 10. Subtract 10 from 40." },
  { id: 17, type: "algebra", question: "Solve for x: x/3 = 15. What is x? 🔢", answer: 45, hint: "Multiply both sides by 3." },
  { id: 18, type: "pattern", question: "Find the next number: 2, 6, 18, 54, __. 📈", answer: 162, hint: "Each term is multiplied by 3." },
  { id: 19, type: "logic", question: "A farmer has chickens and rabbits. There are 5 animals and 14 legs in total. How many rabbits does he have? 🐇", answer: 2, hint: "If all were chickens, they would have 10 legs. Each rabbit adds 2 legs." },
  { id: 20, type: "decimals", question: "What is 20 multiplied by 0.5? ✖️", answer: 10, hint: "Multiplying by 0.5 is the same as dividing by 2 or finding half." },
  { id: 21, type: "geometry", question: "How many total degrees are in the three interior angles of a triangle? 🔺", answer: 180, hint: "All triangles' interior angles sum to 180 degrees." },
  { id: 22, type: "probability", question: "A bag has 3 red marbles and 2 blue marbles. What is the percent chance of drawing a blue marble? 🔮", answer: 40, hint: "Blue is 2 out of 5, which is 2/5 or 40%." },
  { id: 23, type: "algebra", question: "If x = 4 and y = 5, what is the value of 3x + 2y? 🧮", answer: 22, hint: "Substitute: 3(4) + 2(5)" },
  { id: 24, type: "subtraction", question: "Subtract: 150 - 85. 🍂", answer: 65, hint: "150 minus 80 is 70, then subtract 5." },
  { id: 25, type: "division", question: "Divide 120 by 8. ➗", answer: 15, hint: "120 divided by 4 is 30. Halve that to get divided by 8." },
  { id: 26, type: "ratios", question: "If 4 pencils cost $2, how many pencils can you buy with $5? ✏️", answer: 10, hint: "Find the price of 1 pencil ($0.50), then divide $5 by $0.50." },
  { id: 27, type: "geometry", question: "Find the volume of a rectangular box with dimensions 3 cm, 4 cm, and 5 cm. 📦", answer: 60, hint: "Volume = length * width * height" },
  { id: 28, type: "percentage", question: "If a school has 500 students and 60% of them ride the bus, how many students ride the bus? 🚌", answer: 300, hint: "Multiply 500 by 0.6." },
  { id: 29, type: "fraction", question: "A pizza is cut into 8 equal slices. If you eat 4 of them, how many slices of pizza are left? 🍕", answer: 4, hint: "Subtract: 8 - 4" },
  { id: 30, type: "exponent", question: "What is 2 raised to the power of 5 (2^5)? ⚡", answer: 32, hint: "Multiply 2 by itself five times: 2 * 2 * 2 * 2 * 2" }
];


export default function LibraryZoneView({ studentName, totalPoints, teacher, classroom }) {
  const [activeTab, setActiveTab] = useState('Read Books');

  // --- Story State ---
  const [selectedStory, setSelectedStory] = useState(null);
  const [storyPage, setStoryPage] = useState(0);

  // --- Read Along (TTS) State ---
  const [isReading, setIsReading] = useState(false);
  const [readSpeed, setReadSpeed] = useState(1); // 1 = normal, 0.8 = slow
  const synthRef = useRef(null);
  const utteranceRef = useRef(null);

  // --- Quiz State ---
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [earnedStars, setEarnedStars] = useState(0);

  // --- AI Story & Puzzle Generator States ---
  const [customStories, setCustomStories] = useState([]);
  const [customPuzzles, setCustomPuzzles] = useState([]);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [isGeneratingPuzzles, setIsGeneratingPuzzles] = useState(false);
  
  // UI States
  const [showAiWriter, setShowAiWriter] = useState(false);
  const [storyTopic, setStoryTopic] = useState('');
  const [storyGenre, setStoryGenre] = useState('Adventure');
  const [puzzleTopic, setPuzzleTopic] = useState('Addition');
  const [aiError, setAiError] = useState('');
  const [imageLoading, setImageLoading] = useState(true);
  const [imageSrcError, setImageSrcError] = useState(false);

  // Resolve grade level from classroom name (e.g. "Grade 2" -> 2)
  const getGradeLevel = () => {
    if (!classroom?.name) return 3; // Default to Grade 3 if undefined
    const match = classroom.name.match(/\d+/);
    if (match) return parseInt(match[0], 10);
    return 3;
  };
  const studentGrade = getGradeLevel();

  const getBaseStories = () => {
    if (studentGrade <= 2) return STORIES_EASY;
    if (studentGrade >= 6) return STORIES_HARD;
    return STORIES; // Grade 3-5 (standard stories)
  };

  const getBasePuzzles = () => {
    if (studentGrade <= 2) return MATH_PUZZLES_EASY;
    if (studentGrade >= 6) return MATH_PUZZLES_HARD;
    return MATH_PUZZLES; // Grade 3-5 (standard puzzles)
  };

  const allStories = [...getBaseStories(), ...customStories];
  const allPuzzles = [...getBasePuzzles(), ...customPuzzles];

  useEffect(() => {
    setImageLoading(true);
    setImageSrcError(false);
  }, [selectedStory, storyPage]);

  // Load custom stories & puzzles from LocalStorage
  useEffect(() => {
    if (studentName) {
      try {
        const savedStories = localStorage.getItem(`hwz_custom_stories_${studentName}`);
        if (savedStories) {
          setCustomStories(JSON.parse(savedStories));
        }
        const savedPuzzles = localStorage.getItem(`hwz_custom_puzzles_${studentName}`);
        if (savedPuzzles) {
          setCustomPuzzles(JSON.parse(savedPuzzles));
        }
      } catch (e) {
        console.error("Error loading local storage custom assets:", e);
      }
    }
  }, [studentName]);

  // Initialize Speech Synth
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Helpers
  const getPageText = (story, pageIdx) => {
    const page = story.pages?.[pageIdx];
    if (!page) return '';
    return typeof page === 'string' ? page : page.text;
  };

  const getPageImage = (story, pageIdx) => {
    const page = story.pages?.[pageIdx];
    if (!page) return story.image || '';
    if (typeof page === 'string') return story.image || '';
    if (page.image) return page.image;
    const promptText = page.imagePrompt || page.image_prompt || page.text || story.title;
    if (promptText) {
      const stableSeed = (story.id ? (typeof story.id === 'string' ? story.id.charCodeAt(story.id.length - 1) : story.id) : 1) * 100 + pageIdx;
      return `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText + ", cute cartoon style, child book illustration, vibrant colors")}?width=512&height=512&nologo=true&seed=${stableSeed}`;
    }
    return story.image || '';
  };

  const getStoryCover = (story) => {
    if (story.image) return story.image;
    const stableSeed = (story.id ? (typeof story.id === 'string' ? story.id.charCodeAt(story.id.length - 1) : story.id) : 1) * 1000;
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(story.title + ", cute cartoon cover page, child illustration, vibrant colors")}?width=512&height=512&nologo=true&seed=${stableSeed}`;
  };

  const getTeacherActiveModel = async () => {
    if (!teacher?.uid) return 'gemini';
    try {
      const teacherDoc = await getDoc(doc(db, 'teachers', teacher.uid));
      if (teacherDoc.exists()) {
        const data = teacherDoc.data();
        return data.activeAi || 'gemini';
      }
    } catch (e) {
      console.warn("Failed to read teacher active AI:", e);
    }
    return 'gemini';
  };

  const handleGenerateStory = async () => {
    if (!storyTopic.trim()) {
      setAiError("Please type a story topic! 📝");
      return;
    }
    setAiError('');
    setIsGeneratingStory(true);
    try {
      const activeModel = await getTeacherActiveModel();

      let gradeGuidelines = "";
      if (studentGrade <= 2) {
        gradeGuidelines = "Write a simple children's story suitable for Grade " + studentGrade + ". Keep the language very simple and use short sentences. Each page must contain exactly 1-2 sentences of story text.";
      } else if (studentGrade >= 6) {
        gradeGuidelines = "Write a children's story suitable for Grade " + studentGrade + ". Use slightly more engaging, rich, and descriptive vocabulary. Each page should contain 3-4 sentences of story text.";
      } else {
        gradeGuidelines = "Write a children's story suitable for Grade " + studentGrade + ". Keep it kid-friendly. Each page should contain 2-3 sentences of story text.";
      }

      const promptText = `Write a 3-page children's story about: "${storyTopic}" in the "${storyGenre}" genre.
${gradeGuidelines}
Also, suggest a cartoon illustration prompt for each page that is descriptive and scene-specific.
Return ONLY a valid JSON object matching this schema. Do not include markdown formatting or backticks.

Schema:
{
  "title": "Story Title",
  "genre": "Genre Name",
  "emoji": "Choose a single matching emoji",
  "pages": [
    {
      "text": "Page 1 story text...",
      "imagePrompt": "Detailed cartoon illustration prompt for page 1"
    },
    {
      "text": "Page 2 story text...",
      "imagePrompt": "Detailed cartoon illustration prompt for page 2"
    },
    {
      "text": "Page 3 story text...",
      "imagePrompt": "Detailed cartoon illustration prompt for page 3"
    }
  ]
}`;

      const textResponse = await generateContent({
        prompt: promptText,
        responseMimeType: 'application/json',
        provider: activeModel
      });

      const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      const newStory = {
        id: `custom_${Date.now()}`,
        title: parsed.title || storyTopic,
        genre: parsed.genre || storyGenre,
        emoji: parsed.emoji || "📖",
        pages: parsed.pages || []
      };

      const updated = [...customStories, newStory];
      setCustomStories(updated);
      localStorage.setItem(`hwz_custom_stories_${studentName}`, JSON.stringify(updated));

      // Reset states
      setStoryTopic('');
      setShowAiWriter(false);
      
      // Auto open and play confetti
      setSelectedStory(newStory);
      setStoryPage(0);
      confetti({ particleCount: 80, spread: 60 });
    } catch (err) {
      console.error("AI Story Generation failed:", err);
      setAiError("Oops, something went wrong with the AI story creation. Please try again! ☄️");
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const handleGeneratePuzzles = async () => {
    setAiError('');
    setIsGeneratingPuzzles(true);
    try {
      const activeModel = await getTeacherActiveModel();

      let puzzleGuidelines = "";
      if (studentGrade <= 2) {
        puzzleGuidelines = `The puzzles must be simple and suitable for Grade ${studentGrade}.
- For addition/subtraction: keep numbers within 20.
- For patterns: simple skip counting (e.g. by 2s or 5s) or counting forward/backward.
- Keep the math operations very basic (no complex multiplication or division).`;
      } else if (studentGrade >= 6) {
        puzzleGuidelines = `The puzzles must match Grade ${studentGrade} difficulty (more challenging).
- Include topics like basic algebraic equations (e.g., solve for x, 2x + 3 = 11), percentages, ratios, or perimeter/area word problems.
- All answers must still resolve to single numeric integers.`;
      } else {
        puzzleGuidelines = `The puzzles must be suitable for Grade ${studentGrade} (medium difficulty).
- Can include simple multiplication, sharing/division, multi-step addition/subtraction, or shape features (number of sides).
- All answers must resolve to single numeric integers.`;
      }

      const promptText = `Create 5 fun, kid-friendly math puzzles about "${puzzleTopic}".
${puzzleGuidelines}

CRITICAL ACCURACY & QUALITY RULES:
1. Double-check all calculations. Every math equation, operation, word problem, and numeric answer must be 100% mathematically correct. There must be zero arithmetic errors.
2. The "answer" field must be a valid numeric integer matching the correct mathematical answer to the question.
3. Ensure questions are clear, well-phrased, and suitable for elementary/middle school students.

Each puzzle must have a clear question with emojis, a numeric integer answer, a helpful hint, and a type.
Return ONLY a valid JSON array of objects matching the schema below. Do not include markdown code block backticks.

Schema:
[
  {
    "question": "Question text with a matching emoji...",
    "answer": 12,
    "hint": "Helpful hint for kids...",
    "type": "addition" // or subtraction, pattern, geometry, multiplication, algebra, etc.
  }
]`;

      const textResponse = await generateContent({
        prompt: promptText,
        responseMimeType: 'application/json',
        provider: activeModel
      });

      const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      const oldLength = allPuzzles.length;
      const newPuzzles = parsed.map((p, idx) => ({
        id: `custom_${Date.now()}_${idx}`,
        ...p
      }));

      const updated = [...customPuzzles, ...newPuzzles];
      setCustomPuzzles(updated);
      localStorage.setItem(`hwz_custom_puzzles_${studentName}`, JSON.stringify(updated));

      // Jump to first new custom puzzle
      setCurrentQuizIndex(oldLength);
      setIsQuizCompleted(false);
      
      confetti({ particleCount: 100, spread: 70 });
    } catch (err) {
      console.error("AI Puzzle Generation failed:", err);
      alert("Oops, something went wrong with the AI puzzle creation. Please try again! ☄️");
    } finally {
      setIsGeneratingPuzzles(false);
    }
  };

  const handleDeleteCustomStory = (storyId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this custom story? 🗑️")) return;
    const updated = customStories.filter(s => s.id !== storyId);
    setCustomStories(updated);
    localStorage.setItem(`hwz_custom_stories_${studentName}`, JSON.stringify(updated));
  };

  // Handle TTS Play/Pause
  const startSpeech = (text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = readSpeed;
    utterance.pitch = 1.1; // Kid friendly slightly higher pitch

    utterance.onend = () => {
      setIsReading(false);
    };
    utterance.onerror = () => {
      setIsReading(false);
    };

    utteranceRef.current = utterance;
    setIsReading(true);
    synthRef.current.speak(utterance);
  };

  const pauseSpeech = () => {
    if (!synthRef.current) return;
    if (isReading) {
      synthRef.current.pause();
      setIsReading(false);
    } else {
      synthRef.current.resume();
      setIsReading(true);
    }
  };

  const stopSpeech = () => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    setIsReading(false);
  };

  // Switch Story Pages
  const handleNextPage = () => {
    if (selectedStory && storyPage < selectedStory.pages.length - 1) {
      setStoryPage(storyPage + 1);
      stopSpeech();
    }
  };

  const handlePrevPage = () => {
    if (storyPage > 0) {
      setStoryPage(storyPage - 1);
      stopSpeech();
    }
  };

  // --- Math Quiz Actions ---
  const handleNumberClick = (num) => {
    if (quizFeedback) return;
    setUserAnswer(prev => prev + num);
  };

  const handleBackspace = () => {
    if (quizFeedback) return;
    setUserAnswer(prev => prev.slice(0, -1));
  };

  const handleClearAnswer = () => {
    if (quizFeedback) return;
    setUserAnswer('');
  };

  const handleQuizSubmit = (e) => {
    if (e) e.preventDefault();
    if (!userAnswer || quizFeedback) return;

    const currentPuzzle = allPuzzles[currentQuizIndex];
    const parsedAns = parseInt(userAnswer, 10);

    if (parsedAns === currentPuzzle.answer) {
      setQuizFeedback('correct');
      setQuizScore(prev => prev + 10);
      setEarnedStars(prev => prev + 1);
      
      // Fire confetti for correct answers
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.8 }
      });

      setTimeout(() => {
        advanceQuiz();
      }, 1500);
    } else {
      setQuizFeedback('wrong');
      setTimeout(() => {
        setQuizFeedback(null);
        setUserAnswer('');
      }, 1500);
    }
  };

  const advanceQuiz = () => {
    setQuizFeedback(null);
    setUserAnswer('');
    setShowHint(false);

    if (currentQuizIndex < allPuzzles.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      setIsQuizCompleted(true);
      // Double confetti for complete finish!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setUserAnswer('');
    setShowHint(false);
    setQuizScore(0);
    setIsQuizCompleted(false);
    setQuizFeedback(null);
    setEarnedStars(0);
  };

  return (
    <div className="flex flex-col h-full bg-[#FCFBF7] font-sans">
      {/* Header Banner */}
      <header className="px-8 py-6 bg-gradient-to-r from-blue-100 via-orange-50 to-amber-50 border-b border-blue-100 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <span>📚</span> Library Zone
          </h2>
          <p className="text-xs font-bold text-slate-500 mt-1">Step into a world of stories, math puzzles, and achievements!</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-blue-200/50 shadow-sm">
          <Star className="w-5 h-5 text-amber-500 fill-amber-400 animate-pulse" />
          <span className="text-sm font-black text-slate-700">{totalPoints + (earnedStars * 10)} XP</span>
        </div>
      </header>

      {/* Tabs Menu */}
      <div className="px-8 py-4 bg-white border-b border-slate-100 flex gap-3 shrink-0 overflow-x-auto no-scrollbar">
        {[
          { label: 'Read Books', icon: '📖' },
          { label: 'Read Along', icon: '🎧' },
          { label: 'Quizzes', icon: '🏆' },
          { label: 'Earn Rewards', icon: '⭐' }
        ].map(tab => (
          <button
            key={tab.label}
            onClick={() => {
              setActiveTab(tab.label);
              setSelectedStory(null);
              setStoryPage(0);
              stopSpeech();
            }}
            className={`px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2 border transition-all cursor-pointer ${
              activeTab === tab.label 
                ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20 scale-102' 
                : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main View Container */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        
        {/* ==================== 1. READ BOOKS ==================== */}
        {activeTab === 'Read Books' && (
          <div className="max-w-5xl mx-auto space-y-6">
            {!selectedStory ? (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
                  <div className="flex-1 space-y-2">
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">Story Corner</span>
                    <h3 className="text-xl font-black text-slate-800">Pick a Magical Adventure!</h3>
                    <p className="text-xs font-semibold text-slate-500">Every story is split into fun pages and comes with colorful picture books to ignite your imagination.</p>
                  </div>
                  <img src="/assets/library_bookshelf.png" className="w-32 h-32 object-contain mix-blend-multiply" alt="Bookshelf" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">


                  {allStories.map(story => (
                    <div 
                      key={story.id}
                      onClick={() => {
                        setSelectedStory(story);
                        setStoryPage(0);
                      }}
                      className="bg-white border border-slate-100 rounded-[32px] overflow-hidden hover:shadow-lg hover:scale-102 transition-all cursor-pointer flex flex-col group relative"
                    >
                      {/* Delete button for custom stories */}
                      {typeof story.id === 'string' && story.id.startsWith('custom_') && (
                        <button
                          onClick={(e) => handleDeleteCustomStory(story.id, e)}
                          className="absolute top-4 left-4 bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-500 p-2 rounded-xl border border-slate-100 z-10 transition-colors shadow-sm"
                          title="Delete Custom Story"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <div className="h-44 bg-gradient-to-b from-green-50 to-orange-50 flex items-center justify-center relative overflow-hidden">
                        <img 
                          src={getStoryCover(story)} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                          alt={story.title} 
                        />
                        <span className="absolute bottom-4 right-4 text-3xl bg-white/90 backdrop-blur-sm p-2 rounded-2xl shadow-sm border border-slate-100/50">{story.emoji}</span>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">{story.genre}</span>
                          <h4 className="text-base font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{story.title}</h4>
                        </div>
                        <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-black py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors border border-blue-100/50">
                          Open Book 📖
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-[40px] shadow-sm overflow-hidden flex flex-col lg:flex-row min-h-[500px]">
                {/* Visual Graphic Panel */}
                <div className="lg:w-2/5 bg-[#F4F2FF] flex items-center justify-center relative overflow-hidden min-h-[280px]">
                  {imageLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm z-10 space-y-3">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest animate-pulse">Drawing page... 🎨</span>
                    </div>
                  )}
                  <img 
                    key={`${selectedStory?.id || 'story'}-${storyPage}`}
                    src={imageSrcError ? (selectedStory?.image || "/assets/library_bookshelf.png") : getPageImage(selectedStory, storyPage)} 
                    className="w-full h-full object-cover" 
                    alt={selectedStory.title} 
                    onLoad={(e) => {
                      const expectedUrl = getPageImage(selectedStory, storyPage);
                      if (e.target.src.endsWith(expectedUrl) || e.target.src === expectedUrl) {
                        setImageLoading(false);
                      }
                    }}
                    onError={(e) => {
                      const expectedUrl = getPageImage(selectedStory, storyPage);
                      if (e.target.src.endsWith(expectedUrl) || e.target.src === expectedUrl) {
                        setImageSrcError(true);
                        setImageLoading(false);
                      }
                    }}
                  />
                  <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-orange-200 flex items-center gap-2">
                    <span className="text-sm font-black text-orange-600 uppercase tracking-widest">{selectedStory.genre}</span>
                  </div>
                </div>

                {/* Reading Board Panel */}
                <div className="lg:w-3/5 p-8 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                      <button 
                        onClick={() => setSelectedStory(null)}
                        className="text-xs font-black text-slate-400 hover:text-slate-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" /> Close Book
                      </button>
                      <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-3 py-1 rounded-full">
                        Page {storyPage + 1} of {selectedStory.pages.length}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        {selectedStory.emoji} {selectedStory.title}
                      </h3>
                      {/* Interactive text block */}
                      <p className="text-slate-600 text-base md:text-lg leading-relaxed font-semibold italic text-justify select-none pt-2 border-l-4 border-blue-400 pl-4 bg-blue-50/20 py-2 rounded-r-2xl">
                        "{getPageText(selectedStory, storyPage)}"
                      </p>
                    </div>
                  </div>

                  {/* Navigation controls */}
                  <div className="flex items-center justify-between border-t border-slate-50 pt-6 mt-6">
                    <button
                      onClick={handlePrevPage}
                      disabled={storyPage === 0}
                      className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                        storyPage === 0
                          ? 'bg-slate-50 border-slate-50 text-slate-300 cursor-not-allowed'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev Page
                    </button>

                    {storyPage < selectedStory.pages.length - 1 ? (
                      <button
                        onClick={handleNextPage}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                      >
                        Next Page <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedStory(null);
                          // Give a little confetti for finishing a book
                          confetti({ particleCount: 30, spread: 30 });
                        }}
                        className="bg-emerald-500 text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-400 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                      >
                        Finish Story! 🎉
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== 2. READ ALONG ==================== */}
        {activeTab === 'Read Along' && (
          <div className="max-w-5xl mx-auto space-y-6">
            {!selectedStory ? (
              <div className="space-y-6">
                <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
                  <div className="flex-1 space-y-2">
                    <span className="bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">Audio Books</span>
                    <h3 className="text-xl font-black text-slate-800">Listen & Read Together!</h3>
                    <p className="text-xs font-semibold text-slate-500">Pick any story and click Play. The app will read aloud using high-quality narrator voices. Great for developing reading skills!</p>
                  </div>
                  <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center shadow-lg animate-bounce">
                    <Volume2 className="w-10 h-10 text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allStories.map(story => (
                    <div 
                      key={story.id}
                      onClick={() => {
                        setSelectedStory(story);
                        setStoryPage(0);
                      }}
                      className="bg-white border border-slate-100 rounded-[32px] overflow-hidden hover:shadow-lg hover:scale-102 transition-all cursor-pointer flex flex-col group border-l-4 border-l-orange-400"
                    >
                      <div className="h-40 bg-orange-50/50 flex items-center justify-center relative overflow-hidden">
                        <img 
                          src={getStoryCover(story)} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                          alt={story.title} 
                        />
                        <div className="absolute inset-0 bg-green-900/10 group-hover:bg-green-900/20 transition-all flex items-center justify-center">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-orange-400 group-hover:scale-110 transition-all">
                            <Play className="w-5 h-5 text-orange-600 fill-orange-600 ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">{story.genre}</span>
                        <h4 className="text-base font-black text-slate-800 leading-tight group-hover:text-orange-600 transition-colors">{story.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-[40px] shadow-sm overflow-hidden flex flex-col lg:flex-row min-h-[500px]">
                {/* Visual Panel */}
                <div className="lg:w-2/5 bg-[#F4F2FF] flex items-center justify-center relative overflow-hidden min-h-[280px]">
                  {imageLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm z-10 space-y-3">
                      <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
                      <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest animate-pulse">Drawing page... 🎨</span>
                    </div>
                  )}
                  <img 
                    key={`${selectedStory?.id || 'story'}-${storyPage}`}
                    src={imageSrcError ? (selectedStory?.image || "/assets/library_bookshelf.png") : getPageImage(selectedStory, storyPage)} 
                    className="w-full h-full object-cover" 
                    alt={selectedStory.title} 
                    onLoad={(e) => {
                      const expectedUrl = getPageImage(selectedStory, storyPage);
                      if (e.target.src.endsWith(expectedUrl) || e.target.src === expectedUrl) {
                        setImageLoading(false);
                      }
                    }}
                    onError={(e) => {
                      const expectedUrl = getPageImage(selectedStory, storyPage);
                      if (e.target.src.endsWith(expectedUrl) || e.target.src === expectedUrl) {
                        setImageSrcError(true);
                        setImageLoading(false);
                      }
                    }}
                  />
                  <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-orange-200 flex items-center gap-2">
                    <span className="text-sm font-black text-orange-600 uppercase tracking-widest">{selectedStory.genre}</span>
                  </div>
                  <div className="absolute inset-0 bg-green-900/5 pointer-events-none" />
                </div>

                {/* Read Along Board */}
                <div className="lg:w-3/5 p-8 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                      <button 
                        onClick={() => {
                          setSelectedStory(null);
                          stopSpeech();
                        }}
                        className="text-xs font-black text-slate-400 hover:text-slate-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" /> Exit Reader
                      </button>
                      <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-3 py-1 rounded-full">
                        Narrator Room
                      </span>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        {selectedStory.emoji} {selectedStory.title}
                      </h3>
                      
                      {/* Speech Synthesis Controls */}
                      <div className="bg-orange-50/50 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 border border-orange-100/50">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => startSpeech(getPageText(selectedStory, storyPage))}
                            className="bg-orange-600 hover:bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow transition-all active:scale-95"
                            title="Play"
                          >
                            <Play className="w-5 h-5 fill-white" />
                          </button>
                          <button
                            onClick={pauseSpeech}
                            className="bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all"
                            title="Pause/Resume"
                          >
                            <Pause className="w-4 h-4" />
                          </button>
                          <button
                            onClick={stopSpeech}
                            className="bg-white border border-red-200 text-red-600 hover:bg-red-50 w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all"
                            title="Stop"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Speed controller */}
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-orange-200">
                          <span className="text-[10px] font-black text-slate-400 uppercase">Voice Speed:</span>
                          <button 
                            onClick={() => setReadSpeed(0.8)} 
                            className={`px-2 py-0.5 rounded-lg text-[9px] font-bold ${readSpeed === 0.8 ? 'bg-orange-100 text-orange-700' : 'text-slate-500'}`}
                          >
                            Slow
                          </button>
                          <button 
                            onClick={() => setReadSpeed(1)} 
                            className={`px-2 py-0.5 rounded-lg text-[9px] font-bold ${readSpeed === 1 ? 'bg-orange-100 text-orange-700' : 'text-slate-500'}`}
                          >
                            Normal
                          </button>
                        </div>
                      </div>

                      {/* Narrative page content */}
                      <p className="text-slate-700 text-base md:text-lg leading-relaxed font-semibold italic text-justify select-none pt-4 border-l-4 border-orange-400 pl-4 bg-orange-50/20 py-2 rounded-r-2xl">
                        "{getPageText(selectedStory, storyPage)}"
                      </p>
                    </div>
                  </div>

                  {/* Navigation controls */}
                  <div className="flex items-center justify-between border-t border-slate-50 pt-6 mt-6">
                    <button
                      onClick={handlePrevPage}
                      disabled={storyPage === 0}
                      className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                        storyPage === 0
                          ? 'bg-slate-50 border-slate-50 text-slate-300 cursor-not-allowed'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev Page
                    </button>

                    {storyPage < selectedStory.pages.length - 1 ? (
                      <button
                        onClick={handleNextPage}
                        className="bg-orange-600 text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 hover:bg-orange-500 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                      >
                        Next Page <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedStory(null);
                          stopSpeech();
                          confetti({ particleCount: 30, spread: 30 });
                        }}
                        className="bg-emerald-500 text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-400 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                      >
                        Finish Listening! 🎉
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== 3. QUIZZES (30 MATH PUZZLES) ==================== */}
        {activeTab === 'Quizzes' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {!isQuizCompleted ? (
              <div className="bg-white border border-slate-100 rounded-[40px] shadow-sm overflow-hidden flex flex-col">
                {/* Score and Progress Bar */}
                <div className="px-8 py-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black text-amber-700 uppercase bg-amber-100/70 px-3 py-1 rounded-full flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5" /> Puzzle {currentQuizIndex + 1} of {allPuzzles.length}
                      </span>
                      <span className="text-xs font-black text-amber-600 flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-amber-500" /> Score: {quizScore} XP
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden border border-slate-200/50">
                      <div 
                        className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuizIndex) / allPuzzles.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* AI Puzzle Generator Control in header */}
                  <div className="shrink-0 flex items-center gap-2">
                    <select
                      value={puzzleTopic}
                      onChange={(e) => setPuzzleTopic(e.target.value)}
                      className="bg-white border border-amber-200 text-xs font-bold text-slate-700 rounded-xl px-2.5 py-1.5 focus:border-amber-400 outline-none"
                    >
                      <option value="Addition">Addition ➕</option>
                      <option value="Subtraction">Subtraction ➖</option>
                      <option value="Multiplication">Multiplication ✖️</option>
                      <option value="Division">Division ➗</option>
                      <option value="Geometry">Geometry 🔺</option>
                      <option value="Patterns">Patterns 🔢</option>
                      <option value="Space Math">Space Math 🚀</option>
                      <option value="Word Problems">Word Problems 📝</option>
                    </select>
                    <button
                      onClick={handleGeneratePuzzles}
                      disabled={isGeneratingPuzzles}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isGeneratingPuzzles ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                      Generate +5 Puzzles
                    </button>
                  </div>
                </div>

                {/* Math Puzzle Board */}
                <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-6 text-center">
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 leading-snug max-w-xl mx-auto select-none pt-4">
                      {allPuzzles[currentQuizIndex]?.question}
                    </h3>

                    {/* Feedback animation overlay/container */}
                    <div className="h-12 flex items-center justify-center">
                      {quizFeedback === 'correct' && (
                        <div className="flex items-center gap-2 text-emerald-500 font-black text-lg animate-bounce">
                          <CheckCircle className="w-6 h-6 fill-emerald-100" /> Correct! +10 XP 🌟
                        </div>
                      )}
                      {quizFeedback === 'wrong' && (
                        <div className="flex items-center gap-2 text-rose-500 font-black text-lg animate-wiggle">
                          <XCircle className="w-6 h-6 fill-rose-100" /> Oops! Try again! 🤔
                        </div>
                      )}
                    </div>

                    {/* Answer Display */}
                    <div className="max-w-xs mx-auto border-4 border-amber-200 bg-amber-50/20 rounded-3xl p-5 shadow-inner">
                      <span className="text-3xl font-black tracking-widest text-slate-700 min-h-[2.5rem] block select-none">
                        {userAnswer || <span className="text-slate-300 font-light font-quicksand">?</span>}
                      </span>
                    </div>
                  </div>

                  {/* Input controls & Number Pad */}
                  <div className="space-y-6">
                    {/* Kid Friendly Number Pad */}
                    <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleNumberClick(num.toString())}
                          className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-lg font-black text-slate-700 py-3.5 rounded-2xl active:scale-95 shadow-sm hover:border-amber-300 transition-all cursor-pointer"
                        >
                          {num}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={handleClearAnswer}
                        className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-[10px] font-black text-rose-600 rounded-2xl active:scale-95 shadow-sm transition-all cursor-pointer flex items-center justify-center uppercase tracking-wider"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNumberClick('0')}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-lg font-black text-slate-700 py-3.5 rounded-2xl active:scale-95 shadow-sm hover:border-amber-300 transition-all cursor-pointer"
                      >
                        0
                      </button>
                      <button
                        type="button"
                        onClick={handleBackspace}
                        className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[10px] font-black text-amber-700 rounded-2xl active:scale-95 shadow-sm transition-all cursor-pointer flex items-center justify-center uppercase tracking-wider"
                      >
                        Delete
                      </button>
                    </div>

                    {/* Hint and Submit buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-slate-50 pt-6">
                      <button
                        type="button"
                        onClick={() => setShowHint(!showHint)}
                        className="px-6 py-3 rounded-2xl border border-amber-300 text-amber-700 bg-amber-50/50 text-xs font-bold hover:bg-amber-50 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <HelpCircle className="w-4 h-4 text-amber-500" />
                        {showHint ? "Hide Hint" : "Get Hint"}
                      </button>

                      <button
                        type="button"
                        onClick={handleQuizSubmit}
                        disabled={!userAnswer || quizFeedback}
                        className={`px-8 py-3.5 rounded-2xl text-white text-xs font-black shadow transition-all flex items-center gap-2 active:scale-95 cursor-pointer ${
                          !userAnswer || quizFeedback
                            ? 'bg-slate-300 cursor-not-allowed shadow-none'
                            : 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/25 border-b-4 border-amber-600 active:border-b-0'
                        }`}
                      >
                        Check Answer <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Show Hint Text */}
                    {showHint && (
                      <div className="bg-amber-50 border border-dashed border-amber-200 rounded-2xl p-4 text-center max-w-md mx-auto animate-fade-in">
                        <p className="text-xs font-bold text-amber-800 leading-tight">
                          💡 Hint: {allPuzzles[currentQuizIndex]?.hint}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // Quiz Completed screen
              <div className="bg-white border border-slate-100 rounded-[40px] shadow-sm p-10 text-center space-y-6">
                <div className="w-24 h-24 bg-amber-100 rounded-full flex-center mx-auto text-5xl animate-bounce shadow">
                  🏆
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-800">Ultimate Math Wiz! 🎉</h3>
                  <p className="text-sm font-semibold text-slate-500">Amazing job! You solved all {allPuzzles.length} math puzzles successfully.</p>
                </div>

                <div className="max-w-sm mx-auto bg-amber-50/50 border border-amber-100 rounded-3xl p-6 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">XP Earned</span>
                    <span className="text-2xl font-black text-amber-600">+{allPuzzles.length * 10} XP</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Stars Collected</span>
                    <span className="text-2xl font-black text-amber-600">{allPuzzles.length} / {allPuzzles.length} ⭐</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 max-w-sm mx-auto pt-2">
                  <button
                    onClick={resetQuiz}
                    className="bg-amber-500 hover:bg-amber-400 text-white font-black px-8 py-4 rounded-3xl shadow-lg shadow-amber-500/20 transition-all border-b-4 border-amber-700 active:translate-y-0.5 active:border-b-0 cursor-pointer"
                  >
                    Play Again 🔄
                  </button>

                  <div className="w-full border-t border-slate-100 my-2" />

                  {/* AI Math Wizard on completion page */}
                  <div className="bg-gradient-to-r from-amber-50 via-orange-50/30 to-amber-50 border border-amber-100 rounded-[32px] p-6 text-center space-y-4 shadow-sm">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl">🧙‍♂️</span>
                      <h4 className="text-sm font-black text-slate-800">Math Wizard</h4>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500 leading-normal">
                      Want more challenge? Ask the wizard to create 5 new custom math puzzles of your favorite topic!
                    </p>
                    <div className="flex flex-col gap-2">
                      <select
                        value={puzzleTopic}
                        onChange={(e) => setPuzzleTopic(e.target.value)}
                        className="bg-white border border-amber-200 text-xs font-bold text-slate-700 rounded-xl px-3 py-2 w-full outline-none"
                      >
                        <option value="Addition">Addition ➕</option>
                        <option value="Subtraction">Subtraction ➖</option>
                        <option value="Multiplication">Multiplication ✖️</option>
                        <option value="Division">Division ➗</option>
                        <option value="Geometry">Geometry 🔺</option>
                        <option value="Patterns">Patterns 🔢</option>
                        <option value="Space Math">Space Math 🚀</option>
                        <option value="Word Problems">Word Problems 📝</option>
                      </select>
                      <button
                        onClick={handleGeneratePuzzles}
                        disabled={isGeneratingPuzzles}
                        className="bg-amber-500 hover:bg-amber-400 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md shadow-amber-500/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 w-full"
                      >
                        {isGeneratingPuzzles ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                        Generate +5 Puzzles
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== 4. EARN REWARDS ==================== */}
        {activeTab === 'Earn Rewards' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
              <div className="flex-1 space-y-2">
                <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">Badge Collection</span>
                <h3 className="text-xl font-black text-slate-800">Earn Stars & Medals!</h3>
                <p className="text-xs font-semibold text-slate-500">Read books, listen to narration, and solve math quizzes to earn stars. These stars boost your dashboard score and unlock cool pet companion frames!</p>
              </div>
              <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center shadow-lg">
                <Award className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Shelf Display */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-800">🏆 Your Library Trophies</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { title: "Book Worm 🐛", desc: "Read 1 complete story", completed: true, badge: "📚" },
                  { title: "Audio Listener 🎧", desc: "Listen to a full narrator story", completed: true, badge: "📢" },
                  { title: "Math Rookie 🧮", desc: "Solve 5 math puzzles", completed: earnedStars >= 5, badge: "➕" },
                  { title: "Grand Math Master 👑", desc: "Complete all 30 math puzzles", completed: isQuizCompleted, badge: "🎓" }
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className={`bg-white border border-slate-100 rounded-3xl p-6 text-center space-y-4 shadow-sm flex flex-col items-center justify-between border-b-4 ${
                      item.completed ? 'border-b-emerald-400' : 'border-b-slate-200 opacity-60'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${
                      item.completed ? 'bg-emerald-50' : 'bg-slate-50'
                    }`}>
                      {item.badge}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-800">{item.title}</h4>
                      <p className="text-[10px] font-semibold text-slate-400 leading-tight">{item.desc}</p>
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      item.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {item.completed ? "Unlocked" : "Locked"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* AI Story Writer Modal */}
      {showAiWriter && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-[36px] max-w-lg w-full p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => {
                setShowAiWriter(false);
                setAiError('');
              }}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 cursor-pointer"
            >
              ✕
            </button>
            <div className="space-y-2">
              <span className="bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">AI Writer Room 🪄</span>
              <h3 className="text-2xl font-black text-slate-800">Create a Magic Storybook</h3>
              <p className="text-xs font-semibold text-slate-400">Describe what you want the story to be about, and our AI will build a 3-page illustrated book for you!</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Choose Story Topic</label>
                <input 
                  type="text"
                  value={storyTopic}
                  onChange={(e) => setStoryTopic(e.target.value)}
                  placeholder="e.g. A tiny puppy that discovers a portal in the garden"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-orange-400 rounded-2xl px-4 py-3.5 text-sm font-semibold text-slate-700 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Choose Genre Theme</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { name: 'Adventure', icon: '🧭' },
                    { name: 'Fantasy', icon: '🦄' },
                    { name: 'Mystery', icon: '🔍' },
                    { name: 'Sci-Fi', icon: '🚀' }
                  ].map((g) => (
                    <button
                      key={g.name}
                      onClick={() => setStoryGenre(g.name)}
                      className={`py-3 px-2 rounded-xl text-xs font-black border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        storyGenre === g.name 
                          ? 'bg-orange-50 border-orange-300 text-orange-600 scale-102 shadow-sm' 
                          : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-lg">{g.icon}</span>
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>

              {aiError && (
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-xs font-bold text-rose-600 leading-normal">
                  ⚠️ {aiError}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAiWriter(false);
                  setAiError('');
                }}
                className="flex-1 border border-slate-200 text-slate-500 py-3.5 rounded-2xl text-xs font-black hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateStory}
                disabled={isGeneratingStory}
                className="flex-1 bg-gradient-to-r from-green-700 to-orange-650 hover:from-green-600 hover:to-orange-550 text-white py-3.5 rounded-2xl text-xs font-black shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGeneratingStory ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    Generate Story ✨
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
