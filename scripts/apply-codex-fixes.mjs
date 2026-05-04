import { readFileSync, writeFileSync } from "node:fs";

const filePath = "src/main.jsx";
let source = readFileSync(filePath, "utf8");

source = source.replace(
  `  const timelineRailTop = callouts.length > 2 ? 430 : 272;
  const calloutConnectorStart = callouts.length > 2 ? 356 : callouts.length > 1 ? 172 : 154;`,
  `  const timelineRailTop = 72;
  const timelineRailHeight = 168;`
);

source = source.replace(
  /<CardContent className=\{selectedCharacter \? "p-0" : "p-4 md:p-5"\}><div className=\{`grid gap-2 \$\{selectedCharacter \? "grid-cols-\[minmax\(0,1fr\)_auto_auto_auto\]" : "mt-3 sm:grid-cols-\[minmax\(420px,1fr\)_auto_auto_auto\]"\}`\}><label className="relative min-w-0"><span className="sr-only">Character name<\/span><input value=\{searchInput\} onChange=\{\(e\) => \(setSearchInput\(e\.target\.value\), setSearchError\(""\), setAiAnswer\(null\)\)\} onKeyDown=\{\(e\) => e\.key === "Enter" && submitSearch\(\)\} placeholder=\{selectedCharacter \? "Search hero or ask: Spider-Man in 2026" : "Try: Iron Man vs Captain America in 2016"\} className=\{`w-full rounded-2xl border border-white\/10 bg-zinc-950\/80 py-3 pl-4 pr-4 text-white outline-none placeholder:text-zinc-500 focus:border-red-500 focus:ring-2 focus:ring-red-500\/70 \$\{selectedCharacter \? "h-12" : ""\}`\} \/><\/label><Button type="button" onClick=\{startVoiceInput\} disabled=\{!supportsVoice\} className=\{`rounded-2xl px-4 py-3 text-white \$\{supportsVoice \? "bg-white\/10 hover:bg-white\/20" : "cursor-not-allowed bg-white\/5 text-zinc-500"\}`\} aria-label=\{supportsVoice \? "Use voice input" : "Voice input unavailable in this browser"\} title=\{supportsVoice \? "Use voice input" : "Voice input is not available in this browser"\}><Icon name="mic" className="h-5 w-5" \/><\/Button><Button type="button" onClick=\{\(\) => submitSearch\(\)\} className="rounded-2xl bg-white px-5 py-3 text-zinc-950 hover:bg-zinc-200">Go<\/Button><Button type="button" onClick=\{clearSearch\} className="rounded-2xl bg-white\/10 px-4 py-3 text-white hover:bg-white\/20">Clear<\/Button><\/div>/,
  `<CardContent className={selectedCharacter ? "p-0" : "p-3 md:p-4"}><div className={\`grid gap-2 \${selectedCharacter ? "grid-cols-[minmax(0,1fr)_auto_auto_auto]" : "mt-2 grid-cols-[minmax(0,1fr)_3rem_3.75rem_4.5rem]"}\`}><label className="relative min-w-0"><span className="sr-only">Character name</span><input value={searchInput} onChange={(e) => (setSearchInput(e.target.value), setSearchError(""), setAiAnswer(null))} onKeyDown={(e) => e.key === "Enter" && submitSearch()} placeholder={selectedCharacter ? "Search hero or ask: Spider-Man in 2026" : "Try: Iron Man vs Captain America in 2016"} className="h-12 w-full rounded-2xl border border-white/10 bg-zinc-950/80 py-3 pl-4 pr-4 text-white outline-none placeholder:text-zinc-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/70" /></label><Button type="button" onClick={startVoiceInput} disabled={!supportsVoice} className={\`h-12 rounded-2xl px-0 text-white \${supportsVoice ? "bg-white/10 hover:bg-white/20" : "cursor-not-allowed bg-white/5 text-zinc-500"}\`} aria-label={supportsVoice ? "Use voice input" : "Voice input unavailable in this browser"} title={supportsVoice ? "Use voice input" : "Voice input is not available in this browser"}><Icon name="mic" className="h-5 w-5" /></Button><Button type="button" onClick={() => submitSearch()} className="h-12 rounded-2xl bg-white px-3 text-zinc-950 hover:bg-zinc-200">Go</Button><Button type="button" onClick={clearSearch} className="h-12 rounded-2xl bg-white/10 px-3 text-white hover:bg-white/20">Clear</Button></div>`
);

const timelineSection = `      <div className="mt-6 space-y-6">
        <div className="relative px-2 pb-12" style={{ minHeight: \`\${timelineRailHeight}px\` }}>
          <div className="absolute left-2 right-2 h-2 -translate-y-1/2 rounded-full bg-white/10" style={{ top: \`\${timelineRailTop}px\` }} />
          <div className={\`absolute left-2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r \${selectedCharacter.accent}\`} style={{ top: \`\${timelineRailTop}px\`, width: \`\${Math.max(progress, 0)}%\` }} />
          {timelineScale.breaks.map((gap) => <div key={\`\${gap.from}-\${gap.to}\`} className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-zinc-900 px-2 py-0.5 text-xs font-bold text-zinc-400" style={{ left: \`\${gap.pct}%\`, top: \`\${timelineRailTop}px\` }}>...</div>)}
          {timelineEvents.map((e) => <button key={e.id} type="button" onClick={() => (setIsPlaying(false), setSelectedYear(clamp(e.year, timelineStartYear, timelineEndYear)), setSelectedCalloutId(e.id))} className={\`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border transition hover:scale-125 \${dotClass(e, selectedYear, selectedCharacter.name)}\`} style={{ left: \`\${timelineScale.pctForYear(e.year)}%\`, top: \`\${timelineRailTop}px\` }} aria-label={\`Jump to \${e.title}\`} />)}
          <input aria-label="MCU timeline year" type="range" min="0" max={Math.max(timelineScale.years.length - 1, 0)} step="1" value={selectedYearIndex} onChange={(e) => (setIsPlaying(false), setSelectedYear(timelineScale.years[Number(e.target.value)] ?? selectedYear))} className="absolute left-0 right-0 z-10 h-16 w-full cursor-pointer appearance-none bg-transparent opacity-0" style={{ top: \`\${timelineRailTop - 32}px\` }} />
          <motion.div className="pointer-events-none absolute z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-zinc-950 shadow-2xl ring-8 ring-red-500/20" style={{ top: \`\${timelineRailTop}px\` }} animate={{ left: \`\${progress}%\` }} transition={{ type: "spring", stiffness: 260, damping: 26 }}><CharacterAvatar character={selectedCharacter} size="lg" className="border-0 ring-0" /></motion.div>
          <div className="absolute bottom-0 left-0 right-0 text-xs text-zinc-500">{marks.map((y) => <button key={y} type="button" onClick={() => (setIsPlaying(false), setSelectedYear(clamp(y, timelineStartYear, timelineEndYear)))} className={\`absolute -translate-x-1/2 rounded-full px-2 py-1 transition hover:bg-white/10 hover:text-white \${y === selectedYear ? "bg-red-500/20 font-semibold text-white ring-1 ring-red-400/60" : ""}\`} style={{ left: \`\${timelineScale.pctForYear(y)}%\` }}>{y}</button>)}</div>
        </div>
        {selectedCallout && <motion.div key={\`\${selectedYear}-\${callouts.length}\`} initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={\`mx-auto grid w-full max-w-3xl gap-3 \${callouts.length > 1 ? "md:grid-cols-2" : "max-w-sm"}\`}>{callouts.map((event) => <button key={event.id} type="button" onClick={() => setSelectedCalloutId(event.id)} className="w-full cursor-pointer text-left transition"><div className={\`h-full rounded-2xl border bg-zinc-950 p-4 shadow-2xl \${selectedCalloutId === event.id || callouts.length === 1 ? "border-red-400/60 ring-2 ring-red-500/30" : "border-white/10"}\`}><EventBadges event={event} /><h3 className="mt-2 text-sm font-bold">{event.title}</h3><p className="mt-1 line-clamp-3 text-xs leading-relaxed text-zinc-400">{event.short}</p></div></button>)}</motion.div>}
      </div><div className="mt-8 grid gap-4`;

source = source.replace(
  /      <div className="mt-8">[\s\S]*?      <\/div><div className="mt-8 grid gap-4/,
  timelineSection
);

source = source.replace(
  /      <div className="mt-8 space-y-8">[\s\S]*?      <\/div><div className="mt-8 grid gap-4/,
  timelineSection
);

writeFileSync(filePath, source);
