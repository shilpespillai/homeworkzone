// ================================================================
//  LIBRARY STORIES & PUZZLES DATA
// ================================================================

// ═══════════════════════════════════════════════════════════════
//  ILLUSTRATED MULTI-PAGE STORIES DATABASE
// ═══════════════════════════════════════════════════════════════
export const STORIES = [
  {
    id: 'two_friends_one_heart',
    title: "Two Friends, One Heart",
    subtitle: "A story of friendship, kindness and togetherness",
    genre: "Human Friends",
    emoji: "🤝",
    isFeatured: true,
    isFlipbook: true,
    image: "/tfoh_page1.png",
    moral: "Good friends are like a strong bridge—they support each other and help others. Together, they build a better tomorrow. 🌿",
    summary: "In a small Indian village, two best friends Raju and Mohan work together to solve a village crisis when the water well dries up, demonstrating the true strength of friendship and teamwork.",
    vocabHighlights: [
      { word: "Togetherness", partOfSpeech: "Noun", definition: "The state of being close and united with others in friendship and harmony.", pronunciation: "tuh-geth-er-nis", fact: "Togetherness turns individual efforts into powerful community achievements." },
      { word: "Teamwork", partOfSpeech: "Noun", definition: "The combined effort of a group of people working together to achieve a shared goal.", pronunciation: "teem-wurk", fact: "As Raju and Mohan showed, teamwork makes even the hardest challenges possible!" },
      { word: "Friendship", partOfSpeech: "Noun", definition: "A close and caring relationship between people built on trust, respect, and kindness.", pronunciation: "frend-ship", fact: "True friendship gives you strength when facing difficult times." },
      { word: "Perseverance", partOfSpeech: "Noun", definition: "Continuing to try hard and work diligently despite difficulties or obstacles.", pronunciation: "pur-suh-veer-uhns", fact: "Raju and Mohan worked for many days without giving up until the water flowed back." },
      { word: "Community", partOfSpeech: "Noun", definition: "A group of people living together in a village or town who support each other.", pronunciation: "kuh-myoo-ni-tee", fact: "When one village member succeeds, the whole community celebrates!" }
    ],
    pages: [
      {
        pageNumber: 1,
        title: "Best Friends",
        text: "In a small Indian village, lived two best friends, Raju and Mohan. They did everything together — played, studied and helped everyone in the village. 'Together, we can do anything!' they would always say.",
        imageUrl: "/tfoh_page1.png"
      },
      {
        pageNumber: 2,
        title: "A Happy Life",
        text: "Every day, Raju and Mohan would run through the village, laugh with the elders, and help their neighbours. Whether it was carrying groceries or rolling a bicycle wheel together — they were always side by side, never apart.",
        imageUrl: "/tfoh_page2.png"
      },
      {
        pageNumber: 3,
        title: "A Big Problem!",
        text: "One day, the village faced a terrible problem. The well had dried up, and there was no water for anyone. The villagers were worried. Raju and Mohan looked at the empty, cracked well. 'We have to do something!' said Raju.",
        imageUrl: "/tfoh_page3.png"
      },
      {
        pageNumber: 4,
        title: "Working Together",
        text: "Raju had an idea, and Mohan supported him. They worked hard every day — dug, carried stones and cleared the path for water to flow. It was tiring work, but they never gave up. Teamwork makes everything possible!",
        imageUrl: "/two_friends_one_heart.png",
        cropStyle: { objectPosition: '75% 37%', objectFit: 'cover', height: '420px' }
      },
      {
        pageNumber: 5,
        title: "Water Flows Again!",
        text: "After many days of hard work, water finally flowed back to the village! Everyone was happy and thanked the two friends. The children splashed in joy, the women filled their pots, and the whole village celebrated Raju and Mohan!",
        imageUrl: "/two_friends_one_heart.png",
        cropStyle: { objectPosition: '25% 68%', objectFit: 'cover', height: '420px' }
      },
      {
        pageNumber: 6,
        title: "Friendship is the Greatest Strength",
        text: "That evening, as the sun set, Raju said, 'I'm glad we did this together.' Mohan smiled, 'Yes, friendship is the greatest strength.' From that day on, Raju and Mohan became a true example for the whole village — proving that with friendship, kindness and teamwork, even the biggest problems can be solved. MORAL: Good friends are like a strong bridge — they support each other and help others.",
        imageUrl: "/two_friends_one_heart.png",
        cropStyle: { objectPosition: '75% 68%', objectFit: 'cover', height: '420px' }
      }
    ],
    comprehensionQuestions: [
      {
        id: 1,
        question: "Who were the two best friends in the small Indian village?",
        options: ["Raju and Mohan", "Amit and Rahul", "Karan and Vikram", "Deepak and Suresh"],
        answer: "Raju and Mohan",
        explanation: "The story introduces Raju and Mohan as two best friends living in the small Indian village."
      },
      {
        id: 2,
        question: "What major problem did the village face?",
        options: ["The water well dried up", "A storm destroyed the bridge", "The crops caught fire", "The farm animals escaped"],
        answer: "The water well dried up",
        explanation: "One day the village well dried up, leaving everyone without fresh water."
      },
      {
        id: 3,
        question: "How did Raju and Mohan solve the water crisis?",
        options: ["By working hard together to clear stones and dig a water path", "By moving to another village", "By waiting for rain", "By doing nothing"],
        answer: "By working hard together to clear stones and dig a water path",
        explanation: "Raju had an idea, and together they dug, carried stones, and cleared the path so water flowed back to the village."
      }
    ]
  },
  {
    id: 'lion_and_the_mouse',
    title: "The Lion and The Mouse",
    subtitle: "A classic fable of kindness, mercy and unexpected help",
    genre: "Fable & Animal",
    emoji: "🦁",
    isFeatured: true,
    isSingleComicSheet: true,
    image: "/lion_and_the_mouse.png",
    moral: "No act of kindness is ever too small. Even a tiny friend can render great help. 🍃",
    summary: "When a mighty lion spares a small mouse's life, the mouse promises to return the favor. Days later, when the lion gets trapped in a hunter's net, the tiny mouse keeps his promise and chews through the ropes!",
    vocabHighlights: [
      { word: "Mighty", partOfSpeech: "Adjective", definition: "Possessing immense power, size, or physical strength.", pronunciation: "my-tee", fact: "Lions are known as the kings of the jungle because of their mighty roar!" },
      { word: "Amused", partOfSpeech: "Adjective", definition: "Finding something funny, entertaining, or pleasantly humorous.", pronunciation: "uh-myoozd", fact: "The lion was amused when the tiny mouse offered to help him one day!" },
      { word: "Struggled", partOfSpeech: "Verb", definition: "Made strenuous or forceful efforts to get free from constraint or difficulty.", pronunciation: "struhg-uld", fact: "When caught in the net, the lion struggled, but sharp teeth were needed, not muscle!" },
      { word: "Grateful", partOfSpeech: "Adjective", definition: "Feeling or showing appreciation and thankfulness for kindness received.", pronunciation: "grayt-fuhl", fact: "A grateful heart remembers every small act of help." },
      { word: "Kindness", partOfSpeech: "Noun", definition: "The quality of being friendly, generous, and considerate to others.", pronunciation: "kynd-nis", fact: "Kindness is a universal language that animals and humans both understand!" }
    ],
    pages: [
      {
        pageNumber: 1,
        text: "Once upon a time, in a green forest, a mighty lion was sleeping under a big tree. A little mouse came running across him. The lion woke up angrily and caught the mouse in his huge paw. 'Please don't eat me!' begged the mouse. 'I may be small, but one day I might be able to help you.' The lion laughed, but he felt amused by the mouse and let him go. 'And remember, I have spared your life.' Some days later, the lion was caught in a hunter's net. He roared and struggled, but the net was very strong. Just then, the little mouse arrived! He quickly climbed up the net and began to chew the ropes with his sharp teeth. Soon, the ropes became loose and the lion was free! He thanked the mouse with a grateful heart. From that day on, the lion and the mouse became the best of friends. MORAL: No act of kindness is ever too small.",
        imageUrl: "/lion_and_the_mouse.png"
      }
    ]
  },
  {
    id: 'tortoise_and_the_hare',
    title: "The Tortoise and the Hare",
    subtitle: "A story about patience, humility and never giving up",
    genre: "Classic Fable",
    emoji: "🐢",
    isFeatured: true,
    isSingleComicSheet: true,
    image: "/tortoise_and_the_hare.png",
    moral: "Slow and steady wins the race. Believe in yourself and never give up! 🏆",
    summary: "A boastful hare challenges a slow tortoise to a race. Confident of an easy victory, the hare takes a nap under a tree mid-race. Meanwhile, the steady tortoise keeps walking step by step without stopping and crosses the finish line first!",
    vocabHighlights: [
      { word: "Bragging", partOfSpeech: "Verb", definition: "Talking with excessive pride and self-satisfaction about one's abilities or speed.", pronunciation: "brag-ing", fact: "Humility is always more respected by friends than bragging!" },
      { word: "Overconfident", partOfSpeech: "Adjective", definition: "Excessively sure of oneself or one's victory, leading to careless mistakes.", pronunciation: "oh-vur-kon-fi-duhnt", fact: "Overconfidence made the fast hare sleep during the race!" },
      { word: "Perseverance", partOfSpeech: "Noun", definition: "Persistence in doing something despite difficulty or delay in achieving success.", pronunciation: "pur-suh-veer-uhns", fact: "The tortoise kept moving step by step without stopping until he won!" },
      { word: "Steady", partOfSpeech: "Adjective", definition: "Firmly fixed, constant, and unhurried in movement or effort.", pronunciation: "sted-ee", fact: "Being steady helps you achieve long and big goals!" },
      { word: "Victory", partOfSpeech: "Noun", definition: "An act of defeating an opponent or achieving success in a competition or race.", pronunciation: "vik-tuh-ree", fact: "All the forest animals cheered loudly for the tortoise's historic victory!" }
    ],
    pages: [
      {
        pageNumber: 1,
        text: "In a sunny meadow, a hare was bragging about how fast he could run. 'Look at me! Nothing can beat me in a race!' A tortoise nearby smiled and said, 'I may be slow, but I would like to race you.' The hare laughed loudly. 'That will be the easiest race ever!' The hare ran as fast as the wind and soon disappeared in the distance. Thinking he had plenty of time, the hare decided to take a nap under a tree. 'I'll just rest a little,' he said. Meanwhile, the tortoise kept moving. Step by step, slow and steady, he never stopped. He didn't hurry, he didn't stop. He just kept going towards the finish line. The hare woke up suddenly. 'Oh no! I overslept!' He ran as fast as he could, but when he reached the finish line, the tortoise was already there! The animals cheered for the tortoise. The hare bowed his head and said, 'I was too proud. You taught me an important lesson.' From that day on, the hare and the tortoise became good friends. MORAL: Slow and steady wins the race. Never give up!",
        imageUrl: "/tortoise_and_the_hare.png"
      }
    ]
  },
  {
    id: 'dog_and_his_reflection',
    title: "The Dog and His Reflection",
    subtitle: "A story about greed and gratitude",
    genre: "Classic Fable",
    emoji: "🐶",
    isFeatured: true,
    isSingleComicSheet: true,
    image: "/dog_and_his_reflection.png",
    moral: "If you are greedy, you may lose what you already have. Be grateful for what is yours. 🦴",
    summary: "One morning, a cheerful dog found a large, juicy bone. While crossing a wooden bridge over a stream, he saw his own reflection in the clear water and thought it was another dog with a bigger bone. When he opened his mouth to bark, his bone dropped into the water and sank out of sight!",
    vocabHighlights: [
      { word: "Reflection", partOfSpeech: "Noun", definition: "An image or likeness seen in a mirror or in clear, still water.", pronunciation: "rih-flek-shun", fact: "The dog saw his own reflection in the clear stream, but thought it was a rival dog!" },
      { word: "Grateful", partOfSpeech: "Adjective", definition: "Feeling or showing appreciation and thankfulness for what one already has.", pronunciation: "grayt-fuhl", fact: "Being grateful for what you have protects you from the traps of greed." },
      { word: "Greedy", partOfSpeech: "Adjective", definition: "Having an excessive or selfish desire for more than one needs or possesses.", pronunciation: "gree-dee", fact: "The greedy dog wanted both bones, but ended up losing the only one he had!" },
      { word: "Ashamed", partOfSpeech: "Adjective", definition: "Feeling guilty, embarrassed, or remorseful over a foolish or wrong action.", pronunciation: "uh-shaymd", fact: "The dog walked home hungry and ashamed after realizing his foolish mistake." },
      { word: "Vanished", partOfSpeech: "Verb", definition: "Disappeared suddenly or ceased to be visible.", pronunciation: "van-isht", fact: "When the water rippled, the dog's reflection vanished instantly!" }
    ],
    pages: [
      {
        pageNumber: 1,
        title: "A Wonderful Treat",
        text: "One morning, a cheerful dog found a large, juicy bone. 'What a wonderful treat!' he thought happily as he wagged his tail.",
        imageUrl: "/dog_and_his_reflection.png"
      },
      {
        pageNumber: 2,
        title: "Carrying It Home",
        text: "He proudly carried the bone home in his mouth. 'I will enjoy this all by myself!' he promised himself.",
        imageUrl: "/dog_and_his_reflection.png"
      },
      {
        pageNumber: 3,
        title: "The Wooden Bridge",
        text: "On the way, the dog reached a narrow wooden bridge over a stream. 'I must cross carefully,' he thought, stepping onto the planks.",
        imageUrl: "/dog_and_his_reflection.png"
      },
      {
        pageNumber: 4,
        title: "Looking Below",
        text: "Halfway across, he looked down into the clear water. 'What is that below me?' he wondered.",
        imageUrl: "/dog_and_his_reflection.png"
      },
      {
        pageNumber: 5,
        title: "Another Dog?",
        text: "He saw his own reflection, but thought it was another dog. 'That dog has a bone too!' he said to himself.",
        imageUrl: "/dog_and_his_reflection.png"
      },
      {
        pageNumber: 6,
        title: "A Greedy Wish",
        text: "To the greedy dog, the reflected bone looked even bigger. 'I want that bigger bone!' he thought eagerly.",
        imageUrl: "/dog_and_his_reflection.png"
      },
      {
        pageNumber: 7,
        title: "Growling in the Water",
        text: "He growled at the dog in the water. The reflection growled back. 'Give me your bone!' he snapped.",
        imageUrl: "/dog_and_his_reflection.png"
      },
      {
        pageNumber: 8,
        title: "WOOF!",
        text: "The dog opened his mouth to bark. 'WOOF!' In that very moment, his bone slipped from his jaws.",
        imageUrl: "/dog_and_his_reflection.png"
      },
      {
        pageNumber: 9,
        title: "SPLASH!",
        text: "SPLASH! The bone fell into the stream and sank out of sight. 'Oh no! My bone!' cried the dog in shock.",
        imageUrl: "/dog_and_his_reflection.png"
      },
      {
        pageNumber: 10,
        title: "A Hard Lesson",
        text: "The reflection vanished, and the dog walked home hungry and ashamed. 'I lost what I had because I wanted more.' MORAL: If you are greedy, you may lose what you already have. Be grateful for what is yours.",
        imageUrl: "/dog_and_his_reflection.png"
      }
    ],
    comprehensionQuestions: [
      {
        id: 1,
        question: "What did the cheerful dog find one morning?",
        options: ["A large, juicy bone", "A shiny ball", "A bag of coins", "A delicious fish"],
        answer: "A large, juicy bone",
        explanation: "One morning, the dog found a large, juicy bone and proudly carried it home in his mouth."
      },
      {
        id: 2,
        question: "What did the dog see in the stream while crossing the wooden bridge?",
        options: ["His own reflection in the clear water", "A swimming fish", "A fierce crocodile", "Another real dog"],
        answer: "His own reflection in the clear water",
        explanation: "The dog looked down into the clear water and saw his own reflection, but mistook it for another dog with a bone."
      },
      {
        id: 3,
        question: "Why did the dog lose his bone?",
        options: ["He opened his mouth to bark greedily at his reflection", "A bird snatched it away", "He dropped it in the mud", "He buried it in the forest"],
        answer: "He opened his mouth to bark greedily at his reflection",
        explanation: "When the dog opened his mouth to bark and demand the other dog's bone, his own bone slipped from his jaws and sank into the stream."
      }
    ]
  },
  {
    id: 'hare_and_the_hound',
    title: "The Hare and the Hound",
    subtitle: "A story about effort and motivation",
    genre: "Classic Fable",
    emoji: "🐇",
    isFeatured: true,
    isSingleComicSheet: true,
    image: "/hare_and_the_hound.png",
    moral: "Strong motivation can overcome greater strength. We try hardest when something truly matters. 🌾",
    summary: "When a swift hunting hound spots a young hare on a sunny hillside, an intense chase begins across the meadow and up a steep hill. Despite the hound's superior strength and speed, the hare gathers every ounce of energy and escapes. When an old shepherd asks why the stronger hound gave up, the hound wisely replies: 'I was running for my dinner. The hare was running for his life!'",
    vocabHighlights: [
      { word: "Motivation", partOfSpeech: "Noun", definition: "The reason, desire, or driving force behind someone's effort and actions.", pronunciation: "moh-tuh-vay-shun", fact: "The hare had the greatest motivation of all — protecting his own life!" },
      { word: "Exhausted", partOfSpeech: "Adjective", definition: "Completely drained of physical energy and strength; extremely tired.", pronunciation: "ig-zaw-stid", fact: "After running up the steep hill, the hound was exhausted and could not take another step." },
      { word: "Startled", partOfSpeech: "Adjective", definition: "Sudden feeling of surprise, alarm, or shock.", pronunciation: "star-tulld", fact: "The startled hare sprang into action the moment he heard the hound's footsteps!" },
      { word: "Determination", partOfSpeech: "Noun", definition: "Firmness of purpose and resolve to achieve a difficult goal without giving up.", pronunciation: "dih-tur-muh-nay-shun", fact: "With pure determination, the hare leapt over rocks and pushed past his limits." },
      { word: "Perseverance", partOfSpeech: "Noun", definition: "Continued effort to accomplish something despite difficulty or exhaustion.", pronunciation: "pur-suh-veer-uhns", fact: "The hare's perseverance enabled him to reach the safety of the hilltop." }
    ],
    pages: [
      {
        pageNumber: 1,
        title: "A Peaceful Morning",
        text: "One peaceful morning, a young hare nibbled grass on a sunny hillside. 'What a lovely morning!' he thought contentedly.",
        imageUrl: "/hare_and_the_hound.png"
      },
      {
        pageNumber: 2,
        title: "Spotted Across the Meadow",
        text: "A hunting hound spotted the hare from across the meadow. 'There is my dinner!' the hound barked excitedly.",
        imageUrl: "/hare_and_the_hound.png"
      },
      {
        pageNumber: 3,
        title: "The Chase Begins",
        text: "The hound charged forward with a mighty WHOOSH, and the startled hare raced away. 'I must escape!' the hare cried.",
        imageUrl: "/hare_and_the_hound.png"
      },
      {
        pageNumber: 4,
        title: "Gaining Ground",
        text: "The powerful hound quickly began to gain on the hare. 'You cannot outrun me!' shouted the hound as his paws pounded the dirt.",
        imageUrl: "/hare_and_the_hound.png"
      },
      {
        pageNumber: 5,
        title: "Darting Through Bushes",
        text: "The frightened hare darted between bushes and leapt over sharp stones. 'My life depends on this!' the hare said with all his heart.",
        imageUrl: "/hare_and_the_hound.png"
      },
      {
        pageNumber: 6,
        title: "Up the Steep Hill",
        text: "The chase continued up a steep and winding hill. 'I am getting tired!' panted the hound. 'Keep running!' whispered the hare to himself.",
        imageUrl: "/hare_and_the_hound.png"
      },
      {
        pageNumber: 7,
        title: "One Final Burst",
        text: "The hare gathered every bit of strength for one final burst of speed. 'I will not give up!' he declared as he soared up the slope.",
        imageUrl: "/hare_and_the_hound.png"
      },
      {
        pageNumber: 8,
        title: "The Hound Stops",
        text: "The exhausted hound slowed down and finally stopped on the path. 'I cannot run another step!' he gasped, out of breath.",
        imageUrl: "/hare_and_the_hound.png"
      },
      {
        pageNumber: 9,
        title: "The Shepherd's Question",
        text: "A shepherd had watched the chase from beside the path. 'You are stronger and faster, yet the hare escaped!' said the shepherd.",
        imageUrl: "/hare_and_the_hound.png"
      },
      {
        pageNumber: 10,
        title: "The Power of Motivation",
        text: "The hound looked at the shepherd and explained the difference: 'I was running for my dinner. The hare was running for his life!' MORAL: Strong motivation can overcome greater strength. We try hardest when something truly matters.",
        imageUrl: "/hare_and_the_hound.png"
      }
    ],
    comprehensionQuestions: [
      {
        id: 1,
        question: "Why was the hunting hound chasing the young hare?",
        options: ["He wanted the hare for his dinner", "To play a game of tag", "To guide the hare home", "To show off to the shepherd"],
        answer: "He wanted the hare for his dinner",
        explanation: "The hound spotted the hare across the meadow and thought: 'There is my dinner!'"
      },
      {
        id: 2,
        question: "How was the smaller hare able to escape the bigger and faster hound?",
        options: ["The hare ran with all his strength because his life depended on it", "The hound fell into a river", "The shepherd caught the hound", "The hare hid inside a cave"],
        answer: "The hare ran with all his strength because his life depended on it",
        explanation: "The hare gave every ounce of energy and determination because he was running for his life."
      },
      {
        id: 3,
        question: "What did the hound tell the shepherd at the end of the chase?",
        options: ["'I was running for my dinner. The hare was running for his life!'", "'I let the hare win on purpose'", "'The hill was too cold for me'", "'I was not hungry after all'"],
        answer: "'I was running for my dinner. The hare was running for his life!'",
        explanation: "The hound explained that the hare's motivation to survive was much greater than his motivation for a meal."
      }
    ]
  },
  {
    id: 'fox_and_the_grapes',
    title: "The Fox and the Grapes",
    subtitle: "A story about disappointment and excuses",
    genre: "Classic Fable",
    emoji: "🦊",
    isFeatured: true,
    isSingleComicSheet: true,
    image: "/fox_and_the_grapes.png",
    moral: "It is easy to dislike what we cannot have. A wise person accepts disappointment honestly instead of making excuses. 🍇",
    summary: "On a sunny afternoon, a hungry fox wanders through the countryside and spots bunches of ripe, purple grapes hanging high above him. He tries jumping with all his might, and even rolls a stone beneath the vine to stand on, but the grapes remain just out of reach. Exhausted and embarrassed, the fox walks away pretending: 'They are probably sour anyway!'",
    vocabHighlights: [
      { word: "Disappointment", partOfSpeech: "Noun", definition: "The feeling of sadness or displeasure caused by the non-fulfillment of one's hopes or expectations.", pronunciation: "dis-uh-point-muhnt", fact: "Learning to handle disappointment with honesty is a sign of true maturity." },
      { word: "Excuses", partOfSpeech: "Noun", definition: "Reasons or explanations given to justify a fault, failure, or shortcoming.", pronunciation: "ik-skyoo-siz", fact: "Instead of making excuses about sour grapes, admitting defeat helps you grow!" },
      { word: "Tempting", partOfSpeech: "Adjective", definition: "Appealing, attractive, or inviting, making one want to have or enjoy it.", pronunciation: "temp-ting", fact: "The juicy purple grapes looked so tempting to the hungry fox!" },
      { word: "Exhausted", partOfSpeech: "Adjective", definition: "Completely drained of physical energy and strength; extremely weary.", pronunciation: "ig-zaw-stid", fact: "After jumping over and over again, the fox sat beneath the vine completely exhausted." },
      { word: "Sour", partOfSpeech: "Adjective", definition: "Having an acid, tart taste like lemon or vinegar; unpleasant.", pronunciation: "sow-er", fact: "The phrase 'sour grapes' comes directly from this famous Aesop fable!" }
    ],
    pages: [
      {
        pageNumber: 1,
        title: "A Hungry Afternoon",
        text: "One sunny afternoon, a hungry fox wandered through the countryside. 'I must find something tasty!' he said to himself.",
        imageUrl: "/fox_and_the_grapes.png"
      },
      {
        pageNumber: 2,
        title: "Ripe Purple Grapes",
        text: "He spotted ripe purple grapes hanging high above him on a leafy vine. 'Those grapes look sweet and juicy!' he thought eagerly.",
        imageUrl: "/fox_and_the_grapes.png"
      },
      {
        pageNumber: 3,
        title: "The First Leap",
        text: "The fox ran and made his first leap. His jaws snapped shut on empty air. 'Almost!' he puffed, landing back on his paws.",
        imageUrl: "/fox_and_the_grapes.png"
      },
      {
        pageNumber: 4,
        title: "Jumping Higher",
        text: "He tried again, jumping even higher toward the vine. 'I can reach them this time!' he cheered as he soared into the air.",
        imageUrl: "/fox_and_the_grapes.png"
      },
      {
        pageNumber: 5,
        title: "The Clever Stone Plan",
        text: "The fox rolled a large stone beneath the vine and climbed carefully on top. 'This clever plan will work!' he grinned proudly.",
        imageUrl: "/fox_and_the_grapes.png"
      },
      {
        pageNumber: 6,
        title: "THUMP!",
        text: "His paws slipped on the mossy rock, and he tumbled safely into the soft grass with a loud THUMP! 'Oof!' groaned the fox.",
        imageUrl: "/fox_and_the_grapes.png"
      },
      {
        pageNumber: 7,
        title: "One Final Jump",
        text: "He gathered all his strength for one enormous final jump. 'One last try!' he shouted, springing high into the sky.",
        imageUrl: "/fox_and_the_grapes.png"
      },
      {
        pageNumber: 8,
        title: "Out of Breath",
        text: "The exhausted fox sat beneath the vine, panting with his tongue out. 'Why can't I reach them?' he sighed.",
        imageUrl: "/fox_and_the_grapes.png"
      },
      {
        pageNumber: 9,
        title: "Making Excuses",
        text: "Too embarrassed to admit defeat, he lifted his nose proudly into the air: 'I didn't want them anyway. They are probably sour!'",
        imageUrl: "/fox_and_the_grapes.png"
      },
      {
        pageNumber: 10,
        title: "The Lesson of Sour Grapes",
        text: "The fox walked away into the sunset, but the grapes were truly ripe and sweet. He only called them sour because he could not reach them. MORAL: It is easy to dislike what we cannot have. A wise person accepts disappointment honestly instead of making excuses.",
        imageUrl: "/fox_and_the_grapes.png"
      }
    ],
    comprehensionQuestions: [
      {
        id: 1,
        question: "What did the hungry fox spot hanging high on the vine?",
        options: ["Ripe, sweet purple grapes", "Bright red apples", "Golden yellow bananas", "Juicy green pears"],
        answer: "Ripe, sweet purple grapes",
        explanation: "The fox spotted a tempting bunch of ripe purple grapes hanging high in the countryside."
      },
      {
        id: 2,
        question: "What clever idea did the fox try to get closer to the grapes?",
        options: ["He rolled a stone beneath the vine to stand on", "He climbed a nearby ladder", "He asked a bird for help", "He threw a stick at the vine"],
        answer: "He rolled a stone beneath the vine to stand on",
        explanation: "The fox rolled a stone under the vine and climbed on top to jump from a higher point."
      },
      {
        id: 3,
        question: "Why did the fox say the grapes were 'probably sour'?",
        options: ["He was embarrassed that he could not reach them and made an excuse", "He tasted one and it was bitter", "A bird told him they were spoiled", "He prefers salty food"],
        answer: "He was embarrassed that he could not reach them and made an excuse",
        explanation: "The fox was too proud to admit defeat, so he made the excuse that the grapes were sour anyway."
      }
    ]
  },
  {
    id: 'honest_woodcutter',
    title: "The Honest Woodcutter",
    subtitle: "A story about honesty and reward",
    genre: "Classic Fable",
    emoji: "🪓",
    isFeatured: true,
    isSingleComicSheet: true,
    image: "/honest_woodcutter.png",
    moral: "Honesty is always the best policy. Truthfulness earns trust and lasting rewards. 🪵",
    summary: "A poor woodcutter accidentally drops his iron axe into a deep river. A magical water spirit appears and tests his integrity by offering him a golden axe, then a silver axe. The woodcutter honestly refuses both, claiming only his humble iron axe. Impressed by his truthfulness, the spirit rewards him with all three axes!",
    vocabHighlights: [
      { word: "Honesty", partOfSpeech: "Noun", definition: "The quality of being fair, truthful, and morally upright without cheating or lying.", pronunciation: "on-uh-stee", fact: "Honesty builds lasting trust that no amount of gold can buy!" },
      { word: "Magnificent", partOfSpeech: "Adjective", definition: "Extremely beautiful, elaborate, or impressive in appearance.", pronunciation: "mag-nif-uh-suhnt", fact: "The golden axe sparkled with magnificent light beneath the water." },
      { word: "Refused", partOfSpeech: "Verb", definition: "Indicated unwillingness to accept, take, or agree to something.", pronunciation: "rih-fyoozd", fact: "The woodcutter refused the gold axe because it did not belong to him." },
      { word: "Praised", partOfSpeech: "Verb", definition: "Expressed warm approval, admiration, or commendation for someone's good deeds.", pronunciation: "prayzd", fact: "The river spirit praised the woodcutter for his unwavering truthfulness." },
      { word: "Truthfulness", partOfSpeech: "Noun", definition: "The practice or habit of telling the truth and being authentic.", pronunciation: "trooth-fuhl-nis", fact: "Truthfulness brings peace of mind and unexpected blessings!" }
    ],
    pages: [
      {
        pageNumber: 1,
        title: "Working by the River",
        text: "A poor but honest woodcutter worked beside a deep river. 'I must finish my work before sunset,' he thought as he chopped the wood.",
        imageUrl: "/honest_woodcutter.png"
      },
      {
        pageNumber: 2,
        title: "The Axe Falls In",
        text: "Suddenly, his iron axe slipped from his hands and fell into the water with a loud SPLASH! 'Oh no! My only axe!' he cried in despair.",
        imageUrl: "/honest_woodcutter.png"
      },
      {
        pageNumber: 3,
        title: "The Magical River Spirit",
        text: "The woodcutter sat sadly by the river. A magical glowing river spirit appeared and asked, 'Why are you crying?' The woodcutter replied, 'My axe fell into the river.'",
        imageUrl: "/honest_woodcutter.png"
      },
      {
        pageNumber: 4,
        title: "The Golden Axe",
        text: "The river spirit dived into the water and returned holding a magnificent golden axe. 'Is this golden axe yours?' she asked. 'No. That is not mine,' the woodcutter replied honestly.",
        imageUrl: "/honest_woodcutter.png"
      },
      {
        pageNumber: 5,
        title: "The Silver Axe",
        text: "Next, the river spirit brought up a shining silver axe from the riverbed. 'Is this silver axe yours?' she asked. 'No. That is not mine either,' said the woodcutter.",
        imageUrl: "/honest_woodcutter.png"
      },
      {
        pageNumber: 6,
        title: "The Iron Axe",
        text: "Finally, the spirit raised an ordinary iron axe from the water. The woodcutter's eyes lit up with joy: 'Yes! That is my axe!'",
        imageUrl: "/honest_woodcutter.png"
      },
      {
        pageNumber: 7,
        title: "Impressed by Honesty",
        text: "The river spirit was deeply impressed by the woodcutter's honesty. 'You refused gold and silver. Why?' she asked. 'Because they did not belong to me,' he answered.",
        imageUrl: "/honest_woodcutter.png"
      },
      {
        pageNumber: 8,
        title: "A Deserved Reward",
        text: "The spirit smiled warmly and praised the truthful woodcutter: 'Your honesty deserves a great reward.'",
        imageUrl: "/honest_woodcutter.png"
      },
      {
        pageNumber: 9,
        title: "All Three Axes",
        text: "The spirit gifted him the golden, silver, and iron axes: 'Keep all three axes.' The woodcutter beamed: 'Thank you! I will always be honest.'",
        imageUrl: "/honest_woodcutter.png"
      },
      {
        pageNumber: 10,
        title: "Returning Home with Joy",
        text: "The grateful woodcutter returned home with joy and peace in his heart. His honesty brought him an unexpected reward. MORAL: Honesty is always the best policy. Truthfulness earns trust and lasting rewards.",
        imageUrl: "/honest_woodcutter.png"
      }
    ],
    comprehensionQuestions: [
      {
        id: 1,
        question: "What happened when the woodcutter was chopping wood beside the river?",
        options: ["His only iron axe slipped from his hands and fell into the water", "He broke his wooden cart", "He found a hidden treasure chest", "A storm began to blow"],
        answer: "His only iron axe slipped from his hands and fell into the water",
        explanation: "The woodcutter's iron axe slipped from his hands and fell into the deep river."
      },
      {
        id: 2,
        question: "Why did the woodcutter refuse the golden and silver axes?",
        options: ["Because they did not belong to him", "He thought they were too heavy", "He did not like shiny metals", "He was afraid of the spirit"],
        answer: "Because they did not belong to him",
        explanation: "The honest woodcutter refused the golden and silver axes because he only wanted what was rightfully his."
      },
      {
        id: 3,
        question: "How did the river spirit reward the woodcutter's truthfulness?",
        options: ["She gave him all three axes: gold, silver, and iron", "She built him a new house", "She gave him a bag of magical seeds", "She turned him into a prince"],
        answer: "She gave him all three axes: gold, silver, and iron",
        explanation: "Because of his honesty, the river spirit rewarded him with the gold axe, silver axe, and his own iron axe."
      }
    ]
  },
  {
    id: 'monkey_and_the_crocodile',
    title: "The Monkey and the Crocodile",
    subtitle: "A story about clever thinking and friendship",
    genre: "Classic Fable",
    emoji: "🐒",
    isFeatured: true,
    isSingleComicSheet: true,
    image: "/monkey_and_the_crocodile.png",
    moral: "Quick thinking can save us from danger. Choose your friends wisely. 🥭",
    summary: "A generous monkey lives in a fruit tree by a wide river and shares sweet berries with a crocodile every day. But when the crocodile's greedy wife demands to eat the monkey's heart, the crocodile tries to trap his friend mid-river. Using his calm wits and quick thinking, the monkey convinces the crocodile that his heart is safely stored back in the tree, escaping unharmed!",
    vocabHighlights: [
      { word: "Clever", partOfSpeech: "Adjective", definition: "Quick to understand, learn, and devise ingenious solutions to problems.", pronunciation: "klev-er", fact: "The clever monkey thought of a brilliant excuse in just seconds!" },
      { word: "Generous", partOfSpeech: "Adjective", definition: "Showing a readiness to give more of something, like food or kindness, than is necessary.", pronunciation: "jen-er-uhs", fact: "The monkey was generous and happily shared his fruit with the crocodile every day." },
      { word: "Betrayal", partOfSpeech: "Noun", definition: "The act of being disloyal or breaking trust with a friend or group.", pronunciation: "bih-tray-uhl", fact: "The crocodile's betrayal broke the friendship forever." },
      { word: "Presence of Mind", partOfSpeech: "Noun", definition: "The ability to remain calm, think clearly, and act sensibly in a sudden crisis or danger.", pronunciation: "prez-uhns uv mynd", fact: "Having presence of mind allowed the monkey to stay calm and save his life." },
      { word: "Foolish", partOfSpeech: "Adjective", definition: "Lacking good sense or judgment; unwise and easily tricked.", pronunciation: "foo-lish", fact: "The foolish crocodile realized too late that nobody can leave their heart behind!" }
    ],
    pages: [
      {
        pageNumber: 1,
        title: "The Fruit Tree",
        text: "A clever monkey lived in a lush fruit tree beside a wide, sparkling river. 'These fruits are delicious!' he thought as he picked a sweet berry.",
        imageUrl: "/monkey_and_the_crocodile.png"
      },
      {
        pageNumber: 2,
        title: "A Tired Visitor",
        text: "One day, a tired crocodile rested beneath the tree. The monkey called down, 'Would you like some fruit?' The crocodile smiled: 'Yes, please!'",
        imageUrl: "/monkey_and_the_crocodile.png"
      },
      {
        pageNumber: 3,
        title: "A Growing Friendship",
        text: "The monkey shared fruit every day, and they became good friends. 'Thank you, my friend!' said the crocodile. 'You are always welcome!' replied the monkey.",
        imageUrl: "/monkey_and_the_crocodile.png"
      },
      {
        pageNumber: 4,
        title: "Sharing with His Wife",
        text: "The crocodile took some sweet fruit home across the river to his wife. 'My monkey friend gave them to me,' he explained. 'These fruits taste wonderful!' she beamed.",
        imageUrl: "/monkey_and_the_crocodile.png"
      },
      {
        pageNumber: 5,
        title: "A Greedy Demand",
        text: "The greedy wife imagined that the monkey's heart must taste even sweeter: 'Bring me the monkey's heart!' The crocodile gasped: 'But he is my friend!'",
        imageUrl: "/monkey_and_the_crocodile.png"
      },
      {
        pageNumber: 6,
        title: "An Invitation",
        text: "Sadly, the crocodile returned and invited the monkey to visit his home: 'Climb onto my back. I will carry you across.' The monkey cheered: 'What a kind invitation!'",
        imageUrl: "/monkey_and_the_crocodile.png"
      },
      {
        pageNumber: 7,
        title: "The Truth Revealed",
        text: "In the middle of the deep river, the crocodile revealed the truth: 'My wife wants your heart!' The monkey was shocked: 'My heart?'",
        imageUrl: "/monkey_and_the_crocodile.png"
      },
      {
        pageNumber: 8,
        title: "A Clever Plan",
        text: "The frightened monkey stayed calm and quickly formed a clever plan: 'I left my heart in the tree branches. Take me back to get it!'",
        imageUrl: "/monkey_and_the_crocodile.png"
      },
      {
        pageNumber: 9,
        title: "Leaping to Safety",
        text: "The foolish crocodile swam back to the shore. With a mighty BOING, the monkey leapt safely high into the fruit tree: 'I am safe!'",
        imageUrl: "/monkey_and_the_crocodile.png"
      },
      {
        pageNumber: 10,
        title: "The Lesson",
        text: "From a high branch, the monkey told the crocodile the truth: 'No one can leave their heart behind!' The crocodile hung his head: 'I have been foolish.' MORAL: Quick thinking can save us from danger. Choose your friends wisely.",
        imageUrl: "/monkey_and_the_crocodile.png"
      }
    ],
    comprehensionQuestions: [
      {
        id: 1,
        question: "How did the monkey and the crocodile become friends at the start of the story?",
        options: ["The monkey shared delicious fruit with the crocodile every day", "They raced each other across the river", "They built a raft together", "The crocodile saved the monkey from a snake"],
        answer: "The monkey shared delicious fruit with the crocodile every day",
        explanation: "The generous monkey dropped sweet fruit from his tree to the resting crocodile every day."
      },
      {
        id: 2,
        question: "How did the monkey escape when the crocodile revealed the truth mid-river?",
        options: ["He tricked the crocodile into thinking he had left his heart in the tree", "He jumped off and swam to shore", "A giant bird picked him up", "He threw fruit at the crocodile"],
        answer: "He tricked the crocodile into thinking he had left his heart in the tree",
        explanation: "Using his quick wits, the monkey convinced the crocodile that monkeys keep their hearts safely stored on tree branches."
      },
      {
        id: 3,
        question: "What is the moral of 'The Monkey and the Crocodile'?",
        options: ["Quick thinking can save us from danger; choose your friends wisely", "Always swim in shallow water", "Never share food with animals", "Trees are safer than rivers"],
        answer: "Quick thinking can save us from danger; choose your friends wisely",
        explanation: "The story teaches us to stay calm and use quick thinking in danger, and to be careful whom we trust as friends."
      }
    ]
  },
  {
    id: 'clever_rabbit_and_the_lion',
    title: "The Clever Rabbit and the Lion",
    subtitle: "A story about intelligence and courage",
    genre: "Classic Fable",
    emoji: "🐰",
    isFeatured: true,
    isSingleComicSheet: true,
    image: "/clever_rabbit_and_the_lion.png",
    moral: "Intelligence can overcome great strength. Think calmly before you act. 🧠",
    summary: "When a fierce, arrogant lion terrorizes the animals of the forest, a clever little rabbit uses wisdom instead of brute force. The rabbit arrives late and tells the lion that another rival lion challenged his authority. Leading the furious king to an old deep well, the lion attacks his own reflection in the water, plunging into the well and freeing all the forest animals forever!",
    vocabHighlights: [
      { word: "Intelligence", partOfSpeech: "Noun", definition: "The ability to acquire, understand, and apply knowledge, wisdom, and skills.", pronunciation: "in-tel-uh-juhns", fact: "The clever rabbit proved that intelligence is more powerful than physical muscle!" },
      { word: "Courage", partOfSpeech: "Noun", definition: "Strength in the face of pain, fear, or danger; bravery.", pronunciation: "kur-ij", fact: "It took great courage for the small rabbit to stand calmly before the roaring lion." },
      { word: "Rival", partOfSpeech: "Noun", definition: "A person or thing competing with another for the same objective or for superiority.", pronunciation: "ry-vuhl", fact: "The proud lion could not tolerate the idea of having any rival in the forest." },
      { word: "Furious", partOfSpeech: "Adjective", definition: "Extremely angry, full of uncontrollable fury and rage.", pronunciation: "fyoor-ee-uhs", fact: "Blinded by furious anger, the lion jumped into the well without thinking." },
      { word: "Wisdom", partOfSpeech: "Noun", definition: "The quality of having experience, knowledge, and good judgment.", pronunciation: "wiz-duhm", fact: "Wisdom allows the smallest and gentlest creatures to solve the biggest challenges!" }
    ],
    pages: [
      {
        pageNumber: 1,
        title: "A Fierce Forest King",
        text: "A fierce lion frightened every animal in the forest. 'I am the strongest animal here!' he roared with pride.",
        imageUrl: "/clever_rabbit_and_the_lion.png"
      },
      {
        pageNumber: 2,
        title: "A Brave Plan",
        text: "The animals bravely approached the lion with a plan: 'Please stop hunting us all day. One animal will visit you each day.' The lion agreed: 'Very well. Do not keep me waiting!'",
        imageUrl: "/clever_rabbit_and_the_lion.png"
      },
      {
        pageNumber: 3,
        title: "The Rabbit's Turn",
        text: "One day, a small but clever rabbit was chosen to visit the lion. 'Strength will not save us. I need a clever plan,' thought the rabbit calmly.",
        imageUrl: "/clever_rabbit_and_the_lion.png"
      },
      {
        pageNumber: 4,
        title: "Arriving Late",
        text: "The rabbit walked very slowly and arrived late. The lion growled angrily: 'Why have you kept me waiting?' The rabbit bowed: 'Your Majesty, another lion stopped me on the way!'",
        imageUrl: "/clever_rabbit_and_the_lion.png"
      },
      {
        pageNumber: 5,
        title: "Show Me This Rival!",
        text: "The angry lion demanded to know where his rival lived: 'Show me this other lion at once!' The rabbit smiled: 'Follow me, Your Majesty.'",
        imageUrl: "/clever_rabbit_and_the_lion.png"
      },
      {
        pageNumber: 6,
        title: "The Old Deep Well",
        text: "The clever rabbit led the lion to an old, deep stone well: 'The other lion is hiding down there at the bottom.'",
        imageUrl: "/clever_rabbit_and_the_lion.png"
      },
      {
        pageNumber: 7,
        title: "The Reflection Roars",
        text: "The lion looked into the well and saw his own reflection in the water. 'How dare you challenge me!' roared the lion. The echo roared back: ROAR!",
        imageUrl: "/clever_rabbit_and_the_lion.png"
      },
      {
        pageNumber: 8,
        title: "The Leap",
        text: "Believing the reflection was his dangerous rival, the furious lion leaped into the well with a giant SPLASH! 'I will defeat you!' he cried.",
        imageUrl: "/clever_rabbit_and_the_lion.png"
      },
      {
        pageNumber: 9,
        title: "Trapped by Anger",
        text: "The lion was trapped deep inside the well water, while the clever rabbit remained completely safe. 'Your anger has defeated you,' said the rabbit.",
        imageUrl: "/clever_rabbit_and_the_lion.png"
      },
      {
        pageNumber: 10,
        title: "Forest Celebration",
        text: "The rabbit returned, and all the forest animals celebrated their freedom: 'Hooray for the clever rabbit! Wisdom is stronger than force.' MORAL: Intelligence can overcome great strength. Think calmly before you act.",
        imageUrl: "/clever_rabbit_and_the_lion.png"
      }
    ],
    comprehensionQuestions: [
      {
        id: 1,
        question: "Why did the clever rabbit arrive late to see the lion?",
        options: ["He took his time to plan a clever trick to defeat the lion", "He got lost in the forest", "He overslept under a tree", "He stopped to eat carrots"],
        answer: "He took his time to plan a clever trick to defeat the lion",
        explanation: "The rabbit walked slowly on purpose so the lion would become angry and fall for his clever trap."
      },
      {
        id: 2,
        question: "What did the lion see when he looked down into the deep well?",
        options: ["His own reflection in the clear water", "A real rival lion", "A swimming fish", "A bag of treasure"],
        answer: "His own reflection in the clear water",
        explanation: "The lion saw his own reflection in the water and mistook it for another lion challenging his power."
      },
      {
        id: 3,
        question: "What is the main moral of 'The Clever Rabbit and the Lion'?",
        options: ["Intelligence can overcome great strength; think calmly before you act", "Lions are always gentle", "Never drink water from deep wells", "Rabbits are the fastest runners"],
        answer: "Intelligence can overcome great strength; think calmly before you act",
        explanation: "The fable teaches that wisdom and quick intelligence can conquer even the strongest brute force."
      }
    ]
  },
  {
    id: 'three_little_pigs',
    title: "The Three Little Pigs",
    subtitle: "A story about hard work and preparation",
    genre: "Classic Fairy Tale",
    emoji: "🐷",
    isFeatured: true,
    isSingleComicSheet: true,
    image: "/three_little_pigs.png",
    moral: "Hard work and preparation bring safety. Do a job properly the first time. 🧱",
    summary: "Three little pig brothers set out into the world to build homes of their own. The first pig builds quickly out of straw and the second out of sticks so they can play. But the wise third pig works patiently to build a sturdy brick house. When the Big Bad Wolf huffs and puffs and blows down the straw and stick houses, all three pigs find safety inside the impenetrable brick house!",
    vocabHighlights: [
      { word: "Preparation", partOfSpeech: "Noun", definition: "The action or process of making ready or being made ready for use or consideration.", pronunciation: "prep-uh-ray-shun", fact: "Proper preparation gives us safety and confidence when unexpected storms arrive!" },
      { word: "Patiently", partOfSpeech: "Adverb", definition: "In a way that shows tolerance of delays, problems, or suffering without becoming annoyed or anxious.", pronunciation: "pay-shuhnt-lee", fact: "The third pig worked patiently brick by brick until his house was completely secure." },
      { word: "Sturdy", partOfSpeech: "Adjective", definition: "Strongly and solidly built, able to withstand heavy forces or rough use.", pronunciation: "stur-dee", fact: "The sturdy brick house didn't shake a single millimeter when the wolf puffed!" },
      { word: "Protected", partOfSpeech: "Adjective", definition: "Kept safe from harm, injury, damage, or danger.", pronunciation: "pruh-tek-tid", fact: "All three brother pigs were safe and protected together by the warm hearth." },
      { word: "Diligence", partOfSpeech: "Noun", definition: "Careful and persistent work or effort.", pronunciation: "dil-i-juhns", fact: "Diligence means doing a job thoroughly and correctly the very first time!" }
    ],
    pages: [
      {
        pageNumber: 1,
        title: "Setting Out",
        text: "Three little pigs set out to build homes of their own. 'Let us each build a safe and cosy house!' they agreed happily.",
        imageUrl: "/three_little_pigs.png"
      },
      {
        pageNumber: 2,
        title: "The Straw House",
        text: "The first pig quickly built a house from dry golden straw: 'This was quick and easy! Now I can play!'",
        imageUrl: "/three_little_pigs.png"
      },
      {
        pageNumber: 3,
        title: "The Stick House",
        text: "The second pig built a house from wooden sticks: 'My stick house will keep me safe and warm!'",
        imageUrl: "/three_little_pigs.png"
      },
      {
        pageNumber: 4,
        title: "The Brick House",
        text: "The third pig worked patiently and built a sturdy brick house: 'A strong house is worth the extra work and effort.'",
        imageUrl: "/three_little_pigs.png"
      },
      {
        pageNumber: 5,
        title: "A Hungry Visitor",
        text: "A hungry wolf arrived at the straw house and knocked on the door: 'Little pig, little pig, let me come in!' The pig called: 'Not by the hair on my chinny-chin-chin!'",
        imageUrl: "/three_little_pigs.png"
      },
      {
        pageNumber: 6,
        title: "HUFF! PUFF! WHOOSH!",
        text: "The wolf huffed and puffed until the straw house blew completely down! 'I must run to my brother's house!' squealed the first pig.",
        imageUrl: "/three_little_pigs.png"
      },
      {
        pageNumber: 7,
        title: "Blowing Down Sticks",
        text: "The wolf blew down the stick house too! 'I will blow this house down too!' roared the wolf. The pigs yelled: 'Run to the brick house!'",
        imageUrl: "/three_little_pigs.png"
      },
      {
        pageNumber: 8,
        title: "Built with Care",
        text: "The wolf huffed and puffed with all his might, but the brick house would not move. 'Why won't this house fall?' howled the wolf. 'Because it was built with care!' cheered the pigs.",
        imageUrl: "/three_little_pigs.png"
      },
      {
        pageNumber: 9,
        title: "Down the Chimney",
        text: "The wolf climbed down the chimney, but the pigs were ready: 'Quick! Put the warm pot below!' The wolf landed with a loud YOWL!",
        imageUrl: "/three_little_pigs.png"
      },
      {
        pageNumber: 10,
        title: "Safe and Sound",
        text: "The startled wolf ran far away into the forest, never to return. The three pigs lived happily together in the strong brick house. 'Hard work protected us!' MORAL: Hard work and preparation bring safety. Do a job properly the first time.",
        imageUrl: "/three_little_pigs.png"
      }
    ],
    comprehensionQuestions: [
      {
        id: 1,
        question: "Which material did the third pig use to build his house?",
        options: ["Strong red bricks", "Dry straw", "Wooden sticks", "Mud and leaves"],
        answer: "Strong red bricks",
        explanation: "The third pig patiently worked hard to build a sturdy house made of solid bricks."
      },
      {
        id: 2,
        question: "Why was the wolf unable to blow down the third pig's house?",
        options: ["Because it was built patiently and sturdily with bricks", "Because the wind stopped blowing", "Because the wolf was too tired to blow", "Because the house was made of iron"],
        answer: "Because it was built patiently and sturdily with bricks",
        explanation: "The brick house was strong and carefully constructed, so the wolf's huffing and puffing could not move it."
      },
      {
        id: 3,
        question: "What is the main moral of 'The Three Little Pigs'?",
        options: ["Hard work and preparation bring safety; do a job properly the first time", "Always build houses in the woods", "Straw is the best material for quick shelter", "Wolves love warm soup"],
        answer: "Hard work and preparation bring safety; do a job properly the first time",
        explanation: "The fairy tale teaches that taking the time to do hard work and prepare thoroughly protects us from danger."
      }
    ]
  },
  {
    id: 'little_red_riding_hood',
    title: "Little Red Riding Hood",
    subtitle: "A story about safety and wise choices",
    genre: "Classic Fairy Tale",
    emoji: "👧🧺",
    isFeatured: true,
    isSingleComicSheet: true,
    image: "/little_red_riding_hood.png",
    moral: "Be cautious with strangers and always listen to the safety advice of trusted adults. 🛡️",
    summary: "When Little Red Riding Hood is sent through the forest with a basket of food for her grandmother, she meets a sly wolf and strays from the path. The wolf races ahead to Grandmother's cottage, but with the help of a brave woodcutter, Grandmother and Red are saved, teaching Red the vital lesson of staying on the safe path and not trusting strangers.",
    vocabHighlights: [
      { word: "Cautious", partOfSpeech: "Adjective", definition: "Careful to avoid potential problems, mistakes, or dangers.", pronunciation: "kaw-shuhs", fact: "Being cautious means keeping our promises and staying mindful of our surroundings." },
      { word: "Stranger", partOfSpeech: "Noun", definition: "A person whom one does not know or with whom one is not familiar.", pronunciation: "strayn-jer", fact: "We should never share private family details or our destination with strangers." },
      { word: "Shortcut", partOfSpeech: "Noun", definition: "A quicker alternative route than the standard path.", pronunciation: "short-kuht", fact: "The sly wolf took a fast shortcut through the woods to reach Grandmother's house first." },
      { word: "Woodcutter", partOfSpeech: "Noun", definition: "A person whose job is felling trees and cutting wood in the forest.", pronunciation: "wood-kut-er", fact: "The brave woodcutter stayed alert and rushed in right on time to save Grandmother and Red." },
      { word: "Advice", partOfSpeech: "Noun", definition: "Guidance or recommendations offered with regard to prudent future action.", pronunciation: "ad-vys", fact: "Listening to the wise safety advice of parents and trusted adults keeps us safe from harm." }
    ],
    pages: [
      {
        pageNumber: 1,
        title: "Packing the Basket",
        text: "Little Red Riding Hood's mother packed a basket of fresh food for Grandmother. 'Please take this food to Grandmother,' Mother said gently.",
        imageUrl: "/little_red_riding_hood.png"
      },
      {
        pageNumber: 2,
        title: "Important Advice",
        text: "Before she left, Mother gave her important advice: 'Stay on the path and do not talk to strangers.' Red promised: 'I promise, Mother.'",
        imageUrl: "/little_red_riding_hood.png"
      },
      {
        pageNumber: 3,
        title: "Into the Sunny Forest",
        text: "Little Red Riding Hood happily entered the sunny forest with her basket. 'Grandmother will love these treats!' she smiled.",
        imageUrl: "/little_red_riding_hood.png"
      },
      {
        pageNumber: 4,
        title: "A Sly Watcher",
        text: "A sly wolf watched her quietly from behind the forest trees. 'I wonder where she is going,' thought the wolf.",
        imageUrl: "/little_red_riding_hood.png"
      },
      {
        pageNumber: 5,
        title: "Meeting on the Path",
        text: "The wolf stepped onto the path and spoke politely: 'Good morning. Where are you going?' Red replied: 'To visit my grandmother.'",
        imageUrl: "/little_red_riding_hood.png"
      },
      {
        pageNumber: 6,
        title: "Revealing the Secret",
        text: "Without thinking, Red told the stranger where Grandmother lived: 'Her cottage is beyond the old oak tree.' 'How interesting!' said the wolf.",
        imageUrl: "/little_red_riding_hood.png"
      },
      {
        pageNumber: 7,
        title: "The Meadow of Flowers",
        text: "The wolf pointed toward a meadow filled with bright wildflowers: 'Grandmother would love some flowers.' Red cheered: 'What a lovely idea!'",
        imageUrl: "/little_red_riding_hood.png"
      },
      {
        pageNumber: 8,
        title: "Taking a Shortcut",
        text: "While Red left the safe path to gather flowers, the wolf took a secret shortcut. 'I will reach the cottage first!' cackled the wolf.",
        imageUrl: "/little_red_riding_hood.png"
      },
      {
        pageNumber: 9,
        title: "Knocking at the Door",
        text: "The wolf arrived at Grandmother's cottage and knocked. Grandmother asked: 'Who is there?' The wolf disguised his voice: 'It is Little Red Riding Hood.'",
        imageUrl: "/little_red_riding_hood.png"
      },
      {
        pageNumber: 10,
        title: "Locked in the Cupboard",
        text: "The wolf rushed inside and locked Grandmother safely in a cupboard! 'Let me out!' cried Grandmother. 'Stay quiet!' growled the wolf.",
        imageUrl: "/little_red_riding_hood.png"
      },
      {
        pageNumber: 11,
        title: "The Disguise",
        text: "The wolf put on Grandmother's cap and climbed into her bed. 'Now I will wait for Little Red,' the wolf chuckled slyly.",
        imageUrl: "/little_red_riding_hood.png"
      },
      {
        pageNumber: 12,
        title: "Arriving at the Cottage",
        text: "Little Red Riding Hood finally arrived and entered the cottage: 'Grandmother, are you feeling better?' The wolf whispered: 'Come closer, my dear.'",
        imageUrl: "/little_red_riding_hood.png"
      },
      {
        pageNumber: 13,
        title: "What Big Ears!",
        text: "Red noticed that Grandmother looked very different. 'Grandmother, what big ears you have!' 'All the better to hear you with,' answered the wolf.",
        imageUrl: "/little_red_riding_hood.png"
      },
      {
        pageNumber: 14,
        title: "What Big Eyes!",
        text: "Red stepped closer and looked carefully. 'Grandmother, what big eyes you have!' 'All the better to see you with,' replied the wolf.",
        imageUrl: "/little_red_riding_hood.png"
      },
      {
        pageNumber: 15,
        title: "What Big Teeth!",
        text: "At last, Red realised that the figure in bed was the wolf! 'What big teeth you have!' The wolf sprang up: 'All the better to frighten you with!'",
        imageUrl: "/little_red_riding_hood.png"
      },
      {
        pageNumber: 16,
        title: "A Cry for Help",
        text: "Red cried for help at the top of her lungs! 'Help!' A nearby woodcutter heard her voice: 'That came from Grandmother's cottage!'",
        imageUrl: "/little_red_riding_hood.png"
      },
      {
        pageNumber: 17,
        title: "The Woodcutter's Rescue",
        text: "The brave woodcutter rushed inside with his axe. 'Leave them alone!' he ordered. The frightened wolf fled out the window: 'I am leaving!' WHOOSH!",
        imageUrl: "/little_red_riding_hood.png"
      },
      {
        pageNumber: 18,
        title: "Safe and Apologetic",
        text: "The woodcutter freed Grandmother from the cupboard, and Red apologised with a grateful hug. Woodcutter: 'We are safe now.' Red: 'I should have listened. I will be more careful.' MORAL: Be cautious with strangers. Listen to the safety advice of trusted adults.",
        imageUrl: "/little_red_riding_hood.png"
      }
    ],
    comprehensionQuestions: [
      {
        id: 1,
        question: "What important advice did Mother give Little Red Riding Hood before she left?",
        options: ["Stay on the path and do not talk to strangers", "Pick every flower in the forest", "Find a shortcut through the dark woods", "Give all her food to animals"],
        answer: "Stay on the path and do not talk to strangers",
        explanation: "Mother warned Red to remain on the safe path and never talk to strangers."
      },
      {
        id: 2,
        question: "How was the wolf able to reach Grandmother's cottage before Little Red Riding Hood?",
        options: ["The wolf took a shortcut while Red wandered off to pick flowers", "The wolf flew on a magic carpet", "Red stopped to take a long nap", "Grandmother invited the wolf first"],
        answer: "The wolf took a shortcut while Red wandered off to pick flowers",
        explanation: "While Red was distracted picking flowers off the path, the wolf sprinted down a shortcut to arrive first."
      },
      {
        id: 3,
        question: "Who rescued Grandmother and Little Red Riding Hood from the wolf?",
        options: ["A brave nearby woodcutter", "A forest ranger", "The village baker", "A flock of birds"],
        answer: "A brave nearby woodcutter",
        explanation: "The woodcutter heard Red's cries for help and rushed inside to scare the wolf away and free Grandmother."
      }
    ]
  },
  {
    id: 'goldilocks_and_the_three_bears',
    title: "Goldilocks and the Three Bears",
    subtitle: "A story about respect and permission",
    genre: "Classic Fairy Tale",
    emoji: "🐻🥣",
    isFeatured: true,
    isSingleComicSheet: true,
    image: "/goldilocks_and_the_three_bears.png",
    moral: "Respect other people's homes and belongings. Always ask permission before using things that are not yours. 🏡✨",
    summary: "When the Three Bears leave their forest cottage while their porridge cools, a curious girl named Goldilocks wanders inside without permission. After trying their porridge, chairs, and beds, she falls asleep in Baby Bear's cozy bed. When the bears return and discover what happened, Goldilocks learns a memorable lesson about respect, manners, and always asking for permission.",
    vocabHighlights: [
      { word: "Permission", partOfSpeech: "Noun", definition: "Official or polite consent to do something.", pronunciation: "per-mish-uhn", fact: "Always asking for permission shows high respect for other people's property." },
      { word: "Porridge", partOfSpeech: "Noun", definition: "A dish consisting of oatmeal or another cereal boiled in water or milk.", pronunciation: "por-ij", fact: "The Three Bears prepared three warm bowls of porridge for breakfast." },
      { word: "Belongings", partOfSpeech: "Noun", definition: "A person's movable possessions and property.", pronunciation: "bi-lawng-ingz", fact: "We should always take good care of other people's belongings and never use them without asking." },
      { word: "Apologised", partOfSpeech: "Verb", definition: "Expressed regret or asked for forgiveness for something done wrong.", pronunciation: "uh-pol-uh-jahyzd", fact: "Goldilocks apologised sincerely to the bears before leaving their cottage." },
      { word: "Respect", partOfSpeech: "Noun", definition: "Due regard for the feelings, wishes, rights, or traditions of others.", pronunciation: "ri-spekt", fact: "Respect is a core value that helps everyone feel safe and valued." }
    ],
    pages: [
      {
        pageNumber: 1,
        title: "Breakfast Porridge",
        text: "Papa Bear, Mama Bear and Baby Bear made porridge for breakfast. 'The porridge is too hot,' said Baby Bear.",
        imageUrl: "/goldilocks_and_the_three_bears.png"
      },
      {
        pageNumber: 2,
        title: "A Morning Walk",
        text: "The three bears went for a walk in the forest while their porridge cooled down. 'Let us walk in the forest,' suggested Baby Bear. 'Good idea!' agreed Mama Bear.",
        imageUrl: "/goldilocks_and_the_three_bears.png"
      },
      {
        pageNumber: 3,
        title: "Discovering the Cottage",
        text: "Goldilocks became lost in the woods and discovered the bears' lovely cottage. 'What a pretty cottage!' she remarked.",
        imageUrl: "/goldilocks_and_the_three_bears.png"
      },
      {
        pageNumber: 4,
        title: "Entering Without Permission",
        text: "She knocked on the front door, but nobody answered. 'Hello? Is anyone home?' Goldilocks entered the house without permission.",
        imageUrl: "/goldilocks_and_the_three_bears.png"
      },
      {
        pageNumber: 5,
        title: "Papa Bear's Porridge",
        text: "On the kitchen table, Goldilocks tasted Papa Bear's large bowl of porridge. 'This porridge is too hot!' she exclaimed.",
        imageUrl: "/goldilocks_and_the_three_bears.png"
      },
      {
        pageNumber: 6,
        title: "Mama Bear's Porridge",
        text: "Next, she tasted Mama Bear's medium bowl of porridge. 'This porridge is too cold!' she said.",
        imageUrl: "/goldilocks_and_the_three_bears.png"
      },
      {
        pageNumber: 7,
        title: "Baby Bear's Porridge",
        text: "Then she tasted Baby Bear's little bowl of porridge. 'This porridge is just right!' she smiled, and ate it all up.",
        imageUrl: "/goldilocks_and_the_three_bears.png"
      },
      {
        pageNumber: 8,
        title: "Papa Bear's Chair",
        text: "Goldilocks walked into the parlour and sat in Papa Bear's large wooden rocking chair. 'This chair is too hard!' she complained.",
        imageUrl: "/goldilocks_and_the_three_bears.png"
      },
      {
        pageNumber: 9,
        title: "Mama Bear's Chair",
        text: "She tried Mama Bear's green cushioned armchair, but it sank too deep and felt too soft.",
        imageUrl: "/goldilocks_and_the_three_bears.png"
      },
      {
        pageNumber: 10,
        title: "Baby Bear's Broken Chair",
        text: "Baby Bear's little red chair felt right: 'This chair is just right!' But suddenly—CRACK! The chair broke into pieces.",
        imageUrl: "/goldilocks_and_the_three_bears.png"
      },
      {
        pageNumber: 11,
        title: "Papa Bear's Bed",
        text: "Feeling sleepy, Goldilocks went upstairs. She tried Papa Bear's large blue bed. 'This bed is too hard!' she said.",
        imageUrl: "/goldilocks_and_the_three_bears.png"
      },
      {
        pageNumber: 12,
        title: "Mama Bear's Bed",
        text: "Then she tried Mama Bear's green quilted bed. 'This bed is too soft!' she sighed.",
        imageUrl: "/goldilocks_and_the_three_bears.png"
      },
      {
        pageNumber: 13,
        title: "Baby Bear's Cozy Bed",
        text: "Baby Bear's small red quilted bed felt perfect: 'This bed is just right.' Goldilocks nestled down and fell fast asleep.",
        imageUrl: "/goldilocks_and_the_three_bears.png"
      },
      {
        pageNumber: 14,
        title: "The Bears Return",
        text: "The three bears returned from their walk and discovered the mess. 'Someone tasted our porridge!' said Papa Bear. 'Someone tried our chairs!' cried Mama Bear. 'Someone ate mine and broke my chair!' sobbed Baby Bear.",
        imageUrl: "/goldilocks_and_the_three_bears.png"
      },
      {
        pageNumber: 15,
        title: "Discovered Upstairs",
        text: "Upstairs in the bedroom, the bears found Goldilocks sleeping in Baby Bear's bed. 'Someone is sleeping in my bed!' shouted Baby Bear. Goldilocks woke up startled: 'Oh! The bears are home!'",
        imageUrl: "/goldilocks_and_the_three_bears.png"
      },
      {
        pageNumber: 16,
        title: "A Heartfelt Apology",
        text: "Goldilocks realised her mistake and apologised sincerely before leaving the cottage: 'I am so sorry for entering without permission.' She promised to always respect other people's homes and belongings.",
        imageUrl: "/goldilocks_and_the_three_bears.png"
      }
    ],
    comprehensionQuestions: [
      {
        id: 1,
        question: "Why did Goldilocks enter the bears' cottage?",
        options: ["She was lost and entered without permission after knocking", "The bears invited her for breakfast", "She lived next door with her family", "She was delivering a package"],
        answer: "She was lost and entered without permission after knocking",
        explanation: "Goldilocks was lost in the woods and entered the cottage on her own when nobody answered the door."
      },
      {
        id: 2,
        question: "Which bowl of porridge, chair, and bed did Goldilocks find 'just right'?",
        options: ["Baby Bear's", "Papa Bear's", "Mama Bear's", "The woodcutter's"],
        answer: "Baby Bear's",
        explanation: "Baby Bear's porridge, small chair, and cozy bed were all 'just right' for Goldilocks."
      },
      {
        id: 3,
        question: "What important moral lesson does the story teach?",
        options: ["Respect other people's homes and belongings, and always ask for permission", "Bears love cold porridge", "Always sleep in other people's beds", "Never go for morning walks"],
        answer: "Respect other people's homes and belongings, and always ask for permission",
        explanation: "The story reminds us that we must always respect others' property and ask for permission before using things that do not belong to us."
      }
    ]
  },
  {
    id: 'jack_and_the_beanstalk',
    title: "Jack and the Beanstalk",
    subtitle: "A story about courage and wise choices",
    genre: "Classic Fairy Tale",
    emoji: "🌱🏰",
    isFeatured: true,
    isSingleComicSheet: true,
    image: "/jack_and_the_beanstalk.png",
    moral: "Courage should be guided by honesty. Always use your strengths and cleverness to help others and right past wrongs. ✨🌿",
    summary: "When poor Jack trades his family's cow for five magic beans, a gigantic beanstalk grows overnight high into the clouds. Jack climbs into the sky to explore a castle where a fearsome giant hoards stolen treasures. With bravery, quick wit, and a noble heart, Jack retrieves the villagers' stolen gold, the golden hen, and the magical harp, chopping down the beanstalk to keep his family and village safe and prosperous.",
    vocabHighlights: [
      { word: "Courage", partOfSpeech: "Noun", definition: "The ability to do something that frightens one; bravery.", pronunciation: "kur-ij", fact: "Jack showed tremendous courage when climbing the massive beanstalk high above the clouds." },
      { word: "Beanstalk", partOfSpeech: "Noun", definition: "The stem of a bean plant, especially the fast-growing giant bean vine in fairy tales.", pronunciation: "been-stawk", fact: "The magic beans sprouted overnight into an enormous green beanstalk." },
      { word: "Enchanted", partOfSpeech: "Adjective", definition: "Filled with or under the influence of magical powers.", pronunciation: "en-chan-tid", fact: "The giant kept an enchanted golden harp that played beautiful melodies on command." },
      { word: "Prospered", partOfSpeech: "Verb", definition: "Flourished physically, financially, or socially; succeeded.", pronunciation: "pros-perd", fact: "Jack and his village prospered honestly after returning the stolen treasures." },
      { word: "Retrieve", partOfSpeech: "Verb", definition: "To get or bring something back from somewhere.", pronunciation: "ri-treev", fact: "Jack carefully retrieved the stolen gold and golden hen to return them to their rightful owners." }
    ],
    pages: [
      {
        pageNumber: 1,
        title: "Milky-White the Cow",
        text: "Jack lived with his mother and their gentle cow, Milky-White. 'We have very little food left,' sighed Mother. 'I will help, Mother,' promised Jack.",
        imageUrl: "/jack_and_the_beanstalk.png"
      },
      {
        pageNumber: 2,
        title: "To the Market",
        text: "Mother asked Jack to sell the cow at the village market. 'Please get a fair price for Milky-White,' she said. 'I will do my best,' Jack replied.",
        imageUrl: "/jack_and_the_beanstalk.png"
      },
      {
        pageNumber: 3,
        title: "Five Magic Beans",
        text: "On the road, a mysterious trader offered Jack five magic beans. 'These beans can change your fortune,' said the trader. 'They really are magic?' asked Jack in wonder.",
        imageUrl: "/jack_and_the_beanstalk.png"
      },
      {
        pageNumber: 4,
        title: "Returning Home",
        text: "Jack traded the cow for the beans and hurried home. 'Look, Mother! I brought magic beans.' Mother cried in dismay: 'Beans? We needed money!'",
        imageUrl: "/jack_and_the_beanstalk.png"
      },
      {
        pageNumber: 5,
        title: "The Giant Beanstalk",
        text: "Mother threw the beans outside. During the night, they began to grow with a deep RUMBLE! A giant beanstalk reached high into the clouds.",
        imageUrl: "/jack_and_the_beanstalk.png"
      },
      {
        pageNumber: 6,
        title: "Climbing Above the Clouds",
        text: "At sunrise, Jack bravely climbed the enormous beanstalk. 'I wonder what is above the clouds,' he thought as he climbed higher and higher.",
        imageUrl: "/jack_and_the_beanstalk.png"
      },
      {
        pageNumber: 7,
        title: "The Cloud Castle",
        text: "At the top, Jack discovered a huge castle and met the giant's kind wife. 'Please help me. I am far from home,' Jack asked. 'Quick! Come inside,' she whispered.",
        imageUrl: "/jack_and_the_beanstalk.png"
      },
      {
        pageNumber: 8,
        title: "Fee-Fi-Fo-Fum",
        text: "The ground shook as the enormous giant entered the castle, booming: 'FEE-FI-FO-FUM!' His wife quickly reassured him: 'It must be the wind.'",
        imageUrl: "/jack_and_the_beanstalk.png"
      },
      {
        pageNumber: 9,
        title: "The Stolen Gold",
        text: "From his hiding place inside a cup, Jack saw the giant counting stolen gold. 'The villagers' gold belongs to me now!' roared the giant. Jack thought: 'That gold should be returned.'",
        imageUrl: "/jack_and_the_beanstalk.png"
      },
      {
        pageNumber: 10,
        title: "Retrieving the Gold",
        text: "When the giant fell sound asleep, Jack quietly retrieved the heavy bag of gold. 'I will return this to the village,' he resolved.",
        imageUrl: "/jack_and_the_beanstalk.png"
      },
      {
        pageNumber: 11,
        title: "The Golden Hen",
        text: "Jack later climbed back and discovered a magical golden hen. 'This is the hen stolen from my family!' Jack gasped as the hen clucked gently.",
        imageUrl: "/jack_and_the_beanstalk.png"
      },
      {
        pageNumber: 12,
        title: "Golden Eggs",
        text: "The hen laid a shining golden egg whenever the giant commanded: 'Lay!' — CLINK! Jack whispered: 'I must take her home safely.'",
        imageUrl: "/jack_and_the_beanstalk.png"
      },
      {
        pageNumber: 13,
        title: "The Enchanted Harp",
        text: "On another visit, Jack found an enchanted golden harp. The harp pleaded: 'Please take me away from this castle.' 'I will help you,' Jack said.",
        imageUrl: "/jack_and_the_beanstalk.png"
      },
      {
        pageNumber: 14,
        title: "A Cry for Help",
        text: "As Jack carried the harp away, its magic suddenly made it cry out: 'Master! Someone is taking me!' 'Oh no!' cried Jack.",
        imageUrl: "/jack_and_the_beanstalk.png"
      },
      {
        pageNumber: 15,
        title: "The Great Chase",
        text: "The furious giant woke up and chased Jack down the swaying beanstalk. 'Stop!' bellowed the giant. Jack scrambled swiftly: 'I must reach the ground!'",
        imageUrl: "/jack_and_the_beanstalk.png"
      },
      {
        pageNumber: 16,
        title: "Safe and Prosperous",
        text: "Jack reached the bottom and chopped the beanstalk down. The giant landed safely in a haystack and fled forever. Jack, his mother, and the villagers prospered honestly.",
        imageUrl: "/jack_and_the_beanstalk.png"
      }
    ],
    comprehensionQuestions: [
      {
        id: 1,
        question: "What did Jack trade his family's cow, Milky-White, for?",
        options: ["Five magic beans", "A bag of gold coins", "A golden harp", "A bag of flour"],
        answer: "Five magic beans",
        explanation: "A mysterious trader on the road offered Jack five magic beans in exchange for Milky-White."
      },
      {
        id: 2,
        question: "What magical treasures did the giant hoard inside his cloud castle?",
        options: ["Stolen gold, a golden egg-laying hen, and an enchanted harp", "A flying broom and crystal ball", "A magic carpet and golden lamp", "A talking mirror and poison apple"],
        answer: "Stolen gold, a golden egg-laying hen, and an enchanted harp",
        explanation: "Jack discovered the giant counting stolen village gold, commanding a golden egg-laying hen, and possessing an enchanted harp."
      },
      {
        id: 3,
        question: "What is the central moral lesson of the story?",
        options: ["Courage should be guided by honesty, and strengths should be used to help others", "Never trade with villagers", "Beans are better than money", "Always hide inside teacups"],
        answer: "Courage should be guided by honesty, and strengths should be used to help others",
        explanation: "The story illustrates that true bravery involves doing the right thing, helping others, and returning what was wrongfully taken."
      }
    ]
  },
  {
    id: 'the_ugly_duckling',
    title: "The Ugly Duckling",
    subtitle: "A story about growth, kindness and belonging",
    genre: "Classic Fairy Tale",
    emoji: "🦆🦢",
    isFeatured: true,
    isSingleComicSheet: true,
    image: "/the_ugly_duckling.png",
    moral: "Do not judge others by their appearance. Growth takes time, and kindness always matters. Everyone has inner beauty and a place where they belong. 🦢💖",
    summary: "Born looking different from his yellow duckling siblings, a gentle grey duckling faces teasing and unkindness on the farm. He journeys out into the world through the cold winter, surviving hardship with the help of a kind farmer. When spring arrives, he discovers his true reflection in the shining lake—a magnificent white swan—and finds genuine love, acceptance, and belonging.",
    vocabHighlights: [
      { word: "Belonging", partOfSpeech: "Noun", definition: "A feeling of being happy, comfortable, and accepted in a particular place or group.", pronunciation: "bi-lawng-ing", fact: "Finding a place of true belonging made the young swan feel peaceful and cherished." },
      { word: "Graceful", partOfSpeech: "Adjective", definition: "Having or showing grace or elegance in movement or form.", pronunciation: "grays-fuhl", fact: "The magnificent white swans glided across the calm lake in a graceful dance." },
      { word: "Reflection", partOfSpeech: "Noun", definition: "An image seen in a mirror or shiny surface such as clear water.", pronunciation: "ri-flek-shuhn", fact: "Looking into the shining water, he saw his stunning reflection as a regal swan." },
      { word: "Perseverance", partOfSpeech: "Noun", definition: "Persistence in doing something despite difficulty or delay in achieving success.", pronunciation: "pur-suh-veer-uhns", fact: "The little duckling showed brave perseverance through the freezing winter." },
      { word: "Compassion", partOfSpeech: "Noun", definition: "Sympathy and concern for the sufferings or misfortunes of others.", pronunciation: "kuhm-pash-uhn", fact: "The kind farmer treated the freezing bird with great compassion and warmth." }
    ],
    pages: [
      {
        pageNumber: 1,
        title: "Eggs Begin to Hatch",
        text: "Mother Duck waited patiently by the barn as her nest of eggs began to hatch. 'Welcome, my little ducklings!' she quacked happily.",
        imageUrl: "/the_ugly_duckling.png"
      },
      {
        pageNumber: 2,
        title: "The Final Egg",
        text: "The largest and final egg opened, revealing a big grey duckling. 'Hello, Mother!' chirped the duckling. Mother Duck smiled: 'Welcome, my special little one.'",
        imageUrl: "/the_ugly_duckling.png"
      },
      {
        pageNumber: 3,
        title: "Looking Different",
        text: "The bright yellow ducklings noticed their new sibling looked different. 'You do not look like us,' they said. 'I cannot help being different,' he replied softly.",
        imageUrl: "/the_ugly_duckling.png"
      },
      {
        pageNumber: 4,
        title: "Mother's Warm Embrace",
        text: "Mother Duck lovingly gathered every duckling close, sheltering them beneath her warm wings and teaching them that every child is cherished.",
        imageUrl: "/the_ugly_duckling.png"
      },
      {
        pageNumber: 5,
        title: "Teasing in the Farmyard",
        text: "At the farmyard, some unkind animals laughed at the grey duckling. 'What a strange-looking duckling!' squawked a hen. The duckling wondered: 'Why are they being unkind?'",
        imageUrl: "/the_ugly_duckling.png"
      },
      {
        pageNumber: 6,
        title: "Searching for Belonging",
        text: "Feeling lonely and unwanted, the grey duckling waddled away from the farmyard. 'Somewhere, I will find a place to belong,' he whispered with hope.",
        imageUrl: "/the_ugly_duckling.png"
      },
      {
        pageNumber: 7,
        title: "Kind Friends on the Marsh",
        text: "Two friendly wild ducks welcomed the tired duckling among the reeds. 'You may stay here tonight,' they offered. 'Thank you for being kind,' he smiled.",
        imageUrl: "/the_ugly_duckling.png"
      },
      {
        pageNumber: 8,
        title: "Swans in the Sunset",
        text: "One golden evening, a flock of beautiful white swans flew gracefully across the sunset sky. 'They are the most graceful birds I have ever seen,' gasped the duckling.",
        imageUrl: "/the_ugly_duckling.png"
      },
      {
        pageNumber: 9,
        title: "Winter Arrives",
        text: "Freezing winter arrived, covering the lake and fields in thick white snow. Shivering in the frost, the duckling told himself: 'It is cold, but I must keep going.'",
        imageUrl: "/the_ugly_duckling.png"
      },
      {
        pageNumber: 10,
        title: "The Kind Farmer's Rescue",
        text: "A kind farmer found the freezing duckling by the icy bank and gently carried him home in a soft blanket. 'You are safe here,' comforted the farmer.",
        imageUrl: "/the_ugly_duckling.png"
      },
      {
        pageNumber: 11,
        title: "Growing Strong in the Barn",
        text: "Throughout the long winter, the duckling rested in the cozy barn, ate nutritious grain, and grew bigger and stronger each day.",
        imageUrl: "/the_ugly_duckling.png"
      },
      {
        pageNumber: 12,
        title: "Spring by the Lake",
        text: "When warm spring arrived, the young bird spread his magnificent wings and flew back to the sparkling lake filled with blooming water lilies.",
        imageUrl: "/the_ugly_duckling.png"
      },
      {
        pageNumber: 13,
        title: "A Surprising Reflection",
        text: "He looked down into the clear water and saw the reflection of a magnificent white swan with elegant feathers. 'Is that really my reflection?' he gasped.",
        imageUrl: "/the_ugly_duckling.png"
      },
      {
        pageNumber: 14,
        title: "Welcomed by Swans",
        text: "Three majestic swans glided across the water to greet him. 'Welcome, young swan!' they sang. 'At last, I have found my family,' he rejoiced.",
        imageUrl: "/the_ugly_duckling.png"
      },
      {
        pageNumber: 15,
        title: "Forgiveness and Understanding",
        text: "Mother Duck and the farmyard ducklings visited the lake and recognized him. 'We were wrong to tease you,' they admitted. 'I forgive you,' the swan said gently.",
        imageUrl: "/the_ugly_duckling.png"
      },
      {
        pageNumber: 16,
        title: "True Beauty and Worth",
        text: "The young swan finally realized his true value: 'Being different never made me less valuable.' He lived happily among friends who loved and accepted him for who he was.",
        imageUrl: "/the_ugly_duckling.png"
      }
    ],
    comprehensionQuestions: [
      {
        id: 1,
        question: "Why was the grey duckling teased in the farmyard?",
        options: ["Because he looked larger and different from the other yellow ducklings", "Because he could not swim", "Because he did not like eating corn", "Because he flew too fast"],
        answer: "Because he looked larger and different from the other yellow ducklings",
        explanation: "The farm animals judged the duckling by his outward appearance because he didn't look like the yellow ducklings."
      },
      {
        id: 2,
        question: "What did the duckling discover about himself when spring arrived?",
        options: ["He had grown into a magnificent, graceful white swan", "He turned into a golden eagle", "He remained a little grey duckling", "He became a farm rooster"],
        answer: "He had grown into a magnificent, graceful white swan",
        explanation: "Looking into the clear lake water, the bird saw his reflection and realized he was a beautiful swan all along."
      },
      {
        id: 3,
        question: "What is the central moral lesson of 'The Ugly Duckling'?",
        options: ["Do not judge others by appearance; growth takes time and everyone is worthy", "Only yellow ducklings are special", "Winter is too cold for birds", "Never leave your birthplace"],
        answer: "Do not judge others by appearance; growth takes time and everyone is worthy",
        explanation: "The story teaches us to treat everyone with kindness and that our true worth and beauty shine through with time and character."
      }
    ]
  },
  {
    id: 'the_princess_and_the_pea',
    title: "The Princess and the Pea",
    subtitle: "A story about truth and looking beyond appearances",
    genre: "Classic Fairy Tale",
    emoji: "👑🛏️",
    isFeatured: true,
    isSingleComicSheet: true,
    image: "/the_princess_and_the_pea.png",
    moral: "Do not judge people only by appearances. Honesty, sincerity, and inner character reveal the true nobility of a person. 👑✨",
    summary: "A thoughtful prince searches far and wide for a genuine, kind-hearted princess. On a stormy night, a storm-soaked young woman seeks shelter at the castle claiming to be a princess. To test her sensitivity and truthfulness, the Queen places a single tiny pea beneath twenty thick mattresses and twenty feather beds. The visitor's honest, gentle response the next morning reveals her genuine character, leading to a joyful royal wedding.",
    vocabHighlights: [
      { word: "Sensitivity", partOfSpeech: "Noun", definition: "The quality or condition of being sensitive; quick to detect or respond to slight changes or feelings.", pronunciation: "sen-si-tiv-i-tee", fact: "The princess had such delicate sensitivity that she felt a tiny pea under twenty mattresses!" },
      { word: "Mattress", partOfSpeech: "Noun", definition: "A fabric case filled with resilient material used for sleeping on.", pronunciation: "mat-ris", fact: "The Queen commanded the servants to stack twenty mattresses high upon the royal bed." },
      { word: "Truthfulness", partOfSpeech: "Noun", definition: "The quality of telling or expressing the truth; honesty.", pronunciation: "trooth-fuhl-nis", fact: "Her truthfulness and humble honesty won the prince's heart immediately." },
      { word: "Sincere", partOfSpeech: "Adjective", definition: "Free from pretense or deceit; proceeding from genuine feelings.", pronunciation: "sin-seer", fact: "The prince sought a sincere companion whose inner character shone brighter than gold." },
      { word: "Nobility", partOfSpeech: "Noun", definition: "The quality of being noble in character, mind, or moral excellence.", pronunciation: "noh-bil-i-tee", fact: "True nobility is shown through kindness, honesty, and respect for all people." }
    ],
    pages: [
      {
        pageNumber: 1,
        title: "The Prince's Quest",
        text: "A thoughtful prince wished to marry a kind and honest princess. 'How will I recognise a true princess?' asked the prince. The Queen smiled: 'Character reveals itself in unexpected ways.'",
        imageUrl: "/the_princess_and_the_pea.png"
      },
      {
        pageNumber: 2,
        title: "Searching Foreign Kingdoms",
        text: "The prince travelled through many kingdoms and met many princesses, but none felt genuine: 'I seek someone sincere and kind.'",
        imageUrl: "/the_princess_and_the_pea.png"
      },
      {
        pageNumber: 3,
        title: "Returning Home",
        text: "After a long and fruitless search, the disappointed prince returned home. 'I have not found the right person,' he sighed. 'Do not lose hope,' comforted the Queen.",
        imageUrl: "/the_princess_and_the_pea.png"
      },
      {
        pageNumber: 4,
        title: "The Midnight Storm",
        text: "One night, a tremendous storm shook the royal castle with booming thunder: BOOM! Torrential rain poured across the kingdom.",
        imageUrl: "/the_princess_and_the_pea.png"
      },
      {
        pageNumber: 5,
        title: "A Knock at the Gate",
        text: "A soaked young woman knocked urgently at the castle gate: 'Please let me shelter here. I am a princess.' The royal guard invited her inside out of the pouring rain.",
        imageUrl: "/the_princess_and_the_pea.png"
      },
      {
        pageNumber: 6,
        title: "A Royal Guest",
        text: "The Queen welcomed the shivering visitor warmly with dry towels, but quietly thought: 'You may stay with us tonight. I will arrange a gentle test to see if her claim is true.'",
        imageUrl: "/the_princess_and_the_pea.png"
      },
      {
        pageNumber: 7,
        title: "The Secret Pea",
        text: "The Queen entered the royal bedchamber and secretly placed one tiny green pea directly onto the wooden bed frame: 'This little pea will reveal the truth.'",
        imageUrl: "/the_princess_and_the_pea.png"
      },
      {
        pageNumber: 8,
        title: "The Towering Bed",
        text: "She stacked twenty thick mattresses and twenty soft feather beds high above the pea. 'Prepare the tallest bed in the castle!' ordered the Queen.",
        imageUrl: "/the_princess_and_the_pea.png"
      },
      {
        pageNumber: 9,
        title: "Climbing to Sleep",
        text: "The princess climbed a wooden ladder all the way to the top of the towering bed: 'Thank you for your kindness. Good night!'",
        imageUrl: "/the_princess_and_the_pea.png"
      },
      {
        pageNumber: 10,
        title: "A Restless Night",
        text: "All night long, the princess tossed and turned beneath the moonlight: 'Something hard beneath this bed is keeping me awake.'",
        imageUrl: "/the_princess_and_the_pea.png"
      },
      {
        pageNumber: 11,
        title: "Morning Breakfast",
        text: "The next morning at breakfast, the Queen inquired about her guest's rest: 'Did you sleep comfortably?' The visitor replied politely: 'I am afraid I barely slept.'",
        imageUrl: "/the_princess_and_the_pea.png"
      },
      {
        pageNumber: 12,
        title: "An Honest Answer",
        text: "The princess honestly described her uncomfortable night: 'Something hard beneath the mattresses troubled me, and I could hardly close my eyes.'",
        imageUrl: "/the_princess_and_the_pea.png"
      },
      {
        pageNumber: 13,
        title: "The Pea Revealed",
        text: "The Queen smiled and revealed the tiny pea: 'You felt this tiny pea through twenty mattresses and feather beds!' The princess said: 'I only told you the truth.'",
        imageUrl: "/the_princess_and_the_pea.png"
      },
      {
        pageNumber: 14,
        title: "True Character",
        text: "The prince admired the visitor's honesty, modesty, and delicate grace: 'Your truthfulness matters more than appearances.' 'Kindness and honesty matter to me too,' she smiled.",
        imageUrl: "/the_princess_and_the_pea.png"
      },
      {
        pageNumber: 15,
        title: "The Proposal",
        text: "The prince knelt and asked the princess to share a future with him: 'Will you marry me?' The princess answered joyfully: 'Yes, with all my heart.'",
        imageUrl: "/the_princess_and_the_pea.png"
      },
      {
        pageNumber: 16,
        title: "Happily Ever After",
        text: "The kingdom celebrated with a grand royal wedding. The famous pea was placed inside a glass case in the royal museum, and the prince and princess lived happily ever after.",
        imageUrl: "/the_princess_and_the_pea.png"
      }
    ],
    comprehensionQuestions: [
      {
        id: 1,
        question: "Why did the Queen place a tiny pea under twenty mattresses?",
        options: ["To test if the storm-soaked visitor was truly a sensitive and genuine princess", "To play a practical joke on the guest", "To help her sleep better", "Because she was storing peas for winter"],
        answer: "To test if the storm-soaked visitor was truly a sensitive and genuine princess",
        explanation: "The Queen arranged the gentle test to see if the visitor possessed the true sensitivity and honesty of a genuine princess."
      },
      {
        id: 2,
        question: "How did the princess describe her night of sleep to the Queen?",
        options: ["She honestly explained that something hard beneath the mattresses kept her awake", "She lied and claimed she slept peacefully", "She said she did not go to bed at all", "She complained about the rain outside"],
        answer: "She honestly explained that something hard beneath the mattresses kept her awake",
        explanation: "Instead of giving a polite false answer, the princess was completely honest about her uncomfortable night."
      },
      {
        id: 3,
        question: "What is the central moral lesson of 'The Princess and the Pea'?",
        options: ["Do not judge people only by appearances; honesty and character reveal the truth", "Never sleep on tall beds", "Stormy nights always bring guests", "Peas should always be kept in glass cases"],
        answer: "Do not judge people only by appearances; honesty and character reveal the truth",
        explanation: "The story illustrates that true nobility and worth come from inner honesty, sincerity, and character rather than outward appearances."
      }
    ]
  },
  {
    id: 'hansel_and_gretel',
    title: "Hansel and Gretel",
    subtitle: "A story about courage, cleverness and staying together",
    genre: "Classic Fairy Tale",
    emoji: "🍞🏠",
    isFeatured: true,
    isSingleComicSheet: true,
    image: "/hansel_and_gretel.png",
    moral: "Courage and clever thinking can guide us through difficult times. Stay together, help one another, and never lose hope. 🌟✨",
    summary: "When food runs scarce, Hansel and Gretel find themselves lost in the deep woods after hungry birds eat their breadcrumb trail. They discover a magical cottage made of sweet confections, but are captured by a wicked witch. Working bravely together, Hansel outsmarts the witch with a small bone and Gretel cleverly traps the witch in her own oven, breaking the spell and reuniting the joyful family at home.",
    vocabHighlights: [
      { word: "Courage", partOfSpeech: "Noun", definition: "The ability to do something that frightens one; bravery.", pronunciation: "kur-ij", fact: "Hansel and Gretel showed incredible courage when facing challenges in the dark forest!" },
      { word: "Cleverness", partOfSpeech: "Noun", definition: "The quality of being intelligent, ingenious, or quick-witted.", pronunciation: "klev-er-nis", fact: "Hansel's idea to use white pebbles to mark the trail was a brilliant display of cleverness." },
      { word: "Captive", partOfSpeech: "Noun / Adjective", definition: "A person who has been taken prisoner or confined against their will.", pronunciation: "kap-tiv", fact: "Though kept captive, Gretel remained calm and searched for a smart way to escape." },
      { word: "Confection", partOfSpeech: "Noun", definition: "A dish or delicacy made with sweet ingredients such as sugar, candy, and cake.", pronunciation: "kuhn-fek-shuhn", fact: "The gingerbread house was a tempting confection made entirely of treats and frosting." },
      { word: "Perseverance", partOfSpeech: "Noun", definition: "Persistence in doing something despite difficulty or delay in achieving success.", pronunciation: "pur-suh-veer-uhns", fact: "By never losing hope and helping each other, the brother and sister persevered through every test." }
    ],
    pages: [
      {
        pageNumber: 1,
        title: "A Father's Worry",
        text: "A poor woodcutter worried because there was very little food. 'How will I feed my family?' he wondered anxiously.",
        imageUrl: "/hansel_and_gretel.png"
      },
      {
        pageNumber: 2,
        title: "A Troubling Plan",
        text: "That night, Hansel and Gretel heard a troubling plan through the doorway: 'Tomorrow, we must go deep into the forest.'",
        imageUrl: "/hansel_and_gretel.png"
      },
      {
        pageNumber: 3,
        title: "White Pebbles in the Moonlight",
        text: "Hansel quietly collected shiny white pebbles to mark the way home. 'Do not worry, Gretel. I have a plan,' he whispered reassuringly.",
        imageUrl: "/hansel_and_gretel.png"
      },
      {
        pageNumber: 4,
        title: "Marking the Path",
        text: "As they walked into the woods, Hansel dropped white pebbles along the path. 'What are you doing?' asked his father. 'Making sure we can find our way,' replied Hansel.",
        imageUrl: "/hansel_and_gretel.png"
      },
      {
        pageNumber: 5,
        title: "Alone in the Forest",
        text: "When darkness fell, the children found themselves alone by a campfire. 'How will we get home?' asked Gretel. Hansel smiled: 'The moon will show us the way.'",
        imageUrl: "/hansel_and_gretel.png"
      },
      {
        pageNumber: 6,
        title: "The Pebbles Shine",
        text: "The shining pebbles gleamed in the moonlight and led Hansel and Gretel safely home. 'Your plan worked!' cheered Gretel happily.",
        imageUrl: "/hansel_and_gretel.png"
      },
      {
        pageNumber: 7,
        title: "The Breadcrumb Trail",
        text: "On their next journey into the woods, Hansel used breadcrumbs instead of stones: 'These crumbs will mark our path.'",
        imageUrl: "/hansel_and_gretel.png"
      },
      {
        pageNumber: 8,
        title: "The Trail Disappears",
        text: "Hungry woodland birds flew down and ate every single crumb. Gretel gasped: 'The trail has disappeared!'",
        imageUrl: "/hansel_and_gretel.png"
      },
      {
        pageNumber: 9,
        title: "Wandering for Three Days",
        text: "For three long days, the brother and sister wandered through the deep forest. 'We must stay together,' encouraged Hansel warmly.",
        imageUrl: "/hansel_and_gretel.png"
      },
      {
        pageNumber: 10,
        title: "The House of Sweets",
        text: "At last, they discovered an enchanting little house made entirely of gingerbread, frosting, and sweets. 'It looks delicious!' they cried.",
        imageUrl: "/hansel_and_gretel.png"
      },
      {
        pageNumber: 11,
        title: "An Invitation Inside",
        text: "An old woman opened the cottage door and invited the hungry children inside: 'Come in, dears. I have plenty of treats to share.'",
        imageUrl: "/hansel_and_gretel.png"
      },
      {
        pageNumber: 12,
        title: "The Wicked Trap",
        text: "The old woman was actually a wicked witch who planned to keep them captive. 'You cannot leave my house!' cackled the witch as she locked Hansel in a wooden cage.",
        imageUrl: "/hansel_and_gretel.png"
      },
      {
        pageNumber: 13,
        title: "Gretel's Secret Courage",
        text: "Gretel worked quietly around the kitchen while searching for a way to escape. 'Be brave, Hansel. I will help us,' she promised.",
        imageUrl: "/hansel_and_gretel.png"
      },
      {
        pageNumber: 14,
        title: "The Clever Bone Trick",
        text: "Hansel fooled the short-sighted witch by holding out a little bone instead of his finger. The witch grumbled: 'Why are you still so thin?'",
        imageUrl: "/hansel_and_gretel.png"
      },
      {
        pageNumber: 15,
        title: "Gretel's Clever Question",
        text: "Gretel pretended she did not understand how the large bread oven worked: 'Please show me how to look inside.' The witch leaned forward to demonstrate.",
        imageUrl: "/hansel_and_gretel.png"
      },
      {
        pageNumber: 16,
        title: "The Spell is Broken",
        text: "Gretel quickly pushed the witch inside and shut the heavy iron door! The witch's spell broke immediately, and Hansel was set free. 'You saved us!' exclaimed Hansel with a big hug.",
        imageUrl: "/hansel_and_gretel.png"
      },
      {
        pageNumber: 17,
        title: "The Friendly Swan",
        text: "A friendly, graceful white swan carried the children safely across a wide river. 'Thank you, kind swan,' they waved in gratitude.",
        imageUrl: "/hansel_and_gretel.png"
      },
      {
        pageNumber: 18,
        title: "Reunited at Home",
        text: "Their father welcomed them home with open arms, and the family was joyfully together again. 'I am so sorry. I will never leave you again,' promised their father with tears of joy.",
        imageUrl: "/hansel_and_gretel.png"
      }
    ],
    comprehensionQuestions: [
      {
        id: 1,
        question: "How did Hansel mark the trail so the children could find their way home on their first trip?",
        options: ["By dropping shiny white pebbles that gleamed in the moonlight", "By carving arrows into the trees", "By dropping breadcrumbs", "By following a friendly bird"],
        answer: "By dropping shiny white pebbles that gleamed in the moonlight",
        explanation: "Hansel collected shiny white pebbles and dropped them along the path so they could follow them home in the moonlight."
      },
      {
        id: 2,
        question: "How did Hansel trick the short-sighted witch when she checked if he was ready?",
        options: ["He held out a small chicken bone instead of his finger", "He hid behind a curtain", "He wore gloves", "He asked Gretel to answer for him"],
        answer: "He held out a small chicken bone instead of his finger",
        explanation: "Because the witch had poor eyesight, Hansel held out a dry bone so she thought he was still too thin."
      },
      {
        id: 3,
        question: "What is the central moral lesson of 'Hansel and Gretel'?",
        options: ["Courage, clever thinking, and staying together guide us through difficult times", "Never eat sweets in the forest", "Birds always eat breadcrumbs", "Swans are the fastest animals"],
        answer: "Courage, clever thinking, and staying together guide us through difficult times",
        explanation: "The story shows that by remaining brave, using intelligence, and supporting one another, we can overcome hardships and find our way home."
      }
    ]
  },
  {
    id: 'the_gingerbread_man',
    title: "The Gingerbread Man",
    subtitle: "A story about speed, pride and careful thinking",
    genre: "Classic Fairy Tale",
    emoji: "🍪🦊",
    isFeatured: true,
    isSingleComicSheet: true,
    image: "/the_gingerbread_man.png",
    moral: "Being quick is useful, but careful thinking is wiser. Do not let pride make you trust a stranger too easily. 🦊🍪",
    summary: "An old woman bakes a delicious gingerbread man who magically springs to life and dashes away! Boasting of his incredible speed, he outruns the old couple, a farm boy, a hungry cow, and a galloping horse. But when he reaches a wide, rushing river, a sly fox offers him a ride across. Overconfident and too trusting, the Gingerbread Man moves from tail to back, then to head, and finally onto the fox's nose, where the clever fox ends the race!",
    vocabHighlights: [
      { word: "Boastful", partOfSpeech: "Adjective", definition: "Showing excessive pride and self-satisfaction in one's achievements or abilities.", pronunciation: "bohst-fuhl", fact: "The Gingerbread Man's boastful taunts made him careless about who he trusted." },
      { word: "Overconfident", partOfSpeech: "Adjective", definition: "Excessively confident; having too much certainty in one's own power or safety.", pronunciation: "oh-ver-kon-fi-duhnt", fact: "Being overconfident led him directly into the sly fox's trap." },
      { word: "Cunning", partOfSpeech: "Adjective", definition: "Having or showing skill in achieving one's ends by deceit or evasion; crafty.", pronunciation: "kuhn-ing", fact: "The cunning fox pretended to be helpful to get the treat closer to his mouth!" },
      { word: "Dashed", partOfSpeech: "Verb", definition: "Ran or moved with sudden great haste and speed.", pronunciation: "dasht", fact: "The Gingerbread Man dashed right out the cottage door the moment the oven opened." },
      { word: "Prudence", partOfSpeech: "Noun", definition: "The quality of being prudent; acting with care, wisdom, and thought for the future.", pronunciation: "proo-duhns", fact: "Prudence and careful thinking are far more valuable than pure speed." }
    ],
    pages: [
      {
        pageNumber: 1,
        title: "A Special Morning Treat",
        text: "One morning, an old woman decided to bake a special treat. 'I will make a gingerbread man!' she smiled happily.",
        imageUrl: "/the_gingerbread_man.png"
      },
      {
        pageNumber: 2,
        title: "Decorating with Care",
        text: "She shaped the dough and decorated it carefully with frosting buttons. The old man admired her work: 'He looks wonderful!'",
        imageUrl: "/the_gingerbread_man.png"
      },
      {
        pageNumber: 3,
        title: "Into the Warm Oven",
        text: "The old woman placed the gingerbread man into the warm brick oven. 'Soon he will be ready,' she said.",
        imageUrl: "/the_gingerbread_man.png"
      },
      {
        pageNumber: 4,
        title: "Sprang to Life!",
        text: "When the oven door opened, the Gingerbread Man sprang up to life! 'Time to run!' he laughed.",
        imageUrl: "/the_gingerbread_man.png"
      },
      {
        pageNumber: 5,
        title: "Dashing Out the Door",
        text: "He dashed out of the cottage before anyone could stop him. 'Run, run, as fast as you can!' he chanted loudly.",
        imageUrl: "/the_gingerbread_man.png"
      },
      {
        pageNumber: 6,
        title: "The Farm Boy's Chase",
        text: "A farm boy saw the little runner race past. 'Stop! Come back!' called the boy. 'You cannot catch me!' shouted the Gingerbread Man.",
        imageUrl: "/the_gingerbread_man.png"
      },
      {
        pageNumber: 7,
        title: "Past the Hungry Cow",
        text: "Next, he hurried past a hungry cow by the fence. 'You smell delicious!' mooed the cow. 'You cannot catch me!' he boasted.",
        imageUrl: "/the_gingerbread_man.png"
      },
      {
        pageNumber: 8,
        title: "The Horse Joins the Race",
        text: "Then a galloping brown horse joined the chase: 'Wait for me!' The runner giggled: 'I am too fast!'",
        imageUrl: "/the_gingerbread_man.png"
      },
      {
        pageNumber: 9,
        title: "The Grand Village Chase",
        text: "Soon, the whole village was running after him. 'You cannot catch me, I'm the Gingerbread Man!' he sang proudly.",
        imageUrl: "/the_gingerbread_man.png"
      },
      {
        pageNumber: 10,
        title: "Blocked by the Wide River",
        text: "At last, a wide and rushing river blocked his path. 'Oh dear! I cannot swim,' he worried.",
        imageUrl: "/the_gingerbread_man.png"
      },
      {
        pageNumber: 11,
        title: "A Fox's Offer",
        text: "A sly fox appeared from behind the trees and offered to help: 'Ride on my tail, and I will carry you across.'",
        imageUrl: "/the_gingerbread_man.png"
      },
      {
        pageNumber: 12,
        title: "Climbing on the Tail",
        text: "The Gingerbread Man climbed onto the bushy red tail as they entered the water: 'Keep me safe and dry.'",
        imageUrl: "/the_gingerbread_man.png"
      },
      {
        pageNumber: 13,
        title: "Rising Waters",
        text: "The river water rose higher around the swimming fox. 'Move onto my back,' suggested the fox calmly.",
        imageUrl: "/the_gingerbread_man.png"
      },
      {
        pageNumber: 14,
        title: "Onto the Fox's Head",
        text: "The fox claimed the water was becoming even deeper: 'Climb onto my head so you stay dry.'",
        imageUrl: "/the_gingerbread_man.png"
      },
      {
        pageNumber: 15,
        title: "One Final Suggestion",
        text: "Near the far bank, the fox made one final suggestion: 'Step onto my nose so you stay dry.' The Gingerbread Man climbed right onto his snout.",
        imageUrl: "/the_gingerbread_man.png"
      },
      {
        pageNumber: 16,
        title: "The Sly Smile",
        text: "The Gingerbread Man finally noticed the fox's sly smile and realized his mistake: 'Perhaps I trusted too quickly.'",
        imageUrl: "/the_gingerbread_man.png"
      },
      {
        pageNumber: 17,
        title: "Oh, Crumbs!",
        text: "With a sudden quick toss into the air, the clever fox caught the treat and ended the race. 'Oh, crumbs!' gasped the Gingerbread Man.",
        imageUrl: "/the_gingerbread_man.png"
      },
      {
        pageNumber: 18,
        title: "The Final Lesson",
        text: "The Gingerbread Man was never seen running down the lane again. MORAL: Being quick is useful, but careful thinking is wiser. Do not let pride make you trust a stranger too easily.",
        imageUrl: "/the_gingerbread_man.png"
      }
    ],
    comprehensionQuestions: [
      {
        id: 1,
        question: "Why did the Gingerbread Man need help to cross the wide river?",
        options: ["Because gingerbread gets soggy in water and he could not swim", "Because he was tired from running", "Because he forgot his shoes", "Because the river was frozen"],
        answer: "Because gingerbread gets soggy in water and he could not swim",
        explanation: "The Gingerbread Man knew he would dissolve or sink in the water, so he needed a way to cross while staying completely dry."
      },
      {
        id: 2,
        question: "How did the sly fox trick the Gingerbread Man into moving closer to his mouth?",
        options: ["By claiming the water was getting deeper at each step", "By singing a lullaby", "By promising him a pot of gold", "By telling him a funny joke"],
        answer: "By claiming the water was getting deeper at each step",
        explanation: "The fox pretended the river was getting deeper so the Gingerbread Man would move from tail to back, then to head, and finally onto his nose."
      },
      {
        id: 3,
        question: "What is the central moral lesson of 'The Gingerbread Man'?",
        options: ["Being quick is useful, but careful thinking is wiser; do not let pride make you trust strangers too easily", "Always run as fast as you can", "Baking cookies is dangerous", "Foxes are the fastest runners in the forest"],
        answer: "Being quick is useful, but careful thinking is wiser; do not let pride make you trust strangers too easily",
        explanation: "The story teaches us that boastfulness and overconfidence can cloud our judgment, and that careful wisdom is more important than speed."
      }
    ]
  },
  {
    id: 'the_elves_and_the_shoemaker',
    title: "The Elves and the Shoemaker",
    subtitle: "A story about kindness, gratitude and helping others",
    genre: "Classic Fairy Tale",
    emoji: "👞✨",
    isFeatured: true,
    isSingleComicSheet: true,
    image: "/the_elves_and_the_shoemaker.png",
    moral: "Kindness and hard work can change lives. Always remember to thank those who help you. 👞🌟",
    summary: "A hardworking, honest shoemaker and his wife fall on hard times with only enough leather left for one last pair of shoes. During the night, two little magical elves quietly visit the workshop and craft the finest shoes the town has ever seen. As the shop begins to prosper, the grateful couple secretly watches by candlelight and decides to repay the elves' kindness with warm stitched clothes and tiny handcrafted shoes for Christmas Eve.",
    vocabHighlights: [
      { word: "Gratitude", partOfSpeech: "Noun", definition: "The quality of being thankful; readiness to show appreciation for kindness received.", pronunciation: "grat-i-tood", fact: "The shoemaker and his wife felt deep gratitude and wanted to repay the helpful elves!" },
      { word: "Prosper", partOfSpeech: "Verb", definition: "Succeed in material terms; be financially successful and flourish.", pronunciation: "pros-per", fact: "Thanks to the beautiful craftsmanship, the little shoemaker shop began to prosper." },
      { word: "Craftsmanship", partOfSpeech: "Noun", definition: "Skill in a particular craft or the quality of design and work shown in something made by hand.", pronunciation: "krafts-muhn-ship", fact: "The shoes were stitched with such extraordinary craftsmanship that customers paid generous prices." },
      { word: "Generous", partOfSpeech: "Adjective", definition: "Showing a readiness to give more of something, especially money, than is strictly necessary or expected.", pronunciation: "jen-er-uhs", fact: "The first customer was so impressed that he paid a very generous price for the shoes." },
      { word: "Workbench", partOfSpeech: "Noun", definition: "A sturdy wooden table at which a carpenter, shoemaker, or artisan works.", pronunciation: "wurk-bench", fact: "The shoemaker cut his leather neatly on the workbench before going to sleep." }
    ],
    pages: [
      {
        pageNumber: 1,
        title: "The Last Piece of Leather",
        text: "A kind shoemaker and his wife had very little money. 'We have enough leather for only one pair of shoes,' said the shoemaker sadly.",
        imageUrl: "/the_elves_and_the_shoemaker.png"
      },
      {
        pageNumber: 2,
        title: "Preparing for Tomorrow",
        text: "The shoemaker prepared his last piece of leather on his workbench before bedtime. 'I will sew these shoes tomorrow,' he said.",
        imageUrl: "/the_elves_and_the_shoemaker.png"
      },
      {
        pageNumber: 3,
        title: "Midnight Visitors",
        text: "At midnight, two little elves quietly entered the dark workshop through the window. 'Let us help the shoemaker,' they whispered.",
        imageUrl: "/the_elves_and_the_shoemaker.png"
      },
      {
        pageNumber: 4,
        title: "Deft Little Hands",
        text: "Their quick hands stitched and shaped the leather beautifully with hammers and thread: 'These shoes will be our finest work!'",
        imageUrl: "/the_elves_and_the_shoemaker.png"
      },
      {
        pageNumber: 5,
        title: "A Wonderful Morning Surprise",
        text: "In the morning, the finished shoes were waiting neatly on the workbench. The wife gasped in amazement: 'Who could have made them?'",
        imageUrl: "/the_elves_and_the_shoemaker.png"
      },
      {
        pageNumber: 6,
        title: "The Generous Customer",
        text: "A customer came in, loved the shoes, and paid a generous price: 'These are the finest shoes I have ever seen!'",
        imageUrl: "/the_elves_and_the_shoemaker.png"
      },
      {
        pageNumber: 7,
        title: "Leather for Two More Pairs",
        text: "With the money, the couple bought enough leather to make two more pairs. 'Perhaps our luck is changing,' smiled the shoemaker.",
        imageUrl: "/the_elves_and_the_shoemaker.png"
      },
      {
        pageNumber: 8,
        title: "Left Overnight",
        text: "The shoemaker cut out the two pairs and left them on the table overnight: 'I wonder what morning will bring.'",
        imageUrl: "/the_elves_and_the_shoemaker.png"
      },
      {
        pageNumber: 9,
        title: "The Elves Return",
        text: "At midnight, the two friendly elves returned to the workshop. 'There is more work tonight!' they laughed happily.",
        imageUrl: "/the_elves_and_the_shoemaker.png"
      },
      {
        pageNumber: 10,
        title: "Complete by Dawn",
        text: "By dawn, two beautiful new pairs of shoes were complete down to the last stitch: 'Finished just in time!' whispered the elves.",
        imageUrl: "/the_elves_and_the_shoemaker.png"
      },
      {
        pageNumber: 11,
        title: "The Shop Prospers",
        text: "People from all over town admired the shoes, and the little shop began to prosper. 'We can finally live comfortably,' said the shoemaker.",
        imageUrl: "/the_elves_and_the_shoemaker.png"
      },
      {
        pageNumber: 12,
        title: "A Night to Watch",
        text: "The shoemaker and his wife wondered who their secret helpers were. 'Tonight, let us quietly watch,' suggested the wife.",
        imageUrl: "/the_elves_and_the_shoemaker.png"
      },
      {
        pageNumber: 13,
        title: "Secret Helpers Discovered",
        text: "Hidden behind a curtain by candlelight, the couple saw the two hardworking elves: 'So they are our secret helpers!'",
        imageUrl: "/the_elves_and_the_shoemaker.png"
      },
      {
        pageNumber: 14,
        title: "A Plan to Thank Them",
        text: "The couple wanted to thank the elves for their wonderful kindness. 'Let us make them warm clothes and new shoes,' smiled the wife.",
        imageUrl: "/the_elves_and_the_shoemaker.png"
      },
      {
        pageNumber: 15,
        title: "Crafting Tiny Gifts",
        text: "They carefully stitched tiny coats, trousers, and leather boots: 'These tiny shoes are nearly ready,' said the shoemaker.",
        imageUrl: "/the_elves_and_the_shoemaker.png"
      },
      {
        pageNumber: 16,
        title: "Christmas Eve Surprise",
        text: "On Christmas Eve, instead of leather, they placed the gifts on the workbench: 'I hope the elves know how grateful we are.'",
        imageUrl: "/the_elves_and_the_shoemaker.png"
      },
      {
        pageNumber: 17,
        title: "Delight and Joy",
        text: "At midnight, the elves arrived and were delighted by their new green and red clothes: 'These gifts were made for us! What wonderful friends!'",
        imageUrl: "/the_elves_and_the_shoemaker.png"
      },
      {
        pageNumber: 18,
        title: "Dancing into the Night",
        text: "The happy elves dressed up, danced out the door, and the prosperous shop remained full of joy forever. 'Thank you, dear friends!' waved the couple.",
        imageUrl: "/the_elves_and_the_shoemaker.png"
      }
    ],
    comprehensionQuestions: [
      {
        id: 1,
        question: "Who visited the workshop at midnight to make the beautiful shoes?",
        options: ["Two kind and hardworking little elves", "The town mayor", "A friendly customer", "A woodland fairy"],
        answer: "Two kind and hardworking little elves",
        explanation: "Two little elves quietly entered the workshop every night at midnight to help the poor shoemaker."
      },
      {
        id: 2,
        question: "How did the shoemaker and his wife thank the elves on Christmas Eve?",
        options: ["They made them warm stitched clothes and tiny pairs of shoes", "They left out bowls of porridge", "They gave them bags of gold coins", "They closed the workshop"],
        answer: "They made them warm stitched clothes and tiny pairs of shoes",
        explanation: "To show their gratitude, the wife sewed warm clothes and the shoemaker crafted tiny boots for both elves."
      },
      {
        id: 3,
        question: "What is the central moral lesson of 'The Elves and the Shoemaker'?",
        options: ["Kindness and hard work can change lives; always remember to thank those who help you", "Never work at night", "Leather is the most valuable material", "Elves only work on Christmas Eve"],
        answer: "Kindness and hard work can change lives; always remember to thank those who help you",
        explanation: "The story teaches us that selfless kindness brings prosperity and that true gratitude means giving back to those who assist us in times of need."
      }
    ]
  },
  {
    id: 'the_emperors_new_clothes',
    title: "The Emperor's New Clothes",
    subtitle: "A story about honesty, pride and speaking the truth",
    genre: "Classic Fairy Tale",
    emoji: "👑✨",
    isFeatured: true,
    isSingleComicSheet: true,
    image: "/the_emperors_new_clothes.png",
    moral: "Honesty is wiser than pretending. Have the courage to speak the truth, even when others are afraid. 👑🌟",
    summary: "A vain Emperor who cares more about fine robes than ruling wisely is tricked by two clever swindlers who claim to weave magical cloth invisible to foolish people. Afraid of seeming incompetent, the Minister, courtiers, and even the Emperor pretend to see the magnificent fabric. During a grand royal procession, the entire crowd plays along until one innocent, brave child shouts the honest truth: the Emperor is wearing no clothes at all!",
    vocabHighlights: [
      { word: "Swindler", partOfSpeech: "Noun", definition: "A person who uses deception to deprive someone of money or possessions; a fraud.", pronunciation: "swin-dler", fact: "The two swindlers tricked the royal court by pretending to weave magical fabric on empty looms." },
      { word: "Magnificent", partOfSpeech: "Adjective", definition: "Extremely beautiful, elaborate, or impressive.", pronunciation: "mag-nif-uh-suhnt", fact: "The Emperor spent all his gold hoping to wear the most magnificent royal robes in the world." },
      { word: "Incompetent", partOfSpeech: "Adjective", definition: "Not having or showing the necessary skills to do something successfully.", pronunciation: "in-kom-pi-tuhnt", fact: "The court ministers were terrified of being labeled incompetent, so they lied about what they saw." },
      { word: "Procession", partOfSpeech: "Noun", definition: "A number of people or vehicles moving forward in an orderly formal manner, especially as part of a ceremony.", pronunciation: "pruh-sesh-uhn", fact: "The grand procession paraded through the town square with cheering crowds." },
      { word: "Integrity", partOfSpeech: "Noun", definition: "The quality of being honest and having strong moral principles.", pronunciation: "in-teg-ri-tee", fact: "The young child showed true integrity by speaking the truth when everyone else pretended." }
    ],
    pages: [
      {
        pageNumber: 1,
        title: "A Love of Fashion",
        text: "The Emperor cared more about fine clothes than ruling wisely. 'Which magnificent coat shall I wear today?' he asked admiringly.",
        imageUrl: "/the_emperors_new_clothes.png"
      },
      {
        pageNumber: 2,
        title: "Two Clever Tricksters",
        text: "Two clever swindlers arrived at the palace with an extraordinary claim: 'We can weave the finest cloth in the world.'",
        imageUrl: "/the_emperors_new_clothes.png"
      },
      {
        pageNumber: 3,
        title: "A Magical Claim",
        text: "They claimed foolish people could not see their magical fabric. The Emperor was intrigued: 'Only wise people can see its beauty.'",
        imageUrl: "/the_emperors_new_clothes.png"
      },
      {
        pageNumber: 4,
        title: "Gold for the Work",
        text: "The delighted Emperor paid them bags of heavy gold coins to begin at once: 'Make me a splendid royal outfit!'",
        imageUrl: "/the_emperors_new_clothes.png"
      },
      {
        pageNumber: 5,
        title: "Empty Looms",
        text: "The swindlers set up looms and pretended to weave on thin air. 'Such dazzling colours!' they exclaimed to the guards.",
        imageUrl: "/the_emperors_new_clothes.png"
      },
      {
        pageNumber: 6,
        title: "The Minister Visits",
        text: "The Emperor sent his trusted Prime Minister to inspect the cloth. Looking at the empty loom, the Minister panicked: 'I cannot see anything!'",
        imageUrl: "/the_emperors_new_clothes.png"
      },
      {
        pageNumber: 7,
        title: "Afraid to be Honest",
        text: "The worried Minister was afraid to tell the truth lest he seem foolish: 'The pattern is truly remarkable,' he lied.",
        imageUrl: "/the_emperors_new_clothes.png"
      },
      {
        pageNumber: 8,
        title: "A False Report",
        text: "The Minister returned to the throne room and praised the cloth he had never seen: 'Your Majesty, the fabric is magnificent.'",
        imageUrl: "/the_emperors_new_clothes.png"
      },
      {
        pageNumber: 9,
        title: "The Emperor Looks",
        text: "The Emperor visited the weavers himself but saw nothing at all. He worried: 'Am I not wise enough to see it?'",
        imageUrl: "/the_emperors_new_clothes.png"
      },
      {
        pageNumber: 10,
        title: "Pride Takes Over",
        text: "Too proud to admit the truth, the Emperor pretended: 'What wonderful colours! What exquisite embroidery!'",
        imageUrl: "/the_emperors_new_clothes.png"
      },
      {
        pageNumber: 11,
        title: "Pretend Tailoring",
        text: "All night before the grand parade, the swindlers pretended to cut and sew with empty scissors: 'The royal outfit is almost finished.'",
        imageUrl: "/the_emperors_new_clothes.png"
      },
      {
        pageNumber: 12,
        title: "The Invisible Outfit",
        text: "The swindlers pretended to dress the Emperor in invisible robes: 'The outfit is as light as air, Your Majesty.'",
        imageUrl: "/the_emperors_new_clothes.png"
      },
      {
        pageNumber: 13,
        title: "Praise in the Mirror",
        text: "Everyone praised the invisible outfit because nobody wanted to seem foolish: 'You look magnificent, Your Majesty.'",
        imageUrl: "/the_emperors_new_clothes.png"
      },
      {
        pageNumber: 14,
        title: "The Parade Begins",
        text: "The Emperor proudly began his grand parade through the city streets: 'Let everyone admire my new clothes!'",
        imageUrl: "/the_emperors_new_clothes.png"
      },
      {
        pageNumber: 15,
        title: "The Crowd Pretends",
        text: "The townspeople lined the street and pretended they could see the marvellous outfit: 'What beautiful fabric!' they cheered.",
        imageUrl: "/the_emperors_new_clothes.png"
      },
      {
        pageNumber: 16,
        title: "One Honest Voice",
        text: "Then one honest child in the crowd pointed and spoke clearly: 'The Emperor is not wearing any royal clothes!'",
        imageUrl: "/the_emperors_new_clothes.png"
      },
      {
        pageNumber: 17,
        title: "The Truth Spreads",
        text: "The simple truth spread through the laughing crowd like wildfire: 'The child is right! He has nothing on!'",
        imageUrl: "/the_emperors_new_clothes.png"
      },
      {
        pageNumber: 18,
        title: "A Wiser Emperor",
        text: "The Emperor blushed, but chose honesty over pride and learned an important lifelong lesson. He thanked the child: 'Thank you for telling me the truth.'",
        imageUrl: "/the_emperors_new_clothes.png"
      }
    ],
    comprehensionQuestions: [
      {
        id: 1,
        question: "Why did the Minister and the Emperor pretend they could see the invisible fabric?",
        options: ["Because they were afraid of being seen as foolish or unfit for their jobs", "Because the cloth glowed in the dark", "Because they wanted to surprise the crowd", "Because the weavers threatened them"],
        answer: "Because they were afraid of being seen as foolish or unfit for their jobs",
        explanation: "The swindlers claimed that only wise people could see the fabric, so everyone pretended to see it to avoid appearing foolish."
      },
      {
        id: 2,
        question: "Who finally had the courage to speak the truth during the grand royal parade?",
        options: ["An honest young child in the crowd", "The Minister of State", "The Queen", "The Emperor's guard"],
        answer: "An honest young child in the crowd",
        explanation: "While all the adults pretended out of fear, an innocent child spoke the simple truth that the Emperor had no clothes on."
      },
      {
        id: 3,
        question: "What is the central moral lesson of 'The Emperor's New Clothes'?",
        options: ["Honesty is wiser than pretending; have the courage to speak the truth even when others are afraid", "Always buy expensive silk robes", "Parades should only be held in the summer", "Weavers make the best advisors"],
        answer: "Honesty is wiser than pretending; have the courage to speak the truth even when others are afraid",
        explanation: "The fable teaches that pride and peer pressure lead people to pretend, but true wisdom and integrity come from speaking the truth."
      }
    ]
  },
  {
    id: 'the_bremen_town_musicians',
    title: "The Bremen Town Musicians",
    subtitle: "A story about friendship, teamwork and finding a new home",
    genre: "Classic Fairy Tale",
    emoji: "🎶🐴🐶",
    isFeatured: true,
    isSingleComicSheet: true,
    image: "/the_bremen_town_musicians.png",
    moral: "Together, our different strengths become powerful. True friends help one another find courage, purpose and a place to belong. 🎶🏡✨",
    summary: "An aging donkey, hound, cat, and rooster set off together to become musicians in the town of Bremen. When darkness falls in the deep forest, they spot a warm cottage where three robbers are eating a grand feast. Standing on each other's backs to form a tall tower, the four friends belt out a thunderous chorus that scares the robbers away forever, finding friendship, safety, and a cozy home of their own.",
    vocabHighlights: [
      { word: "Musician", partOfSpeech: "Noun", definition: "A person who plays a musical instrument or sings, especially as a profession.", pronunciation: "myoo-zish-uhn", fact: "The four animal friends formed their own band and set out to become town musicians!" },
      { word: "Remarkable", partOfSpeech: "Adjective", definition: "Worthy of attention; striking or extraordinary.", pronunciation: "ri-mahr-kuh-buhl", fact: "By balancing on top of each other, they formed a remarkable four-story animal tower." },
      { word: "Abandoned", partOfSpeech: "Adjective", definition: "Having been deserted or left behind.", pronunciation: "uh-ban-duhnd", fact: "The frightened robbers ran into the forest and left an abandoned feast on the table." },
      { word: "Thunderous", partOfSpeech: "Adjective", definition: "Making a loud, deep, reverberating noise like thunder.", pronunciation: "thuhn-der-uhs", fact: "When all four animals sang together, they produced a thunderous concert that shook the windows." },
      { word: "Purpose", partOfSpeech: "Noun", definition: "The reason for which something is done or created or for which a person exists; determination.", pronunciation: "pur-puhs", fact: "By supporting each other, the old friends found new purpose, joy, and a place to belong." }
    ],
    pages: [
      {
        pageNumber: 1,
        title: "A New Journey to Bremen",
        text: "An old donkey decided to seek a new life in Bremen. 'I can become a town musician!' he said optimistically.",
        imageUrl: "/the_bremen_town_musicians.png"
      },
      {
        pageNumber: 2,
        title: "Meeting the Hound",
        text: "Along the road, the donkey met an old hunting dog resting by a fence. 'Come to Bremen and make music with me,' invited the donkey.",
        imageUrl: "/the_bremen_town_musicians.png"
      },
      {
        pageNumber: 3,
        title: "A Homeless Cat Joins In",
        text: "Next, they found an old cat who needed a home. 'May I join your band?' purred the friendly cat.",
        imageUrl: "/the_bremen_town_musicians.png"
      },
      {
        pageNumber: 4,
        title: "The Rooster's Powerful Voice",
        text: "A rooster with a powerful voice became their fourth musician: 'Cock-a-doodle-doo! I will sing loud and clear!'",
        imageUrl: "/the_bremen_town_musicians.png"
      },
      {
        pageNumber: 5,
        title: "Setting Off Together",
        text: "The four new companions set off down the country road together: 'Our band will be wonderful!' beamed the donkey.",
        imageUrl: "/the_bremen_town_musicians.png"
      },
      {
        pageNumber: 6,
        title: "Practising Harmony",
        text: "They practised their unusual music along the way with barks, brays, and crows: 'We each have a special voice,' said the donkey.",
        imageUrl: "/the_bremen_town_musicians.png"
      },
      {
        pageNumber: 7,
        title: "Nightfall in the Woods",
        text: "By nightfall, the tired travellers needed food and shelter: 'Let us find somewhere warm to sleep,' they agreed.",
        imageUrl: "/the_bremen_town_musicians.png"
      },
      {
        pageNumber: 8,
        title: "A Light in the Forest",
        text: "The rooster flew up to a branch and spotted a warm light shining through the trees: 'There is a cottage ahead!'",
        imageUrl: "/the_bremen_town_musicians.png"
      },
      {
        pageNumber: 9,
        title: "The Robbers' Feast",
        text: "Inside the cottage window, three robbers enjoyed a grand feast: 'That food smells delicious,' whispered the hungry friends.",
        imageUrl: "/the_bremen_town_musicians.png"
      },
      {
        pageNumber: 10,
        title: "A Clever Concert Plan",
        text: "The friends invented a clever way to frighten the robbers away: 'We will perform our music together!'",
        imageUrl: "/the_bremen_town_musicians.png"
      },
      {
        pageNumber: 11,
        title: "The Four-Story Tower",
        text: "They carefully climbed into one remarkable tower: dog on donkey, cat on dog, rooster on cat. 'Ready, everyone?' asked the rooster.",
        imageUrl: "/the_bremen_town_musicians.png"
      },
      {
        pageNumber: 12,
        title: "The Thunderous Symphony",
        text: "The four musicians made the loudest music the forest had ever heard: 'Hee-haw! Woof! Meow! Cock-a-doodle-doo!' through the glass window.",
        imageUrl: "/the_bremen_town_musicians.png"
      },
      {
        pageNumber: 13,
        title: "Frightened Robbers Flee",
        text: "Certain that a giant woodland monster had arrived, the terrified robbers ran into the dark forest: 'That cottage is haunted!'",
        imageUrl: "/the_bremen_town_musicians.png"
      },
      {
        pageNumber: 14,
        title: "Feasting with Gratitude",
        text: "The hungry friends sat around the table and enjoyed the abandoned feast: 'Teamwork tastes wonderful!' cheered the hound.",
        imageUrl: "/the_bremen_town_musicians.png"
      },
      {
        pageNumber: 15,
        title: "A Cozy Bed for Everyone",
        text: "Each musician found a comfortable place to sleep near the warm fireplace: 'This already feels like home,' purred the cat.",
        imageUrl: "/the_bremen_town_musicians.png"
      },
      {
        pageNumber: 16,
        title: "The Robber Returns",
        text: "Later that night, one robber crept back quietly to investigate: 'I will see what is inside the cottage.'",
        imageUrl: "/the_bremen_town_musicians.png"
      },
      {
        pageNumber: 17,
        title: "The Midnight Surprise",
        text: "The musicians sprang up in the dark and surprised him with claws, teeth, and a thunderous 'Cock-a-doodle-doo!'",
        imageUrl: "/the_bremen_town_musicians.png"
      },
      {
        pageNumber: 18,
        title: "A True Home Found",
        text: "The robbers never returned, and the four happy friends stayed together forever: 'We found something better than Bremen—a home!'",
        imageUrl: "/the_bremen_town_musicians.png"
      }
    ],
    comprehensionQuestions: [
      {
        id: 1,
        question: "Which four animals joined together to form the band of musicians?",
        options: ["A donkey, a dog, a cat, and a rooster", "A lion, a tiger, a bear, and an owl", "A horse, a sheep, a goat, and a goose", "A wolf, a fox, a hare, and a crow"],
        answer: "A donkey, a dog, a cat, and a rooster",
        explanation: "The story features an old donkey, a faithful hound, a stray cat, and a lively rooster who journey together."
      },
      {
        id: 2,
        question: "How did the four friends frighten the robbers away from the cottage?",
        options: ["By standing on each other's backs to form a tower and singing loudly together", "By setting off fireworks", "By wearing monster masks", "By rolling heavy rocks against the door"],
        answer: "By standing on each other's backs to form a tower and singing loudly together",
        explanation: "They stacked on top of one another to appear like a giant creature and made a thunderous chorus through the window."
      },
      {
        id: 3,
        question: "What is the central moral lesson of 'The Bremen Town Musicians'?",
        options: ["Together, our different strengths become powerful; true friends help one another find courage, purpose, and a home", "Never travel through forests at night", "Robbers always like soup", "Music should only be played in big cities"],
        answer: "Together, our different strengths become powerful; true friends help one another find courage, purpose, and a home",
        explanation: "The fable teaches that by combining our unique strengths and standing united, we can overcome any obstacle and find a place to belong."
      }
    ]
  },
  {
    id: 'the_little_red_hen',
    title: "The Little Red Hen",
    subtitle: "A story about hard work, responsibility and earning rewards",
    genre: "Classic Fable",
    emoji: "🌾🍞🐔",
    isFeatured: true,
    isSingleComicSheet: true,
    image: "/the_little_red_hen.png",
    moral: "Rewards are earned through effort and responsibility. When everyone helps with the work, everyone can share the result. 🌾🍞✨",
    summary: "When the hardworking Little Red Hen discovers a few grains of wheat, she asks her barnyard friends—the Cat, Dog, and Duck—for help at every step: planting the seeds, harvesting the crop, threshing the grain, milling the flour, kneading the dough, and baking the bread. Each time, they all reply 'Not I!' But when the warm, golden loaf is baked, everyone volunteers to eat it. The wise Hen reminds them that true rewards belong to those who share the effort.",
    vocabHighlights: [
      { word: "Harvest", partOfSpeech: "Verb / Noun", definition: "The process or period of gathering in crops.", pronunciation: "hahr-vist", fact: "The Little Red Hen harvested all the golden wheat stalks with her sickle when they were fully grown." },
      { word: "Thresh", partOfSpeech: "Verb", definition: "Separate grain from a plant, typically with a flail or mechanical tool.", pronunciation: "thresh", fact: "Threshing was hard work, but the Hen carefully separated every seed from the chaff." },
      { word: "Responsibility", partOfSpeech: "Noun", definition: "The state or fact of having a duty to deal with something or of having control over someone.", pronunciation: "ri-spon-suh-bil-i-tee", fact: "Taking responsibility for our tasks ensures that we learn, grow, and achieve our goals." },
      { word: "Knead", partOfSpeech: "Verb", definition: "Work moistened flour or clay into dough or paste with the hands.", pronunciation: "need", fact: "The Hen mixed the flour with water and kneaded the dough smoothly on the table." },
      { word: "Effort", partOfSpeech: "Noun", definition: "A vigorous or determined attempt; the exertion of physical or mental energy.", pronunciation: "ef-ert", fact: "Great achievements and delicious rewards always require dedicated effort and teamwork." }
    ],
    pages: [
      {
        pageNumber: 1,
        title: "Grains of Wheat",
        text: "One morning, the Little Red Hen found some grains of wheat. 'These seeds could grow into something wonderful!' she clucked happily.",
        imageUrl: "/the_little_red_hen.png"
      },
      {
        pageNumber: 2,
        title: "Asking the Cat",
        text: "The Hen asked the lazy Cat to help plant the wheat: 'Will you help me plant these seeds?' The Cat purred: 'Not I.'",
        imageUrl: "/the_little_red_hen.png"
      },
      {
        pageNumber: 3,
        title: "Asking the Dog",
        text: "Next, she asked the Dog resting in the barnyard: 'Will you help me plant the wheat?' The Dog barked: 'Not I.'",
        imageUrl: "/the_little_red_hen.png"
      },
      {
        pageNumber: 4,
        title: "Asking the Duck",
        text: "Then, the Hen asked the Duck swimming by the pond: 'Will you help me plant the wheat?' The Duck quacked: 'Not I.'",
        imageUrl: "/the_little_red_hen.png"
      },
      {
        pageNumber: 5,
        title: "Planting Every Seed",
        text: "So the Little Red Hen planted every seed herself in the soil: 'Then I will do it,' she said cheerfully.",
        imageUrl: "/the_little_red_hen.png"
      },
      {
        pageNumber: 6,
        title: "Growing Tall and Golden",
        text: "With sunshine, rain and patient daily care, the wheat grew tall, strong, and golden in the summer breeze.",
        imageUrl: "/the_little_red_hen.png"
      },
      {
        pageNumber: 7,
        title: "Time to Harvest",
        text: "When the wheat was ripe, the Hen asked for help again: 'Who will help me cut the wheat?' All three replied: 'Not I.'",
        imageUrl: "/the_little_red_hen.png"
      },
      {
        pageNumber: 8,
        title: "Cutting the Wheat",
        text: "The Little Red Hen harvested all the heavy wheat bundles herself: 'Then I will do it,' she sighed.",
        imageUrl: "/the_little_red_hen.png"
      },
      {
        pageNumber: 9,
        title: "Threshing the Grain",
        text: "The grain still had to be separated from the stalks: 'Who will help me thresh the wheat?' Once again, all three said: 'Not I.'",
        imageUrl: "/the_little_red_hen.png"
      },
      {
        pageNumber: 10,
        title: "Threshing Alone",
        text: "Once again, the Hen completed the hard threshing work alone on the barn floor: 'Then I will do it.'",
        imageUrl: "/the_little_red_hen.png"
      },
      {
        pageNumber: 11,
        title: "Carrying to the Mill",
        text: "Next, the heavy grain needed to be ground into flour: 'Who will help me carry the grain?' 'Not I,' said the Cat, Dog, and Duck.",
        imageUrl: "/the_little_red_hen.png"
      },
      {
        pageNumber: 12,
        title: "Returning with White Flour",
        text: "The Hen carried the sack of grain to the windmill and returned with a heavy bag of pure white flour.",
        imageUrl: "/the_little_red_hen.png"
      },
      {
        pageNumber: 13,
        title: "Making the Dough",
        text: "The Hen was ready to turn the flour into dough: 'Who will help me mix the dough?' 'Not I,' chorused all three friends.",
        imageUrl: "/the_little_red_hen.png"
      },
      {
        pageNumber: 14,
        title: "Kneading with Care",
        text: "The Little Red Hen mixed and kneaded the dough herself until it was round and smooth: 'Then I will do it.'",
        imageUrl: "/the_little_red_hen.png"
      },
      {
        pageNumber: 15,
        title: "Ready for the Oven",
        text: "At last, the bread was ready for the wood-fired oven: 'Who will help me bake the bread?' 'Not I,' said the three animals.",
        imageUrl: "/the_little_red_hen.png"
      },
      {
        pageNumber: 16,
        title: "Fresh Warm Bread",
        text: "Soon, the freshly baked warm bread filled the farmhouse with a wonderful, mouth-watering aroma: 'The bread is ready!'",
        imageUrl: "/the_little_red_hen.png"
      },
      {
        pageNumber: 17,
        title: "Eager to Eat",
        text: "Now all three friends were eager to help: 'Who will help me eat the bread?' 'I will!' cried the Cat, Dog, and Duck.",
        imageUrl: "/the_little_red_hen.png"
      },
      {
        pageNumber: 18,
        title: "A Lesson in Sharing",
        text: "The Hen enjoyed the delicious bread she had worked so hard to make: 'Those who share the work may share the reward.' From that day on, everyone helped!",
        imageUrl: "/the_little_red_hen.png"
      }
    ],
    comprehensionQuestions: [
      {
        id: 1,
        question: "How did the Cat, Dog, and Duck answer whenever the Little Red Hen asked for help?",
        options: ["'Not I.'", "'We will help right away!'", "'Ask the farmer.'", "'Only after lunch.'"],
        answer: "'Not I.'",
        explanation: "Every time the Hen asked for help planting, harvesting, threshing, or baking, all three animals refused by saying 'Not I.'"
      },
      {
        id: 2,
        question: "When did the three animals finally want to help the Little Red Hen?",
        options: ["When the warm, fresh bread was ready to be eaten", "When it was time to plant the seeds", "When it started raining", "When they were carrying the flour from the mill"],
        answer: "When the warm, fresh bread was ready to be eaten",
        explanation: "The three friends only offered to help when the hard work was finished and the delicious loaf of bread was on the table."
      },
      {
        id: 3,
        question: "What is the central moral lesson of 'The Little Red Hen'?",
        options: ["Rewards are earned through effort and responsibility; when everyone helps with the work, everyone can share the result", "Hens make better bread than ducks", "Wheat only grows in sunny weather", "Cats prefer sleeping on straw"],
        answer: "Rewards are earned through effort and responsibility; when everyone helps with the work, everyone can share the result",
        explanation: "The story teaches us the value of hard work, personal responsibility, and that those who participate in the effort deserve to enjoy the rewards."
      }
    ]
  },
  {
    id: 'stone_soup',
    title: "Stone Soup",
    subtitle: "A story about sharing, cooperation and building community",
    genre: "Classic Folklore",
    emoji: "🍲🪨🥕",
    isFeatured: true,
    isSingleComicSheet: true,
    image: "/stone_soup.png",
    moral: "When everyone contributes a little, there can be enough for all. Sharing and cooperation can build a stronger community. 🍲🪨✨",
    summary: "Three hungry travellers arrive in a wary village where residents keep their doors closed and claim their cupboards are bare. To bring everyone together, the travellers place three smooth stones into a giant kettle of boiling water in the town square, announcing they are cooking magical 'Stone Soup.' Intrigued by the curiosity, villagers gradually step forward to contribute salt, carrots, potatoes, beans, cabbage, and herbs. Soon, a rich, fragrant feast is born from the shared contributions of the entire community.",
    vocabHighlights: [
      { word: "Cooperation", partOfSpeech: "Noun", definition: "The process of working together to the same end.", pronunciation: "koh-op-uh-rey-shuhn", fact: "By practicing cooperation, the villagers transformed a pot of plain water into a nutritious feast." },
      { word: "Contribute", partOfSpeech: "Verb", definition: "Give something in order to help achieve or provide something.", pronunciation: "kuhn-trib-yoot", fact: "Each villager contributed one small ingredient from their garden or pantry." },
      { word: "Abundance", partOfSpeech: "Noun", definition: "A very large quantity of something; plentifulness of the good things of life.", pronunciation: "uh-buhn-duhns", fact: "When everyone pooled their small resources together, scarcity turned into abundance." },
      { word: "Generosity", partOfSpeech: "Noun", definition: "The quality of being kind and plentiful in giving to others.", pronunciation: "jen-uh-ros-i-tee", fact: "Generosity unlocked the hearts of the villagers and brought the whole town together." },
      { word: "Simmer", partOfSpeech: "Verb", definition: "Stay just below the boiling point while bubbling gently.", pronunciation: "sim-er", fact: "The kettle gently simmered over the warm fire, blending all the fresh garden flavors together." }
    ],
    pages: [
      {
        pageNumber: 1,
        title: "Arrival in the Village",
        text: "Three hungry travellers arrived at a quiet village after a long journey: 'Perhaps someone will share a little food,' they hoped.",
        imageUrl: "/stone_soup.png"
      },
      {
        pageNumber: 2,
        title: "Fear of Scarcity",
        text: "The villagers feared they did not have enough food to share with strangers: 'Our cupboards are almost empty,' they said.",
        imageUrl: "/stone_soup.png"
      },
      {
        pageNumber: 3,
        title: "Asking the Elder",
        text: "Rowan politely asked the village Elder for something to eat: 'Could you spare a small meal?' The Elder replied: 'I am sorry, but I have nothing to give.'",
        imageUrl: "/stone_soup.png"
      },
      {
        pageNumber: 4,
        title: "A Clever Idea",
        text: "The travellers thought of a clever way to bring everyone together: 'We will make stone soup!'",
        imageUrl: "/stone_soup.png"
      },
      {
        pageNumber: 5,
        title: "The Pot in the Square",
        text: "They filled a large iron pot with water over a fire in the village square. A curious child asked: 'What are you making?'",
        imageUrl: "/stone_soup.png"
      },
      {
        pageNumber: 6,
        title: "Three Clean Stones",
        text: "The travellers added three smooth, clean stones to the pot: 'The finest stone soup in all the land!' Rowan announced.",
        imageUrl: "/stone_soup.png"
      },
      {
        pageNumber: 7,
        title: "Gathering Curiosity",
        text: "The wonderful idea soon attracted the whole village: 'Can soup truly be made from stones?' they wondered.",
        imageUrl: "/stone_soup.png"
      },
      {
        pageNumber: 8,
        title: "A Pinch of Salt",
        text: "Timo tasted the broth and said: 'A pinch of salt would improve it.' A woman smiled: 'I can bring some from my kitchen!'",
        imageUrl: "/stone_soup.png"
      },
      {
        pageNumber: 9,
        title: "Fresh Sweet Carrots",
        text: "The Farmer contributed a basket of fresh orange carrots: 'These will add sweetness and crunch to the pot.'",
        imageUrl: "/stone_soup.png"
      },
      {
        pageNumber: 10,
        title: "Hearty Potatoes",
        text: "The Elder remembered a stash of potatoes in her cupboard: 'These will make the soup hearty and rich.'",
        imageUrl: "/stone_soup.png"
      },
      {
        pageNumber: 11,
        title: "A Cup of Beans",
        text: "The Child ran home and found a cup of dried beans to share: 'I want to help too!' he cheered.",
        imageUrl: "/stone_soup.png"
      },
      {
        pageNumber: 12,
        title: "Crisp Green Cabbage",
        text: "The Baker arrived and added some crisp green cabbage: 'Now it looks like a royal feast!'",
        imageUrl: "/stone_soup.png"
      },
      {
        pageNumber: 13,
        title: "Fresh Garden Herbs",
        text: "A generous handful of fresh garden herbs completed the recipe: 'The soup smells absolutely wonderful,' said the child.",
        imageUrl: "/stone_soup.png"
      },
      {
        pageNumber: 14,
        title: "Simmering Together",
        text: "Everyone waited happily together while the stone soup gently simmered: 'Good things grow when everyone contributes,' noted the Elder.",
        imageUrl: "/stone_soup.png"
      },
      {
        pageNumber: 15,
        title: "An Irresistible Aroma",
        text: "Soon, a delicious, mouthwatering aroma filled the village square: 'It smells better than any soup before!'",
        imageUrl: "/stone_soup.png"
      },
      {
        pageNumber: 16,
        title: "Setting the Grand Table",
        text: "Together, they prepared a long table with bowls and fresh bread: 'There is plenty when we share,' Rowan smiled.",
        imageUrl: "/stone_soup.png"
      },
      {
        pageNumber: 17,
        title: "A Joyful Community Feast",
        text: "The villagers and travellers sat side by side and shared a joyful feast: 'This is the best soup I have ever tasted!'",
        imageUrl: "/stone_soup.png"
      },
      {
        pageNumber: 18,
        title: "The Wisdom of Sharing",
        text: "The village discovered that generosity could turn little things into abundance: 'You taught us the joy of sharing!'",
        imageUrl: "/stone_soup.png"
      }
    ],
    comprehensionQuestions: [
      {
        id: 1,
        question: "Why did the travellers say they were making soup from stones?",
        options: ["To inspire curiosity and encourage the villagers to contribute their own ingredients", "Because stones taste delicious when boiled", "Because they had forgotten their cooking pots", "Because the king ordered them to cook stones"],
        answer: "To inspire curiosity and encourage the villagers to contribute their own ingredients",
        explanation: "The travellers used the curiosity of 'Stone Soup' to overcome fear and encourage each villager to share a small ingredient from their home."
      },
      {
        id: 2,
        question: "What happened when each villager contributed one small ingredient to the pot?",
        options: ["The pot turned into a rich, delicious feast that fed the entire village", "The soup burned", "There was not enough food for everyone", "The stones dissolved into salt"],
        answer: "The pot turned into a rich, delicious feast that fed the entire village",
        explanation: "By combining carrots, potatoes, beans, cabbage, salt, and herbs, their small individual contributions created a hearty feast for all."
      },
      {
        id: 3,
        question: "What is the central moral lesson of 'Stone Soup'?",
        options: ["When everyone contributes a little, there can be enough for all; sharing and cooperation build strong communities", "Never talk to hungry travellers", "Always hide vegetables in the cellar", "Soup must only be cooked by elders"],
        answer: "When everyone contributes a little, there can be enough for all; sharing and cooperation build strong communities",
        explanation: "The classic tale demonstrates that sharing and mutual cooperation transform scarcity into abundance and bring people together in harmony."
      }
    ]
  },
  {
    id: 'the_lion_and_the_bull',
    title: "The Lion and the Bull",
    subtitle: "A Panchatantra tale about friendship, jealousy and dangerous rumours",
    genre: "Panchatantra Classic",
    emoji: "🦁🐂🌿",
    isFeatured: true,
    isSingleComicSheet: true,
    image: "/the_lion_and_the_bull.png",
    moral: "Never let rumours destroy a true friendship. Verify what you hear, speak honestly, and beware of those who create conflict for personal gain. 🦁🐂✨",
    summary: "When the mighty bull Sanjivaka is separated from his caravan during a storm, his deep bellow echoes through the forest. Pingalaka, the Lion King, is terrified by the unknown roar until his clever jackal minister, Damanaka, introduces them. The Lion and the Bull become inseparable, wise companions. Jealous of their bond and losing influence, Damanaka plots deceitful lies, whispering to Pingalaka that the Bull wants his throne and telling Sanjivaka that the Lion plans an ambush. Tricked by unverified rumours rather than open communication, their cherished friendship is tragically lost.",
    vocabHighlights: [
      { word: "Confront", partOfSpeech: "Verb", definition: "Meet someone face to face with hostile or argumentative intent; face up to and deal with a problem.", pronunciation: "kuhn-fruhnt", fact: "Instead of talking peacefully, fear caused the two friends to confront one another in anger." },
      { word: "Deceitful", partOfSpeech: "Adjective", definition: "Guilty of or involving deceit; misleading others through falsehoods.", pronunciation: "dih-seet-fuhl", fact: "Damanaka used deceitful rumours to poison the trust between the Lion and the Bull." },
      { word: "Bellow", partOfSpeech: "Verb / Noun", definition: "Emit a deep, loud roar, typically in pain or anger; a loud deep sound.", pronunciation: "bel-oh", fact: "Sanjivaka's mighty bellow echoed across the hills and startled all the woodland creatures." },
      { word: "Jealousy", partOfSpeech: "Noun", definition: "A feeling of envy or resentment towards someone because of their achievements or relationships.", pronunciation: "jel-uh-see", fact: "Damanaka's bitter jealousy led him to plot against a peaceful friendship." },
      { word: "Verify", partOfSpeech: "Verb", definition: "Make sure or demonstrate that something is true, accurate, or justified.", pronunciation: "ver-uh-fahy", fact: "Wise leaders always verify the facts before believing harmful rumours." }
    ],
    pages: [
      {
        pageNumber: 1,
        title: "A Faithful Companion",
        text: "A merchant travelled through the dense forest with his faithful, strong bull, Sanjivaka: 'Steady, my strong friend,' the merchant said.",
        imageUrl: "/the_lion_and_the_bull.png"
      },
      {
        pageNumber: 2,
        title: "Separated by the Storm",
        text: "A fierce monsoon storm separated Sanjivaka from the merchant's caravan. The merchant called in vain: 'Sanjivaka! Where are you?'",
        imageUrl: "/the_lion_and_the_bull.png"
      },
      {
        pageNumber: 3,
        title: "Restoring Strength",
        text: "Fresh green grass and cool river water soon made the lonely bull strong and healthy again: 'This peaceful river has restored my strength.'",
        imageUrl: "/the_lion_and_the_bull.png"
      },
      {
        pageNumber: 4,
        title: "The Mighty Bellow",
        text: "One bright morning, Sanjivaka's mighty bellow echoed deep through the forest: 'Moooo!' shaking the tree branches.",
        imageUrl: "/the_lion_and_the_bull.png"
      },
      {
        pageNumber: 5,
        title: "The Lion King's Fear",
        text: "Pingalaka, the Lion King, had never heard such a booming sound in his kingdom: 'What enormous creature could make that roar?' he wondered in fear.",
        imageUrl: "/the_lion_and_the_bull.png"
      },
      {
        pageNumber: 6,
        title: "The Jackals Observe",
        text: "The jackals Damanaka and Karataka noticed their king's hidden fear. Karataka warned: 'We should not interfere without understanding.'",
        imageUrl: "/the_lion_and_the_bull.png"
      },
      {
        pageNumber: 7,
        title: "Damanaka's Offer",
        text: "Damanaka saw an opportunity to gain power and offered to investigate: 'My King, I will discover the source of the mysterious sound.'",
        imageUrl: "/the_lion_and_the_bull.png"
      },
      {
        pageNumber: 8,
        title: "Finding the Peaceful Bull",
        text: "Damanaka found that the frightening creature was only a gentle, peaceful bull grazing by the river: 'The Lion King wishes to meet you.'",
        imageUrl: "/the_lion_and_the_bull.png"
      },
      {
        pageNumber: 9,
        title: "A Peaceful Introduction",
        text: "Damanaka introduced Sanjivaka to Pingalaka. The bull bowed politely: 'I come as a humble friend, not an enemy.'",
        imageUrl: "/the_lion_and_the_bull.png"
      },
      {
        pageNumber: 10,
        title: "An Inseparable Bond",
        text: "The Lion and the Bull soon became trusted companions. Pingalaka smiled: 'Your wisdom brings peace to my royal court.'",
        imageUrl: "/the_lion_and_the_bull.png"
      },
      {
        pageNumber: 11,
        title: "Growing Wiser Together",
        text: "Day after day, the two friends shared stories and council. Pingalaka realized: 'True friends help each other grow wiser.'",
        imageUrl: "/the_lion_and_the_bull.png"
      },
      {
        pageNumber: 12,
        title: "A Schemer's Jealousy",
        text: "Damanaka grew jealous because the Lion no longer sought his advice. Karataka warned him: 'Do not destroy a friendship for your own gain.'",
        imageUrl: "/the_lion_and_the_bull.png"
      },
      {
        pageNumber: 13,
        title: "Poisoning the King's Mind",
        text: "Damanaka falsely whispered to Pingalaka that Sanjivaka was ambitious: 'The Bull is secretly planning to steal your throne.'",
        imageUrl: "/the_lion_and_the_bull.png"
      },
      {
        pageNumber: 14,
        title: "Lying to the Bull",
        text: "Then Damanaka hurried to Sanjivaka with another lie: 'The Lion King no longer trusts you and plans to attack you.'",
        imageUrl: "/the_lion_and_the_bull.png"
      },
      {
        pageNumber: 15,
        title: "Doubts and Silence",
        text: "Instead of speaking honestly to each other, both friends allowed fear and suspicion to grow: 'Has my friend truly betrayed me?'",
        imageUrl: "/the_lion_and_the_bull.png"
      },
      {
        pageNumber: 16,
        title: "The Painful Confrontation",
        text: "Misled by Damanaka, the frightened friends confronted one another: 'Why are you plotting against me?' cried Pingalaka. 'I believed you meant to harm me!' wept Sanjivaka.",
        imageUrl: "/the_lion_and_the_bull.png"
      },
      {
        pageNumber: 17,
        title: "A Friendship Shattered",
        text: "Before the truth could be uncovered, their precious friendship was tragically destroyed. Pingalaka wept: 'What have I done?'",
        imageUrl: "/the_lion_and_the_bull.png"
      },
      {
        pageNumber: 18,
        title: "The Bitter Truth",
        text: "Pingalaka finally understood that Damanaka's deceit had caused the tragedy. Karataka said solemnly: 'Rumours must never replace an honest conversation.'",
        imageUrl: "/the_lion_and_the_bull.png"
      }
    ],
    comprehensionQuestions: [
      {
        id: 1,
        question: "Why was Damanaka the jackal jealous of Sanjivaka the bull?",
        options: ["Because the Lion King spent all his time with the Bull and no longer sought Damanaka's advice", "Because the Bull ate all the grass", "Because the Bull could roar louder", "Because the Bull took his crown"],
        answer: "Because the Lion King spent all his time with the Bull and no longer sought Damanaka's advice",
        explanation: "Damanaka felt ignored and lost his influence in the court when Pingalaka and Sanjivaka became close friends."
      },
      {
        id: 2,
        question: "What should the Lion and the Bull have done instead of believing Damanaka's lies?",
        options: ["Spoken openly and honestly with each other to verify the truth", "Left the forest immediately", "Asked the other jackal to fight", "Kept quiet and hidden in a cave"],
        answer: "Spoken openly and honestly with each other to verify the truth",
        explanation: "The story teaches that open, honest communication and verifying facts prevents misunderstanding and protects friendships."
      },
      {
        id: 3,
        question: "What is the central moral lesson of 'The Lion and the Bull'?",
        options: ["Never let rumours destroy a true friendship; verify what you hear and speak honestly", "Lions should never befriend bulls", "Monsoons are dangerous in the forest", "Jackals make the best messengers"],
        answer: "Never let rumours destroy a true friendship; verify what you hear and speak honestly",
        explanation: "This famous Panchatantra fable teaches us to beware of gossip and deceit, and to always have honest conversations with our friends."
      }
    ]
  },
  {
    id: 'the_monkey_and_the_wedge',
    title: "The Monkey and the Wedge",
    subtitle: "A Panchatantra tale about curiosity, caution and understanding before acting",
    genre: "Panchatantra Classic",
    emoji: "🐒🪵🪓",
    isFeatured: true,
    isSingleComicSheet: true,
    image: "/the_monkey_and_the_wedge.png",
    moral: "Do not interfere in work you do not understand. Curiosity becomes wisdom when we pause, learn and ask before acting. 🐒🪵✨",
    summary: "Two skilled carpenters building a temple near the forest split a large timber log and insert a wooden wedge to hold the split open safely before leaving for lunch. A curious monkey wanders into the quiet worksite and becomes fascinated by the wedge. Ignoring common sense and lacking understanding of carpentry, he pulls and wiggles the wedge until it breaks free. The split log snaps shut, pinching his tail. The kind returning carpenters gently free him, and the monkey learns a lifelong lesson never to meddle in affairs he does not understand.",
    vocabHighlights: [
      { word: "Wedge", partOfSpeech: "Noun", definition: "A piece of wood or metal with a thick end that tapers to a thin edge, used to hold open, split, or secure objects.", pronunciation: "wej", fact: "Carpenters use wooden wedges to keep large logs from clamping shut while sawing." },
      { word: "Meddle", partOfSpeech: "Verb", definition: "Interfere in or busy oneself with something that is not one's concern or business.", pronunciation: "med-l", fact: "The monkey promised himself that he would never meddle with dangerous tools again." },
      { word: "Caution", partOfSpeech: "Noun", definition: "Care taken to avoid danger or mistakes; prudence.", pronunciation: "kaw-shuhn", fact: "True wisdom means balancing natural curiosity with caution and safety." },
      { word: "Skilled", partOfSpeech: "Adjective", definition: "Having or showing the knowledge, ability, or training to perform a task well.", pronunciation: "skild", fact: "The skilled craftsmen worked patiently to build a magnificent wooden temple." },
      { word: "Interfere", partOfSpeech: "Verb", definition: "Involve oneself in a situation without invitation, necessity, or understanding.", pronunciation: "in-ter-feer", fact: "It is dangerous to interfere with heavy machinery or tools without proper training." }
    ],
    pages: [
      {
        pageNumber: 1,
        title: "Carpenters at Work",
        text: "Two skilled carpenters were building a temple near the forest: 'Measure carefully before you cut,' the master carpenter instructed.",
        imageUrl: "/the_monkey_and_the_wedge.png"
      },
      {
        pageNumber: 2,
        title: "The Split Log",
        text: "A wooden wedge held open a carefully split log. 'This wedge keeps the timber safely apart,' explained the builder.",
        imageUrl: "/the_monkey_and_the_wedge.png"
      },
      {
        pageNumber: 3,
        title: "Midday Lunch Break",
        text: "At midday, the carpenters left their work and went to eat: 'We will finish the log after lunch,' they agreed.",
        imageUrl: "/the_monkey_and_the_wedge.png"
      },
      {
        pageNumber: 4,
        title: "A Curious Visitor",
        text: "A curious monkey wandered into the quiet worksite: 'What have the carpenters left behind?' he wondered.",
        imageUrl: "/the_monkey_and_the_wedge.png"
      },
      {
        pageNumber: 5,
        title: "Catching Attention",
        text: "The bright-topped wedge immediately caught his attention: 'Why is this little piece of wood here?' he asked himself.",
        imageUrl: "/the_monkey_and_the_wedge.png"
      },
      {
        pageNumber: 6,
        title: "Lack of Understanding",
        text: "He examined the log but did not understand the carpenter's work: 'It looks easy to remove.'",
        imageUrl: "/the_monkey_and_the_wedge.png"
      },
      {
        pageNumber: 7,
        title: "Overcome by Curiosity",
        text: "Curiosity pushed aside the Monkey's common sense: 'I will discover what happens!' he declared.",
        imageUrl: "/the_monkey_and_the_wedge.png"
      },
      {
        pageNumber: 8,
        title: "Pulling the Wedge",
        text: "The Monkey began pulling the wedge from side to side: 'It is starting to move!' he grinned.",
        imageUrl: "/the_monkey_and_the_wedge.png"
      },
      {
        pageNumber: 9,
        title: "Wiggling Looser",
        text: "The wedge grew looser with every hard pull: 'Just a little more!' cheered the monkey.",
        imageUrl: "/the_monkey_and_the_wedge.png"
      },
      {
        pageNumber: 10,
        title: "Careless Position",
        text: "The Monkey sat astride the log and did not notice where his tail had fallen: 'I have nearly done it!'",
        imageUrl: "/the_monkey_and_the_wedge.png"
      },
      {
        pageNumber: 11,
        title: "The Log Snaps Shut",
        text: "When the wedge came free, the heavy log snapped closed and pinched his tail! 'Oh! I should not have touched it!' he squealed.",
        imageUrl: "/the_monkey_and_the_wedge.png"
      },
      {
        pageNumber: 12,
        title: "A Helping Hand",
        text: "The returning carpenters heard the commotion and quickly freed the frightened Monkey: 'Be still. We will help you.'",
        imageUrl: "/the_monkey_and_the_wedge.png"
      },
      {
        pageNumber: 13,
        title: "A Wise Lesson Learned",
        text: "The Monkey left safely with a lesson he would never forget: 'I will not meddle with work I do not understand!'",
        imageUrl: "/the_monkey_and_the_wedge.png"
      }
    ],
    comprehensionQuestions: [
      {
        id: 1,
        question: "Why did the carpenters place a wooden wedge inside the split log?",
        options: ["To keep the split open safely while sawing the timber", "To feed the forest animals", "To balance the temple roof", "To mark where they stopped for lunch"],
        answer: "To keep the split open safely while sawing the timber",
        explanation: "The wedge was used as a safety tool to prevent the split log from snapping shut while the carpenters worked on it."
      },
      {
        id: 2,
        question: "What happened when the monkey pulled the wedge out of the log?",
        options: ["The log snapped shut and pinched his tail", "The log turned into gold", "The temple fell down", "The wedge flew into the river"],
        answer: "The log snapped shut and pinched his tail",
        explanation: "Because the monkey didn't understand how the wedge functioned and wasn't careful, the heavy timber closed on his tail."
      },
      {
        id: 3,
        question: "What is the central moral lesson of 'The Monkey and the Wedge'?",
        options: ["Do not interfere in work you do not understand; curiosity becomes wisdom when we pause, learn, and ask first", "Never build temples near trees", "Monkeys should always carry saws", "Logs are only for sitting"],
        answer: "Do not interfere in work you do not understand; curiosity becomes wisdom when we pause, learn, and ask first",
        explanation: "This classic Panchatantra fable teaches that meddling in matters or tools without knowledge and caution can lead to avoidable trouble."
      }
    ]
  },
  {
    id: 'boy_who_cried_wolf',
    title: "The Boy Who Cried Wolf",
    subtitle: "A story about honesty and trust",
    genre: "Classic Fable",
    emoji: "🐺",
    isFeatured: true,
    isSingleComicSheet: true,
    image: "/boy_who_cried_wolf.png",
    moral: "Always speak the truth. If you lie once, no one will believe you when you are telling the truth. 🌿",
    summary: "A shepherd boy who guards sheep on a hill thinks it is funny to trick the villagers by crying 'Wolf!' When a real wolf finally comes, nobody believes him and the sheep are chased away.",
    vocabHighlights: [
      { word: "Deceit", partOfSpeech: "Noun", definition: "The act of causing someone to believe something that is false in order to gain an advantage.", pronunciation: "dih-seet", fact: "The boy's deceit made the villagers lose all trust in him!" },
      { word: "Trustworthy", partOfSpeech: "Adjective", definition: "Able to be relied on as honest or truthful.", pronunciation: "trust-wur-thee", fact: "From that day on, the boy worked hard to become trustworthy again." },
      { word: "Consequences", partOfSpeech: "Noun", definition: "A result or effect of an action or condition, often an undesirable one.", pronunciation: "kon-si-kwens-iz", fact: "The boy learned that all lies have serious consequences." },
      { word: "Regret", partOfSpeech: "Noun", definition: "A feeling of sadness or disappointment over something that has happened.", pronunciation: "rih-gret", fact: "Sitting on the ground watching his sheep run, the boy was full of deep regret." },
      { word: "Honesty", partOfSpeech: "Noun", definition: "The quality of being truthful, sincere, and free of deceit.", pronunciation: "on-uh-stee", fact: "Honesty is the foundation of every strong friendship and community!" }
    ],
    pages: [
      {
        pageNumber: 1,
        text: "In a green village near the hills, a boy watched over the sheep every day. He often felt bored and one day he had an idea. 'I'll trick the villagers!' he thought. He ran down to the village shouting 'Wolf! Wolf! A wolf is chasing my sheep!' The villagers heard him and came running up the hill with sticks and tools. But when they reached the hill, there was no wolf. The boy laughed and laughed. 'Ha! Ha! You came so quickly!' The villagers said, 'Don't do that again. It's not funny!' The boy did the same thing again a few days later. He shouted, 'Wolf! Wolf! Help! Help!' The villagers came running up the hill once more. But again, there was no wolf. The boy laughed as the villagers shook their heads. 'You are a naughty boy! We will not come again next time.' One evening, a real wolf came out of the forest. It saw the sheep and began to chase them. The boy was very frightened. He ran to the village shouting, 'Wolf! Wolf! Please come quickly! A real wolf!' But the villagers heard him and said, 'He is lying again. We won't go!' They did not come. The wolf chased many sheep away. The boy sat on the ground and cried. He learned a hard lesson that day. From that day on, the boy was honest. He took good care of his sheep and never lied again. The villagers trusted him, and they all lived happily together. MORAL: Always speak the truth.",
        imageUrl: "/boy_who_cried_wolf.png"
      }
    ]
  },
  {
    id: 'crow_and_the_pitcher',
    title: "The Crow and the Pitcher",
    subtitle: "A story about thinking smart and never giving up",
    genre: "Classic Fable",
    emoji: "🐦",
    isFeatured: true,
    isSingleComicSheet: true,
    image: "/crow_and_the_pitcher.png",
    moral: "Where there is a will, there is a way. Use your mind to solve any problem! 💡",
    summary: "On a hot summer day, a thirsty crow finds a pitcher with water too low to reach. Instead of giving up, he uses his clever mind — dropping stones one by one into the pitcher until the water rises within reach!",
    vocabHighlights: [
      { word: "Thirsty", partOfSpeech: "Adjective", definition: "Feeling a need to drink something due to lack of water.", pronunciation: "thur-stee", fact: "The thirsty crow searched far and wide before finally spotting the pitcher!" },
      { word: "Pitcher", partOfSpeech: "Noun", definition: "A large container with a handle and a lip, used for holding and pouring liquids.", pronunciation: "pich-er", fact: "The narrow pitcher saved the crow's life by holding just enough water!" },
      { word: "Patience", partOfSpeech: "Noun", definition: "The ability to accept delay or difficulty without becoming annoyed or anxious.", pronunciation: "pay-shuns", fact: "The crow dropped stone after stone with patience until the water finally rose!" },
      { word: "Clever", partOfSpeech: "Adjective", definition: "Quick to understand and learn things; showing intelligence and skill.", pronunciation: "klev-er", fact: "Being clever helped the crow solve what seemed like an impossible problem." },
      { word: "Perseverance", partOfSpeech: "Noun", definition: "Continued effort to do or achieve something despite difficulty.", pronunciation: "pur-suh-veer-uhns", fact: "The crow's perseverance — stone after stone — finally saved his life!" }
    ],
    pages: [
      {
        pageNumber: 1,
        text: "On a hot summer day, a thirsty crow was flying here and there in search of water. At last, he saw a pitcher near a tree. He flew down happily, but when he reached the pitcher, he was sad. There was very little water at the bottom. His beak could not reach it. The crow thought for a while. 'How can I drink this water?' he wondered. He looked around. Then he saw some small stones on the ground. A clever idea came to his mind! He picked up one stone in his beak and dropped it into the pitcher. Plop! He picked up another stone and dropped it in. Plop! Again and again, he did the same. Plop! Plop! Plop! Slowly, the water began to rise. The crow was very patient. The water rose and rose... until it came within reach! The crow was happy. He put his beak into the pitcher and drank the cool, fresh water. He drank and drank until his thirst was gone. The crow flew away happily, thanking his clever idea. He learned that where there is a will, there is a way. MORAL: Where there is a will, there is a way.",
        imageUrl: "/crow_and_the_pitcher.png"
      }
    ]
  },
  {
    id: 'ant_and_the_grasshopper',
    title: "The Ant and the Grasshopper",
    subtitle: "A story about hard work, wisdom and planning",
    genre: "Classic Fable",
    emoji: "🐜",
    isFeatured: true,
    isSingleComicSheet: true,
    image: "/ant_and_the_grasshopper.png",
    moral: "Work today for a better tomorrow. Good planning brings good results. 🌾",
    summary: "While a grasshopper sings and plays all summer long, a hardworking ant collects grain and stores food for winter. When the cold season arrives, the grasshopper is left hungry — and learns an important lesson about responsibility and planning.",
    vocabHighlights: [
      { word: "Responsibility", partOfSpeech: "Noun", definition: "The state or fact of having a duty to deal with something and being in charge of one's actions.", pronunciation: "rih-spon-suh-bil-uh-tee", fact: "The ant showed great responsibility by preparing all summer for winter!" },
      { word: "Careless", partOfSpeech: "Adjective", definition: "Not giving sufficient attention or thought to avoiding harm or mistakes.", pronunciation: "kair-lis", fact: "The grasshopper's careless summer of singing led to a very hungry winter." },
      { word: "Diligent", partOfSpeech: "Adjective", definition: "Having or showing care and conscientiousness in one's work or duties.", pronunciation: "dil-uh-jent", fact: "The diligent ant never skipped a single day of work all summer long!" },
      { word: "Foresight", partOfSpeech: "Noun", definition: "The ability to predict and prepare for what will happen in the future.", pronunciation: "for-syt", fact: "Foresight — thinking ahead — is what made the ant survive the cold winter!" },
      { word: "Regret", partOfSpeech: "Noun", definition: "A feeling of sadness or disappointment over something that has happened.", pronunciation: "rih-gret", fact: "Sitting cold and hungry in winter, the grasshopper felt deep regret for not working." }
    ],
    pages: [
      {
        pageNumber: 1,
        text: "On a warm summer day, a grasshopper was singing and enjoying the sunshine. He saw an ant working hard and carrying grains of wheat. 'Why do you work so hard, little ant? Come and sing with me!' the grasshopper called out. The ant looked up and said, 'I am working today to have food in the winter. You should do the same instead of wasting time.' 'Winter is far away! There is plenty of food and fun today!' the grasshopper laughed. The grasshopper laughed and danced all day long. He played his song and did not work at all. The ant worked every day. He collected grains of wheat and stored them carefully in his home. Days passed by. The summer turned into autumn. The leaves began to fall. The grasshopper still had nothing stored. Then came the cold winter. There was snow everywhere. The grasshopper had no food and was very hungry. He went to the ant and knocked on his door. 'Dear ant, I am hungry. Please give me some food to eat.' The ant opened the door and said, 'You laughed at me when I worked. Now you want me to share? I cannot do that.' The grasshopper was sad. He understood his mistake. From that day, he promised to work hard and be ready for the future. When the next summer came, the grasshopper worked hard like the ant. He was happy and never careless again. MORAL: Work today for a better tomorrow.",
        imageUrl: "/ant_and_the_grasshopper.png"
      }
    ]
  },
  {
    id: 'sonic_and_shadow',
    title: "Sonic and Shadow",
    subtitle: "A story about friendship, understanding and working together",
    genre: "Adventure & Friendship",
    emoji: "⚡",
    isFeatured: true,
    isFlipbook: true,
    image: "/sonic_page1.png",
    moral: "We may be different, but together we can do anything! True friendship is about understanding, not sameness. ⚡",
    summary: "Sonic loves freedom and helping others, while Shadow is serious and works alone. When Dr. Eggman threatens the world with a giant Chaos Emerald, they must set aside their differences and combine their unique powers to save the day!",
    vocabHighlights: [
      { word: "Unstoppable", partOfSpeech: "Adjective", definition: "Impossible to stop or prevent; having power that cannot be blocked or overcome.", pronunciation: "un-stop-uh-bul", fact: "When Sonic's speed and Shadow's power combined, they became truly unstoppable!" },
      { word: "Rivalry", partOfSpeech: "Noun", definition: "A state of competition or opposition between two people who want the same goal.", pronunciation: "ry-vuhl-ree", fact: "Sonic and Shadow's rivalry turned into a great friendship after working together." },
      { word: "Teamwork", partOfSpeech: "Noun", definition: "The combined effort of a group working together to achieve a shared goal.", pronunciation: "teem-wurk", fact: "Sonic's speed and Shadow's power showed that real teamwork makes anything possible!" },
      { word: "Trust", partOfSpeech: "Noun", definition: "A firm belief in the reliability, truth, or ability of someone.", pronunciation: "trust", fact: "Shadow chose to trust Sonic — and that choice helped save the world!" },
      { word: "Understanding", partOfSpeech: "Noun", definition: "The ability to know and accept someone's feelings or situation with sympathy.", pronunciation: "un-der-stan-ding", fact: "Understanding each other's differences made Sonic and Shadow stronger together." }
    ],
    pages: [
      {
        pageNumber: 1,
        title: "The Fastest Hedgehog",
        text: "In a world full of speed and adventure, Sonic was the fastest hedgehog who loved freedom and helping others. With golden rings flying past him, nothing could slow him down. He lived by one rule — always keep moving and help those in need!",
        imageUrl: "/sonic_page1.png"
      },
      {
        pageNumber: 2,
        title: "The Lone Shadow",
        text: "Shadow was different. He was strong, quiet and serious. He often worked alone and did not trust others easily. While Sonic raced through meadows, Shadow stood in dark cities — watching, thinking, waiting. He had his own kind of power.",
        imageUrl: "/sonic_page2.png"
      },
      {
        pageNumber: 3,
        title: "Eggman's Evil Plan",
        text: "One day, Dr. Eggman built a powerful machine to take over the world using a giant Chaos Emerald. Green energy crackled from the machine as Eggman laughed. 'With this power, the whole world will obey me!' he cried.",
        imageUrl: "/sonic_page3.png"
      },
      {
        pageNumber: 4,
        title: "Too Powerful!",
        text: "Sonic tried to stop him, but the machine was too powerful. Every time Sonic attacked, an energy shield sent him flying backwards. Shadow watched from afar but stayed silent. 'Why doesn't he help?' Sonic wondered as he struggled.",
        imageUrl: "/sonic_page4.png"
      },
      {
        pageNumber: 5,
        title: "Captured!",
        text: "Eggman captured Sonic inside a glowing energy capsule! Shadow watched from the shadows. He saw that Sonic was not the enemy — they both wanted the same thing. 'I will help,' Shadow decided, 'in my own way.'",
        imageUrl: "/sonic_page5.png"
      },
      {
        pageNumber: 6,
        title: "Shadow to the Rescue",
        text: "Shadow freed Sonic and warned him about Eggman's next move. Sonic was surprised — he never expected help from Shadow. 'Why did you help me?' Sonic asked. Shadow replied, 'Because we are on the same side. Now hurry!'",
        imageUrl: "/sonic_page6.png"
      },
      {
        pageNumber: 7,
        title: "The Perfect Team",
        text: "They teamed up! Sonic's incredible speed and Shadow's raw power were the perfect combination to defeat Eggman. Side by side, with blue and red energy blazing, they charged forward together — unstoppable!",
        imageUrl: "/sonic_page7.png"
      },
      {
        pageNumber: 8,
        title: "Saving the World",
        text: "With teamwork and trust, they destroyed the machine and saved the world! The Chaos Emerald shattered as the machine exploded in a dazzling burst of light. Eggman fled in his egg mobile, shouting 'I'll be back!' But today — the heroes won.",
        imageUrl: "/sonic_page8.png"
      },
      {
        pageNumber: 9,
        title: "True Friends",
        text: "From that day on, Sonic and Shadow became true friends. As they watched the sunset together, Sonic smiled and said, 'We may be different, but together we are unstoppable!' Shadow nodded quietly — and for the first time, he smiled too.",
        imageUrl: "/sonic_page9.png"
      },
      {
        pageNumber: 10,
        title: "Every Journey is Better Together",
        text: "Whether the road is fast or tough, friends make every journey better. Sonic and Shadow ran side by side through golden meadows, rings sparkling around them. Different in every way — but together, they were the greatest team the world had ever seen. MORAL: We may be different, but together we can do anything!",
        imageUrl: "/sonic_page10.png"
      }
    ]
  },
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
  },
  {
    id: 'jackal_and_the_drum',
    title: 'The Jackal and the Drum',
    subtitle: 'A Panchatantra tale about courage, curiosity and looking beyond noise',
    genre: 'Panchatantra',
    emoji: '🥁',
    isFeatured: true,
    isSingleComicSheet: true,
    image: '/the_jackal_and_the_drum.png',
    moral: 'Do not be frightened by noise or appearances. Investigate carefully and understand the truth before making a decision.',
    summary: 'A hungry jackal named Gomaya hears a terrifying boom in the forest. Instead of running away, he gathers his courage and investigates — only to find it was just a dry branch hitting an old drum. The story teaches that curiosity and bravery overcome fear.',
    vocabHighlights: [
      { word: 'Investigate', partOfSpeech: 'Verb', definition: 'To examine or look into something carefully in order to find the truth.', pronunciation: 'in-VES-tih-gayt', fact: 'Gomaya chose to investigate the scary sound instead of running — and discovered the truth!' },
      { word: 'Thunderous', partOfSpeech: 'Adjective', definition: 'Very loud, like a clap of thunder; producing a deep, powerful noise.', pronunciation: 'THUN-der-us', fact: 'The drum made a thunderous boom when the branch hit it — it sounded far more dangerous than it really was.' },
      { word: 'Cautious', partOfSpeech: 'Adjective', definition: 'Being careful to avoid danger or mistakes; not taking unnecessary risks.', pronunciation: 'KAW-shus', fact: 'Gomaya moved cautiously toward the drum — brave AND careful at the same time!' },
      { word: 'Imagination', partOfSpeech: 'Noun', definition: 'The ability to form pictures or ideas in your mind, especially of things not present or real.', pronunciation: 'ih-maj-ih-NAY-shun', fact: 'Gomaya\'s imagination made the empty drum seem like a monster — but reality was far less scary!' },
      { word: 'Curiosity', partOfSpeech: 'Noun', definition: 'A strong desire to know or learn about something; eagerness to explore and find answers.', pronunciation: 'kyoor-ee-OS-ih-tee', fact: 'It was Gomaya\'s curiosity that saved him from living in fear of a harmless drum forever.' }
    ],
    pages: [
      { imageUrl: '/the_jackal_and_the_drum.png', title: 'Cover', text: 'The Jackal and the Drum — A Panchatantra tale about courage, curiosity and looking beyond noise.' },
      { imageUrl: '/the_jackal_and_the_drum.png', title: 'Page 1 — A Hungry Jackal', text: 'A hungry jackal named Gomaya wandered through the forest searching for food. "I hope I find something before nightfall," he said to himself.' },
      { imageUrl: '/the_jackal_and_the_drum.png', title: 'Page 2 — The Deserted Camp', text: 'Near the forest, Gomaya discovered a deserted camp. "Who left all these things behind?" he wondered, sniffing the air cautiously.' },
      { imageUrl: '/the_jackal_and_the_drum.png', title: 'Page 3 — Wind in the Trees', text: 'A strong wind swept through the trees and moved a dry branch hanging above an old drum that sat beneath a great tree.' },
      { imageUrl: '/the_jackal_and_the_drum.png', title: 'Page 4 — A Terrible Sound', text: 'The branch struck the drum and made a deep, thunderous sound — BOOM! The noise echoed through the whole forest and made Gomaya freeze.' },
      { imageUrl: '/the_jackal_and_the_drum.png', title: 'Page 5 — Hiding in Fear', text: 'Gomaya\'s heart hammered. He imagined that a huge creature was hiding nearby. "What if a monster made that sound?" he trembled.' },
      { imageUrl: '/the_jackal_and_the_drum.png', title: 'Page 6 — Ready to Run', text: 'For a moment, the frightened jackal wanted to run away as fast as his legs could carry him. "Perhaps I should leave at once," he thought.' },
      { imageUrl: '/the_jackal_and_the_drum.png', title: 'Page 7 — A Second Thought', text: 'Then Gomaya paused. He decided that fear should not control him. "I must learn what caused this noise," he told himself bravely.' },
      { imageUrl: '/the_jackal_and_the_drum.png', title: 'Page 8 — Moving Closer', text: 'Step by careful step, Gomaya crept closer to where the sound had come from. "I will investigate cautiously," he reminded himself.' },
      { imageUrl: '/the_jackal_and_the_drum.png', title: 'Page 9 — The Sound Returns', text: 'The wind blew again, and the branch struck the drum — BOOM! This time, Gomaya watched closely. "The branch is making the sound!" he gasped.' },
      { imageUrl: '/the_jackal_and_the_drum.png', title: 'Page 10 — No Monster at All', text: 'There was no monster — only an empty drum sitting beneath a tree. "My imagination made it seem dangerous," Gomaya said, feeling relieved.' },
      { imageUrl: '/the_jackal_and_the_drum.png', title: 'Page 11 — A Hopeful Guess', text: 'The large drum made Gomaya wonder what might be inside. "Perhaps it contains a great feast!" he said hopefully, his tail wagging.' },
      { imageUrl: '/the_jackal_and_the_drum.png', title: 'Page 12 — Looking Inside', text: 'Gomaya carefully lifted a loose edge of the drum and peered inside. "Let me see what it holds," he murmured with bright, curious eyes.' },
      { imageUrl: '/the_jackal_and_the_drum.png', title: 'Page 13 — Empty but Wiser', text: 'The drum was empty — but Gomaya had discovered something far more valuable. "A loud noise does not always mean great danger," he smiled wisely.' }
    ],
    comprehensionQuestions: [
      {
        question: 'What made the loud booming sound that frightened Gomaya?',
        options: ['A monster hiding behind a tree', 'A dry branch hitting an old drum', 'Gomaya banging on the drum', 'Thunder from a storm'],
        correctAnswer: 'A dry branch hitting an old drum',
        hint: 'Look at what the wind moved above the drum in the forest.'
      },
      {
        question: 'What did Gomaya decide to do when he first felt afraid?',
        options: ['He ran away immediately and never returned', 'He hid and cried for help', 'He felt afraid but chose to bravely investigate', 'He called for help from other animals'],
        correctAnswer: 'He felt afraid but chose to bravely investigate',
        hint: 'Gomaya had a second thought — what did courage lead him to do?'
      },
      {
        question: 'What did Gomaya find inside the drum?',
        options: ['A great feast of food', 'A small sleeping monster', 'Gold and treasure', 'Nothing — it was completely empty'],
        correctAnswer: 'Nothing — it was completely empty',
        hint: 'The drum looked big and scary on the outside, but what was the truth inside?'
      }
    ]
  },
  {
    id: 'merchant_and_the_sweeper',
    title: 'The Merchant and the Sweeper',
    subtitle: 'A Panchatantra tale about respect, rumours and making amends',
    genre: 'Panchatantra',
    emoji: '🧹',
    isFeatured: true,
    isSingleComicSheet: true,
    image: '/the_merchant_and_the_sweeper.png',
    moral: 'Treat every person with dignity and respect. Do not believe rumours without evidence, and repair mistakes with a sincere apology.',
    summary: 'Dantila, a respected merchant, publicly insults Gorambha, a palace sweeper, after he accidentally sits on a reserved chair. Gorambha spreads a false rumour about Dantila to the King, causing Dantila to lose royal favour. Realising his mistake, Dantila apologises sincerely to Gorambha, who then cleanses Dantila\'s name with another absurd claim. Trust is restored, teaching everyone the value of respect.',
    vocabHighlights: [
      { word: 'Humiliate', partOfSpeech: 'Verb', definition: 'To make someone feel ashamed or foolish by injuring their dignity or self-respect.', pronunciation: 'hyoo-MIL-ee-ayt', fact: 'Dantila humiliated Gorambha at the party, which wounded Gorambha\'s heart.' },
      { word: 'Rumour', partOfSpeech: 'Noun', definition: 'A story or report of uncertain or doubtful truth that is spread among people.', pronunciation: 'ROO-mer', fact: 'Gorambha spread a false rumour about Dantila to get revenge, which shows how harmful gossip can be!' },
      { word: 'Absurd', partOfSpeech: 'Adjective', definition: 'Wildly unreasonable, illogical, or inappropriate.', pronunciation: 'ab-SURD', fact: 'Gorambha\'s second claim about the King eating cucumbers in the washroom was so absurd that it proved the first rumour was also false.' },
      { word: 'Reconcile', partOfSpeech: 'Verb', definition: 'To restore friendly relations between people after a disagreement or argument.', pronunciation: 'REK-un-syle', fact: 'Dantila and Gorambha were able to reconcile after Dantila offered a sincere apology and gifts of respect.' },
      { word: 'Dignity', partOfSpeech: 'Noun', definition: 'The state or quality of being worthy of honour or respect.', pronunciation: 'DIG-nih-tee', fact: 'Every person deserves to be treated with dignity, no matter what job they do.' }
    ],
    pages: [
      { imageUrl: '/the_merchant_and_the_sweeper.png', title: 'Cover', text: 'The Merchant and the Sweeper — A Panchatantra tale about respect, rumours and making amends.' },
      { imageUrl: '/the_merchant_and_the_sweeper.png', title: 'Page 1 — A Respected Merchant', text: 'Dantila was a successful merchant trusted by both the city and the King. "Your service to the kingdom is valuable," the King said.' },
      { imageUrl: '/the_merchant_and_the_sweeper.png', title: 'Page 2 — A Grand Celebration', text: 'Dantila invited everyone in the city to a magnificent celebration. "Your Majesties, welcome to my home," he greeted.' },
      { imageUrl: '/the_merchant_and_the_sweeper.png', title: 'Page 3 — Gorambha Arrives', text: 'Gorambha, a hardworking palace sweeper, also attended the celebration. "Thank you for inviting me," Gorambha smiled.' },
      { imageUrl: '/the_merchant_and_the_sweeper.png', title: 'Page 4 — The Reserved Seat', text: 'By mistake, Gorambha sat in a seat reserved for royal guests. "That chair has been reserved," a guest called out.' },
      { imageUrl: '/the_merchant_and_the_sweeper.png', title: 'Page 5 — Words That Hurt', text: 'Embarrassed, Dantila spoke harshly and asked Gorambha to leave. "You must leave the celebration!" he demanded in front of everyone.' },
      { imageUrl: '/the_merchant_and_the_sweeper.png', title: 'Page 6 — A Wounded Heart', text: 'Gorambha could not forget the public insult. "He treated me as though I had no dignity," he whispered, feeling deeply hurt.' },
      { imageUrl: '/the_merchant_and_the_sweeper.png', title: 'Page 7 — Early Morning Work', text: 'One morning, Gorambha worked sweeping the palace floor while the King rested nearby.' },
      { imageUrl: '/the_merchant_and_the_sweeper.png', title: 'Page 8 — A False Murmur', text: 'Gorambha murmured a false rumour where the King could hear. "Dantila behaves far too boldly around the Queen," he muttered.' },
      { imageUrl: '/the_merchant_and_the_sweeper.png', title: 'Page 9 — The King Questions Him', text: 'The startled King immediately demanded an explanation. "What did you just say?" "Forgive me. I was sleepy and spoke nonsense," Gorambha replied.' },
      { imageUrl: '/the_merchant_and_the_sweeper.png', title: 'Page 10 — Doubt Takes Root', text: 'Although Gorambha withdrew his words, suspicion entered the King\'s mind. "Could Dantila have betrayed my trust?" the King wondered.' },
      { imageUrl: '/the_merchant_and_the_sweeper.png', title: 'Page 11 — Turned Away', text: 'The next day, Dantila was unexpectedly refused entry to the palace. "I am sorry. The King will not receive you," the guard said.' },
      { imageUrl: '/the_merchant_and_the_sweeper.png', title: 'Page 12 — Understanding the Cause', text: 'Seeing Gorambha nearby, Dantila understood how deeply his harsh words had hurt. "I must repair the disrespect I caused," he realised.' },
      { imageUrl: '/the_merchant_and_the_sweeper.png', title: 'Page 13 — A Sincere Invitation', text: 'Dantila invited Gorambha to speak with him privately. "Please come in. I owe you an apology," Dantila said warmly.' },
      { imageUrl: '/the_merchant_and_the_sweeper.png', title: 'Page 14 — Making Amends', text: 'The Merchant apologised sincerely and offered gifts of respect. "I was wrong to humiliate you," he said. "Your honest apology matters," replied Gorambha.' },
      { imageUrl: '/the_merchant_and_the_sweeper.png', title: 'Page 15 — Gorambha Reflects', text: 'Gorambha accepted the apology and decided to correct the harm he had caused. "Now I must reveal that my rumour was unreliable," he resolved.' },
      { imageUrl: '/the_merchant_and_the_sweeper.png', title: 'Page 16 — An Absurd Claim', text: 'The next morning, Gorambha deliberately murmured something absurd: "The King eats cucumbers in the royal washroom."' },
      { imageUrl: '/the_merchant_and_the_sweeper.png', title: 'Page 17 — The King Realises', text: 'The impossible claim made the King reconsider the earlier rumour. "That is completely untrue!" he barked. "Forgive me. I must speak nonsense when I am sleepy," Gorambha smiled.' },
      { imageUrl: '/the_merchant_and_the_sweeper.png', title: 'Page 18 — Trust Restored', text: 'The King restored Dantila\'s honour, and both men learned to treat others carefully. "Welcome back, Dantila!" "I will show respect to everyone," they agreed.' }
    ],
    comprehensionQuestions: [
      {
        question: 'Why did Dantila get angry and ask Gorambha to leave the celebration?',
        options: ['Gorambha accidentally sat in a reserved royal seat', 'Gorambha was late to the party', 'Gorambha was making too much noise', 'Gorambha brought a bad gift'],
        correctAnswer: 'Gorambha accidentally sat in a reserved royal seat',
        hint: 'Check what Gorambha did by mistake on Page 4.'
      },
      {
        question: 'What false rumour did Gorambha spread about Dantila?',
        options: ['That Dantila was stealing gold', 'That Dantila behaved too boldly around the Queen', 'That Dantila did not like the King', 'That Dantila wanted to leave the kingdom'],
        correctAnswer: 'That Dantila behaved too boldly around the Queen',
        hint: 'Read what Gorambha murmured while sweeping near the sleeping King on Page 8.'
      },
      {
        question: 'How did Dantila and Gorambha resolve their conflict?',
        options: ['Dantila complained to the King', 'Dantila apologised sincerely and offered gifts of respect', 'Gorambha left the city forever', 'They had another big argument'],
        correctAnswer: 'Dantila apologised sincerely and offered gifts of respect',
        hint: 'Look at how Dantila invited Gorambha to his home to make amends on Page 13 and 14.'
      }
    ]
  }
];
export const STORIES_EASY = [
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

export const STORIES_HARD = [
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
export const MATH_PUZZLES = [
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
export const MATH_PUZZLES_EASY = [
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

export const MATH_PUZZLES_HARD = [
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
