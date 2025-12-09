import gsap from 'gsap';

export function initHoverReveal(gridOverlay) {
	if (!gridOverlay) return;
	
	const cells = gridOverlay.querySelectorAll('.grid-cell');
	
	cells.forEach(cell => {
		let hoverTl = null;
		
		// Create flash effect timeline for this cell (shows start image briefly)
		function createFlashEffect() {
			const tl = gsap.timeline({ paused: true });
			
			tl
				// First flash - bright then hide to show start image
				.to(cell, {
					filter: 'brightness(1.4)',
					duration: 0.1,
					ease: 'power2.in'
				})
				// Hide cell to reveal start image
				.to(cell, {
					opacity: 0,
					filter: 'brightness(1)',
					duration: 0.025,
					ease: 'none'
				}, '+=0.02')
				// Flash back with end image
				.to(cell, {
					opacity: 1,
					filter: 'brightness(1.4)',
					duration: 0.04,
					ease: 'power2.in'
				}, '+=0.05')
				// Settle to normal
				.to(cell, {
					filter: 'brightness(1)',
					duration: 0.5,
					ease: 'power1.out'
				}, '+=0.02');
			
			return tl;
		}
		
		cell.addEventListener('mouseenter', () => {
			// Only work on revealed cells
			if (cell.dataset.revealed !== 'true') return;
			
			// Kill existing timeline and reset
			if (hoverTl) {
				hoverTl.kill();
				gsap.set(cell, { opacity: 1, filter: 'brightness(1)' });
			}
			
			// Create and play flash effect
			hoverTl = createFlashEffect();
			hoverTl.play();
		});
	});
}

