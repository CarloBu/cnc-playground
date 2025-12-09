import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initHoverReveal } from './militaryRevealHover.js';

gsap.registerPlugin(ScrollTrigger);

const GRID_COLS = 12;
const GRID_ROWS = 10;

const cardContainer = document.querySelector('.card-container');

if (cardContainer) {
	const gridOverlay = cardContainer.querySelector('.grid-overlay');
	const endImageSrc = gridOverlay?.dataset.endImage;
	
	if (gridOverlay && endImageSrc) {
		// Create grid cells
		const cells = [];
		
		for (let row = 0; row < GRID_ROWS; row++) {
			for (let col = 0; col < GRID_COLS; col++) {
				const cell = document.createElement('div');
				cell.className = 'grid-cell';
				
				// Calculate background position for this cell
				const bgPosX = (col / (GRID_COLS - 1)) * 100;
				const bgPosY = (row / (GRID_ROWS - 1)) * 100;
				
				cell.style.backgroundImage = `url(${endImageSrc})`;
				cell.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
				
				gridOverlay.appendChild(cell);
				cells.push(cell);
			}
		}
		
		// Shuffle cells for random reveal order
		const shuffledCells = [...cells].sort(() => Math.random() - 0.5);
		
		// Set initial state
		gsap.set(shuffledCells, { 
			opacity: 0,
			filter: 'brightness(1)'
		});
		
		// Create individual flash+reveal timeline for each cell
		function createCellReveal(cell) {
			const tl = gsap.timeline({
				onComplete: () => cell.dataset.revealed = 'true',
				onReverseComplete: () => cell.dataset.revealed = 'false'
			});
			
			tl
				// First flash - bright
				.to(cell, {
					opacity: 1,
					filter: 'brightness(1.4)',
					duration: 0.1,
					ease: 'power2.in'
				})
				// Hide after first flash
				.to(cell, {
					opacity: 0,
					duration: 0.025,
					ease: 'none'
				}, '+=0.02')
				// Final reveal
				.to(cell, {
					opacity: 1,
					filter: 'brightness(1)',
					duration: 0.5,
					ease: 'power1.out'
				}, '+=0.05');
			
			return tl;
		}
		
		// Create the main timeline with ScrollTrigger
		const revealTl = gsap.timeline({
			scrollTrigger: {
				trigger: cardContainer,
				start: 'top 20%',
				toggleActions: 'play none none reverse',
				markers: true
			}
		});
		
		// Add each cell's flash sequence with stagger
		shuffledCells.forEach((cell, i) => {
			revealTl.add(createCellReveal(cell), i * 0.006);
		});
		
		// Initialize hover effect (only works on revealed cells)
		initHoverReveal(gridOverlay);
	}
}