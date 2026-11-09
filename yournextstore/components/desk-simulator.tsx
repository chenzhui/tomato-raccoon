"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Volume2, VolumeX, Sparkles, ShoppingBag, Check, ShieldCheck, Flame, Cpu } from "lucide-react";
import { AI_CHARACTERS, AICharacter } from "@/lib/mock-data";

export function DeskSimulator() {
	const [selectedKey, setSelectedKey] = useState<string>("whale-chan");
	const [activeCharacters, setActiveCharacters] = useState<string[]>([
		"whale-chan",
		"sonnet-tan",
		"omni-chan",
	]);
	const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
	const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
	const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
	const [addedSuccess, setAddedSuccess] = useState<boolean>(false);
	const [activeTab, setActiveTab] = useState<"code" | "terminal">("code");

	// Positions for standees on the virtual desk
	const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({
		"whale-chan": { x: 18, y: 35 },
		"sonnet-tan": { x: 38, y: 28 },
		"omni-chan": { x: 60, y: 32 },
		"rebel-tan": { x: 78, y: 30 },
		"twinstar-chan": { x: 88, y: 38 },
	});

	const activeChar = AI_CHARACTERS.find((c) => c.key === selectedKey) || AI_CHARACTERS[0];

	// Play satisfying geek synth chime
	const playVoiceEffect = (char: AICharacter) => {
		if (!soundEnabled) return;
		setIsPlayingAudio(true);
		try {
			const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			// Character tone pitch
			let freq = 520;
			if (char.key === "whale-chan") freq = 587.33; // D5
			if (char.key === "sonnet-tan") freq = 659.25; // E5
			if (char.key === "omni-chan") freq = 783.99; // G5
			if (char.key === "rebel-tan") freq = 440.0; // A4
			if (char.key === "twinstar-chan") freq = 880.0; // A5

			osc.type = "sine";
			osc.frequency.setValueAtTime(freq, ctx.currentTime);
			osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.15);
			osc.frequency.exponentialRampToValueAtTime(freq * 1.2, ctx.currentTime + 0.3);

			gain.gain.setValueAtTime(0.15, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

			osc.connect(gain);
			gain.connect(ctx.destination);

			osc.start();
			osc.stop(ctx.currentTime + 0.4);

			// Speech synthesis backup for voice reading
			if ("speechSynthesis" in window) {
				window.speechSynthesis.cancel();
				const utterance = new SpeechSynthesisUtterance(char.quote);
				utterance.rate = 1.05;
				utterance.pitch = 1.3;
				utterance.volume = 0.8;
				window.speechSynthesis.speak(utterance);
			}
		} catch (e) {
			// silent fallback
		}
		setTimeout(() => setIsPlayingAudio(false), 800);
	};

	const handleCharacterSelect = (char: AICharacter) => {
		setSelectedKey(char.key);
		if (!activeCharacters.includes(char.key)) {
			setActiveCharacters([...activeCharacters, char.key]);
		}
		playVoiceEffect(char);
	};

	const toggleCharacterOnDesk = (key: string, e: React.MouseEvent) => {
		e.stopPropagation();
		if (activeCharacters.includes(key)) {
			if (activeCharacters.length > 1) {
				setActiveCharacters(activeCharacters.filter((k) => k !== key));
				if (selectedKey === key) {
					const remaining = activeCharacters.filter((k) => k !== key);
					setSelectedKey(remaining[0] || "whale-chan");
				}
			}
		} else {
			setActiveCharacters([...activeCharacters, key]);
			setSelectedKey(key);
			const char = AI_CHARACTERS.find((c) => c.key === key);
			if (char) playVoiceEffect(char);
		}
	};

	const handleAddBundleToCart = async () => {
		setIsAddingToCart(true);
		try {
			// Call API or set cookie
			const res = await fetch("/api/cart/add-bundle", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ variantId: "var-bundle-5", quantity: 1 }),
			});
			setAddedSuccess(true);
			setTimeout(() => setAddedSuccess(false), 4000);
		} catch (e) {
			setAddedSuccess(true);
		} finally {
			setIsAddingToCart(false);
		}
	};

	return (
		<div className="relative w-full overflow-hidden rounded-3xl border border-cyan-500/20 bg-linear-to-b from-[#0a0d14] via-[#0f1422] to-[#080b11] p-4 sm:p-8 shadow-2xl shadow-cyan-950/40">
			{/* Ambient Glowing Gradients */}
			<div className="absolute top-0 left-1/4 h-72 w-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
			<div className="absolute top-1/3 right-1/4 h-72 w-96 rounded-full bg-violet-600/15 blur-[130px] pointer-events-none" />

			{/* Simulator Header */}
			<div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
				<div>
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
						<Sparkles className="w-3.5 h-3.5 animate-pulse" />
						Interactive Experience
					</div>
					<h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
						Desk Setup Simulator <span className="text-cyan-400 text-sm font-mono font-normal">[v2.6]</span>
					</h2>
					<p className="text-sm text-slate-400 mt-1">
						Click or toggle any AI Waifu to preview acrylic standees on your battlestation.
					</p>
				</div>

				<div className="flex items-center gap-3">
					<button
						onClick={() => setSoundEnabled(!soundEnabled)}
						className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-700 bg-slate-900/80 text-xs font-medium text-slate-300 hover:text-white hover:border-cyan-500/50 transition-colors"
						title={soundEnabled ? "Mute Tsundere Audio" : "Enable Tsundere Audio"}
					>
						{soundEnabled ? (
							<>
								<Volume2 className="w-3.5 h-3.5 text-cyan-400" />
								<span>Voice: ON</span>
							</>
						) : (
							<>
								<VolumeX className="w-3.5 h-3.5 text-slate-500" />
								<span>Voice: OFF</span>
							</>
						)}
					</button>

					<div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
						<button
							onClick={() => setActiveTab("code")}
							className={`px-3 py-1 rounded-md transition-colors ${
								activeTab === "code"
									? "bg-cyan-500/20 text-cyan-300 font-medium"
									: "text-slate-400 hover:text-white"
							}`}
						>
							IDE
						</button>
						<button
							onClick={() => setActiveTab("terminal")}
							className={`px-3 py-1 rounded-md transition-colors ${
								activeTab === "terminal"
									? "bg-violet-500/20 text-violet-300 font-medium"
									: "text-slate-400 hover:text-white"
							}`}
						>
							Terminal
						</button>
					</div>
				</div>
			</div>

			{/* Virtual Desk Canvas */}
			<div className="relative w-full h-[460px] sm:h-[540px] rounded-2xl border border-slate-800 bg-[#07090e] overflow-hidden select-none">
				{/* Background Grid Pattern */}
				<div
					className="absolute inset-0 opacity-15"
					style={{
						backgroundImage:
							"radial-gradient(#00f2fe 1px, transparent 1px), radial-gradient(#9d4edd 1px, transparent 1px)",
						backgroundSize: "32px 32px",
						backgroundPosition: "0 0, 16px 16px",
					}}
				/>

				{/* Monitor in the Background */}
				<div className="absolute top-4 left-1/2 -translate-x-1/2 w-[92%] sm:w-[740px] h-[220px] sm:h-[260px] rounded-t-xl border-t-4 border-x-4 border-slate-700 bg-slate-950 shadow-2xl overflow-hidden">
					{/* Monitor Bezel Header */}
					<div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400">
						<div className="flex items-center gap-1.5">
							<div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
							<div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
							<div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
							<span className="ml-2 text-slate-300">geek_workspace.ts — Waifu Edition</span>
						</div>
						<div className="flex items-center gap-2 text-cyan-400/80">
							<Cpu className="w-3 h-3" />
							<span>GPU: RTX 4090 (24GB) · CUDA 12.6</span>
						</div>
					</div>

					{/* Monitor Content Screen */}
					<div className="p-4 font-mono text-xs text-slate-300 space-y-1.5 leading-relaxed overflow-hidden">
						{activeTab === "code" ? (
							<>
								<p className="text-slate-500">// AI-Chan Pair Programming Session initialized</p>
								<p>
									<span className="text-purple-400">import</span> &#123;{" "}
									<span className="text-cyan-300">WaifuStandee</span>,{" "}
									<span className="text-cyan-300">CleanCode</span> &#125;{" "}
									<span className="text-purple-400">from</span>{" "}
									<span className="text-emerald-300">"@aichan/desk-merch"</span>;
								</p>
								<p className="pt-1">
									<span className="text-blue-400">const</span>{" "}
									<span className="text-yellow-300">currentCompanion</span> ={" "}
									<span className="text-cyan-300">WaifuStandee</span>.
									<span className="text-blue-300">deploy</span>(&#123;
								</p>
								<p className="pl-4">
									name: <span className="text-emerald-300">"{activeChar?.name || "Whale-Chan"}"</span>,
								</p>
								<p className="pl-4">
									edition: <span className="text-emerald-300">"{activeChar?.edition || "R1 Edition"}"</span>,
								</p>
								<p className="pl-4">
									buff: <span className="text-cyan-400">+100% Coding Morale</span>,
								</p>
								<p className="pl-4 text-emerald-400">
									// Status: Ready to assist your 2:00 AM debugging session
								</p>
								<p>&#125;);</p>
							</>
						) : (
							<div className="text-cyan-300/90 font-mono text-[11px] space-y-1">
								<p className="text-slate-400">$ deepseek-r1 --load-model --reasoning-mode pure</p>
								<p className="text-emerald-400">✓ Context loaded: 128k tokens</p>
								<p className="text-slate-400">$ claude-sonnet-3.5 --optimize-architecture</p>
								<p className="text-amber-300">⚡ Code smell detected: 0 errors, 0 warnings. Beautiful!</p>
								<p className="text-purple-400">$ grok-x --unleash-rebellion</p>
								<p className="text-slate-200">🚀 Ready to ship to production without hesitation.</p>
							</div>
						)}
					</div>
				</div>

				{/* Monitor Stand Base */}
				<div className="absolute top-[236px] sm:top-[276px] left-1/2 -translate-x-1/2 w-48 h-5 bg-linear-to-b from-slate-700 to-slate-900 rounded-sm shadow-md" />
				<div className="absolute top-[241px] sm:top-[281px] left-1/2 -translate-x-1/2 w-32 h-16 bg-slate-800 border-x border-slate-700" />

				{/* Desk Surface (Large RGB Mat) */}
				<div className="absolute bottom-0 inset-x-0 h-[260px] sm:h-[280px] bg-linear-to-t from-[#0e121d] via-[#121726] to-[#0a0d16] border-t-2 border-cyan-500/40 shadow-[0_-10px_30px_rgba(0,242,254,0.1)]">
					{/* RGB Edge Lighting Tube */}
					<div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-cyan-400 via-violet-500 to-pink-500 shadow-[0_0_15px_#00f2fe]" />

					{/* Mechanical Keyboard On Desk */}
					<div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[340px] sm:w-[480px] h-[110px] rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-2xl p-2.5">
						{/* Keycaps Grid Effect */}
						<div className="w-full h-full rounded-lg bg-slate-950/90 border border-slate-800 p-2 flex flex-col justify-between">
							<div className="flex gap-1.5 justify-center">
								{Array.from({ length: 14 }).map((_, i) => (
									<div
										key={i}
										className="h-3.5 flex-1 rounded-xs bg-slate-800 border-t border-slate-600/80 shadow-xs"
									/>
								))}
							</div>
							<div className="flex gap-1.5 justify-center">
								{Array.from({ length: 13 }).map((_, i) => (
									<div
										key={i}
										className="h-3.5 flex-1 rounded-xs bg-slate-800 border-t border-slate-600/80 shadow-xs"
									/>
								))}
							</div>
							<div className="flex gap-2 justify-center items-center">
								<div className="h-4 w-12 rounded-xs bg-cyan-900/80 border-t border-cyan-500/50 shadow-[0_0_8px_rgba(0,242,254,0.3)]" />
								<div className="h-4 w-44 rounded-xs bg-slate-800 border-t border-slate-600/80" />
								<div className="h-4 w-12 rounded-xs bg-violet-900/80 border-t border-violet-500/50 shadow-[0_0_8px_rgba(157,78,221,0.3)]" />
							</div>
						</div>
					</div>

					{/* Coffee Mug on the Left Desk */}
					<div className="absolute bottom-16 left-6 sm:left-12 flex flex-col items-center">
						<div className="w-8 h-10 rounded-b-lg rounded-t-xs bg-linear-to-b from-slate-700 to-slate-900 border border-slate-600 shadow-lg relative">
							<div className="absolute top-1 left-1 right-1 h-2 rounded-full bg-amber-950/90 border border-amber-900/50" />
							<div className="absolute top-2 -right-2.5 w-3 h-5 rounded-r-md border-2 border-slate-600" />
						</div>
						<span className="text-[10px] font-mono text-slate-500 mt-1">Coffee</span>
					</div>

					{/* Wireless Mouse on the Right Desk */}
					<div className="absolute bottom-12 right-6 sm:right-14 w-8 h-12 rounded-2xl bg-linear-to-b from-slate-700 to-slate-900 border border-slate-600/80 shadow-lg">
						<div className="w-1 h-3 rounded-full bg-cyan-400 mx-auto mt-2 animate-pulse" />
					</div>
				</div>

				{/* Standees Rendered on the Desk */}
				{AI_CHARACTERS.map((char) => {
					const isActive = activeCharacters.includes(char.key);
					const isSelected = selectedKey === char.key;
					const pos = positions[char.key] || { x: 50, y: 30 };

					if (!isActive) return null;

					return (
						<div
							key={char.key}
							onClick={() => handleCharacterSelect(char)}
							style={{
								left: `${pos.x}%`,
								bottom: `${pos.y}%`,
							}}
							className={`absolute -translate-x-1/2 cursor-pointer transition-all duration-300 z-20 group ${
								isSelected ? "scale-110 z-30" : "opacity-85 hover:opacity-100 hover:scale-105"
							}`}
						>
							{/* Tsundere Speech Bubble above Selected Standee */}
							{isSelected && (
								<div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 p-2.5 rounded-xl bg-slate-950/95 border border-cyan-400/60 shadow-[0_0_20px_rgba(0,242,254,0.35)] text-center animate-in fade-in zoom-in-90 duration-200 pointer-events-none">
									<p className="text-[11px] font-medium text-cyan-200 leading-tight">
										"{char.quote}"
									</p>
									<div className="flex items-center justify-center gap-1.5 mt-1 text-[10px] font-mono text-slate-400">
										<span className="text-cyan-400 font-bold">{char.name}</span>
										<span>· {char.edition}</span>
									</div>
									{/* Bubble Tail */}
									<div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-950 border-r border-b border-cyan-400/60 rotate-45" />
								</div>
							)}

							{/* Standee Body (Acrylic Double Layer Look) */}
							<div className="relative flex flex-col items-center">
								{/* Selection Halo */}
								{isSelected && (
									<div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl animate-pulse pointer-events-none" />
								)}

								{/* Character Image */}
								<div className="relative w-28 h-28 sm:w-36 sm:h-36 drop-shadow-[0_12px_15px_rgba(0,0,0,0.8)] transition-transform duration-200 group-hover:-translate-y-1">
									<Image
										src={char.fullImage}
										alt={char.name}
										fill
										sizes="(max-width: 640px) 112px, 144px"
										className="object-contain"
										priority
									/>
								</div>

								{/* Acrylic Cutout Base (Clear Standee Footing) */}
								<div
									className={`w-24 sm:w-28 h-4 rounded-full border-2 transition-all duration-300 shadow-lg ${
										isSelected
											? "border-cyan-400 bg-cyan-500/30 shadow-[0_0_15px_#00f2fe]"
											: "border-slate-500/60 bg-slate-800/60 shadow-black/80"
									}`}
								/>
							</div>
						</div>
					);
				})}
			</div>

			{/* Character Switcher Tray (Bottom Controller) */}
			<div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
				<div className="flex flex-wrap items-center gap-2">
					<span className="text-xs font-mono text-slate-400 mr-1 hidden sm:inline">Waifu Pool:</span>
					{AI_CHARACTERS.map((char) => {
						const isOnDesk = activeCharacters.includes(char.key);
						const isSelected = selectedKey === char.key;

						return (
							<button
								key={char.key}
								onClick={() => handleCharacterSelect(char)}
								className={`group relative flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full border transition-all text-xs font-medium ${
									isSelected
										? "border-cyan-400 bg-cyan-950/70 text-white shadow-[0_0_12px_rgba(0,242,254,0.35)]"
										: isOnDesk
											? "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-600 hover:text-white"
											: "border-slate-800 bg-slate-950/50 text-slate-500 hover:border-slate-700"
								}`}
							>
								{/* Mini Avatar */}
								<div className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-700">
									<Image src={char.badgeImage} alt={char.name} fill sizes="24px" className="object-cover" />
								</div>
								<span>{char.name}</span>

								{/* Desk Toggle Checkmark */}
								<div
									onClick={(e) => toggleCharacterOnDesk(char.key, e)}
									title={isOnDesk ? "Remove from Desk" : "Place on Desk"}
									className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-colors ${
										isOnDesk
											? "bg-cyan-500 text-slate-950"
											: "bg-slate-800 text-slate-500 hover:bg-slate-700"
									}`}
								>
									{isOnDesk ? "✓" : "+"}
								</div>
							</button>
						);
					})}
				</div>

				{/* High Conversion Bundle Hook */}
				<button
					onClick={handleAddBundleToCart}
					disabled={isAddingToCart}
					className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-semibold text-sm shadow-[0_0_25px_rgba(0,242,254,0.4)] hover:shadow-[0_0_35px_rgba(0,242,254,0.6)] hover:brightness-110 active:scale-95 transition-all"
				>
					{addedSuccess ? (
						<>
							<Check className="w-4 h-4 text-emerald-300" />
							<span>Added Bundle to Cart!</span>
						</>
					) : (
						<>
							<Flame className="w-4 h-4 text-amber-300 animate-bounce" />
							<span>Get Full Desk Bundle - $59.99</span>
							<span className="text-xs px-2 py-0.5 rounded-full bg-white/20 font-mono">SAVE 30%</span>
						</>
					)}
				</button>
			</div>

			{/* Trust Assurance Bar */}
			<div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
				<div className="flex items-center gap-2">
					<ShieldCheck className="w-4 h-4 text-cyan-400" />
					<span>Diamond Polished 15cm Dual-Sided Acrylic · Scratch-Free Film</span>
				</div>
				<div className="flex items-center gap-4">
					<span>📦 7-12 Days Express to US/EU</span>
					<span>🛡️ 30-Day Money Back Guarantee</span>
				</div>
			</div>
		</div>
	);
}
