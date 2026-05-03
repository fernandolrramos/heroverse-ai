import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion } from "framer-motion";
import { whereaboutsIntel } from "./whereaboutsData.js";
import { analysisForSpiderManYear, spiderManAnalysisSource } from "./spiderManAnalysisData.js";
import { analysisForCaptainAmericaYear, captainAmericaAnalysisSource } from "./captainAmericaAnalysisData.js";
import { analysisForIronManYear, ironManAnalysisSource } from "./ironManAnalysisData.js";
import { analysisForBlackWidowYear, blackWidowAnalysisSource } from "./blackWidowAnalysisData.js";
import { analysisForHulkYear, hulkAnalysisSource } from "./hulkAnalysisData.js";
import { analysisForThorYear, thorAnalysisSource } from "./thorAnalysisData.js";
import { characterIntelligenceFor, characterIntelligenceProfiles, mcuCharacterTimelineSummaries, mcuCharacterTimelineSummaryFor, mcuTimelineEvents } from "./mcuTimelineData.js";
import "./index.css";

function Card({ className = "", children, ...props }) {
  return (
    <div className={`rounded-2xl ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardContent({ className = "", children, ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

function Button({ className = "", children, variant: _variant, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition disabled:pointer-events-none disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

const START_YEAR = 1942;
const END_YEAR = 2027;
const DEFAULT_YEAR = 2012;
const PLAY_SPEED_MS = 900;
const MAX_CALLOUTS = 4;

const events = [
  { id: "first-avenger", title: "Captain America: The First Avenger", year: 1942, release: 2011, phase: 1, importance: "origin", short: "Steve Rogers becomes Captain America during World War II.", tags: ["Steve Rogers / Captain America", "Bucky Barnes / Winter Soldier"] },
  { id: "captain-marvel", title: "Captain Marvel", year: 1995, release: 2019, phase: 3, importance: "origin", short: "Carol Danvers becomes Captain Marvel and Nick Fury learns about cosmic threats.", tags: ["Carol Danvers / Captain Marvel", "Nick Fury"] },
  { id: "hulk-origin", title: "Bruce Banner becomes the Hulk", year: 2005, release: 2008, phase: 1, importance: "origin", short: "Bruce Banner's gamma accident puts him on the path to becoming the Hulk.", tags: ["Bruce Banner / Hulk"] },
  { id: "iron-man", title: "Iron Man", year: 2010, release: 2008, phase: 1, importance: "origin", short: "Tony Stark becomes Iron Man after escaping captivity and building the Mark I suit.", tags: ["Tony Stark / Iron Man", "Natasha Romanoff / Black Widow", "Nick Fury"] },
  { id: "iron-man-2", title: "Iron Man 2", year: 2011, release: 2010, phase: 1, importance: "major", short: "Tony faces public pressure while Natasha enters his orbit as a S.H.I.E.L.D. operative.", tags: ["Tony Stark / Iron Man", "Natasha Romanoff / Black Widow", "Nick Fury"] },
  { id: "thor-arrives", title: "Thor", year: 2011, release: 2011, phase: 1, importance: "origin", short: "Thor is banished to Earth and becomes connected to humanity and S.H.I.E.L.D.", tags: ["Thor", "Loki", "Nick Fury"] },
  { id: "cap-found", title: "Captain America is found", year: 2011, release: 2011, phase: 1, importance: "major", short: "Steve Rogers is recovered from the ice after decades frozen since World War II.", tags: ["Steve Rogers / Captain America", "Nick Fury"] },
  { id: "avengers", title: "The Avengers", year: 2012, release: 2012, phase: 1, importance: "critical", short: "The Battle of New York brings the original Avengers together.", tags: ["Tony Stark / Iron Man", "Steve Rogers / Captain America", "Bruce Banner / Hulk", "Thor", "Natasha Romanoff / Black Widow", "Loki", "Nick Fury", "Thanos"] },
  { id: "iron-man-3", title: "Iron Man 3", year: 2013, release: 2013, phase: 2, importance: "major", short: "Tony struggles with trauma after New York and rebuilds beyond the suits.", tags: ["Tony Stark / Iron Man"] },
  { id: "dark-world", title: "Thor: The Dark World", year: 2013, release: 2013, phase: 2, importance: "major", short: "Thor faces the Dark Elves and another Infinity Stone comes into play.", tags: ["Thor", "Loki"] },
  { id: "winter-soldier", title: "Captain America: The Winter Soldier", year: 2014, release: 2014, phase: 2, importance: "critical", short: "S.H.I.E.L.D. collapses after HYDRA is exposed.", tags: ["Steve Rogers / Captain America", "Natasha Romanoff / Black Widow", "Nick Fury", "Bucky Barnes / Winter Soldier"] },
  { id: "guardians", title: "Guardians of the Galaxy", year: 2014, release: 2014, phase: 2, importance: "origin", short: "The Guardians form in space and the Power Stone becomes central to the cosmic story.", tags: ["Peter Quill / Star-Lord", "Gamora", "Rocket", "Groot", "Drax", "Thanos"] },
  { id: "guardians-2", title: "Guardians of the Galaxy Vol. 2", year: 2014, release: 2017, phase: 3, importance: "major", short: "The Guardians face Ego and become more of a family.", tags: ["Peter Quill / Star-Lord", "Gamora", "Rocket", "Groot", "Drax"] },
  { id: "age-ultron", title: "Avengers: Age of Ultron", year: 2015, release: 2015, phase: 2, importance: "critical", short: "Ultron attacks and Sokovia is destroyed.", tags: ["Tony Stark / Iron Man", "Steve Rogers / Captain America", "Bruce Banner / Hulk", "Thor", "Natasha Romanoff / Black Widow", "Wanda Maximoff / Scarlet Witch", "Vision", "Thanos"] },
  { id: "ant-man", title: "Ant-Man", year: 2015, release: 2015, phase: 2, importance: "origin", short: "Scott Lang becomes Ant-Man and enters the superhero world through Hank Pym.", tags: ["Scott Lang / Ant-Man", "Hope van Dyne / Wasp"] },
  { id: "civil-war", title: "Captain America: Civil War", year: 2016, release: 2016, phase: 3, importance: "critical", short: "The Avengers split over the Sokovia Accords and Peter Parker is recruited by Tony Stark.", tags: ["Tony Stark / Iron Man", "Steve Rogers / Captain America", "Peter Parker / Spider-Man", "Natasha Romanoff / Black Widow", "Wanda Maximoff / Scarlet Witch", "Vision", "T'Challa / Black Panther", "Scott Lang / Ant-Man", "Bucky Barnes / Winter Soldier"] },
  { id: "black-widow", title: "Black Widow", year: 2016, release: 2021, phase: 4, importance: "major", short: "Natasha confronts her past after Civil War and reconnects with Yelena.", tags: ["Natasha Romanoff / Black Widow", "Yelena Belova"] },
  { id: "black-panther", title: "Black Panther", year: 2016, release: 2018, phase: 3, importance: "origin", short: "T'Challa becomes king of Wakanda and faces Killmonger.", tags: ["T'Challa / Black Panther"] },
  { id: "homecoming", title: "Spider-Man: Homecoming", year: 2016, release: 2017, phase: 3, importance: "origin", short: "Peter returns to Queens after fighting with Team Iron Man.", tags: ["Peter Parker / Spider-Man", "Tony Stark / Iron Man"] },
  { id: "doctor-strange", title: "Doctor Strange", year: 2016, release: 2016, phase: 3, importance: "origin", short: "Stephen Strange becomes a sorcerer and protects the Time Stone.", tags: ["Stephen Strange / Doctor Strange"] },
  { id: "daredevil-early-war", title: "Daredevil's first Hell's Kitchen war", year: 2015, release: 2015, phase: 2, importance: "origin", short: "Matt Murdock turns his heightened senses, training, and legal mind into a street-level fight for Hell's Kitchen.", tags: ["Matt Murdock / Daredevil"] },
  { id: "jessica-jones-kilgrave", title: "Jessica Jones confronts Kilgrave", year: 2015, release: 2015, phase: 2, importance: "critical", short: "Jessica faces the man who weaponized control against her and begins reclaiming her life on her own terms.", tags: ["Jessica Jones"] },
  { id: "ragnarok", title: "Thor: Ragnarok", year: 2017, release: 2017, phase: 3, importance: "critical", short: "Thor and Hulk escape Sakaar as Asgard falls.", tags: ["Thor", "Bruce Banner / Hulk", "Loki"] },
  { id: "ant-man-wasp", title: "Ant-Man and the Wasp", year: 2018, release: 2018, phase: 3, importance: "major", short: "Scott and Hope explore the Quantum Realm just before the Snap.", tags: ["Scott Lang / Ant-Man", "Hope van Dyne / Wasp"] },
  { id: "infinity-war", title: "Avengers: Infinity War", year: 2018, release: 2018, phase: 3, importance: "critical", short: "Thanos collects the Infinity Stones and snaps half of life away.", tags: ["Tony Stark / Iron Man", "Steve Rogers / Captain America", "Bruce Banner / Hulk", "Peter Parker / Spider-Man", "Thor", "Natasha Romanoff / Black Widow", "Stephen Strange / Doctor Strange", "Wanda Maximoff / Scarlet Witch", "Vision", "T'Challa / Black Panther", "Peter Quill / Star-Lord", "Gamora", "Nebula", "Rocket", "Groot", "Drax", "Loki", "Thanos", "Bucky Barnes / Winter Soldier"] },
  { id: "endgame", title: "Avengers: Endgame", year: 2023, release: 2019, phase: 3, importance: "critical", short: "The surviving Avengers reverse the Snap after a five-year time jump.", tags: ["Tony Stark / Iron Man", "Steve Rogers / Captain America", "Bruce Banner / Hulk", "Peter Parker / Spider-Man", "Thor", "Natasha Romanoff / Black Widow", "Stephen Strange / Doctor Strange", "Wanda Maximoff / Scarlet Witch", "T'Challa / Black Panther", "Scott Lang / Ant-Man", "Hope van Dyne / Wasp", "Peter Quill / Star-Lord", "Gamora", "Nebula", "Rocket", "Groot", "Drax", "Thanos", "Bucky Barnes / Winter Soldier"] },
  { id: "wandavision", title: "WandaVision", year: 2023, release: 2021, phase: 4, importance: "critical", short: "Wanda's grief creates the Westview anomaly and Agatha reveals herself as a hidden magical threat.", tags: ["Wanda Maximoff / Scarlet Witch", "Vision", "Agatha Harkness"] },
  { id: "loki-series", title: "Loki", year: 2023, release: 2021, phase: 4, importance: "critical", short: "A Loki variant is pulled into the TVA and becomes central to the multiverse timeline.", tags: ["Loki"] },
  { id: "far-from-home", title: "Spider-Man: Far From Home", year: 2024, release: 2019, phase: 3, importance: "major", short: "Peter deals with Tony Stark's legacy after Endgame.", tags: ["Peter Parker / Spider-Man", "Tony Stark / Iron Man", "Nick Fury"] },
  { id: "no-way-home", title: "Spider-Man: No Way Home", year: 2024, release: 2021, phase: 4, importance: "critical", short: "Peter's identity crisis opens the door to multiverse visitors.", tags: ["Peter Parker / Spider-Man", "Stephen Strange / Doctor Strange"] },
  { id: "multiverse-madness", title: "Doctor Strange in the Multiverse of Madness", year: 2024, release: 2022, phase: 4, importance: "critical", short: "Doctor Strange and America Chavez face Wanda across the multiverse.", tags: ["Stephen Strange / Doctor Strange", "Wanda Maximoff / Scarlet Witch", "America Chavez"] },
  { id: "hawkeye", title: "Hawkeye", year: 2024, release: 2021, phase: 4, importance: "major", short: "Clint Barton meets Kate Bishop while Yelena and Wilson Fisk cross back into the New York street-level story.", tags: ["Clint Barton / Hawkeye", "Kate Bishop", "Yelena Belova", "Wilson Fisk"] },
  { id: "echo", title: "Echo", year: 2025, release: 2024, phase: 5, importance: "major", short: "Wilson Fisk re-enters the street-level power struggle as Maya Lopez confronts her past.", tags: ["Wilson Fisk", "Maya Lopez"] },
  { id: "falcon-winter-soldier", title: "The Falcon and the Winter Soldier", year: 2024, release: 2021, phase: 4, importance: "major", short: "Sam Wilson accepts the Captain America mantle after Endgame.", tags: ["Sam Wilson / Captain America", "Bucky Barnes / Winter Soldier"] },
  { id: "shang-chi", title: "Shang-Chi and the Legend of the Ten Rings", year: 2024, release: 2021, phase: 4, importance: "origin", short: "Shang-Chi confronts the Ten Rings and enters the wider MCU.", tags: ["Shang-Chi"] },
  { id: "visionquest", title: "VisionQuest", year: 2026, release: 2026, phase: 6, importance: "critical", accuracy: "planned", timelineBasis: "projected", short: "White Vision tries to recover his memory and humanity in the planned Disney+ series.", tags: ["Vision"] },
  { id: "moon-knight", title: "Moon Knight", year: 2025, release: 2022, phase: 4, importance: "origin", short: "Marc Spector and Steven Grant enter a supernatural Egyptian conflict.", tags: ["Marc Spector / Moon Knight"] },
  { id: "wakanda-forever", title: "Black Panther: Wakanda Forever", year: 2025, release: 2022, phase: 4, importance: "major", short: "Wakanda grieves T'Challa and faces Namor and Talokan.", tags: ["Shuri / Black Panther", "T'Challa / Black Panther", "Namor"] },
  { id: "she-hulk", title: "She-Hulk: Attorney at Law", year: 2025, release: 2022, phase: 4, importance: "origin", short: "Jennifer Walters becomes She-Hulk and enters superhero law.", tags: ["Jennifer Walters / She-Hulk", "Bruce Banner / Hulk"] },
  { id: "ms-marvel", title: "Ms. Marvel", year: 2025, release: 2022, phase: 4, importance: "origin", short: "Kamala Khan discovers her powers and becomes Ms. Marvel.", tags: ["Kamala Khan / Ms. Marvel"] },
  { id: "love-thunder", title: "Thor: Love and Thunder", year: 2025, release: 2022, phase: 4, importance: "major", accuracy: "estimated", short: "Thor faces Gorr and reconnects with Jane Foster.", tags: ["Thor"] },
  { id: "quantumania", title: "Ant-Man and the Wasp: Quantumania", year: 2025, release: 2023, phase: 5, importance: "major", short: "Scott, Hope, and family face Kang in the Quantum Realm.", tags: ["Scott Lang / Ant-Man", "Hope van Dyne / Wasp", "Kang"] },
  { id: "agatha-all-along", title: "Agatha All Along", year: 2026, release: 2024, phase: 5, importance: "major", accuracy: "estimated", short: "Agatha breaks out of Wanda's spell and follows a darker witchcraft path beyond Westview.", tags: ["Agatha Harkness"] },
  { id: "guardians-3", title: "Guardians of the Galaxy Vol. 3", year: 2026, release: 2023, phase: 5, importance: "major", accuracy: "estimated", short: "The Guardians confront Rocket's past after the Holiday Special.", tags: ["Peter Quill / Star-Lord", "Rocket", "Groot", "Drax", "Gamora", "Nebula"] },
  { id: "daredevil-born-again", title: "Daredevil: Born Again", year: 2026, release: 2025, phase: 5, importance: "major", accuracy: "estimated", short: "Matt Murdock's fight for Hell's Kitchen continues as law, politics, and Wilson Fisk's power collide again.", tags: ["Matt Murdock / Daredevil", "Wilson Fisk"] },
  { id: "secret-invasion", title: "Secret Invasion", year: 2026, release: 2023, phase: 5, importance: "major", accuracy: "estimated", short: "Nick Fury faces a Skrull conspiracy on Earth.", tags: ["Nick Fury"] },
  { id: "the-marvels", title: "The Marvels", year: 2026, release: 2023, phase: 5, importance: "major", accuracy: "estimated", short: "Carol, Monica, and Kamala become entangled through their powers.", tags: ["Carol Danvers / Captain Marvel", "Kamala Khan / Ms. Marvel", "Monica Rambeau"] },
  { id: "spider-man-brand-new-day", title: "Spider-Man: Brand New Day", year: 2026, release: 2026, phase: 6, importance: "critical", accuracy: "planned", timelineBasis: "projected", short: "Peter Parker is expected to continue as a street-level Spider-Man in a New York City that no longer knows his name.", tags: ["Peter Parker / Spider-Man", "Bruce Banner / Hulk"] },
  { id: "avengers-doomsday", title: "Avengers: Doomsday", year: 2026, release: 2026, phase: 6, importance: "critical", accuracy: "planned", timelineBasis: "projected", short: "The next Avengers chapter is projected to pull several major heroes back into a Doctor Doom-centered crisis.", tags: ["Thor", "Steve Rogers / Captain America", "Scott Lang / Ant-Man", "Shang-Chi"] },
  { id: "brave-new-world", title: "Captain America: Brave New World", year: 2027, release: 2025, phase: 5, importance: "major", accuracy: "estimated", short: "Sam Wilson continues as Captain America after the 2026 MCU period.", tags: ["Sam Wilson / Captain America"] },
  { id: "thunderbolts", title: "Thunderbolts*", year: 2027, release: 2025, phase: 5, importance: "major", accuracy: "estimated", short: "A team of antiheroes is pulled into a dangerous mission after Brave New World.", tags: ["Bucky Barnes / Winter Soldier", "Yelena Belova"] },
  { id: "avengers-secret-wars", title: "Avengers: Secret Wars", year: 2027, release: 2027, phase: 6, importance: "critical", accuracy: "planned", timelineBasis: "projected", short: "The following Avengers chapter is still mostly under wraps, so character placement remains limited until more story details are public.", tags: ["Doctor Doom / Victor von Doom"] },
];

const characters = [
  { name: "Peter Parker / Spider-Man", aliases: ["spiderman", "spider-man", "peter", "peter parker"], shortName: "Spider-Man", firstActiveYear: 2016, icon: "🕷️", accent: "from-red-600 to-blue-600", location: "Queens, New York", timeline: [{ from: 1942, to: 2011, status: "Not active yet." }, { from: 2012, to: 2015, status: "Still a kid in Queens while the Avengers become public heroes." }, { from: 2016, to: 2017, status: "Active as Spider-Man and recruited by Tony Stark." }, { from: 2018, to: 2022, status: "Fights Thanos and is erased by the Snap." }, { from: 2023, to: 2023, status: "Restored and joins the final battle against Thanos." }, { from: 2024, to: 2027, status: "Back in New York after the multiverse crisis." }] },
  { name: "Tony Stark / Iron Man", aliases: ["ironman", "iron man", "tony", "tony stark"], shortName: "Iron Man", firstActiveYear: 2010, icon: "🤖", accent: "from-red-500 to-yellow-500", location: "Global / Avengers operations", timeline: [{ from: 1942, to: 2009, status: "Not Iron Man yet." }, { from: 2010, to: 2011, status: "Becomes Iron Man." }, { from: 2012, to: 2014, status: "Core Avenger after New York." }, { from: 2015, to: 2017, status: "Creates Ultron, backs the Accords, and mentors Peter." }, { from: 2018, to: 2022, status: "Survives the Snap after losing Peter." }, { from: 2023, to: 2027, status: "Sacrifices himself to defeat Thanos." }] },
  { name: "Steve Rogers / Captain America", aliases: ["captain america", "cap", "steve", "steve rogers"], shortName: "Captain America", firstActiveYear: 1942, icon: "⭐", accent: "from-blue-600 to-slate-300", location: "Avengers / fugitive operations", timeline: [{ from: 1942, to: 1945, status: "Active during World War II." }, { from: 1946, to: 2010, status: "Frozen in ice." }, { from: 2011, to: 2011, status: "Found by S.H.I.E.L.D." }, { from: 2012, to: 2013, status: "Leads the Avengers in New York." }, { from: 2014, to: 2015, status: "Exposes HYDRA and fights Ultron." }, { from: 2016, to: 2017, status: "Opposes the Accords and becomes a fugitive." }, { from: 2018, to: 2022, status: "Survives the Snap." }, { from: 2023, to: 2027, status: "Returns the Stones and stays in the past." }] },
  { name: "Bruce Banner / Hulk", aliases: ["hulk", "bruce", "bruce banner"], shortName: "Hulk", firstActiveYear: 2005, icon: "🟢", accent: "from-green-600 to-lime-300", location: "Avengers / science operations", timeline: [{ from: 1942, to: 2004, status: "Not Hulk yet." }, { from: 2005, to: 2011, status: "Living off-grid while controlling the Hulk." }, { from: 2012, to: 2014, status: "Original Avenger." }, { from: 2015, to: 2017, status: "Leaves Earth and appears on Sakaar." }, { from: 2018, to: 2022, status: "Returns to Earth and survives the Snap." }, { from: 2023, to: 2027, status: "Smart Hulk performs the reverse Snap." }] },
  { name: "Thor", aliases: ["thor", "god of thunder"], shortName: "Thor", firstActiveYear: 2011, icon: "⚡", accent: "from-sky-500 to-indigo-500", location: "Asgard / Earth / Space", timeline: [{ from: 1942, to: 2010, status: "Prince of Asgard." }, { from: 2011, to: 2012, status: "Banished to Earth and then stops Loki." }, { from: 2013, to: 2016, status: "Moving between Asgard and cosmic conflicts." }, { from: 2017, to: 2017, status: "Loses Asgard during Ragnarok." }, { from: 2018, to: 2022, status: "Survives the Snap but struggles after Thanos." }, { from: 2023, to: 2027, status: "Leaves Earth with the Guardians." }] },
  { name: "Natasha Romanoff / Black Widow", aliases: ["black widow", "natasha", "natasha romanoff"], shortName: "Black Widow", firstActiveYear: 2010, icon: "🕶️", accent: "from-zinc-700 to-red-500", location: "S.H.I.E.L.D. / Avengers", timeline: [{ from: 1942, to: 2009, status: "Not publicly connected to the Avengers." }, { from: 2010, to: 2011, status: "Undercover for S.H.I.E.L.D." }, { from: 2012, to: 2015, status: "Core Avenger." }, { from: 2016, to: 2017, status: "Helps Steve and operates in the shadows." }, { from: 2018, to: 2022, status: "Survives the Snap." }, { from: 2023, to: 2027, status: "Sacrifices herself on Vormir." }] },
  { name: "Stephen Strange / Doctor Strange", aliases: ["doctor strange", "dr strange", "strange", "stephen strange"], shortName: "Doctor Strange", firstActiveYear: 2016, icon: "🌀", accent: "from-orange-500 to-purple-600", location: "New York Sanctum / Multiverse", timeline: [{ from: 1942, to: 2015, status: "Surgeon before the mystic arts." }, { from: 2016, to: 2017, status: "Learns sorcery and protects the Time Stone." }, { from: 2018, to: 2022, status: "Fights Thanos and is snapped." }, { from: 2023, to: 2023, status: "Restored for the final battle." }, { from: 2024, to: 2027, status: "Deals with multiverse consequences." }] },
  { name: "Wanda Maximoff / Scarlet Witch", aliases: ["wanda", "wanda maximoff", "scarlet witch"], shortName: "Scarlet Witch", firstActiveYear: 2015, icon: "🔴", accent: "from-red-700 to-pink-500", location: "Sokovia / Westview / Multiverse", timeline: [{ from: 1942, to: 2014, status: "Not active yet." }, { from: 2015, to: 2017, status: "Introduced during Ultron and joins the Avengers." }, { from: 2018, to: 2022, status: "Destroys the Mind Stone and is snapped." }, { from: 2023, to: 2023, status: "Returns during Endgame." }, { from: 2024, to: 2027, status: "Westview and multiverse crisis period." }] },
  { name: "Scott Lang / Ant-Man", aliases: ["ant man", "ant-man", "scott", "scott lang"], shortName: "Ant-Man", firstActiveYear: 2015, icon: "🐜", accent: "from-red-500 to-zinc-400", location: "San Francisco / Quantum Realm", timeline: [{ from: 1942, to: 2014, status: "Not active yet." }, { from: 2015, to: 2015, status: "Becomes Ant-Man." }, { from: 2016, to: 2017, status: "Helps Team Cap and is under house arrest." }, { from: 2018, to: 2022, status: "Trapped in the Quantum Realm." }, { from: 2023, to: 2024, status: "Gives the Avengers the time-heist idea." }, { from: 2025, to: 2027, status: "Pulled into Quantum Realm conflicts." }] },
  { name: "Nick Fury", aliases: ["nick fury", "fury", "nick"], shortName: "Nick Fury", firstActiveYear: 1995, icon: "👁️", accent: "from-zinc-500 to-slate-100", location: "S.H.I.E.L.D. / Space / Earth", timeline: [{ from: 1942, to: 1994, status: "Not central yet." }, { from: 1995, to: 2009, status: "Learns about cosmic threats." }, { from: 2010, to: 2012, status: "Builds the Avengers Initiative." }, { from: 2013, to: 2017, status: "Operates after S.H.I.E.L.D.'s collapse." }, { from: 2018, to: 2022, status: "Erased by the Snap." }, { from: 2023, to: 2027, status: "Returns after the Blip and faces Skrull threats." }] },
  { name: "Matt Murdock / Daredevil", aliases: ["daredevil", "dare devil", "matt", "matt murdock"], shortName: "Daredevil", firstActiveYear: 2015, icon: "DD", accent: "from-red-800 to-zinc-700", location: "Hell's Kitchen, New York", timeline: [{ from: 1942, to: 2014, status: "Not publicly active as Daredevil yet." }, { from: 2015, to: 2017, status: "Defending Hell's Kitchen through law by day and vigilantism by night." }, { from: 2018, to: 2023, status: "Still tied to New York's street-level crime world, with activity less publicly mapped." }, { from: 2024, to: 2027, status: "Back in the New York legal and vigilante world as Hell's Kitchen heats up again." }] },
  { name: "Jessica Jones", aliases: ["jessica", "jessica jones", "jones"], shortName: "Jessica Jones", firstActiveYear: 2015, icon: "JJ", accent: "from-indigo-700 to-zinc-500", location: "Alias Investigations / New York", timeline: [{ from: 1942, to: 2014, status: "Not publicly active in the wider hero timeline yet." }, { from: 2015, to: 2016, status: "Operating as a private investigator while confronting Kilgrave and her trauma." }, { from: 2017, to: 2019, status: "Still working New York cases while resisting being turned into a traditional superhero." }, { from: 2020, to: 2027, status: "Exact current whereabouts are not clearly mapped, but her story remains rooted in New York and survivor-driven street-level cases." }] },
  { name: "Thanos", aliases: ["thanos", "mad titan"], shortName: "Thanos", firstActiveYear: 2012, icon: "T", accent: "from-purple-700 to-yellow-500", location: "Sanctuary II / Titan / Garden planet", timeline: [{ from: 1942, to: 2011, status: "Operating off-screen as a cosmic warlord." }, { from: 2012, to: 2015, status: "Manipulates cosmic events from behind the scenes." }, { from: 2016, to: 2017, status: "Still gathering power before directly pursuing the Infinity Stones." }, { from: 2018, to: 2022, status: "Completes the Snap, then is killed by the surviving Avengers." }, { from: 2023, to: 2027, status: "A 2014 variant attacks the Avengers and is erased during the final battle." }] },
  { name: "Vision", aliases: ["vision", "white vision", "the vision"], shortName: "Vision", firstActiveYear: 2015, icon: "V", accent: "from-emerald-400 to-yellow-300", location: "Avengers / Scotland / Westview", timeline: [{ from: 1942, to: 2014, status: "Not created yet." }, { from: 2015, to: 2017, status: "Created from J.A.R.V.I.S., the Mind Stone, and the synthetic body built for Ultron." }, { from: 2018, to: 2022, status: "Killed when Thanos takes the Mind Stone." }, { from: 2023, to: 2025, status: "Recreated as a memory-based Westview Vision and as White Vision, who leaves after regaining key memories." }, { from: 2026, to: 2026, status: "Planned focus of VisionQuest, with exact story placement still projected." }] },
  { name: "Shang-Chi", aliases: ["shang chi", "shang-chi", "shaun", "xu shang chi"], shortName: "Shang-Chi", firstActiveYear: 2024, icon: "SC", accent: "from-red-700 to-amber-400", location: "San Francisco / Ta Lo / Ten Rings network", timeline: [{ from: 1942, to: 2023, status: "Living outside the public Avengers story before his superhero origin." }, { from: 2024, to: 2025, status: "Confronts Wenwu, protects Ta Lo, and enters the wider MCU through the Ten Rings." }, { from: 2026, to: 2026, status: "Planned to return in Avengers: Doomsday, but exact in-universe placement is still projected." }] },
  { name: "Namor", aliases: ["namor", "ku'ku'lkán", "kukulkan", "talokan", "namor mckenzie"], shortName: "Namor", firstActiveYear: 2025, icon: "NM", accent: "from-teal-500 to-emerald-300", location: "Talokan / Wakanda conflict zone", timeline: [{ from: 1942, to: 2024, status: "Protecting Talokan from the surface world while staying mostly hidden from the wider MCU." }, { from: 2025, to: 2025, status: "Leads Talokan into conflict with Wakanda after T'Challa's death exposes new global pressure around vibranium." }, { from: 2026, to: 2027, status: "Still ruler of Talokan, with his next move unclear after the fragile peace with Wakanda." }] },
  { name: "Kamala Khan / Ms. Marvel", aliases: ["kamala", "kamala khan", "ms marvel", "ms. marvel", "miss marvel"], shortName: "Ms. Marvel", firstActiveYear: 2025, icon: "MK", accent: "from-blue-500 to-pink-500", location: "Jersey City / cosmic team-ups", timeline: [{ from: 1942, to: 2024, status: "Not active as Ms. Marvel yet." }, { from: 2025, to: 2025, status: "Discovers her powers and becomes a young hero in Jersey City." }, { from: 2026, to: 2026, status: "Gets pulled into a cosmic entanglement with Carol Danvers and Monica Rambeau." }, { from: 2027, to: 2027, status: "Likely back on Earth as a young hero with a much bigger cosmic connection." }] },
  { name: "Bucky Barnes / Winter Soldier", aliases: ["bucky", "bucky barnes", "winter soldier", "white wolf"], shortName: "Winter Soldier", firstActiveYear: 1942, icon: "BB", accent: "from-slate-500 to-red-500", location: "Brooklyn / Wakanda / Thunderbolts operations", timeline: [{ from: 1942, to: 1945, status: "Fights beside Steve Rogers during World War II." }, { from: 1946, to: 2013, status: "Used by HYDRA as the Winter Soldier while his own identity is buried." }, { from: 2014, to: 2017, status: "Breaks from HYDRA control and becomes central to Steve's conflict with the Accords." }, { from: 2018, to: 2023, status: "Fights in Wakanda, is erased by the Snap, then returns for the final battle." }, { from: 2024, to: 2027, status: "Works through his past with Sam Wilson and is later pulled into Thunderbolts-level missions." }] },
  { name: "Loki", aliases: ["loki", "god of mischief", "loki laufeyson"], shortName: "Loki", firstActiveYear: 2011, icon: "LK", accent: "from-emerald-500 to-yellow-400", location: "Asgard / TVA / Multiverse", timeline: [{ from: 1942, to: 2010, status: "Prince of Asgard and rival brother to Thor." }, { from: 2011, to: 2012, status: "Falls into open conflict with Thor and then attacks New York." }, { from: 2013, to: 2017, status: "Moves between betrayal, survival, and uneasy family loyalty as Asgard collapses." }, { from: 2018, to: 2022, status: "The main timeline Loki is killed by Thanos." }, { from: 2023, to: 2027, status: "A Loki variant becomes tied to the TVA and the structure of the multiverse itself." }] },
  { name: "Agatha Harkness", aliases: ["agatha", "agatha harkness", "agnes"], shortName: "Agatha", firstActiveYear: 2023, icon: "AG", accent: "from-purple-700 to-fuchsia-400", location: "Westview / Witches' Road", timeline: [{ from: 1942, to: 2022, status: "Operating as a hidden witch outside the main public hero timeline." }, { from: 2023, to: 2023, status: "Reveals herself inside the Westview anomaly while trying to understand Wanda's power." }, { from: 2024, to: 2025, status: "Trapped under Wanda's spell in Westview." }, { from: 2026, to: 2027, status: "Breaks back into the magic story through a darker witchcraft path." }] },
  { name: "Yelena Belova", aliases: ["yelena", "yelena belova", "black widow yelena"], shortName: "Yelena", firstActiveYear: 2016, icon: "YB", accent: "from-zinc-500 to-red-400", location: "Red Room aftermath / New York / Thunderbolts operations", timeline: [{ from: 1942, to: 2015, status: "Raised inside the Red Room system before breaking from its control." }, { from: 2016, to: 2017, status: "Reconnects with Natasha and helps dismantle the Red Room network." }, { from: 2018, to: 2023, status: "Her exact activity is less mapped while the Blip reshapes the world." }, { from: 2024, to: 2026, status: "Crosses into Clint Barton's story while processing Natasha's death." }, { from: 2027, to: 2027, status: "Pulled into the Thunderbolts mission path." }] },
  { name: "Gamora", aliases: ["gamora", "daughter of thanos"], shortName: "Gamora", firstActiveYear: 2014, icon: "GM", accent: "from-green-600 to-rose-400", location: "Guardians / space", timeline: [{ from: 1942, to: 2013, status: "Raised and weaponized by Thanos after her home world is attacked." }, { from: 2014, to: 2017, status: "Breaks away from Thanos and becomes part of the Guardians." }, { from: 2018, to: 2022, status: "Killed by Thanos during his hunt for the Soul Stone." }, { from: 2023, to: 2025, status: "A 2014 variant survives the final battle and is no longer the same Gamora the Guardians knew." }, { from: 2026, to: 2027, status: "Operating apart from the original Guardians family after their last major mission." }] },
  { name: "Nebula", aliases: ["nebula", "daughter of thanos"], shortName: "Nebula", firstActiveYear: 2014, icon: "NB", accent: "from-blue-700 to-violet-400", location: "Guardians / Knowhere / space", timeline: [{ from: 1942, to: 2013, status: "Turned into a weapon by Thanos and pushed into brutal rivalry with Gamora." }, { from: 2014, to: 2017, status: "Moves from enemy to uneasy ally as her hatred of Thanos becomes clearer." }, { from: 2018, to: 2022, status: "Survives the Snap and works with the remaining Avengers after Thanos wins." }, { from: 2023, to: 2025, status: "Helps defeat Thanos and begins rebuilding a life away from his control." }, { from: 2026, to: 2027, status: "Helps shape the Guardians' future around Knowhere and a more stable community." }] },
  { name: "Peter Quill / Star-Lord", aliases: ["star lord", "star-lord", "peter quill", "quill"], shortName: "Star-Lord", firstActiveYear: 2014, icon: "SL", accent: "from-red-600 to-amber-400", location: "Guardians / space / Earth", timeline: [{ from: 1942, to: 1987, status: "Not active yet." }, { from: 1988, to: 2013, status: "Taken from Earth and raised among Ravagers in space." }, { from: 2014, to: 2017, status: "Forms the Guardians and learns the truth about Ego." }, { from: 2018, to: 2022, status: "Fights Thanos and is erased by the Snap." }, { from: 2023, to: 2025, status: "Restored and reconnects with a changed Guardians family." }, { from: 2026, to: 2027, status: "Leaves the Guardians' main path and returns toward Earth after Rocket's story closes." }] },
  { name: "Wilson Fisk", aliases: ["wilson fisk", "kingpin", "fisk"], shortName: "Kingpin", firstActiveYear: 2015, icon: "WF", accent: "from-white to-red-600", location: "New York criminal and political power networks", timeline: [{ from: 1942, to: 2014, status: "Building power in New York before entering the mapped street-level timeline." }, { from: 2015, to: 2017, status: "Becomes the central criminal force opposing Daredevil in Hell's Kitchen." }, { from: 2018, to: 2023, status: "His public power shifts, but he remains tied to New York's criminal infrastructure." }, { from: 2024, to: 2025, status: "Reappears through Hawkeye and Echo as his influence reaches beyond Hell's Kitchen." }, { from: 2026, to: 2027, status: "Back in the Daredevil conflict zone, with law, politics, and street power colliding." }] },
];

const characterArt = {
  "Peter Parker / Spider-Man": { imageUrl: "https://cdn.marvel.com/content/2x/005smp-com_mas_dsk_04.jpg", imagePosition: "72% center", fallback: "SP" },
  "Tony Stark / Iron Man": { imageUrl: "https://cdn.marvel.com/content/2x/002irm_ons_mas_dsk_01_0.jpg", imagePosition: "72% center", fallback: "IM" },
  "Steve Rogers / Captain America": { imageUrl: "https://cdn.marvel.com/content/2x/003cap_ons_mas_dsk_01_4.jpg", imagePosition: "68% center", fallback: "CA" },
  "Bruce Banner / Hulk": { imageUrl: "https://cdn.marvel.com/content/2x/006hbb_ons_mas_dsk_01_1.jpg", imagePosition: "62% center", fallback: "HK" },
  "Thor": { imageUrl: "https://cdn.marvel.com/content/2x/004tho_ons_mas_dsk_04.jpg", imagePosition: "68% center", fallback: "TH" },
  "Natasha Romanoff / Black Widow": { imageUrl: "https://cdn.marvel.com/content/2x/011blw_lob_mas_dsk_06.jpg", imagePosition: "66% center", fallback: "BW" },
  "Stephen Strange / Doctor Strange": { imageUrl: "https://cdn.marvel.com/content/2x/009drs_ons_mas_dsk_04.jpg", imagePosition: "58% center", fallback: "DS" },
  "Wanda Maximoff / Scarlet Witch": { imageUrl: "https://cdn.marvel.com/content/2x/012scw_ons_mas_dsk_01_1.jpg", imagePosition: "58% center", fallback: "SW" },
  "Scott Lang / Ant-Man": { imageUrl: "https://cdn.marvel.com/content/2x/010ant_ons_mas_dsk_04.jpg", imagePosition: "62% center", fallback: "AM" },
  "Nick Fury": { imageUrl: "https://cdn.marvel.com/content/2x/284nfy_ons_mas_dsk_06_0.jpg", imagePosition: "58% center", fallback: "NF" },
  "Matt Murdock / Daredevil": { fallback: "DD" },
  "Jessica Jones": { fallback: "JJ" },
  "Thanos": { imageUrl: "https://cdn.marvel.com/content/2x/022tha_ons_mas_dsk_01.jpg", imagePosition: "54% center", fallback: "TH" },
  "Vision": { imageUrl: "https://cdn.marvel.com/content/2x/013vis_ons_mas_dsk_01.jpg", imagePosition: "52% center", fallback: "VI" },
  "Shang-Chi": { imageUrl: "https://cdn.marvel.com/content/2x/shangchi_lob_mas_dsk_01.jpg", imagePosition: "50% center", fallback: "SC" },
  "Namor": { fallback: "NM" },
  "Kamala Khan / Ms. Marvel": { fallback: "MK" },
  "Bucky Barnes / Winter Soldier": { fallback: "BB" },
  "Loki": { fallback: "LK" },
  "Agatha Harkness": { fallback: "AG" },
  "Yelena Belova": { fallback: "YB" },
  "Gamora": { fallback: "GM" },
  "Nebula": { fallback: "NB" },
  "Peter Quill / Star-Lord": { fallback: "SL" },
  "Wilson Fisk": { fallback: "WF" },
};

const imdbSearchUrl = (title) => `https://www.imdb.com/find/?q=${encodeURIComponent(title)}`;
const marvelSearchUrl = (title) => `https://www.marvel.com/search?limit=20&query=${encodeURIComponent(title)}`;
const sourceCredits = [
  { name: "Marvel", url: "https://www.marvel.com", logoClass: "bg-red-600 text-white", logoText: "MARVEL" },
  { name: "IMDb", url: "https://www.imdb.com", logoClass: "bg-yellow-400 text-black", logoText: "IMDb" },
  { name: "New Rockstars", url: "https://www.youtube.com/@NewRockstars", imageUrl: "https://static.wikia.nocookie.net/youtube/images/5/58/New_Rockstars.jpeg/revision/latest?cb=20240829221236", logoText: "NR" },
  { name: "Emergency Awesome", url: "https://www.youtube.com/@emergencyawesome", imageUrl: "https://static.wikia.nocookie.net/youtube/images/1/1a/Emergency_Awesome.png/revision/latest?cb=20180820073055", logoText: "EA" },
];

const sourceLinksFor = (items) => {
  const title = items[0]?.title ?? "Marvel Cinematic Universe";
  return [
    { label: `IMDb: ${title}`, url: imdbSearchUrl(title) },
    { label: `Marvel: ${title}`, url: marvelSearchUrl(title) },
  ];
};

const exactWhereaboutsTitleFor = (character, eventsInYear) => {
  if (eventsInYear.length === 1) {
    const event = eventsInYear[0];
    const title = event.title === character.shortName ? "their own story" : event.title;
    const action = event.importance === "origin" ? "starts a defining origin chapter" : event.importance === "critical" ? "is part of a major turning point" : "has a mapped story stop";
    return `${character.shortName} ${action} in ${title}`;
  }
  return `${character.shortName} has ${eventsInYear.length} mapped story stops this year`;
};

const exactWhereaboutsSummaryFor = (character, status, eventsInYear) => {
  const eventText = eventsInYear.map((event) => `${event.title}: ${event.short}`).join(" ");
  return `${status} ${eventText}`;
};

const whereaboutsFor = (character, year) => {
  if (!character) return null;

  const override = whereaboutsIntel.find((item) => item.characterName === character.name && year >= item.from && year <= item.to);
  if (override) return override;

  const status = statusFor(character, year);
  const exactEvents = eventsForYear(year, character.name);
  const pastEvents = events.filter((event) => event.year < year && event.tags.includes(character.name)).sort((a, b) => b.year - a.year || b.release - a.release);
  const futureEvents = events.filter((event) => event.year > year && event.tags.includes(character.name)).sort((a, b) => a.year - b.year || a.release - b.release);
  const nearestPast = pastEvents[0] ?? null;
  const nearestFuture = futureEvents[0] ?? null;
  const sourceEvents = exactEvents.length > 0 ? exactEvents : [nearestPast, nearestFuture].filter(Boolean);

  if (exactEvents.length > 0) {
    return {
      confidence: "confirmed",
      title: exactWhereaboutsTitleFor(character, exactEvents),
      summary: exactWhereaboutsSummaryFor(character, status, exactEvents),
      note: `Primary setting clue: ${character.location}. Release years may differ from MCU in-universe years.`,
      sources: sourceLinksFor(exactEvents),
    };
  }

  if (nearestPast && nearestFuture) {
    return {
      confidence: "inferred",
      title: `${character.shortName}'s likely status between known appearances`,
      summary: `${status} The app places this year between ${nearestPast.title} (${nearestPast.year}) and ${nearestFuture.title} (${nearestFuture.year}), so the answer is inferred from the nearest known MCU appearances.`,
      note: `Best location clue: ${character.location}. This is a timeline inference, not a direct scene confirmation for ${year}.`,
      sources: sourceLinksFor([nearestPast, nearestFuture]),
    };
  }

  if (nearestPast) {
    return {
      confidence: year > 2025 ? "release-year clue" : "inferred",
      title: `${character.shortName}'s latest known MCU status`,
      summary: `${status} The closest earlier mapped appearance is ${nearestPast.title} (${nearestPast.year}), so this is the best available read after their last known stop in the timeline.`,
      note: `Best location clue: ${character.location}. Later projects may update this once their MCU placement is confirmed.`,
      sources: sourceLinksFor([nearestPast]),
    };
  }

  if (nearestFuture) {
    return {
      confidence: "pre-appearance",
      title: `${character.shortName} has not entered the mapped MCU timeline yet`,
      summary: `${status} The first mapped appearance ahead is ${nearestFuture.title} (${nearestFuture.year}), so there is no earlier on-screen whereabouts clue in this dataset.`,
      note: `The app is using future timeline placement rather than a confirmed location for ${year}.`,
      sources: sourceLinksFor([nearestFuture]),
    };
  }

  return {
    confidence: "unknown",
    title: `${character.shortName}'s whereabouts are not mapped yet`,
    summary: status,
    note: "Add more timeline entries to improve this answer.",
    sources: [
      { label: "IMDb search", url: imdbSearchUrl(character.shortName) },
      { label: "Marvel search", url: marvelSearchUrl(character.shortName) },
    ],
  };
};

function CharacterAvatar({ character, size = "sm", className = "" }) {
  const [failed, setFailed] = useState(false);
  const art = characterArt[character.name] ?? {};
  const sizes = {
    sm: "h-7 w-7 text-[10px]",
    md: "h-10 w-10 text-xs",
    lg: "h-16 w-16 text-base",
  };

  return (
    <span className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-zinc-800 font-black text-white shadow-inner ring-1 ring-black/40 ${sizes[size] ?? sizes.sm} ${className}`}>
      {art.imageUrl && !failed ? (
        <img
          alt=""
          className="h-full w-full object-cover"
          src={art.imageUrl}
          style={{ objectPosition: art.imagePosition ?? "center" }}
          onError={() => setFailed(true)}
        />
      ) : (
        <span>{art.fallback ?? character.shortName.slice(0, 2).toUpperCase()}</span>
      )}
    </span>
  );
}

function Icon({ name, className = "h-4 w-4" }) {
  const paths = {
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    film: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 3v18" /><path d="M17 3v18" /><path d="M3 8h4" /><path d="M3 16h4" /><path d="M17 8h4" /><path d="M17 16h4" /></>,
    pin: <><path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></>,
    sparkles: <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" /></>,
    play: <path d="M8 5v14l11-7-11-7Z" />,
    pause: <><path d="M8 5v14" /><path d="M16 5v14" /></>,
    reset: <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v6h6" /></>,
    mic: <><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z" /><path d="M19 11a7 7 0 0 1-14 0" /><path d="M12 18v3" /><path d="M8 21h8" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  };
  return <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">{paths[name] ?? null}</svg>;
}

const normalizeText = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const yearPct = (year, startYear, endYear = END_YEAR) => (endYear === startYear ? 100 : ((year - startYear) / (endYear - startYear)) * 100);
const statusFor = (character, year) => character.timeline.find((p) => year >= p.from && year <= p.to)?.status ?? "No clear timeline data yet.";
const identityNameFor = (character) => {
  const identity = character.name.includes("/") ? character.name.split("/")[0].trim() : character.name;
  return normalizeText(identity) === normalizeText(character.shortName) ? "" : identity;
};
const startYearFor = (character) => events.filter((e) => e.tags.includes(character.name)).map((e) => e.year).sort((a, b) => a - b)[0] ?? character.firstActiveYear ?? START_YEAR;
const endYearFor = (character) => Math.max(
  character.firstActiveYear ?? START_YEAR,
  ...events.filter((e) => e.tags.includes(character.name)).map((e) => e.year),
  ...whereaboutsIntel.filter((item) => item.characterName === character.name).map((item) => item.to),
);
const characterTerms = (c) => [c.name, c.shortName, ...(c.aliases ?? [])].map(normalizeText);
const wordsFor = (value) => normalizeText(value).split(" ").filter(Boolean);

const editDistance = (a, b) => {
  const left = normalizeText(a);
  const right = normalizeText(b);
  if (left === right) return 0;
  if (!left) return right.length;
  if (!right) return left.length;

  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  const current = Array(right.length + 1).fill(0);

  for (let i = 1; i <= left.length; i += 1) {
    current[0] = i;
    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + cost,
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[right.length];
};

const similarity = (a, b) => {
  const left = normalizeText(a);
  const right = normalizeText(b);
  if (!left || !right) return 0;
  if (left === right) return 1;
  if (left.includes(right) || right.includes(left)) return Math.min(left.length, right.length) / Math.max(left.length, right.length);
  return 1 - editDistance(left, right) / Math.max(left.length, right.length);
};

const phraseWindows = (query, term) => {
  const queryWords = wordsFor(query);
  const termWords = wordsFor(term);
  const size = termWords.length || 1;
  if (queryWords.length <= size) return [queryWords.join(" ")];

  const windows = [];
  for (let i = 0; i <= queryWords.length - size; i += 1) {
    windows.push(queryWords.slice(i, i + size).join(" "));
  }
  if (size > 1) {
    for (let i = 0; i <= queryWords.length - size - 1; i += 1) {
      windows.push(queryWords.slice(i, i + size + 1).join(" "));
    }
  }
  return windows;
};

const characterMatchScore = (character, searchValue) => {
  const q = normalizeText(searchValue);
  if (!q) return 0;
  return Math.max(...characterTerms(character).map((term) => {
    const exactScore = term === q ? 1 : term.includes(q) || q.includes(term) ? 0.92 : 0;
    const windowScore = Math.max(...phraseWindows(q, term).map((window) => similarity(term, window)));
    return Math.max(exactScore, windowScore);
  }));
};

const characterMatchMeta = (character, searchValue) => {
  const q = normalizeText(searchValue);
  if (!q) return { score: 0, index: Number.MAX_SAFE_INTEGER };

  return characterTerms(character).reduce((best, term) => {
    const exactIndex = q.indexOf(term);
    const exactScore = term === q ? 1 : exactIndex >= 0 || term.includes(q) ? 0.92 : 0;
    const exactCandidate = { score: exactScore, index: exactIndex >= 0 ? exactIndex : Number.MAX_SAFE_INTEGER };
    const windowCandidate = phraseWindows(q, term).reduce((innerBest, window) => {
      const score = similarity(term, window);
      const index = q.indexOf(window);
      if (score > innerBest.score) return { score, index: index >= 0 ? index : Number.MAX_SAFE_INTEGER };
      return innerBest;
    }, { score: 0, index: Number.MAX_SAFE_INTEGER });
    const candidate = exactCandidate.score >= windowCandidate.score ? exactCandidate : windowCandidate;
    if (candidate.score > best.score) return candidate;
    if (candidate.score === best.score && candidate.index < best.index) return candidate;
    return best;
  }, { score: 0, index: Number.MAX_SAFE_INTEGER });
};

function findCharacter(searchValue) {
  return findCharacters(searchValue)[0] ?? null;
}

function findCharacters(searchValue) {
  const q = normalizeText(searchValue);
  if (!q) return [];
  return characters
    .map((character) => ({ character, ...characterMatchMeta(character, q) }))
    .filter(({ score }) => score >= 0.72)
    .sort((a, b) => a.index - b.index || b.score - a.score || a.character.shortName.localeCompare(b.character.shortName))
    .map(({ character }) => character);
}

function findTimelineEvent(searchValue) {
  const q = normalizeText(searchValue);
  if (!q) return null;
  return events.find((e) => q.includes(normalizeText(e.title))) ?? events.find((e) => normalizeText(e.title).split(" ").some((w) => w.length > 4 && q.includes(w))) ?? null;
}

const parseUserQuery = (value) => {
  const yearMatch = String(value).match(/[12][0-9]{3}/);
  const year = yearMatch ? Number(yearMatch[0]) : null;
  const foundCharacters = findCharacters(value);
  return { character: foundCharacters[0] ?? findCharacter(value), compareCharacter: foundCharacters[1] ?? null, event: findTimelineEvent(value), year };
};

const suggestionsFor = (value) => {
  const q = normalizeText(value);
  if (!q) return characters.slice(0, 6);
  return characters
    .map((character) => ({ character, ...characterMatchMeta(character, q) }))
    .filter(({ score }) => score >= 0.45)
    .sort((a, b) => b.score - a.score || a.index - b.index || a.character.shortName.localeCompare(b.character.shortName))
    .slice(0, 6)
    .map(({ character }) => character);
};
const eventsForYear = (year, characterName, includeAll = false) => events.filter((e) => e.year === year).filter((e) => includeAll || e.tags.includes(characterName)).sort((a, b) => a.release - b.release || a.title.localeCompare(b.title));
const statusCardFor = (character, year) => {
  const exactEvents = eventsForYear(year, character.name);
  if (exactEvents.length > 0) {
    return {
      title: `${character.shortName} in ${year}`,
      status: statusFor(character, year),
    };
  }

  const pastEvent = events
    .filter((event) => event.year < year && event.tags.includes(character.name))
    .sort((a, b) => b.year - a.year || b.release - a.release)[0];

  if (pastEvent) {
    return {
      title: `Latest known for ${character.shortName}: ${pastEvent.year}`,
      status: statusFor(character, pastEvent.year),
    };
  }

  const futureEvent = events
    .filter((event) => event.year > year && event.tags.includes(character.name))
    .sort((a, b) => a.year - b.year || a.release - b.release)[0];

  if (futureEvent) {
    return {
      title: `${character.shortName} before first mapped event`,
      status: `First mapped timeline event: ${futureEvent.title} in ${futureEvent.year}.`,
    };
  }

  return {
    title: `${character.shortName} in ${year}`,
    status: statusFor(character, year),
  };
};
const nearbyEvents = (year, characterName) => events.filter((e) => Math.abs(e.year - year) <= 1 && e.tags.includes(characterName)).sort((a, b) => Math.abs(a.year - year) - Math.abs(b.year - year));
const timelineEventsFor = (character, startYear, endYear, includeAll = false) => events.filter((e) => e.year >= startYear && e.year <= endYear).filter((e) => includeAll || e.tags.includes(character.name)).sort((a, b) => a.year - b.year || a.release - b.release || a.title.localeCompare(b.title));
const uniqueYears = (items) => Array.from(new Set(items)).sort((a, b) => a - b);
const timelineScaleFor = (startYear, endYear, timelineEvents) => {
  const years = uniqueYears([startYear, ...timelineEvents.map((event) => event.year), endYear]);
  const pctForYear = (year) => {
    const clampedYear = clamp(year, startYear, endYear);
    const exactIndex = years.indexOf(clampedYear);
    if (years.length <= 1) return 0;
    if (exactIndex >= 0) return (exactIndex / (years.length - 1)) * 100;

    const nextIndex = years.findIndex((item) => item > clampedYear);
    if (nextIndex <= 0) return 0;
    const previousYear = years[nextIndex - 1];
    const nextYear = years[nextIndex];
    const segmentProgress = (clampedYear - previousYear) / (nextYear - previousYear);
    return ((nextIndex - 1 + segmentProgress) / (years.length - 1)) * 100;
  };

  const breaks = years
    .slice(1)
    .map((year, index) => ({ from: years[index], to: year }))
    .filter((gap) => gap.to - gap.from > 8)
    .map((gap) => ({ ...gap, pct: (pctForYear(gap.from) + pctForYear(gap.to)) / 2 }));

  return { years, breaks, pctForYear };
};
const markYearsFor = (scale) => {
  if (scale.years.length <= 8) return scale.years;
  const breakLandingYears = new Set(scale.breaks.map((gap) => gap.to));
  return scale.years.filter((year, index, years) => index === 0 || index === years.length - 1 || breakLandingYears.has(year) || [2012, 2016, 2018, 2023, 2026].includes(year));
};
const dotClass = (event, year, characterName) => {
  const size = event.importance === "critical" ? "h-5 w-5" : event.importance === "origin" ? "h-4 w-4" : "h-3.5 w-3.5";
  if (event.year === year && event.tags.includes(characterName)) return `${size} scale-125 border-white bg-white`;
  if (event.tags.includes(characterName)) return `${size} border-red-300 bg-red-500`;
  return `${size} border-white/25 bg-zinc-700`;
};
const relationshipKey = (a, b) => [a.name, b.name].sort().join("::");
const relationshipProfiles = {
  ["Peter Parker / Spider-Man::Tony Stark / Iron Man"]: {
    title: "Mentor, legacy, and the cost of becoming your own hero",
    summary: "Tony pulls Peter into the Avengers world, but their relationship is not just gadget support. Tony sees Peter as proof that heroism can survive beyond his own mistakes, while Peter has to learn that being Spider-Man cannot depend on Stark approval, Stark technology, or Avengers status.",
  },
  ["Steve Rogers / Captain America::Tony Stark / Iron Man"]: {
    title: "The central ideological split of the Avengers",
    summary: "Steve and Tony want the same thing: protection. The fracture is how they define responsibility. Tony moves toward control after failure and trauma; Steve chooses personal conscience over institutions. Their conflict turns the Avengers from a team into a moral argument.",
  },
  ["Thanos::Vision"]: {
    title: "The Mind Stone makes Vision a target, not just a hero",
    summary: "Vision's life is bound to the Mind Stone, so Thanos' quest turns Vision from Avenger into the final lock on the Gauntlet. Their relationship is not emotional; it is cosmic and brutal. Vision represents life created from an Infinity Stone, while Thanos reduces him to the Stone he needs.",
  },
  ["Thanos::Tony Stark / Iron Man"]: {
    title: "The nightmare Tony spends years trying to prevent",
    summary: "Thanos is the shape of Tony's fear after New York: an impossible cosmic threat coming back to Earth. Tony's control phase, Ultron mistake, and Endgame sacrifice all orbit that fear. Their relationship is hero versus consequence at universe scale.",
  },
  ["Thanos::Thor"]: {
    title: "Failure, revenge, and grief on a cosmic scale",
    summary: "Thor's conflict with Thanos is personal. Thanos destroys what remains of Asgard's people, kills Loki, and leaves Thor carrying the guilt of almost stopping him. Thor's later pain is built around that missed moment.",
  },
  ["Vision::Wanda Maximoff / Scarlet Witch"]: {
    title: "Love, grief, and identity made visible",
    summary: "Wanda and Vision are one of the MCU's clearest emotional relationships. Vision gives Wanda peace after loss, and Wanda's grief later rebuilds him as memory inside Westview. Their story asks whether love can survive when the person, the body, and the memory no longer line up.",
  },
  ["Shang-Chi::Wong"]: {
    title: "A doorway into the wider hero network",
    summary: "Shang-Chi's connection to Wong is the moment his family story becomes part of the wider superhero world. The Ten Rings signal suggests his origin is not isolated; it is connected to something older and bigger.",
  },
  ["Shang-Chi::Bruce Banner / Hulk"]: {
    title: "A first bridge from street-level origin to Avengers science",
    summary: "Shang-Chi and Banner meet through the mystery of the Ten Rings signal. Banner is not his mentor, but his presence tells the viewer that Shang-Chi's story now matters to Avengers-level science and cosmic questions.",
  },
};

const relationshipFor = (primary, secondary, year) => {
  if (!primary || !secondary) return null;
  const key = relationshipKey(primary, secondary);
  const sharedEvents = events
    .filter((event) => event.tags.includes(primary.name) && event.tags.includes(secondary.name))
    .sort((a, b) => a.year - b.year || a.release - b.release);
  const selectedYearEvents = sharedEvents.filter((event) => event.year === year);
  const profile = relationshipProfiles[key];
  const sharedText = selectedYearEvents.length > 0
    ? `In ${year}, their relationship is directly tied to ${selectedYearEvents.map((event) => event.title).join(" and ")}.`
    : sharedEvents.length > 0
      ? `Their strongest shared story stops are ${sharedEvents.slice(0, 3).map((event) => `${event.title} (${event.year})`).join(", ")}.`
      : "They do not have a strong direct on-screen relationship in the mapped timeline, so the best read is through the wider MCU network around them.";

  return {
    title: profile?.title ?? `${primary.shortName} and ${secondary.shortName}: timeline connection`,
    summary: profile?.summary ?? `${primary.shortName} and ${secondary.shortName} connect through the larger MCU timeline rather than a single defining relationship. Read them together by looking at shared factions, shared threats, and the events where their paths overlap.`,
    timelineRead: sharedText,
  };
};

const isQuestionLike = (value) => /\b(who|what|when|where|why|how|show|compare|explain|list|meaning|represent|relationship|connected|before|after|timeline|evolution)\b/i.test(value);
const isKnowledgeQuery = (value) => isQuestionLike(value) || /\b(infinity stones?|tesseract|vibranium|ten rings|shield|hydra|red room|multiverse|timeline|trauma|legacy|sacrifice|control|magic|cosmic|artifact|organization)\b/i.test(value);
const displayNameForEntity = (value) => {
  const normalized = normalizeText(value);
  const character = characters.find((item) => normalizeText(item.name) === normalized || normalizeText(item.shortName) === normalized || item.aliases?.some((alias) => normalizeText(alias) === normalized));
  return character?.shortName ?? value;
};
const profileForQuery = (value) => {
  const q = normalizeText(value);
  if (!q) return null;
  return Object.entries(characterIntelligenceProfiles)
    .map(([name, profile]) => {
      const normalizedName = normalizeText(name);
      const compactName = normalizedName.replace(/\s+/g, "");
      const compactQuery = q.replace(/\s+/g, "");
      const score = normalizedName === q || compactName === compactQuery ? 1 : q.includes(normalizedName) || normalizedName.includes(q) || compactQuery.includes(compactName) ? 0.92 : similarity(normalizedName, q);
      return { name, profile, score };
    })
    .filter((item) => item.score >= 0.72)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))[0] ?? null;
};
const timelineMatchesFor = (value) => {
  const q = normalizeText(value);
  return mcuTimelineEvents
    .filter((event) => {
      const haystack = normalizeText([event.event, event.description, ...event.entities, ...event.artifacts, ...event.organizations].join(" "));
      return q.split(" ").filter((word) => word.length > 3).some((word) => haystack.includes(word));
    })
    .slice(0, 5);
};
const systemMatchesFor = (value) => {
  const q = normalizeText(value);
  const terms = q.split(" ").filter((word) => word.length > 3);
  return Object.entries(characterIntelligenceProfiles)
    .map(([name, profile]) => ({ name, profile, haystack: normalizeText([name, profile.type, profile.model, profile.worldview, ...(profile.themes ?? []), ...(profile.systems ?? []), ...(profile.methods ?? [])].join(" ")) }))
    .filter(({ haystack }) => terms.some((term) => haystack.includes(term)))
    .slice(0, 8);
};
const heroVerseAnswerFor = (value, parsed) => {
  const q = normalizeText(value);
  if (!q) return null;

  const { character, compareCharacter, event } = parsed;
  const namedProfile = profileForQuery(value);
  if (!isKnowledgeQuery(value) && !character && !namedProfile) return null;

  if (compareCharacter && character) {
    const relationship = relationshipFor(character, compareCharacter, parsed.year ?? DEFAULT_YEAR);
    return {
      title: `${character.shortName} and ${compareCharacter.shortName}`,
      direct: relationship.title,
      breakdown: [
        { label: "Story facts", text: relationship.timelineRead },
        { label: "Analysis read", text: relationship.summary },
      ],
      insight: "HeroVerse reads relationships through shared events, motives, conflicts, and the way each character changes the other's arc.",
    };
  }

  if (q.includes("infinity stone") || q.includes("infinity stones")) {
    const stoneEvents = mcuTimelineEvents.filter((item) => item.artifacts.includes("Infinity Stones") || item.artifacts.some((artifact) => artifact.includes("Stone"))).slice(0, 4);
    return {
      title: "Infinity Stones",
      direct: "The Infinity Stones are cosmic artifacts tied to fundamental forces like space, time, mind, power, reality, and soul.",
      breakdown: stoneEvents.map((item) => ({ label: "Story fact", text: item.description })),
      insight: "Their importance is not only power. They are the MCU's way of turning creation, control, sacrifice, and cosmic order into physical objects characters can fight over.",
    };
  }

  if ((q.includes("before") || q.includes("after")) && event) {
    const ordered = events.slice().sort((a, b) => a.year - b.year || a.release - b.release);
    const index = ordered.findIndex((item) => item.id === event.id);
    const slice = q.includes("after") ? ordered.slice(index + 1, index + 5) : ordered.slice(Math.max(0, index - 4), index);
    return {
      title: q.includes("after") ? `After ${event.title}` : `Before ${event.title}`,
      direct: q.includes("after") ? `Here are the next mapped story beats after ${event.title}.` : `Here are the closest mapped story beats before ${event.title}.`,
      breakdown: slice.map((item) => ({ label: `Story ${item.year}`, text: `${item.title}: ${item.short}` })),
      insight: "This view follows in-universe story placement first, so release year and story year can differ.",
    };
  }

  if (q.includes("show all") || q.includes("list") || q.includes("heroes with") || q.includes("characters with")) {
    const matches = systemMatchesFor(value);
    if (matches.length > 0) {
      return {
        title: "Character filter",
        direct: `I found ${matches.length} mapped character${matches.length === 1 ? "" : "s"} that match this idea.`,
        breakdown: matches.map(({ name, profile }) => ({ label: displayNameForEntity(name), text: `${profile.model}. Key themes: ${profile.themes.slice(0, 3).join(", ")}.` })),
        insight: "This is an analysis filter, so it groups characters by themes and character models rather than treating the tags as literal on-screen labels.",
      };
    }
  }

  if (character) {
    const profile = characterIntelligenceFor(character.name);
    const summary = mcuCharacterTimelineSummaryFor(character.name);
    return {
      title: character.shortName,
      direct: profile ? `${character.shortName} is a ${profile.type} whose story centers on ${profile.model.toLowerCase()}.` : `${character.shortName} is mapped in the HeroVerse timeline.`,
      breakdown: [
        { label: "Identity", text: character.name },
        { label: "Environment", text: character.location },
        ...(summary ? [{ label: "Story facts", text: summary.summary }] : []),
        ...(profile ? [{ label: "Analysis read", text: profile.worldview }] : []),
      ],
      insight: profile?.themes?.length ? `Key themes: ${profile.themes.join(", ")}.` : "",
    };
  }

  if (namedProfile) {
    const { name, profile } = namedProfile;
    return {
      title: displayNameForEntity(name),
      direct: `${displayNameForEntity(name)} is a ${profile.type} whose role centers on ${profile.model.toLowerCase()}.`,
      breakdown: [
        { label: "Identity", text: name },
        { label: "Story role", text: profile.worldview },
        { label: "Abilities / methods", text: profile.methods.join(", ") },
      ],
      insight: `Key themes: ${profile.themes.join(", ")}.`,
    };
  }

  const timelineMatches = timelineMatchesFor(value);
  if (timelineMatches.length > 0) {
    return {
      title: "Timeline answer",
      direct: "Here are the strongest timeline matches I found.",
      breakdown: timelineMatches.map((item) => ({ label: item.era, text: `${item.event}: ${item.description}` })),
      insight: "These are ordered as timeline knowledge, not release-date trivia.",
    };
  }

  return {
    title: "HeroVerse answer",
    direct: "I could not find a clean mapped answer yet.",
    breakdown: [{ label: "Try", text: "Ask about a mapped character, a relationship, a theme like trauma or legacy, or a timeline event like Infinity War." }],
    insight: "",
  };
};

function runTests() {
  const spiderMan = findCharacter("spiderman");
  const question = parseUserQuery("Where was Spider-Man during Avengers?");
  const compareQuestion = parseUserQuery("Iron Man vs Captain America in 2016");
  const fuzzyQuestion = parseUserQuery("spide man vs iorn man in 2024");
  console.assert(Boolean(spiderMan), "Expected Spider-Man search to work.");
  console.assert(Boolean(findCharacter("Tony Stark")), "Expected Tony Stark search to work.");
  console.assert(Boolean(findCharacter("cap")), "Expected Cap alias search to work.");
  console.assert(Boolean(findCharacter("captin america")), "Expected fuzzy Captain America search to work.");
  console.assert(question.character?.shortName === "Spider-Man", "Expected question mode to find Spider-Man.");
  console.assert(question.event?.id === "avengers", "Expected question mode to find The Avengers.");
  console.assert(compareQuestion.character?.shortName === "Iron Man", "Expected compare query to find Iron Man first.");
  console.assert(compareQuestion.compareCharacter?.shortName === "Captain America", "Expected compare query to find Captain America second.");
  console.assert(compareQuestion.year === 2016, "Expected compare query to extract 2016.");
  console.assert(fuzzyQuestion.character?.shortName === "Spider-Man", "Expected fuzzy compare query to find Spider-Man first.");
  console.assert(fuzzyQuestion.compareCharacter?.shortName === "Iron Man", "Expected fuzzy compare query to find Iron Man second.");
  console.assert(yearPct(START_YEAR, START_YEAR) === 0, "Expected start year to map to 0%.");
  console.assert(yearPct(END_YEAR, START_YEAR) === 100, "Expected end year to map to 100%.");
  console.assert(clamp(1930, START_YEAR, END_YEAR) === START_YEAR, "Expected clamp lower bound.");
  console.assert(clamp(2030, START_YEAR, END_YEAR) === END_YEAR, "Expected clamp upper bound.");
  console.assert(statusFor(spiderMan, 2012).includes("Still a kid in Queens"), "Expected Spider-Man status in 2012.");
  console.assert(eventsForYear(2016, "Peter Parker / Spider-Man").some((e) => e.id === "civil-war"), "Expected Civil War for Spider-Man in 2016.");
  console.assert(events.find((e) => e.id === "brave-new-world")?.year === 2027, "Expected Brave New World in 2027.");
  console.assert(events.find((e) => e.id === "thunderbolts")?.year === 2027, "Expected Thunderbolts in 2027.");
  console.assert(events.every((e) => typeof e.id === "string" && typeof e.title === "string" && Number.isInteger(e.year)), "Expected valid event fields.");
  console.assert(events.every((e) => Array.isArray(e.tags) && e.tags.length > 0), "Expected every event to have tags.");
}
if (typeof console !== "undefined") runTests();

function EventBadges({ event }) {
  const yearLabel = event.timelineBasis === "projected" ? `Projected ${event.year}` : `Story ${event.year}`;
  const releaseLabel = event.accuracy === "planned" ? `Planned release ${event.release}` : `Released ${event.release}`;
  return <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-red-500/20 px-2.5 py-1 text-xs text-red-100">{yearLabel}</span><span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-zinc-300">{releaseLabel}</span><span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-zinc-300">Phase {event.phase}</span>{event.accuracy === "estimated" && <span className="rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs text-yellow-100">estimated</span>}{event.accuracy === "planned" && <span className="rounded-full bg-sky-500/15 px-2.5 py-1 text-xs text-sky-100">planned</span>}</div>;
}

function WhereaboutsCard({ intel, year }) {
  if (!intel) return null;

  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-red-500/25 px-2.5 py-1 text-xs font-semibold text-red-50">Whereabouts</span>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-zinc-200">{intel.confidence}</span>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-zinc-300">{year}</span>
      </div>
      <div className="font-semibold text-white">{intel.title}</div>
      <p className="mt-1 text-sm leading-relaxed text-zinc-200">{intel.summary}</p>
      {intel.note && <p className="mt-2 text-xs leading-relaxed text-zinc-400">{intel.note}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {intel.sources.map((source) => (
          <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-200 transition hover:bg-white/10">
            {source.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function RelationshipCard({ relationship, primary, secondary, year }) {
  if (!relationship || !primary || !secondary) return null;
  return (
    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-50">MCU read</span>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-zinc-200">{primary.shortName} vs {secondary.shortName}</span>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-zinc-300">{year}</span>
      </div>
      <div className="font-semibold text-white">{relationship.title}</div>
      <p className="mt-1 text-sm leading-relaxed text-zinc-200">{relationship.summary}</p>
      <p className="mt-2 text-xs leading-relaxed text-zinc-400">{relationship.timelineRead}</p>
    </div>
  );
}

function CharacterAnalysisCard({ entry, year, sourceName }) {
  if (!entry) return null;
  const person = entry.actor ?? entry.character;

  return (
    <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-sky-500/20 px-2.5 py-1 text-xs font-semibold text-sky-50">Analysis</span>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-zinc-200">{entry.era}</span>
        {person && <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-zinc-300">{person}</span>}
      </div>
      <div className="mt-1 font-semibold text-white">{entry.period} context</div>
      <p className="mt-1 text-sm leading-relaxed text-zinc-200">{entry.yearNotes?.[year] ?? entry.summary}</p>
      {entry.movies.length > 0 && <p className="mt-2 text-xs leading-relaxed text-zinc-400">Related story stops: {entry.movies.join(", ")}</p>}
      <p className="mt-3 text-xs leading-relaxed text-zinc-500">Context layer. This adds meaning around the timeline without changing confirmed story events.</p>
    </div>
  );
}

function SourceCredits() {
  return (
    <footer className="rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-2 text-xs text-zinc-500">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="whitespace-nowrap">Source credits</span>
        <div className="flex flex-wrap items-center gap-4">
          {sourceCredits.map((source) => (
            <a key={source.name} href={source.url} target="_blank" rel="noreferrer" aria-label={source.name} title={source.name} className="inline-flex items-center justify-center text-zinc-200 opacity-85 transition hover:opacity-100">
              {source.imageUrl ? <img src={source.imageUrl} alt="" className="h-10 w-10 rounded-full object-cover" /> : <span className={`rounded px-2 py-1 text-xs font-black tracking-tight ${source.logoClass}`}>{source.logoText}</span>}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function TimelineSourceSummary({ summary }) {
  if (!summary) return null;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-red-500/20 px-2.5 py-1 text-xs font-semibold text-red-100">Story arc</span>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-zinc-300">{summary.label}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-zinc-200">{summary.summary}</p>
      <div className="mt-3 space-y-1.5 text-xs leading-relaxed text-zinc-400">
        {summary.keyPoints.map((point) => <div key={point}>- {point}</div>)}
      </div>
    </div>
  );
}

function CharacterIntelligenceCard({ profile }) {
  if (!profile) return null;
  return (
    <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-violet-500/20 px-2.5 py-1 text-xs font-semibold text-violet-50">Intelligence</span>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-zinc-200">{profile.label}</span>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-zinc-300">{profile.type}</span>
      </div>
      <div className="font-semibold text-white">{profile.model}</div>
      <p className="mt-1 text-sm leading-relaxed text-zinc-200">{profile.worldview}</p>
      <div className="mt-3 grid gap-3 text-xs leading-relaxed text-zinc-400 md:grid-cols-2">
        <div>
          <div className="mb-1 font-semibold text-zinc-300">Core systems</div>
          {profile.systems.map((item) => <div key={item}>- {item}</div>)}
        </div>
        <div>
          <div className="mb-1 font-semibold text-zinc-300">Themes</div>
          {profile.themes.map((item) => <div key={item}>- {item}</div>)}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {profile.methods.map((method) => <span key={method} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-200">{method}</span>)}
      </div>
    </div>
  );
}

function HeroVerseAnswerCard({ answer }) {
  if (!answer) return null;
  return (
    <Card className="border border-sky-500/25 bg-sky-950/30 text-white shadow-xl">
      <CardContent className="p-5 md:p-6">
        <div className="text-sm text-sky-200/80">HeroVerse answer</div>
        <h2 className="mt-1 text-2xl font-black">{answer.title}</h2>
        <p className="mt-3 text-lg leading-relaxed text-zinc-100">{answer.direct}</p>
        <div className="mt-5 grid gap-3">
          {answer.breakdown.map((item, index) => (
            <div key={`${item.label}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-sky-200">{item.label}</div>
              <p className="mt-1 leading-relaxed text-zinc-200">{item.text}</p>
            </div>
          ))}
        </div>
        {answer.insight && <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm leading-relaxed text-red-50"><span className="font-semibold">Deeper insight: </span>{answer.insight}</div>}
      </CardContent>
    </Card>
  );
}

function MCUTimelineDashboard() {
  const [searchInput, setSearchInput] = useState("");
  const [selectedCharacterName, setSelectedCharacterName] = useState("");
  const [compareCharacterName, setCompareCharacterName] = useState("");
  const [selectedYear, setSelectedYear] = useState(DEFAULT_YEAR);
  const [isPlaying, setIsPlaying] = useState(false);
  const [includeAllEvents, setIncludeAllEvents] = useState(false);
  const [selectedCalloutId, setSelectedCalloutId] = useState("");
  const [searchError, setSearchError] = useState("");
  const [aiAnswer, setAiAnswer] = useState(null);
  const [voiceMessage, setVoiceMessage] = useState("Ask: Iron Man vs Captain America in 2016");
  const supportsVoice = typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  const selectedCharacter = characters.find((c) => c.name === selectedCharacterName) ?? null;
  const compareCharacter = characters.find((c) => c.name === compareCharacterName) ?? null;
  const timelineStartYear = selectedCharacter ? startYearFor(selectedCharacter) : START_YEAR;
  const timelineEndYear = selectedCharacter ? endYearFor(selectedCharacter) : END_YEAR;
  const selectedIdentityName = selectedCharacter ? identityNameFor(selectedCharacter) : "";
  const characterStatus = selectedCharacter ? statusFor(selectedCharacter, selectedYear) : "Search for a character to generate the timeline.";
  const characterStatusCard = selectedCharacter ? statusCardFor(selectedCharacter, selectedYear) : null;
  const compareStatus = compareCharacter ? statusFor(compareCharacter, selectedYear) : "";
  const compareRelationship = selectedCharacter && compareCharacter ? relationshipFor(selectedCharacter, compareCharacter, selectedYear) : null;
  const whereabouts = selectedCharacter ? whereaboutsFor(selectedCharacter, selectedYear) : null;
  const intelligenceProfile = selectedCharacter ? characterIntelligenceFor(selectedCharacter.name) : null;
  const spiderManAnalysis = selectedCharacter?.name === "Peter Parker / Spider-Man" ? analysisForSpiderManYear(selectedYear) : null;
  const captainAmericaAnalysis = selectedCharacter?.name === "Steve Rogers / Captain America" ? analysisForCaptainAmericaYear(selectedYear) : null;
  const ironManAnalysis = selectedCharacter?.name === "Tony Stark / Iron Man" ? analysisForIronManYear(selectedYear) : null;
  const blackWidowAnalysis = selectedCharacter?.name === "Natasha Romanoff / Black Widow" ? analysisForBlackWidowYear(selectedYear) : null;
  const hulkAnalysis = selectedCharacter?.name === "Bruce Banner / Hulk" ? analysisForHulkYear(selectedYear) : null;
  const thorAnalysis = selectedCharacter?.name === "Thor" ? analysisForThorYear(selectedYear) : null;
  const characterAnalysis = spiderManAnalysis ?? captainAmericaAnalysis ?? ironManAnalysis ?? blackWidowAnalysis ?? hulkAnalysis ?? thorAnalysis;
  const characterAnalysisSourceName = spiderManAnalysis ? spiderManAnalysisSource.sourceName : captainAmericaAnalysis ? captainAmericaAnalysisSource.sourceName : ironManAnalysis ? ironManAnalysisSource.sourceName : blackWidowAnalysis ? blackWidowAnalysisSource.sourceName : hulkAnalysis ? hulkAnalysisSource.sourceName : thorAnalysis ? thorAnalysisSource.sourceName : "";
  const timelineEvents = useMemo(() => selectedCharacter ? timelineEventsFor(selectedCharacter, timelineStartYear, timelineEndYear, includeAllEvents) : [], [selectedCharacter, timelineStartYear, timelineEndYear, includeAllEvents]);
  const suggestions = useMemo(() => normalizeText(searchInput) && !isKnowledgeQuery(searchInput) ? suggestionsFor(searchInput) : [], [searchInput]);
  const timelineScale = useMemo(() => timelineScaleFor(timelineStartYear, timelineEndYear, timelineEvents), [timelineStartYear, timelineEndYear, timelineEvents]);
  const playYears = useMemo(() => uniqueYears(timelineEvents.filter((event) => includeAllEvents || event.tags.includes(selectedCharacter?.name)).map((event) => event.year)), [timelineEvents, includeAllEvents, selectedCharacter]);
  const progress = selectedCharacter ? timelineScale.pctForYear(selectedYear) : 0;
  const callouts = useMemo(() => selectedCharacter ? eventsForYear(selectedYear, selectedCharacter.name, includeAllEvents).slice(0, MAX_CALLOUTS) : [], [selectedYear, selectedCharacter, includeAllEvents]);
  const selectedCallout = callouts.find((event) => event.id === selectedCalloutId) ?? callouts[0] ?? null;
  const timelineRailTop = callouts.length > 2 ? 430 : 272;
  const calloutConnectorStart = callouts.length > 2 ? 356 : callouts.length > 1 ? 172 : 154;
  const marks = useMemo(() => selectedCharacter ? markYearsFor(timelineScale) : [START_YEAR, 1995, 2012, 2018, 2023, END_YEAR], [selectedCharacter, timelineScale]);
  const selectedYearIndex = useMemo(() => {
    const years = timelineScale.years;
    if (years.length === 0) return 0;
    const exactIndex = years.indexOf(selectedYear);
    if (exactIndex >= 0) return exactIndex;
    return years.reduce((closestIndex, year, index) => Math.abs(year - selectedYear) < Math.abs(years[closestIndex] - selectedYear) ? index : closestIndex, 0);
  }, [selectedYear, timelineScale]);

  useEffect(() => {
    setSelectedCalloutId(callouts[0]?.id ?? "");
  }, [selectedYear, selectedCharacterName, includeAllEvents]);

  useEffect(() => {
    if (!isPlaying || !selectedCharacter) return undefined;
    const id = window.setInterval(() => setSelectedYear((y) => {
      const stops = playYears.length > 0 ? playYears : [timelineStartYear, timelineEndYear];
      const nextStop = stops.find((year) => year > y);
      if (!nextStop) {
        setIsPlaying(false);
        return stops[stops.length - 1] ?? y;
      }
      return nextStop;
    }), PLAY_SPEED_MS);
    return () => window.clearInterval(id);
  }, [isPlaying, selectedCharacter, playYears, timelineStartYear, timelineEndYear]);

  const selectCharacter = (character, targetYear) => {
    const start = startYearFor(character);
    const end = endYearFor(character);
    setSelectedCharacterName(character.name);
    setCompareCharacterName("");
    setSelectedCalloutId("");
    setSearchError("");
    setSearchInput("");
    setSelectedYear(clamp(targetYear ?? start, start, end));
    setIsPlaying(false);
  };

  const submitSearch = (value = searchInput) => {
    const parsed = parseUserQuery(value);
    const { character, compareCharacter: secondCharacter, event, year } = parsed;
    const answer = heroVerseAnswerFor(value, parsed);
    setAiAnswer(answer);
    const fallbackSuggestions = suggestionsFor(value);
    const picked = character ?? (!answer && !isKnowledgeQuery(value) ? fallbackSuggestions[0] : null);
    if (!picked && !answer) {
      setSearchError(`"${value.trim() || "That character"}" is not available yet.`);
      setVoiceMessage("Character not available yet.");
      return;
    }
    if (!picked) {
      setSearchError("");
      setVoiceMessage("Answered question.");
      return;
    }
    setSearchError("");
    const targetYear = year ?? event?.year;
    selectCharacter(picked, targetYear);
    if (secondCharacter && secondCharacter.name !== picked.name) setCompareCharacterName(secondCharacter.name);
    setVoiceMessage(secondCharacter ? `Comparing ${picked.shortName} vs ${secondCharacter.shortName}${targetYear ? ` in ${targetYear}` : ""}` : event ? `Jumped to ${event.year}: ${event.title}` : year ? `Jumped to ${year}` : `Loaded ${picked.shortName}`);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSelectedCharacterName("");
    setCompareCharacterName("");
    setSelectedCalloutId("");
    setSearchError("");
    setAiAnswer(null);
    setIsPlaying(false);
    setVoiceMessage("Search cleared");
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceMessage("Voice is not supported here. Type the question instead.");
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onstart = () => setVoiceMessage("Listening...");
    rec.onerror = () => setVoiceMessage("Voice failed. Try typing the question.");
    rec.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? "";
      setSearchInput(transcript);
      setVoiceMessage(`Heard: ${transcript}`);
      submitSearch(transcript);
    };
    rec.start();
  };

  return <div className="min-h-screen bg-zinc-950 p-4 text-white md:p-8"><div className="mx-auto max-w-[96rem] space-y-6">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className={`border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-red-950 shadow-2xl ${selectedCharacter ? "rounded-2xl p-3 md:p-4" : "rounded-[2rem] p-6 md:p-10"}`}><div className={selectedCharacter ? "grid gap-3" : "grid gap-8"}><div className={selectedCharacter ? "flex items-center justify-between gap-3" : ""}>{!selectedCharacter && <h1 className="text-3xl font-bold tracking-tight md:text-5xl lg:whitespace-nowrap">Explore MCU heroes timelines</h1>}</div><Card className={`border-white/10 text-white ${selectedCharacter ? "bg-transparent" : "bg-white/5"}`}><CardContent className={selectedCharacter ? "p-0" : "p-4 md:p-5"}><div className={`grid gap-2 ${selectedCharacter ? "grid-cols-[minmax(0,1fr)_auto_auto_auto]" : "mt-3 sm:grid-cols-[minmax(420px,1fr)_auto_auto_auto]"}`}><label className="relative min-w-0"><span className="sr-only">Character name</span><input value={searchInput} onChange={(e) => (setSearchInput(e.target.value), setSearchError(""), setAiAnswer(null))} onKeyDown={(e) => e.key === "Enter" && submitSearch()} placeholder={selectedCharacter ? "Search hero or ask: Spider-Man in 2026" : "Try: Iron Man vs Captain America in 2016"} className={`w-full rounded-2xl border border-white/10 bg-zinc-950/80 py-3 pl-4 pr-4 text-white outline-none placeholder:text-zinc-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/70 ${selectedCharacter ? "h-12" : ""}`} /></label><Button type="button" onClick={startVoiceInput} disabled={!supportsVoice} className={`rounded-2xl px-4 py-3 text-white ${supportsVoice ? "bg-white/10 hover:bg-white/20" : "cursor-not-allowed bg-white/5 text-zinc-500"}`} aria-label={supportsVoice ? "Use voice input" : "Voice input unavailable in this browser"} title={supportsVoice ? "Use voice input" : "Voice input is not available in this browser"}><Icon name="mic" className="h-5 w-5" /></Button><Button type="button" onClick={submitSearch} className="rounded-2xl bg-white px-5 py-3 text-zinc-950 hover:bg-zinc-200">Go</Button><Button type="button" onClick={clearSearch} className="rounded-2xl bg-white/10 px-4 py-3 text-white hover:bg-white/20">Clear</Button></div>{suggestions.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{suggestions.map((character) => <button key={character.name} type="button" onClick={() => selectCharacter(character)} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 transition hover:border-red-400/50 hover:bg-white/10"><CharacterAvatar character={character} size="md" /><span>{character.shortName}</span></button>)}</div>}{searchError && <div className="mt-3 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-100"><div className="font-semibold">Character not available yet</div><p className="mt-1 text-yellow-100/80">{searchError}</p></div>}</CardContent></Card></div></motion.div>
    {selectedCharacter && <div className="space-y-6">
      <Card className="overflow-hidden border-white/10 bg-zinc-900/80 text-white shadow-xl"><div className={`h-2 bg-gradient-to-r ${selectedCharacter.accent}`} /><CardContent className="p-5 md:p-8"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><div className="text-sm text-zinc-400">Now viewing</div><div className="mt-1 flex flex-wrap items-center gap-3 text-3xl font-black tracking-tight md:text-5xl"><CharacterAvatar character={selectedCharacter} size="lg" /><span>{selectedCharacter.shortName}</span>{compareCharacter && <><span className="text-zinc-500">vs</span><CharacterAvatar character={compareCharacter} size="md" /><span>{compareCharacter.shortName}</span></>}</div><div className="mt-3 flex flex-wrap gap-3 text-sm text-zinc-300"><span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1"><Icon name="clock" />{timelineStartYear} - {timelineEndYear}</span><span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1"><Icon name="pin" />{selectedCharacter.location}</span>{selectedIdentityName && <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1">{selectedIdentityName}</span>}</div></div><div className="flex flex-wrap items-center gap-2 lg:justify-end"><Button type="button" onClick={() => selectedYear >= (playYears[playYears.length - 1] ?? timelineEndYear) ? (setSelectedYear(playYears[0] ?? timelineStartYear), setIsPlaying(true)) : setIsPlaying((v) => !v)} className="rounded-xl bg-white px-3 py-2 text-sm text-zinc-950 hover:bg-zinc-200"><span className="mr-1.5 inline-flex"><Icon name={isPlaying ? "pause" : "play"} /></span>{isPlaying ? "Pause" : selectedYear >= (playYears[playYears.length - 1] ?? timelineEndYear) ? "Replay" : "Play"}</Button><Button type="button" variant="ghost" onClick={() => (setIsPlaying(false), setSelectedYear(timelineStartYear))} className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10"><span className="mr-1.5 inline-flex"><Icon name="reset" /></span>Reset</Button><Button type="button" variant="ghost" onClick={() => setIncludeAllEvents((v) => !v)} className={`rounded-xl px-3 py-2 text-sm text-white hover:bg-white/10 ${includeAllEvents ? "bg-red-600/25 ring-1 ring-red-500/60" : "bg-white/5"}`}>{includeAllEvents ? "Show Character Events" : "Show All MCU Events"}</Button>{compareCharacter && <Button type="button" variant="ghost" onClick={() => setCompareCharacterName("")} className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10">Exit compare</Button>}</div></div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500 ring-1 ring-red-200/70" />character event</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-zinc-600 ring-1 ring-white/25" />other MCU event</span>
        <span className="inline-flex items-center gap-1.5"><span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-sky-100">planned</span>future release</span>
        <span className="inline-flex items-center gap-1.5"><span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-yellow-100">estimated</span>approx timeline</span>
        <span>Story year = in-universe placement; Projected = placeholder until story year is confirmed</span>
      </div>
      <div className="mt-8">
        <div className="relative px-2 pb-12 pt-48" style={{ minHeight: `${timelineRailTop + 140}px` }}>
          {selectedCallout && <svg className="pointer-events-none absolute left-0 right-0 top-0 z-10 w-full overflow-visible" style={{ height: `${timelineRailTop}px` }} preserveAspectRatio="none" viewBox={`0 0 100 ${timelineRailTop}`}><line x1="50" y1={calloutConnectorStart} x2={timelineScale.pctForYear(selectedCallout.year)} y2={timelineRailTop} stroke="rgba(255,255,255,0.72)" strokeWidth="0.36" strokeLinecap="round" vectorEffect="non-scaling-stroke" /></svg>}
          {selectedCallout && <div className="absolute left-1/2 top-0 z-30 w-full max-w-3xl -translate-x-1/2 px-4"><motion.div key={`${selectedYear}-${callouts.length}`} initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={`grid gap-3 ${callouts.length > 1 ? "md:grid-cols-2" : "mx-auto max-w-sm"}`}>{callouts.map((event) => <button key={event.id} type="button" onClick={() => setSelectedCalloutId(event.id)} className="w-full cursor-pointer text-left transition"><div className={`h-full rounded-2xl border bg-zinc-950 p-4 shadow-2xl ${selectedCalloutId === event.id || callouts.length === 1 ? "border-red-400/60 ring-2 ring-red-500/30" : "border-white/10"}`}><EventBadges event={event} /><h3 className="mt-2 text-sm font-bold">{event.title}</h3><p className="mt-1 line-clamp-3 text-xs leading-relaxed text-zinc-400">{event.short}</p></div></button>)}</motion.div></div>}
          <div className="absolute left-2 right-2 h-2 -translate-y-1/2 rounded-full bg-white/10" style={{ top: `${timelineRailTop}px` }} />
          <div className={`absolute left-2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r ${selectedCharacter.accent}`} style={{ top: `${timelineRailTop}px`, width: `${Math.max(progress, 0)}%` }} />
          {timelineScale.breaks.map((gap) => <div key={`${gap.from}-${gap.to}`} className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-zinc-900 px-2 py-0.5 text-xs font-bold text-zinc-400" style={{ left: `${gap.pct}%`, top: `${timelineRailTop}px` }}>...</div>)}
          {timelineEvents.map((e) => <button key={e.id} type="button" onClick={() => (setIsPlaying(false), setSelectedYear(clamp(e.year, timelineStartYear, timelineEndYear)), setSelectedCalloutId(e.id))} className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border transition hover:scale-125 ${dotClass(e, selectedYear, selectedCharacter.name)}`} style={{ left: `${timelineScale.pctForYear(e.year)}%`, top: `${timelineRailTop}px` }} aria-label={`Jump to ${e.title}`} />)}
          <input aria-label="MCU timeline year" type="range" min="0" max={Math.max(timelineScale.years.length - 1, 0)} step="1" value={selectedYearIndex} onChange={(e) => (setIsPlaying(false), setSelectedYear(timelineScale.years[Number(e.target.value)] ?? selectedYear))} className="absolute left-0 right-0 z-10 h-16 w-full cursor-pointer appearance-none bg-transparent opacity-0" style={{ top: `${timelineRailTop - 32}px` }} />
          <motion.div className="pointer-events-none absolute z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-zinc-950 shadow-2xl ring-8 ring-red-500/20" style={{ top: `${timelineRailTop}px` }} animate={{ left: `${progress}%` }} transition={{ type: "spring", stiffness: 260, damping: 26 }}><CharacterAvatar character={selectedCharacter} size="lg" className="border-0 ring-0" /></motion.div>
          <div className="absolute bottom-0 left-0 right-0 text-xs text-zinc-500">{marks.map((y) => <button key={y} type="button" onClick={() => (setIsPlaying(false), setSelectedYear(clamp(y, timelineStartYear, timelineEndYear)))} className={`absolute -translate-x-1/2 rounded-full px-2 py-1 transition hover:bg-white/10 hover:text-white ${y === selectedYear ? "bg-red-500/20 font-semibold text-white ring-1 ring-red-400/60" : ""}`} style={{ left: `${timelineScale.pctForYear(y)}%` }}>{y}</button>)}</div>
        </div>
      </div><div className="mt-8 grid gap-4 border-t border-white/10 pt-6 lg:grid-cols-2"><CharacterIntelligenceCard profile={intelligenceProfile} /><RelationshipCard relationship={compareRelationship} primary={selectedCharacter} secondary={compareCharacter} year={selectedYear} /><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="mb-1 text-sm font-medium text-zinc-400">{characterStatusCard?.title}</div><p className="leading-relaxed text-zinc-100">{characterStatusCard?.status}</p></div><WhereaboutsCard intel={whereabouts} year={selectedYear} /><CharacterAnalysisCard entry={characterAnalysis} year={selectedYear} sourceName={characterAnalysisSourceName} />{compareCharacter && <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="mb-1 text-sm font-medium text-zinc-400">{compareCharacter.shortName} in {selectedYear}</div><p className="leading-relaxed text-zinc-100">{compareStatus}</p></div>}</div></CardContent></Card>
    </div>}
    {!selectedCharacter && <HeroVerseAnswerCard answer={aiAnswer} />}
    <SourceCredits />
  </div></div>;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MCUTimelineDashboard />
  </React.StrictMode>
);
