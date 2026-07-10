import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { doc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { Compass, Map, Trophy, Users, Award, Sparkles, X } from 'lucide-react';

const TRACK_COORDS = {
  sonic: [
    { x: 184, y: 140 }, // 1: START
    { x: 153, y: 418 }, // 2: Green Hill
    { x: 358, y: 418 }, // 3: Marble
    { x: 460, y: 474 }, // 4: Spring Yard
    { x: 460, y: 306 }, // 5: 
    { x: 460, y: 195 }, // 6: Cloud Fortress
    { x: 563, y: 306 }, // 7: Libyreon City
    { x: 665, y: 212 }, // 8: Death Egg
    { x: 665, y: 390 }, // 9: Death Egg Core
    { x: 819, y: 223 }  // 10: Final Temple
  ],
  island: [
    { x: 579, y: 77 },   // 1
    { x: 579, y: 160 },  // 2
    { x: 779, y: 226 },  // 3
    { x: 659, y: 264 },  // 4
    { x: 319, y: 283 },  // 5
    { x: 479, y: 309 },  // 6
    { x: 380, y: 438 },  // 7
    { x: 550, y: 393 },  // 8
    { x: 630, y: 386 },  // 9
    { x: 729, y: 419 }   // 10
  ],
  forest: [
    { x: 70, y: 370 },  // 1 Start Point
    { x: 320, y: 59 },  // 2 Whispering Grove
    { x: 230, y: 339 }, // 3 Mushroom Glade
    { x: 270, y: 513 }, // 4 Glimmering Pool
    { x: 390, y: 384 }, // 5 Mossy Ruins
    { x: 540, y: 370 }, // 6 Ancient Tree of Ages
    { x: 680, y: 344 }, // 7 Spider's Silken Web
    { x: 790, y: 176 }, // 8 Crystal Cavern Entrance
    { x: 730, y: 513 }, // 9 Bioluminescent Flower Patch
    { x: 900, y: 384 }  // 10 Sentinel Stone Circle
  ],
  space: [
    { x: 24, y: 412 },  // 1
    { x: 269, y: 85 },  // 2
    { x: 186, y: 367 }, // 3
    { x: 215, y: 564 }, // 4
    { x: 361, y: 434 }, // 5
    { x: 479, y: 395 }, // 6
    { x: 625, y: 372 }, // 7
    { x: 723, y: 175 }, // 8
    { x: 664, y: 564 }, // 9
    { x: 850, y: 418 }  // 10
  ],
  sports: [
    { x: 100, y: 330 },  // 1
    { x: 280, y: 330 },  // 2
    { x: 460, y: 330 },  // 3
    { x: 640, y: 330 },  // 4
    { x: 820, y: 330 },  // 5
    { x: 910, y: 230 },  // 6
    { x: 820, y: 130 },  // 7
    { x: 640, y: 130 },  // 8
    { x: 460, y: 130 },  // 9
    { x: 280, y: 130 }   // 10
  ],
  undersea: [
    { x: 140, y: 377 },  // 1 Coral Reef
    { x: 310, y: 163 },  // 2 Sea Forest
    { x: 340, y: 390 },  // 3 Sunken Ship
    { x: 490, y: 130 },  // 4 Deep Blue Zone
    { x: 500, y: 403 },  // 5 Pearl Cave
    { x: 750, y: 117 },  // 6 Volcano Ridge
    { x: 760, y: 293 },  // 7 Ice Tunnels
    { x: 690, y: 442 }   // 8 Treasure Lagoon
  ],
  candyland: [
    { x: 130, y: 71 },  // 1 Mr. Pop's Candy Shop
    { x: 360, y: 59 },  // 2 Molasses Swamp
    { x: 620, y: 45 },  // 3 Royal Peppermint Forest
    { x: 870, y: 65 },  // 4 Gingerbread Orchard
    { x: 860, y: 214 }, // 5 Lollipop Woods
    { x: 500, y: 247 }, // 6 Ice Cream Sea
    { x: 220, y: 344 }, // 7 Lord Licorice's Castle
    { x: 290, y: 455 }, // 8 Candy Kid
    { x: 610, y: 448 }, // 9 Captain Cookie
    { x: 830, y: 396 }  // 10 The Grand Sugar Palace
  ],
  dinosaur: [
    { x: 160, y: 286 }, // 1 Dino Discovery
    { x: 290, y: 149 }, // 2 The Fern Forest
    { x: 290, y: 403 }, // 3 Fossil Find
    { x: 500, y: 143 }, // 4 Dino Valley
    { x: 550, y: 410 }, // 5 Crystal Caves
    { x: 700, y: 97 },  // 6 Volcano Peak
    { x: 800, y: 240 }, // 7 The Great Lake
    { x: 860, y: 364 }, // 8 Ancient Ruins
    { x: 710, y: 494 }, // 9 Dino Champion
    { x: 920, y: 442 }  // 10 Hidden Nest
  ],
  pirate: [
    { x: 130, y: 111 },  // 1 Shipwreck Shore
    { x: 380, y: 91 },  // 2 Parrot Point
    { x: 600, y: 91 },  // 3 Skeleton Beach
    { x: 840, y: 91 },  // 4 Lost Temple
    { x: 850, y: 260 }, // 5 Cannon Cove
    { x: 600, y: 240 }, // 6 Blackwater Bay
    { x: 340, y: 299 }, // 7 Hidden Lagoon
    { x: 110, y: 396 }, // 8 Smuggler's Cave
    { x: 390, y: 462 }, // 9 Treasure Falls
    { x: 660, y: 462 }  // 10 Pirate's Prize
  ],
  haunted: [
    { x: 100, y: 350 }, // 1 Haunted Gate
    { x: 100, y: 200 }, // 2 Cemetery Path
    { x: 200, y: 100 }, // 3 Ghost Forest
    { x: 450, y: 100 }, // 4 Broken Clocktower
    { x: 550, y: 250 }, // 5 Gargoyle Bridge
    { x: 250, y: 350 }, // 6 Pumpkin Village
    { x: 700, y: 150 }, // 7 Spectral Sky Path
    { x: 550, y: 450 }, // 8 Crystal Dungeon
    { x: 750, y: 450 }, // 9 Forgotten Courtyard
    { x: 900, y: 200 }  // 10 Haunted Castle FINISH
  ],
  winter: [
    { x: 140, y: 143 }, // 1 Frosty Village
    { x: 320, y: 156 }, // 2 Twinkle Town Square
    { x: 500, y: 98 },  // 3 Icy Bridge Crossing
    { x: 690, y: 98 },  // 4 Whispering Pines
    { x: 870, y: 156 }, // 5 Candy Cane Lane
    { x: 830, y: 267 }, // 6 Frozen Waterfall
    { x: 520, y: 299 }, // 7 Snowman Valley
    { x: 210, y: 286 }, // 8 Ice Crystal Caverns
    { x: 230, y: 442 }, // 9 Santa's Workshop
    { x: 600, y: 481 }  // 10 Holiday Castle
  ],
  jungle: [
    { x: 59, y: 135 }, { x: 156, y: 248 }, { x: 254, y: 361 }, { x: 352, y: 248 }, { x: 449, y: 135 },
    { x: 547, y: 248 }, { x: 645, y: 361 }, { x: 742, y: 248 }, { x: 840, y: 135 }, { x: 898, y: 226 }
  ],
  desert: [
    { x: 100, y: 200 }, // 1
    { x: 250, y: 100 }, // 2
    { x: 450, y: 120 }, // 3
    { x: 650, y: 120 }, // 4
    { x: 850, y: 120 }, // 5
    { x: 850, y: 250 }, // 6
    { x: 500, y: 250 }, // 7
    { x: 200, y: 350 }, // 8
    { x: 450, y: 400 }, // 9
    { x: 800, y: 400 }  // 10
  ],
  cyber: [
    { x: 92, y: 46 },   // 0 (1: 9%, 8%) Neon Launch Plaza (START)
    { x: 276, y: 40 },  // 1 (2: 27%, 7%) Robot District
    { x: 502, y: 40 },  // 2 (3: 49%, 7%) Hologram Square
    { x: 707, y: 40 },  // 3 (4: 69%, 7%) Drone Skyport
    { x: 922, y: 40 },  // 4 (5: 90%, 7%) Quantum Energy Core
    { x: 942, y: 207 }, // 5 (6: 92%, 36%) Cyber Arcade
    { x: 195, y: 253 }, // 6 (7: 19%, 44%) Hover Highway
    { x: 430, y: 265 }, // 7 (8: 42%, 46%) AI Innovation Campus
    { x: 625, y: 276 }, // 8 (9: 61%, 48%) Infinity Data Grid
    { x: 819, y: 345 }  // 9 (10: 80%, 60%) Sky Nexus Command Tower (FINISH)
  ],
  magic: [
    { x: 41, y: 173 },  // 1 Academy Entrance
    { x: 164, y: 58 },  // 2 Enchanted Courtyard
    { x: 399, y: 29 },  // 3 Owl Tower
    { x: 563, y: 29 },  // 4 Potion Gardens
    { x: 768, y: 29 },  // 5 Crystal Library
    { x: 973, y: 225 }, // 6 Dragon Courtyard
    { x: 471, y: 225 }, // 7 Sky Bridge
    { x: 215, y: 397 }, // 8 Enchanted Maze
    { x: 604, y: 386 }, // 9 Wizard's Observatory
    { x: 911, y: 386 }  // 10 Grand Hall of Magic
  ]
};

const MILESTONE_DETAILS = {
  sonic: [
    { name: "1. Start Line 🏁", desc: "Ready, set, go!" },
    { name: "2. Chemical Plant 🧪", desc: "Speed through the toxic tubes!" },
    { name: "3. Green Hill 🌴", desc: "Collect rings on the grassy loops." },
    { name: "4. Spring Yard 🎰", desc: "Bounce around the casino bumpers." },
    { name: "5. Marble Zone 🌋", desc: "Watch out for the hot lava!" },
    { name: "6. Cloud Fortress ☁️", desc: "Soar high above the clouds." },
    { name: "7. Libyreon City 🏙️", desc: "Drift through the glowing streets." },
    { name: "8. Death Egg Zone 🥚", desc: "Infiltrate Dr. Eggman's base." },
    { name: "9. Death Egg Core 🤖", desc: "Defeat the giant robot guard!" },
    { name: "10. Ice Cap Zone ❄️", desc: "Snowboard down the frozen peaks." }
  ],
  island: [
    { name: "1. Start Gate 🏁", desc: "Start your engines!" },
    { name: "2. Tall Rocks 🪨", desc: "Watch out for the falling boulders." },
    { name: "3. Mountain Tunnel ⛰️", desc: "Drive through the dark cavern." },
    { name: "4. Waterfall Bridge 🌊", desc: "Cross the rushing blue waters." },
    { name: "5. Pine Woods 🌲", desc: "Navigate the dense green forest." },
    { name: "6. Old Ruins 🏛️", desc: "Discover the ancient island history." },
    { name: "7. Coastal Curve 🏝️", desc: "Drift along the sandy beach." },
    { name: "8. Volcano Base 🌋", desc: "Feel the heat from the molten lava!" },
    { name: "9. Compass Point 🧭", desc: "Stay on track and keep your bearings." },
    { name: "10. Palm Beach 🌴", desc: "The final straightaway!" }
  ],
  forest: [
    { name: "1. Start Point", desc: "Your journey begins!" },
    { name: "2. Whispering Grove", desc: "The trees are whispering." },
    { name: "3. Mushroom Glade", desc: "A cozy clearing filled with colorful, glowing mushrooms." },
    { name: "4. Glimmering Pool", desc: "Crystal clear magical water." },
    { name: "5. Mossy Ruins", desc: "Ancient stones covered in moss." },
    { name: "6. Ancient Tree of Ages", desc: "The oldest tree in the forest." },
    { name: "7. Spider's Silken Web", desc: "Careful not to get stuck." },
    { name: "8. Crystal Cavern Entrance", desc: "Sparkling gems inside." },
    { name: "9. Bioluminescent Flower Patch", desc: "Glowing flowers light the way." },
    { name: "10. Sentinel Stone Circle", desc: "Ancient standing stones." }
  ],
  space: [
    { name: "1. Star Point ⭐", desc: "Your cosmic journey begins!" },
    { name: "2. Asteroid Field 🪨", desc: "Dodge the floating space rocks." },
    { name: "3. Cosmic Nebula 🌌", desc: "A beautiful cloud of stardust." },
    { name: "4. Glimmering Gas Cloud ☁️", desc: "Navigate through the glowing vapors." },
    { name: "5. Xeno-Ruins 🏛️", desc: "Ancient alien architecture floating in space." },
    { name: "6. Elder Pulsar 💫", desc: "A blindingly bright dying star." },
    { name: "7. Silken Singularity 🕳️", desc: "A mesmerizing space anomaly." },
    { name: "8. Crystal Comet Entrance ☄️", desc: "Catch a ride on the icy comet." },
    { name: "9. Exotic Particle Field ✨", desc: "A dazzling display of quantum fireworks." },
    { name: "10. Sentience Stones 🗿", desc: "The final orbital milestone." }
  ],
  sports: [
    { name: "Warmup Zone 🤸", desc: "Get stretched and ready for action!" },
    { name: "Sprint Lane 🏃", desc: "Dash forward as fast as your legs can carry you!" },
    { name: "Hurdle Jump 🚧", desc: "Leap over the obstacles with perfect timing." },
    { name: "Relay Pass 🏃‍♂️", desc: "Pass the baton to your teammates to keep going!" },
    { name: "Long Jump Pit 🦘", desc: "Fly through the air and land in the sand." },
    { name: "High Jump Bar 🪜", desc: "Arch your back and clear the bar!" },
    { name: "Discus Circle ☄️", desc: "Spin and launch the disc into the distance." },
    { name: "Penalty Kick ⚽", desc: "Aim, shoot, and SCORE past the goalkeeper!" },
    { name: "Water Obstacle 🏊", desc: "Leap over the water pool and stay strong." },
    { name: "Final Stretch 🏁", desc: "The crowd is cheering! Almost at the line!" }
  ],
  undersea: [
    { name: "1. The Coral Reef 🪸", desc: "Get ready for the journey!", task: "Get familiar with the basics." },
    { name: "2. The Sea Forest 🌿", desc: "Explore the sea plants.", task: "Identify different sea plants." },
    { name: "3. The Sunken Ship ⚓", desc: "Discover hidden treasures!", task: "Solve puzzles and find clues." },
    { name: "4. The Deep Blue Zone 🐟", desc: "Meet amazing sea creatures.", task: "Learn about sea animals." },
    { name: "5. The Pearl Cave 🦪", desc: "Collect the pearls of knowledge!", task: "Answer questions and earn points." },
    { name: "6. The Volcano Ridge 🌋", desc: "Navigate the hot underwater zone.", task: "Complete challenges to move ahead." },
    { name: "7. The Ice Tunnels 🧊", desc: "Cross the chilly ice tunnels.", task: "Test your skills and score high." },
    { name: "8. The Treasure Lagoon 💎", desc: "The final stretch to victory!", task: "Show what you've leaned." }
  ],
  candyland: [
    { name: "1. Mr. Pop's Candy Shop", desc: "Welcome to Candyland!" },
    { name: "2. Molasses Swamp", desc: "Don't get stuck!" },
    { name: "3. Royal Peppermint Forest", desc: "Minty fresh trees." },
    { name: "4. Gingerbread Orchard", desc: "Watch out for crumbs." },
    { name: "5. Lollipop Woods", desc: "Colorful and sweet." },
    { name: "6. Ice Cream Sea", desc: "Sail the sugary waves." },
    { name: "7. Lord Licorice's Castle", desc: "A dark, sweet fortress." },
    { name: "8. Candy Kid", desc: "A sweet friend." },
    { name: "9. Captain Cookie", desc: "The swashbuckling biscuit." },
    { name: "10. The Grand Sugar Palace", desc: "You've reached the end!" }
  ],
  dinosaur: [
    { name: "1. Dino Discovery", desc: "Get ready for your dinosaur adventure!" },
    { name: "2. The Fern Forest", desc: "Explore the lush Sea Forest." },
    { name: "3. Fossil Find", desc: "Dig up fossils and discover the past." },
    { name: "4. Dino Valley", desc: "Meet different dinosaurs." },
    { name: "5. Crystal Caves", desc: "Explore the sparkling crystal caves." },
    { name: "6. Volcano Peak", desc: "Navigate the fiery Volcano Ridge." },
    { name: "7. The Great Lake", desc: "Cross the wide Ice Tunnels." },
    { name: "8. Ancient Ruins", desc: "Solve puzzles in the ancient ruins." },
    { name: "9. Dino Champion", desc: "Complete challenges and become a Dino Champion!" },
    { name: "10. Hidden Nest", desc: "Discover the lost eggs!" }
  ],
  pirate: [
    { name: "1. Shipwreck Shore", desc: "Leave the dinghy behind." },
    { name: "2. Parrot Point", desc: "Squawk! Polly wants a cracker!" },
    { name: "3. Skeleton Beach", desc: "A terrifying stone face in the cliff." },
    { name: "4. Lost Temple", desc: "A place of ancient pirate battles." },
    { name: "5. Cannon Cove", desc: "Watch out for incoming fire!" },
    { name: "6. Blackwater Bay", desc: "Steer clear of the giant tentacles." },
    { name: "7. Hidden Lagoon", desc: "Listen to the enchanting songs." },
    { name: "8. Smuggler's Cave", desc: "A hidden hideout for scallywags." },
    { name: "9. Treasure Falls", desc: "Start digging here!" },
    { name: "10. Pirate's Prize", desc: "Gold doubloons galore! You are rich!" }
  ],
  haunted: [
    { name: "1. Haunted Gate", desc: "Dry leaves crunch under your feet." },
    { name: "2. Cemetery Path", desc: "Stone monsters watching you." },
    { name: "3. Ghost Forest", desc: "Try not to get stuck." },
    { name: "4. Broken Clocktower", desc: "Which reflection is the real you?" },
    { name: "5. Gargoyle Bridge", desc: "Spooky lights guiding the way." },
    { name: "6. Pumpkin Village", desc: "The paintings are staring at you." },
    { name: "7. Spectral Sky Path", desc: "Something green is bubbling in the pot." },
    { name: "8. Crystal Dungeon", desc: "Furniture floating in the air!" },
    { name: "9. Forgotten Courtyard", desc: "Don't open the coffin." },
    { name: "10. Haunted Castle FINISH", desc: "You survived the haunted house!" }
  ],
  winter: [
    { name: "1. Frosty Village 🏘️", desc: "A cozy snowy settlement." },
    { name: "2. Twinkle Town Square ✨", desc: "Festive lights everywhere." },
    { name: "3. Icy Bridge Crossing 🌉", desc: "Don't slip on the ice!" },
    { name: "4. Whispering Pines 🌲", desc: "The snowy trees hide secrets." },
    { name: "5. Candy Cane Lane 🍭", desc: "Sweet treats along the path." },
    { name: "6. Frozen Waterfall 🧊", desc: "A magnificent frozen cascade." },
    { name: "7. Snowman Valley ⛄", desc: "Say hello to the frosty friends." },
    { name: "8. Ice Crystal Caverns 💎", desc: "Glittering ice formations." },
    { name: "9. Santa's Workshop 🎁", desc: "Where the magic happens!" },
    { name: "10. Holiday Castle 🏰", desc: "A majestic winter palace." }
  ],
  jungle: [
    { name: "Vine Swing 🌿", desc: "Tarzan your way across the gap." },
    { name: "Monkey Canopy 🐒", desc: "Chattering friends in the treetops." },
    { name: "Tiger's Den 🐅", desc: "Sneak past the sleeping cat." },
    { name: "Hidden Ruins 🗿", desc: "Ancient stones covered in moss." },
    { name: "Anaconda Swamp 🐍", desc: "Watch out for the slithering snake." },
    { name: "Macaw Flock 🦜", desc: "A burst of colorful feathers." },
    { name: "Roaring Waterfall 🌊", desc: "A beautiful hidden cascade." },
    { name: "Dart Frog Pond 🐸", desc: "Don't touch the bright colorful frogs!" },
    { name: "Bamboo Forest 🎋", desc: "Thick stalks block the path." },
    { name: "Golden Temple 🛕", desc: "A legendary lost city." }
  ],
  desert: [
    { name: "1. Start", desc: "Hot sand as far as the eye can see." },
    { name: "2. Top Left", desc: "A refreshing drink of water." },
    { name: "3. Top Mid", desc: "Watch where you step." },
    { name: "4. Pyramid", desc: "Prickly plants everywhere." },
    { name: "5. Top Right", desc: "Is it real or an illusion?" },
    { name: "6. Mid Right", desc: "Circling high above." },
    { name: "7. Oasis Center", desc: "Cover your eyes from the wind!" },
    { name: "8. Mid Left", desc: "A safe place to rest." },
    { name: "9. Bottom Mid", desc: "A massive stone structure." },
    { name: "10. Palace", desc: "You found the lost desert treasure!" }
  ],
  cyber: [
    { name: "1. Neon Launch Plaza 🚀", desc: "Your cyber journey begins here!" },
    { name: "2. Robot District 🤖", desc: "Mechanical marvels wander the streets." },
    { name: "3. Hologram Square 🦄", desc: "A glowing digital unicorn greets you." },
    { name: "4. Drone Skyport 🚁", desc: "Watch out for the flying delivery drones." },
    { name: "5. Quantum Energy Core ⚡", desc: "The glowing power source of the city." },
    { name: "6. Cyber Arcade 🕹️", desc: "Retro games in a futuristic setting." },
    { name: "7. Hover Highway 🚗", desc: "Speeding cars on neon tracks." },
    { name: "8. AI Innovation Campus 🧠", desc: "Where the smartest minds gather." },
    { name: "9. Infinity Data Grid 💾", desc: "Streams of infinite data." },
    { name: "10. Sky Nexus Command Tower 🏆", desc: "You've reached the top!" }
  ],
  magic: [
    { name: "1. Academy Entrance", desc: "Discover your true house." },
    { name: "2. Enchanted Courtyard", desc: "Mix the bubbling ingredients." },
    { name: "3. Owl Tower", desc: "Zoom through the air rings." },
    { name: "4. Potion Gardens", desc: "Dark and full of magical creatures." },
    { name: "5. Crystal Library", desc: "Answer the riddle to cross." },
    { name: "6. Dragon Courtyard", desc: "A fire-breathing guardian." },
    { name: "7. Sky Bridge", desc: "The wand chooses the wizard." },
    { name: "8. Enchanted Maze", desc: "Flying books flutter around." },
    { name: "9. Wizard's Observatory", desc: "See into the future." },
    { name: "10. Grand Hall of Magic", desc: "You've graduated from Magic School!" }
  ]
};

const GIFTS = [
  { emoji: "💎", name: "Crystal of Clarity", desc: "A glowing blue crystal that helps you focus." },
  { emoji: "👑", name: "Crown of the Scholar", desc: "Worn by the wisest students in the realm." },
  { emoji: "🐉", name: "Dragon Egg", desc: "It's warm to the touch. Keep it safe!" },
  { emoji: "🪄", name: "Magic Wand", desc: "Sparks fly when you wave it." },
  { emoji: "🦄", name: "Unicorn Horn", desc: "Shimmers with all the colors of the rainbow." },
  { emoji: "🏆", name: "Golden Chalice", desc: "A legendary cup of victory." },
  { emoji: "🌟", name: "Fallen Star", desc: "It still glows with cosmic energy." },
  { emoji: "🧭", name: "Explorer's Compass", desc: "It always points towards your next goal." },
  { emoji: "📜", name: "Ancient Scroll", desc: "Contains secrets of the old masters." },
  { emoji: "🔮", name: "Mystic Orb", desc: "You can see galaxies swirling inside." },
  { emoji: "🪐", name: "Pocket Planet", desc: "A tiny planet orbiting inside a glass jar." },
  { emoji: "🚀", name: "Mini Rocket", desc: "Ready to launch into the stratosphere!" },
  { emoji: "👽", name: "Friendly Alien", desc: "A little green friend from another galaxy." },
  { emoji: "🌠", name: "Meteorite Shard", desc: "A piece of a shooting star you caught." },
  { emoji: "🦸", name: "Hero's Cape", desc: "Swishes majestically in the wind." },
  { emoji: "🧲", name: "Gravity Magnet", desc: "Can pull passing asteroids toward you." },
  { emoji: "🔋", name: "Quantum Battery", desc: "Unlimited energy for your adventures." },
  { emoji: "🧩", name: "Infinity Puzzle", desc: "A puzzle that changes every time you solve it." },
  { emoji: "🗝️", name: "Skeleton Key", desc: "Can unlock any door in the universe." },
  { emoji: "🛡️", name: "Energy Shield", desc: "Protects you from wrong answers!" },
  { emoji: "⚔️", name: "Sword of Truth", desc: "Cuts through the most difficult problems." },
  { emoji: "🏹", name: "Archer's Bow", desc: "Helps you hit the bullseye every time." },
  { emoji: "🍎", name: "Golden Apple", desc: "A legendary fruit of wisdom." },
  { emoji: "🦊", name: "Spirit Fox", desc: "A clever companion for your journey." },
  { emoji: "🦉", name: "Night Owl", desc: "Sees clearly even in the darkest caves." },
  { emoji: "🦋", name: "Neon Butterfly", desc: "Glows beautifully in the enchanted forest." },
  { emoji: "🐢", name: "Ancient Turtle", desc: "Slow, steady, and knows all the answers." },
  { emoji: "🍄", name: "Giant Mushroom", desc: "A perfect bouncy trampoline." },
  { emoji: "🌺", name: "Mana Flower", desc: "Smells like pure magic." },
  { emoji: "💧", name: "Tear of the Ocean", desc: "A droplet that holds a tiny sea inside." },
  { emoji: "🔥", name: "Eternal Flame", desc: "A fire that never burns out." },
  { emoji: "⚡", name: "Lightning Bolt", desc: "You caught a bolt of pure speed!" },
  { emoji: "❄️", name: "Ever-Ice Crystal", desc: "Never melts, even in the summer." },
  { emoji: "🌈", name: "Rainbow Ribbon", desc: "Leaves a trail of color behind you." },
  { emoji: "🥇", name: "Gold Medal", desc: "First place in the learning olympics!" },
  { emoji: "🏅", name: "Hero's Badge", desc: "A badge of extreme honor." },
  { emoji: "👟", name: "Winged Sneakers", desc: "Run faster than the speed of light." },
  { emoji: "🛹", name: "Hoverboard", desc: "Float smoothly over any obstacle." },
  { emoji: "🎸", name: "Rockstar Guitar", desc: "Plays the coolest victory solos." },
  { emoji: "🎨", name: "Magic Paintbrush", desc: "Whatever you paint becomes real." },
  { emoji: "🔭", name: "Galactic Telescope", desc: "See to the edge of the universe." },
  { emoji: "🧬", name: "DNA Helix", desc: "The building blocks of life itself." },
  { emoji: "🧪", name: "Mystery Potion", desc: "Bubble, bubble, toil and trouble..." },
  { emoji: "⚙️", name: "Clockwork Gear", desc: "Keeps the wheels of your brain turning." },
  { emoji: "💡", name: "Bright Idea Bulb", desc: "Flashes when you solve a hard problem." },
  { emoji: "📚", name: "Flying Book", desc: "Flaps its pages like a bird." },
  { emoji: "🎭", name: "Mask of Many Faces", desc: "A magical theater mask." },
  { emoji: "🎲", name: "Lucky Dice", desc: "Always rolls exactly what you need." },
  { emoji: "🧩", name: "Golden Puzzle Piece", desc: "The missing piece you were looking for!" },
  { emoji: "👑", name: "Emperor's Crown", desc: "The ultimate prize for a true champion." }
];

const getSubmissionDate = (sub) => {
  if (sub.submittedAt?.toDate) return sub.submittedAt.toDate();
  if (sub.submittedAt) return new Date(sub.submittedAt);
  return new Date(0);
};

const isDateInCurrentWeek = (date) => {
  const now = new Date();
  
  // Get the start of the current week (Monday 00:00:00)
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);
  
  // Get the end of the current week (Sunday 23:59:59.999)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return date >= startOfWeek && date <= endOfWeek;
};

const getWeeklyResetCountdown = () => {
  const now = new Date();
  
  // Get next Monday 00:00:00
  const nextMonday = new Date(now);
  const day = nextMonday.getDay();
  const diff = nextMonday.getDate() + (day === 0 ? 1 : 8 - day);
  nextMonday.setDate(diff);
  nextMonday.setHours(0, 0, 0, 0);
  
  const msDiff = nextMonday.getTime() - now.getTime();
  const days = Math.floor(msDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((msDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  return `${hours}h`;
};

export default function AdventureMazeView({ 
  classroom, 
  teacher, 
  classroomStudents = [], 
  submissions = [], 
  studentName,
  getStudentAvatar 
}) {
  const [liveClassroom, setLiveClassroom] = useState(classroom);
  const [liveSubmissions, setLiveSubmissions] = useState(submissions);
  const [hoveredStudent, setHoveredStudent] = useState(null);
  const [countdownText, setCountdownText] = useState(getWeeklyResetCountdown());
  const [claimedTreasures, setClaimedTreasures] = useState([]);
  const [isTreasureModalOpen, setIsTreasureModalOpen] = useState(false);
  const [activeGift, setActiveGift] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownText(getWeeklyResetCountdown());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const savedStudent = JSON.parse(localStorage.getItem('hwz_active_student') || '{}');
  const teacherUid = teacher?.uid || savedStudent?.teacher?.uid;
  const classroomId = classroom?.id || savedStudent?.classroom?.id;

  useEffect(() => {
    if (studentName && classroomId) {
      try {
        const saved = localStorage.getItem(`hwz_treasures_${studentName}_${classroomId}`);
        if (saved) setClaimedTreasures(JSON.parse(saved));
      } catch (e) {}
    }
  }, [studentName, classroomId]);

  const handleOpenTreasure = (lap) => {
    const gift = GIFTS[(lap - 1) % GIFTS.length];
    setActiveGift(gift);
    setIsTreasureModalOpen(true);
    const updated = [...claimedTreasures, lap];
    setClaimedTreasures(updated);
    if (studentName && classroomId) {
      localStorage.setItem(`hwz_treasures_${studentName}_${classroomId}`, JSON.stringify(updated));
    }
  };

  // Real-time listener for classroom doc to track active map track changes
  useEffect(() => {
    if (!teacherUid || !classroomId) return;
    const classroomRef = doc(db, 'teachers', teacherUid, 'classrooms', classroomId);
    const unsubscribe = onSnapshot(classroomRef, (snap) => {
      if (snap.exists()) {
        setLiveClassroom({ id: snap.id, ...snap.data() });
      }
    });
    return () => unsubscribe();
  }, [teacherUid, classroomId]);

  // Real-time listener for submissions to track points changes
  useEffect(() => {
    if (!classroomId) return;
    const q = query(collection(db, 'submissions'), where('classId', '==', classroomId));
    const unsubscribe = onSnapshot(q, (snap) => {
      const list = [];
      snap.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setLiveSubmissions(list);
    });
    return () => unsubscribe();
  }, [classroomId]);

  const getAutoTrack = () => {
    const availableTracks = Object.keys(TRACK_COORDS);
    const now = new Date();
    // Monday-based week calculation
    const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return availableTracks[weekNo % availableTracks.length];
  };

  const activeTrack = liveClassroom?.activeTrack === 'auto' || !liveClassroom?.activeTrack 
    ? getAutoTrack() 
    : liveClassroom?.activeTrack;

  const activeCoords = useMemo(() => {
    return TRACK_COORDS[activeTrack] || TRACK_COORDS.forest;
  }, [activeTrack]);

  // Map student points
  const normalizeName = (name) => (name || '').trim().toLowerCase().replace(/\s+/g, ' ');

  const studentsWithMilestones = useMemo(() => {
    // 1. Calculate scores for all students in class roster
    const scores = {};
    classroomStudents.forEach(s => {
      scores[s.name] = 0;
    });

    liveSubmissions.forEach(sub => {
      // Filter by current week
      const subDate = getSubmissionDate(sub);
      if (!isDateInCurrentWeek(subDate)) return;

      const subName = normalizeName(sub.studentName);
      const matched = classroomStudents.find(s => normalizeName(s.name) === subName || normalizeName(s.id) === subName);
      if (matched) {
        const correct = sub.correctCount || 0;
        const wrong = (sub.totalQuestions || 0) - correct;
        // +10 XP per correct answer, -5 XP per wrong answer
        const net = (correct * 10) - (wrong * 5);
        scores[matched.name] = (scores[matched.name] || 0) + net;
      }
    });

    // Ensure the current student is represented
    const activeStudentName = classroomStudents.find(s => normalizeName(s.name) === normalizeName(studentName))?.name || studentName;
    if (scores[activeStudentName] === undefined) {
      scores[activeStudentName] = 0;
    }

    // 2. Map scores to milestones (50 points = 1 milestone)
    const list = Object.keys(scores).map(name => {
      // Floor at 0 — students can't go below the start line
      const pts = Math.max(0, scores[name] || 0);
      
      const totalSteps = Math.floor(pts / 50);
      const trackLength = activeCoords.length - 1; // e.g., 10 for most, 11 for dinosaur/winter
      
      let lap = 1;
      let milestone = 0;
      if (totalSteps > 0) {
        if (totalSteps % trackLength === 0) {
          milestone = trackLength;
          lap = Math.floor(totalSteps / trackLength);
        } else {
          milestone = totalSteps % trackLength;
          lap = Math.floor(totalSteps / trackLength) + 1;
        }
      }

      const studentObj = classroomStudents.find(s => normalizeName(s.name) === normalizeName(name)) || {};
      
      return {
        name,
        points: pts,
        milestone,
        lap,
        avatarUrl: studentObj.avatarUrl || `https://api.dicebear.com/7.x/lorelei/svg?seed=${name}`,
        isMe: normalizeName(name) === normalizeName(studentName)
      };
    });

    return list;
  }, [classroomStudents, liveSubmissions, studentName]);

  // Group students by milestone to cluster them without overlapping
  const studentsByMilestone = useMemo(() => {
    const map = {};
    for (let i = 0; i < activeCoords.length; i++) {
      map[i] = [];
    }
    studentsWithMilestones.forEach(s => {
      map[s.milestone].push(s);
    });
    return map;
  }, [studentsWithMilestones]);

  // Get offset coordinates for multiple students clustering on a milestone node
  const getOffsetPosition = (milestoneIdx, studentIdx, totalInMilestone) => {
    const base = activeCoords[milestoneIdx];
    if (totalInMilestone <= 1) return { x: base.x, y: base.y };
    // Arrange in a neat little circle surrounding the milestone dot
    const radius = 26; // pixels distance
    const angle = (studentIdx * 2 * Math.PI) / totalInMilestone;
    return {
      x: base.x + radius * Math.cos(angle),
      y: base.y + radius * Math.sin(angle)
    };
  };

  // Build SVG path coordinates string
  const pathD = useMemo(() => {
    return activeCoords.map((c, i) => (i === 0 ? 'M' : 'L') + ` ${c.x} ${c.y}`).join(' ');
  }, [activeCoords]);

  // Theme Visual Assets/Styles
  const themeStyles = {
    sonic: {
      displayName: "🦔 Sonic Grand Prix", displayColor: "bg-blue-600 text-white shadow-blue-300",
      gradient: "from-blue-200 via-sky-100 to-emerald-100",
      pathColor: "#1D4ED8", // blue track
      pathOutline: "#1E3A8A",
      centerDashes: "#FDE047", // yellow dashes
      nodeColor: "fill-blue-500 stroke-blue-700",
      nodeColorCompleted: "fill-amber-400 stroke-amber-600",
      finishColor: "text-red-600 fill-red-500",
      skyColor: "bg-[#60A5FA]/20",
      finishNode: "🏁",
      isImageBaked: true,
      aspectRatio: "aspect-[1024/558]",
      viewBox: "0 0 1024 558"
    },
    island: {
      displayName: "🏝️ Adventure Island", displayColor: "bg-teal-500 text-white shadow-teal-200",
      gradient: "from-sky-300 via-teal-100 to-amber-100",
      pathColor: "#475569", // asphalt color
      pathOutline: "#334155",
      centerDashes: "#FCD34D", 
      nodeColor: "fill-teal-400 stroke-teal-600",
      nodeColorCompleted: "fill-amber-400 stroke-amber-600",
      finishColor: "text-red-500 fill-red-400",
      skyColor: "bg-[#38BDF8]/20",
      finishNode: "🏆",
      isImageBaked: true,
      aspectRatio: "aspect-[1024/571]",
      viewBox: "0 0 1024 571"
    },
    forest: {
      displayName: "🌲 Enchanted Forest", displayColor: "bg-emerald-500 text-white shadow-emerald-200",
      gradient: "from-emerald-50 via-teal-50 to-green-100/50",
      pathColor: "#8B5A2B", // Wooden branch brown
      pathOutline: "#4E2F13",
      centerDashes: "#FCD34D", // Gold dashes
      nodeColor: "fill-emerald-400 stroke-emerald-600",
      nodeColorCompleted: "fill-emerald-600 stroke-emerald-800",
      finishColor: "text-amber-500 fill-amber-500",
      skyColor: "bg-[#1E3A1A]/10",
      finishNode: "🏰",
      isImageBaked: true
    },
    space: {
      displayName: "🚀 Cosmic Space Maze", displayColor: "bg-[#EA580C] text-white shadow-orange-200",
      gradient: "from-slate-950 via-green-950 to-orange-950",
      pathColor: "#4F46E5", // Bright cosmic blue-purple glow
      pathOutline: "#818CF8",
      centerDashes: "#22D3EE", // Cyan laser dashes
      nodeColor: "fill-orange-500 stroke-orange-400",
      nodeColorCompleted: "fill-cyan-500 stroke-cyan-300",
      finishColor: "text-yellow-400 fill-yellow-300",
      skyColor: "bg-[#0B0F19]/80",
      finishNode: "🌌",
      isImageBaked: true
    },
    sports: {
      displayName: "🏃 Athletics Track", displayColor: "bg-orange-500 text-white shadow-orange-200",
      gradient: "from-orange-50 via-amber-50 to-orange-100/50",
      pathColor: "#EA580C", // Athletics reddish-orange lane track
      pathOutline: "#9A3412",
      centerDashes: "#FFFFFF", // White lane markings
      nodeColor: "fill-amber-400 stroke-amber-600",
      nodeColorCompleted: "fill-rose-500 stroke-rose-700",
      finishColor: "text-yellow-500 fill-yellow-400",
      skyColor: "bg-[#431407]/10",
      finishNode: "🏆"
    },
    undersea: {
      displayName: "🌊 Undersea Voyage", displayColor: "bg-cyan-500 text-white shadow-cyan-200",
      gradient: "from-cyan-50 via-blue-50 to-indigo-100",
      pathColor: "#0284c7", pathOutline: "#075985", centerDashes: "#ffffff",
      nodeColor: "fill-cyan-400 stroke-cyan-600", nodeColorCompleted: "fill-indigo-500 stroke-indigo-700",
      finishColor: "text-blue-500 fill-blue-300", skyColor: "bg-[#082f49]/10", finishNode: "🔱",
      isImageBaked: true
    },
    candyland: {
      displayName: "🍬 Candyland Adventure", displayColor: "bg-pink-500 text-white shadow-pink-200",
      gradient: "from-pink-50 via-rose-50 to-fuchsia-100",
      pathColor: "#ec4899", pathOutline: "#be185d", centerDashes: "#fbcfe8",
      nodeColor: "fill-pink-400 stroke-pink-600", nodeColorCompleted: "fill-fuchsia-500 stroke-fuchsia-700",
      finishColor: "text-rose-500 fill-rose-300", skyColor: "bg-[#831843]/10", finishNode: "🏰",
      isImageBaked: true
    },
    dinosaur: {
      displayName: "🦖 Dinosaur Safari", displayColor: "bg-lime-600 text-white shadow-lime-200",
      gradient: "from-lime-50 via-green-50 to-emerald-100",
      pathColor: "#65a30d", pathOutline: "#3f6212", centerDashes: "#d9f99d",
      nodeColor: "fill-lime-400 stroke-lime-600", nodeColorCompleted: "fill-green-600 stroke-green-800",
      finishColor: "text-emerald-500 fill-emerald-300", skyColor: "bg-[#14532d]/10", finishNode: "🌋",
      isImageBaked: true
    },
    pirate: {
      displayName: "🏴‍☠️ Pirate Treasure Hunt", displayColor: "bg-amber-600 text-white shadow-amber-200",
      gradient: "from-amber-50 via-yellow-50 to-orange-100",
      pathColor: "#d97706", pathOutline: "#92400e", centerDashes: "#fde68a",
      nodeColor: "fill-amber-400 stroke-amber-600", nodeColorCompleted: "fill-orange-600 stroke-orange-800",
      finishColor: "text-yellow-500 fill-yellow-300", skyColor: "bg-[#78350f]/10", finishNode: "💎",
      isImageBaked: true
    },
    haunted: {
      displayName: "👻 Haunted Castle", displayColor: "bg-purple-800 text-white shadow-purple-200",
      gradient: "from-slate-900 via-purple-950 to-indigo-950",
      pathColor: "#9333ea", pathOutline: "#581c87", centerDashes: "#d8b4fe",
      nodeColor: "fill-purple-400 stroke-purple-600", nodeColorCompleted: "fill-indigo-500 stroke-indigo-700",
      finishColor: "text-fuchsia-500 fill-fuchsia-300", skyColor: "bg-[#2e1065]/40", finishNode: "🧛",
      isImageBaked: true,
      aspectRatio: "aspect-video",
      viewBox: "0 0 1024 576"
    },
    winter: {
      displayName: "⛄ Winter Wonderland", displayColor: "bg-sky-400 text-white shadow-sky-200",
      gradient: "from-slate-50 via-sky-50 to-blue-50",
      pathColor: "#38bdf8", pathOutline: "#0369a1", centerDashes: "#bae6fd",
      nodeColor: "fill-sky-400 stroke-sky-600", nodeColorCompleted: "fill-blue-500 stroke-blue-700",
      finishColor: "text-cyan-500 fill-cyan-300", skyColor: "bg-[#0c4a6e]/10", finishNode: "🛷",
      isImageBaked: true
    },
    jungle: {
      displayName: "🌴 Jungle Explorer", displayColor: "bg-green-700 text-white shadow-green-200",
      gradient: "from-green-50 via-emerald-50 to-teal-100",
      pathColor: "#15803d", pathOutline: "#14532d", centerDashes: "#bbf7d0",
      nodeColor: "fill-green-400 stroke-green-600", nodeColorCompleted: "fill-emerald-600 stroke-emerald-800",
      finishColor: "text-teal-500 fill-teal-300", skyColor: "bg-[#064e3b]/10", finishNode: "👑",
      isImageBaked: true
    },
    desert: {
      displayName: "🏜️ Desert Mirage", displayColor: "bg-yellow-600 text-white shadow-yellow-200",
      gradient: "from-yellow-50 via-orange-50 to-amber-100",
      pathColor: "#ca8a04", pathOutline: "#713f12", centerDashes: "#fef08a",
      nodeColor: "fill-yellow-400 stroke-yellow-600", nodeColorCompleted: "fill-orange-500 stroke-orange-700",
      finishColor: "text-amber-500 fill-amber-300", skyColor: "bg-[#451a03]/10", finishNode: "🐫",
      isImageBaked: true,
      aspectRatio: "aspect-video",
      viewBox: "0 0 1024 576"
    },
    cyber: {
      displayName: "🤖 Cyber City", displayColor: "bg-slate-800 text-green-400 shadow-slate-200",
      gradient: "from-slate-900 via-zinc-900 to-neutral-900",
      pathColor: "#22c55e", pathOutline: "#14532d", centerDashes: "#86efac",
      nodeColor: "fill-green-400 stroke-green-600", nodeColorCompleted: "fill-emerald-500 stroke-emerald-700",
      finishColor: "text-green-500 fill-green-300", skyColor: "bg-[#052e16]/40", finishNode: "💻",
      isImageBaked: true,
      aspectRatio: "aspect-video",
      viewBox: "0 0 1024 576"
    },
    magic: {
      displayName: "🪄 Magic School", displayColor: "bg-indigo-700 text-white shadow-indigo-200",
      gradient: "from-indigo-50 via-violet-50 to-purple-100",
      pathColor: "#4338ca", pathOutline: "#312e81", centerDashes: "#c7d2fe",
      nodeColor: "fill-indigo-400 stroke-indigo-600", nodeColorCompleted: "fill-violet-500 stroke-violet-700",
      finishColor: "text-purple-500 fill-purple-300", skyColor: "bg-[#1e1b4b]/10", finishNode: "🌟",
      isImageBaked: true,
      aspectRatio: "aspect-video",
      viewBox: "0 0 1024 576"
    }
  };

  const style = themeStyles[activeTrack] || themeStyles.forest;
  const milestoneData = MILESTONE_DETAILS[activeTrack] || MILESTONE_DETAILS.forest;

  return (
    <div className={`w-full bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-6 animate-in fade-in duration-300`}>
      
      {/* Map Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-[#2D3748] flex items-center gap-2">
            <span>🗺️</span> Co-op Adventure Maze
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="text-slate-400">
              See your class climb the tracks in real-time! Finish quests to unlock new check points!
            </span>
            <span className="hidden md:inline text-slate-300">•</span>
            <span className="text-[#EA580C] bg-[#FFF0EB] border border-[#FFD2C4]/40 px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
              🏁 Weekly Reset: {countdownText}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Active track:
          </span>
          <span className={`px-4 py-2 rounded-2xl text-xs font-black capitalize shadow-sm ${style.displayColor}`}>
            {style.displayName}
          </span>
        </div>
      </div>

      {/* SVG Canvas Map Area */}
      <div className={`relative w-full rounded-[24px] overflow-hidden border border-slate-100 bg-gradient-to-br ${style.gradient} ${style.aspectRatio || (style.isImageBaked ? 'aspect-[1000/650]' : 'aspect-[1000/450]')}`}>
        
        {style.isImageBaked && (
          <img 
            src={`/assets/adventure_${activeTrack === 'pirate' ? 'pirate_v2' : activeTrack}.${activeTrack === 'winter' ? 'jpg' : 'png'}?v=5`} 
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ imageRendering: 'high-quality' }}
            alt="Adventure Map"
          />
        )}

        {/* Sky overlays/nebulae for Space layout */}
        {activeTrack === 'space' && (
          <div className="absolute inset-0 pointer-events-none opacity-40">
            {/* Glowing planetary shapes or stars */}
            <div className="absolute top-[15%] left-[20%] w-32 h-32 rounded-full bg-orange-500/10 blur-xl" />
            <div className="absolute bottom-[20%] right-[30%] w-48 h-48 rounded-full bg-green-500/10 blur-2xl" />
            <div className="absolute top-[40%] right-[10%] w-24 h-24 rounded-full bg-cyan-400/10 blur-lg" />
          </div>
        )}

        <svg viewBox={style.viewBox || (style.isImageBaked ? "0 0 1000 650" : "0 0 1000 450")} className="absolute inset-0 w-full h-full select-none">
          <defs>
            {/* Cosmic glow filter for Space theme */}
            <filter id="space-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Theme Background Illustration */}
          {!style.isImageBaked && (
            <image 
              href={`/assets/adventure_${activeTrack}.png`}
              x="0"
              y="0"
              width="1000"
              height="450"
              preserveAspectRatio="none"
            />
          )}

          {/* 1. Track Draw (Background / Border layer) */}
          {!style.isImageBaked && (
            <>
              <path 
                d={pathD} 
                fill="none" 
                stroke={style.pathOutline} 
                strokeWidth="24" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                opacity={activeTrack === 'space' ? 0.6 : 0.85}
              />
              <path 
                d={pathD} 
                fill="none" 
                stroke={style.pathColor} 
                strokeWidth="18" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                filter={activeTrack === 'space' ? 'url(#space-glow)' : undefined}
              />
            </>
          )}
          
          {/* Center dashes */}
          {!style.isImageBaked && (
            <path 
              d={pathD} 
              fill="none" 
              stroke={style.centerDashes} 
              strokeWidth="2" 
              strokeDasharray="10 12" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              opacity={activeTrack === 'sports' ? 1.0 : 0.8}
            />
          )}

          {/* 2. Milestone Node Circles */}
          {activeCoords.map((node, idx) => {
            const hasStudentsHere = studentsByMilestone[idx]?.length > 0;
            const isFinish = idx === activeCoords.length - 1;
            
            return (
              <g key={idx} className="cursor-pointer group/node">
                {!style.isImageBaked && (
                  <>
                    {/* Node Outer Ring */}
                    <circle 
                      cx={node.x} 
                      cy={node.y} 
                      r={isFinish ? "24" : "15"} 
                      className={`transition-all duration-300 ${
                        hasStudentsHere ? 'fill-white stroke-yellow-400 stroke-[4px] shadow-sm' : 'fill-slate-100/90 stroke-slate-300/80 stroke-[3px]'
                      }`} 
                    />
                    
                    {/* Node Inner Ring */}
                    <circle 
                      cx={node.x} 
                      cy={node.y} 
                      r={isFinish ? "18" : "9"} 
                      className={
                        isFinish 
                          ? 'fill-yellow-400' 
                          : hasStudentsHere 
                          ? (activeTrack === 'space' ? 'fill-cyan-400' : activeTrack === 'sports' ? 'fill-rose-500' : 'fill-emerald-500') 
                          : 'fill-slate-300'
                      }
                    />

                    {/* Milestone Node Number or Emoji */}
                    <text 
                      x={node.x} 
                      y={node.y + 4} 
                      textAnchor="middle" 
                      className="text-[9px] font-black fill-white select-none pointer-events-none"
                    >
                      {isFinish ? style.finishNode : idx}
                    </text>
                  </>
                )}

                {/* Milestone Node Hover Tooltip triggers */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="30"
                  className="fill-transparent stroke-transparent cursor-pointer"
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const parentRect = e.currentTarget.ownerDocument.documentElement.getBoundingClientRect();
                    setHoveredStudent({
                      type: 'milestone',
                      name: milestoneData[idx].name,
                      desc: milestoneData[idx].desc,
                      x: node.x,
                      y: node.y - 45
                    });
                  }}
                  onMouseLeave={() => setHoveredStudent(null)}
                />
              </g>
            );
          })}

          {/* 3. Classmate Avatars Layer */}
          {Object.keys(studentsByMilestone).map((mIdx) => {
            const milestoneIndex = parseInt(mIdx, 10);
            const list = studentsByMilestone[milestoneIndex];
            
            return list.map((st, sIdx) => {
              const pos = getOffsetPosition(milestoneIndex, sIdx, list.length);
              
              return (
                <g 
                  key={st.name} 
                  className="cursor-pointer"
                  onMouseEnter={() => {
                    setHoveredStudent({
                      type: 'student',
                      name: st.name,
                      points: st.points,
                      milestoneName: milestoneData[milestoneIndex].name,
                      milestone: st.milestone,
                      lap: st.lap,
                      isMe: st.isMe,
                      x: pos.x,
                      y: pos.y - 45
                    });
                  }}
                  onMouseLeave={() => setHoveredStudent(null)}
                >
                  {/* Outer pulse highlights for "Me" */}
                  {st.isMe && (
                    <circle 
                      cx={pos.x} 
                      cy={pos.y} 
                      r="22" 
                      className="fill-transparent stroke-amber-400 stroke-2 animate-ping" 
                      style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                    />
                  )}

                  {/* Golden frame for Me or Top score */}
                  <circle 
                    cx={pos.x} 
                    cy={pos.y} 
                    r="19" 
                    className={`stroke-2 ${st.isMe ? 'fill-amber-400 stroke-amber-300' : 'fill-slate-100 stroke-white'}`} 
                  />

                  {/* Avatar clipping mask */}
                  <g className="clip-avatar">
                    <clipPath id={`avatar-clip-${st.name.replace(/\s+/g, '-')}`}>
                      <circle cx={pos.x} cy={pos.y} r="16" />
                    </clipPath>
                    
                    <image 
                      href={st.avatarUrl} 
                      x={pos.x - 16} 
                      y={pos.y - 16} 
                      width="32" 
                      height="32" 
                      clipPath={`url(#avatar-clip-${st.name.replace(/\s+/g, '-')})`}
                    />
                  </g>

                  {/* Tiny active bubble */}
                  {st.isMe && (
                    <circle 
                      cx={pos.x + 12} 
                      cy={pos.y - 12} 
                      r="5" 
                      className="fill-emerald-400 stroke-white stroke-1" 
                    />
                  )}

                  {/* Lap badge */}
                  {st.lap > 1 && (
                    <g>
                      <circle 
                        cx={pos.x - 12} 
                        cy={pos.y + 12} 
                        r="8" 
                        className="fill-amber-500 stroke-white stroke-1" 
                      />
                      <text
                        x={pos.x - 12}
                        y={pos.y + 14.5}
                        dominantBaseline="central"
                        textAnchor="middle"
                        className="text-[8px] font-black fill-white select-none pointer-events-none"
                        style={{ fontSize: '7px' }}
                      >
                        {`L${st.lap}`}
                      </text>
                    </g>
                  )}
                </g>
              );
            });
          })}
        </svg>

        {/* Permanent Milestone Cards Overlay */}
        {!style.isImageBaked && (
          <div className="absolute inset-0 pointer-events-none">
          {activeCoords.map((node, idx) => {
            const data = milestoneData[idx];
            if (!data || !data.task) return null;
            
            // Extract emoji and name
            const nameParts = data.name.split(' ');
            const emoji = nameParts[nameParts.length - 1].match(/\p{Emoji}/u) ? nameParts.pop() : '';
            const title = nameParts.join(' ');
            
            const isAbove = node.y < 225; 
            
            return (
              <div 
                key={idx}
                className="absolute w-[150px] bg-[#E3F2FD]/95 backdrop-blur-sm rounded-[16px] p-2.5 shadow-md border-[2.5px] border-white flex flex-col pointer-events-auto"
                style={{ 
                  left: `${(node.x / 1000) * 100}%`,
                  top: `${(node.y / 450) * 100}%`,
                  transform: `translate(-50%, ${isAbove ? 'calc(-100% - 42px)' : '42px'})`
                }}
              >
                <h4 className="text-[11px] font-black text-[#1565C0] text-center mb-1.5 leading-tight">{title}</h4>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-2xl flex-shrink-0">{emoji}</span>
                  <p className="text-[8px] font-bold text-slate-800 leading-tight flex-1 text-left">{data.desc}</p>
                </div>
                <div className="bg-[#BBDEFB]/50 rounded-[10px] p-1.5 flex items-start gap-1 mt-auto">
                  <span className="text-[10px] mt-[1px]">⭐</span>
                  <p className="text-[8px] font-bold text-[#0D47A1] leading-tight flex-1 text-left">{data.task}</p>
                </div>
                {/* Pointer caret */}
                <div className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-[#E3F2FD]/95 border-white rotate-45 ${isAbove ? '-bottom-2 border-b-[2.5px] border-r-[2.5px]' : '-top-2 border-t-[2.5px] border-l-[2.5px]'}`}></div>
              </div>
            );
          })}
          </div>
        )}

        {/* Real-time floating HTML Tooltip overlay relative to the SVG coordinates */}
        {hoveredStudent && (
          <div 
            className="absolute bg-slate-900/95 backdrop-blur-sm text-white px-3 py-2 rounded-2xl shadow-xl z-30 pointer-events-none text-left space-y-1 transition-all duration-150 animate-in fade-in zoom-in-95"
            style={{ 
              left: `${(hoveredStudent.x / 1000) * 100}%`, 
              top: `${(hoveredStudent.y / (style.isImageBaked ? 650 : 450)) * 100}%`,
              transform: 'translate(-50%, -100%)',
              minWidth: '160px'
            }}
          >
            {/* Tooltip Arrow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-900/95" />
            
            {hoveredStudent.type === 'milestone' ? (
              <>
                <p className="text-xs font-black text-yellow-300">{hoveredStudent.name}</p>
                <p className="text-[9px] text-slate-300 font-semibold leading-normal">{hoveredStudent.desc}</p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black truncate max-w-[120px]">{hoveredStudent.name}</span>
                  {hoveredStudent.isMe && (
                    <span className="text-[8px] bg-amber-400 text-slate-900 font-bold px-1 rounded">ME</span>
                  )}
                </div>
                <p className="text-[9px] font-black text-green-300 truncate">{hoveredStudent.milestoneName}</p>
                <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400 border-t border-slate-800 pt-1 mt-1">
                  <span>🏆 {hoveredStudent.points} XP</span>
                  <span>•</span>
                  <span>Lap {hoveredStudent.lap}</span>
                  <span>•</span>
                  <span>Milestone {hoveredStudent.milestone}</span>
                </div>
                <div className="text-[8px] text-slate-500 font-semibold mt-0.5">
                  ✅ +10 correct &nbsp;|&nbsp; ❌ -5 wrong
                </div>
              </>
            )}
          </div>
        )}

        {/* Treasure Chest Overlay */}
        {(() => {
          const me = studentsWithMilestones.find(s => s.isMe);
          if (me && me.milestone === 10 && !claimedTreasures.includes(me.lap)) {
            const finalCoords = activeCoords[10];
            return (
              <div 
                className="absolute z-20 cursor-pointer hover:scale-110 active:scale-95 transition-transform animate-bounce"
                style={{ 
                  left: `${(finalCoords.x / 1000) * 100}%`, 
                  top: `${(finalCoords.y / 450) * 100}%`,
                  transform: 'translate(-50%, -100%)',
                  marginTop: '-15px'
                }}
                onClick={() => handleOpenTreasure(me.lap)}
              >
                <div className="filter drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Glow behind */}
                    <circle cx="24" cy="24" r="20" fill="#FBBF24" fillOpacity="0.4" className="animate-pulse" />
                    {/* Chest Lid */}
                    <path d="M6 22C6 11 42 11 42 22H6Z" fill="#D97706" stroke="#451A03" strokeWidth="2.5" strokeLinejoin="round" />
                    {/* Chest Base */}
                    <path d="M6 22V36C6 38.2091 7.79086 40 10 40H38C40.2091 40 42 38.2091 42 36V22H6Z" fill="#B45309" stroke="#451A03" strokeWidth="2.5" strokeLinejoin="round" />
                    {/* Metal Straps */}
                    <path d="M16 13.5V40" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M32 13.5V40" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M6 22H42" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Lock */}
                    <rect x="20" y="18" width="8" height="10" rx="2" fill="#FBBF24" stroke="#451A03" strokeWidth="2.5" />
                    <circle cx="24" cy="23" r="1.5" fill="#451A03" />
                  </svg>
                </div>
              </div>
            );
          }
          return null;
        })()}
      </div>

      {/* Track Legend panel */}
      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EA580C]/10 text-[#EA580C] flex items-center justify-center text-xl shadow-inner">
            🏅
          </div>
          <div>
            <h4 className="text-xs font-black text-[#2D3748]">Co-op Mission Target</h4>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              Unlock landmarks! Help your class reach the Castle, Galaxy, or Podium by solving quizzes!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 border-l border-slate-200/60 pl-0 md:pl-6">
          <div className="space-y-0.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Total Classmates</span>
            <span className="text-sm font-black text-[#2D3748] flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#EA580C]" /> {classroomStudents.length}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Completed Lap 1</span>
            <span className="text-sm font-black text-emerald-500 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> {studentsWithMilestones.filter(s => s.lap > 1 || s.milestone === 10).length}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">My Progress</span>
            <span className="text-sm font-black text-amber-500 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> {(() => {
                const me = studentsWithMilestones.find(s => s.isMe);
                if (!me) return 'Lap 1, M0';
                return `Lap ${me.lap}, M${me.milestone}`;
              })()}
            </span>
          </div>
        </div>
      </div>

      {/* Treasure Modal */}
      {isTreasureModalOpen && activeGift && (
        <div className="fixed inset-0 z-50 flex-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white rounded-[32px] w-full max-w-md p-8 text-center relative shadow-2xl animate-in zoom-in-75 duration-500 flex flex-col items-center">
             <button 
                onClick={() => setIsTreasureModalOpen(false)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-2"
             >
                <X className="w-5 h-5" />
             </button>
             
             <h3 className="text-2xl font-black text-slate-800 mb-2">You opened a chest!</h3>
             <p className="text-sm font-bold text-slate-500 mb-8">A mysterious item was inside...</p>
             
             <div className="w-32 h-32 bg-amber-50 rounded-full flex-center text-6xl mb-6 shadow-inner border-4 border-amber-100 relative">
               <div className="absolute inset-0 bg-amber-400 blur-2xl opacity-20 rounded-full animate-pulse"></div>
               <span className="relative z-10 animate-bounce">{activeGift.emoji}</span>
             </div>
             
             <h4 className="text-xl font-black text-amber-500 mb-2">{activeGift.name}</h4>
             <p className="text-sm font-bold text-slate-600 leading-relaxed mb-6">
               {activeGift.desc}
             </p>
             
             <button 
                onClick={() => setIsTreasureModalOpen(false)}
                className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-white rounded-2xl font-black text-lg transition-colors shadow-lg shadow-amber-400/30"
             >
                Awesome!
             </button>
           </div>
        </div>
      )}
    </div>
  );
}
