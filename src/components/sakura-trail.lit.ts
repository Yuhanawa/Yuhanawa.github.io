import { css, html, LitElement, type PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { createNoise3D } from "simplex-noise";

const noise3D = createNoise3D();

const COLORS = [
	["#FFC0CB", "#FFB7C5"], // 浅粉  light pink
	["#FFB7C5", "#FF69B4"], // 亮粉  bright pink
	["#FFE4E1", "#FFC0CB"], // 雾玫瑰  pastel pink
	["#ffffff", "#FFC0CB"], // 白透粉  white transparency pink
];

export class Petal {
	x: number;
	y: number;
	size: number;

	// speed
	vx: number;
	vy: number;

	// rotation and flip
	rotation: number; // Z-axis rotation (2D)
	rotationSpeed: number;
	flip: number; // X/Y-axis flip (fake 3D)
	flipSpeed: number;

	colorStops: string[];
	opacity: number;
	life: number;
	maxLife: number;

	constructor(
		x: number,
		y: number,
		baseConfig?: {
			size?: number;
			opacity?: number;
			maxLife?: number;
		},
	) {
		baseConfig = {
			size: 10,
			opacity: 1,
			maxLife: 200,
			...baseConfig,
		};

		this.x = x;
		this.y = y;
		this.size = Math.random() * 8 + baseConfig.size!; // 10-18px

		// initial speed
		this.vx = (Math.random() - 0.5) * 2;
		this.vy = Math.random() * 1 + 1;

		this.rotation = Math.random() * Math.PI * 2;
		this.rotationSpeed = (Math.random() - 0.5) * 0.02;

		// 0~PI
		this.flip = Math.random() * Math.PI;
		this.flipSpeed = Math.random() * 0.03;

		this.colorStops = COLORS[Math.floor(Math.random() * COLORS.length)];

		this.opacity = baseConfig.opacity!;
		this.life = 0;
		this.maxLife = baseConfig.maxLife! + Math.random() * 100; // live frames
	}

	update(time: number) {
		this.life++;

		// 1. Calculate the noise value based on position and time
		// These magic numbers (0.005, 0.0002) control the "frequency" of the wind field,
		// and the smaller the value, the more gradual the change
		const noiseVal = noise3D(this.x * 0.005, this.y * 0.005, time * 0.0002);

		// 2. Apply the noise value to the velocity (simulate wind blowing)
		// We let the noise value mainly affect the horizontal movement and rotation
		this.vx += noiseVal * 0.05;
		this.vy += 0.01; // Accelerate the vertical movement

		// 3. Limit the maximum velocity (air resistance)
		this.vx *= 0.98;
		this.vy = Math.min(this.vy, 2.5); // Maximum terminal velocity

		// 4. Update the position
		this.x += this.vx;
		this.y += this.vy;

		// 5. Update the rotation
		this.rotation += this.rotationSpeed + noiseVal * 0.01;
		this.flip += this.flipSpeed;

		// 6. Calculate the opacity (fade out)
		if (this.life > this.maxLife - 50) {
			this.opacity = (this.maxLife - this.life) / 50;
		}
	}

	draw(ctx: CanvasRenderingContext2D) {
		if (this.opacity <= 0) return;

		ctx.save();
		ctx.translate(this.x, this.y);

		// --- Simulate 3D effect ---
		// Scale the Y-axis to simulate the petal flipping in the air
		// Math.sin(this.flip) will change between -1 and 1, creating a "flip" effect
		const flipScale = Math.cos(this.flip);
		ctx.rotate(this.rotation);
		ctx.scale(1, flipScale);

		// Set the gradient color
		const gradient = ctx.createLinearGradient(
			-this.size,
			-this.size,
			this.size,
			this.size,
		);
		gradient.addColorStop(0, this.colorStops[0]);
		gradient.addColorStop(1, this.colorStops[1]);
		ctx.fillStyle = gradient;
		ctx.globalAlpha = this.opacity;

		// --- Draw the real petal shape ---
		// Draw the petal shape based on Bezier curves
		ctx.beginPath();
		// Scale the shape
		const w = this.size;
		const h = this.size;

		// Draw the left half
		ctx.moveTo(0, h * 0.8); // Bottom tip

		ctx.bezierCurveTo(
			-w * 0.8,
			h * 0.3, // Control point 1
			-w * 1.0,
			-h * 0.8, // Control point 2
			0,
			-h * 0.3, // Middle gap
		);

		// Draw the right half
		ctx.bezierCurveTo(
			w * 1.0,
			-h * 0.8, // Control point 2
			w * 0.8,
			h * 0.3, // Control point 1
			0,
			h * 0.8, // Back to the bottom
		);

		ctx.fill();
		ctx.restore();
	}

	isDead(): boolean {
		return this.life >= this.maxLife || this.opacity <= 0;
	}
}

@customElement("sakura-trail")
export class SakuraTrail extends LitElement {
	@query("canvas") private canvas!: HTMLCanvasElement;

	@property({ type: Number }) maxPetalCount: number = 300;
	@property({ type: Number }) maxPetalCountOnceDraw: number = 5;
	@property({ type: Object }) baseConfig?: {
		size?: number;
		opacity?: number;
		maxLife?: number;
	} = undefined;

	private ctx: CanvasRenderingContext2D | null = null;
	private particles: Petal[] = [];
	private animationId: number = 0;

	private mouseX: number = -100;
	private mouseY: number = -100;
	private lastMouseX: number = -100;
	private lastMouseY: number = -100;

	static styles = css`
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9999;
    }
    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  `;

	protected firstUpdated(_changedProperties: PropertyValues) {
		super.firstUpdated(_changedProperties);
		this.initCanvas();
		window.addEventListener("resize", this.resizeCanvas);
		window.addEventListener("mousemove", this.handleMouseMove);
		this.animationId = requestAnimationFrame(this.drawAnimate);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener("resize", this.resizeCanvas);
		window.removeEventListener("mousemove", this.handleMouseMove);
		cancelAnimationFrame(this.animationId);
	}

	private initCanvas() {
		this.ctx = this.canvas.getContext("2d", { alpha: true });
		this.resizeCanvas();
	}

	// Handle high pixel density (Retina Display) by scaling the canvas
	// This prevents the flower trail from becoming blurry
	private resizeCanvas = () => {
		if (!this.canvas) return;
		const dpr = window.devicePixelRatio || 1;
		const rect = this.getBoundingClientRect();

		this.canvas.width = rect.width * dpr;
		this.canvas.height = rect.height * dpr;

		// Scale the context so that we can still use logical pixels in the code
		this.ctx?.scale(dpr, dpr);
	};

	private handleMouseMove = (e: MouseEvent) => {
		this.mouseX = e.clientX;
		this.mouseY = e.clientY;
	};

	private drawAnimate = (time: number) => {
		if (!this.ctx || !this.canvas) return;

		const dist = Math.hypot(
			this.mouseX - this.lastMouseX,
			this.mouseY - this.lastMouseY,
		);

		if (dist > 2) {
			const count = Math.min(
				Math.floor(dist / this.maxPetalCountOnceDraw),
				this.maxPetalCountOnceDraw,
			);
			for (let i = 0; i < count; i++) {
				// Interpolate along the mouse path to prevent discontinuity
				const progress = Math.random();
				const x = this.lastMouseX + (this.mouseX - this.lastMouseX) * progress;
				const y = this.lastMouseY + (this.mouseY - this.lastMouseY) * progress;

				this.particles.push(
					new Petal(
						x + (Math.random() - 0.5) * 20,
						y + (Math.random() - 0.5) * 20,
						this.baseConfig,
					),
				);
			}
		}

		this.lastMouseX = this.mouseX;
		this.lastMouseY = this.mouseY;

		// clear
		const dpr = window.devicePixelRatio || 1;
		this.ctx.clearRect(0, 0, this.canvas.width / dpr, this.canvas.height / dpr);

		// update and draw
		for (let i = this.particles.length - 1; i >= 0; i--) {
			const p = this.particles[i];
			p.update(time);
			p.draw(this.ctx);

			if (p.isDead()) {
				this.particles.splice(i, 1);
			}
		}

		// limit
		if (this.particles.length > this.maxPetalCount) {
			this.particles.shift();
		}

		this.animationId = requestAnimationFrame(this.drawAnimate);
	};

	render() {
		return html`<canvas></canvas>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"sakura-trail": SakuraTrail;
	}
}
